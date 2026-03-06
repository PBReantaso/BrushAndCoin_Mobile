import { query } from '../config';

async function runMigrations() {
  try {
    // Add token_version column
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS token_version INTEGER DEFAULT 0;
    `);
    
    console.log('Migration completed successfully');
    
    // Verify table structure
    const result = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    
    console.log('Current table structure:', result.rows);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigrations();