import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Get recent artworks only from users that the current user follows
    // Also include the user's own artworks
    const result = await query(
      `SELECT DISTINCT
        a.id, a.title, a.description, a.image_urls, a.category, a.tags, a.price,
        a.is_commission, a.is_available, a.created_at, a.updated_at,
        u.id as user_id, u.username, u.first_name, u.last_name, u.profile_image_url
       FROM artworks a
       JOIN users u ON a.user_id = u.id
       WHERE a.is_available = true
         AND (
           a.user_id = $1
           OR EXISTS (
             SELECT 1 FROM follows f
             WHERE f.follower_id = $1
             AND f.following_id = a.user_id
           )
         )
       ORDER BY a.created_at DESC
       LIMIT 20`,
      [currentUserId]
    );

    const artworks = result.rows.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      image_urls: artwork.image_urls || [],
      category: artwork.category,
      tags: artwork.tags || [],
      price: artwork.price,
      is_commission: artwork.is_commission,
      is_available: artwork.is_available,
      created_at: artwork.created_at,
      updated_at: artwork.updated_at,
      user: {
        id: artwork.user_id,
        username: artwork.username,
        first_name: artwork.first_name,
        last_name: artwork.last_name,
        profile_image_url: artwork.profile_image_url,
      }
    }));

    return NextResponse.json({ artworks });

  } catch (error) {
    console.error('Get recent artworks error:', error);
    // Return empty array on error
    return NextResponse.json({ artworks: [] });
  }
}