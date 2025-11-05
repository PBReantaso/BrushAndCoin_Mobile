import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get recent artworks with user information
    const result = await query(
      `SELECT 
        a.id, a.title, a.description, a.image_urls, a.category, a.tags, a.price,
        a.is_commission, a.is_available, a.created_at, a.updated_at,
        u.id as user_id, u.username, u.first_name, u.last_name, u.profile_image_url
       FROM artworks a
       JOIN users u ON a.user_id = u.id
       WHERE a.is_available = true
       ORDER BY a.created_at DESC
       LIMIT 20`
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