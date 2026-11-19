/**
 * Determines which Neo brand domain to link back to based on the host
 * the app is currently served from.
 *
 * Rule:
 * - If the app runs on neo21.dev (or any of its subdomains) -> "neo21.dev"
 * - For neo21.io subdomains AND every other domain -> "neo21.io" (default)
 */
export const getBrandDomain = (): string => {
  if (typeof window === 'undefined') return 'neo21.io';

  const host = window.location.hostname.toLowerCase();
  if (host === 'neo21.dev' || host.endsWith('.neo21.dev')) {
    return 'neo21.dev';
  }
  return 'neo21.io';
};

/** Full https URL to the active Neo brand domain. */
export const getBrandUrl = (): string => `https://${getBrandDomain()}`;

/** Lightning Address used for donations, matching the active brand domain. */
export const getDonationAddress = (): string => `convy@tip.${getBrandDomain()}`;

/** LNURL-pay metadata endpoint for the active donation address. */
export const getDonationLnurlEndpoint = (): string =>
  `https://tip.${getBrandDomain()}/.well-known/lnurlp/convy`;
