import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const envFiles = [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
];

for (const envFile of envFiles) {
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}

const hyperdriveEnvName =
  "CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE";
const connectionString =
  process.env[hyperdriveEnvName]?.trim() || process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Set it in the shell or in a production .env file before deploying.",
  );
}

const executable =
  process.platform === "win32"
    ? "opennextjs-cloudflare.cmd"
    : "opennextjs-cloudflare";

const result = spawnSync(
  executable,
  ["deploy", "--", "--keep-vars", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      [hyperdriveEnvName]: connectionString,
    },
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
