// Vercel serverless function. The API key stays on the server.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ text: "POST only" });
  const msgs = req.body && req.body.messages;
  if (!Array.isArray(msgs) || msgs.length === 0 || msgs.length > 14)
    return res.status(400).json({ text: "Bad request" });
  const clean = msgs.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 30000)
  }));
  if (clean[clean.length - 1].role !== "user") return res.status(400).json({ text: "Bad request" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-5-5",
        max_tokens: 500,
        system: "You answer only questions about combustion science and fire safety for crewed space habitats, using the records the user supplies. Decline anything else in one sentence.",
        messages: clean
      })
    });
    if (r.status === 429) return res.status(429).json({ text: "Busy" });
    const data = await r.json();
    const text = (data.content || []).map(c => c.text || "").join("") || "No answer.";
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ text: "Server error" });
  }
}
