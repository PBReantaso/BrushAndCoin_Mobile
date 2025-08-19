class Environment {
  // API Configuration
  static const String apiBaseUrl = 'https://api.brushandcoin.com/api/v1';
  static const String wsUrl = 'wss://api.brushandcoin.com/ws';
  static const String imageBaseUrl = 'https://cdn.brushandcoin.com';
  
  // Development API (for testing)
  static const String devApiBaseUrl = 'https://dev-api.brushandcoin.com/api/v1';
  static const String devWsUrl = 'wss://dev-api.brushandcoin.com/ws';
  
  // Payment Gateway Configuration
  static const String stripePublishableKey = 'pk_test_your_stripe_publishable_key';
  static const String stripeSecretKey = 'sk_test_your_stripe_secret_key';
  static const String paypalClientId = 'your_paypal_client_id';
  static const String paypalSecret = 'your_paypal_secret';
  
  // Local Payment Gateways (Philippines)
  static const String gcashMerchantId = 'your_gcash_merchant_id';
  static const String paymayaPublicKey = 'your_paymaya_public_key';
  static const String paymayaSecretKey = 'your_paymaya_secret_key';
  
  // Firebase Configuration
  static const String firebaseApiKey = 'your_firebase_api_key';
  static const String firebaseProjectId = 'your_firebase_project_id';
  static const String firebaseMessagingSenderId = 'your_firebase_sender_id';
  static const String firebaseAppId = 'your_firebase_app_id';
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String appSettingsKey = 'app_settings';
  static const String cacheKey = 'cache';
  
  // App Configuration
  static const String appName = 'Brush&Coin';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  
  // Feature Flags
  static const bool enableLocationServices = true;
  static const bool enablePushNotifications = true;
  static const bool enableAnalytics = true;
  static const bool enableCrashReporting = true;
  
  // Timeouts
  static const int apiTimeoutSeconds = 30;
  static const int imageCacheTimeoutDays = 7;
  static const int sessionTimeoutMinutes = 60;
  
  // Limits
  static const int maxImageSizeMB = 10;
  static const int maxFileUploadSizeMB = 50;
  static const int maxMessageLength = 1000;
  static const int maxBioLength = 500;
  static const int maxSpecializations = 5;
  
  // Default Values
  static const String defaultLanguage = 'en';
  static const String defaultCurrency = 'PHP';
  static const String defaultTimeZone = 'Asia/Manila';
  
  // Google Maps Configuration
  static const String googleMapsApiKey = 'your_google_maps_api_key';
  
  // Cache Configuration
  static const int imageCacheDuration = 7; // days
  static const int apiCacheDuration = 5; // minutes
  static const int maxImageCacheSize = 100; // MB
  
  // Upload Configuration
  static const int maxImageSize = 10; // MB
  static const int maxFileSize = 50; // MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> allowedFileTypes = ['pdf', 'doc', 'docx'];
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Rate Limiting
  static const int maxRequestsPerMinute = 100;
  static const int maxUploadsPerHour = 50;
  
  // Security
  static const bool enableSSL = true;
  static const bool enableCertificatePinning = true;
  static const List<String> allowedHosts = [
    'api.brushandcoin.com',
    'dev-api.brushandcoin.com',
    'cdn.brushandcoin.com'
  ];
  
  // Analytics
  static const String analyticsTrackingId = 'your_analytics_tracking_id';
  
  // Debug Configuration
  static const bool enableDebugLogging = true;
  static const bool enableNetworkLogging = true;
  static const bool enablePerformanceMonitoring = true;
  
  // Environment Detection
  static bool get isDevelopment => const bool.fromEnvironment('dart.vm.product') == false;
  static bool get isProduction => const bool.fromEnvironment('dart.vm.product') == true;
  
  // Dynamic Configuration
  static String get currentApiBaseUrl => isDevelopment ? devApiBaseUrl : apiBaseUrl;
  static String get currentWsUrl => isDevelopment ? devWsUrl : wsUrl;
  
  // API Endpoints
  static const String authEndpoint = '/auth';
  static const String usersEndpoint = '/users';
  static const String artworksEndpoint = '/artworks';
  static const String commissionsEndpoint = '/commissions';
  static const String paymentsEndpoint = '/payments';
  static const String messagesEndpoint = '/messages';
  static const String reviewsEndpoint = '/reviews';
  static const String eventsEndpoint = '/events';
  static const String uploadEndpoint = '/upload';
  
  // WebSocket Events
  static const String wsMessageReceived = 'message_received';
  static const String wsCommissionUpdated = 'commission_updated';
  static const String wsPaymentUpdated = 'payment_updated';
  static const String wsUserOnline = 'user_online';
  static const String wsUserOffline = 'user_offline';
  
  // Notification Channels
  static const String generalChannelId = 'general_notifications';
  static const String messageChannelId = 'message_notifications';
  static const String commissionChannelId = 'commission_notifications';
  static const String paymentChannelId = 'payment_notifications';
  
  // Error Messages
  static const String networkErrorMessage = 'Please check your internet connection and try again.';
  static const String serverErrorMessage = 'Server error occurred. Please try again later.';
  static const String authenticationErrorMessage = 'Authentication failed. Please login again.';
  static const String permissionErrorMessage = 'Permission denied. Please grant the required permissions.';
  
  // Success Messages
  static const String loginSuccessMessage = 'Login successful!';
  static const String registrationSuccessMessage = 'Registration successful! Please verify your email.';
  static const String profileUpdateSuccessMessage = 'Profile updated successfully!';
  static const String artworkUploadSuccessMessage = 'Artwork uploaded successfully!';
  static const String commissionCreatedSuccessMessage = 'Commission created successfully!';
  static const String paymentSuccessMessage = 'Payment processed successfully!';
  
  // Validation Messages
  static const String emailRequiredMessage = 'Email is required';
  static const String emailInvalidMessage = 'Please enter a valid email address';
  static const String passwordRequiredMessage = 'Password is required';
  static const String passwordMinLengthMessage = 'Password must be at least 8 characters';
  static const String usernameRequiredMessage = 'Username is required';
  static const String fullNameRequiredMessage = 'Full name is required';
  static const String amountRequiredMessage = 'Amount is required';
  static const String amountInvalidMessage = 'Please enter a valid amount';
  
  // Commission Status Messages
  static const Map<String, String> commissionStatusMessages = {
    'pending': 'Waiting for artist response',
    'accepted': 'Commission accepted by artist',
    'in_progress': 'Work in progress',
    'review': 'Ready for client review',
    'completed': 'Commission completed',
    'cancelled': 'Commission cancelled',
    'disputed': 'Commission disputed'
  };
  
  // Payment Status Messages
  static const Map<String, String> paymentStatusMessages = {
    'pending': 'Payment pending',
    'processing': 'Payment processing',
    'completed': 'Payment completed',
    'failed': 'Payment failed',
    'cancelled': 'Payment cancelled',
    'refunded': 'Payment refunded'
  };
}
