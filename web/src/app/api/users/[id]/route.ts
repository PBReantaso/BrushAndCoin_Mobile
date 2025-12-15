import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get user by ID with last seen info
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const result = await query(
      `SELECT 
        id, email, username, first_name, last_name, user_type,
        profile_image_url, is_verified, is_active,
        last_seen, updated_at
       FROM users 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Return user data
    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      profile_image_url: user.profile_image_url,
      is_verified: user.is_verified,
      is_active: user.is_active,
      last_seen: user.last_seen,
      lastActive: user.last_seen, // Alias for compatibility
      updated_at: user.updated_at,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
