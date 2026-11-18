import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FREQUENCY_MONTHS,
  addFrequencyToDate,
  addMonthsToDate,
  todayIsoDate,
} from './dates';

test('addMonthsToDate keeps the day when the target month has it', () => {
  assert.equal(addMonthsToDate('2026-11-18', 1), '2026-12-18');
  assert.equal(addMonthsToDate('2026-12-15', 3), '2027-03-15');
  assert.equal(addMonthsToDate('2026-11-18', 0), '2026-11-18');
});

test('addMonthsToDate clamps to the last day of shorter months', () => {
  assert.equal(addMonthsToDate('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonthsToDate('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonthsToDate('2026-03-31', 1), '2026-04-30');
});

test('addMonthsToDate handles leap years and 12-month wraps', () => {
  assert.equal(addMonthsToDate('2024-02-29', 12), '2025-02-28');
  assert.equal(addMonthsToDate('2026-08-31', 12), '2027-08-31');
  assert.equal(addMonthsToDate('2026-01-15', 25), '2028-02-15');
});

test('addFrequencyToDate maps every billing cycle', () => {
  assert.equal(FREQUENCY_MONTHS.mensal, 1);
  assert.equal(FREQUENCY_MONTHS.quarterly, 3);
  assert.equal(FREQUENCY_MONTHS.semiannual, 6);
  assert.equal(FREQUENCY_MONTHS.annual, 12);

  assert.equal(addFrequencyToDate('2026-01-31', 'mensal'), '2026-02-28');
  assert.equal(addFrequencyToDate('2026-01-31', 'quarterly'), '2026-04-30');
  assert.equal(addFrequencyToDate('2026-01-31', 'semiannual'), '2026-07-31');
  assert.equal(addFrequencyToDate('2026-01-31', 'annual'), '2027-01-31');
});

test('todayIsoDate uses the local calendar date', () => {
  assert.equal(todayIsoDate(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(todayIsoDate(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
});
