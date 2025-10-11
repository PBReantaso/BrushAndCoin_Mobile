class Validators {
  // Email validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }

    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address';
    }

    return null;
  }

  // Password validation
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!value.contains(RegExp(r'[a-z]'))) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain at least one number';
    }

    return null;
  }

  // Confirm password validation
  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }

    if (value != password) {
      return 'Passwords do not match';
    }

    return null;
  }

  // Username validation
  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Username is required';
    }

    if (value.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    if (value.length > 20) {
      return 'Username must be less than 20 characters';
    }

    final usernameRegex = RegExp(r'^[a-zA-Z0-9_]+$');
    if (!usernameRegex.hasMatch(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }

    return null;
  }

  // Full name validation
  static String? validateFullName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Full name is required';
    }

    if (value.length < 2) {
      return 'Full name must be at least 2 characters long';
    }

    if (value.length > 50) {
      return 'Full name must be less than 50 characters';
    }

    final nameRegex = RegExp(r'^[a-zA-Z\s]+$');
    if (!nameRegex.hasMatch(value)) {
      return 'Full name can only contain letters and spaces';
    }

    return null;
  }

  // Required field validation
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }

    return null;
  }

  // Phone number validation
  static String? validatePhoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Phone number is optional
    }

    final phoneRegex = RegExp(r'^\+?[\d\s\-\(\)]+$');
    if (!phoneRegex.hasMatch(value)) {
      return 'Please enter a valid phone number';
    }

    return null;
  }

  // Location validation
  static String? validateLocation(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Location is optional
    }

    if (value.length < 3) {
      return 'Location must be at least 3 characters long';
    }

    return null;
  }

  // Bio validation
  static String? validateBio(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Bio is optional
    }

    if (value.length > 500) {
      return 'Bio must be less than 500 characters';
    }

    return null;
  }

  // Price validation
  static String? validatePrice(String? value) {
    if (value == null || value.isEmpty) {
      return 'Price is required';
    }

    final priceRegex = RegExp(r'^\d+(\.\d{1,2})?$');
    if (!priceRegex.hasMatch(value)) {
      return 'Please enter a valid price';
    }

    final price = double.tryParse(value);
    if (price == null || price <= 0) {
      return 'Price must be greater than 0';
    }

    return null;
  }

  // Commission title validation
  static String? validateCommissionTitle(String? value) {
    if (value == null || value.isEmpty) {
      return 'Commission title is required';
    }

    if (value.length < 5) {
      return 'Commission title must be at least 5 characters long';
    }

    if (value.length > 100) {
      return 'Commission title must be less than 100 characters';
    }

    return null;
  }

  // Commission description validation
  static String? validateCommissionDescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Commission description is required';
    }

    if (value.length < 10) {
      return 'Commission description must be at least 10 characters long';
    }

    if (value.length > 1000) {
      return 'Commission description must be less than 1000 characters';
    }

    return null;
  }

  // Deadline validation
  static String? validateDeadline(DateTime? value) {
    if (value == null) {
      return 'Deadline is required';
    }

    final now = DateTime.now();
    if (value.isBefore(now)) {
      return 'Deadline cannot be in the past';
    }

    return null;
  }

  // Amount validation
  static String? validateAmount(String? value) {
    if (value == null || value.isEmpty) {
      return 'Amount is required';
    }

    final amountRegex = RegExp(r'^\d+(\.\d{1,2})?$');
    if (!amountRegex.hasMatch(value)) {
      return 'Please enter a valid amount';
    }

    final amount = double.tryParse(value);
    if (amount == null || amount <= 0) {
      return 'Amount must be greater than 0';
    }

    return null;
  }
}
