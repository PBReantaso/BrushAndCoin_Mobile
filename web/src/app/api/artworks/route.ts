import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters with defaults
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // First, check if the user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json({ 
        artworks: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        }
      });
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
        return NextResponse.json({ 
          artworks: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            pages: 0
          }
        });
      }

      // Get paginated artworks
      const result = await query(
        `SELECT 
          id, title, description, image_urls, category, tags, price,
          is_commission, is_available, created_at, updated_at
         FROM artworks 
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      // Get total count for pagination
      const countResult = await query(
        'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
        [userId]
      );
      const total = parseInt(countResult.rows[0].count);

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

      return NextResponse.json({ 
        artworks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (tableError) {
      console.log('Artworks table not accessible, returning empty array');
      return NextResponse.json({ 
        artworks: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

  } catch (error) {
    console.error('Get user artworks error:', error);
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 });
  }
}