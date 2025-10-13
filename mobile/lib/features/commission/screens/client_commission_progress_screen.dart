import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../shared/types/commission.dart';
import '../../../shared/utils/commission_utils.dart';
import '../../messaging/screens/chat_screen.dart';
import '../../../core/providers/messaging_provider.dart';

class ClientCommissionProgressScreen extends StatefulWidget {
  final CommissionRequest commissionRequest;

  const ClientCommissionProgressScreen({
    super.key,
    required this.commissionRequest,
  });

  @override
  State<ClientCommissionProgressScreen> createState() =>
      _ClientCommissionProgressScreenState();
}

class _ClientCommissionProgressScreenState
    extends State<ClientCommissionProgressScreen> {
  String _selectedTab = 'progress';
  bool _isApprovingWork = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text(
          'Commission Progress',
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
            onPressed: _navigateToChat,
            icon: const Icon(Icons.message, color: Colors.white),
          ),
        ],
      ),
      body: Column(
        children: [
          // Header with commission info
          _buildHeader(),

          // Tab navigation
          _buildTabNavigation(),

          // Content based on selected tab
          Expanded(
            child: _selectedTab == 'progress'
                ? _buildProgressTab()
                : _buildDetailsTab(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    final pricing = CommissionUtils.calculatePricing(
      widget.commissionRequest.budget,
      isUrgent: widget.commissionRequest.isUrgent,
    );

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
              // Artist Avatar
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: widget.commissionRequest.artistAvatar != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(25),
                        child: Image.network(
                          widget.commissionRequest.artistAvatar!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(
                              Icons.person,
                              color: Color.fromARGB(255, 255, 60, 60),
                              size: 24,
                            );
                          },
                        ),
                      )
                    : const Icon(
                        Icons.person,
                        color: Color.fromARGB(255, 255, 60, 60),
                        size: 24,
                      ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.commissionRequest.artistName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      widget.commissionRequest.title,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              // Status Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  CommissionUtils.getStatusDisplayText(
                          widget.commissionRequest.status)
                      .toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: _getStatusColor(widget.commissionRequest.status),
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
                'Total: ${CommissionUtils.formatPeso(pricing.totalAmount)}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Due: ${CommissionUtils.formatDate(widget.commissionRequest.deadline)}',
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
              onTap: () => setState(() => _selectedTab = 'progress'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _selectedTab == 'progress'
                      ? const Color.fromARGB(255, 255, 60, 60)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Progress',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: _selectedTab == 'progress'
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
        ],
      ),
    );
  }

  Widget _buildProgressTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Progress Timeline
          _buildProgressTimeline(),

          const SizedBox(height: 24),

          // Current Status
          _buildCurrentStatus(),

          const SizedBox(height: 24),

          // Work Submission (if applicable)
          if (widget.commissionRequest.status == CommissionStatus.accepted)
            _buildWorkSubmission(),

          const SizedBox(height: 24),

          // Actions
          _buildClientActions(),
        ],
      ),
    );
  }

  Widget _buildProgressTimeline() {
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
            'Commission Timeline',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 20),

          // Timeline Steps
          _buildTimelineStep(
            'Commission Requested',
            'You requested this commission',
            CommissionUtils.formatDate(widget.commissionRequest.createdAt),
            true,
            Icons.send,
          ),
          _buildTimelineStep(
            'Artist Review',
            'Artist is reviewing your request',
            widget.commissionRequest.status == CommissionStatus.accepted
                ? CommissionUtils.formatDate(widget.commissionRequest.updatedAt)
                : null,
            widget.commissionRequest.status != CommissionStatus.pending,
            Icons.person_search,
          ),
          _buildTimelineStep(
            'Commission Accepted',
            'Artist accepted your commission',
            widget.commissionRequest.status == CommissionStatus.accepted
                ? CommissionUtils.formatDate(widget.commissionRequest.updatedAt)
                : null,
            widget.commissionRequest.status == CommissionStatus.accepted,
            Icons.check_circle,
          ),
          _buildTimelineStep(
            'Work in Progress',
            'Artist is working on your commission',
            null,
            false, // This would be true when work is being created
            Icons.brush,
          ),
          _buildTimelineStep(
            'Work Submitted',
            'Artist submitted work for your approval',
            '2 hours ago', // Show that work was submitted
            true, // Work has been submitted
            Icons.upload,
          ),
          _buildTimelineStep(
            'Commission Complete',
            'Commission completed successfully',
            null,
            widget.commissionRequest.status == CommissionStatus.completed,
            Icons.done_all,
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineStep(String title, String description, String? date,
      bool isCompleted, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isCompleted
                  ? const Color.fromARGB(255, 255, 60, 60)
                  : const Color(0xFFE0E0E0),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: isCompleted ? Colors.white : const Color(0xFF9E9E9E),
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
                    color: isCompleted ? Colors.black : const Color(0xFF9E9E9E),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 12,
                    color: isCompleted
                        ? const Color(0xFF6B7280)
                        : const Color(0xFF9E9E9E),
                  ),
                ),
                if (date != null) ...[
                  const SizedBox(height: 2),
                  Text(
                    date,
                    style: TextStyle(
                      fontSize: 11,
                      color: isCompleted
                          ? const Color(0xFF9E9E9E)
                          : const Color(0xFFB0B0B0),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentStatus() {
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
            'Current Status',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _getStatusColor(widget.commissionRequest.status)
                  .withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: _getStatusColor(widget.commissionRequest.status)
                    .withOpacity(0.3),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  _getStatusIcon(widget.commissionRequest.status),
                  color: _getStatusColor(widget.commissionRequest.status),
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        CommissionUtils.getStatusDisplayText(
                            widget.commissionRequest.status),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color:
                              _getStatusColor(widget.commissionRequest.status),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _getStatusDescription(widget.commissionRequest.status),
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkSubmission() {
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
            'Submitted Work',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),

          // Sample submitted work
          Container(
            width: double.infinity,
            height: 200,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE0E0E0)),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Stack(
                children: [
                  // Sample artwork - using a gradient to simulate an artistic piece
                  Container(
                    width: double.infinity,
                    height: double.infinity,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFF667eea),
                          Color(0xFF764ba2),
                          Color(0xFFf093fb),
                          Color(0xFFf5576c),
                        ],
                        stops: [0.0, 0.3, 0.7, 1.0],
                      ),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.brush,
                        size: 48,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  // Overlay with artwork info
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withOpacity(0.7),
                          ],
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Sample Commission Work',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Submitted ${_getTimeAgo()}',
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  // Status badge
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.orange,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'AWAITING APPROVAL',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Approval buttons (when work is submitted)
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    _showApprovalDialog(false);
                  },
                  icon: const Icon(Icons.close, color: Colors.red),
                  label: const Text(
                    'Request Revision',
                    style: TextStyle(color: Colors.red),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.red),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _isApprovingWork
                      ? null
                      : () {
                          _showApprovalDialog(true);
                        },
                  icon: _isApprovingWork
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.check, color: Colors.white),
                  label: Text(
                    _isApprovingWork ? 'Approving...' : 'Approve Work',
                    style: const TextStyle(color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4CAF50),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildClientActions() {
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

          // Message Artist Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _navigateToChat,
              icon: const Icon(Icons.message, color: Colors.white),
              label: const Text(
                'Message Artist',
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

          // Cancel Commission Button (if still pending)
          if (widget.commissionRequest.status == CommissionStatus.pending)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  _showCancelDialog();
                },
                icon: const Icon(Icons.cancel, color: Colors.red),
                label: const Text(
                  'Cancel Commission',
                  style: TextStyle(color: Colors.red),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
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

  Widget _buildDetailsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Commission Details
          Container(
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
                  'Commission Details',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 16),
                _buildInfoRow('Title', widget.commissionRequest.title),
                _buildInfoRow(
                    'Description', widget.commissionRequest.description),
                _buildInfoRow(
                    'Category',
                    CommissionUtils.getCategoryDisplayName(
                        widget.commissionRequest.category)),
                _buildInfoRow(
                    'Deadline',
                    CommissionUtils.formatDate(
                        widget.commissionRequest.deadline)),
                _buildInfoRow(
                    'Urgent', widget.commissionRequest.isUrgent ? 'Yes' : 'No'),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Pricing Breakdown
          _buildPricingBreakdown(),
        ],
      ),
    );
  }

  Widget _buildPricingBreakdown() {
    final pricing = CommissionUtils.calculatePricing(
      widget.commissionRequest.budget,
      isUrgent: widget.commissionRequest.isUrgent,
    );

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
            'Pricing Breakdown',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow(
              'Base Budget', CommissionUtils.formatPeso(pricing.budget)),
          if (widget.commissionRequest.isUrgent)
            _buildInfoRow('Urgency Fee (20%)',
                CommissionUtils.formatPeso(pricing.urgencyFee)),
          _buildInfoRow('Platform Fee (5%)',
              CommissionUtils.formatPeso(pricing.platformFee)),
          const Divider(),
          _buildInfoRow(
              'Total Amount', CommissionUtils.formatPeso(pricing.totalAmount),
              isTotal: true),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: isTotal ? Colors.black : const Color(0xFF6B7280),
              fontWeight: isTotal ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              color: isTotal
                  ? const Color.fromARGB(255, 255, 60, 60)
                  : Colors.black,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToChat() {
    final messagingProvider =
        Provider.of<MessagingProvider>(context, listen: false);
    messagingProvider.createOrGetConversation(
      userName: widget.commissionRequest.artistName,
      userId: widget.commissionRequest.artistId,
      userAvatar: widget.commissionRequest.artistAvatar,
    );

    final userData = {
      'userName': widget.commissionRequest.artistName,
      'userId': widget.commissionRequest.artistId,
      'userAvatar': widget.commissionRequest.artistAvatar,
    };

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => ChatScreen(user: userData),
      ),
    );
  }

  void _showApprovalDialog(bool isApproval) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isApproval ? 'Approve Work' : 'Request Revision'),
        content: Text(isApproval
            ? 'Are you satisfied with the submitted work? This will complete the commission and release payment to the artist.'
            : 'Would you like to request changes to the submitted work? The artist will be notified and can make revisions.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _handleWorkApproval(isApproval);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor:
                  isApproval ? const Color(0xFF4CAF50) : Colors.orange,
            ),
            child: Text(
              isApproval ? 'Approve' : 'Request Revision',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Commission'),
        content: const Text(
            'Are you sure you want to cancel this commission request? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Keep Request'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _handleCancelCommission();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text(
              'Cancel Commission',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleWorkApproval(bool isApproval) async {
    setState(() {
      _isApprovingWork = true;
    });

    try {
      // TODO: Implement actual API call for work approval/revision
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(isApproval
                ? 'Work approved! Commission completed successfully.'
                : 'Revision requested. Artist will be notified.'),
            backgroundColor:
                isApproval ? const Color(0xFF4CAF50) : Colors.orange,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isApprovingWork = false;
        });
      }
    }
  }

  Future<void> _handleCancelCommission() async {
    try {
      // TODO: Implement actual API call for commission cancellation
      await Future.delayed(const Duration(seconds: 1));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Commission request cancelled.'),
            backgroundColor: Colors.orange,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error cancelling commission: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Color _getStatusColor(CommissionStatus status) {
    switch (status) {
      case CommissionStatus.pending:
        return const Color(0xFF856404);
      case CommissionStatus.accepted:
        return const Color(0xFF155724);
      case CommissionStatus.declined:
        return const Color(0xFF721C24);
      case CommissionStatus.completed:
        return const Color(0xFF0C5460);
      default:
        return const Color(0xFF6C757D);
    }
  }

  IconData _getStatusIcon(CommissionStatus status) {
    switch (status) {
      case CommissionStatus.pending:
        return Icons.schedule;
      case CommissionStatus.accepted:
        return Icons.check_circle;
      case CommissionStatus.declined:
        return Icons.cancel;
      case CommissionStatus.completed:
        return Icons.done_all;
      default:
        return Icons.help;
    }
  }

  String _getStatusDescription(CommissionStatus status) {
    switch (status) {
      case CommissionStatus.pending:
        return 'Waiting for artist to review your request';
      case CommissionStatus.accepted:
        return 'Artist is working on your commission';
      case CommissionStatus.declined:
        return 'Artist declined your commission request';
      case CommissionStatus.completed:
        return 'Commission completed successfully';
      default:
        return 'Unknown status';
    }
  }

  String _getTimeAgo() {
    // Simulate work submitted 2 hours ago
    final submittedTime = DateTime.now().subtract(const Duration(hours: 2));
    final now = DateTime.now();
    final difference = now.difference(submittedTime);

    if (difference.inHours < 1) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else {
      return '${difference.inDays} days ago';
    }
  }
}
