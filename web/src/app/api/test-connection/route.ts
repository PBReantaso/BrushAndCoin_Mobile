import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔗 Testing Neon connection...');
    
    // Test basic connection
    const dbInfo = await query('SELECT current_database(), current_schema()');
    console.log('✅ Connected to:', dbInfo.rows[0]);

    // Test if users table exists with password column
    const columns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'
    `);
    
    console.log('✅ Password column exists:', columns.rows.length > 0);

    return NextResponse.json({
      success: true,
      database: dbInfo.rows[0],
      passwordColumnExists: columns.rows.length > 0
    });

  } catch (error: any) {
    console.error('❌ Connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}