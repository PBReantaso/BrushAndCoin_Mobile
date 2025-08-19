# Brush&Coin Mobile Application

A Flutter-based mobile application for the Brush&Coin platform, designed to connect artists with clients for commission-based creative work. This mobile app works in conjunction with a web application to provide a unified experience across platforms.

## 🎨 Project Overview

Brush&Coin addresses the fragmentation in digital platforms serving artists by providing:
- **Portfolio Presentation**: Showcase artwork and skills
- **Client Discovery**: Find and connect with potential clients
- **Secure Transactions**: Escrow-style payment system
- **Digital Contracts**: Automated contract generation and management
- **Real-time Messaging**: Built-in communication system
- **Local Integration**: Support for GCash, PayMaya, and international payment gateways
- **Geo-location Services**: Local artist discovery and event mapping

## 🏗️ Architecture

### Mobile Application (Flutter/Dart)
- **Frontend**: Flutter with Material Design 3
- **State Management**: Provider pattern
- **Local Storage**: Hive database
- **HTTP Client**: Dio for API communication
- **Real-time Updates**: WebSocket connections

### Web Backend (TypeScript/JavaScript)
- **API**: RESTful API with JWT authentication
- **Database**: PostgreSQL for data persistence
- **Real-time**: WebSocket server for live updates
- **File Storage**: Cloud storage for images and files
- **Payment Processing**: Integration with local and international payment gateways

### Data Synchronization
Both platforms share the same data models and API contracts, ensuring:
- Real-time data synchronization
- Consistent user experience
- Unified business logic
- Shared authentication system

## 📱 Features

### For Artists
- Create and manage portfolio
- Set pricing and availability
- Receive commission requests
- Track project milestones
- Manage payments and contracts
- Real-time messaging with clients

### For Clients
- Discover local artists
- Browse portfolios and reviews
- Request custom commissions
- Secure payment processing
- Track project progress
- Rate and review artists

### Core Features
- **Authentication**: Secure login/registration
- **Profile Management**: Complete user profiles with verification
- **Artwork Showcase**: Portfolio management with categories and tags
- **Commission System**: End-to-end commission workflow
- **Payment Integration**: Multiple payment methods (GCash, PayMaya, PayPal, Stripe)
- **Messaging**: Real-time chat with file sharing
- **Reviews & Ratings**: Trust and reputation system
- **Event Discovery**: Local art events and exhibitions
- **Location Services**: Geo-based artist discovery

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (3.0.0 or higher)
- Dart SDK (3.0.0 or higher)
- Android Studio / VS Code
- Android SDK (for Android development)
- iOS SDK (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/BrushAndCoin_Mobile.git
   cd BrushAndCoin_Mobile
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Generate Hive models**
   ```bash
   flutter packages pub run build_runner build
   ```

4. **Configure environment**
   - Copy `lib/core/config/env.example.dart` to `lib/core/config/env.dart`
   - Update API endpoints and configuration

5. **Run the application**
   ```bash
   flutter run
   ```

### Environment Configuration

Create `lib/core/config/env.dart`:
```dart
class Environment {
  static const String apiBaseUrl = 'https://api.brushandcoin.com/api/v1';
  static const String wsUrl = 'wss://api.brushandcoin.com/ws';
  static const String imageBaseUrl = 'https://cdn.brushandcoin.com';
  
  // Payment Gateway Keys
  static const String stripePublishableKey = 'your_stripe_key';
  static const String paypalClientId = 'your_paypal_client_id';
  
  // Firebase Configuration
  static const String firebaseProjectId = 'your_firebase_project_id';
}
```

## 📁 Project Structure

```
lib/
├── core/
│   ├── config/           # Configuration files
│   ├── models/           # Data models (User, Commission, etc.)
│   ├── providers/        # State management
│   ├── services/         # API and business logic services
│   ├── theme/            # App theming and styling
│   └── utils/            # Utility functions
├── features/
│   ├── auth/             # Authentication screens
│   ├── profile/          # User profile management
│   ├── artwork/          # Artwork showcase and management
│   ├── commission/       # Commission workflow
│   ├── messaging/        # Real-time messaging
│   ├── payment/          # Payment processing
│   └── events/           # Event discovery
├── shared/
│   ├── widgets/          # Reusable UI components
│   ├── constants/        # App constants
│   └── helpers/          # Helper functions
└── main.dart             # App entry point
```

## 🔧 Development Setup

### Backend Requirements
Before running the mobile app, ensure your web backend implements the API specification in `docs/api_specification.md`.

### Database Schema
The mobile app expects the following core entities:
- **Users**: Artists and clients with profiles
- **Artworks**: Portfolio items with metadata
- **Commissions**: Project contracts with milestones
- **Payments**: Transaction records with escrow
- **Messages**: Real-time communication
- **Reviews**: User feedback and ratings
- **Events**: Local art events and exhibitions

### API Integration
The mobile app communicates with the backend through:
- **REST API**: For CRUD operations
- **WebSocket**: For real-time updates
- **File Upload**: For images and documents
- **Push Notifications**: For important updates

## 🧪 Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

## 📦 Building for Production

### Android
```bash
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## 🔐 Security Considerations

- JWT tokens for authentication
- Secure API communication (HTTPS/WSS)
- Local data encryption with Hive
- Input validation and sanitization
- Secure payment processing
- User data privacy compliance

## 🌐 API Documentation

Complete API specification is available in `docs/api_specification.md`. This document defines:
- All REST endpoints
- Request/response formats
- Authentication methods
- Error handling
- WebSocket events
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation

## 🔄 What's Missing

To complete the setup, you need to:

1. **Backend Development**: Implement the web API according to the specification
2. **Database Setup**: Configure PostgreSQL with the required schema
3. **Payment Integration**: Set up payment gateway accounts and keys
4. **File Storage**: Configure cloud storage for images and files
5. **Push Notifications**: Set up Firebase for notifications
6. **Environment Variables**: Configure all API keys and endpoints
7. **Testing**: Implement comprehensive test coverage
8. **Deployment**: Set up CI/CD pipelines for both mobile and web

## 🎯 Next Steps

1. **Complete the Flutter UI**: Implement all screens and features
2. **Backend Development**: Build the web API and database
3. **Integration Testing**: Test mobile-web communication
4. **Payment Setup**: Configure payment gateways
5. **Security Audit**: Review and enhance security measures
6. **Performance Optimization**: Optimize for speed and efficiency
7. **User Testing**: Conduct beta testing with real users
8. **Launch Preparation**: Prepare for app store submission

---

**Note**: This mobile application is designed to work seamlessly with the Brush&Coin web platform. Both applications share the same backend API and database, ensuring consistent data and user experience across platforms.
