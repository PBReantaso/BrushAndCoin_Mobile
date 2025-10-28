import pool from '@/lib/db/config';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Read the setup SQL file
      const setupSql = readFileSync(
        join(process.cwd(), 'src', 'lib', 'db', 'setup.sql'),
        'utf8'
      );

      // Execute the setup SQL
      await client.query(setupSql);
      
      return new Response(JSON.stringify({ 
        status: 'success',
        message: 'Database setup completed successfully' 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Database setup error:', error);
    return new Response(JSON.stringify({ 
      status: 'error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}