import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email?: string;
  username?: string;
  tokenVersion?: number;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_EXPIRY = '24h';

export const jwtUtils = {
  // Sign a new JWT token
  sign(payload: JWTPayload, expiresIn: string = TOKEN_EXPIRY): string {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn
      });
    } catch (error) {
      console.error('Error signing JWT:', error);
      throw new Error('Failed to create authentication token');
    }
  },

  // Verify and decode a JWT token
  verify(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw error;
    }
  },

  // Decode a JWT token without verification
  decode(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  },

  // Check if a token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) return true;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  },

  // Get remaining time until token expiry in seconds
  getTokenRemainingTime(token: string): number {
    try {
      const decoded = this.decode(token);
      if (!decoded || !decoded.exp) return 0;
      return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
    } catch {
      return 0;
    }
  }
};