import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Initialize the PostgreSQL connection pool with better timeout settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 5, // Further reduced to prevent exhaustion
  idleTimeoutMillis: 10000, // Reduced from 30000
  connectionTimeoutMillis: 5000, // Timeout after 5 seconds
  maxUses: 50, // Close connection after 50 uses
});

<<<<<<< Updated upstream
// Test the database connection (log only; do not exit so next build can complete without a live DB)
(async () => {
=======
// Remove the connection test that runs on import - it's causing timeouts
// Instead, export a function to test connection when needed
export const testConnection = async () => {
>>>>>>> Stashed changes
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
<<<<<<< Updated upstream
  }
})().catch(() => {});
=======
    return false;
  }
};
>>>>>>> Stashed changes

// Simple query function
export const query = async <T = any>(
  text: string, 
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> => {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log('Executed query:', {
      text,
      params,
      duration,
      rows: result.rowCount
    });

    return { rows: result.rows, rowCount: result.rowCount ?? 0 };
  } catch (error: any) {
    console.error('Database query error:', {
      text,
      params,
      error: error.message,
      detail: error.detail,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
};

export { pool };
export default query;