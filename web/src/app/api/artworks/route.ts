import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      title,
      description,
      category,
      tags,
      image_urls,
      price,
      is_commission
    } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    // Insert artwork into database
    const result = await query(
      `INSERT INTO artworks (
        user_id, title, description, category, tags, image_urls, 
        price, is_commission, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, title, description, category, tags, image_urls, 
                price, is_commission, is_available, created_at`,
      [
        session.user.id,
        title,
        description,
        category,
        tags || [],
        image_urls || [],
        price || null,
        is_commission || false,
        true
      ]
    );

    const artwork = result.rows[0];

    return NextResponse.json({
      message: 'Artwork created successfully',
      artwork: {
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        category: artwork.category,
        tags: artwork.tags,
        image_urls: artwork.image_urls,
        price: artwork.price,
        is_commission: artwork.is_commission,
        is_available: artwork.is_available,
        created_at: artwork.created_at
      }
    });

  } catch (error: any) {
    console.error('Create artwork error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'An artwork with this title already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}