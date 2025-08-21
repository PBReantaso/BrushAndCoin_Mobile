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


