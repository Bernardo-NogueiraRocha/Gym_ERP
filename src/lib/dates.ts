export type Frequency = 'mensal' | 'quarterly' | 'semiannual' | 'annual';

export const FREQUENCY_MONTHS: Record<Frequency, number> = {
  mensal: 1,
  quarterly: 3,
  semiannual: 6,
  annual: 12,
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

/**
 * Today's date on the server's local calendar, as `YYYY-MM-DD`.
 * The gym operates in local time, so "today" must not roll over at UTC
 * midnight for evening checkouts.
 */
export function todayIsoDate(today = new Date()): string {
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
}

/**
 * Adds whole months to an ISO calendar date (`YYYY-MM-DD`), clamping to the
 * last valid day of the target month: 2026-01-31 + 1 month = 2026-02-28.
 * Pure calendar arithmetic: no timezone or DST drift.
 */
export function addMonthsToDate(startDate: string, months: number): string {
  const [year, month, day] = startDate.split('-').map(Number);

  // Start at day 1 so setUTCMonth can never overflow into the next month.
  const result = new Date(Date.UTC(year, month - 1, 1, 12));
  result.setUTCMonth(result.getUTCMonth() + months);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0, 12),
  ).getUTCDate();

  result.setUTCDate(Math.min(day, lastDayOfTargetMonth));

  return `${result.getUTCFullYear()}-${pad(result.getUTCMonth() + 1)}-${pad(result.getUTCDate())}`;
}

export function addFrequencyToDate(startDate: string, frequency: Frequency): string {
  return addMonthsToDate(startDate, FREQUENCY_MONTHS[frequency]);
}
