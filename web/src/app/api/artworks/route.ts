import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Fetch artworks (all or by user)
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || session.user.id; // Default to current user
    
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

// POST - Create new artwork/post
export async function POST(request: Request) {
  console.log('🔄 Create artwork API called');
  
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not configured');
      return NextResponse.json(
        { error: 'Database not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const artworkData = await request.json();
    console.log('📝 Artwork data received:', { 
      title: artworkData.title, 
      category: artworkData.category,
      hasImage: !!artworkData.image_urls?.length
    });

    // Validation
    if (!artworkData.title || artworkData.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Prepare data
    const title = artworkData.title.trim();
    const description = artworkData.description?.trim() || null;
    const image_urls = artworkData.image_urls || [];
    const category = artworkData.category?.trim() || null;
    const tags = artworkData.tags || [];
    const price = artworkData.price ? parseFloat(artworkData.price.toString()) : null;
    const is_commission = artworkData.is_commission || false;
    const is_available = artworkData.is_available !== undefined ? artworkData.is_available : true;

    // Create artwork in database
    console.log('👤 Creating artwork in database...');
    const result = await query(
      `INSERT INTO artworks (
        user_id, title, description, image_urls, category, tags, 
        price, is_commission, is_available
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, title, description, image_urls, category, tags, 
                 price, is_commission, is_available, created_at, updated_at`,
      [
        session.user.id,
        title,
        description,
        image_urls,
        category,
        tags,
        price,
        is_commission,
        is_available
      ]
    );

    const newArtwork = result.rows[0];
    console.log('✅ Artwork created successfully:', {
      id: newArtwork.id,
      title: newArtwork.title
    });

    return NextResponse.json({
      message: 'Artwork created successfully',
      artwork: {
        id: newArtwork.id,
        title: newArtwork.title,
        description: newArtwork.description,
        image_urls: newArtwork.image_urls || [],
        category: newArtwork.category,
        tags: newArtwork.tags || [],
        price: newArtwork.price,
        is_commission: newArtwork.is_commission,
        is_available: newArtwork.is_available,
        created_at: newArtwork.created_at,
        updated_at: newArtwork.updated_at
      }
    });

  } catch (error: any) {
    console.error('❌ Create artwork API error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    
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
        error: 'Failed to create artwork. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}