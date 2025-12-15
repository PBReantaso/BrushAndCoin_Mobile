import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET list commissions
export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ commissions: [], warning: 'Database not configured' })
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all' // 'all', 'received', 'sent'
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const offset = parseInt(searchParams.get('offset') || '0')

    const userId = session.user.id

    // Build query based on type
    let whereClause = ''
    const params: any[] = [userId]

    if (type === 'received') {
      whereClause = 'WHERE c.artist_id = $1'
    } else if (type === 'sent') {
      whereClause = 'WHERE c.client_id = $1'
    } else {
      whereClause = 'WHERE (c.artist_id = $1 OR c.client_id = $1)'
    }

    // Add status filter if provided
    if (status) {
      whereClause += ` AND c.status = $${params.length + 1}`
      params.push(status)
    }

    const result = await query(
      `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category,
        c.budget,
        c.deadline,
        c.requirements,
        c.is_urgent,
        c.status,
        c.client_id,
        c.artist_id,
        c.created_at,
        c.updated_at,
        jsonb_build_object(
          'id', client.id,
          'username', client.username,
          'first_name', client.first_name,
          'last_name', client.last_name,
          'profile_image_url', client.profile_image_url
        ) as client,
        jsonb_build_object(
          'id', artist.id,
          'username', artist.username,
          'first_name', artist.first_name,
          'last_name', artist.last_name,
          'profile_image_url', artist.profile_image_url
        ) as artist
      FROM commissions c
      JOIN users client ON c.client_id = client.id
      JOIN users artist ON c.artist_id = artist.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      [...params, limit, offset]
    )

    const commissions = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      budget: parseFloat(row.budget),
      deadline: row.deadline,
      requirements: row.requirements,
      isUrgent: row.is_urgent,
      status: row.status,
      clientId: row.client_id,
      clientName: `${row.client.first_name || ''} ${row.client.last_name || ''}`.trim() || row.client.username,
      clientAvatar: row.client.profile_image_url,
      artistId: row.artist_id,
      artistName: `${row.artist.first_name || ''} ${row.artist.last_name || ''}`.trim() || row.artist.username,
      artistAvatar: row.artist.profile_image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))

    return NextResponse.json({ commissions })
  } catch (error) {
    console.error('GET commissions error:', error)
    return NextResponse.json({ error: 'Internal server error', commissions: [] }, { status: 500 })
  }
}

// POST create commission request
export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      isUrgent,
      artistId,
      referenceImages,
    } = body

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }
    if (!category?.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    if (!budget || isNaN(budget) || budget <= 0) {
      return NextResponse.json({ error: 'Valid budget is required' }, { status: 400 })
    }
    if (!artistId?.trim()) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 })
    }

    const clientId = session.user.id

    const result = await query(
      `INSERT INTO commissions (
        client_id,
        artist_id,
        title,
        description,
        category,
        budget,
        deadline,
        requirements,
        is_urgent,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, client_id, artist_id, title, description, category, budget, deadline, requirements, is_urgent, status, created_at, updated_at`,
      [
        clientId,
        artistId,
        title.trim(),
        description.trim(),
        category.trim(),
        budget,
        deadline || null,
        requirements?.trim() || null,
        isUrgent || false,
        'pending',
      ]
    )

    const commission = result.rows[0]

    return NextResponse.json({
      commission: {
        id: commission.id,
        title: commission.title,
        description: commission.description,
        category: commission.category,
        budget: parseFloat(commission.budget),
        deadline: commission.deadline,
        requirements: commission.requirements,
        isUrgent: commission.is_urgent,
        status: commission.status,
        clientId: commission.client_id,
        artistId: commission.artist_id,
        createdAt: commission.created_at,
        updatedAt: commission.updated_at,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST commission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
