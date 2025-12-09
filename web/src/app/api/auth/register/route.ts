// app/api/auth/register/route.ts
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('🔄 Register API called');
  
  // Check if database is available
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not configured');
    return NextResponse.json(
      { error: 'Database not configured. Please contact support.' },
      { status: 500 }
    );
  }
  
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

    // Handle location - can come as object or separate fields
    let location_address = userData.location_address || null;
    let location_lat = userData.location_lat || null;
    let location_lng = userData.location_lng || null;
    
    // If location comes as an object, extract fields
    if (userData.location && typeof userData.location === 'object') {
      location_address = userData.location.address || location_address;
      location_lat = userData.location.latitude || location_lat;
      location_lng = userData.location.longitude || location_lng;
    }

    // Create user with hashed password and all fields
    console.log('👤 Creating user in database...');
    const userResult = await query(
      `INSERT INTO users (
        email, password, first_name, last_name, username, user_type,
        bio, profile_image_url, location_address, location_lat, location_lng
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, email, first_name, last_name, username, user_type,
                 is_verified, bio, profile_image_url, location_address, created_at`,
      [
        userData.email, 
        hashedPassword,
        userData.first_name, 
        userData.last_name, 
        userData.username || null,
        userData.user_type || 'user',
        userData.bio || null,
        userData.profile_image_url || null,
        location_address,
        location_lat,
        location_lng
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
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique violation
      const detail = error.detail || '';
      if (detail.includes('email')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      } else if (detail.includes('username')) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }
    
    // Handle database connection errors
    if (error.message?.includes('Database pool not initialized') || 
        error.message?.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}