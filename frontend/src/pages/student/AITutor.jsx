import { useState, useEffect, useRef, useCallback } from "react";

/* ── Subjects ── */
const SUBJECTS = [
  { id: "math",     label: "Mathematics", icon: "∑",    color: "#4FC3F7" },
  { id: "science",  label: "Science",     icon: "⚗",    color: "#81C784" },
  { id: "history",  label: "History",     icon: "🏛",   color: "#FFB74D" },
  { id: "language", label: "Language",    icon: "✍",    color: "#CE93D8" },
  { id: "coding",   label: "Coding",      icon: "</>",  color: "#80DEEA" },
  { id: "general",  label: "General",     icon: "✦",    color: "#90CAF9" },
];

/* ── Voice languages ── */
const VOICE_LANGS = [
  { code: "en-IN", label: "English (India)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "mr-IN", label: "Marathi" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "bn-IN", label: "Bengali" },
  { code: "kn-IN", label: "Kannada" },
  { code: "gu-IN", label: "Gujarati" },
  { code: "ur-PK", label: "Urdu" },
];

/* ── Typing indicator ── */
const TypingIndicator = ({ elapsed }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div className="typing-indicator">
      <span /><span /><span />
    </div>
    {elapsed > 15 && (
      <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>
        {elapsed > 90
          ? "⏳ Almost there… Llama is working hard on this one"
          : elapsed > 45
          ? "🔄 Still thinking… complex questions take longer"
          : "⚡ Loading model into memory… first message takes 1-2 min"}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AITutor() {
  const [dark, setDark]           = useState(false);
  const [subject, setSubject]     = useState(null);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [error, setError]         = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ── Voice input state ── */
  const [isListening, setIsListening]   = useState(false);
  const [voiceLang, setVoiceLang]       = useState("en-IN");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  /* ── Voice output state ── */
  const [speakingId, setSpeakingId]     = useState(null); // message id being spoken
  const [ttsSupported, setTtsSupported] = useState(false);

  const bottomRef    = useRef(null);
  const textareaRef  = useRef(null);
  const elapsedRef   = useRef(null);
  const recognitionRef = useRef(null);

  /* ── Check browser support ── */
  useEffect(() => {
    setMicSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    setTtsSupported(!!window.speechSynthesis);
  }, []);

  /* ── Auto scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── Welcome message on subject select ── */
  useEffect(() => {
    if (subject && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hey there! 👋 I'm your **${subject.label}** tutor powered by Llama 3.1. I'm here to help you learn, explore, and truly *understand* — not just memorize.\n\nYou can **type** your question or tap the 🎤 mic to **speak** in your language. What would you like to dive into today?`,
        id: Date.now(),
      }]);
    }
  }, [subject]);

  /* ══════════════════════
     SEND MESSAGE
  ══════════════════════ */
  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setElapsed(0);
    setError(null);
    elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180_000);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject?.label || "General",
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        let errMsg = `Server error ${res.status}`;
        try { const d = await res.json(); errMsg = d.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (!data.reply) throw new Error("Empty response from model.");

      const aiMsg = { role: "assistant", content: data.reply, id: Date.now() };
      setMessages(prev => [...prev, aiMsg]);

    } catch (e) {
      clearTimeout(timeout);
      if (e.name === "AbortError") {
        setError("Request timed out. Llama is loading — please try again.");
      } else if (e.message.includes("Failed to fetch") || e.message.includes("ECONNREFUSED")) {
        setError("Cannot reach the backend. Is your Node.js server running on port 3001?");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
      clearInterval(elapsedRef.current);
      setElapsed(0);
    }
  }, [input, messages, loading, subject]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* ══════════════════════
     VOICE INPUT (STT)
  ══════════════════════ */
  const startListening = useCallback(() => {
    if (!micSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = voiceLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-send if we got something
      setInput(prev => {
        if (prev.trim()) {
          // slight delay so state settles
          setTimeout(() => sendMessage(prev.trim()), 100);
        }
        return prev;
      });
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error === "not-allowed") {
        setError("Microphone access denied. Please allow mic permissions in your browser.");
      } else if (e.error !== "no-speech") {
        setError(`Voice error: ${e.error}`);
      }
    };

    recognition.start();
  }, [micSupported, voiceLang, sendMessage]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  /* ══════════════════════
     VOICE OUTPUT (TTS)
  ══════════════════════ */
  const speakMessage = useCallback((text, msgId) => {
    if (!ttsSupported) return;

    // Stop if already speaking this message
    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Strip markdown for cleaner speech
    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang === voiceLang)
      || voices.find(v => v.lang.startsWith(voiceLang.split("-")[0]))
      || voices[0];
    if (match) utterance.voice = match;

    utterance.onstart = () => setSpeakingId(msgId);
    utterance.onend   = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  }, [ttsSupported, speakingId, voiceLang]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
      clearInterval(elapsedRef.current);
    };
  }, []);

  const resetChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([]);
    setSubject(null);
    setError(null);
  };

  /* ══════════════════════
     MARKDOWN RENDERER
  ══════════════════════ */
  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
  };

  const theme = dark ? "dark" : "light";

  /* ══════════════════════
     STYLES
  ══════════════════════ */
  return (
    <>
    
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --radius: 16px;
          --radius-sm: 10px;
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .light {
          --bg: #EBF4FF; --bg2: #DBEAFE;
          --surface: rgba(255,255,255,0.75); --surface2: rgba(219,234,254,0.6);
          --border: rgba(147,197,253,0.4); --text: #0F172A; --text2: #475569; --text3: #94A3B8;
          --accent: #2563EB; --accent2: #3B82F6; --accent-glow: rgba(37,99,235,0.25);
          --bubble-user: linear-gradient(135deg, #2563EB, #3B82F6);
          --bubble-ai: rgba(255,255,255,0.85); --bubble-ai-border: rgba(147,197,253,0.5);
          --shadow: 0 8px 32px rgba(37,99,235,0.12); --shadow-sm: 0 2px 8px rgba(37,99,235,0.08);
          --mesh1: radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.15) 0%, transparent 60%);
          --mesh2: radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.12) 0%, transparent 60%);
        }

        .dark {
          --bg: #060D1A; --bg2: #0D1B2E;
          --surface: rgba(13,27,46,0.85); --surface2: rgba(15,32,55,0.7);
          --border: rgba(59,130,246,0.2); --text: #E2EEFF; --text2: #94A3B8; --text3: #475569;
          --accent: #3B82F6; --accent2: #60A5FA; --accent-glow: rgba(59,130,246,0.3);
          --bubble-user: linear-gradient(135deg, #1D4ED8, #3B82F6);
          --bubble-ai: rgba(15,32,55,0.9); --bubble-ai-border: rgba(59,130,246,0.25);
          --shadow: 0 8px 40px rgba(0,0,0,0.5); --shadow-sm: 0 2px 12px rgba(0,0,0,0.3);
          --mesh1: radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.08) 0%, transparent 60%);
          --mesh2: radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.06) 0%, transparent 60%);
        }

        .app {
          min-height: 100vh;
          background: var(--bg);
          background-image: var(--mesh1), var(--mesh2);
          font-family: var(--font-body);
          color: var(--text);
          display: flex;
          transition: background var(--transition), color var(--transition);
          overflow: hidden;
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px; min-width: 260px;
          background: var(--surface); backdrop-filter: blur(20px);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1), min-width 0.4s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden; box-shadow: var(--shadow); position: relative; z-index: 10;
        }
        .sidebar.closed { width: 0; min-width: 0; }
        .sidebar-inner { width: 260px; padding: 28px 20px 20px; display: flex; flex-direction: column; height: 100%; gap: 8px; }

        .logo { font-family: var(--font-display); font-size: 22px; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--accent2), #818CF8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.5px; margin-bottom: 6px; }
        .logo-sub { font-size: 11px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; font-weight: 500; margin-bottom: 20px; }
        .sidebar-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--text3); font-weight: 600; margin: 8px 0 4px; }

        .subject-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid transparent; background: transparent; cursor: pointer; transition: all var(--transition); color: var(--text2); font-family: var(--font-body); font-size: 13.5px; font-weight: 500; text-align: left; white-space: nowrap; }
        .subject-btn:hover { background: var(--surface2); color: var(--text); border-color: var(--border); }
        .subject-btn.active { background: var(--accent-glow); color: var(--accent2); border-color: var(--border); }
        .subject-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; background: var(--surface2); }

        .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
        .icon-btn { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface2); cursor: pointer; color: var(--text2); font-family: var(--font-body); font-size: 13px; font-weight: 500; transition: all var(--transition); }
        .icon-btn:hover { background: var(--accent-glow); color: var(--accent2); }
        .model-badge { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: var(--radius-sm); background: var(--surface2); border: 1px solid var(--border); font-size: 11px; color: var(--text3); font-weight: 500; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; flex-shrink: 0; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }

        /* LANG PICKER */
        .lang-select { padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface2); color: var(--text2); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; outline: none; width: 100%; }
        .lang-select:focus { border-color: var(--accent); }

        /* MAIN */
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

        /* TOPBAR */
        .topbar { display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: var(--surface); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .toggle-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text2); font-size: 16px; transition: all var(--transition); flex-shrink: 0; }
        .toggle-btn:hover { background: var(--accent-glow); color: var(--accent); }
        .topbar-title { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--text); flex: 1; }
        .topbar-sub { font-size: 12px; color: var(--text3); font-weight: 400; font-family: var(--font-body); }
        .theme-toggle { width: 52px; height: 28px; border-radius: 14px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; display: flex; align-items: center; padding: 3px; transition: all var(--transition); flex-shrink: 0; }
        .theme-thumb { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 2px 8px var(--accent-glow); }
        .subject-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; background: var(--accent-glow); border: 1px solid var(--border); font-size: 12px; color: var(--accent2); font-weight: 600; }

        /* WELCOME */
        .welcome { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; gap: 32px; overflow-y: auto; }
        .welcome-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: var(--accent-glow); border: 1px solid var(--border); font-size: 11px; color: var(--accent2); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
        .welcome-title { font-family: var(--font-display); font-size: clamp(32px, 5vw, 52px); font-weight: 800; background: linear-gradient(135deg, var(--accent) 0%, #818CF8 50%, #38BDF8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; letter-spacing: -1px; margin-bottom: 12px; }
        .welcome-sub { font-size: 16px; color: var(--text2); font-weight: 300; max-width: 420px; line-height: 1.6; }
        .subject-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; max-width: 540px; }
        .subject-card { padding: 20px 16px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); backdrop-filter: blur(16px); cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); text-align: center; box-shadow: var(--shadow-sm); }
        .subject-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: var(--accent); background: var(--surface2); }
        .card-icon { font-size: 28px; margin-bottom: 8px; display: block; }
        .card-label { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--text); }

        /* CHAT */
        .chat-area { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth; }
        .chat-area::-webkit-scrollbar { width: 5px; }
        .chat-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

        .message-row { display: flex; gap: 12px; align-items: flex-start; animation: fadeSlide 0.3s ease-out; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .message-row.user { flex-direction: row-reverse; }

        .avatar { width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; font-family: var(--font-display); }
        .avatar.ai { background: linear-gradient(135deg, var(--accent), #818CF8); color: white; box-shadow: 0 4px 12px var(--accent-glow); }
        .avatar.user { background: var(--surface2); border: 1px solid var(--border); color: var(--text2); }

        .bubble-wrap { display: flex; flex-direction: column; gap: 6px; max-width: 72%; }
        .message-row.user .bubble-wrap { align-items: flex-end; }

        .bubble { padding: 13px 17px; border-radius: var(--radius); line-height: 1.65; font-size: 14.5px; position: relative; }
        .bubble.ai { background: var(--bubble-ai); border: 1px solid var(--bubble-ai-border); color: var(--text); backdrop-filter: blur(12px); box-shadow: var(--shadow-sm); border-radius: var(--radius) var(--radius) var(--radius) 4px; }
        .bubble.user { background: var(--bubble-user); color: white; border-radius: var(--radius) var(--radius) 4px var(--radius); box-shadow: 0 4px 16px var(--accent-glow); }
        .bubble code { background: rgba(0,0,0,0.12); padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'Courier New', monospace; }
        .bubble.user code { background: rgba(255,255,255,0.2); }

        /* TTS button under AI bubble */
        .tts-btn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; font-size: 11px; font-weight: 600; color: var(--text3); font-family: var(--font-body); transition: all 0.2s; }
        .tts-btn:hover { color: var(--accent2); border-color: var(--accent); background: var(--accent-glow); }
        .tts-btn.speaking { color: var(--accent2); border-color: var(--accent); background: var(--accent-glow); animation: tts-pulse 1.5s ease-in-out infinite; }
        @keyframes tts-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }

        /* TYPING */
        .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 4px 0; }
        .typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: var(--accent2); animation: bounce 1.2s infinite ease-in-out; }
        .typing-indicator span:nth-child(1){animation-delay:0s} .typing-indicator span:nth-child(2){animation-delay:0.15s} .typing-indicator span:nth-child(3){animation-delay:0.3s}
        @keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.5} 30%{transform:translateY(-6px);opacity:1} }

        /* INPUT AREA */
        .input-area { padding: 16px 24px 20px; background: var(--surface); backdrop-filter: blur(20px); border-top: 1px solid var(--border); }
        .input-wrapper { display: flex; gap: 10px; align-items: flex-end; background: var(--bg2); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 10px 14px; transition: border-color var(--transition), box-shadow var(--transition); box-shadow: var(--shadow-sm); }
        .input-wrapper:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

        textarea { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font-body); font-size: 14.5px; resize: none; max-height: 120px; line-height: 1.5; padding: 2px 0; }
        textarea::placeholder { color: var(--text3); }

        .send-btn { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; transition: all var(--transition); flex-shrink: 0; box-shadow: 0 2px 8px var(--accent-glow); }
        .send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 4px 16px var(--accent-glow); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* MIC BUTTON */
        .mic-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all var(--transition); flex-shrink: 0; }
        .mic-btn:hover { background: var(--accent-glow); border-color: var(--accent); }
        .mic-btn.listening { background: rgba(239,68,68,0.15); border-color: #ef4444; animation: mic-pulse 1s ease-in-out infinite; }
        @keyframes mic-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }

        .input-hint { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding: 0 2px; }
        .hint-text { font-size: 11px; color: var(--text3); }

        .error-banner { margin: 0 24px 12px; padding: 10px 16px; border-radius: var(--radius-sm); background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #EF4444; font-size: 13px; }

        /* Voice status bar */
        .voice-status { display: flex; align-items: center; gap: 8px; padding: 8px 14px; margin: 0 24px 10px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-sm); font-size: 12px; color: #f87171; font-weight: 500; }
        .voice-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; animation: mic-pulse 1s ease-in-out infinite; }

        @media (max-width: 640px) {
          .subject-grid { grid-template-columns: repeat(2, 1fr); }
          .sidebar { display: none; }
          .bubble-wrap { max-width: 88%; }
        }
      `}</style>

      <div className={`app ${theme}`}>
      
        {/* ══ SIDEBAR ══ */}
        <div className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-inner">
            <div className="logo">TutorAI</div>
            <div className="logo-sub">Powered by Llama 3.1</div>

            <div className="sidebar-label">Subjects</div>
            {SUBJECTS.map(s => (
              <button key={s.id} className={`subject-btn ${subject?.id === s.id ? "active" : ""}`}
                onClick={() => { setMessages([]); setSubject(s); }}>
                <span className="subject-icon">{s.icon}</span>
                {s.label}
              </button>
            ))}

            <div className="sidebar-footer">
              {/* Voice language picker */}
              {(micSupported || ttsSupported) && (
                <div>
                  <div className="sidebar-label">🗣 Voice Language</div>
                  <select
                    className="lang-select"
                    value={voiceLang}
                    onChange={e => setVoiceLang(e.target.value)}
                  >
                    {VOICE_LANGS.map(l => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <button className="icon-btn" onClick={resetChat}>
                <span>↺</span> New Session
              </button>
              <div className="model-badge">
                <span className="dot" />
                Llama 3.1 · Ollama Local
              </div>
            </div>
          </div>
        </div>

        {/* ══ MAIN ══ */}
        <div className="main">

          {/* TOPBAR */}
          <div className="topbar">
            <button className="toggle-btn" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <div style={{ flex: 1 }}>
              <div className="topbar-title">
                {subject ? `${subject.icon} ${subject.label} Tutor` : "AI Tutor"}
                <span className="topbar-sub" style={{ marginLeft: 8 }}>
                  {subject ? "Ask me anything" : "Choose a subject to begin"}
                </span>
              </div>
            </div>
            {subject && <div className="subject-chip">{subject.icon} {subject.label}</div>}

            {/* Voice badges */}
            {micSupported && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "var(--surface2)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>
                🎤 Voice On
              </div>
            )}

            <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
              <div className="theme-thumb" style={{ transform: `translateX(${dark ? "24px" : "0px"})`, transition: "transform 0.3s" }}>
                {dark ? "🌙" : "☀"}
              </div>
            </button>
          </div>

          {/* ══ CONTENT ══ */}
          {!subject ? (
            <div className="welcome">
              <div style={{ textAlign: "center" }}>
                <div className="welcome-badge">✦ Llama 3.1 · Local AI · Voice Enabled</div>
                <h1 className="welcome-title">Learn Anything,<br/>Deeply.</h1>
                <p className="welcome-sub">Your personal AI tutor — type or speak in your language. Adapts to your pace and makes learning genuinely exciting.</p>
              </div>
              <div className="subject-grid">
                {SUBJECTS.map(s => (
                  <div key={s.id} className="subject-card" onClick={() => setSubject(s)}>
                    <span className="card-icon">{s.icon}</span>
                    <div className="card-label">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Voice capability note */}
              {(micSupported || ttsSupported) && (
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                  {micSupported && (
                    <span style={{ fontSize: 13, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
                      🎤 <span>Speak your questions</span>
                    </span>
                  )}
                  {ttsSupported && (
                    <span style={{ fontSize: 13, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
                      🔊 <span>Hear the answers</span>
                    </span>
                  )}
                  <span style={{ fontSize: 13, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
                    🗣 <span>9 Indian languages</span>
                  </span>
                </div>
              )}
            </div>

          ) : (
            <>
              {/* CHAT MESSAGES */}
              <div className="chat-area">
                {messages.map(m => (
                  <div key={m.id} className={`message-row ${m.role}`}>
                    <div className={`avatar ${m.role === "assistant" ? "ai" : "user"}`}>
                      {m.role === "assistant" ? "A" : "U"}
                    </div>
                    <div className="bubble-wrap">
                      <div
                        className={`bubble ${m.role === "assistant" ? "ai" : "user"}`}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                      />
                      {/* TTS button — only on AI messages */}
                      {m.role === "assistant" && ttsSupported && (
                        <button
                          className={`tts-btn ${speakingId === m.id ? "speaking" : ""}`}
                          onClick={() => speakMessage(m.content, m.id)}
                          title={speakingId === m.id ? "Stop speaking" : "Read aloud"}
                        >
                          {speakingId === m.id ? "⏹ Stop" : "🔊 Listen"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-row">
                    <div className="avatar ai">A</div>
                    <div className="bubble-wrap">
                      <div className="bubble ai"><TypingIndicator elapsed={elapsed} /></div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Voice listening status */}
              {isListening && (
                <div className="voice-status">
                  <span className="voice-dot" />
                  Listening in {VOICE_LANGS.find(l => l.code === voiceLang)?.label || voiceLang}… speak now, then pause to send
                </div>
              )}

              {error && (
                <div className="error-banner">⚠ {error}</div>
              )}

              {/* INPUT */}
              <div className="input-area">
                <div className="input-wrapper">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder={isListening ? "🎤 Listening…" : `Ask about ${subject.label.toLowerCase()}…`}
                    value={input}
                    onChange={e => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                    onKeyDown={handleKey}
                    disabled={isListening}
                  />

                  {/* Mic button */}
                  {micSupported && (
                    <button
                      className={`mic-btn ${isListening ? "listening" : ""}`}
                      onClick={isListening ? stopListening : startListening}
                      title={isListening ? "Stop listening" : `Speak in ${VOICE_LANGS.find(l => l.code === voiceLang)?.label}`}
                      disabled={loading}
                    >
                      {isListening ? "⏹" : "🎤"}
                    </button>
                  )}

                  {/* Send button */}
                  <button
                    className="send-btn"
                    onClick={() => sendMessage()}
                    disabled={loading || (!input.trim() && !isListening)}
                  >
                    ↑
                  </button>
                </div>

                <div className="input-hint">
                  <span className="hint-text">
                    Enter to send · Shift+Enter for new line
                    {micSupported && ` · 🎤 tap mic to speak`}
                  </span>
                  <span className="hint-text">{subject.label} Mode</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
   
    </>
  );
}