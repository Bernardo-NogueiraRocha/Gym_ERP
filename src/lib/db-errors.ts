type PostgresErrorLike = {
  code?: unknown;
  constraint?: unknown;
};

export function getErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) return null;
  const code = (error as PostgresErrorLike).code;
  return typeof code === 'string' ? code : null;
}

/** PostgreSQL unique_violation */
export function isUniqueViolation(error: unknown): boolean {
  return getErrorCode(error) === '23505';
}

export function getViolatedConstraint(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) return null;
  const constraint = (error as PostgresErrorLike).constraint;
  return typeof constraint === 'string' ? constraint : null;
}
