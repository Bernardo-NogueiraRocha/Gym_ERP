const AUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Google sign-in was cancelled.',
  account_not_linked:
    'An account with this email already exists. Sign in with your password, then link Google from your account page.',
  account_already_linked_to_different_user:
    'This Google account is already linked to another Gym ERP account.',
  email_does_not_match:
    'Use the same email address as your Gym ERP account when linking Google.',
  email_not_found:
    'Google did not share an email address. Use email and password instead.',
  email_not_verified:
    'Google could not confirm your email address. Use email and password instead.',
  oauth_provider_not_found:
    'Google sign-in is not configured. Use email and password instead.',
  provider_not_found:
    'Google sign-in is not configured. Use email and password instead.',
  signup_disabled:
    'New accounts cannot be created with Google right now. Use email and password instead.',
  unable_to_create_user:
    'Google could not create your account. Please try again.',
  unable_to_link_account:
    'Google could not be linked to your account. Please try again.',
  unable_to_get_user_info:
    'Google did not return the information needed to sign in. Please try again.',
  no_code:
    'Google sign-in could not be completed. Please try again.',
  invalid_code:
    'Google sign-in could not be completed. Please try again.',
  invalid_callback_request:
    'Google sign-in could not be completed. Please try again.',
  state_mismatch:
    'Google sign-in could not be completed. Please start again.',
  internal_server_error:
    'Something went wrong during Google sign-in. Please try again.',
};

const DEFAULT_AUTH_ERROR =
  'We could not complete Google sign-in. Please try again or use email and password.';

/**
 * Maps Better Auth / OAuth callback error codes to messages that are safe to
 * render. Raw provider descriptions are intentionally ignored.
 */
export function getAuthErrorMessage(
  code: string | null | undefined,
  fallback: string = DEFAULT_AUTH_ERROR,
): string | null {
  if (!code) return null;

  const normalized = code.trim().toLowerCase().replace(/[\s-]+/g, '_');

  return AUTH_ERROR_MESSAGES[normalized] ?? fallback;
}
