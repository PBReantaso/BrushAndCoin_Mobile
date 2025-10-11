# Brush&Coin API Specification

## Overview
This document defines the REST API endpoints that the Brush&Coin mobile application will use to communicate with the web backend. The API follows RESTful principles and uses JSON for data exchange.

## Base URL
```
Production: https://api.brushandcoin.com/api/v1
Development: https://dev-api.brushandcoin.com/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

## Error Responses
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "artist123",
  "full_name": "John Doe",
  "user_type": "artist",
  "specializations": ["portrait", "landscape"],
  "location": "Manila, Philippines",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "artist123",
      "full_name": "John Doe",
      "user_type": "artist",
      "is_verified": false,
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "artist123",
      "full_name": "John Doe",
      "user_type": "artist",
      "profile_image": "https://example.com/profile.jpg",
      "rating": 4.5,
      "review_count": 10,
      "is_verified": true,
      "is_online": true
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### POST /auth/logout
Logout user and invalidate token.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Management

### GET /users/{user_id}
Get user profile by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "artist123",
    "full_name": "John Doe",
    "profile_image": "https://example.com/profile.jpg",
    "bio": "Professional artist specializing in portraits",
    "user_type": "artist",
    "specializations": ["portrait", "landscape"],
    "rating": 4.5,
    "review_count": 10,
    "location": "Manila, Philippines",
    "latitude": 14.5995,
    "longitude": 120.9842,
    "is_verified": true,
    "social_links": {
      "instagram": "https://instagram.com/artist123",
      "twitter": "https://twitter.com/artist123"
    },
    "portfolio_images": [
      "https://example.com/artwork1.jpg",
      "https://example.com/artwork2.jpg"
    ],
    "pricing_info": {
      "portrait": 5000,
      "landscape": 8000,
      "custom": 10000
    },
    "is_online": true,
    "last_seen": "2024-01-01T12:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### PUT /users/{user_id}
Update user profile.

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "bio": "Updated bio",
  "location": "Quezon City, Philippines",
  "latitude": 14.6760,
  "longitude": 121.0437,
  "specializations": ["portrait", "landscape", "digital"],
  "social_links": {
    "instagram": "https://instagram.com/artist123",
    "twitter": "https://twitter.com/artist123"
  },
  "pricing_info": {
    "portrait": 6000,
    "landscape": 9000,
    "custom": 12000
  }
}
```

---

## Artwork Management

### GET /artworks
Get artworks with optional filters.

**Query Parameters:**
- `artist_id`: Filter by artist
- `category`: Filter by category
- `tags`: Filter by tags (comma-separated)
- `min_price`: Minimum price
- `max_price`: Maximum price
- `location`: Filter by location
- `radius`: Search radius in km
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "artwork_123",
      "title": "Beautiful Portrait",
      "description": "A stunning portrait painting",
      "artist_id": "user_123",
      "artist": {
        "id": "user_123",
        "username": "artist123",
        "full_name": "John Doe",
        "profile_image": "https://example.com/profile.jpg",
        "rating": 4.5
      },
      "images": [
        "https://example.com/artwork1.jpg",
        "https://example.com/artwork2.jpg"
      ],
      "category": "portrait",
      "tags": ["portrait", "oil-painting", "realistic"],
      "price": 5000,
      "currency": "PHP",
      "is_available": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### POST /artworks
Create new artwork.

**Request Body:**
```json
{
  "title": "Beautiful Portrait",
  "description": "A stunning portrait painting",
  "category": "portrait",
  "tags": ["portrait", "oil-painting", "realistic"],
  "price": 5000,
  "currency": "PHP",
  "images": ["image_url_1", "image_url_2"]
}
```

---

## Commission Management

### GET /commissions
Get commissions with optional filters.

**Query Parameters:**
- `artist_id`: Filter by artist
- `client_id`: Filter by client
- `status`: Filter by status
- `type`: Filter by commission type
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "commission_123",
      "title": "Custom Portrait Commission",
      "description": "A custom portrait commission",
      "artist_id": "user_123",
      "client_id": "user_456",
      "artist": {
        "id": "user_123",
        "username": "artist123",
        "full_name": "John Doe",
        "profile_image": "https://example.com/profile.jpg"
      },
      "client": {
        "id": "user_456",
        "username": "client456",
        "full_name": "Jane Smith",
        "profile_image": "https://example.com/client.jpg"
      },
      "amount": 5000,
      "currency": "PHP",
      "status": "in_progress",
      "deadline": "2024-02-01T00:00:00Z",
      "reference_images": ["https://example.com/reference1.jpg"],
      "requirements": {
        "style": "realistic",
        "size": "A4",
        "medium": "oil-painting"
      },
      "milestones": [
        {
          "id": "milestone_1",
          "title": "Sketch Approval",
          "description": "Initial sketch for approval",
          "percentage": 25,
          "due_date": "2024-01-15T00:00:00Z",
          "is_completed": true,
          "completed_at": "2024-01-14T00:00:00Z"
        }
      ],
      "contract_id": "contract_123",
      "payment_id": "payment_123",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-14T00:00:00Z"
    }
  ]
}
```

### POST /commissions
Create new commission.

**Request Body:**
```json
{
  "title": "Custom Portrait Commission",
  "description": "A custom portrait commission",
  "artist_id": "user_123",
  "amount": 5000,
  "currency": "PHP",
  "deadline": "2024-02-01T00:00:00Z",
  "type": "portrait",
  "category": "portrait",
  "reference_images": ["image_url_1"],
  "requirements": {
    "style": "realistic",
    "size": "A4",
    "medium": "oil-painting"
  },
  "milestones": [
    {
      "title": "Sketch Approval",
      "description": "Initial sketch for approval",
      "percentage": 25,
      "due_date": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### PATCH /commissions/{commission_id}/status
Update commission status.

**Request Body:**
```json
{
  "status": "in_progress"
}
```

---

## Payment Management

### POST /payments
Create payment for commission.

**Request Body:**
```json
{
  "commission_id": "commission_123",
  "amount": 5000,
  "currency": "PHP",
  "payment_method": "gcash",
  "payment_details": {
    "account_number": "09123456789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment_123",
    "commission_id": "commission_123",
    "amount": 5000,
    "currency": "PHP",
    "status": "pending",
    "payment_method": "gcash",
    "escrow_id": "escrow_123",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /payments/{payment_id}
Get payment status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment_123",
    "commission_id": "commission_123",
    "amount": 5000,
    "currency": "PHP",
    "status": "completed",
    "payment_method": "gcash",
    "escrow_id": "escrow_123",
    "transaction_id": "txn_123",
    "completed_at": "2024-01-01T12:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Messaging

### GET /messages/{conversation_id}
Get messages for a conversation.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "message_123",
      "conversation_id": "conversation_123",
      "sender_id": "user_123",
      "sender": {
        "id": "user_123",
        "username": "artist123",
        "full_name": "John Doe",
        "profile_image": "https://example.com/profile.jpg"
      },
      "content": "Hello! I'm interested in your artwork.",
      "message_type": "text",
      "attachments": [],
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /messages
Send a new message.

**Request Body:**
```json
{
  "conversation_id": "conversation_123",
  "content": "Hello! I'm interested in your artwork.",
  "message_type": "text",
  "attachments": []
}
```

---

## Reviews

### GET /reviews/{user_id}
Get reviews for a user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "review_123",
      "reviewer_id": "user_456",
      "reviewer": {
        "id": "user_456",
        "username": "client456",
        "full_name": "Jane Smith",
        "profile_image": "https://example.com/client.jpg"
      },
      "rating": 5,
      "comment": "Excellent work! Very professional and delivered on time.",
      "commission_id": "commission_123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /reviews
Create a new review.

**Request Body:**
```json
{
  "reviewed_user_id": "user_123",
  "rating": 5,
  "comment": "Excellent work! Very professional and delivered on time.",
  "commission_id": "commission_123"
}
```

---

## Events

### GET /events
Get events with optional filters.

**Query Parameters:**
- `location`: Filter by location
- `radius`: Search radius in km
- `category`: Filter by event category
- `start_date`: Filter by start date
- `end_date`: Filter by end date
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event_123",
      "title": "Art Exhibition 2024",
      "description": "Annual art exhibition featuring local artists",
      "category": "exhibition",
      "location": "Manila Art Gallery",
      "latitude": 14.5995,
      "longitude": 120.9842,
      "start_date": "2024-02-01T00:00:00Z",
      "end_date": "2024-02-07T00:00:00Z",
      "organizer_id": "user_123",
      "organizer": {
        "id": "user_123",
        "username": "organizer123",
        "full_name": "John Doe"
      },
      "image": "https://example.com/event.jpg",
      "is_featured": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## File Upload

### POST /upload/image
Upload an image file.

**Request:**
- Content-Type: multipart/form-data
- Body: file (image file), type (profile, artwork, reference)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/image_123.jpg",
    "filename": "image_123.jpg",
    "size": 1024000,
    "type": "artwork"
  }
}
```

---

## WebSocket Endpoints

### Real-time Updates
Connect to WebSocket for real-time updates:
```
wss://api.brushandcoin.com/ws
```

**Events:**
- `message_received`: New message notification
- `commission_updated`: Commission status change
- `payment_updated`: Payment status change
- `user_online`: User online status change

**Message Format:**
```json
{
  "event": "message_received",
  "data": {
    "message_id": "message_123",
    "conversation_id": "conversation_123",
    "sender_id": "user_123",
    "content": "Hello!"
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Rate limit headers included in responses

## Pagination
All list endpoints support pagination with these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Pagination metadata included in response:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```
