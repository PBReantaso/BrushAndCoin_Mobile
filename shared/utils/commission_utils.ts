// Shared Commission Utility Functions for Mobile and Web

import { 
  Commission, 
  CommissionRequest, 
  CommissionStatus, 
  CommissionCategory, 
  EscrowStatus,
  PaymentMethod 
} from '../types/commission';

/**
 * Calculate commission pricing breakdown
 */
export function calculateCommissionPricing(budget: number, isUrgent: boolean = false) {
  const urgencyFee = isUrgent ? budget * 0.2 : 0;
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

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'PHP'): string {
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Format currency with peso symbol
 */
export function formatPeso(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: CommissionStatus): string {
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
      return '#757575'; // Grey
  }
}

/**
 * Get escrow status color
 */
export function getEscrowStatusColor(status: EscrowStatus): string {
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
      return '#757575'; // Grey
  }
}

/**
 * Get payment method display name
 */
export function getPaymentMethodDisplayName(method: PaymentMethod): string {
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

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: CommissionCategory): string {
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

/**
 * Calculate days until deadline
 */
export function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if deadline is approaching (within 3 days)
 */
export function isDeadlineApproaching(deadline: string): boolean {
  return getDaysUntilDeadline(deadline) <= 3 && getDaysUntilDeadline(deadline) >= 0;
}

/**
 * Check if deadline has passed
 */
export function isDeadlinePassed(deadline: string): boolean {
  return getDaysUntilDeadline(deadline) < 0;
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time for display
 */
export function formatDateTime(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if commission can be cancelled
 */
export function canCancelCommission(commission: Commission): boolean {
  return commission.status === CommissionStatus.PENDING || 
         commission.status === CommissionStatus.ACCEPTED;
}

/**
 * Check if work can be submitted
 */
export function canSubmitWork(commission: Commission): boolean {
  return commission.status === CommissionStatus.IN_PROGRESS;
}

/**
 * Check if work can be approved
 */
export function canApproveWork(commission: Commission): boolean {
  return commission.status === CommissionStatus.AWAITING_APPROVAL;
}

/**
 * Check if revision can be requested
 */
export function canRequestRevision(commission: Commission): boolean {
  return commission.status === CommissionStatus.AWAITING_APPROVAL;
}

/**
 * Get commission progress percentage
 */
export function getCommissionProgress(commission: Commission): number {
  return commission.progress || 0;
}

/**
 * Check if escrow payment is secure
 */
export function isEscrowSecure(commission: Commission): boolean {
  return commission.escrowStatus === EscrowStatus.HELD;
}

/**
 * Get commission status display text
 */
export function getStatusDisplayText(status: CommissionStatus): string {
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

/**
 * Validate commission budget
 */
export function validateBudget(budget: number): { isValid: boolean; message?: string } {
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

/**
 * Validate commission deadline
 */
export function validateDeadline(deadline: string): { isValid: boolean; message?: string } {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const minDeadline = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  if (deadlineDate <= today) {
    return { isValid: false, message: 'Deadline must be in the future' };
  }
  if (deadlineDate < minDeadline) {
    return { isValid: false, message: 'Minimum deadline is 7 days from now' };
  }
  if (deadlineDate > new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000)) {
    return { isValid: false, message: 'Maximum deadline is 1 year from now' };
  }
  return { isValid: true };
}
