# Brush&Coin Mobile Project Structure

## Overview
This document outlines the complete project structure for the Brush&Coin mobile application, explaining the organization of files, folders, and how different components interact with each other and the web backend.

## Root Directory Structure

```
BrushAndCoin_Mobile/
├── android/                    # Android-specific configuration
├── ios/                       # iOS-specific configuration
├── lib/                       # Main Dart source code
├── test/                      # Unit and widget tests
├── integration_test/          # Integration tests
├── assets/                    # Static assets (images, fonts, etc.)
├── docs/                      # Documentation
├── pubspec.yaml              # Flutter dependencies
├── pubspec.lock              # Locked dependency versions
├── .gitignore                # Git ignore rules
├── .gitattributes            # Git attributes
└── README.md                 # Project documentation
```

## Lib Directory Structure

### Core Module (`lib/core/`)
Contains the foundational components that are used throughout the application.

```
lib/core/
├── config/                   # Configuration files
│   ├── env.dart             # Environment variables and constants
│   └── app_config.dart      # App-wide configuration
├── models/                   # Data models (Hive-annotated)
│   ├── user_model.dart      # User data model
│   ├── commission_model.dart # Commission data model
│   ├── artwork_model.dart   # Artwork data model
│   ├── message_model.dart   # Message data model
│   ├── payment_model.dart   # Payment data model
│   └── review_model.dart    # Review data model
├── providers/                # State management (Provider pattern)
│   ├── auth_provider.dart   # Authentication state
│   ├── user_provider.dart   # User data state
│   ├── artwork_provider.dart # Artwork state
│   ├── commission_provider.dart # Commission state
│   ├── message_provider.dart # Message state
│   └── payment_provider.dart # Payment state
├── services/                 # Business logic and API services
│   ├── api_service.dart     # HTTP API communication
│   ├── storage_service.dart # Local storage management
│   ├── auth_service.dart    # Authentication logic
│   ├── payment_service.dart # Payment processing
│   ├── notification_service.dart # Push notifications
│   ├── location_service.dart # Location services
│   └── websocket_service.dart # Real-time communication
├── theme/                    # App theming and styling
│   ├── app_theme.dart       # Main theme configuration
│   ├── colors.dart          # Color definitions
│   ├── text_styles.dart     # Typography styles
│   └── dimensions.dart      # Spacing and sizing
├── routes/                   # Navigation and routing
│   ├── app_router.dart      # Main router configuration
│   └── route_names.dart     # Route name constants
└── utils/                    # Utility functions and helpers
    ├── validators.dart       # Form validation
    ├── formatters.dart       # Data formatting
    ├── constants.dart        # App constants
    └── helpers.dart          # General helper functions
```

### Features Module (`lib/features/`)
Feature-based modules that contain screens, widgets, and logic for specific app features.

```
lib/features/
├── auth/                     # Authentication feature
│   ├── screens/             # Authentication screens
│   │   ├── login_screen.dart
│   │   ├── register_screen.dart
│   │   ├── forgot_password_screen.dart
│   │   └── verify_email_screen.dart
│   ├── widgets/             # Authentication-specific widgets
│   │   ├── login_form.dart
│   │   ├── register_form.dart
│   │   └── auth_header.dart
│   └── controllers/         # Authentication logic
│       ├── login_controller.dart
│       └── register_controller.dart
├── profile/                  # User profile feature
│   ├── screens/
│   │   ├── profile_screen.dart
│   │   ├── edit_profile_screen.dart
│   │   ├── settings_screen.dart
│   │   └── verification_screen.dart
│   ├── widgets/
│   │   ├── profile_header.dart
│   │   ├── profile_stats.dart
│   │   └── settings_list.dart
│   └── controllers/
│       └── profile_controller.dart
├── artwork/                  # Artwork showcase feature
│   ├── screens/
│   │   ├── artwork_list_screen.dart
│   │   ├── artwork_detail_screen.dart
│   │   ├── create_artwork_screen.dart
│   │   └── edit_artwork_screen.dart
│   ├── widgets/
│   │   ├── artwork_card.dart
│   │   ├── artwork_grid.dart
│   │   ├── artwork_form.dart
│   │   └── image_uploader.dart
│   └── controllers/
│       └── artwork_controller.dart
├── commission/               # Commission management feature
│   ├── screens/
│   │   ├── commission_list_screen.dart
│   │   ├── commission_detail_screen.dart
│   │   ├── create_commission_screen.dart
│   │   ├── commission_chat_screen.dart
│   │   └── milestone_screen.dart
│   ├── widgets/
│   │   ├── commission_card.dart
│   │   ├── commission_form.dart
│   │   ├── milestone_tracker.dart
│   │   └── status_badge.dart
│   └── controllers/
│       └── commission_controller.dart
├── messaging/                # Real-time messaging feature
│   ├── screens/
│   │   ├── conversation_list_screen.dart
│   │   ├── chat_screen.dart
│   │   └── new_message_screen.dart
│   ├── widgets/
│   │   ├── message_bubble.dart
│   │   ├── conversation_card.dart
│   │   ├── message_input.dart
│   │   └── typing_indicator.dart
│   └── controllers/
│       └── message_controller.dart
├── payment/                  # Payment processing feature
│   ├── screens/
│   │   ├── payment_screen.dart
│   │   ├── payment_methods_screen.dart
│   │   ├── payment_history_screen.dart
│   │   └── escrow_screen.dart
│   ├── widgets/
│   │   ├── payment_form.dart
│   │   ├── payment_method_card.dart
│   │   └── payment_status.dart
│   └── controllers/
│       └── payment_controller.dart
└── events/                   # Event discovery feature
    ├── screens/
    │   ├── events_screen.dart
    │   ├── event_detail_screen.dart
    │   └── create_event_screen.dart
    ├── widgets/
    │   ├── event_card.dart
    │   ├── event_map.dart
    │   └── event_filter.dart
    └── controllers/
        └── event_controller.dart
```

### Shared Module (`lib/shared/`)
Reusable components and utilities shared across features.

```
lib/shared/
├── widgets/                  # Reusable UI components
│   ├── common/              # Basic UI components
│   │   ├── custom_button.dart
│   │   ├── custom_text_field.dart
│   │   ├── loading_indicator.dart
│   │   ├── error_widget.dart
│   │   └── empty_state.dart
│   ├── navigation/          # Navigation components
│   │   ├── bottom_nav_bar.dart
│   │   ├── app_bar.dart
│   │   └── drawer.dart
│   └── media/               # Media-related components
│       ├── image_viewer.dart
│       ├── video_player.dart
│       └── file_picker.dart
├── constants/               # App-wide constants
│   ├── app_constants.dart
│   ├── api_constants.dart
│   └── validation_constants.dart
└── helpers/                 # Shared helper functions
    ├── date_helper.dart
    ├── currency_helper.dart
    ├── image_helper.dart
    └── permission_helper.dart
```

## Assets Directory Structure

```
assets/
├── images/                  # Image assets
│   ├── icons/              # App icons
│   ├── logos/              # Brand logos
│   ├── backgrounds/        # Background images
│   └── placeholders/       # Placeholder images
├── fonts/                  # Custom fonts
│   ├── Poppins-Regular.ttf
│   ├── Poppins-Medium.ttf
│   ├── Poppins-SemiBold.ttf
│   └── Poppins-Bold.ttf
├── animations/             # Lottie animations
│   ├── loading.json
│   ├── success.json
│   └── error.json
└── translations/           # Localization files
    ├── en.json
    ├── tl.json
    └── zh.json
```

## Test Directory Structure

```
test/
├── unit/                   # Unit tests
│   ├── services/           # Service tests
│   ├── providers/          # Provider tests
│   └── utils/              # Utility tests
├── widget/                 # Widget tests
│   ├── screens/            # Screen tests
│   └── widgets/            # Widget tests
└── integration/            # Integration tests
    ├── app_test.dart
    └── api_test.dart
```

## Platform-Specific Configuration

### Android (`android/`)
```
android/
├── app/                    # Android app configuration
│   ├── src/               # Source files
│   ├── build.gradle       # App-level build configuration
│   └── proguard-rules.pro # ProGuard rules
├── gradle/                # Gradle wrapper
├── build.gradle           # Project-level build configuration
└── gradle.properties      # Gradle properties
```

### iOS (`ios/`)
```
ios/
├── Runner/                # iOS app configuration
│   ├── AppDelegate.swift  # App delegate
│   ├── Info.plist        # App info
│   └── Assets.xcassets   # iOS assets
├── Runner.xcodeproj      # Xcode project
└── Podfile               # CocoaPods dependencies
```

## Data Flow Architecture

### 1. API Communication Flow
```
UI Screen → Provider → Service → API Service → Backend API
                ↓
            Local Storage (Hive)
```

### 2. State Management Flow
```
User Action → Provider → Service → API → Response → Provider → UI Update
```

### 3. Real-time Communication Flow
```
WebSocket Service → Event Handler → Provider → UI Update
```

## Integration with Web Backend

### API Endpoints Mapping
- **Authentication**: `/auth/*` endpoints
- **User Management**: `/users/*` endpoints
- **Artwork Management**: `/artworks/*` endpoints
- **Commission Management**: `/commissions/*` endpoints
- **Payment Processing**: `/payments/*` endpoints
- **Messaging**: `/messages/*` endpoints
- **Reviews**: `/reviews/*` endpoints
- **Events**: `/events/*` endpoints

### Data Synchronization
1. **Real-time Updates**: WebSocket connections for live data
2. **Offline Support**: Local storage with sync when online
3. **Conflict Resolution**: Timestamp-based conflict resolution
4. **Caching Strategy**: Intelligent caching for performance

### Security Integration
1. **JWT Authentication**: Token-based authentication
2. **SSL/TLS**: Secure communication
3. **Certificate Pinning**: Prevent man-in-the-middle attacks
4. **Input Validation**: Client-side validation
5. **Rate Limiting**: Respect API rate limits

## Development Guidelines

### Code Organization
1. **Feature-based Structure**: Organize by features, not by type
2. **Separation of Concerns**: Keep UI, business logic, and data separate
3. **Dependency Injection**: Use Provider for state management
4. **Consistent Naming**: Follow Dart naming conventions

### File Naming Conventions
- **Screens**: `*_screen.dart`
- **Widgets**: `*_widget.dart` or descriptive names
- **Models**: `*_model.dart`
- **Services**: `*_service.dart`
- **Providers**: `*_provider.dart`
- **Controllers**: `*_controller.dart`

### Import Organization
1. **Dart SDK imports**
2. **Flutter imports**
3. **Third-party package imports**
4. **Local imports (core, features, shared)**

### Testing Strategy
1. **Unit Tests**: Test business logic and services
2. **Widget Tests**: Test UI components
3. **Integration Tests**: Test complete user flows
4. **API Tests**: Test API integration

## Deployment Considerations

### Build Configuration
- **Debug Mode**: Development with hot reload
- **Release Mode**: Optimized for production
- **Profile Mode**: Performance profiling

### Platform-Specific Optimizations
- **Android**: APK and App Bundle builds
- **iOS**: App Store distribution
- **Web**: Progressive Web App (future)

### Environment Management
- **Development**: Development API endpoints
- **Staging**: Staging environment for testing
- **Production**: Production API endpoints

This structure ensures a scalable, maintainable, and well-organized Flutter application that can effectively communicate with your web backend while providing a seamless user experience across platforms.
