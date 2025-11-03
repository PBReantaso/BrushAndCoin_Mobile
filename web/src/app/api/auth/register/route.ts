// app/api/auth/register/route.ts
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('🔄 Register API called');
  
  try {
    const userData = await request.json();
    console.log('📝 Registration data received:', { 
      email: userData.email, 
      first_name: userData.first_name, 
      last_name: userData.last_name
    });

    // Validation
    if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
      const missing = [];
      if (!userData.email) missing.push('email');
      if (!userData.password) missing.push('password');
      if (!userData.first_name) missing.push('first_name');
      if (!userData.last_name) missing.push('last_name');
      
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: missing 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [userData.email]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists with email:', userData.email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Add this right after your existing user check
  console.log('🔍 Checking actual table structure...');
  try {
    const tableInfo = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Actual users table columns:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });
  } catch (error) {
    console.error('❌ Failed to check table structure:', error);
  }

  // Check current database
  const dbInfo = await query('SELECT current_database(), current_schema()');
  console.log('📊 Database info:', dbInfo.rows[0]);

    // Check username uniqueness if provided
    if (userData.username) {
      console.log('🔍 Checking username uniqueness...');
      const existingUsername = await query(
        'SELECT id FROM users WHERE username = $1',
        [userData.username]
      );
      
      if (existingUsername.rows.length > 0) {
        console.log('❌ Username already taken:', userData.username);
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user with hashed password - SIMPLIFIED
    console.log('👤 Creating user in database...');
    const userResult = await query(
  `INSERT INTO users (email, password, first_name, last_name, username, user_type)
   VALUES ($1, $2, $3, $4, $5, $6) 
   RETURNING id, email, first_name, last_name, username, user_type,
             is_verified, bio, profile_image_url, location_address, created_at`,
  [
    userData.email, 
    hashedPassword,
    userData.first_name, 
    userData.last_name, 
    userData.username || null,
    userData.user_type || 'user'
  ]
);

    const newUser = userResult.rows[0];
    console.log('✅ User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.first_name} ${newUser.last_name}`
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error: any) {
    console.error('❌ Registration API error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}