import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get platform statistics
    const userCount = await query('SELECT COUNT(*) FROM users WHERE is_active = true');
    const artworkCount = await query('SELECT COUNT(*) FROM artworks WHERE is_available = true');
    const commissionCount = await query('SELECT COUNT(*) FROM commissions WHERE status = $1', ['completed']);

    return NextResponse.json({
      user_count: parseInt(userCount.rows[0].count) || 0,
      artwork_count: parseInt(artworkCount.rows[0].count) || 0,
      commission_count: parseInt(commissionCount.rows[0].count) || 0,
    });

  } catch (error) {
    console.error('Get home stats error:', error);
    // Return default stats on error
    return NextResponse.json({
      user_count: 0,
      artwork_count: 0,
      commission_count: 0,
    });
  }
}