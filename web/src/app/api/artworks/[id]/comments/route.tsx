import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET: Fetch comments for an artwork
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artworkId = id;

    // Check if artwork exists
    const artworkCheck = await query(
      'SELECT id FROM artworks WHERE id = $1',
      [artworkId]
    );

    if (artworkCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Get comments with user information
    const result = await query(
      `SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.username,
        u.profile_image_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.artwork_id = $1
       ORDER BY c.created_at DESC`,
      [artworkId]
    );

    const comments = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      artwork_id: row.artwork_id,
      comment: row.comment,
      created_at: row.created_at,
      user: {
        first_name: row.first_name,
        last_name: row.last_name,
        username: row.username,
        profile_image_url: row.profile_image_url,
      }
    }));

    return NextResponse.json({ comments });

  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add a comment to an artwork
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artworkId = id;

    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { comment } = body;

    if (!comment?.trim()) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    // Check if artwork exists
    const artworkCheck = await query(
      'SELECT id FROM artworks WHERE id = $1',
      [artworkId]
    );

    if (artworkCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Insert comment
    const result = await query(
      `INSERT INTO comments (user_id, artwork_id, comment)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, artwork_id, comment, created_at`,
      [session.user.id, artworkId, comment.trim()]
    );

    // Get user information for the response
    const userResult = await query(
      'SELECT first_name, last_name, username, profile_image_url FROM users WHERE id = $1',
      [session.user.id]
    );

    const newComment = {
      id: result.rows[0].id,
      user_id: result.rows[0].user_id,
      artwork_id: result.rows[0].artwork_id,
      comment: result.rows[0].comment,
      created_at: result.rows[0].created_at,
      user: userResult.rows[0]
    };

    return NextResponse.json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}