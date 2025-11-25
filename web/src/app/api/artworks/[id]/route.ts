import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artworkId = id;

    // Get artwork with user information
    const result = await query(
      `SELECT 
        a.*,
        u.id as user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_image_url
       FROM artworks a
       JOIN users u ON a.user_id = u.id
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