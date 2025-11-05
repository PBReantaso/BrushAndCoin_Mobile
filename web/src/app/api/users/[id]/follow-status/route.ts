import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const targetUserId = params.id;

    // Check if target user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1 AND is_active = true',
      [targetUserId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get follow stats
    const followersCount = await query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [targetUserId]
    );

    const followingCount = await query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [targetUserId]
    );

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== targetUserId) {
      const followStatus = await query(
        'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
        [currentUserId, targetUserId]
      );
      isFollowing = followStatus.rows.length > 0;
    }

    return NextResponse.json({
      followers_count: parseInt(followersCount.rows[0].count) || 0,
      following_count: parseInt(followingCount.rows[0].count) || 0,
      is_following: isFollowing,
      is_own_profile: currentUserId === targetUserId
    });

  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}