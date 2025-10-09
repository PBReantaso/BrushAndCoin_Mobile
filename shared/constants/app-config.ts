export const APP_CONFIG = {
  // App Information
  NAME: 'Brush&Coin',
  DESCRIPTION: 'Mobile application for artists and creative professionals',
  VERSION: '1.0.0',
  
  // API Configuration
  API_BASE_URL: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'https://api.brushandcoin.com/api/v1',
  WS_URL: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WS_URL) || 'wss://api.brushandcoin.com/ws',
  
  // Development API
  DEV_API_BASE_URL: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEV_API_URL) || 'https://dev-api.brushandcoin.com/api/v1',
  DEV_WS_URL: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEV_WS_URL) || 'wss://dev-api.brushandcoin.com/ws',
  
  // Payment Gateway Configuration
  STRIPE_PUBLISHABLE_KEY: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STRIPE_KEY) || 'pk_test_your_stripe_publishable_key',
  PAYPAL_CLIENT_ID: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PAYPAL_CLIENT_ID) || 'your_paypal_client_id',
  GCASH_MERCHANT_ID: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GCASH_MERCHANT_ID) || 'your_gcash_merchant_id',
  PAYMAYA_PUBLIC_KEY: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY) || 'your_paymaya_public_key',
  
  // File Upload Configuration
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt'],
  
  // UI Configuration
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEBOUNCE_DELAY: 300, // milliseconds
  
  // Validation Rules
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  BIO_MAX_LENGTH: 500,
  MESSAGE_MAX_LENGTH: 1000,
  MAX_SPECIALIZATIONS: 5,
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  UPLOAD_TIMEOUT: 120000, // 2 minutes
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
  
  // Cache Configuration
  IMAGE_CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  API_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  
  // Rate Limiting
  MAX_REQUESTS_PER_MINUTE: 100,
  MAX_UPLOADS_PER_HOUR: 50,
  
  // Default Values
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_CURRENCY: 'PHP',
  DEFAULT_TIMEZONE: 'Asia/Manila',
  
  // Feature Flags
  ENABLE_LOCATION_SERVICES: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  
  // Security
  ENABLE_SSL: true,
  ENABLE_CERTIFICATE_PINNING: false, // Disabled for web
  
  // Debug Configuration
  ENABLE_DEBUG_LOGGING: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'),
  ENABLE_NETWORK_LOGGING: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'),
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Environment Detection
  IS_DEVELOPMENT: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'),
  IS_PRODUCTION: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'),
} as const;

// Dynamic configuration based on environment
export const getCurrentApiBaseUrl = () => {
  return APP_CONFIG.IS_DEVELOPMENT ? APP_CONFIG.DEV_API_BASE_URL : APP_CONFIG.API_BASE_URL;
};

export const getCurrentWsUrl = () => {
  return APP_CONFIG.IS_DEVELOPMENT ? APP_CONFIG.DEV_WS_URL : APP_CONFIG.WS_URL;
};
