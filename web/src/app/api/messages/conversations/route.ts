import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET - list conversations for current user
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const result = await query(
      `
      WITH user_convos AS (
        SELECT conversation_id
        FROM conversation_participants
        WHERE user_id = $1
      )
      SELECT 
        c.id,
        c.created_at,
        c.updated_at,
        jsonb_build_object(
          'id', u.id,
          'username', COALESCE(u.username, ''),
          'first_name', COALESCE(u.first_name, ''),
          'last_name', COALESCE(u.last_name, ''),
          'profile_image_url', u.profile_image_url
        ) as other_user,
        lm.text as last_message_text,
        lm.created_at as last_message_at,
        lm.sender_id as last_message_sender_id,
        COALESCE(unread.count, 0) as unread_count
      FROM conversations c
      JOIN user_convos uc ON uc.conversation_id = c.id
      JOIN conversation_participants cpu 
        ON cpu.conversation_id = c.id 
       AND cpu.user_id <> $1
      JOIN users u ON u.id = cpu.user_id
      LEFT JOIN LATERAL (
        SELECT m.text, m.created_at, m.sender_id
        FROM messages m 
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) as count
        FROM messages m
        JOIN conversation_participants cp2 
          ON cp2.conversation_id = c.id 
         AND cp2.user_id = $1
        WHERE m.conversation_id = c.id
          AND m.sender_id <> $1
          AND (cp2.last_read_at IS NULL OR m.created_at > cp2.last_read_at)
      ) unread ON true
      ORDER BY COALESCE(lm.created_at, c.created_at) DESC;
      `,
      [userId]
    )

    const conversations = result.rows.map(row => ({
      id: row.id,
      other_user: row.other_user,
      last_message: row.last_message_text ? {
        text: row.last_message_text,
        created_at: row.last_message_at,
        sender_id: row.last_message_sender_id,
      } : null,
      unread_count: Number(row.unread_count) || 0,
      updated_at: row.updated_at,
      created_at: row.created_at,
    }))

    return NextResponse.json({ conversations })
  } catch (error: any) {
    console.error('GET conversations error:', error)
    const errorMessage = error?.message || String(error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

// POST - get or create a one-to-one conversation with target user
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    const body = await request.json()
    const targetUserId = body?.targetUserId

    if (!targetUserId || targetUserId === userId) {
      return NextResponse.json({ error: 'Invalid target user' }, { status: 400 })
    }

    // ensure target user exists and active
    const targetRes = await query(
      `SELECT id, username, first_name, last_name, profile_image_url 
         FROM users 
        WHERE id = $1 AND is_active = true`,
      [targetUserId]
    )
    if (targetRes.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const targetUser = targetRes.rows[0]

    // find existing conversation with exactly these two participants
    const existing = await query(
      `
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id IN ($1, $2)
      GROUP BY conversation_id
      HAVING COUNT(*) = 2
         AND SUM(CASE WHEN user_id = $1 THEN 1 ELSE 0 END) = 1
         AND SUM(CASE WHEN user_id = $2 THEN 1 ELSE 0 END) = 1
      LIMIT 1;
      `,
      [userId, targetUserId]
    )

    let conversationId: string
    if (existing.rows.length > 0) {
      conversationId = existing.rows[0].conversation_id
    } else {
      const convo = await query(
        `INSERT INTO conversations DEFAULT VALUES RETURNING id`,
        []
      )
      conversationId = convo.rows[0].id
      await query(
        `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [conversationId, userId, targetUserId]
      )
    }

    return NextResponse.json({
      conversation_id: conversationId,
      other_user: {
        id: targetUser.id,
        username: targetUser.username,
        first_name: targetUser.first_name,
        last_name: targetUser.last_name,
        profile_image_url: targetUser.profile_image_url,
      },
    })
  } catch (error: any) {
    console.error('POST conversations error:', error)
    const errorMessage = error?.message || String(error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

