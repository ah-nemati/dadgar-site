import { Auth0Client } from "@auth0/nextjs-auth0/server";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeAuth0Domain(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

const domain = normalizeAuth0Domain(requiredEnv("AUTH0_DOMAIN"));

const clientId = requiredEnv("AUTH0_CLIENT_ID");

const clientSecret = requiredEnv("AUTH0_CLIENT_SECRET");

const secret = requiredEnv("AUTH0_SECRET");

const appBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://majidsavarivakil.ir"
    : process.env.APP_BASE_URL?.trim() || "http://localhost:3000";

export const auth0 = new Auth0Client({
  domain,
  clientId,
  clientSecret,
  secret,
  appBaseUrl,

  signInReturnToPath: "/account",

  authorizationParameters: {
    ui_locales: "fa",
  },

  httpTimeout: 10_000,

  session: {
    rolling: false,
    absoluteDuration: 3 * 24 * 60 * 60,
  },

  enableAccessTokenEndpoint: false,
});
