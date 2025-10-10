# Brush&Coin - Creative Marketplace

A comprehensive platform connecting artists with clients for custom artwork commissions. Built with Flutter for mobile and Next.js for web, featuring secure payments, real-time messaging, and verified reviews.

## 🏗️ Project Structure

This is a monorepo containing both mobile and web applications:

```
BrushAndCoin_Mobile/
├── mobile/                 # Flutter mobile application
│   ├── lib/               # Dart source code
│   ├── android/           # Android-specific files
│   ├── assets/            # Mobile assets
│   └── pubspec.yaml       # Flutter dependencies
├── web/                   # Next.js web application
│   ├── src/               # React/TypeScript source code
│   ├── public/            # Web assets
│   ├── package.json       # Node.js dependencies
│   └── next.config.js     # Next.js configuration
├── shared/                # Shared types and constants
│   ├── types/             # TypeScript interfaces
│   ├── constants/         # Shared configuration
│   └── assets/            # Shared assets
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for web development)
- **Flutter** 3.16+ (for mobile development)
- **Git** (for version control)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/BrushAndCoin_Mobile.git
   cd BrushAndCoin_Mobile
   ```

2. **Install dependencies:**
   ```bash
   # Install all dependencies (web + mobile)
   npm run install:all
   
   # Or install individually:
   npm run install:web    # Web dependencies
   npm run install:mobile # Mobile dependencies (flutter pub get)
   ```

### Development

#### Web Development
```bash
# Start the web development server
npm run dev:web

# Or manually:
cd web && npm run dev
```

The web app will be available at `http://localhost:3000`

#### Mobile Development
```bash
# Run Flutter app (requires connected device or emulator)
npm run dev:mobile

# Or manually:
cd mobile && flutter run
```

### Building for Production

#### Web
```bash
# Build web application
npm run build:web

# Start production server
npm run start:web
```

#### Mobile
```bash
# Build Android APK
npm run build:mobile:android

# Build iOS (requires macOS)
npm run build:mobile:ios
```

## 🛠️ Technology Stack

### Mobile (Flutter)
- **Framework:** Flutter 3.16+
- **Language:** Dart
- **State Management:** Provider
- **Local Storage:** Hive, SharedPreferences
- **HTTP Client:** Dio
- **Maps:** Google Maps Flutter
- **Payments:** Stripe, PayPal, GCash, PayMaya

### Web (Next.js)
- **Framework:** Next.js 14+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Payments:** Stripe, PayPal integration

### Shared
- **Types:** TypeScript interfaces
- **Constants:** API endpoints, validation rules
- **Assets:** Shared images, icons

## 📱 Features

### Core Features
- **User Authentication:** Secure login/register with JWT
- **Profile Management:** Artist and client profiles
- **Artwork Portfolio:** Showcase and manage artwork
- **Commission System:** Request and manage commissions
- **Secure Payments:** Multiple payment gateways with escrow
- **Real-time Messaging:** WebSocket-based chat system
- **Review System:** Verified reviews and ratings
- **Event Discovery:** Geo-based event mapping
- **Milestone Tracking:** Project progress management

### Payment Integration
- **Stripe:** International payments
- **PayPal:** Global payment processing
- **GCash:** Philippine mobile payments
- **PayMaya:** Philippine digital wallet
- **Escrow System:** Secure fund holding

## 🔧 Configuration

### Environment Variables

#### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.brushandcoin.com/api/v1
NEXT_PUBLIC_WS_URL=wss://api.brushandcoin.com/ws
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### Mobile
Update `mobile/lib/core/config/env.dart` with your API endpoints and keys.

### API Configuration
- **Base URL:** `https://api.brushandcoin.com/api/v1`
- **WebSocket:** `wss://api.brushandcoin.com/ws`
- **Authentication:** JWT Bearer tokens
- **Rate Limiting:** 100 requests/minute

## 🧪 Testing

### Web Testing
```bash
cd web
npm run test          # Run tests
npm run lint          # Run ESLint
npm run type-check    # TypeScript checking
```

### Mobile Testing
```bash
cd mobile
flutter test          # Run tests
flutter analyze       # Code analysis
```

## 📦 Scripts

### Monorepo Scripts
```bash
npm run dev:web              # Start web development
npm run dev:mobile           # Start mobile development
npm run build:web            # Build web for production
npm run build:mobile         # Build mobile apps
npm run build:all            # Build both platforms
npm run install:all          # Install all dependencies
npm run clean:web            # Clean web build files
npm run clean:mobile         # Clean mobile build files
```

### Individual Platform Scripts
```bash
# Web scripts (run from web/ directory)
npm run dev                  # Development server
npm run build               # Production build
npm run start               # Production server
npm run lint                # ESLint
npm run type-check          # TypeScript check

# Mobile scripts (run from mobile/ directory)
flutter run                 # Run app
flutter build apk          # Build Android APK
flutter build ios          # Build iOS app
flutter test               # Run tests
flutter analyze            # Code analysis
```

## 🚀 Deployment

### Web Deployment
Deploy to Vercel, Netlify, or any static hosting:
```bash
npm run build:web
# Deploy the web/.next directory
```

### Mobile Deployment
- **Android:** Upload APK to Google Play Store
- **iOS:** Upload to Apple App Store via Xcode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/ESLint rules for web development
- Follow Dart analysis rules for mobile development
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@brushandcoin.com or join our Discord community.

## 🔗 Links

- **Website:** [brushandcoin.com](https://brushandcoin.com)
- **API Documentation:** [api.brushandcoin.com/docs](https://api.brushandcoin.com/docs)
- **Mobile App:** Available on Google Play and App Store

---

Built with ❤️ by the Brush&Coin team