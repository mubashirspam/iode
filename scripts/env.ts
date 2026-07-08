import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Minimal .env loader for standalone scripts (no dotenv dependency).
 * Loads .env.local then .env; never overrides vars already in the environment.
 */
export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    let raw: string;
    try {
      raw = readFileSync(resolve(process.cwd(), file), "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

/**
 * Resolve the database URL for a script run.
 * Default: DATABASE_URL (staging). With --prod: DATABASE_URL_PRODUCTION.
 */
export function resolveDatabaseUrl(argv: string[]): {
  url: string;
  target: "staging" | "production";
} {
  loadEnv();
  const isProd = argv.includes("--prod");
  const key = isProd ? "DATABASE_URL_PRODUCTION" : "DATABASE_URL";
  const url = process.env[key];
  if (!url) {
    console.error(`Missing ${key} in environment / .env.local`);
    process.exit(1);
  }
  return { url, target: isProd ? "production" : "staging" };
}
