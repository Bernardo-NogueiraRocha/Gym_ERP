'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/db';
import { students } from '@/db/schema';
import { headers } from 'next/headers';
import { registerStudentSchema } from '@/schemas/student';

export async function registerStudentAction(
    formData: FormData
) {
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        cpf: formData.get('cpf'),
        phone: formData.get('phone'),
    };

    const result = registerStudentSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }
    console.log(result)
    try {
        const authResult = await auth.api.signUpEmail({
            body: {
                email: result.data.email,
                password: result.data.password,
                name: result.data.name,
            },
            headers: await headers(),
            
        });

        console.log(authResult)

        if (!authResult.user) {
            return {
                success: false,
                error: 'User creation failed.',
            };
        }
        // Insert into PostgreSQL
        await getDb().insert(students).values({
            userId: authResult.user.id,
            cpf: result.data.cpf,
            phone: result.data.phone || null,
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