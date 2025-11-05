import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // First, check if the user exists (without is_active check for now)
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      // User doesn't exist, return empty array instead of error
      return NextResponse.json({ artworks: [] });
    }

    // Check if artworks table exists
    try {
      const tableExists = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'artworks'
        );
      `);

      if (!tableExists.rows[0].exists) {
        return NextResponse.json({ artworks: [] });
      }

      // Get artworks
      const result = await query(
        `SELECT 
          id, title, description, image_urls, category, tags, price,
          is_commission, is_available, created_at, updated_at
         FROM artworks 
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
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
        updated_at: artwork.updated_at
      }));

      return NextResponse.json({ artworks });

    } catch (tableError) {
      // Artworks table might not exist yet
      console.log('Artworks table not accessible, returning empty array');
      return NextResponse.json({ artworks: [] });
    }

  } catch (error) {
    console.error('Get user artworks error:', error);
    // Return empty array instead of error
    return NextResponse.json({ artworks: [] });
  }
}