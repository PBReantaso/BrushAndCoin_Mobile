// server.js 
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret';

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BCDB',
  password: 'BoboyAdmin_2025',
  port: 5000,
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication token missing'));
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Track connected users
const connectedUsers = new Map(); // userId -> socketId

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected: ${socket.id}`);
  connectedUsers.set(socket.userId, socket.id);

  // Send message event
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, text, senderId } = data;
      
      // Save message to database
      const result = await pool.query(
        'INSERT INTO messages (conversation_id, sender_id, text, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, created_at',
        [conversationId, senderId, text]
      );

      // Emit to both users in conversation
      io.emit('new_message', {
        id: result.rows[0].id,
        conversationId,
        senderId,
        text,
        createdAt: result.rows[0].created_at,
      });
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // User typing event
  socket.on('user_typing', (data) => {
    const { conversationId } = data;
    socket.broadcast.emit('user_typing', {
      conversationId,
      userId: socket.userId,
    });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    connectedUsers.delete(socket.userId);
    socket.broadcast.emit('user_offline', { userId: socket.userId });
  });
});


// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.listen(PORT + 1, () => {
  console.log(`Socket.io server running on http://localhost:${PORT + 1}`);
});