// Client-side environment configuration
// Prefer a safe default for client API URL. If env points to a Neon Data API REST endpoint
// the frontend should not call it directly (it requires server-side credentials).
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
let clientApiUrl = rawApiUrl
if (/neon|apirest|\.neon\.tech/.test(String(rawApiUrl))) {
  console.warn('NEXT_PUBLIC_API_URL looks like a Neon Data API endpoint; falling back to http://localhost:3000 for client API calls')
  clientApiUrl = 'http://localhost:3000'
}

export const env = {
  NEXT_PUBLIC_API_URL: clientApiUrl,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws',
  NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || '',
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  NEXT_PUBLIC_GCASH_MERCHANT_ID: process.env.NEXT_PUBLIC_GCASH_MERCHANT_ID || '',
  NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',

} as const
