import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: artworkId } = await params;
    const userId = session.user.id;

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

    // Ensure likes table exists (idempotent) — avoid 500s when migrations haven't run
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS public.likes (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          user_id uuid NOT NULL,
          artwork_id uuid NOT NULL,
          created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT likes_pkey PRIMARY KEY (id),
          CONSTRAINT likes_artwork_id_fkey FOREIGN KEY (artwork_id) REFERENCES public.artworks (id) ON DELETE CASCADE,
          CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
          CONSTRAINT likes_unique_like UNIQUE (user_id, artwork_id)
        );
        CREATE INDEX IF NOT EXISTS idx_likes_artwork_id ON public.likes (artwork_id);
        CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes (user_id);
      `);
    } catch (tableErr) {
      console.error('Error ensuring likes table exists:', tableErr);
      // proceed — the subsequent queries will surface a clear error
    }

    // Check if user already liked this artwork
    const existingLike = await query(
      'SELECT id FROM likes WHERE user_id = $1 AND artwork_id = $2',
      [userId, artworkId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike: remove the like
      await query(
        'DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2',
        [userId, artworkId]
      );
    } else {
      // Like: add the like
      await query(
        'INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2)',
        [userId, artworkId]
      );
    }

    // Get updated like count
    const likeCount = await query(
      'SELECT COUNT(*) as count FROM likes WHERE artwork_id = $1',
      [artworkId]
    );

    return NextResponse.json({
      success: true,
      like_count: parseInt(likeCount.rows[0].count),
      liked: existingLike.rows.length === 0,
    });
  } catch (error) {
    console.error('Error updating like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
