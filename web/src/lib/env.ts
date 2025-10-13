// Client-side environment configuration
export const env = {
  // NOTE: default to the site root (no /api/v1 suffix) so client code can call either
  // internal Next.js server routes (e.g. /api/...) or a proxied API without double-prefixing.
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws',
  NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  NEXT_PUBLIC_GCASH_MERCHANT_ID: process.env.NEXT_PUBLIC_GCASH_MERCHANT_ID || '',
  NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const
