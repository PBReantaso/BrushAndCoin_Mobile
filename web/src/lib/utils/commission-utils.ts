// Commission Utility Functions for Web

import { CommissionStatus, EscrowStatus, PaymentMethod, CommissionCategory, Commission } from '@/types';

export interface CommissionPricing {
  budget: number;
  urgencyFee: number;
  platformFee: number;
  totalAmount: number;
}

export class CommissionUtils {
  /// Calculate commission pricing breakdown
  static calculatePricing(budget: number, isUrgent: boolean = false): CommissionPricing {
    const urgencyFee = isUrgent ? budget * 0.2 : 0.0;
    const subtotal = budget + urgencyFee;
    const platformFee = subtotal * 0.05;
    const totalAmount = subtotal + platformFee;

    return {
      budget,
      urgencyFee,
      platformFee,
      totalAmount,
    };
  }

  /// Format currency with peso symbol
  static formatPeso(amount: number): string {
    return `₱${amount.toFixed(2)}`;
  }

  /// Get status badge color
  static getStatusColor(status: CommissionStatus): string {
    switch (status) {
      case CommissionStatus.PENDING:
        return '#FF9800'; // Orange
      case CommissionStatus.ACCEPTED:
        return '#4CAF50'; // Green
      case CommissionStatus.IN_PROGRESS:
        return '#2196F3'; // Blue
      case CommissionStatus.AWAITING_APPROVAL:
        return '#9C27B0'; // Purple
      case CommissionStatus.COMPLETED:
        return '#4CAF50'; // Green
      case CommissionStatus.CANCELLED:
        return '#F44336'; // Red
      case CommissionStatus.DECLINED:
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  }

  /// Get escrow status color
  static getEscrowStatusColor(status: EscrowStatus): string {
    switch (status) {
      case EscrowStatus.PENDING:
        return '#FF9800'; // Orange
      case EscrowStatus.HELD:
        return '#2196F3'; // Blue
      case EscrowStatus.RELEASED:
        return '#4CAF50'; // Green
      case EscrowStatus.REFUNDED:
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  }

  /// Get payment method display name
  static getPaymentMethodDisplayName(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.GCASH:
        return 'GCash';
      case PaymentMethod.PAYMAYA:
        return 'PayMaya';
      case PaymentMethod.PAYPAL:
        return 'PayPal';
      case PaymentMethod.STRIPE:
        return 'Stripe';
      default:
        return 'Unknown';
    }
  }

  /// Get category display name
  static getCategoryDisplayName(category: CommissionCategory): string {
    switch (category) {
      case CommissionCategory.DIGITAL_ART:
        return 'Digital Art';
      case CommissionCategory.TRADITIONAL_ART:
        return 'Traditional Art';
      case CommissionCategory.PORTRAIT:
        return 'Portrait';
      case CommissionCategory.CHARACTER_DESIGN:
        return 'Character Design';
      case CommissionCategory.LOGO_DESIGN:
        return 'Logo Design';
      case CommissionCategory.ILLUSTRATION:
        return 'Illustration';
      case CommissionCategory.PHOTOGRAPHY:
        return 'Photography';
      case CommissionCategory.OTHER:
        return 'Other';
      default:
        return 'Unknown';
    }
  }

  /// Calculate days until deadline
  static getDaysUntilDeadline(deadline: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /// Check if deadline is approaching (within 3 days)
  static isDeadlineApproaching(deadline: Date): boolean {
    const days = this.getDaysUntilDeadline(deadline);
    return days <= 3 && days >= 0;
  }

  /// Check if deadline has passed
  static isDeadlinePassed(deadline: Date): boolean {
    return this.getDaysUntilDeadline(deadline) < 0;
  }

  /// Format date for display
  static formatDate(date: Date): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  /// Format date with time for display
  static formatDateTime(date: Date): string {
    const formattedDate = this.formatDate(date);
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} ${hour}:${minute}`;
  }

  /// Check if commission can be cancelled
  static canCancelCommission(commission: Commission): boolean {
    return commission.status === CommissionStatus.PENDING ||
      commission.status === CommissionStatus.ACCEPTED;
  }

  /// Check if work can be submitted
  static canSubmitWork(commission: Commission): boolean {
    return commission.status === CommissionStatus.IN_PROGRESS;
  }

  /// Check if work can be approved
  static canApproveWork(commission: Commission): boolean {
    return commission.status === CommissionStatus.AWAITING_APPROVAL;
  }

  /// Check if revision can be requested
  static canRequestRevision(commission: Commission): boolean {
    return commission.status === CommissionStatus.AWAITING_APPROVAL;
  }

  /// Get commission progress percentage
  static getCommissionProgress(commission: Commission): number {
    return commission.progress;
  }

  /// Check if escrow payment is secure
  static isEscrowSecure(commission: Commission): boolean {
    return commission.escrowStatus === EscrowStatus.HELD;
  }

  /// Get commission status display text
  static getStatusDisplayText(status: CommissionStatus): string {
    switch (status) {
      case CommissionStatus.PENDING:
        return 'Pending';
      case CommissionStatus.ACCEPTED:
        return 'Accepted';
      case CommissionStatus.IN_PROGRESS:
        return 'In Progress';
      case CommissionStatus.AWAITING_APPROVAL:
        return 'Awaiting Approval';
      case CommissionStatus.COMPLETED:
        return 'Completed';
      case CommissionStatus.CANCELLED:
        return 'Cancelled';
      case CommissionStatus.DECLINED:
        return 'Declined';
      default:
        return 'Unknown';
    }
  }

  /// Validate commission budget
  static validateBudget(budget: number): { isValid: boolean; message?: string } {
    if (budget <= 0) {
      return { isValid: false, message: 'Budget must be greater than 0' };
    }
    if (budget < 100) {
      return { isValid: false, message: 'Minimum budget is ₱100' };
    }
    if (budget > 100000) {
      return { isValid: false, message: 'Maximum budget is ₱100,000' };
    }
    return { isValid: true };
  }

  /// Validate commission deadline
  static validateDeadline(deadline: Date): { isValid: boolean; message?: string } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDeadline = new Date(today);
    minDeadline.setDate(minDeadline.getDate() + 7);

    if (deadline.getTime() <= today.getTime()) {
      return { isValid: false, message: 'Deadline must be in the future' };
    }
    if (deadline.getTime() < minDeadline.getTime()) {
      return {
        isValid: false,
        message: 'Minimum deadline is 7 days from now'
      };
    }
    const maxDeadline = new Date(today);
    maxDeadline.setDate(maxDeadline.getDate() + 365);
    if (deadline.getTime() > maxDeadline.getTime()) {
      return {
        isValid: false,
        message: 'Maximum deadline is 1 year from now'
      };
    }
    return { isValid: true };
  }

  /// Get all commission categories
  static getAllCategories(): CommissionCategory[] {
    return Object.values(CommissionCategory);
  }

  /// Get all payment methods
  static getAllPaymentMethods(): PaymentMethod[] {
    return Object.values(PaymentMethod);
  }

  /// Get category from string
  static getCategoryFromString(categoryString: string): CommissionCategory {
    const normalized = categoryString.toLowerCase().replace(/\s+/g, '_');
    const found = Object.values(CommissionCategory).find(
      (category) => String(category).toLowerCase() === normalized
    );
    return found || CommissionCategory.OTHER;
  }

  /// Get payment method from string
  static getPaymentMethodFromString(methodString: string): PaymentMethod {
    const normalized = methodString.toLowerCase();
    const found = Object.values(PaymentMethod).find(
      (method) => String(method).toLowerCase() === normalized
    );
    return found || PaymentMethod.GCASH;
  }
}
