import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/providers/messaging_provider.dart';
import '../../../core/utils/system_ui_utils.dart';
import '../../../core/widgets/rounded_navigation_bar.dart';
import '../../../shared/types/commission.dart';
import '../../../shared/utils/messaging_utils.dart';
import '../../../shared/utils/commission_utils.dart';
import '../../commission/screens/commission_acceptance_screen.dart';
import '../../commission/screens/commission_details_screen.dart';
import '../../commission/screens/client_commission_progress_screen.dart';

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

  // Get messages from MessagingProvider
  List<Map<String, dynamic>> _getMessagesList(
      MessagingProvider messagingProvider) {
    // Get all conversation keys from the provider
    final conversationKeys = messagingProvider.conversationKeys;

    // Convert to the format expected by the UI
    final messagesList = <Map<String, dynamic>>[];

    for (final key in conversationKeys) {
      final conversation = messagingProvider.getConversation(key);
      if (conversation.isNotEmpty) {
        final lastMessage = conversation.last;

        // Find the other user (not current_user)
        final otherUserMessage =
            conversation.where((m) => m.senderId != 'current_user').firstOrNull;
        if (otherUserMessage == null) continue;

        final otherUser = otherUserMessage.sender;

        messagesList.add({
          'id': key.hashCode,
          'userName': otherUser.name,
          'lastMessage': lastMessage.content,
          'timestamp': MessagingUtils.formatMessageTime(lastMessage.timestamp),
          'isRead': lastMessage.isRead,
        });
      }
    }

    // Sort by timestamp (most recent first)
    messagesList.sort((a, b) {
      // Get the actual conversation to access the last message timestamp
      final conversationA = messagingProvider.getConversation(a['userName']);
      final conversationB = messagingProvider.getConversation(b['userName']);

      if (conversationA.isEmpty || conversationB.isEmpty) {
        return 0;
      }

      final lastMessageA = conversationA.last;
      final lastMessageB = conversationB.last;

      // Sort by timestamp in descending order (most recent first)
      return lastMessageB.timestamp.compareTo(lastMessageA.timestamp);
    });

    return messagesList;
  }

  // Mock data for commission requests
  final List<Map<String, dynamic>> _commissionRequests = [
    // Commission RECEIVED (someone commissioned you as an artist)
    {
      'id': '1',
      'title': 'Portrait Commission',
      'description': 'I would like a portrait of my dog',
      'category': 'portrait',
      'budget': 150.0,
      'deadline': DateTime.now().add(const Duration(days: 7)).toIso8601String(),
      'is_urgent': false,
      'client_id': 'client_1',
      'client_name': 'Sarah Connor',
      'client_avatar': null,
      'artist_id': 'current_user', // You are the artist
      'artist_name': 'You',
      'artist_avatar': null,
      'status': 'pending',
      'created_at':
          DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
      'updated_at':
          DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
      'commission_type': 'received', // Commission received by you
    },
    // Commission SENT (you commissioned someone else as a client)
    {
      'id': '2',
      'title': 'Logo Design',
      'description': 'Need a professional logo for my startup',
      'category': 'logoDesign',
      'budget': 300.0,
      'deadline':
          DateTime.now().add(const Duration(days: 14)).toIso8601String(),
      'is_urgent': false,
      'client_id': 'current_user', // You are the client
      'client_name': 'You',
      'client_avatar': null,
      'artist_id': 'artist_2',
      'artist_name': 'Alex Rivera',
      'artist_avatar': null,
      'status': 'accepted',
      'created_at':
          DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
      'updated_at':
          DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
      'commission_type': 'sent', // Commission sent by you
    },
    // Another Commission RECEIVED (someone else commissioned you)
    {
      'id': '3',
      'title': 'Custom Illustration',
      'description': 'Book cover illustration needed',
      'category': 'illustration',
      'budget': 200.0,
      'deadline':
          DateTime.now().add(const Duration(days: 10)).toIso8601String(),
      'is_urgent': false,
      'client_id': 'client_3',
      'client_name': 'Lisa Wang',
      'client_avatar': null,
      'artist_id': 'current_user', // You are the artist
      'artist_name': 'You',
      'artist_avatar': null,
      'status': 'accepted',
      'created_at':
          DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
      'updated_at':
          DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
      'commission_type': 'received', // Commission received by you
    },
  ];

  @override
  Widget build(BuildContext context) {
    // Apply red theme to system UI (status bar and navigation bar)
    SystemUIUtils.applyRedTheme();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            // App Header with Logo, Search, and Settings
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 255, 60, 60),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
              ),
              child: SafeArea(
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
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '&C',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.normal,
                            color: Colors.white,
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
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const TextField(
                          decoration: InputDecoration(
                            hintText: 'Search messages...',
                            hintStyle: TextStyle(
                              color: Color(0xFF9E9E9E),
                              fontSize: 14,
                            ),
                            prefixIcon: Icon(
                              Icons.search,
                              color: Color.fromARGB(255, 255, 60, 60),
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
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  ],
                ),
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

      // Bottom Navigation with rounded corners
      bottomNavigationBar: RoundedNavigationBar(
        currentIndex: _selectedNavIndex,
        onTap: (index) {
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
              // Already on messaging screen
              break;
            case 3:
              Navigator.of(context).pushReplacementNamed('/profile');
              break;
          }
        },
        items: const [
          NavigationItem(icon: Icons.home, label: 'Home'),
          NavigationItem(icon: Icons.map, label: 'Events'),
          NavigationItem(icon: Icons.chat_bubble_outline, label: 'Messages'),
          NavigationItem(icon: Icons.person_outline, label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildMessagesList() {
    return Container(
      color: Colors.white,
      child: Consumer<MessagingProvider>(
        builder: (context, messagingProvider, _) {
          final messagesList = _getMessagesList(messagingProvider);
          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: messagesList.length,
            itemBuilder: (context, index) {
              final thread = messagesList[index];
              return _buildMessageItem(thread);
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
    final commissionType = request['commission_type'] ?? 'received';
    final isReceived = commissionType == 'received';

    return GestureDetector(
      onTap: () {
        // Convert Map to CommissionRequest and navigate to appropriate screen
        final commissionRequest = CommissionRequest.fromJson(request);

        if (isReceived) {
          // Navigate to artist view (CommissionDetailsScreen)
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => CommissionDetailsScreen(
                commissionRequest: commissionRequest,
              ),
            ),
          );
        } else {
          // Navigate to client view (ClientCommissionProgressScreen)
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => ClientCommissionProgressScreen(
                commissionRequest: commissionRequest,
              ),
            ),
          );
        }
      },
      child: Container(
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
                      Row(
                        children: [
                          Text(
                            isReceived
                                ? request['client_name']
                                : request['artist_name'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Commission Type Badge
                          _buildCommissionTypeBadge(isReceived),
                        ],
                      ),
                      Text(
                        CommissionUtils.formatDate(
                            DateTime.parse(request['created_at'])),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF9E9E9E),
                        ),
                      ),
                    ],
                  ),
                ),

                // Status Badge
                _buildStatusBadge(request['status']),
              ],
            ),

            const SizedBox(height: 12),

            // Request Title
            Text(
              request['title'],
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),

            const SizedBox(height: 8),

            // Request Description
            Text(
              request['description'],
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
                  'Budget: ${CommissionUtils.formatPeso(request['budget'])}',
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
                        onPressed: () async {
                          // Convert Map to CommissionRequest
                          final commissionRequest =
                              CommissionRequest.fromJson(request);
                          final result = await Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => CommissionAcceptanceScreen(
                                commissionRequest: commissionRequest,
                              ),
                            ),
                          );

                          // If commission was accepted, update the status
                          if (result == true) {
                            _updateCommissionStatus(request['id'], 'accepted');
                          }
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
                          _showDeclineDialog(request);
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
      ),
    );
  }

  Widget _buildCommissionTypeBadge(bool isReceived) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: isReceived
            ? const Color(0xFFE3F2FD) // Light blue for received
            : const Color(0xFFE8F5E8), // Light green for sent
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isReceived
              ? const Color(0xFF2196F3) // Blue border for received
              : const Color(0xFF4CAF50), // Green border for sent
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isReceived ? Icons.arrow_downward : Icons.arrow_upward,
            size: 10,
            color:
                isReceived ? const Color(0xFF2196F3) : const Color(0xFF4CAF50),
          ),
          const SizedBox(width: 2),
          Text(
            isReceived ? 'RECEIVED' : 'SENT',
            style: TextStyle(
              fontSize: 8,
              fontWeight: FontWeight.bold,
              color: isReceived
                  ? const Color(0xFF2196F3)
                  : const Color(0xFF4CAF50),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color backgroundColor;
    Color textColor;

    switch (status) {
      case 'pending':
        backgroundColor = const Color(0xFFFFF3CD); // Light yellow
        textColor = const Color(0xFF856404); // Dark yellow
        break;
      case 'accepted':
        backgroundColor = const Color(0xFFD4EDDA); // Light green
        textColor = const Color(0xFF155724); // Dark green
        break;
      case 'declined':
        backgroundColor = const Color(0xFFF8D7DA); // Light red
        textColor = const Color(0xFF721C24); // Dark red
        break;
      case 'completed':
        backgroundColor = const Color(0xFFD1ECF1); // Light blue
        textColor = const Color(0xFF0C5460); // Dark blue
        break;
      default:
        backgroundColor = const Color(0xFFF5F5F5); // Light gray
        textColor = const Color(0xFF6C757D); // Dark gray
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: textColor,
        ),
      ),
    );
  }

  void _updateCommissionStatus(String id, String newStatus) {
    setState(() {
      final index = _commissionRequests.indexWhere((req) => req['id'] == id);
      if (index != -1) {
        _commissionRequests[index] = {
          ..._commissionRequests[index],
          'status': newStatus,
          'updated_at': DateTime.now().toIso8601String(),
        };
      }
    });
  }

  void _showDeclineDialog(Map<String, dynamic> request) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Decline Commission'),
          content: const Text(
            'Are you sure you want to decline this commission request? This action cannot be undone.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _updateCommissionStatus(request['id'], 'declined');
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                        'Commission request from ${request['client_name']} has been declined.'),
                    backgroundColor: Colors.orange,
                  ),
                );
              },
              child: const Text(
                'Decline',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }
}
