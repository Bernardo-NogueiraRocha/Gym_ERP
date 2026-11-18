import { z } from 'zod';

/**
 * Kept in sync with `experienceLevelEnum` in `src/db/schema/workout-requests.ts`.
 * Duplicated here so client components never import the database schema.
 */
export const experienceLevels = ['beginner', 'intermediate', 'advanced'] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];

export const workoutRequestSchema = z
  .object({
    experienceLevel: z.enum(experienceLevels),
    priorities: z
      .string()
      .trim()
      .min(1, 'Describe your priorities.')
      .max(500, 'Priorities must have at most 500 characters.'),
    focusedMuscles: z
      .string()
      .trim()
      .min(1, 'Describe the muscles you want to focus on.')
      .max(500, 'Focused muscles must have at most 500 characters.'),
    hasInjuries: z.boolean(),
    injuryDetails: z
      .string()
      .trim()
      .max(2000, 'Injury details must have at most 2000 characters.')
      .nullable()
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (value.hasInjuries && !value.injuryDetails) {
      ctx.addIssue({
        code: 'custom',
        path: ['injuryDetails'],
        message: 'Describe your injuries or limitations.',
      });
    }
  });

export type WorkoutRequestInput = z.infer<typeof workoutRequestSchema>;
