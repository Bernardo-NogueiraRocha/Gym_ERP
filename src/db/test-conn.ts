import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getDb } from './index';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const db = getDb();
    const result = await db.execute(
      sql`SELECT NOW() as current_time, current_database() as db_name;`
    );

    console.log('✅ Database connection successful!');
    console.log('Query output:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();