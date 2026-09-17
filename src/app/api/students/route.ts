import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { user } from '@/db/schema';

export async function GET() {
  const result = await getDb().select({name:user.name, email: user.email}).from(user); 
  
  return NextResponse.json(result);
}