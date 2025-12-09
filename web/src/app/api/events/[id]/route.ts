import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Fetch event by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get event with organizer info
    const result = await query(
      `SELECT 
        e.id, e.title, e.description, e.event_date, e.location_address,
        e.location_lat, e.location_lng, e.max_attendees, e.registration_fee, e.image_urls, e.schedule,
        e.is_active, e.created_at, e.updated_at,
        u.id as organizer_id, u.username, u.first_name, u.last_name, u.profile_image_url
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1 AND e.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const event = result.rows[0];

    // Get attendee count
    const attendeeCountResult = await query(
      'SELECT COUNT(*) as count FROM event_attendees WHERE event_id = $1',
      [id]
    );
    const attendeeCount = parseInt(attendeeCountResult.rows[0].count);

    // Get participant list
    const participantsResult = await query(
      `SELECT 
        u.id, u.username, u.first_name, u.last_name, u.profile_image_url
       FROM event_attendees ea
       JOIN users u ON ea.user_id = u.id
       WHERE ea.event_id = $1
       ORDER BY u.first_name ASC, u.last_name ASC`,
      [id]
    );
    const participants = participantsResult.rows.map((p: any) => ({
      id: p.id,
      username: p.username,
      first_name: p.first_name,
      last_name: p.last_name,
      profile_image_url: p.profile_image_url,
    }));

    // Parse schedule if it's a string, otherwise use as is
    let schedule = event.schedule || []
    if (typeof schedule === 'string') {
      try {
        schedule = JSON.parse(schedule)
      } catch (e) {
        schedule = []
      }
    }

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        location_address: event.location_address,
        location_lat: event.location_lat ? parseFloat(event.location_lat) : null,
        location_lng: event.location_lng ? parseFloat(event.location_lng) : null,
        max_attendees: event.max_attendees,
        registration_fee: event.registration_fee ? parseFloat(event.registration_fee) : 0,
        image_urls: event.image_urls || [],
        schedule: schedule,
        is_active: event.is_active,
        created_at: event.created_at,
        updated_at: event.updated_at,
        attendee_count: attendeeCount,
        participants,
        organizer: {
          id: event.organizer_id,
          username: event.username,
          first_name: event.first_name,
          last_name: event.last_name,
          profile_image_url: event.profile_image_url,
        }
      }
    });

  } catch (error: any) {
    console.error('Get event error:', error);
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE - Delete event (only by organizer)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // First, check if event exists and get organizer
    const eventCheck = await query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const organizerId = eventCheck.rows[0].organizer_id;

    // Check if current user is the organizer
    if (organizerId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this event' },
        { status: 403 }
      );
    }

    // Delete event (soft delete by setting is_active to false, or hard delete)
    // Using soft delete to preserve data integrity
    await query(
      'UPDATE events SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    return NextResponse.json({
      message: 'Event deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete event error:', error);
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 });
  }
}

