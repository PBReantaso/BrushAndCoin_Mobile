import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test query
    const result = await query('SELECT NOW() as current_time');
    
    console.log('✅ Database connection successful');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}