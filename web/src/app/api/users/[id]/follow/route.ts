import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;
    const userIdToFollow = id;

    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Can't follow yourself
    if (currentUserId === userIdToFollow) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userIdToFollow]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [currentUserId, userIdToFollow]
    );

    if (existingFollow.rows.length > 0) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      );
    }

    // Create follow relationship
    await query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [currentUserId, userIdToFollow]
    );

    return NextResponse.json({ 
      message: 'Successfully followed user',
      followed: true 
    });

  } catch (error) {
    console.error('Follow user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;
    const userIdToUnfollow = id;

    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Delete follow relationship
    const result = await query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [currentUserId, userIdToUnfollow]
    );

    return NextResponse.json({ 
      message: 'Successfully unfollowed user',
      followed: false 
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}