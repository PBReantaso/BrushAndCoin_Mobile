import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/messaging_provider.dart';

class ChatScreen extends StatefulWidget {
  final Map<String, dynamic> user;

  const ChatScreen({super.key, required this.user});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  int _selectedNavIndex = 2; // Messages tab is selected

  @override
  void initState() {
    super.initState();
    // Scroll to bottom when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // mark conversation read
      final key = widget.user['userName'] as String;
      context.read<MessagingProvider>().markAllRead(key);
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  void _onLongPressMessage(Map<String, dynamic> message) async {
    final key = widget.user['userName'] as String;
    final messagingProvider = context.read<MessagingProvider>();
    final isMine = message['isMe'] == true;

    if (!isMine) return; // Only allow editing/deleting own messages

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('Edit'),
                onTap: () async {
                  Navigator.pop(context);
                  final controller =
                      TextEditingController(text: message['text'] as String);
                  final result = await showDialog<String>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Edit message'),
                      content: TextField(
                        controller: controller,
                        autofocus: true,
                        maxLines: null,
                      ),
                      actions: [
                        TextButton(
                            onPressed: () => Navigator.pop(ctx),
                            child: const Text('Cancel')),
                        TextButton(
                            onPressed: () =>
                                Navigator.pop(ctx, controller.text.trim()),
                            child: const Text('Save')),
                      ],
                    ),
                  );
                  if (result != null && result.isNotEmpty) {
                    messagingProvider.editMessage(
                        key: key,
                        messageId: message['id'] as int,
                        newText: result);
                    setState(() {});
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete, color: Colors.red),
                title:
                    const Text('Delete', style: TextStyle(color: Colors.red)),
                onTap: () async {
                  Navigator.pop(context);
                  messagingProvider.deleteMessage(
                      key: key, messageId: message['id'] as int);
                  setState(() {});
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isNotEmpty) {
      final key = widget.user['userName'] as String;
      context
          .read<MessagingProvider>()
          .sendMessage(key: key, text: text, isMe: true);
      _messageController.clear();
      _scrollToBottom();
      setState(() {}); // trigger rebuild to show new message
    }
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 0) {
      return '${difference.inDays}d';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m';
    } else {
      return 'now';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header with back button, profile picture, and username
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(
                  bottom: BorderSide(
                    color: Color(0xFFE0E0E0),
                    width: 1,
                  ),
                ),
              ),
              child: Row(
                children: [
                  // Back button
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).pop();
                    },
                    child: const Icon(
                      Icons.arrow_back,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),

                  const SizedBox(width: 16),

                  // Profile picture
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Color(0xFFF5F5F5),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person,
                      color: Color(0xFF9E9E9E),
                      size: 20,
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Username
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.user['userName'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                        Text(
                          '@${widget.user['userName'].toLowerCase().replaceAll(' ', '')}',
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // More options
                  IconButton(
                    onPressed: () {
                      _showChatOptions();
                    },
                    icon: const Icon(
                      Icons.more_vert,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Messages area
            Expanded(
              child: Consumer<MessagingProvider>(
                builder: (context, messagingProvider, _) {
                  final key = widget.user['userName'] as String;
                  final messages = messagingProvider.getConversation(key);
                  return ListView.builder(
                    controller: _scrollController,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final message = messages[index];
                      return _buildMessageBubble(message);
                    },
                  );
                },
              ),
            ),

            // Message input area
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(
                  top: BorderSide(
                    color: Color(0xFFE0E0E0),
                    width: 1,
                  ),
                ),
              ),
              child: Row(
                children: [
                  // Message input field
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F5F5),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(0xFFE0E0E0),
                          width: 1,
                        ),
                      ),
                      child: TextField(
                        controller: _messageController,
                        decoration: const InputDecoration(
                          hintText: 'Message...',
                          hintStyle: TextStyle(
                            color: Color(0xFF9E9E9E),
                            fontSize: 16,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        maxLines: null,
                        textInputAction: TextInputAction.newline,
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Send button
                  GestureDetector(
                    onTap: _sendMessage,
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(
                        color: Color.fromARGB(255, 255, 60, 60),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.send,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFF5F5F5),
          border: Border(
            top: BorderSide(
              color: Color(0xFFE0E0E0),
              width: 1,
            ),
          ),
        ),
        child: SafeArea(
          child: Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(Icons.home, 0,
                    isSelected: _selectedNavIndex == 0),
                _buildNavItem(Icons.map, 1, isSelected: _selectedNavIndex == 1),
                _buildNavItem(Icons.chat_bubble_outline, 2,
                    isSelected: _selectedNavIndex == 2),
                _buildNavItem(Icons.person_outline, 3,
                    isSelected: _selectedNavIndex == 3),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isMe = message['isMe'];

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment:
            isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) ...[
            // Profile picture for incoming messages
            Container(
              width: 32,
              height: 32,
              margin: const EdgeInsets.only(right: 8),
              decoration: const BoxDecoration(
                color: Color(0xFFF5F5F5),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person,
                color: Color(0xFF9E9E9E),
                size: 16,
              ),
            ),
          ],

          // Message bubble
          Flexible(
            child: GestureDetector(
              onLongPress: () => _onLongPressMessage(message),
              child: Container(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.of(context).size.width * 0.75,
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: isMe
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : const Color(0xFFF5F5F5),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      message['text'],
                      style: TextStyle(
                        fontSize: 16,
                        color: (message['isDeleted'] == true)
                            ? (isMe ? Colors.white70 : const Color(0xFF9E9E9E))
                            : (isMe ? Colors.white : Colors.black),
                        fontStyle: (message['isDeleted'] == true)
                            ? FontStyle.italic
                            : FontStyle.normal,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _formatTimestamp(message['timestamp']),
                          style: TextStyle(
                            fontSize: 12,
                            color: isMe
                                ? Colors.white.withOpacity(0.7)
                                : const Color(0xFF9E9E9E),
                          ),
                        ),
                        if ((message['isEdited'] == true) &&
                            (message['isDeleted'] != true)) ...[
                          const SizedBox(width: 6),
                          Text(
                            '(edited)',
                            style: TextStyle(
                              fontSize: 12,
                              color: isMe
                                  ? Colors.white.withOpacity(0.7)
                                  : const Color(0xFF9E9E9E),
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                        if (isMe) ...[
                          const SizedBox(width: 4),
                          Icon(
                            message['isRead'] ? Icons.done_all : Icons.done,
                            size: 16,
                            color: message['isRead']
                                ? Colors.white.withOpacity(0.7)
                                : Colors.white.withOpacity(0.5),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          if (isMe) ...[
            const SizedBox(width: 8),
            // Profile picture for outgoing messages
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: Color(0xFFF5F5F5),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person,
                color: Color(0xFF9E9E9E),
                size: 16,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, int index, {required bool isSelected}) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedNavIndex = index;
        });
        // Navigate to different screens based on index
        switch (index) {
          case 0:
            Navigator.of(context).pushReplacementNamed('/home');
            break;
          case 1:
            Navigator.of(context).pushReplacementNamed('/events');
            break;
          case 2:
            Navigator.of(context).pushReplacementNamed('/messaging');
            break;
          case 3:
            Navigator.of(context).pushReplacementNamed('/profile');
            break;
        }
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isSelected
                ? const Color.fromARGB(255, 255, 60, 60)
                : Colors.black,
            size: 24,
          ),
          if (isSelected)
            Container(
              margin: const EdgeInsets.only(top: 4),
              width: 4,
              height: 4,
              decoration: const BoxDecoration(
                color: Colors.black,
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    );
  }

  void _showChatOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0E0E0),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              const SizedBox(height: 20),

              // Options
              _buildOptionTile(
                icon: Icons.person,
                title: 'View Profile',
                onTap: () {
                  Navigator.pop(context);
                  // TODO: Navigate to user profile
                },
              ),

              _buildOptionTile(
                icon: Icons.block,
                title: 'Block User',
                onTap: () {
                  Navigator.pop(context);
                  _showBlockConfirmation();
                },
              ),

              _buildOptionTile(
                icon: Icons.report,
                title: 'Report User',
                onTap: () {
                  Navigator.pop(context);
                  _showReportDialog();
                },
              ),

              _buildOptionTile(
                icon: Icons.delete,
                title: 'Delete Conversation',
                onTap: () {
                  Navigator.pop(context);
                  _showDeleteConfirmation();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOptionTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: Colors.black,
        size: 24,
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          color: Colors.black,
        ),
      ),
      onTap: onTap,
    );
  }

  void _showBlockConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Block User'),
          content: Text(
              'Are you sure you want to block ${widget.user['userName']}?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                // TODO: Implement block functionality
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                      content:
                          Text('${widget.user['userName']} has been blocked')),
                );
              },
              child: const Text(
                'Block',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }

  void _showReportDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Report User'),
          content:
              const Text('Please select a reason for reporting this user.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                // TODO: Implement report functionality
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text('Report submitted successfully')),
                );
              },
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Conversation'),
          content: const Text(
              'Are you sure you want to delete this conversation? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context); // Go back to messaging screen
                // TODO: Implement delete functionality
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Conversation deleted')),
                );
              },
              child: const Text(
                'Delete',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}
