// Client-side environment configuration
export const env = {
  // Default to the current origin for API routes to handle both development and production
  NEXT_PUBLIC_API_URL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws',
  NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  NEXT_PUBLIC_GCASH_MERCHANT_ID: process.env.NEXT_PUBLIC_GCASH_MERCHANT_ID || '',
  NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',

} as const
