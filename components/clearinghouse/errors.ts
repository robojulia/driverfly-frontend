const MESSAGES: Record<string, string> = {
  NO_DRIVERS_SELECTED: 'Select at least one driver.',
  DRIVER_NOT_FOUND: 'One of the selected drivers no longer exists in this company.',
  TOO_MANY_DRIVERS: 'Too many drivers for one file (5,000 max).',
  INVALID_QUERY_TYPE: 'Choose a query type.',
  PROVIDER_NOT_CONFIGURED: 'Connect a Clearinghouse provider under Settings → Integrations first.',
  PROVIDER_REJECTED_CREDENTIALS: 'The provider rejected these credentials. Check the API key and package.',
  API_KEY_REQUIRED: 'Enter the API key.',
  ACCOUNT_ID_REQUIRED: 'This provider also needs the field below the API key.',
  BASE_URL_MUST_BE_HTTPS: 'The API base URL must start with https://',
  UNKNOWN_PROVIDER: 'Choose a provider.',
  NOT_A_PROVIDER_ORDER: 'Only provider orders can be refreshed.',
  PROVIDER_CHANGED: 'This query was ordered through a provider that is no longer connected.',
  COMPANY_ADMIN_REQUIRED: 'Only company administrators can do this.',
};

/** Turns the backend's error codes into something a safety manager can act on. */
export function clearinghouseErrorMessage(e: any, fallback = 'Something went wrong. Please try again.') {
  const message = e?.response?.data?.message;
  const code = Array.isArray(message) ? message[0] : message;
  return MESSAGES[code] || (typeof code === 'string' && !/^[A-Z_]+$/.test(code) ? code : fallback);
}
