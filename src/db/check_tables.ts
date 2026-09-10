import { db } from './index';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('Existing database tables:');
    console.table(result);
    process.exit(0);
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    process.exit(1);
  }
}

checkTables();