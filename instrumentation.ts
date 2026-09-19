import { loadServerEnv } from "@/src/config/server-env";

export async function register(): Promise<void> {
  loadServerEnv();
}
