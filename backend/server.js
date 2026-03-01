import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;
const OLLAMA_URL = "http://localhost:11434";

app.use(cors({ origin: "*" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", model: "llama3.1", timestamp: new Date().toISOString() });
});

// Check if Ollama is running
app.get("/api/status", async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    const models = data.models?.map((m) => m.name) || [];
    const hasLlama = models.some((m) => m.includes("llama3.1") || m.includes("llama3"));
    res.json({ ollama: true, models, hasLlama });
  } catch {
    res.status(503).json({ ollama: false, error: "Ollama is not running on port 11434" });
  }
});

// Main chat endpoint
app.post("/api/chat", async (req, res) => {
  const { subject = "General", messages = [] } = req.body;

  if (!messages.length) {
    return res.status(400).json({ error: "No messages provided" });
  }

  const systemPrompt = `You are an expert AI tutor specializing in ${subject}. Your teaching style is:
- Clear and engaging: break down complex concepts into digestible pieces
- Socratic when helpful: ask guiding questions to deepen understanding
- Practical: use real-world examples, analogies, and concrete illustrations
- Encouraging: celebrate curiosity and make learning feel rewarding
- Adaptive: match the student's apparent level and adjust your explanations accordingly
- Concise but thorough: don't be unnecessarily verbose, but never sacrifice clarity

Use markdown formatting where helpful (bold for key terms, code blocks for code, etc.).
Always aim to spark genuine understanding, not just surface-level answers.
Current subject focus: ${subject}`;

  const payload = {
    model: "llama3.1",
    stream: false,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    options: {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 1024,
    },
  };

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Ollama error: ${errText}` });
    }

    const data = await response.json();
    const reply = data.message?.content || "I couldn't generate a response. Please try again.";

    res.json({
      reply,
      model: data.model,
      totalTokens: data.eval_count || null,
      promptTokens: data.prompt_eval_count || null,
    });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.cause?.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Cannot connect to Ollama. Make sure Ollama is running: `ollama serve`",
      });
    }
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Streaming endpoint (optional, for future use)
app.post("/api/chat/stream", async (req, res) => {
  const { subject = "General", messages = [] } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const systemPrompt = `You are an expert AI tutor for ${subject}. Be clear, engaging, and use examples.`;

  const payload = {
    model: "llama3.1",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    options: { temperature: 0.7, num_predict: 1024 },
  };

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const token = json.message?.content || "";
          if (token) res.write(`data: ${JSON.stringify({ token })}\n\n`);
          if (json.done) res.write(`data: [DONE]\n\n`);
        } catch {}
      }
    }
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`\n🎓 AI Tutor Backend running on http://localhost:${PORT}`);
  console.log(`📡 Connecting to Ollama at ${OLLAMA_URL}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health        → Server health check`);
  console.log(`  GET  /api/status    → Check Ollama + models`);
  console.log(`  POST /api/chat      → Chat with Llama 3.1`);
  console.log(`  POST /api/chat/stream → Streaming chat`);
  console.log(`\nMake sure Ollama is running: ollama serve`);
  console.log(`Make sure model is pulled:   ollama pull llama3.1\n`);
});