import 'package:flutter/material.dart';

class CommissionDetailsScreen extends StatefulWidget {
  final String commissionId;

  const CommissionDetailsScreen({
    super.key,
    required this.commissionId,
  });

  @override
  State<CommissionDetailsScreen> createState() =>
      _CommissionDetailsScreenState();
}

class _CommissionDetailsScreenState extends State<CommissionDetailsScreen> {
  String _selectedTab = 'details';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Commission Details',
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.black),
            onPressed: () => _showOptionsMenu(),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildTabBar(),
          Expanded(
            child: _selectedTab == 'details'
                ? _buildDetailsTab()
                : _selectedTab == 'progress'
                    ? _buildProgressTab()
                    : _buildPaymentTab(),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
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
          _buildTab('Details', 'details'),
          _buildTab('Progress', 'progress'),
          _buildTab('Payment', 'payment'),
        ],
      ),
    );
  }

  Widget _buildTab(String title, String tabId) {
    final isSelected = _selectedTab == tabId;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedTab = tabId;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color.fromARGB(255, 255, 60, 60)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : Colors.black,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDetailsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildCommissionInfo(),
          const SizedBox(height: 16),
          _buildClientInfo(),
          const SizedBox(height: 16),
          _buildTimeline(),
        ],
      ),
    );
  }

  Widget _buildProgressTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildMilestones(),
          const SizedBox(height: 16),
          _buildDeliverables(),
        ],
      ),
    );
  }

  Widget _buildPaymentTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildEscrowStatus(),
          const SizedBox(height: 16),
          _buildPaymentHistory(),
          const SizedBox(height: 16),
          _buildPaymentActions(),
        ],
      ),
    );
  }

  Widget _buildCommissionInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Commission Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Title', 'Digital Portrait Commission'),
          _buildInfoRow(
              'Description', 'A custom digital portrait in anime style'),
          _buildInfoRow('Budget', '₱2,500.00'),
          _buildInfoRow('Status', 'In Progress', statusColor: Colors.orange),
          _buildInfoRow('Deadline', 'Dec 25, 2024'),
          _buildInfoRow('Created', 'Dec 10, 2024'),
        ],
      ),
    );
  }

  Widget _buildClientInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Client Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundImage:
                    NetworkImage('https://i.pravatar.cc/150?img=3'),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Alice Johnson',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      '@alice_j',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              OutlinedButton(
                onPressed: () {
                  // TODO: Navigate to chat
                },
                style: OutlinedButton.styleFrom(
                  side:
                      const BorderSide(color: Color.fromARGB(255, 255, 60, 60)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
                child: const Text(
                  'Message',
                  style: TextStyle(
                    color: Color.fromARGB(255, 255, 60, 60),
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimeline() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Timeline',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildTimelineItem(
            'Commission Accepted',
            'Dec 10, 2024 at 2:30 PM',
            Icons.check_circle,
            const Color(0xFF4CAF50),
            true,
          ),
          _buildTimelineItem(
            'Payment Processed',
            'Dec 10, 2024 at 2:45 PM',
            Icons.payment,
            const Color(0xFF2196F3),
            true,
          ),
          _buildTimelineItem(
            'Work Started',
            'Dec 11, 2024 at 9:00 AM',
            Icons.play_circle,
            const Color(0xFFFF9800),
            true,
          ),
          _buildTimelineItem(
            'Work Completed',
            'Expected: Dec 20, 2024',
            Icons.assignment_turned_in,
            Colors.grey,
            false,
          ),
          _buildTimelineItem(
            'Payment Released',
            'After client approval',
            Icons.account_balance_wallet,
            Colors.grey,
            false,
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(String title, String subtitle, IconData icon,
      Color color, bool isCompleted) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isCompleted ? color : Colors.grey[300],
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 16,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isCompleted ? Colors.black : Colors.grey[600],
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMilestones() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Milestones',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildMilestoneItem('Initial Sketch', 'Completed', true),
          _buildMilestoneItem('Client Approval', 'Completed', true),
          _buildMilestoneItem('Detailed Drawing', 'In Progress', false),
          _buildMilestoneItem('Final Coloring', 'Pending', false),
          _buildMilestoneItem('Final Delivery', 'Pending', false),
        ],
      ),
    );
  }

  Widget _buildMilestoneItem(String title, String status, bool isCompleted) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isCompleted ? const Color(0xFFE8F5E8) : Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isCompleted ? const Color(0xFF4CAF50) : Colors.grey[300]!,
        ),
      ),
      child: Row(
        children: [
          Icon(
            isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
            color: isCompleted ? const Color(0xFF4CAF50) : Colors.grey[400],
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: isCompleted ? Colors.black : Colors.grey[600],
              ),
            ),
          ),
          Text(
            status,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: isCompleted ? const Color(0xFF4CAF50) : Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeliverables() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Deliverables',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildDeliverableItem('Initial Sketch', 'sketch.png', true),
          _buildDeliverableItem('Detailed Drawing', 'drawing.png', false),
          _buildDeliverableItem('Final Artwork', 'final.png', false),
        ],
      ),
    );
  }

  Widget _buildDeliverableItem(String title, String filename, bool isUploaded) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isUploaded ? const Color(0xFFE8F5E8) : Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isUploaded ? const Color(0xFF4CAF50) : Colors.grey[300]!,
        ),
      ),
      child: Row(
        children: [
          Icon(
            isUploaded ? Icons.check_circle : Icons.upload_file,
            color: isUploaded ? const Color(0xFF4CAF50) : Colors.grey[400],
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: isUploaded ? Colors.black : Colors.grey[600],
                  ),
                ),
                Text(
                  filename,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          if (isUploaded)
            const Icon(
              Icons.download,
              color: Color(0xFF4CAF50),
              size: 16,
            ),
        ],
      ),
    );
  }

  Widget _buildEscrowStatus() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Escrow Status',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFE3F2FD),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF2196F3)),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.security,
                  color: Color(0xFF2196F3),
                  size: 20,
                ),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'Payment Secured in Escrow',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF2196F3),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _buildInfoRow('Amount Held', '₱2,625.00'),
          _buildInfoRow('Platform Fee', '₱125.00'),
          _buildInfoRow('Artist Amount', '₱2,500.00'),
          _buildInfoRow('Release Condition', 'Client Approval'),
        ],
      ),
    );
  }

  Widget _buildPaymentHistory() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Payment History',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildPaymentItem(
              'Initial Payment', '₱2,625.00', 'Dec 10, 2024', 'Completed'),
          _buildPaymentItem(
              'Platform Fee', '₱125.00', 'Dec 10, 2024', 'Completed'),
          _buildPaymentItem(
              'Artist Payment', '₱2,500.00', 'Pending', 'Pending Release'),
        ],
      ),
    );
  }

  Widget _buildPaymentItem(
      String description, String amount, String date, String status) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                description,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),
              Text(
                date,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amount,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.black,
                ),
              ),
              Text(
                status,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: status == 'Completed'
                      ? const Color(0xFF4CAF50)
                      : Colors.orange,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentActions() {
    return Container(
      padding: const EdgeInsets.all(16),
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
          const Text(
            'Actions',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                // TODO: Submit work for approval
              },
              icon: const Icon(Icons.upload, color: Colors.white),
              label: const Text(
                'Submit Work for Approval',
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
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {Color? statusColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: statusColor ?? Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  void _showOptionsMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.message),
              title: const Text('Message Client'),
              onTap: () {
                Navigator.pop(context);
                // TODO: Navigate to chat
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit Commission'),
              onTap: () {
                Navigator.pop(context);
                // TODO: Edit commission
              },
            ),
            ListTile(
              leading: const Icon(Icons.cancel, color: Colors.red),
              title: const Text('Cancel Commission',
                  style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(context);
                // TODO: Cancel commission
              },
            ),
          ],
        ),
      ),
    );
  }
}
