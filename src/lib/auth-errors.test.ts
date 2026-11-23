import test from 'node:test';
import assert from 'node:assert/strict';

import { getAuthErrorMessage } from './auth-errors';

test('maps known OAuth errors to friendly messages', () => {
  assert.match(getAuthErrorMessage('access_denied') ?? '', /cancelled/i);
  assert.match(getAuthErrorMessage('account_not_linked') ?? '', /password/i);
  assert.match(getAuthErrorMessage('oauth_provider_not_found') ?? '', /not configured/i);
  assert.match(getAuthErrorMessage('PROVIDER_NOT_FOUND') ?? '', /not configured/i);
  assert.match(getAuthErrorMessage('Provider not found') ?? '', /not configured/i);
});

test('falls back to a safe generic message for unknown errors', () => {
  const message = getAuthErrorMessage('something_unexpected');
  assert.ok(message);
  assert.doesNotMatch(message, /something_unexpected/i);
});

test('returns null when there is no error code', () => {
  assert.equal(getAuthErrorMessage(undefined), null);
  assert.equal(getAuthErrorMessage(null), null);
  assert.equal(getAuthErrorMessage(''), null);
});
