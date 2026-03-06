/**
 * AITutor.jsx — Full featured
 * Ollama llama3.1 streaming + Supabase history + TTS + STT + File upload
 * src/pages/student/AITutor.jsx
 */

import { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { useChat } from "../../hooks/useChat";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.at-root{height:100vh;display:flex;flex-direction:column;font-family:'DM Sans',sans-serif;overflow:hidden;}
.at-root.dark {background:#070C18;color:#EDE8DF;}
.at-root.light{background:#F4F6FA;color:#111827;}

.at-topbar{height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid;}
.dark  .at-topbar{background:rgba(7,12,24,.98);border-color:rgba(255,255,255,.07);}
.light .at-topbar{background:rgba(255,255,255,.98);border-color:#E5E7EB;box-shadow:0 1px 8px rgba(0,0,0,.04);}
.at-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;}
.dark  .at-title{color:#EDE8DF;}
.light .at-title{color:#111827;}
.at-topbar-right{display:flex;align-items:center;gap:10px;}
.at-status{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;}
.dark  .at-status{color:#3D5068;}
.light .at-status{color:#9CA3AF;}
.at-status-dot{width:7px;height:7px;border-radius:50%;background:#22C55E;box-shadow:0 0 6px #22C55E;}

.at-subjects{display:flex;gap:8px;padding:12px 24px;overflow-x:auto;flex-shrink:0;border-bottom:1px solid;}
.dark  .at-subjects{border-color:rgba(255,255,255,.05);}
.light .at-subjects{border-color:#F1F5F9;}
.at-subjects::-webkit-scrollbar{display:none;}
.at-pill{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:none;white-space:nowrap;transition:all .2s;font-family:'DM Sans',sans-serif;}
.dark  .at-pill{background:rgba(255,255,255,.05);color:#4B5568;}
.light .at-pill{background:#F1F5F9;color:#9CA3AF;}
.at-pill.active{background:rgba(56,189,248,.14);color:#38BDF8;}
.dark  .at-pill:hover:not(.active){background:rgba(255,255,255,.08);color:#64748B;}
.light .at-pill:hover:not(.active){background:#E2E8F0;color:#6B7280;}

.at-messages{flex:1;overflow-y:auto;padding:24px 24px 16px;display:flex;flex-direction:column;gap:18px;}
.at-messages::-webkit-scrollbar{width:4px;}
.at-messages::-webkit-scrollbar-thumb{background:rgba(56,189,248,.2);border-radius:2px;}

.at-msg{display:flex;gap:12px;align-items:flex-start;animation:at-msg-in .4s cubic-bezier(.16,1,.3,1) both;}
.at-msg.user{flex-direction:row-reverse;}
.at-avatar{width:36px;height:36px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px;}
.at-avatar.ai  {background:linear-gradient(135deg,#0369A1,#38BDF8);}
.at-avatar.user{background:linear-gradient(135deg,#7C3AED,#A78BFA);}
.at-bubble{max-width:72%;padding:14px 18px;border-radius:18px;font-size:14px;line-height:1.7;position:relative;}
.dark  .at-bubble.ai  {background:rgba(11,22,42,.97);border:1px solid rgba(255,255,255,.07);}
.light .at-bubble.ai  {background:#ffffff;border:1px solid #E5E7EB;box-shadow:0 2px 8px rgba(0,0,0,.05);}
.dark  .at-bubble.user{background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.2);}
.light .at-bubble.user{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.18);}
.at-bubble-text{word-break:break-word;white-space:pre-wrap;}
.dark  .at-bubble-text{color:#C8C0B4;}
.light .at-bubble-text{color:#374151;}
.dark  .at-bubble.user .at-bubble-text{color:#BAE6FD;}
.light .at-bubble.user .at-bubble-text{color:#0369A1;}
.at-bubble-time{font-size:11px;margin-top:8px;opacity:.45;}

.at-speak-btn{
  position:absolute;top:10px;right:10px;
  width:26px;height:26px;border-radius:8px;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:13px;
  transition:all .2s;opacity:0;
}
.at-bubble:hover .at-speak-btn{opacity:1;}
.dark  .at-speak-btn{background:rgba(56,189,248,.12);color:#38BDF8;}
.light .at-speak-btn{background:rgba(56,189,248,.1);color:#0369A1;}
.at-speak-btn:hover{transform:scale(1.1);}
.at-speak-btn.speaking{opacity:1;background:rgba(239,68,68,.15);color:#F87171;animation:at-pulse 1s ease-in-out infinite;}
@keyframes at-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}

.at-file-preview{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;margin-bottom:8px;font-size:12px;font-weight:600;}
.dark  .at-file-preview{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.15);color:#38BDF8;}
.light .at-file-preview{background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.12);color:#0369A1;}
.at-file-remove{background:none;border:none;cursor:pointer;color:inherit;opacity:.6;font-size:14px;margin-left:auto;padding:0 2px;}
.at-file-remove:hover{opacity:1;}

.at-typing{display:flex;gap:5px;padding:6px 4px;align-items:center;}
.at-dot{width:7px;height:7px;border-radius:50%;background:#38BDF8;animation:at-bounce .9s ease-in-out infinite;}
.at-dot:nth-child(2){animation-delay:.18s;}
.at-dot:nth-child(3){animation-delay:.36s;}
@keyframes at-bounce{0%,80%,100%{transform:scale(.8);opacity:.5}40%{transform:scale(1.2);opacity:1}}

.at-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px 20px;}
.at-empty-icon{font-size:48px;margin-bottom:6px;}
.at-empty-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;}
.dark  .at-empty-title{color:#EDE8DF;}
.light .at-empty-title{color:#111827;}
.at-empty-sub{font-size:13px;text-align:center;max-width:340px;line-height:1.65;}
.dark  .at-empty-sub{color:#3D5068;}
.light .at-empty-sub{color:#9CA3AF;}
.at-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px;}
.at-chip{padding:8px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .2s;}
.dark  .at-chip{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.18);color:#64748B;}
.light .at-chip{background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.15);color:#9CA3AF;}
.at-chip:hover{background:rgba(56,189,248,.16);color:#38BDF8;border-color:rgba(56,189,248,.35);}

.at-inputbar{flex-shrink:0;padding:14px 24px;border-top:1px solid;}
.dark  .at-inputbar{background:rgba(7,12,24,.98);border-color:rgba(255,255,255,.07);}
.light .at-inputbar{background:rgba(255,255,255,.98);border-color:#E5E7EB;}
.at-input-row{display:flex;gap:8px;align-items:flex-end;}
.at-textarea{
  flex:1;padding:12px 14px;border-radius:16px;font-size:14px;
  font-family:'DM Sans',sans-serif;resize:none;outline:none;
  min-height:48px;max-height:160px;line-height:1.6;transition:border-color .2s,box-shadow .2s;
}
.dark  .at-textarea{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.09);color:#EDE8DF;}
.light .at-textarea{background:#F9FAFB;border:1.5px solid #E5E7EB;color:#111827;}
.at-textarea::placeholder{color:#4B5568;}
.at-textarea:focus{border-color:#38BDF8;box-shadow:0 0 0 3px rgba(56,189,248,.1);}

.at-icon-btn{
  width:42px;height:42px;border-radius:12px;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:17px;
  transition:all .2s;flex-shrink:0;
}
.dark  .at-icon-btn{background:rgba(255,255,255,.05);color:#4B5568;}
.light .at-icon-btn{background:#F1F5F9;color:#9CA3AF;}
.at-icon-btn:hover{background:rgba(56,189,248,.12);color:#38BDF8;}
.at-icon-btn.recording{background:rgba(239,68,68,.15);color:#F87171;animation:at-pulse 1s ease-in-out infinite;}

.at-send{
  width:48px;height:48px;border-radius:15px;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  background:linear-gradient(135deg,#0369A1,#38BDF8);
  box-shadow:0 4px 16px rgba(56,189,248,.35);transition:all .2s;
}
.at-send:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(56,189,248,.45);}
.at-send:disabled{opacity:.45;cursor:not-allowed;}
.at-send-icon{width:20px;height:20px;fill:none;stroke:white;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.at-input-footer{display:flex;align-items:center;justify-content:space-between;margin-top:8px;}
.at-hint{font-size:11px;}
.dark  .at-hint{color:#3D5068;}
.light .at-hint{color:#9CA3AF;}
.at-clear{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer;background:transparent;transition:all .2s;font-family:'DM Sans',sans-serif;}
.dark  .at-clear{border:1px solid rgba(239,68,68,.2);color:rgba(239,68,68,.5);}
.light .at-clear{border:1px solid rgba(239,68,68,.2);color:rgba(239,68,68,.5);}
.at-clear:hover{background:rgba(239,68,68,.1);color:#F87171;border-color:rgba(239,68,68,.4);}
.at-recording-bar{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:12px;margin-bottom:8px;font-size:12px;font-weight:700;}
.dark  .at-recording-bar{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#F87171;}
.light .at-recording-bar{background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.15);color:#EF4444;}
.at-rec-dot{width:8px;height:8px;border-radius:50%;background:#EF4444;animation:at-pulse 1s ease-in-out infinite;}
.at-history-loader{display:flex;align-items:center;justify-content:center;gap:10px;padding:24px;font-size:13px;}
.dark  .at-history-loader{color:#3D5068;}
.light .at-history-loader{color:#9CA3AF;}
.at-spinner{width:18px;height:18px;border-radius:50%;border:2px solid rgba(56,189,248,.2);border-top-color:#38BDF8;animation:at-spin .7s linear infinite;flex-shrink:0;}
@keyframes at-spin{to{transform:rotate(360deg)}}
@keyframes at-msg-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
`;

const SUBJECTS = ["All", "Mathematics", "Science", "History", "English", "Physics", "Chemistry", "Biology"];
const SUGGESTIONS = [
  "Explain the Pythagorean theorem with an example 📐",
  "What is photosynthesis and why is it important? 🌿",
  "Help me understand Newton's laws of motion 🚀",
  "Explain the French Revolution simply 🏰",
  "What is the difference between mitosis and meiosis? 🔬",
  "How do I solve quadratic equations? ✏️",
];
const OLLAMA_URL = "http://localhost:11434/api/generate";
const formatTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });

export default function AITutor() {
  const { dark, user } = useApp();
  const { loadHistory, saveMessage, clearHistory } = useChat();
  const theme = dark ? "dark" : "light";

  const [messages,       setMessages]       = useState([]);
  const [input,          setInput]          = useState("");
  const [loading,        setLoading]        = useState(false);
  const [activeSubject,  setActiveSubject]  = useState("All");
  const [historyLoading, setHistoryLoading] = useState(true);
  const [streamingText,  setStreamingText]  = useState("");
  const [speakingId,     setSpeakingId]     = useState(null);
  const [recording,      setRecording]      = useState(false);
  const [attachedFile,   setAttachedFile]   = useState(null);

  const bottomRef      = useRef(null);
  const textareaRef    = useRef(null);
  const abortRef       = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef   = useRef(null);

  /* ── Load Supabase history ── */
  useEffect(() => {
    if (!user?.id) { setHistoryLoading(false); return; }
    loadHistory(user.id)
      .then(h => setMessages(h.map(m => ({ id:m.id, role:m.role, content:m.content, time:m.created_at }))))
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  /* ══ TEXT TO SPEECH ══ */
  const speak = (text, msgId) => {
    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = "en-IN";
    utt.rate  = 0.95;
    utt.pitch = 1;
    const voices   = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-GB") || v.name.includes("Google"));
    if (preferred) utt.voice = preferred;
    utt.onstart = () => setSpeakingId(msgId);
    utt.onend   = () => setSpeakingId(null);
    utt.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utt);
  };

  /* ══ SPEECH TO TEXT ══ */
  const toggleRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input needs Chrome or Edge browser."); return; }
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return; }
    const rec = new SR();
    rec.lang           = "en-IN";
    rec.continuous     = false;
    rec.interimResults = true;
    rec.onstart  = () => setRecording(true);
    rec.onend    = () => setRecording(false);
    rec.onerror  = () => setRecording(false);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      setInput(transcript);
      if (textareaRef.current) {
        textareaRef.current.style.height = "48px";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
      }
    };
    recognitionRef.current = rec;
    rec.start();
  };

  /* ══ FILE UPLOAD ══ */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAttachedFile({ name: file.name, content: ev.target.result.slice(0, 4000) });
    reader.readAsText(file);
    e.target.value = "";
  };

  /* ── Textarea auto-resize ── */
  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "48px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  /* ══ SEND ══ */
  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed && !attachedFile) return;
    if (loading) return;

    let content = trimmed;
    let displayContent = trimmed;
    if (attachedFile) {
      content = `${trimmed ? trimmed + "\n\n" : ""}[File: ${attachedFile.name}]\n${attachedFile.content}`;
      displayContent = trimmed ? `${trimmed}\n📎 ${attachedFile.name}` : `📎 ${attachedFile.name}`;
    }

    setInput("");
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "48px";

    const userMsg = { id: Date.now(), role: "user", content, displayContent, time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setStreamingText("");

    if (user?.id) saveMessage(user.id, "user", content).catch(console.error);

    const context = messages.slice(-10).map(m =>
      `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`
    ).join("\n");

    const subjectCtx = activeSubject !== "All" ? ` Focus on ${activeSubject}.` : "";
    const prompt = `You are PathwayAI — a warm, patient AI tutor for Indian school students (CBSE/ICSE/State board).${subjectCtx} Use simple language, relatable Indian examples, and encourage the student. Keep responses clear and not too long.

Previous conversation:
${context}

Student: ${content}
Tutor:`;

    let fullResponse = "";
    try {
      abortRef.current = new AbortController();
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({ model: "llama3.1", prompt, stream: true }),
      });
      if (!res.ok) throw new Error(`Ollama error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const p = JSON.parse(line);
            if (p.response) { fullResponse += p.response; setStreamingText(fullResponse); }
          } catch {}
        }
      }

      const aiMsg = {
        id: Date.now() + 1, role: "assistant",
        content: fullResponse || "I couldn't generate a response. Please try again.",
        time: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setStreamingText("");
      if (user?.id) saveMessage(user.id, "assistant", aiMsg.content).catch(console.error);

    } catch (err) {
      if (err.name === "AbortError") return;
      const errMsg = (err.message?.includes("fetch") || err.message?.includes("ERR_CONNECTION_REFUSED"))
        ? "Cannot connect to Ollama. Run `ollama serve` in your terminal first."
        : "Something went wrong. Please try again.";
      setMessages(prev => [...prev, { id: Date.now()+1, role:"assistant", content:`⚠️ ${errMsg}`, time: new Date().toISOString() }]);
      setStreamingText("");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all chat history? This cannot be undone.")) return;
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([]);
    if (user?.id) clearHistory(user.id).catch(console.error);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const M = dark ? "#3D5068" : "#9CA3AF";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
     
        <div className={`at-root ${theme}`}>

          {/* ── Top bar ── */}
          <div className="at-topbar">
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#0369A1,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
                🤖
              </div>
              <div>
                <div className="at-title">AI Tutor</div>
                <div style={{ fontSize:11, color:M }}>llama3.1 · 🎤 Voice · 📎 Files · 🔊 Read aloud</div>
              </div>
            </div>
            <div className="at-topbar-right">
              <div className="at-status">
                <div className="at-status-dot"/>
                <span>Ollama running</span>
              </div>
              {messages.length > 0 && (
                <button className="at-clear" onClick={handleClear}>🗑 Clear</button>
              )}
            </div>
          </div>

          {/* ── Subject pills ── */}
          <div className="at-subjects">
            {SUBJECTS.map(s => (
              <button key={s} className={`at-pill ${activeSubject===s?"active":""}`}
                onClick={() => setActiveSubject(s)}>{s}</button>
            ))}
          </div>

          {/* ── Messages ── */}
          <div className="at-messages">
            {historyLoading && (
              <div className="at-history-loader">
                <div className="at-spinner"/>
                <span>Loading your chat history…</span>
              </div>
            )}

            {!historyLoading && messages.length === 0 && !streamingText && (
              <div className="at-empty">
                <div className="at-empty-icon">🤖</div>
                <h2 className="at-empty-title">
                  Hi{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! I'm your AI Tutor
                </h2>
                <p className="at-empty-sub">
                  Type, tap 🎤 to speak, or 📎 upload a file — ask me anything about your studies!
                </p>
                <div className="at-chips">
                  {SUGGESTIONS.map((s,i) => (
                    <button key={i} className="at-chip" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {!historyLoading && messages.map(msg => (
              <div key={msg.id} className={`at-msg ${msg.role==="user"?"user":""}`}>
                <div className={`at-avatar ${msg.role==="user"?"user":"ai"}`}>
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className={`at-bubble ${msg.role==="user"?"user":"ai"}`}>
                  <p className="at-bubble-text">{msg.displayContent || msg.content}</p>
                  <p className="at-bubble-time">{formatTime(msg.time)}</p>

                  {/* 🔊 Speak button on AI messages — hover to reveal, click to read aloud / stop */}
                  {msg.role === "assistant" && (
                    <button
                      className={`at-speak-btn ${speakingId===msg.id?"speaking":""}`}
                      onClick={() => speak(msg.content, msg.id)}
                      title={speakingId===msg.id ? "Stop" : "Read aloud"}
                    >
                      {speakingId === msg.id ? "⏹" : "🔊"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="at-msg">
                <div className="at-avatar ai">🤖</div>
                <div className="at-bubble ai">
                  <p className="at-bubble-text">{streamingText}</p>
                  <span style={{ display:"inline-block",width:2,height:14,background:"#38BDF8",marginLeft:2,animation:"at-bounce .9s ease-in-out infinite",verticalAlign:"middle" }}/>
                </div>
              </div>
            )}

            {loading && !streamingText && (
              <div className="at-msg">
                <div className="at-avatar ai">🤖</div>
                <div className="at-bubble ai">
                  <div className="at-typing">
                    <div className="at-dot"/><div className="at-dot"/><div className="at-dot"/>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* ── Input bar ── */}
          <div className="at-inputbar">

            {/* Recording indicator */}
            {recording && (
              <div className="at-recording-bar">
                <div className="at-rec-dot"/>
                <span>Listening… speak now. Tap 🎤 again to stop and send.</span>
              </div>
            )}

            {/* File attachment preview */}
            {attachedFile && (
              <div className="at-file-preview">
                <span>📎</span>
                <span>{attachedFile.name}</span>
                <button className="at-file-remove" onClick={() => setAttachedFile(null)}>✕</button>
              </div>
            )}

            <div className="at-input-row">

              {/* 📎 File upload */}
              <button className="at-icon-btn" title="Attach file (txt, pdf, csv, code…)"
                onClick={() => fileInputRef.current?.click()}>
                📎
              </button>
              <input ref={fileInputRef} type="file"
                accept=".txt,.pdf,.csv,.md,.js,.jsx,.py,.json,.html,.css"
                style={{ display:"none" }} onChange={handleFileChange} />

              {/* 🎤 Voice input */}
              <button
                className={`at-icon-btn ${recording?"recording":""}`}
                onClick={toggleRecording}
                title={recording ? "Stop recording" : "Speak your question (Chrome/Edge)"}
              >
                {recording ? "⏹" : "🎤"}
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                className="at-textarea"
                placeholder={recording
                  ? "Listening… speak your question"
                  : `Ask anything${activeSubject!=="All"?` about ${activeSubject}`:""}… or use 🎤 to speak / 📎 to upload`}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
              />

              {/* Send */}
              <button className="at-send" onClick={() => send()}
                disabled={(!input.trim() && !attachedFile) || loading}>
                <svg className="at-send-icon" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

            <div className="at-input-footer">
              <p className="at-hint">🎤 speak · 📎 attach file · 🔊 hover any AI reply to read aloud · Enter to send</p>
              <p className="at-hint">
                {messages.length > 0 && `${messages.length} msg${messages.length!==1?"s":""} · `}
                {user ? "Saved to Supabase ✓" : "Log in to save history"}
              </p>
            </div>
          </div>

        </div>
      
    </>
  );
}