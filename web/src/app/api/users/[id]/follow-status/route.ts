import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;
    const userId = id;

    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUserId = session.user.id;

    // Get follow stats
    const result = await query(
      `SELECT 
        (SELECT COUNT(*) FROM follows WHERE following_id = $1) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = $1) as following_count,
        EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = $1) as is_following`,
      [userId, currentUserId]
    );

    const stats = result.rows[0];

    return NextResponse.json({
      followers_count: parseInt(stats.followers_count),
      following_count: parseInt(stats.following_count),
      is_following: stats.is_following,
      is_own_profile: currentUserId === userId
    });

  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}