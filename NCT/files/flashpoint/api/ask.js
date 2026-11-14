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
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 500,
        messages: [
          { role: "system", content: "You answer only questions about combustion science and fire safety for crewed space habitats, using the records the user supplies. Decline anything else in one sentence." },
          ...clean
        ]
      })
    });
    if (r.status === 429) return res.status(429).json({ text: "Busy" });
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || "No answer.";
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ text: "Server error" });
  }
}
