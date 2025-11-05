import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Check if user exists
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      // Return default stats if user doesn't exist
      return NextResponse.json({
        artwork_count: 0,
        total_commissions: 0,
        completed_commissions: 0,
        average_rating: 0,
        total_reviews: 0
      });
    }

    let artwork_count = 0;
    let total_commissions = 0;
    let completed_commissions = 0;
    let average_rating = 0;
    let total_reviews = 0;

    // Get artwork count (handle case where table might not exist)
    try {
      const artworkResult = await query(
        'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
        [userId]
      );
      artwork_count = parseInt(artworkResult.rows[0].count) || 0;
    } catch (error) {
      console.log('Artworks table not accessible');
    }

    // Get commission stats (handle case where table might not exist)
    try {
      const commissionResult = await query(
        `SELECT COUNT(*) as total FROM commissions WHERE artist_id = $1 OR client_id = $1`,
        [userId]
      );
      total_commissions = parseInt(commissionResult.rows[0].total) || 0;
      completed_commissions = 0; // Default for now
    } catch (error) {
      console.log('Commissions table not accessible');
    }

    // Get rating stats (handle case where table might not exist)
    try {
      const ratingResult = await query(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE reviewee_id = $1`,
        [userId]
      );
      average_rating = parseFloat(ratingResult.rows[0].avg_rating) || 0;
      total_reviews = parseInt(ratingResult.rows[0].count) || 0;
    } catch (error) {
      console.log('Reviews table not accessible');
    }

    return NextResponse.json({
      artwork_count,
      total_commissions,
      completed_commissions,
      average_rating,
      total_reviews
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    // Return default stats on error
    return NextResponse.json({
      artwork_count: 0,
      total_commissions: 0,
      completed_commissions: 0,
      average_rating: 0,
      total_reviews: 0
    });
  }
}