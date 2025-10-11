# PostgreSQL Backend Setup for Brush&Coin

## Overview

This document outlines how to set up a PostgreSQL backend for the Brush&Coin Flutter application that supports both mobile and web platforms.

## Backend Architecture

The backend consists of:
1. **PostgreSQL Database** - Main data storage
2. **REST API Server** - Handles HTTP requests from Flutter apps
3. **Authentication Service** - JWT-based auth for both platforms
4. **File Storage Service** - Handles image uploads
5. **WebSocket Service** - Real-time messaging

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE,
  bio TEXT,
  profile_image_url TEXT,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('artist', 'client')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Artworks Table
```sql
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_urls TEXT[],
  category VARCHAR(50),
  tags TEXT[],
  price DECIMAL(10, 2),
  is_commission BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Commissions Table
```sql
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  deadline DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  reference_images TEXT[],
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PHP',
  payment_method VARCHAR(50) NOT NULL,
  payment_gateway VARCHAR(50) NOT NULL,
  gateway_transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  escrow_released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  commission_id UUID REFERENCES commissions(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  max_attendees INTEGER,
  registration_fee DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Event Attendees Table
```sql
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);
```

## Backend Technology Stack

### Recommended Technologies

1. **Node.js with Express.js**
   - Fast and scalable
   - Great TypeScript support
   - Extensive middleware ecosystem

2. **PostgreSQL with Prisma ORM**
   - Type-safe database operations
   - Automatic migrations
   - Great developer experience

3. **JWT for Authentication**
   - Stateless authentication
   - Works well with both mobile and web

4. **Redis for Caching**
   - Session storage
   - Real-time features
   - Performance optimization

### Alternative Technologies

1. **Python with FastAPI**
   - High performance
   - Automatic API documentation
   - Great async support

2. **Go with Gin/Fiber**
   - Excellent performance
   - Small memory footprint
   - Great concurrency

3. **Dart with Shelf**
   - Same language as Flutter
   - Code sharing possibilities

## API Endpoints

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Users
```
GET    /api/v1/db/users
GET    /api/v1/db/users/:id
POST   /api/v1/db/users
PUT    /api/v1/db/users/:id
DELETE /api/v1/db/users/:id
GET    /api/v1/db/users/email/:email
```

### Artworks
```
GET    /api/v1/db/artworks
GET    /api/v1/db/artworks/:id
POST   /api/v1/db/artworks
PUT    /api/v1/db/artworks/:id
DELETE /api/v1/db/artworks/:id
```

### Commissions
```
GET    /api/v1/db/commissions
GET    /api/v1/db/commissions/:id
POST   /api/v1/db/commissions
PUT    /api/v1/db/commissions/:id
PATCH  /api/v1/db/commissions/:id/status
```

### Payments
```
GET    /api/v1/db/payments
GET    /api/v1/db/payments/:id
POST   /api/v1/db/payments
PATCH  /api/v1/db/payments/:id/status
```

### Messages
```
GET    /api/v1/db/messages
POST   /api/v1/db/messages
PATCH  /api/v1/db/messages/:id/read
```

### Reviews
```
GET    /api/v1/db/reviews
POST   /api/v1/db/reviews
```

### Events
```
GET    /api/v1/db/events
GET    /api/v1/db/events/:id
POST   /api/v1/db/events
PUT    /api/v1/db/events/:id
DELETE /api/v1/db/events/:id
POST   /api/v1/db/events/:id/attendees
GET    /api/v1/db/events/:id/attendees
DELETE /api/v1/db/events/:id/attendees/:userId
```

## Environment Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/brushandcoin_dev
JWT_SECRET=your-jwt-secret-key
REDIS_URL=redis://localhost:6379
PORT=3000
```

### Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_password@prod-db.brushandcoin.com:5432/brushandcoin_prod
JWT_SECRET=your-production-jwt-secret-key
REDIS_URL=redis://prod-redis.brushandcoin.com:6379
PORT=3000
```

## Deployment Options

### Cloud Providers

1. **AWS**
   - RDS PostgreSQL
   - Elastic Beanstalk or ECS
   - S3 for file storage
   - CloudFront for CDN

2. **Google Cloud**
   - Cloud SQL PostgreSQL
   - Cloud Run or App Engine
   - Cloud Storage for files
   - Cloud CDN

3. **Azure**
   - Azure Database for PostgreSQL
   - App Service or Container Instances
   - Blob Storage for files
   - Azure CDN

4. **DigitalOcean**
   - Managed PostgreSQL
   - App Platform or Droplets
   - Spaces for file storage
   - CDN

### Container Deployment

Use Docker containers for consistent deployment across environments:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Considerations

1. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Regular security updates
   - Backup encryption

2. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration
   - HTTPS enforcement

3. **Authentication Security**
   - JWT token expiration
   - Refresh token rotation
   - Password hashing (bcrypt)
   - Multi-factor authentication

## Performance Optimization

1. **Database Optimization**
   - Proper indexing
   - Query optimization
   - Connection pooling
   - Read replicas for scaling

2. **API Optimization**
   - Response caching
   - Pagination
   - Compression
   - CDN for static assets

3. **Real-time Features**
   - WebSocket connections
   - Redis for pub/sub
   - Connection management
   - Message queuing

## Monitoring and Logging

1. **Application Monitoring**
   - Health checks
   - Performance metrics
   - Error tracking
   - Uptime monitoring

2. **Database Monitoring**
   - Query performance
   - Connection monitoring
   - Disk usage
   - Backup status

3. **Logging**
   - Structured logging
   - Log aggregation
   - Error alerting
   - Audit trails

## Testing Strategy

1. **Unit Tests**
   - API endpoint tests
   - Database operation tests
   - Authentication tests

2. **Integration Tests**
   - End-to-end API tests
   - Database integration tests
   - Third-party service tests

3. **Performance Tests**
   - Load testing
   - Stress testing
   - Database performance tests

This setup provides a robust, scalable PostgreSQL backend that can serve both the Flutter mobile app and web version with consistent data and functionality.
