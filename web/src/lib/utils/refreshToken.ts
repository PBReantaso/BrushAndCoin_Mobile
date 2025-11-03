import { jwtUtils } from './jwt';

interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export const refreshTokenUtils = {
  async createRefreshToken(userId: string): Promise<string> {
    // Increment token version in database
    const result = await db.query(
      'UPDATE users SET token_version = COALESCE(token_version, 0) + 1 WHERE id = $1 RETURNING token_version',
      [userId]
    );
    
    const tokenVersion = result.rows[0]?.token_version || 0;
    
    // Create refresh token with longer expiration (7 days)
    return jwtUtils.sign({ 
      userId, 
      tokenVersion,
      type: 'refresh'
    }, '7d');
  },

  async validateRefreshToken(token: string): Promise<string | null> {
    try {
      const decoded = jwtUtils.verify(token) as RefreshTokenPayload;
      
      // Verify token version matches database
      const result = await db.query(
        'SELECT token_version FROM users WHERE id = $1',
        [decoded.userId]
      );

      const currentVersion = result.rows[0]?.token_version;
      
      if (currentVersion !== decoded.tokenVersion) {
        return null;
      }

      // Generate new access token
      return jwtUtils.sign({
        userId: decoded.userId,
        type: 'access'
      }, '24h');
      
    } catch (error) {
      console.error('Refresh token validation error:', error);
      return null;
    }
  }
};