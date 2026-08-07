import { Auth0Client } from '@auth0/nextjs-auth0/server';

const appBaseUrl = process.env.APP_BASE_URL?.trim();

export const auth0 = new Auth0Client({
  ...(appBaseUrl ? { appBaseUrl } : {}),
  signInReturnToPath: '/account',
  httpTimeout: 8_000,

  // A broad middleware matcher is required for rolling sessions. This project
  // deliberately mounts Auth0 through a Route Handler for Cloudflare/Next 16
  // compatibility, so the session uses a fixed lifetime instead.
  session: {
    rolling: false,
    absoluteDuration: 3 * 24 * 60 * 60,
  },

  // The application never needs to expose an access token to browser code.
  enableAccessTokenEndpoint: false,
});
