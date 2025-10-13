import 'package:flutter/material.dart';
import '../../../core/utils/system_ui_utils.dart';
import '../../../core/widgets/rounded_navigation_bar.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _selectedIndex = 1; // Events tab is selected
  DateTime _selectedDate = DateTime.now();
  DateTime _focusedDate = DateTime.now();

  // Mock events data
  final List<Map<String, dynamic>> _events = [
    {
      'id': 1,
      'title': 'Bicol Cosplay Arena',
      'date': DateTime(2025, 9, 19),
      'image': 'assets/images/event1.jpg',
      'description':
          'Anime cosplay event featuring Hatsune Miku and other characters',
      'location': 'Bicol Cosplay Arena',
    },
    {
      'id': 2,
      'title': 'Art Gallery Opening',
      'date': DateTime(2025, 9, 25),
      'image': 'assets/images/event2.jpg',
      'description': 'Local artist showcase and gallery opening',
      'location': 'Downtown Art Center',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

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
                        child: TextField(
                          controller: _searchController,
                          decoration: const InputDecoration(
                            hintText: 'Search events...',
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

            // Calendar Section
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Calendar Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: () {
                          setState(() {
                            _focusedDate = DateTime(
                                _focusedDate.year, _focusedDate.month - 1);
                          });
                        },
                        icon:
                            const Icon(Icons.chevron_left, color: Colors.black),
                      ),
                      Text(
                        '${_getMonthName(_focusedDate.month)} ${_focusedDate.year}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          setState(() {
                            _focusedDate = DateTime(
                                _focusedDate.year, _focusedDate.month + 1);
                          });
                        },
                        icon: const Icon(Icons.chevron_right,
                            color: Colors.black),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Days of Week
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: const [
                      Text('SUN',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                      Text('MON',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                      Text('TUE',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                      Text('WED',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                      Text('THU',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                      Text('FRI',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                      Text('SAT',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500)),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Calendar Grid
                  _buildCalendarGrid(),
                ],
              ),
            ),

            // Locate Artists Button
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  // TODO: Implement locate artists functionality
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 255, 60, 60),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Locate Artists Near Me',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Events Section
            Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Events',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).pushNamed('/create-event');
                          },
                          child: Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: const Color.fromARGB(255, 255, 60, 60),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.1),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.add,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Expanded(
                      child: ListView.builder(
                        physics: const ClampingScrollPhysics(),
                        itemCount: _events.length,
                        itemBuilder: (context, index) {
                          final event = _events[index];
                          return _buildEventCard(event);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      // Bottom Navigation with rounded corners
      bottomNavigationBar: RoundedNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
          // Navigate to different screens based on index
          switch (index) {
            case 0:
              Navigator.of(context).pushReplacementNamed('/home');
              break;
            case 1:
              // Already on events screen
              break;
            case 2:
              Navigator.of(context).pushReplacementNamed('/messaging');
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

  Widget _buildCalendarGrid() {
    final firstDayOfMonth = DateTime(_focusedDate.year, _focusedDate.month, 1);
    final lastDayOfMonth =
        DateTime(_focusedDate.year, _focusedDate.month + 1, 0);
    final firstWeekday = firstDayOfMonth.weekday;
    final daysInMonth = lastDayOfMonth.day;

    List<Widget> calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (int i = 0; i < firstWeekday; i++) {
      calendarDays.add(const SizedBox(height: 40));
    }

    // Add days of the month
    for (int day = 1; day <= daysInMonth; day++) {
      final date = DateTime(_focusedDate.year, _focusedDate.month, day);
      final isSelected = date.day == _selectedDate.day &&
          date.month == _selectedDate.month &&
          date.year == _selectedDate.year;
      final hasEvent = _events.any((event) =>
          event['date'].day == day &&
          event['date'].month == _focusedDate.month &&
          event['date'].year == _focusedDate.year);

      calendarDays.add(
        GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = date;
            });
          },
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: isSelected
                  ? const Color.fromARGB(255, 255, 60, 60)
                  : Colors.transparent,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                day.toString(),
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: isSelected
                      ? Colors.white
                      : hasEvent
                          ? const Color.fromARGB(255, 255, 60, 60)
                          : Colors.black,
                ),
              ),
            ),
          ),
        ),
      );
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: calendarDays,
    );
  }

  Widget _buildEventCard(Map<String, dynamic> event) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pushNamed('/event-detail', arguments: {
          'day': event['date'].day.toString(),
          'month': _getMonthName(event['date'].month),
          'year': event['date'].year.toString(),
          'venue': event['location'],
          'title': event['title'],
          'description':
              'Join us for an amazing event at ${event['location']}! This event will showcase incredible performances and provide a great opportunity to meet fellow enthusiasts.',
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Date Section
              Container(
                width: 60,
                child: Column(
                  children: [
                    Text(
                      event['date'].day.toString(),
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      _getMonthName(event['date'].month),
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF666666),
                      ),
                    ),
                    Text(
                      event['date'].year.toString(),
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF666666),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              // Event Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      event['title'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      event['location'],
                      style: const TextStyle(
                        fontSize: 14,
                        color: Color(0xFF666666),
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Event Image Placeholder
                    Container(
                      height: 80,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0F0F0),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.image,
                          size: 40,
                          color: Color(0xFFCCCCCC),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getMonthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[month - 1];
  }
}
