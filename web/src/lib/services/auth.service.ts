import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface UserData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  userType?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    username: string;
    fullName: string;
    userType: string;
  };
  token: string;
}

export const authService = {
  async register(userData: UserData): Promise<AuthResponse> {
    // Check if email or username already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [userData.email, userData.username]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email or username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (
        email, username, password_hash, full_name, user_type,
        location_address, location_latitude, location_longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, username, full_name, user_type`,
      [
        userData.email,
        userData.username,
        passwordHash,
        userData.fullName,
        userData.userType || 'user',
        userData.location?.address || null,
        userData.location?.latitude || null,
        userData.location?.longitude || null,
      ]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        userType: user.user_type,
      },
      token,
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const result = await db.query(
      'SELECT id, email, username, password_hash, full_name, user_type FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        userType: user.user_type,
      },
      token,
    };
  },

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: number };
      const result = await db.query(
        'SELECT id, email, username, full_name, user_type FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        userType: user.user_type,
      };
    } catch (error) {
      return null;
    }
  },
};