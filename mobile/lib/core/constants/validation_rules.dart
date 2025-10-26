// Validation rules constants for mobile app

class ValidationRules {
  ValidationRules._();

  // Email validation
  static final RegExp emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
  static const String emailRequired = 'Email is required';
  static const String emailInvalid = 'Please enter a valid email address';

  // Password validation
  static const int passwordMinLength = 8;
  static final RegExp passwordRegex = RegExp(
      r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]');
  static const String passwordRequired = 'Password is required';
  static const String passwordMinLengthMsg =
      'Password must be at least 8 characters';
  static const String passwordPatternMsg =
      'Password must contain uppercase, lowercase, number, and special character';

  // Username validation
  static const int usernameMinLength = 3;
  static const int usernameMaxLength = 20;
  static final RegExp usernameRegex = RegExp(r'^[a-zA-Z0-9_]+$');
  static const String usernameRequired = 'Username is required';
  static const String usernameMinLengthMsg =
      'Username must be at least 3 characters';
  static const String usernameMaxLengthMsg =
      'Username must be less than 20 characters';
  static const String usernamePatternMsg =
      'Username can only contain letters, numbers, and underscores';

  // Full name validation
  static const int fullNameMinLength = 2;
  static const int fullNameMaxLength = 50;
  static final RegExp fullNameRegex = RegExp(r"^[a-zA-Z\s'-]+$");
  static const String fullNameRequired = 'Full name is required';
  static const String fullNameMinLengthMsg =
      'Full name must be at least 2 characters';
  static const String fullNameMaxLengthMsg =
      'Full name must be less than 50 characters';
  static const String fullNamePatternMsg =
      'Full name can only contain letters, spaces, hyphens, and apostrophes';

  // Bio validation
  static const int bioMaxLength = 500;
  static const String bioMaxLengthMsg = 'Bio must be less than 500 characters';

  // Message validation
  static const int messageMaxLength = 1000;
  static const String messageRequired = 'Message is required';
  static const String messageMaxLengthMsg =
      'Message must be less than 1000 characters';

  // Amount validation
  static const double amountMin = 0.01;
  static const double amountMax = 1000000;
  static const String amountRequired = 'Amount is required';
  static const String amountMinMsg = 'Amount must be greater than 0';
  static const String amountMaxMsg = 'Amount must be less than 1,000,000';
  static const String amountInvalid = 'Please enter a valid amount';

  // Title validation
  static const int titleMinLength = 3;
  static const int titleMaxLength = 100;
  static const String titleRequired = 'Title is required';
  static const String titleMinLengthMsg = 'Title must be at least 3 characters';
  static const String titleMaxLengthMsg =
      'Title must be less than 100 characters';

  // Description validation
  static const int descriptionMinLength = 10;
  static const int descriptionMaxLength = 1000;
  static const String descriptionRequired = 'Description is required';
  static const String descriptionMinLengthMsg =
      'Description must be at least 10 characters';
  static const String descriptionMaxLengthMsg =
      'Description must be less than 1000 characters';

  // Specializations validation
  static const int maxSpecializations = 5;
  static const String maxSpecializationsMsg =
      'You can select up to 5 specializations';

  // File upload validation
  static const int maxImageSize = 10 * 1024 * 1024; // 10MB
  static const int maxFileSize = 50 * 1024 * 1024; // 50MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> allowedFileTypes = ['pdf', 'doc', 'docx', 'txt'];
  static const String fileSizeError = 'File size exceeds maximum allowed size';
  static const String fileTypeError = 'File type not allowed';
}

class ErrorMessages {
  ErrorMessages._();

  static const String network =
      'Please check your internet connection and try again.';
  static const String server = 'Server error occurred. Please try again later.';
  static const String authentication =
      'Authentication failed. Please login again.';
  static const String permission =
      'Permission denied. Please grant the required permissions.';
  static const String validation = 'Please check your input and try again.';
  static const String unknown = 'An unexpected error occurred.';
}

class SuccessMessages {
  SuccessMessages._();

  static const String login = 'Login successful!';
  static const String register =
      'Registration successful! Please verify your email.';
  static const String profileUpdate = 'Profile updated successfully!';
  static const String artworkUpload = 'Artwork uploaded successfully!';
  static const String commissionCreate = 'Commission created successfully!';
  static const String paymentSuccess = 'Payment processed successfully!';
  static const String messageSent = 'Message sent successfully!';
  static const String eventCreated = 'Event created successfully!';
}
