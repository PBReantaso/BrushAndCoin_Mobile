import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST - Join an event
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check if event exists and is active
    const eventResult = await query(
      'SELECT id, max_attendees FROM events WHERE id = $1 AND is_active = true',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found or inactive' },
        { status: 404 }
      );
    }

    const event = eventResult.rows[0];

    // Check if user is already registered
    const existingRegistration = await query(
      'SELECT id FROM event_attendees WHERE event_id = $1 AND user_id = $2',
      [eventId, session.user.id]
    );

    if (existingRegistration.rows.length > 0) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.max_attendees) {
      const attendeeCountResult = await query(
        'SELECT COUNT(*) as count FROM event_attendees WHERE event_id = $1',
        [eventId]
      );
      const attendeeCount = parseInt(attendeeCountResult.rows[0].count);

      if (attendeeCount >= event.max_attendees) {
        return NextResponse.json(
          { error: 'Event is full' },
          { status: 400 }
        );
      }
    }

    // Register user for event
    await query(
      'INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2)',
      [eventId, session.user.id]
    );

    return NextResponse.json({
      message: 'Successfully joined event'
    });

  } catch (error: any) {
    console.error('Join event error:', error);
    
    // Handle unique constraint violation (already registered)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 });
  }
}


