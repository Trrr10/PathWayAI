/**
 * server.js — PathwayAI Backend
 * Uses Node http module directly to avoid fetch Headers Timeout bug
 */

import express from "express";
import cors    from "cors";
import http    from "http";

const app        = express();
const PORT       = 3001;
const OLLAMA_HOST = "127.0.0.1";
const OLLAMA_PORT = 11434;

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ─────────────────────────────────────────────
   Core helper: call Ollama using raw http.request
   — no fetch, no headers timeout, no hangs
───────────────────────────────────────────── */
function ollamaRequest(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);

    const options = {
      hostname: OLLAMA_HOST,
      port:     OLLAMA_PORT,
      path,
      method:   "POST",
      headers: {
        "Content-Type":   "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      // No timeout set here — we handle it via setTimeout below
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: { raw: data } });
        }
      });
    });

    req.on("error", reject);

    // 3 minute hard timeout
    const timer = setTimeout(() => {
      req.destroy(new Error("OLLAMA_TIMEOUT"));
    }, 180_000);

    res => clearTimeout(timer); // clear if response arrives
    req.on("response", () => clearTimeout(timer));

    req.write(payload);
    req.end();
  });
}

/* ─────────────────────────────────────────────
   GET helper (for /api/tags)
───────────────────────────────────────────── */
function ollamaGet(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: OLLAMA_HOST, port: OLLAMA_PORT, path, method: "GET" }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({}); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

/* ─────────────────────────────────────────────
   Model detection
───────────────────────────────────────────── */
const MODEL_PRIORITY = [
  "llama3.2:3b", "llama3.2", "llama3.2:latest",
  "llama3.1:8b-instruct-q4_0", "llama3.1:8b",
  "llama3.1", "llama3.1:latest",
  "llama3:latest", "llama3",
  "phi3", "mistral",
];

let cachedModel = null;

async function getBestModel() {
  if (cachedModel) return cachedModel;
  try {
    const data     = await ollamaGet("/api/tags");
    const installed = (data.models || []).map(m => m.name);
    console.log("📦 Installed models:", installed);

    for (const p of MODEL_PRIORITY) {
      if (installed.includes(p)) {
        cachedModel = p;
        console.log(`✅ Using model: ${p}`);
        return p;
      }
    }

    if (installed.length > 0) {
      cachedModel = installed[0];
      console.log(`⚠️  Fallback model: ${installed[0]}`);
      return installed[0];
    }
  } catch (err) {
    console.error("Model detection error:", err.message);
  }
  return "llama3.1";
}

/* ─────────────────────────────────────────────
   ROUTES
───────────────────────────────────────────── */
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.get("/api/status", async (_, res) => {
  try {
    const data   = await ollamaGet("/api/tags");
    const models = (data.models || []).map(m => m.name);
    const active = await getBestModel();
    res.json({ ollama: true, models, activeModel: active });
  } catch {
    res.status(503).json({ ollama: false, error: "Ollama not running on port 11434" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { subject = "General", messages = [] } = req.body;

  if (!messages.length) {
    return res.status(400).json({ error: "No messages provided" });
  }

  const model = await getBestModel();

  const systemPrompt = `You are a concise AI tutor for ${subject}.
Rules:
- Keep answers SHORT and clear (under 200 words unless asked for more)
- Use simple language, give one good example
- Ask one follow-up question at the end to check understanding
Subject: ${subject}`;

  const body = {
    model,
    stream: false,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    options: {
      temperature: 0.7,
      top_p:       0.9,
      num_predict: 400,
      num_thread:  8,
    },
  };

  const last = messages[messages.length - 1]?.content?.slice(0, 60);
  console.log(`\n→ [${model}] ${subject}: "${last}..."`);

  try {
    const result = await ollamaRequest("/api/chat", body);

    if (result.status !== 200) {
      console.error("Ollama non-200:", result.status, result.body);
      return res.status(502).json({ error: `Ollama error ${result.status}: ${JSON.stringify(result.body)}` });
    }

    const reply = result.body.message?.content
      || result.body.response
      || "Could not generate a response.";

    const tps = result.body.eval_count && result.body.eval_duration
      ? (result.body.eval_count / (result.body.eval_duration / 1e9)).toFixed(1)
      : null;

    console.log(`← ${result.body.eval_count || "?"} tokens${tps ? ` @ ${tps} tok/s` : ""}`);
    res.json({ reply, model: result.body.model || model, tokensPerSec: tps });

  } catch (err) {
    if (err.message === "OLLAMA_TIMEOUT") {
      console.error("← Timed out after 3 minutes");
      return res.status(504).json({ error: "Timed out. Try a shorter question or use llama3.2:3b for speed." });
    }
    if (err.code === "ECONNREFUSED") {
      console.error("← Ollama not running");
      return res.status(503).json({ error: "Ollama is not running. Start it with: ollama serve" });
    }
    console.error("← Chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────────
   START
───────────────────────────────────────────── */
app.listen(PORT, async () => {
  console.log(`\n🎓 PathwayAI Backend → http://localhost:${PORT}\n`);

  // Check Ollama on startup
  try {
    const model = await getBestModel();
    console.log(`\n✅ Ready! Using: ${model}`);
    console.log(`\n💡 For faster responses: ollama pull llama3.2:3b\n`);
  } catch {
    console.log(`\n⚠️  Could not connect to Ollama.`);
    console.log(`   Make sure it's running: ollama serve\n`);
  }
});