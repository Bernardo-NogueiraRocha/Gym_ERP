import test from 'node:test';
import assert from 'node:assert/strict';

import { workoutRequestSchema } from './workout-request';

const validRequest = {
  experienceLevel: 'beginner' as const,
  priorities: 'Strength and hypertrophy',
  focusedMuscles: 'Chest and back',
  hasInjuries: false,
};

test('accepts a valid request and trims free text', () => {
  const result = workoutRequestSchema.safeParse({
    ...validRequest,
    priorities: '  Strength  ',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.priorities, 'Strength');
  }
});

test('allows empty injury details when there are no injuries', () => {
  assert.equal(
    workoutRequestSchema.safeParse({ ...validRequest, injuryDetails: '' }).success,
    true,
  );
});

test('requires injury details when hasInjuries is true', () => {
  const result = workoutRequestSchema.safeParse({
    ...validRequest,
    hasInjuries: true,
    injuryDetails: '   ',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.error.flatten().fieldErrors.injuryDetails?.length);
  }
});

test('accepts injury details when hasInjuries is true', () => {
  const result = workoutRequestSchema.safeParse({
    ...validRequest,
    hasInjuries: true,
    injuryDetails: 'Left knee pain',
  });

  assert.equal(result.success, true);
});

test('rejects an unknown experience level', () => {
  assert.equal(
    workoutRequestSchema.safeParse({
      ...validRequest,
      experienceLevel: 'expert',
    }).success,
    false,
  );
});

test('rejects blank priorities and focused muscles', () => {
  const result = workoutRequestSchema.safeParse({
    ...validRequest,
    priorities: '   ',
    focusedMuscles: '',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    assert.ok(errors.priorities?.length);
    assert.ok(errors.focusedMuscles?.length);
  }
});
