'server-only';
'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/db';
import { students } from '@/db/schema';
import { headers } from 'next/headers';

export async function registerStudentAction(formData: {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone?: string;
}) {
  try {
    // 1. Create Better Auth User
    const authResult = await auth.api.signUpEmail({
      body: {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      },
      headers: await headers(),
    });

    if (!authResult || !authResult.user) {
      return { success: false, error: 'Failed to create user account.' };
    }

    // 2. Insert into domain table linked via userId
    await getDb().insert(students).values({
      userId: authResult.user.id,
      cpf: formData.cpf,
      phone: formData.phone || null,
      status: 'active',
    });

    return { success: true, user: authResult.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}