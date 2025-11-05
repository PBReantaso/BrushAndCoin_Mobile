import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get featured artists (users with most artworks or other criteria)
    const result = await query(
      `SELECT 
        u.id, u.username, u.first_name, u.last_name, u.profile_image_url, u.bio,
        COUNT(a.id) as artwork_count
       FROM users u
       LEFT JOIN artworks a ON u.id = a.user_id AND a.is_available = true
       WHERE u.is_active = true
       GROUP BY u.id
       ORDER BY artwork_count DESC, u.created_at DESC
       LIMIT 8`
    );

    const artists = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image_url: user.profile_image_url,
      bio: user.bio,
      artwork_count: parseInt(user.artwork_count),
    }));

    return NextResponse.json({ artists });

  } catch (error) {
    console.error('Get featured artists error:', error);
    // Return empty array on error
    return NextResponse.json({ artists: [] });
  }
}