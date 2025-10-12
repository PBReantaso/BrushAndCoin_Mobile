// Shared Commission Utility Functions for Mobile App

import '../types/commission.dart';

class CommissionPricing {
  final double budget;
  final double urgencyFee;
  final double platformFee;
  final double totalAmount;

  CommissionPricing({
    required this.budget,
    required this.urgencyFee,
    required this.platformFee,
    required this.totalAmount,
  });
}

class CommissionUtils {
  /// Calculate commission pricing breakdown
  static CommissionPricing calculatePricing(double budget,
      {bool isUrgent = false}) {
    final urgencyFee = isUrgent ? budget * 0.2 : 0.0;
    final subtotal = budget + urgencyFee;
    final platformFee = subtotal * 0.05;
    final totalAmount = subtotal + platformFee;

    return CommissionPricing(
      budget: budget,
      urgencyFee: urgencyFee,
      platformFee: platformFee,
      totalAmount: totalAmount,
    );
  }

  /// Format currency with peso symbol
  static String formatPeso(double amount) {
    return '₱${amount.toStringAsFixed(2)}';
  }

  /// Get status badge color
  static String getStatusColor(CommissionStatus status) {
    switch (status) {
      case CommissionStatus.pending:
        return '#FF9800'; // Orange
      case CommissionStatus.accepted:
        return '#4CAF50'; // Green
      case CommissionStatus.inProgress:
        return '#2196F3'; // Blue
      case CommissionStatus.awaitingApproval:
        return '#9C27B0'; // Purple
      case CommissionStatus.completed:
        return '#4CAF50'; // Green
      case CommissionStatus.cancelled:
        return '#F44336'; // Red
      case CommissionStatus.declined:
        return '#F44336'; // Red
    }
  }

  /// Get escrow status color
  static String getEscrowStatusColor(EscrowStatus status) {
    switch (status) {
      case EscrowStatus.pending:
        return '#FF9800'; // Orange
      case EscrowStatus.held:
        return '#2196F3'; // Blue
      case EscrowStatus.released:
        return '#4CAF50'; // Green
      case EscrowStatus.refunded:
        return '#F44336'; // Red
    }
  }

  /// Get payment method display name
  static String getPaymentMethodDisplayName(PaymentMethod method) {
    switch (method) {
      case PaymentMethod.gcash:
        return 'GCash';
      case PaymentMethod.paymaya:
        return 'PayMaya';
      case PaymentMethod.paypal:
        return 'PayPal';
      case PaymentMethod.stripe:
        return 'Stripe';
    }
  }

  /// Get category display name
  static String getCategoryDisplayName(CommissionCategory category) {
    switch (category) {
      case CommissionCategory.digitalArt:
        return 'Digital Art';
      case CommissionCategory.traditionalArt:
        return 'Traditional Art';
      case CommissionCategory.portrait:
        return 'Portrait';
      case CommissionCategory.characterDesign:
        return 'Character Design';
      case CommissionCategory.logoDesign:
        return 'Logo Design';
      case CommissionCategory.illustration:
        return 'Illustration';
      case CommissionCategory.photography:
        return 'Photography';
      case CommissionCategory.other:
        return 'Other';
    }
  }

  /// Calculate days until deadline
  static int getDaysUntilDeadline(DateTime deadline) {
    final today = DateTime.now();
    final difference = deadline.difference(today).inDays;
    return difference;
  }

  /// Check if deadline is approaching (within 3 days)
  static bool isDeadlineApproaching(DateTime deadline) {
    final days = getDaysUntilDeadline(deadline);
    return days <= 3 && days >= 0;
  }

  /// Check if deadline has passed
  static bool isDeadlinePassed(DateTime deadline) {
    return getDaysUntilDeadline(deadline) < 0;
  }

  /// Format date for display
  static String formatDate(DateTime date) {
    final months = [
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
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  /// Format date with time for display
  static String formatDateTime(DateTime date) {
    final formattedDate = formatDate(date);
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$formattedDate $hour:$minute';
  }

  /// Check if commission can be cancelled
  static bool canCancelCommission(Commission commission) {
    return commission.status == CommissionStatus.pending ||
        commission.status == CommissionStatus.accepted;
  }

  /// Check if work can be submitted
  static bool canSubmitWork(Commission commission) {
    return commission.status == CommissionStatus.inProgress;
  }

  /// Check if work can be approved
  static bool canApproveWork(Commission commission) {
    return commission.status == CommissionStatus.awaitingApproval;
  }

  /// Check if revision can be requested
  static bool canRequestRevision(Commission commission) {
    return commission.status == CommissionStatus.awaitingApproval;
  }

  /// Get commission progress percentage
  static int getCommissionProgress(Commission commission) {
    return commission.progress;
  }

  /// Check if escrow payment is secure
  static bool isEscrowSecure(Commission commission) {
    return commission.escrowStatus == EscrowStatus.held;
  }

  /// Get commission status display text
  static String getStatusDisplayText(CommissionStatus status) {
    switch (status) {
      case CommissionStatus.pending:
        return 'Pending';
      case CommissionStatus.accepted:
        return 'Accepted';
      case CommissionStatus.inProgress:
        return 'In Progress';
      case CommissionStatus.awaitingApproval:
        return 'Awaiting Approval';
      case CommissionStatus.completed:
        return 'Completed';
      case CommissionStatus.cancelled:
        return 'Cancelled';
      case CommissionStatus.declined:
        return 'Declined';
    }
  }

  /// Validate commission budget
  static Map<String, dynamic> validateBudget(double budget) {
    if (budget <= 0) {
      return {'isValid': false, 'message': 'Budget must be greater than 0'};
    }
    if (budget < 100) {
      return {'isValid': false, 'message': 'Minimum budget is ₱100'};
    }
    if (budget > 100000) {
      return {'isValid': false, 'message': 'Maximum budget is ₱100,000'};
    }
    return {'isValid': true};
  }

  /// Validate commission deadline
  static Map<String, dynamic> validateDeadline(DateTime deadline) {
    final today = DateTime.now();
    final minDeadline = today.add(const Duration(days: 7));

    if (deadline.isBefore(today) || deadline.isAtSameMomentAs(today)) {
      return {'isValid': false, 'message': 'Deadline must be in the future'};
    }
    if (deadline.isBefore(minDeadline)) {
      return {
        'isValid': false,
        'message': 'Minimum deadline is 7 days from now'
      };
    }
    if (deadline.isAfter(today.add(const Duration(days: 365)))) {
      return {
        'isValid': false,
        'message': 'Maximum deadline is 1 year from now'
      };
    }
    return {'isValid': true};
  }

  /// Get all commission categories
  static List<CommissionCategory> getAllCategories() {
    return CommissionCategory.values;
  }

  /// Get all payment methods
  static List<PaymentMethod> getAllPaymentMethods() {
    return PaymentMethod.values;
  }

  /// Get category from string
  static CommissionCategory getCategoryFromString(String categoryString) {
    try {
      return CommissionCategory.values.firstWhere(
        (category) =>
            category.name == categoryString.toLowerCase().replaceAll(' ', ''),
      );
    } catch (e) {
      return CommissionCategory.other;
    }
  }

  /// Get payment method from string
  static PaymentMethod getPaymentMethodFromString(String methodString) {
    try {
      return PaymentMethod.values.firstWhere(
        (method) => method.name == methodString.toLowerCase(),
      );
    } catch (e) {
      return PaymentMethod.gcash;
    }
  }
}
