import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get user profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const result = await query(
      `SELECT 
        id, email, username, first_name, last_name, user_type,
        bio, profile_image_url, is_verified, is_active,
        location_address, location_lat, location_lng,
        created_at, updated_at
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    
    // Return user data without sensitive information
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        bio: user.bio,
        profile_image_url: user.profile_image_url,
        is_verified: user.is_verified,
        location_address: user.location_address,
        location_lat: user.location_lat,
        location_lng: user.location_lng,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      username,
      first_name,
      last_name,
      bio,
      profile_image_url,
      location_address,
      location_lat,
      location_lng
    } = body;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (username !== undefined) {
      updateFields.push(`username = $${paramCount}`);
      updateValues.push(username);
      paramCount++;
    }

    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramCount}`);
      updateValues.push(first_name);
      paramCount++;
    }

    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramCount}`);
      updateValues.push(last_name);
      paramCount++;
    }

    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount}`);
      updateValues.push(bio);
      paramCount++;
    }

    if (profile_image_url !== undefined) {
      updateFields.push(`profile_image_url = $${paramCount}`);
      updateValues.push(profile_image_url);
      paramCount++;
    }

    if (location_address !== undefined) {
      updateFields.push(`location_address = $${paramCount}`);
      updateValues.push(location_address);
      paramCount++;
    }

    if (location_lat !== undefined) {
      updateFields.push(`location_lat = $${paramCount}`);
      updateValues.push(location_lat);
      paramCount++;
    }

    if (location_lng !== undefined) {
      updateFields.push(`location_lng = $${paramCount}`);
      updateValues.push(location_lng);
      paramCount++;
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(userId);

    const queryText = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id, email, username, first_name, last_name, user_type,
        bio, profile_image_url, is_verified,
        location_address, location_lat, location_lng,
        created_at, updated_at
    `;

    const result = await query(queryText, updateValues);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = result.rows[0];

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        user_type: updatedUser.user_type,
        bio: updatedUser.bio,
        profile_image_url: updatedUser.profile_image_url,
        is_verified: updatedUser.is_verified,
        location_address: updatedUser.location_address,
        location_lat: updatedUser.location_lat,
        location_lng: updatedUser.location_lng,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}