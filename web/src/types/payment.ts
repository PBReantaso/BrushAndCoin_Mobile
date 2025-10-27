export interface Payment {
  id: string;
  commissionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string; // Will use PaymentMethod from commission.ts
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

export interface PaymentRequest {
  commissionId: string;
  amount: number;
  paymentMethod: string; // Will use PaymentMethod from commission.ts
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
