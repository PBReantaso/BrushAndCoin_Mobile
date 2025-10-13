import 'package:flutter/material.dart';
import '../../../shared/utils/commission_utils.dart';

class ClientCommissionsScreen extends StatefulWidget {
  const ClientCommissionsScreen({super.key});

  @override
  State<ClientCommissionsScreen> createState() =>
      _ClientCommissionsScreenState();
}

class _ClientCommissionsScreenState extends State<ClientCommissionsScreen> {
  String _selectedFilter = 'All';

  final List<String> _filters = [
    'All',
    'Pending',
    'In Progress',
    'Awaiting Approval',
    'Completed',
    'Cancelled',
  ];

  // Mock data - in real app this would come from API
  final List<Map<String, dynamic>> _commissions = [
    {
      'id': '1',
      'title': 'Digital Portrait Commission',
      'artistName': 'Alice Johnson',
      'artistAvatar': 'https://i.pravatar.cc/150?img=3',
      'status': 'In Progress',
      'budget': 2500.0,
      'deadline': 'Dec 25, 2024',
      'createdAt': 'Dec 10, 2024',
      'progress': 60,
      'latestUpdate':
          'Artist has completed the initial sketch and is now working on the detailed drawing.',
    },
    {
      'id': '2',
      'title': 'Logo Design for Startup',
      'artistName': 'Bob Smith',
      'artistAvatar': 'https://i.pravatar.cc/150?img=2',
      'status': 'Awaiting Approval',
      'budget': 5000.0,
      'deadline': 'Dec 30, 2024',
      'createdAt': 'Dec 5, 2024',
      'progress': 100,
      'latestUpdate':
          'Final logo design has been submitted. Please review and approve.',
    },
    {
      'id': '3',
      'title': 'Character Concept Art',
      'artistName': 'Carol Davis',
      'artistAvatar': 'https://i.pravatar.cc/150?img=4',
      'status': 'Pending',
      'budget': 3000.0,
      'deadline': 'Jan 15, 2025',
      'createdAt': 'Dec 20, 2024',
      'progress': 0,
      'latestUpdate': 'Commission request sent. Waiting for artist to accept.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredCommissions = _selectedFilter == 'All'
        ? _commissions
        : _commissions.where((c) => c['status'] == _selectedFilter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'My Commissions',
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Colors.black),
            onPressed: () {
              // TODO: Navigate to search artists or commission request
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          Expanded(
            child: filteredCommissions.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredCommissions.length,
                    itemBuilder: (context, index) {
                      final commission = filteredCommissions[index];
                      return _buildCommissionCard(commission);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _filters.length,
        itemBuilder: (context, index) {
          final filter = _filters[index];
          final isSelected = _selectedFilter == filter;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedFilter = filter;
                });
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected
                        ? const Color.fromARGB(255, 255, 60, 60)
                        : Colors.grey[300]!,
                  ),
                ),
                child: Text(
                  filter,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.black,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.assignment_outlined,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No commissions found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Start by requesting a commission from an artist',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              // TODO: Navigate to artist search
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color.fromARGB(255, 255, 60, 60),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Find Artists'),
          ),
        ],
      ),
    );
  }

  Widget _buildCommissionCard(Map<String, dynamic> commission) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: NetworkImage(commission['artistAvatar']),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        commission['title'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      Text(
                        'by ${commission['artistName']}',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                _buildStatusBadge(commission['status']),
              ],
            ),
          ),

          // Progress Bar (if in progress)
          if (commission['status'] == 'In Progress') ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Progress',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '${commission['progress']}%',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Color.fromARGB(255, 255, 60, 60),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  LinearProgressIndicator(
                    value: commission['progress'] / 100,
                    backgroundColor: Colors.grey[200],
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      Color.fromARGB(255, 255, 60, 60),
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ],

          // Latest Update
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Latest Update',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  commission['latestUpdate'],
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),

          // Details and Actions
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(12),
                bottomRight: Radius.circular(12),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Budget: ${CommissionUtils.formatPeso(commission['budget'])}',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color.fromARGB(255, 255, 60, 60),
                        ),
                      ),
                      Text(
                        'Deadline: ${commission['deadline']}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                _buildActionButton(commission),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color badgeColor;
    switch (status) {
      case 'Pending':
        badgeColor = Colors.orange;
        break;
      case 'In Progress':
        badgeColor = Colors.blue;
        break;
      case 'Awaiting Approval':
        badgeColor = Colors.purple;
        break;
      case 'Completed':
        badgeColor = Colors.green;
        break;
      case 'Cancelled':
        badgeColor = Colors.red;
        break;
      default:
        badgeColor = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: badgeColor.withOpacity(0.3)),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: badgeColor,
        ),
      ),
    );
  }

  Widget _buildActionButton(Map<String, dynamic> commission) {
    switch (commission['status']) {
      case 'Awaiting Approval':
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            OutlinedButton(
              onPressed: () => _requestRevision(commission['id']),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.grey[400]!),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              child: const Text(
                'Request Revision',
                style: TextStyle(fontSize: 12),
              ),
            ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: () => _approveWork(commission['id']),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4CAF50),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              child: const Text(
                'Approve',
                style: TextStyle(fontSize: 12),
              ),
            ),
          ],
        );
      case 'In Progress':
      case 'Pending':
        return OutlinedButton(
          onPressed: () => _viewDetails(commission['id']),
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
          child: const Text(
            'View Details',
            style: TextStyle(
              fontSize: 12,
              color: Color.fromARGB(255, 255, 60, 60),
            ),
          ),
        );
      case 'Completed':
        return OutlinedButton(
          onPressed: () => _rateArtist(commission['id']),
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: Colors.grey[400]!),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
          child: const Text(
            'Rate Artist',
            style: TextStyle(fontSize: 12),
          ),
        );
      default:
        return const SizedBox.shrink();
    }
  }

  void _approveWork(String commissionId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Approve Work'),
        content: const Text(
          'Are you satisfied with the submitted work? This will release the payment to the artist.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Implement work approval
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Work approved! Payment released to artist.'),
                  backgroundColor: Color(0xFF4CAF50),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4CAF50),
              foregroundColor: Colors.white,
            ),
            child: const Text('Approve'),
          ),
        ],
      ),
    );
  }

  void _requestRevision(String commissionId) {
    // TODO: Implement revision request
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Revision request sent to artist.'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _viewDetails(String commissionId) {
    // TODO: Navigate to commission details screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening commission details...'),
      ),
    );
  }

  void _rateArtist(String commissionId) {
    // TODO: Navigate to rating screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening rating screen...'),
      ),
    );
  }
}
