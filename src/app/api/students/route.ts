import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { user, students} from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  // const result = await getDb().select({name:user.name, email: user.email})
  //   .from(user)
  //   .where(sql`${user.role} = 'student'`); 

  const result2 = await getDb().select({name:user.name, email: user.email})
    .from(students).innerJoin(user,eq(user.id,students.userId)); 

  return NextResponse.json(result2);
}