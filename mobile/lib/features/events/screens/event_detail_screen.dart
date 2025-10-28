import 'package:flutter/material.dart';

class EventDetailScreen extends StatefulWidget {
  final Map<String, dynamic> event;

  const EventDetailScreen({super.key, required this.event});

  @override
  State<EventDetailScreen> createState() => _EventDetailScreenState();
}

class _EventDetailScreenState extends State<EventDetailScreen> {
  String _selectedTab = 'details'; // Default to details view

  // TODO: Implement when Google Maps API is available
  void _openDirections() {
    // Example implementation:
    // final venue = widget.event['venue'] ?? 'Event Location';
    // final url = 'https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(venue)}';
    // launchUrl(Uri.parse(url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text(
          'Event Details',
          style: TextStyle(
                color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 255, 60, 60),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Add to calendar functionality
            },
            icon: const Icon(Icons.calendar_today, color: Colors.white),
          ),
          IconButton(
            onPressed: () {
              // TODO: Share event functionality
            },
            icon: const Icon(Icons.share, color: Colors.white),
                  ),
                ],
              ),
      body: Column(
                children: [
          // Header with event info
          _buildHeader(),

          // Tab navigation
          _buildTabNavigation(),

          // Content based on selected tab
          Expanded(
            child: _selectedTab == 'details'
                ? _buildDetailsTab()
                : _selectedTab == 'location'
                    ? _buildLocationTab()
                    : _buildParticipantsTab(),
                      ),
                    ],
                  ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Color.fromARGB(255, 255, 60, 60),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Event Date
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      widget.event['day'] ?? '19',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 255, 60, 60),
                      ),
                    ),
                    Text(
                      widget.event['month'] ?? 'Sept',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color.fromARGB(255, 255, 60, 60),
                    ),
                  ),
                ],
              ),
            ),
              const SizedBox(width: 16),
            Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.event['title'] ?? 'Cosplay Convention 2025',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.event['venue'] ?? 'Bicol Cosplay Arena',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                          ),
                        ],
                      ),
              ),
              // Event Type Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'CONVENTION',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: Color.fromARGB(255, 255, 60, 60),
                  ),
                ),
              ),
            ],
                                ),
                                const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                'Date: ${widget.event['day'] ?? '19'} ${widget.event['month'] ?? 'Sept'} ${widget.event['year'] ?? '2025'}',
                                          style: const TextStyle(
                  color: Colors.white,
                                                fontSize: 14,
                  fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            Text(
                'Time: ${widget.event['time'] ?? '10:00 AM'}',
                                              style: const TextStyle(
                  color: Colors.white70,
                                                fontSize: 14,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
    );
  }

  Widget _buildTabNavigation() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
                                    Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedTab = 'details'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _selectedTab == 'details'
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                                      child: Text(
                  'Details',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color:
                        _selectedTab == 'details' ? Colors.white : Colors.black,
                                          fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedTab = 'location'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                  color: _selectedTab == 'location'
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Location',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: _selectedTab == 'location'
                        ? Colors.white
                        : Colors.black,
                    fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedTab = 'participants'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                                  decoration: BoxDecoration(
                  color: _selectedTab == 'participants'
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                                    child: Text(
                  'Participants',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: _selectedTab == 'participants'
                        ? Colors.white
                        : Colors.black,
                    fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Event Description
          _buildEventDescription(),

          const SizedBox(height: 24),

          // Event Schedule
          _buildEventSchedule(),

                    const SizedBox(height: 24),

          // Event Actions
          _buildEventActions(),
        ],
      ),
    );
  }

  Widget _buildLocationTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
                    // Map Container
                    Container(
                      width: double.infinity,
                      height: 300,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0F0F0),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: const Color(0xFFE0E0E0),
                          width: 1,
                        ),
                      ),
                      child: Stack(
                        children: [
                // Google Maps Placeholder
                          Container(
                            width: double.infinity,
                            height: double.infinity,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE8F4FD),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.map,
                                    size: 60,
                                    color: Color(0xFFCCCCCC),
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Google Maps',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF666666),
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    'API Key Required',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF999999),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          // Directions Button
                          Positioned(
                            bottom: 16,
                            right: 16,
                            child: GestureDetector(
                    onTap: _openDirections,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: const Color.fromARGB(255, 255, 60, 60),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.directions,
                                      color: Colors.white,
                                      size: 16,
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      'Directions',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

          // Venue Information
          _buildVenueInfo(),
        ],
      ),
    );
  }

  Widget _buildParticipantsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Participants List
          _buildParticipantsList(),

          const SizedBox(height: 24),

          // Join Event Button
          _buildJoinEventButton(),
        ],
      ),
    );
  }

  Widget _buildEventDescription() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Event Description',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            widget.event['description'] ??
                'Join us for an amazing cosplay event featuring your favorite anime characters! This event will showcase incredible costumes, photo opportunities, and a chance to meet fellow anime enthusiasts.',
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF6B7280),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventSchedule() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Event Schedule',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildScheduleItem('10:00 AM', 'Registration & Welcome'),
          _buildScheduleItem('11:00 AM', 'Cosplay Contest Begins'),
          _buildScheduleItem('12:00 PM', 'Lunch Break'),
          _buildScheduleItem('1:00 PM', 'Photoshoot Sessions'),
          _buildScheduleItem('3:00 PM', 'Awards Ceremony'),
          _buildScheduleItem('4:00 PM', 'Event Ends'),
        ],
      ),
    );
  }

  Widget _buildScheduleItem(String time, String activity) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFFE0E0E0),
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 60,
            child: Text(
              time,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color.fromARGB(255, 255, 60, 60),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              activity,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventActions() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Actions',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),

          // Join Event Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                // TODO: Implement join event functionality
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Joined event successfully!'),
                    backgroundColor: Color(0xFF4CAF50),
                  ),
                );
              },
              icon: const Icon(Icons.event_available, color: Colors.white),
              label: const Text(
                'Join Event',
                style: TextStyle(color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color.fromARGB(255, 255, 60, 60),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),

          const SizedBox(height: 12),

          // Share Event Button
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                // TODO: Implement share event functionality
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Event shared successfully!'),
                    backgroundColor: Color(0xFF2196F3),
                  ),
                );
              },
              icon: const Icon(Icons.share,
                  color: Color.fromARGB(255, 255, 60, 60)),
              label: const Text(
                'Share Event',
                style: TextStyle(color: Color.fromARGB(255, 255, 60, 60)),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVenueInfo() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Venue Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow(Icons.location_on, 'Address',
              widget.event['address'] ?? '123 Main Street, Bicol City'),
          _buildInfoRow(Icons.phone, 'Contact',
              widget.event['contact'] ?? '+63 123 456 7890'),
          _buildInfoRow(
              Icons.access_time, 'Operating Hours', '9:00 AM - 6:00 PM'),
          _buildInfoRow(Icons.people, 'Capacity', '500 attendees'),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: const Color.fromARGB(255, 255, 60, 60),
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF6B7280),
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildParticipantsList() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Participants (127)',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),

          // Sample participants
          _buildParticipantItem('Alex Rivera', 'Cosplayer', true),
          _buildParticipantItem('Sarah Connor', 'Artist', false),
          _buildParticipantItem('Mike Johnson', 'Photographer', true),
          _buildParticipantItem('Lisa Wang', 'Vendor', false),
        ],
      ),
    );
  }

  Widget _buildParticipantItem(String name, String role, bool isOnline) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFFE0E0E0),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF5F5F5),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(
              Icons.person,
              color: Color(0xFF9E9E9E),
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
                Text(
                  role,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color:
                  isOnline ? const Color(0xFF4CAF50) : const Color(0xFF9E9E9E),
              shape: BoxShape.circle,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJoinEventButton() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () {
            // TODO: Implement join event functionality
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Joined event successfully!'),
                backgroundColor: Color(0xFF4CAF50),
              ),
            );
          },
          icon: const Icon(Icons.event_available, color: Colors.white),
          label: const Text(
            'Join This Event',
            style: TextStyle(color: Colors.white),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color.fromARGB(255, 255, 60, 60),
            padding: const EdgeInsets.symmetric(vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
      ),
    );
  }
}
