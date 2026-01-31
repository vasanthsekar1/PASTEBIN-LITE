import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

interface CreatePasteBody {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

function validate(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body.content !== "string" || !body.content.trim()) {
    return { valid: false, error: "'content' is required and must be a non-empty string" };
  }
  if (body.ttl_seconds !== undefined && (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1)) {
    return { valid: false, error: "'ttl_seconds' must be an integer >= 1 if provided" };
  }
  if (body.max_views !== undefined && (!Number.isInteger(body.max_views) || body.max_views < 1)) {
    return { valid: false, error: "'max_views' must be an integer >= 1 if provided" };
  }
  return { valid: true };
}

export async function POST(req: NextRequest) {
  const body: CreatePasteBody = await req.json();
  const { valid, error } = validate(body);
  if (!valid) {
    return NextResponse.json({ error }, { status: 400 });
  }
  const id = nanoid(8);
  const now = Date.now();
  let expiresAt: number | null = null;
  if (body.ttl_seconds) {
    expiresAt = now + body.ttl_seconds * 1000;
  }
  const paste = {
    content: body.content,
    expires_at: expiresAt,
    max_views: body.max_views ?? null,
    views: 0,
    created_at: now,
  };
  await redis.hmset(`paste:${id}`, paste);
  if (expiresAt) {
    await redis.expireat(`paste:${id}`, Math.floor(expiresAt / 1000));
  }
  const url = `${req.nextUrl.origin}/p/${id}`;
  return NextResponse.json({ id, url });
}
