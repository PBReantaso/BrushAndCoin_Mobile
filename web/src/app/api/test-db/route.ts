import pool from '@/lib/db/config';

export async function GET() {
  try {
    // Test the connection
    const client = await pool.connect();
    
    // Run a simple query
    const result = await client.query('SELECT NOW()');
    
    // Release the client
    client.release();
    
    return new Response(JSON.stringify({ 
      status: 'success',
      time: result.rows[0].now 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({ 
      status: 'error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}