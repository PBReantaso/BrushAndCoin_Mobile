// Commission Types for Web

export enum CommissionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  AWAITING_APPROVAL = 'awaiting_approval',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DECLINED = 'declined',
}

export enum PaymentMethod {
  GCASH = 'gcash',
  PAYMAYA = 'paymaya',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

export enum CommissionCategory {
  DIGITAL_ART = 'digital_art',
  TRADITIONAL_ART = 'traditional_art',
  PORTRAIT = 'portrait',
  CHARACTER_DESIGN = 'character_design',
  LOGO_DESIGN = 'logo_design',
  ILLUSTRATION = 'illustration',
  PHOTOGRAPHY = 'photography',
  OTHER = 'other',
}

export interface CommissionRequest {
  id: string;
  title: string;
  description: string;
  category: CommissionCategory;
  budget: number;
  deadline: string; // ISO date string
  requirements?: string;
  isUrgent: boolean;
  referenceImages?: string[]; // URLs to reference images
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  artistId: string;
  artistName: string;
  artistAvatar?: string;
  status: CommissionStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Commission {
  id: string;
  title: string;
  description: string;
  category: CommissionCategory;
  budget: number;
  isUrgent?: boolean;
  urgencyFee?: number;
  platformFee: number;
  totalAmount: number;
  deadline: string; // ISO date string
  requirements?: string;
  referenceImages?: string[];
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  artistId: string;
  artistName: string;
  artistAvatar?: string;
  status: CommissionStatus;
  paymentMethod?: PaymentMethod;
  escrowStatus: EscrowStatus;
  progress: number; // 0-100
  latestUpdate?: string;
  workSubmission?: WorkSubmission;
  revisions: Revision[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export enum EscrowStatus {
  PENDING = 'pending',
  HELD = 'held',
  RELEASED = 'released',
  REFUNDED = 'refunded',
}

export interface WorkSubmission {
  id: string;
  commissionId: string;
  workUrl: string;
  description?: string;
  submittedAt: string; // ISO date string
  status: 'pending' | 'approved' | 'revision_requested';
}

export interface Revision {
  id: string;
  commissionId: string;
  feedback: string;
  requestedBy: string; // clientId or artistId
  requestedAt: string; // ISO date string
  resolved: boolean;
  resolvedAt?: string; // ISO date string
}

export interface EscrowPayment {
  id: string;
  commissionId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  gatewayTransactionId?: string;
  status: EscrowStatus;
  heldAt?: string; // ISO date string
  releasedAt?: string; // ISO date string
  refundedAt?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface CommissionFilters {
  status?: CommissionStatus;
  category?: CommissionCategory;
  minBudget?: number;
  maxBudget?: number;
  isUrgent?: boolean;
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
}

export interface CreateCommissionRequest {
  title: string;
  description: string;
  category: CommissionCategory;
  budget: number;
  deadline: string; // ISO date string
  requirements?: string;
  isUrgent?: boolean;
  referenceImages?: File[]; // For upload
  artistId: string;
}

export interface AcceptCommissionRequest {
  commissionId: string;
  paymentMethod: PaymentMethod;
  message?: string;
}

export interface DeclineCommissionRequest {
  commissionId: string;
  reason: string;
}

export interface SubmitWorkRequest {
  commissionId: string;
  workUrl: string;
  description?: string;
}

export interface ApproveWorkRequest {
  commissionId: string;
  feedback?: string;
}

export interface RequestRevisionRequest {
  commissionId: string;
  feedback: string;
}

// API Response Types
export interface CommissionResponse {
  success: boolean;
  data: Commission;
  message?: string;
}

export interface CommissionListResponse {
  success: boolean;
  data: Commission[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface EscrowStatusResponse {
  success: boolean;
  data: EscrowPayment;
  message?: string;
}
