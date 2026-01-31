import { redis } from "@/lib/redis";
import { notFound } from "next/navigation";
import React from "react";

function escapeHtml(text: string) {
  return text.replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
}

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const key = `paste:${id}`;
  const paste = await redis.hgetall(key);
  if (!paste || !paste.content) return notFound();
  const now = Date.now();
  const expiresAt = paste.expires_at ? Number(paste.expires_at) : null;
  const maxViews = paste.max_views ? Number(paste.max_views) : null;
  const views = paste.views ? Number(paste.views) : 0;
  if ((expiresAt && now > expiresAt) || (maxViews && views >= maxViews)) {
    await redis.del(key);
    return notFound();
  }
  await redis.hincrby(key, "views", 1);
  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h1>Paste</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#f8f8f8", padding: 16, borderRadius: 4 }}>
        {escapeHtml(paste.content)}
      </pre>
      {maxViews && <div>Views left: {Math.max(0, maxViews - views - 1)}</div>}
      {expiresAt && <div>Expires at: {new Date(expiresAt).toLocaleString()}</div>}
    </main>
  );
}
