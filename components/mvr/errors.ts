const MESSAGES: Record<string, string> = {
  NO_DRIVERS_SELECTED: 'Select at least one driver.',
  DRIVER_NOT_FOUND: 'One of the selected drivers no longer exists in this company.',
  TOO_MANY_DRIVERS: 'Too many drivers for one order (1,000 max).',
  CONSENT_REQUIRED: "Confirm the driver's signed MVR authorization is on file.",
  INVALID_PURPOSE: 'Choose why the MVR is being pulled.',
  PROVIDER_NOT_CONFIGURED: 'Connect an MVR provider under Settings → Integrations first.',
  PROVIDER_REJECTED_CREDENTIALS: 'The provider rejected these credentials. Check them and try again.',
  API_KEY_REQUIRED: 'Enter the API key.',
  API_SECRET_REQUIRED: 'Enter the API secret.',
  ACCOUNT_ID_REQUIRED: 'This provider also needs the account field below the API key.',
  BASE_URL_MUST_BE_HTTPS: 'The API base URL must start with https://',
  UNKNOWN_PROVIDER: 'Choose a provider.',
  NOT_SUBMITTED: 'This order never reached the provider, so there is nothing to check.',
  PROVIDER_CHANGED: 'This MVR was ordered through a provider that is no longer connected.',
  ORDER_NOT_FOUND: 'That MVR order no longer exists.',
  COMPANY_ADMIN_REQUIRED: 'Only company administrators can do this.',
};

/** Turns the backend's error codes into something a safety manager can act on. */
export function mvrErrorMessage(e: any, fallback = 'Something went wrong. Please try again.') {
  const message = e?.response?.data?.message;
  const code = Array.isArray(message) ? message[0] : message;
  return MESSAGES[code] || (typeof code === 'string' && !/^[A-Z_]+$/.test(code) ? code : fallback);
}
