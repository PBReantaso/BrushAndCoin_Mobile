import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;
    const userId = id;

    // Check if user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get artwork count
    const artworkCountResult = await query(
      'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
      [userId]
    );
    const artworkCount = parseInt(artworkCountResult.rows[0].count);

    // Get commission stats
    const commissionStatsResult = await query(
      `SELECT 
        COUNT(*) as total_commissions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_commissions
       FROM commissions 
       WHERE artist_id = $1`,
      [userId]
    );

    // Get review stats
    const reviewStatsResult = await query(
      `SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating
       FROM reviews 
       WHERE reviewee_id = $1`,
      [userId]
    );

    const stats = {
      artwork_count: artworkCount,
      total_commissions: parseInt(commissionStatsResult.rows[0].total_commissions),
      completed_commissions: parseInt(commissionStatsResult.rows[0].completed_commissions),
      average_rating: reviewStatsResult.rows[0].average_rating 
        ? parseFloat(reviewStatsResult.rows[0].average_rating) 
        : 0,
      total_reviews: parseInt(reviewStatsResult.rows[0].total_reviews)
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}