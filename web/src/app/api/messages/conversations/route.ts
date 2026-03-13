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
      SELECT 
        c.id,
        c.created_at,
        c.updated_at,
        jsonb_build_object(
          'id', u.id,
          'username', u.username,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_image_url', u.profile_image_url
        ) as other_user,
        lm.text as last_message_text,
        lm.created_at as last_message_at,
        lm.sender_id as last_message_sender_id
      FROM conversations c
      LEFT JOIN messages lm ON lm.id = c.last_message_id
      LEFT JOIN users u ON u.id = (
        CASE 
          WHEN c.participant1_id = $1 THEN c.participant2_id
          ELSE c.participant1_id
        END
      )
      WHERE c.participant1_id = $1 OR c.participant2_id = $1
      ORDER BY COALESCE(c.last_message_at, c.created_at) DESC;
      `,
      [userId]
    )

    const conversations = result.rows.map((row: any) => {
      const ou = row.other_user || {}
      return {
        id: row.id,
        other_user: {
          id: ou.id,
          username: ou.username,
          first_name: ou.first_name,
          last_name: ou.last_name,
          profile_image_url: ou.profile_image_url,
        },
        last_message: row.last_message_text ? {
          text: row.last_message_text,
          created_at: row.last_message_at,
          sender_id: row.last_message_sender_id,
        } : null,
        updated_at: row.updated_at,
        created_at: row.created_at,
      }
    })

    return NextResponse.json({ conversations })
  } catch (error: any) {
    console.error('GET conversations error:', error)
    // If schema is missing (e.g. migration not run), return empty so the page loads
    const msg = String(error?.message || error)
    if (msg.includes('participant1_id') || msg.includes('column') || msg.includes('does not exist')) {
      return NextResponse.json({ conversations: [] })
    }
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

    // Ensure participant1_id < participant2_id for canonical ordering
    const participant1_id = userId < targetUserId ? userId : targetUserId
    const participant2_id = userId < targetUserId ? targetUserId : userId

    // find existing conversation with these two participants
    const existing = await query(
      `
      SELECT id
      FROM conversations
      WHERE (participant1_id = $1 AND participant2_id = $2)
         OR (participant1_id = $2 AND participant2_id = $1)
      LIMIT 1;
      `,
      [userId, targetUserId]
    )

    let conversationId: string
    if (existing.rows.length > 0) {
      conversationId = existing.rows[0].id
    } else {
      const convo = await query(
        `INSERT INTO conversations (participant1_id, participant2_id) VALUES ($1, $2) RETURNING id`,
        [participant1_id, participant2_id]
      )
      conversationId = convo.rows[0].id
    }

    return NextResponse.json({
      id: conversationId,
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
    const msg = String(error?.message || error)
    if (msg.includes('participant1_id') || msg.includes('column') || msg.includes('does not exist')) {
      return NextResponse.json({ 
        error: 'Database schema needs migration. Run: GET /api/setup-db or apply migrations 002 and 003.',
        details: msg
      }, { status: 503 })
    }
    const errorMessage = error?.message || String(error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

