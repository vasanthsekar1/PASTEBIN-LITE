
"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | { error: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const body: any = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    setResult(data);
  }

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h1>Pastebin-Lite</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          required
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste your text here..."
          rows={8}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <input
            type="number"
            min={1}
            value={ttl}
            onChange={e => setTtl(e.target.value)}
            placeholder="TTL (seconds)"
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min={1}
            value={maxViews}
            onChange={e => setMaxViews(e.target.value)}
            placeholder="Max views"
            style={{ flex: 1 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "8px 24px" }}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>
      {result && "url" in result && (
        <div style={{ marginTop: 24 }}>
          <b>Paste created!</b> <br />
          <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a>
        </div>
      )}
      {result && "error" in result && (
        <div style={{ marginTop: 24, color: "red" }}>{result.error}</div>
      )}
    </main>
  );
}
