import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/messaging_provider.dart';

class MessagingScreen extends StatefulWidget {
  const MessagingScreen({super.key});

  @override
  State<MessagingScreen> createState() => _MessagingScreenState();
}

class _MessagingScreenState extends State<MessagingScreen> {
  int _selectedTabIndex = 0;
  int _selectedNavIndex = 2; // Messages tab is selected
  String _commissionFilter = 'All';
  final List<String> _commissionFilters = const [
    'All',
    'Pending',
    'Accepted',
    'Completed',
    'Declined',
  ];

  // Mock data for messages
  final List<Map<String, dynamic>> _messages = [
    {
      'id': 1,
      'userName': 'Alice Johnson',
      'lastMessage': 'Hey! How is the commission going?',
      'timestamp': '2 min ago',
      'isRead': false,
    },
    {
      'id': 2,
      'userName': 'Bob Smith',
      'lastMessage': 'I love your latest artwork!',
      'timestamp': '1 hour ago',
      'isRead': true,
    },
    {
      'id': 3,
      'userName': 'Carol Davis',
      'lastMessage': 'Can we discuss the pricing?',
      'timestamp': '3 hours ago',
      'isRead': false,
    },
    {
      'id': 4,
      'userName': 'David Wilson',
      'lastMessage': 'The artwork looks amazing!',
      'timestamp': '1 day ago',
      'isRead': true,
    },
    {
      'id': 5,
      'userName': 'Emma Brown',
      'lastMessage': 'When will it be ready?',
      'timestamp': '2 days ago',
      'isRead': true,
    },
    {
      'id': 6,
      'userName': 'Frank Miller',
      'lastMessage': 'Thanks for the commission!',
      'timestamp': '3 days ago',
      'isRead': true,
    },
    {
      'id': 7,
      'userName': 'Grace Lee',
      'lastMessage': 'I need some changes to the design',
      'timestamp': '1 week ago',
      'isRead': false,
    },
    {
      'id': 8,
      'userName': 'Henry Taylor',
      'lastMessage': 'Perfect! Exactly what I wanted',
      'timestamp': '1 week ago',
      'isRead': true,
    },
  ];

  // Mock data for commission requests
  final List<Map<String, dynamic>> _commissionRequests = [
    {
      'id': 1,
      'userName': 'Sarah Connor',
      'requestTitle': 'Portrait Commission',
      'requestDescription': 'I would like a portrait of my dog',
      'budget': '\$150',
      'timestamp': '1 hour ago',
      'status': 'pending',
    },
    {
      'id': 2,
      'userName': 'Mike Johnson',
      'requestTitle': 'Digital Artwork',
      'requestDescription': 'Need a logo design for my business',
      'budget': '\$300',
      'timestamp': '2 hours ago',
      'status': 'pending',
    },
    {
      'id': 3,
      'userName': 'Lisa Wang',
      'requestTitle': 'Custom Illustration',
      'requestDescription': 'Book cover illustration needed',
      'budget': '\$200',
      'timestamp': '1 day ago',
      'status': 'accepted',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // App Bar with Logo, Search, and Settings
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  // Logo
                  const Row(
                    children: [
                      Text(
                        'B',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      Text(
                        '&C',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.normal,
                          color: Color.fromARGB(255, 255, 60, 60),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(width: 16),

                  // Search Bar
                  Expanded(
                    child: Container(
                      height: 40,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F5F5),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(0xFFE0E0E0),
                          width: 1,
                        ),
                      ),
                      child: const TextField(
                        decoration: InputDecoration(
                          hintText: 'Search',
                          hintStyle: TextStyle(
                            color: Color(0xFF9E9E9E),
                            fontSize: 14,
                          ),
                          prefixIcon: Icon(
                            Icons.search,
                            color: Colors.black,
                            size: 20,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 16),

                  // Settings Icon
                  IconButton(
                    onPressed: () {
                      Navigator.of(context).pushNamed('/settings');
                    },
                    icon: const Icon(
                      Icons.settings,
                      color: Colors.black,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Tab Section
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  // Messages Tab
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTabIndex = 0;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: _selectedTabIndex == 0
                              ? const Color.fromARGB(255, 255, 60, 60)
                              : const Color(0xFFF5F5F5),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Messages',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: _selectedTabIndex == 0
                                ? Colors.white
                                : Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Commission Requests Tab
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTabIndex = 1;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: _selectedTabIndex == 1
                              ? const Color.fromARGB(255, 255, 60, 60)
                              : const Color(0xFFF5F5F5),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Commission Requests',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: _selectedTabIndex == 1
                                ? Colors.white
                                : Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content Area
            Expanded(
              child: Container(
                padding: const EdgeInsets.only(top: 16),
                child: _selectedTabIndex == 0
                    ? _buildMessagesList()
                    : _buildCommissionRequestsList(),
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

  Widget _buildMessagesList() {
    return Container(
      color: Colors.white,
      child: Consumer<MessagingProvider>(
        builder: (context, messagingProvider, _) {
          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _messages.length,
            itemBuilder: (context, index) {
              final thread = _messages[index];
              final key = thread['userName'] as String;
              final conversation = messagingProvider.getConversation(key);
              final hasMessages = conversation.isNotEmpty;
              final last = hasMessages ? conversation.last : null;
              String lastPreview = hasMessages
                  ? (last!['text'] as String)
                  : thread['lastMessage'];
              if (hasMessages &&
                  ((last!['isEdited'] as bool?) == true) &&
                  ((last['isDeleted'] as bool?) != true)) {
                lastPreview = '$lastPreview (edited)';
              }
              final String lastTime = hasMessages
                  ? _formatTimestamp(last!['timestamp'] as DateTime)
                  : (thread['timestamp'] as String);
              final bool hasUnread = conversation
                  .any((m) => !(m['isRead'] as bool) && !(m['isMe'] as bool));

              return _buildMessageItem({
                'userName': key,
                'lastMessage': lastPreview,
                'timestamp': lastTime,
                'isRead': !hasUnread,
              });
            },
          );
        },
      ),
    );
  }

  Widget _buildMessageItem(Map<String, dynamic> message) {
    return GestureDetector(
        onTap: () {
          Navigator.of(context).pushNamed('/chat', arguments: {
            'userName': message['userName'],
            'lastMessage': message['lastMessage'],
            'timestamp': message['timestamp'],
            'isRead': message['isRead'],
          });
        },
        child: Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: Row(
            children: [
              // Profile Picture Placeholder
              Container(
                width: 50,
                height: 50,
                decoration: const BoxDecoration(
                  color: Color(0xFFF5F5F5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person,
                  color: Color(0xFF9E9E9E),
                  size: 24,
                ),
              ),

              const SizedBox(width: 12),

              // Message Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          message['userName'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                        Text(
                          message['timestamp'],
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      message['lastMessage'],
                      style: TextStyle(
                        fontSize: 14,
                        color: message['isRead']
                            ? const Color(0xFF9E9E9E)
                            : Colors.black,
                        fontWeight: message['isRead']
                            ? FontWeight.normal
                            : FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),

              // Unread indicator
              if (!message['isRead'])
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Color.fromARGB(255, 255, 60, 60),
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
        ));
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'now';
    }
  }

  Widget _buildCommissionRequestsList() {
    final List<Map<String, dynamic>> filtered = _commissionFilter == 'All'
        ? _commissionRequests
        : _commissionRequests
            .where((r) =>
                (r['status'] as String).toLowerCase() ==
                _commissionFilter.toLowerCase())
            .toList();

    return Column(
      children: [
        // Filters row
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: _commissionFilters.map((f) {
              final bool selected = f == _commissionFilter;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      _commissionFilter = f;
                    });
                  },
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: selected
                          ? const Color.fromARGB(255, 255, 60, 60)
                          : const Color(0xFFF5F5F5),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: selected
                            ? const Color.fromARGB(255, 255, 60, 60)
                            : const Color(0xFFE0E0E0),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      f,
                      style: TextStyle(
                        color: selected ? Colors.white : Colors.black,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        // List
        Expanded(
          child: Container(
            color: Colors.white,
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final request = filtered[index];
                return _buildCommissionRequestItem(request);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCommissionRequestItem(Map<String, dynamic> request) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFE0E0E0),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Profile Picture Placeholder
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

              // User Name and Status
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      request['userName'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      request['timestamp'],
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF9E9E9E),
                      ),
                    ),
                  ],
                ),
              ),

              // Status Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: request['status'] == 'pending'
                      ? const Color(0xFFFFF3CD)
                      : const Color(0xFFD4EDDA),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  request['status'].toString().toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: request['status'] == 'pending'
                        ? const Color(0xFF856404)
                        : const Color(0xFF155724),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Request Title
          Text(
            request['requestTitle'],
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.black,
            ),
          ),

          const SizedBox(height: 8),

          // Request Description
          Text(
            request['requestDescription'],
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF6B7280),
            ),
          ),

          const SizedBox(height: 12),

          // Budget and Actions
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Budget: ${request['budget']}',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color.fromARGB(255, 255, 60, 60),
                ),
              ),
              if (request['status'] == 'pending')
                Row(
                  children: [
                    TextButton(
                      onPressed: () {
                        // TODO: Accept commission request
                      },
                      child: const Text(
                        'Accept',
                        style: TextStyle(
                          color: Color.fromARGB(255, 255, 60, 60),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        // TODO: Decline commission request
                      },
                      child: const Text(
                        'Decline',
                        style: TextStyle(
                          color: Color(0xFF9E9E9E),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
            ],
          ),
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
            // Already on messages screen
            break;
          case 3:
            Navigator.of(context).pushReplacementNamed('/profile');
            break;
        }
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            children: [
              Icon(
                icon,
                color: isSelected
                    ? const Color.fromARGB(255, 255, 60, 60)
                    : Colors.black,
                size: 24,
              ),
              // Notification dot for messages
              if (index == 2 && _hasUnreadMessages())
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Color.fromARGB(255, 255, 60, 60),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
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

  bool _hasUnreadMessages() {
    final messagingProvider =
        Provider.of<MessagingProvider>(context, listen: false);
    for (final thread in _messages) {
      final conv =
          messagingProvider.getConversation(thread['userName'] as String);
      if (conv.any((m) => !(m['isRead'] as bool) && !(m['isMe'] as bool)))
        return true;
    }
    return false;
  }
}
