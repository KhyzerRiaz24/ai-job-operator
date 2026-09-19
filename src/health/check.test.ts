import { describe, expect, it } from "vitest";
import { createHealthPayload } from "@/src/health/check";

describe("createHealthPayload", () => {
  it("returns ok status and an ISO timestamp without vendor details", () => {
    const now = new Date("2026-09-19T15:00:00.000Z");
    const payload = createHealthPayload(now);

    expect(payload).toEqual({
      status: "ok",
      timestamp: "2026-09-19T15:00:00.000Z",
    });
    expect(Object.keys(payload).sort()).toEqual(["status", "timestamp"]);
  });
});
