import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Fetch all active events
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ events: [] });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Get active events, excluding past events (more than 1 day old)
    const result = await query(
       `SELECT 
        e.id, e.title, e.description, e.event_date, e.location_address,
        e.location_lat, e.location_lng, e.max_attendees, e.registration_fee,
        e.image_urls, e.schedule,
        e.is_active, e.created_at, e.updated_at,
        u.id as organizer_id, u.username, u.first_name, u.last_name, u.profile_image_url
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.is_active = true 
         AND e.event_date >= NOW() - INTERVAL '1 day'
       ORDER BY e.event_date ASC
       LIMIT $1`,
      [limit]
    );

    const events = result.rows.map(event => {
      // Parse schedule if it's a string
      let schedule = event.schedule || []
      if (typeof schedule === 'string') {
        try {
          schedule = JSON.parse(schedule)
        } catch (e) {
          schedule = []
        }
      }

      return {
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
        organizer: {
          id: event.organizer_id,
          username: event.username,
          first_name: event.first_name,
          last_name: event.last_name,
          profile_image_url: event.profile_image_url,
        }
      }
    });

    return NextResponse.json({ events });

  } catch (error: any) {
    console.error('Get events error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      events: []
    }, { status: 500 });
  }
}

// POST - Create new event
export async function POST(request: Request) {
  console.log('🔄 Create event API called');
  
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not configured');
      return NextResponse.json(
        { error: 'Database not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const eventData = await request.json();
    console.log('📝 Event data received:', { 
      title: eventData.title, 
      event_date: eventData.event_date
    });

    // Validation
    if (!eventData.title || eventData.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!eventData.event_date) {
      return NextResponse.json(
        { error: 'Event date is required' },
        { status: 400 }
      );
    }

    // Prepare data
    const title = eventData.title.trim();
    const description = eventData.description?.trim() || null;
    const event_date = new Date(eventData.event_date);
    const location_address = eventData.location_address?.trim() || null;
    const location_lat = eventData.location_lat ? parseFloat(eventData.location_lat.toString()) : null;
    const location_lng = eventData.location_lng ? parseFloat(eventData.location_lng.toString()) : null;
    const max_attendees = eventData.max_attendees ? parseInt(eventData.max_attendees.toString()) : null;
    const registration_fee = eventData.registration_fee ? parseFloat(eventData.registration_fee.toString()) : 0;
    const image_urls = Array.isArray(eventData.image_urls) ? eventData.image_urls.filter(Boolean) : [];
    const schedule = eventData.schedule ? JSON.stringify(eventData.schedule) : null;

    // Create event in database
    console.log('👤 Creating event in database...');
    const result = await query(
      `INSERT INTO events (
        organizer_id, title, description, event_date, location_address,
        location_lat, location_lng, max_attendees, registration_fee, image_urls, schedule
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, title, description, event_date, location_address,
                 location_lat, location_lng, max_attendees, registration_fee, image_urls, schedule,
                 is_active, created_at, updated_at`,
      [
        session.user.id,
        title,
        description,
        event_date,
        location_address,
        location_lat,
        location_lng,
        max_attendees,
        registration_fee,
        image_urls,
        schedule
      ]
    );

    const newEvent = result.rows[0];
    console.log('✅ Event created successfully:', {
      id: newEvent.id,
      title: newEvent.title
    });

    // Get organizer info
    const organizerResult = await query(
      'SELECT id, username, first_name, last_name, profile_image_url FROM users WHERE id = $1',
      [session.user.id]
    );
    const organizer = organizerResult.rows[0];

    return NextResponse.json({
      message: 'Event created successfully',
      event: {
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        event_date: newEvent.event_date,
        location_address: newEvent.location_address,
        location_lat: newEvent.location_lat ? parseFloat(newEvent.location_lat) : null,
        location_lng: newEvent.location_lng ? parseFloat(newEvent.location_lng) : null,
        max_attendees: newEvent.max_attendees,
        registration_fee: newEvent.registration_fee ? parseFloat(newEvent.registration_fee) : 0,
        is_active: newEvent.is_active,
        created_at: newEvent.created_at,
        updated_at: newEvent.updated_at,
        organizer: {
          id: organizer.id,
          username: organizer.username,
          first_name: organizer.first_name,
          last_name: organizer.last_name,
          profile_image_url: organizer.profile_image_url,
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Create event API error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Handle database connection errors
    if (error.message?.includes('Database pool not initialized') || 
        error.message?.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { 
        error: 'Failed to create event. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

