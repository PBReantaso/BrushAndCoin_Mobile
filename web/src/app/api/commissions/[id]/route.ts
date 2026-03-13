import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET single commission
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: commissionId } = await params
    const userId = session.user.id

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
      WHERE c.id = $1 AND (c.client_id = $2 OR c.artist_id = $2)
      `,
      [commissionId, userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 })
    }

    const row = result.rows[0]
    const commission = {
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
    }

    return NextResponse.json({ commission })
  } catch (error) {
    console.error('GET commission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH update commission status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: commissionId } = await params
    const userId = session.user.id
    const body = await request.json()
    const { status, action, paymentMethod, message } = body

    // Verify user is the artist (for accept/decline) or client (for other operations)
    const commissionRes = await query(
      'SELECT artist_id, client_id, status FROM commissions WHERE id = $1',
      [commissionId]
    )

    if (commissionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 })
    }

    const commission = commissionRes.rows[0]

    // Handle different actions
    if (action === 'accept') {
      // Only artist can accept
      if (commission.artist_id !== userId) {
        return NextResponse.json({ error: 'Only the artist can accept' }, { status: 403 })
      }
      if (commission.status !== 'pending') {
        return NextResponse.json({ error: 'Commission is not pending' }, { status: 400 })
      }

      // Create escrow payment record
      await query(
        `INSERT INTO escrow_payments (commission_id, amount, status, held_at, created_at)
         VALUES ($1, $2, $3, now(), now())`,
        [commissionId, commission.budget, 'held']
      )

      // Update commission status
      const result = await query(
        `UPDATE commissions SET status = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, status, updated_at`,
        ['accepted', commissionId]
      )

      return NextResponse.json({
        commission: { id: result.rows[0].id, status: result.rows[0].status, updatedAt: result.rows[0].updated_at }
      })
    } else if (action === 'decline') {
      // Only artist can decline
      if (commission.artist_id !== userId) {
        return NextResponse.json({ error: 'Only the artist can decline' }, { status: 403 })
      }
      if (commission.status !== 'pending') {
        return NextResponse.json({ error: 'Commission is not pending' }, { status: 400 })
      }

      const result = await query(
        `UPDATE commissions SET status = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, status, updated_at`,
        ['declined', commissionId]
      )

      return NextResponse.json({
        commission: { id: result.rows[0].id, status: result.rows[0].status, updatedAt: result.rows[0].updated_at }
      })
    } else if (action === 'complete') {
      // Any party can mark as complete
      if (commission.artist_id !== userId && commission.client_id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      // Release escrow
      await query(
        `UPDATE escrow_payments SET status = $1, released_at = now()
         WHERE commission_id = $2`,
        ['released', commissionId]
      )

      const result = await query(
        `UPDATE commissions SET status = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, status, updated_at`,
        ['completed', commissionId]
      )

      return NextResponse.json({
        commission: { id: result.rows[0].id, status: result.rows[0].status, updatedAt: result.rows[0].updated_at }
      })
    } else if (action === 'cancel') {
      // Only client can cancel pending commissions
      if (commission.client_id !== userId) {
        return NextResponse.json({ error: 'Only the client can cancel' }, { status: 403 })
      }
      if (commission.status !== 'pending') {
        return NextResponse.json({ error: 'Only pending commissions can be cancelled' }, { status: 400 })
      }

      const result = await query(
        `UPDATE commissions SET status = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, status, updated_at`,
        ['cancelled', commissionId]
      )

      return NextResponse.json({
        commission: { id: result.rows[0].id, status: result.rows[0].status, updatedAt: result.rows[0].updated_at }
      })
    } else if (status) {
      // Direct status update
      const validStatuses = ['pending', 'accepted', 'in_progress', 'awaiting_approval', 'completed', 'cancelled', 'declined']
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }

      const result = await query(
        `UPDATE commissions SET status = $1, updated_at = now()
         WHERE id = $2
         RETURNING id, status, updated_at`,
        [status, commissionId]
      )

      return NextResponse.json({
        commission: { id: result.rows[0].id, status: result.rows[0].status, updatedAt: result.rows[0].updated_at }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('PATCH commission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE commission (only if pending)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: commissionId } = await params
    const userId = session.user.id

    const commissionRes = await query(
      'SELECT client_id, status FROM commissions WHERE id = $1',
      [commissionId]
    )

    if (commissionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 })
    }

    const commission = commissionRes.rows[0]

    // Only client can delete pending commissions
    if (commission.client_id !== userId) {
      return NextResponse.json({ error: 'Only the client can delete' }, { status: 403 })
    }
    if (commission.status !== 'pending') {
      return NextResponse.json({ error: 'Only pending commissions can be deleted' }, { status: 400 })
    }

    await query('DELETE FROM commissions WHERE id = $1', [commissionId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE commission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
