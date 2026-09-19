import "server-only";

import { z } from "zod";

/**
 * Server-only process environment.
 * Phase 1: NODE_ENV only. Do not add vendor credentials until those integrations exist.
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function loadServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: source.NODE_ENV,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment configuration: ${parsed.error.message}`,
    );
  }

  return parsed.data;
}
