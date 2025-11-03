import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    console.log(`🔍 Executing query: ${text}`);
    const result = await client.query(text, params);
    console.log(`✅ Query successful, rows: ${result.rowCount}`);
    return result;
  } catch (error: any) {
    console.error('❌ Database error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email: string) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );
  return result.rows[0];
}

export async function createUser(userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username?: string;
  user_type?: string;
  bio?: string;
  profile_image_url?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
}) {
  const { 
    email, 
    password, 
    first_name, 
    last_name, 
    username, 
    user_type = 'user',
    bio,
    profile_image_url,
    location_address,
    location_lat,
    location_lng
  } = userData;
  
  const result = await query(
    `INSERT INTO users (
      email, password, first_name, last_name, username, user_type,
      bio, profile_image_url, location_address, location_lat, location_lng
    ) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
     RETURNING id, email, first_name, last_name, username, user_type, 
               is_verified, bio, profile_image_url, location_address, created_at`,
    [
      email, password, first_name, last_name, username, user_type,
      bio || null, profile_image_url || null, location_address || null, 
      location_lat || null, location_lng || null
    ]
  );
  
  return result.rows[0];
}
