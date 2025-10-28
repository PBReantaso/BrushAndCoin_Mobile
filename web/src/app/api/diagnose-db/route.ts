import pool from '@/lib/db/config';
import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics: any = {
    steps: [],
    error: null
  };

  try {
    // Step 1: Check environment variables
    diagnostics.steps.push({
      name: 'Environment Variables',
      status: 'checking'
    });
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not configured');
    }
    
    diagnostics.steps[0].status = 'success';
    diagnostics.steps[0].details = 'Database URL is configured';

    // Step 2: Test database connection
    diagnostics.steps.push({
      name: 'Database Connection',
      status: 'checking'
    });
    
    const client = await pool.connect();
    diagnostics.steps[1].status = 'success';
    diagnostics.steps[1].details = 'Successfully connected to database';

    try {
      // Step 3: Test simple query
      diagnostics.steps.push({
        name: 'Database Query',
        status: 'checking'
      });
      
      const result = await client.query('SELECT NOW()');
      diagnostics.steps[2].status = 'success';
      diagnostics.steps[2].details = `Database responded with time: ${result.rows[0].now}`;

      // Step 4: Check users table
      diagnostics.steps.push({
        name: 'Users Table Check',
        status: 'checking'
      });
      
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      if (tableCheck.rows[0].exists) {
        diagnostics.steps[3].status = 'success';
        diagnostics.steps[3].details = 'Users table exists';
      } else {
        diagnostics.steps[3].status = 'warning';
        diagnostics.steps[3].details = 'Users table does not exist. Run /api/setup-db to create it.';
      }

    } finally {
      client.release();
    }

  } catch (error: any) {
    // Find the current step that was checking
    const currentStep = diagnostics.steps.findIndex(
      (step: any) => step.status === 'checking'
    );
    
    if (currentStep !== -1) {
      diagnostics.steps[currentStep].status = 'error';
      diagnostics.steps[currentStep].details = error.message;
    }
    
    diagnostics.error = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  return NextResponse.json(diagnostics);
}