import type { Frequency } from '@/lib/dates';

/**
 * Catalog data shared by the development seed (`seed.ts`) and the
 * non-destructive production initializer (`init.ts`).
 */

export type MuscleSeed = {
  name: string;
  slug: string;
  bodyGroup: string;
};

export type ExerciseSeed = {
  name: string;
  muscles: { slug: string; stimulusStrength: number }[];
};

export type PlanSeed = {
  name: string;
  billingCycle: Frequency;
  basePrice: string;
};

export type FeatureSeed = {
  name: string;
  description: string;
};

export type PlanFeatureRule = {
  planCycle: Frequency;
  featureName: string;
  included: boolean;
};

export const muscleData: MuscleSeed[] = [
  { name: 'Chest', slug: 'chest', bodyGroup: 'Upper Body' },
  { name: 'Triceps', slug: 'triceps', bodyGroup: 'Upper Body' },
  { name: 'Deltoids', slug: 'deltoids', bodyGroup: 'Upper Body' },
  { name: 'Quadriceps', slug: 'quadriceps', bodyGroup: 'Lower Body' },
  { name: 'Gluteal', slug: 'gluteal', bodyGroup: 'Lower Body' },
  { name: 'Hamstring', slug: 'hamstring', bodyGroup: 'Lower Body' },
  { name: 'Upper Back', slug: 'upper-back', bodyGroup: 'Upper Body' },
  { name: 'Lower Back', slug: 'lower-back', bodyGroup: 'Core' },
  { name: 'Biceps', slug: 'biceps', bodyGroup: 'Upper Body' },
  { name: 'Forearm', slug: 'forearm', bodyGroup: 'Upper Body' },
  { name: 'Abs', slug: 'abs', bodyGroup: 'Core' },
];

export const exerciseData: ExerciseSeed[] = [
  {
    name: 'Bench Press',
    muscles: [
      { slug: 'chest', stimulusStrength: 1.0 },
      { slug: 'triceps', stimulusStrength: 0.6 },
      { slug: 'deltoids', stimulusStrength: 0.7 },
    ],
  },
  {
    name: 'Back Squat',
    muscles: [
      { slug: 'quadriceps', stimulusStrength: 1.0 },
      { slug: 'gluteal', stimulusStrength: 0.8 },
      { slug: 'abs', stimulusStrength: 0.4 },
    ],
  },
  {
    name: 'Deadlift',
    muscles: [
      { slug: 'hamstring', stimulusStrength: 1.0 },
      { slug: 'gluteal', stimulusStrength: 0.9 },
      { slug: 'lower-back', stimulusStrength: 0.8 },
    ],
  },
  {
    name: 'Lat Pulldown',
    muscles: [
      { slug: 'upper-back', stimulusStrength: 1.0 },
      { slug: 'biceps', stimulusStrength: 0.7 },
    ],
  },
  {
    name: 'Leg Press',
    muscles: [
      { slug: 'quadriceps', stimulusStrength: 1.0 },
      { slug: 'gluteal', stimulusStrength: 0.6 },
    ],
  },
  {
    name: 'Shoulder Press',
    muscles: [
      { slug: 'deltoids', stimulusStrength: 1.0 },
      { slug: 'triceps', stimulusStrength: 0.6 },
    ],
  },
  {
    name: 'Biceps Curl',
    muscles: [
      { slug: 'biceps', stimulusStrength: 1.0 },
      { slug: 'forearm', stimulusStrength: 0.4 },
    ],
  },
  {
    name: 'Plank',
    muscles: [
      { slug: 'abs', stimulusStrength: 1.0 },
      { slug: 'lower-back', stimulusStrength: 0.5 },
    ],
  },
  {
    name: 'Pull-Up',
    muscles: [
      { slug: 'upper-back', stimulusStrength: 1.0 },
      { slug: 'biceps', stimulusStrength: 0.8 },
    ],
  },
  {
    name: 'Romanian Deadlift',
    muscles: [
      { slug: 'hamstring', stimulusStrength: 1.0 },
      { slug: 'gluteal', stimulusStrength: 0.7 },
      { slug: 'lower-back', stimulusStrength: 0.6 },
    ],
  },
];

export const planData: PlanSeed[] = [
  { name: 'Plano Mensal', billingCycle: 'mensal', basePrice: '130.00' },
  { name: 'Plano Trimestral', billingCycle: 'quarterly', basePrice: '120.00' },
  { name: 'Plano Semestral', billingCycle: 'semiannual', basePrice: '110.00' },
  { name: 'Plano Anual', billingCycle: 'annual', basePrice: '100.00' },
];

export const featureData: FeatureSeed[] = [
  {
    name: 'Acesso livre à musculação',
    description: 'Acesso à área de musculação durante o horário de funcionamento.',
  },
  {
    name: 'Aulas em grupo',
    description: 'Participação nas aulas coletivas da academia.',
  },
  {
    name: 'Avaliação física',
    description: 'Avaliação física periódica com um profissional.',
  },
  {
    name: 'Personal trainer',
    description: 'Sessões individuais com um personal trainer.',
  },
];

export const planFeatureRules: PlanFeatureRule[] = [
  ...planData.flatMap((plan) => [
    {
      planCycle: plan.billingCycle,
      featureName: 'Acesso livre à musculação',
      included: true,
    },
    {
      planCycle: plan.billingCycle,
      featureName: 'Aulas em grupo',
      included: plan.billingCycle !== 'mensal',
    },
    {
      planCycle: plan.billingCycle,
      featureName: 'Avaliação física',
      included:
        plan.billingCycle === 'semiannual' || plan.billingCycle === 'annual',
    },
  ]),
  {
    planCycle: 'annual',
    featureName: 'Personal trainer',
    included: true,
  },
];
