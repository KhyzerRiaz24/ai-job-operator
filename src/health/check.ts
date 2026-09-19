export type HealthPayload = {
  status: "ok";
  timestamp: string;
};

export function createHealthPayload(now: Date = new Date()): HealthPayload {
  return {
    status: "ok",
    timestamp: now.toISOString(),
  };
}
