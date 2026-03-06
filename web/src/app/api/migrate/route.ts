import { pool } from '@/lib/db/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const migrations = ['002_add_conversations_and_fix_messages.sql', '003_add_conversation_participant_columns.sql'];
      const results: string[] = [];

      for (const name of migrations) {
        try {
          const sql = readFileSync(
            join(process.cwd(), 'src', 'lib', 'db', 'migrations', name),
            'utf8'
          );
          await client.query(sql);
          results.push(`${name}: OK`);
        } catch (err: any) {
          results.push(`${name}: ${err.message}`);
        }
      }

      return NextResponse.json({
        status: 'success',
        message: 'Migrations completed',
        results,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Database migrate error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
