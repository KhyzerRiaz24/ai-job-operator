import { describe, expect, it } from "vitest";
import { loadPublicEnv } from "@/src/config/public-env";
import { loadServerEnv } from "@/src/config/server-env";

describe("environment configuration", () => {
  it("loads server env from NODE_ENV only", () => {
    const env = loadServerEnv({ NODE_ENV: "test" });
    expect(env).toEqual({ NODE_ENV: "test" });
  });

  it("rejects invalid NODE_ENV", () => {
    expect(() => loadServerEnv({ NODE_ENV: "staging" })).toThrow(
      /Invalid server environment configuration/,
    );
  });

  it("loads an empty public env and does not read secrets", () => {
    const env = loadPublicEnv({
      NODE_ENV: "test",
      SECRET_VALUE: "must-not-be-exposed",
      NEXT_PUBLIC_UNDECLARED: "not-in-schema",
    });
    expect(env).toEqual({});
    expect(env).not.toHaveProperty("SECRET_VALUE");
    expect(env).not.toHaveProperty("NEXT_PUBLIC_UNDECLARED");
  });
});
