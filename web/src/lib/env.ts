// Client-side environment configuration
export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.brushandcoin.com/api/v1',
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.brushandcoin.com/ws',
  NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  NEXT_PUBLIC_GCASH_MERCHANT_ID: process.env.NEXT_PUBLIC_GCASH_MERCHANT_ID || '',
  NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const
