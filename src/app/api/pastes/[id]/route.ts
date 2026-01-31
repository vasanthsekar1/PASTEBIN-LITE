import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

function getNow(req: NextRequest): number {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.headers.get("x-test-now-ms");
    if (testNow) return parseInt(testNow, 10);
  }
  return Date.now();
}

export async function GET(req: NextRequest, context: { params: any }) {
  let id: string;
  if (typeof context.params?.then === "function") {
    id = (await context.params).id;
  } else {
    id = context.params.id;
  }
  const key = `paste:${id}`;
  const paste = await redis.hgetall(key);
  if (!paste || !paste.content) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }
  const now = getNow(req);
  const expiresAt = paste.expires_at ? Number(paste.expires_at) : null;
  const maxViews = paste.max_views ? Number(paste.max_views) : null;
  const views = paste.views ? Number(paste.views) : 0;
  if ((expiresAt && now > expiresAt) || (maxViews && views >= maxViews)) {
    await redis.del(key);
    return NextResponse.json({ error: "Paste unavailable" }, { status: 404 });
  }
  // Increment view count
  await redis.hincrby(key, "views", 1);
  return NextResponse.json({
    content: paste.content,
    remaining_views: maxViews ? Math.max(0, maxViews - views - 1) : null,
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
  });
}
