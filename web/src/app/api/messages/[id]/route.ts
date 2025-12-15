import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET messages in a conversation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ messages: [], warning: 'Database not configured' })
  }
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    const conversationId = params.id

    // verify participant
    const participant = await query(
      `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, userId]
    )
    if (participant.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 500)
    const offset = parseInt(searchParams.get('offset') || '0')

    const messagesRes = await query(
      `SELECT id, sender_id, text, created_at 
         FROM messages 
        WHERE conversation_id = $1 
        ORDER BY created_at ASC
        LIMIT $2 OFFSET $3`,
      [conversationId, limit, offset]
    )

    // update last_read_at
    await query(
      `UPDATE conversation_participants SET last_read_at = now() WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, userId]
    )

    const messages = messagesRes.rows.map(m => ({
      id: m.id,
      content: m.text,
      senderId: m.sender_id,
      timestamp: m.created_at,
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('GET messages error:', error)
    const message = error?.message || 'Internal server error'
    return NextResponse.json({ error: message, messages: [] }, { status: 500 })
  }
}

// POST send a message
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    const conversationId = params.id
    const body = await request.json()
    const text = (body?.text || '').toString().trim()

    if (!text) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 })
    }

    // verify participant
    const participant = await query(
      `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, userId]
    )
    if (participant.rows.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const insert = await query(
      `INSERT INTO messages (conversation_id, sender_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, text, created_at`,
      [conversationId, userId, text]
    )

    // bump conversation updated_at
    await query(
      `UPDATE conversations SET updated_at = now() WHERE id = $1`,
      [conversationId]
    )

    const message = insert.rows[0]

    return NextResponse.json({
      message: {
        id: message.id,
        content: message.text,
        senderId: message.sender_id,
        timestamp: message.created_at,
      }
    })
  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

