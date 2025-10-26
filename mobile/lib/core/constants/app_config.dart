// App configuration constants for mobile app

class AppConfig {
  AppConfig._();

  // App Information
  static const String name = 'Brush&Coin';
  static const String description =
      'Mobile application for artists and creative professionals';
  static const String version = '1.0.0';

  // API Configuration
  static const String apiBaseUrl = 'https://api.brushandcoin.com';
  static const String wsUrl = 'wss://api.brushandcoin.com/ws';

  // Development API
  static const String devApiBaseUrl = 'https://dev-api.brushandcoin.com';
  static const String devWsUrl = 'wss://dev-api.brushandcoin.com/ws';

  // Payment Gateway Configuration
  static const String stripePublishableKey =
      'pk_test_your_stripe_publishable_key';
  static const String paypalClientId = 'your_paypal_client_id';
  static const String gcashMerchantId = 'your_gcash_merchant_id';
  static const String paymayaPublicKey = 'your_paymaya_public_key';

  // File Upload Configuration
  static const int maxImageSize = 10 * 1024 * 1024; // 10MB
  static const int maxFileSize = 50 * 1024 * 1024; // 50MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> allowedFileTypes = ['pdf', 'doc', 'docx', 'txt'];

  // UI Configuration
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  static const int debounceDelay = 300; // milliseconds

  // Validation Rules
  static const int passwordMinLength = 8;
  static const int usernameMinLength = 3;
  static const int usernameMaxLength = 20;
  static const int bioMaxLength = 500;
  static const int messageMaxLength = 1000;
  static const int maxSpecializations = 5;

  // Timeouts
  static const int apiTimeout = 30000; // 30 seconds
  static const int uploadTimeout = 120000; // 2 minutes
  static const int sessionTimeout = 60 * 60 * 1000; // 1 hour

  // Cache Configuration
  static const int imageCacheDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
  static const int apiCacheDuration = 5 * 60 * 1000; // 5 minutes
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB

  // Rate Limiting
  static const int maxRequestsPerMinute = 100;
  static const int maxUploadsPerHour = 50;

  // Default Values
  static const String defaultLanguage = 'en';
  static const String defaultCurrency = 'PHP';
  static const String defaultTimezone = 'Asia/Manila';

  // Feature Flags
  static const bool enableLocationServices = true;
  static const bool enablePushNotifications = true;
  static const bool enableAnalytics = true;
  static const bool enableCrashReporting = true;

  // Security
  static const bool enableSsl = true;
  static const bool enableCertificatePinning = true;

  // Debug Configuration (set based on build mode in production)
  static const bool enableDebugLogging = false;
  static const bool enableNetworkLogging = false;
  static const bool enablePerformanceMonitoring = true;
}
