'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/db';
import { students } from '@/db/schema';
import { headers } from 'next/headers';

type RegisterStudentInput = {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone?: string;
};

export async function registerStudentAction(
    formData: RegisterStudentInput
) {
    try {
        const authResult = await auth.api.signUpEmail({
            body: {
                email: formData.email,
                password: formData.password,
                name: formData.name,
            },
            headers: await headers(),
        });

        if (!authResult.user) {
            return {
                success: false,
                error: 'User creation failed.',
            };
        }

        // 1. Strip non-digit characters from CPF ("123456789-10" -> "12345678910")
        const cleanCpf = formData.cpf.replace(/\D/g, '');

        // 2. Insert into PostgreSQL
        await getDb().insert(students).values({
            userId: authResult.user.id,
            cpf: cleanCpf,
            phone: formData.phone || null,
            status: 'active',
        });

        return {
            success: true,
            user: authResult.user,
        };

    } catch (error) {
        // Log the full error stack trace for debugging
        console.error('Registration error details:', error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}