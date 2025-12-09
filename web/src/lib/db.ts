import { Pool } from 'pg';

// Validate DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('⚠️  DATABASE_URL not set. Database features will be disabled. Using mock authentication.');
}

const pool = databaseUrl ? new Pool({ 
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('sslmode=require') || databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : false,
}) : null;

export async function query(text: string, params?: any[]) {
  if (!pool) {
    throw new Error('Database not configured. Please set DATABASE_URL in your .env.local file.');
  }
  
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
