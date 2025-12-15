import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { publishEvent } from '@/lib/sse';
import { NextRequest, NextResponse } from 'next/server';

function normalizeMessage(m: any) {
  return {
    id: m.id,
    content: m.message ?? m.text ?? '',
    messageType: m.message_type || m.type || 'text',
    timestamp: m.created_at ?? m.createdAt ?? m.timestamp,
    senderId: m.sender_id ?? m.sender?.id,
    receiverId: m.receiver_id ?? m.receiver?.id,
    sender: m.sender ?? null,
    receiver: m.receiver ?? null,
    replyTo: m.replyToMessage
      ? {
          id: m.replyToMessage.id,
          content: m.replyToMessage.message ?? m.replyToMessage.text,
          sender: m.replyToMessage.sender ?? null,
        }
      : null,
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (conversationId) {
      // Get messages for a specific conversation using SQL (schema has snake_case)
      const rawMessages = await query(
        `SELECT 
          m.id, m.conversation_id, m.sender_id, m.receiver_id,
          m.text as message, m.message_type, m.attachment_url, m.is_read, m.created_at,
          s.id as sender_id, s.username as sender_username, s.first_name as sender_first_name, s.last_name as sender_last_name, s.profile_image_url as sender_profile_image_url,
          r.id as receiver_id, r.username as receiver_username, r.first_name as receiver_first_name, r.last_name as receiver_last_name, r.profile_image_url as receiver_profile_image_url
        FROM messages m
        LEFT JOIN users s ON m.sender_id = s.id
        LEFT JOIN users r ON m.receiver_id = r.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC
        LIMIT $2 OFFSET $3`,
        [conversationId, limit, offset]
      );

      // Normalize messages for client
      const messages = rawMessages.rows.map((m: any) => ({
        id: m.id,
        content: m.message || '',
        messageType: m.message_type || 'text',
        timestamp: m.created_at,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        sender: {
          id: m.sender_id,
          username: m.sender_username,
          first_name: m.sender_first_name,
          last_name: m.sender_last_name,
          profile_image_url: m.sender_profile_image_url,
        },
        receiver: {
          id: m.receiver_id,
          username: m.receiver_username,
          first_name: m.receiver_first_name,
          last_name: m.receiver_last_name,
          profile_image_url: m.receiver_profile_image_url,
        },
      }));

      // Mark messages as read
      await query(
        `UPDATE messages SET is_read = true WHERE conversation_id = $1 AND receiver_id = $2 AND is_read = false`,
        [conversationId, session.user.id]
      );

      return NextResponse.json(messages);
    }

    if (userId) {
      // Get or create conversation between two users
      let conversation = await db.conversation.findFirst({
        where: {
          OR: [
            { participant1_id: session.user.id, participant2_id: userId },
            { participant1_id: userId, participant2_id: session.user.id },
          ],
        },
        include: {
          participant1: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              profile_image_url: true,
            },
          },
          participant2: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              profile_image_url: true,
            },
          },
          lastMessage: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      });

      if (!conversation) {
        // Create new conversation
        const [participant1, participant2] = 
          session.user.id < userId 
            ? [session.user.id, userId]
            : [userId, session.user.id];

        conversation = await db.conversation.create({
          data: {
            participant1_id: participant1,
            participant2_id: participant2,
          },
          include: {
            participant1: {
              select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                profile_image_url: true,
              },
            },
            participant2: {
              select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                profile_image_url: true,
              },
            },
          },
        });
      }

      return NextResponse.json(conversation);
    }

    // Get all conversations for the user
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { participant1_id: session.user.id },
          { participant2_id: session.user.id },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            profile_image_url: true,
          },
        },
        participant2: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            profile_image_url: true,
          },
        },
        lastMessage: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                receiver_id: session.user.id,
                is_read: false,
              },
            },
          },
        },
      },
      orderBy: { last_message_at: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, receiverId, content, message, messageType = 'text', attachmentUrl, replyToMessageId } = body;

    // Accept both 'content' and 'message' field names
    const messageText = content || message;

    if (!messageText || (!conversationId && !receiverId)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let conversation;
    if (conversationId) {
      // Fetch existing conversation
      const convResult = await query(
        `SELECT id, participant1_id, participant2_id FROM conversations WHERE id = $1`,
        [conversationId]
      );
      conversation = convResult.rows[0];
    } else if (receiverId) {
      // Determine participant order (canonical: smaller ID first)
      const [participant1, participant2] = 
        session.user.id < receiverId 
          ? [session.user.id, receiverId]
          : [receiverId, session.user.id];

      // Try to find existing conversation
      let convResult = await query(
        `SELECT id, participant1_id, participant2_id FROM conversations 
         WHERE participant1_id = $1 AND participant2_id = $2`,
        [participant1, participant2]
      );

      if (convResult.rows.length === 0) {
        // Create new conversation
        convResult = await query(
          `INSERT INTO conversations (participant1_id, participant2_id, created_at) 
           VALUES ($1, $2, NOW()) 
           RETURNING id, participant1_id, participant2_id`,
          [participant1, participant2]
        );
      }
      conversation = convResult.rows[0];
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create message using raw SQL
    const msgResult = await query(
      `INSERT INTO messages 
       (conversation_id, sender_id, receiver_id, text, message_type, attachment_url, is_read, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW())
       RETURNING id, conversation_id, sender_id, receiver_id, text, message_type, attachment_url, is_read, created_at`,
      [conversation.id, session.user.id, receiverId || (conversation.participant2_id === session.user.id ? conversation.participant1_id : conversation.participant2_id), messageText, messageType, attachmentUrl]
    );

    const newMessage = msgResult.rows[0];

    // Fetch sender and receiver details
    const userResult = await query(
      `SELECT id, username, first_name, last_name, profile_image_url FROM users WHERE id IN ($1, $2)`,
      [session.user.id, newMessage.receiver_id]
    );

    const userMap = Object.fromEntries(userResult.rows.map((u: any) => [u.id, u]));
    const senderData = userMap[newMessage.sender_id];
    const receiverData = userMap[newMessage.receiver_id];

    // Normalize message for response
    const normalizedMessage = {
      id: newMessage.id,
      content: newMessage.text || '',
      messageType: newMessage.message_type || 'text',
      timestamp: newMessage.created_at,
      senderId: newMessage.sender_id,
      receiverId: newMessage.receiver_id,
      sender: senderData ? {
        id: senderData.id,
        username: senderData.username,
        first_name: senderData.first_name,
        last_name: senderData.last_name,
        profile_image_url: senderData.profile_image_url,
      } : null,
      receiver: receiverData ? {
        id: receiverData.id,
        username: receiverData.username,
        first_name: receiverData.first_name,
        last_name: receiverData.last_name,
        profile_image_url: receiverData.profile_image_url,
      } : null,
    };

    // Update conversation last message info
    await query(
      `UPDATE conversations SET last_message_id = $1, last_message_at = NOW() WHERE id = $2`,
      [newMessage.id, conversation.id]
    );

    // Publish to local SSE subscribers
    try {
      await publishEvent(conversation.id, { event: 'new-message', message: normalizedMessage })
    } catch (err) {
      console.error('SSE publish error:', err)
    }

    return NextResponse.json(normalizedMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}