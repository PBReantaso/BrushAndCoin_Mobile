import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET messages in a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    const { id: conversationId } = await params

    // Verify user is a participant (check conversations.participant1_id/participant2_id for 1:1 chats)
    const convCheck = await query(
      `SELECT id FROM conversations WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)`,
      [conversationId, userId]
    )
    if (convCheck.rows.length === 0) {
      // Fallback: check conversation_participants if used
      const participant = await query(
        `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
        [conversationId, userId]
      )
      if (participant.rows.length === 0) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
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

    // Update last_read_at if conversation_participants is used (optional)
    try {
      await query(
        `UPDATE conversation_participants SET last_read_at = now() WHERE conversation_id = $1 AND user_id = $2`,
        [conversationId, userId]
      )
    } catch (_) { /* ignore if table/row missing */ }

    const messages = messagesRes.rows.map((m: any) => ({
      id: m.id,
      content: m.text,
      text: m.text,
      sender_id: m.sender_id,
      created_at: m.created_at,
    }))

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error('GET messages error:', error)
    const errorMessage = error?.message || String(error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

// POST send a message
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id
    const { id: conversationId } = await params
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
  } catch (error: any) {
    console.error('POST message error:', error)
    const errorMessage = error?.message || String(error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}

