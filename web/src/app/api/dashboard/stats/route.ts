import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get active commissions count
    const activeCommissions = await query(
      `SELECT COUNT(*) FROM commissions 
       WHERE (client_id = $1 OR artist_id = $1) 
       AND status IN ('accepted', 'in_progress')`,
      [userId]
    );

    // Get total earnings (for artists)
    const totalEarnings = await query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM payments p
       JOIN commissions c ON p.commission_id = c.id
       WHERE c.artist_id = $1 AND p.status = 'completed'`,
      [userId]
    );

    // Get artwork portfolio count
    const artworkCount = await query(
      'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
      [userId]
    );

    return NextResponse.json({
      activeCommissions: parseInt(activeCommissions.rows[0].count),
      totalEarnings: parseFloat(totalEarnings.rows[0].total),
      artworkPortfolio: parseInt(artworkCount.rows[0].count)
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}