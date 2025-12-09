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

    // Initialize default stats
    let artworkCount = 0;
    let totalCommissions = 0;
    let completedCommissions = 0;
    let totalReviews = 0;
    let averageRating = 0;

    // Get artwork count (check if table exists first)
    try {
      const tableExists = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'artworks'
        );
      `);

      if (tableExists.rows[0].exists) {
        const artworkCountResult = await query(
          'SELECT COUNT(*) FROM artworks WHERE user_id = $1',
          [userId]
        );
        artworkCount = parseInt(artworkCountResult.rows[0].count) || 0;
      }
    } catch (error) {
      console.log('Artworks table not accessible, using default count');
    }

    // Get commission stats (check if table exists first)
    try {
      const tableExists = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'commissions'
        );
      `);

      if (tableExists.rows[0].exists) {
        const commissionStatsResult = await query(
          `SELECT 
            COUNT(*) as total_commissions,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_commissions
           FROM commissions 
           WHERE artist_id = $1`,
          [userId]
        );
        totalCommissions = parseInt(commissionStatsResult.rows[0].total_commissions) || 0;
        completedCommissions = parseInt(commissionStatsResult.rows[0].completed_commissions) || 0;
      }
    } catch (error) {
      console.log('Commissions table not accessible, using default stats');
    }

    // Get review stats (check if table exists first)
    try {
      const tableExists = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'reviews'
        );
      `);

      if (tableExists.rows[0].exists) {
        const reviewStatsResult = await query(
          `SELECT 
            COUNT(*) as total_reviews,
            AVG(rating) as average_rating
           FROM reviews 
           WHERE reviewee_id = $1`,
          [userId]
        );
        totalReviews = parseInt(reviewStatsResult.rows[0].total_reviews) || 0;
        averageRating = reviewStatsResult.rows[0].average_rating 
          ? parseFloat(reviewStatsResult.rows[0].average_rating) 
          : 0;
      }
    } catch (error) {
      console.log('Reviews table not accessible, using default stats');
    }

    const stats = {
      artwork_count: artworkCount,
      total_commissions: totalCommissions,
      completed_commissions: completedCommissions,
      average_rating: averageRating,
      total_reviews: totalReviews
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