import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Search users
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!searchQuery || searchQuery.trim().length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Search users by username, first_name, last_name, or email
    const searchTerm = `%${searchQuery.trim()}%`;
    const result = await query(
      `SELECT 
        id, username, first_name, last_name, email, profile_image_url, bio, user_type, is_verified
       FROM users 
       WHERE is_active = true 
         AND (
           username ILIKE $1 
           OR first_name ILIKE $1 
           OR last_name ILIKE $1 
           OR email ILIKE $1
           OR CONCAT(first_name, ' ', last_name) ILIKE $1
         )
       ORDER BY 
         CASE 
           WHEN username ILIKE $2 THEN 1
           WHEN first_name ILIKE $2 OR last_name ILIKE $2 THEN 2
           ELSE 3
         END,
         username ASC
       LIMIT $3`,
      [searchTerm, `%${searchQuery.trim()}%`, limit]
    );

    const users = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_image_url: user.profile_image_url,
      bio: user.bio,
      user_type: user.user_type,
      is_verified: user.is_verified,
      name: `${user.first_name} ${user.last_name}`.trim()
    }));

    return NextResponse.json({ users });

  } catch (error: any) {
    console.error('Search users error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      users: []
    }, { status: 500 });
  }
}

