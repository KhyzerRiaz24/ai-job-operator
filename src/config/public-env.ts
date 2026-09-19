import { z } from "zod";

/**
 * Variables that may be inlined into the browser bundle.
 * Phase 1: none required. Never place secrets here.
 */
export const publicEnvSchema = z.object({});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function loadPublicEnv(
  source: Record<string, string | undefined> = process.env,
): PublicEnv {
  const publicValues = Object.fromEntries(
    Object.entries(source).filter(([key]) => key.startsWith("NEXT_PUBLIC_")),
  );

  const parsed = publicEnvSchema.safeParse(publicValues);

  if (!parsed.success) {
    throw new Error(
      `Invalid public environment configuration: ${parsed.error.message}`,
    );
  }

  return parsed.data;
}
