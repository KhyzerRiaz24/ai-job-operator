import { NextResponse } from "next/server";
import { createHealthPayload } from "@/src/health/check";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(createHealthPayload());
}
