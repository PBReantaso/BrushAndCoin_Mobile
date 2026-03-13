import { pool } from '@/lib/db/config';
import { query } from '@/lib/db';
import { jwtUtils } from '@/lib/utils/jwt';
import { refreshTokenUtils } from '@/lib/utils/refreshToken';
import bcrypt from 'bcryptjs';

export interface UserData {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  bio?: string;
  profile_image_url?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    user_type: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(userData: UserData): Promise<AuthResponse> {
    const client = await pool.connect();
    try {
      // Start transaction
      await client.query('BEGIN');

      // Check if email or username exists
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [userData.email, userData.username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Email or username already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Prepare full_name from provided first/last
      //const fullName = `${userData.first_name.trim()} ${userData.last_name.trim()}`;

      // Insert new user with hashed password
      const result = await client.query(
      `INSERT INTO users (
        email, username, password, first_name, last_name, user_type,
        bio, profile_image_url, location_address, location_lat, location_lng
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, username, first_name, last_name, user_type, created_at`,
      [
        userData.email,
        userData.username,
        hashedPassword,
        userData.first_name,
        userData.last_name,
        userData.user_type || 'user',
        userData.bio || null,
        userData.profile_image_url || null,
        userData.location_address || null,
        userData.location_lat || null,
        userData.location_lng || null
      ]
    );

      // Commit transaction
      await client.query('COMMIT');

      const user = result.rows[0];
      
      // Generate tokens
      const accessToken = jwtUtils.sign({
        userId: String(user.id),
        email: user.email,
        username: user.username,
        type: 'access'
      });
      
      const refreshToken = await refreshTokenUtils.createRefreshToken(String(user.id));

      // Split full_name for response
      const names = user.full_name.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');

      return {
        user: {
          id: String(user.id),
          email: user.email,
          username: user.username,
          first_name: firstName,
          last_name: lastName,
          user_type: user.user_type,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      
      console.error('Registration error:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      
      switch (error.code) {
        case '23505': // unique_violation
          throw new Error('This email or username is already taken');
        case '23502': // not_null_violation
          throw new Error(`Missing required field: ${error.column}`);
        default:
          throw new Error(error.message || 'Registration failed');
      }
    } finally {
      client.release();
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const result = await query(
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

      const accessToken = jwtUtils.sign({
        userId: String(user.id),
        email: user.email,
        username: user.username,
        type: 'access'
      });

      const refreshToken = await refreshTokenUtils.createRefreshToken(String(user.id));

      const names = user.full_name.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');

      return {
        user: {
          id: String(user.id),
          email: user.email,
          username: user.username,
          first_name: firstName,
          last_name: lastName,
          user_type: user.user_type,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  async validateToken(token: string) {
    try {
      const decoded = jwtUtils.verify(token);

      if (!decoded.userId) {
        return null;
      }

      const result = await query(
        'SELECT id, email, username, full_name, user_type FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      const names = user.full_name.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');

      return {
        id: String(user.id),
        email: user.email,
        username: user.username,
        first_name: firstName,
        last_name: lastName,
        user_type: user.user_type,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
};