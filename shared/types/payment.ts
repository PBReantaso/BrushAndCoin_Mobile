export interface Payment {
  id: string;
  commissionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 
  | 'stripe'
  | 'paypal'
  | 'gcash'
  | 'paymaya'
  | 'bank_transfer';

export interface PaymentRequest {
  commissionId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  currency?: string;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    paymentId: string;
    redirectUrl?: string;
    clientSecret?: string;
  };
}

export interface EscrowPayment {
  id: string;
  commissionId: string;
  amount: number;
  status: 'held' | 'released' | 'refunded';
  releaseConditions: string[];
  createdAt: string;
  releasedAt?: string;
}
