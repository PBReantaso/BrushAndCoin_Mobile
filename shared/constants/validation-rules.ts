export const VALIDATION_RULES = {
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
  },
  
  PASSWORD: {
    MIN_LENGTH: 8,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    REQUIRED: 'Password is required',
    MIN_LENGTH_MSG: 'Password must be at least 8 characters',
    PATTERN_MSG: 'Password must contain uppercase, lowercase, number, and special character',
  },
  
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    REGEX: /^[a-zA-Z0-9_]+$/,
    REQUIRED: 'Username is required',
    MIN_LENGTH_MSG: 'Username must be at least 3 characters',
    MAX_LENGTH_MSG: 'Username must be less than 20 characters',
    PATTERN_MSG: 'Username can only contain letters, numbers, and underscores',
  },
  
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-Z\s'-]+$/,
    REQUIRED: 'Full name is required',
    MIN_LENGTH_MSG: 'Full name must be at least 2 characters',
    MAX_LENGTH_MSG: 'Full name must be less than 50 characters',
    PATTERN_MSG: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
  },
  
  BIO: {
    MAX_LENGTH: 500,
    MAX_LENGTH_MSG: 'Bio must be less than 500 characters',
  },
  
  MESSAGE: {
    MAX_LENGTH: 1000,
    REQUIRED: 'Message is required',
    MAX_LENGTH_MSG: 'Message must be less than 1000 characters',
  },
  
  AMOUNT: {
    MIN: 0.01,
    MAX: 1000000,
    REQUIRED: 'Amount is required',
    MIN_MSG: 'Amount must be greater than 0',
    MAX_MSG: 'Amount must be less than 1,000,000',
    INVALID: 'Please enter a valid amount',
  },
  
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    REQUIRED: 'Title is required',
    MIN_LENGTH_MSG: 'Title must be at least 3 characters',
    MAX_LENGTH_MSG: 'Title must be less than 100 characters',
  },
  
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
    REQUIRED: 'Description is required',
    MIN_LENGTH_MSG: 'Description must be at least 10 characters',
    MAX_LENGTH_MSG: 'Description must be less than 1000 characters',
  },
  
  SPECIALIZATIONS: {
    MAX_COUNT: 5,
    MAX_COUNT_MSG: 'You can select up to 5 specializations',
  },
  
  FILE_UPLOAD: {
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
    ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt'],
    SIZE_ERROR: 'File size exceeds maximum allowed size',
    TYPE_ERROR: 'File type not allowed',
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Please check your internet connection and try again.',
  SERVER: 'Server error occurred. Please try again later.',
  AUTHENTICATION: 'Authentication failed. Please login again.',
  PERMISSION: 'Permission denied. Please grant the required permissions.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful! Please verify your email.',
  PROFILE_UPDATE: 'Profile updated successfully!',
  ARTWORK_UPLOAD: 'Artwork uploaded successfully!',
  COMMISSION_CREATE: 'Commission created successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  EVENT_CREATED: 'Event created successfully!',
} as const;
