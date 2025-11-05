import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const result = await query(
      `SELECT 
        id, username, first_name, last_name, user_type,
        bio, profile_image_url, is_verified,
        location_address, created_at
       FROM users 
       WHERE id = $1 AND is_active = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        bio: user.bio,
        profile_image_url: user.profile_image_url,
        is_verified: user.is_verified,
        location_address: user.location_address,
        created_at: user.created_at,
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}