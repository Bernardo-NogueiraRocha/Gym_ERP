import { z } from 'zod';

import { cpfSchema, optionalPhoneSchema } from './student';

export const registrationRoles = ['student', 'professional'] as const;

export type RegistrationRole = (typeof registrationRoles)[number];

export const completeStudentRegistrationSchema = z.object({
  role: z.literal('student'),
  cpf: cpfSchema,
  phone: optionalPhoneSchema,
});

export const completeProfessionalRegistrationSchema = z.object({
  role: z.literal('professional'),
  cref: z
    .string()
    .trim()
    .min(1, 'CREF is required.')
    .max(20, 'CREF must have at most 20 characters.'),
  specialty: z
    .string()
    .trim()
    .min(1, 'Specialty is required.')
    .max(200, 'Specialty must have at most 200 characters.'),
});

export const completeRegistrationSchema = z.discriminatedUnion('role', [
  completeStudentRegistrationSchema,
  completeProfessionalRegistrationSchema,
]);

export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>;
