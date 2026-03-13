import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Reduced from 20 to prevent exhaustion
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test the database connection (log only; do not exit so next build can complete without a live DB)
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
})().catch(() => {});

// Simple query function - let the pool handle connection management
export const query = async <T = any>(
  text: string, 
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> => {
  const start = Date.now();
  
  try {
    // Let the pool handle connection management automatically
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

// Export the pool for transactions if needed
export { pool };
export default query;