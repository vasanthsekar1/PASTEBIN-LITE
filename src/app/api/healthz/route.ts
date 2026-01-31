import { redis } from "@/lib/redis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Try a simple Redis command to check connectivity
    await redis.ping();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Redis unavailable" }, { status: 500 });
  }
}
