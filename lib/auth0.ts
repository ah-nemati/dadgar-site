import { Auth0Client } from '@auth0/nextjs-auth0/server';

const configuredBaseUrl = process.env.APP_BASE_URL?.trim();
const appBaseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : configuredBaseUrl;

export const auth0 = new Auth0Client({
  ...(appBaseUrl ? { appBaseUrl } : {}),
  signInReturnToPath: '/account',
  authorizationParameters: {
    ui_locales: 'fa',
  },
  httpTimeout: 8_000,
  session: {
    rolling: false,
    absoluteDuration: 3 * 24 * 60 * 60,
  },
  enableAccessTokenEndpoint: false,
});
