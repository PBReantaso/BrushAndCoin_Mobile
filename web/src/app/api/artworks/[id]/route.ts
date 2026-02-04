import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artworkId = id;

    // Get artwork with user information and counts
    const result = await query(
      `SELECT 
        a.*,
        u.id as user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        COALESCE(like_counts.count, 0) as like_count,
        COALESCE(comment_counts.count, 0) as comment_count
       FROM artworks a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN (SELECT artwork_id, COUNT(*) as count FROM likes GROUP BY artwork_id) like_counts ON a.id = like_counts.artwork_id
       LEFT JOIN (SELECT artwork_id, COUNT(*) as count FROM comments GROUP BY artwork_id) comment_counts ON a.id = comment_counts.artwork_id
       WHERE a.id = $1`,
      [artworkId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    const artwork = result.rows[0];

    const responseData = {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      image_urls: artwork.image_urls || [],
      category: artwork.category,
      tags: artwork.tags || [],
      price: artwork.price,
      is_commission: artwork.is_commission,
      is_available: artwork.is_available,
      like_count: parseInt(artwork.like_count) || 0,
      comment_count: parseInt(artwork.comment_count) || 0,
      created_at: artwork.created_at,
      updated_at: artwork.updated_at,
      user: {
        id: artwork.user_id,
        username: artwork.username,
        first_name: artwork.first_name,
        last_name: artwork.last_name,
        profile_image_url: artwork.profile_image_url,
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Get artwork error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}