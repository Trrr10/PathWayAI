/**
 * AssessmentGenerator.jsx
 * Teacher types topic → Ollama llama3.1 generates MCQs
 * src/pages/teacher/AssessmentGenerator.jsx
 */

import { useState } from "react";
import { useApp } from "../../context/AppContext";

const SUBJECTS     = ["Mathematics","Science","History","English","Geography","Physics","Chemistry","Biology"];
const DIFFICULTIES = ["Easy","Medium","Hard","Mixed"];
const COUNTS       = [5, 10, 15, 20];

const SAVED = [
  { id:1, title:"Quadratic Equations Quiz", subject:"Mathematics", difficulty:"Medium", questions:10, date:"Nov 28", avgScore:68, sent:true  },
  { id:2, title:"Newton's Laws MCQ",        subject:"Science",     difficulty:"Easy",   questions:5,  date:"Nov 25", avgScore:74, sent:true  },
  { id:3, title:"World War II Assessment",  subject:"History",     difficulty:"Hard",   questions:15, date:"Nov 22", avgScore:61, sent:false },
];

const QUICK_TOPICS = [
  "Quadratic Equations","Photosynthesis","Newton's Laws",
  "French Revolution","Periodic Table","Trigonometry",
  "Chemical Bonding","Mughal Empire",
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.ag-wrap{min-height:100vh;font-family:'DM Sans',sans-serif;}
.ag-wrap.dark {background:#07101F;color:#EDE8DF;}
.ag-wrap.light{background:#F4F6FA;color:#111827;}

.ag-card{border-radius:20px;padding:24px;transition:border-color .25s,box-shadow .25s;}
.dark  .ag-card{background:rgba(11,22,42,.97);border:1px solid rgba(255,255,255,.07);}
.light .ag-card{background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 12px rgba(0,0,0,.06);}

.ag-label{font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;margin-bottom:8px;display:block;}
.dark  .ag-label{color:#3D5068;}
.light .ag-label{color:#9CA3AF;}

.ag-input{width:100%;padding:13px 16px;border-radius:14px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s;}
.dark  .ag-input{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.09);color:#EDE8DF;}
.light .ag-input{background:#F9FAFB;border:1.5px solid #E5E7EB;color:#111827;}
.ag-input::placeholder{color:#4B5568;}
.ag-input:focus{border-color:#38BDF8;box-shadow:0 0 0 3px rgba(56,189,248,.12);}

.ag-select{width:100%;padding:11px 14px;border-radius:13px;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;outline:none;transition:border-color .2s;appearance:none;-webkit-appearance:none;padding-right:36px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234B5568' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;}
.dark  .ag-select{background-color:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.09);color:#EDE8DF;}
.light .ag-select{background-color:#F9FAFB;border:1.5px solid #E5E7EB;color:#111827;}
.ag-select:focus{border-color:#38BDF8;box-shadow:0 0 0 3px rgba(56,189,248,.12);}

.btn-generate{display:inline-flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px 32px;border-radius:15px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:800;background:linear-gradient(135deg,#0369A1,#0EA5E9,#38BDF8);color:white;box-shadow:0 4px 20px rgba(56,189,248,.35);transition:transform .2s,box-shadow .2s;letter-spacing:.01em;}
.btn-generate:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(56,189,248,.45);}
.btn-generate:active:not(:disabled){transform:translateY(0);}
.btn-generate:disabled{opacity:.5;cursor:not-allowed;}

.btn-sky{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border-radius:12px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:800;background:linear-gradient(135deg,#0369A1,#38BDF8);color:white;box-shadow:0 3px 12px rgba(56,189,248,.3);transition:transform .2s,box-shadow .2s;}
.btn-sky:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(56,189,248,.4);}

.btn-ghost{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;background:transparent;transition:all .2s;}
.dark  .btn-ghost{border:1.5px solid rgba(255,255,255,.1);color:#64748B;}
.light .btn-ghost{border:1.5px solid #E5E7EB;color:#9CA3AF;}
.btn-ghost:hover{border-color:#38BDF8;color:#38BDF8;background:rgba(56,189,248,.06);}

.ag-tab{padding:9px 20px;border-radius:11px;font-size:13px;font-weight:700;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .2s;}
.dark  .ag-tab       {background:transparent;color:#3D5068;}
.light .ag-tab       {background:transparent;color:#9CA3AF;}
.dark  .ag-tab.active{background:rgba(56,189,248,.12);color:#38BDF8;}
.light .ag-tab.active{background:rgba(56,189,248,.1);color:#0369A1;}
.ag-tab:hover:not(.active){color:#38BDF8;}

.ag-quick-btn{display:block;width:100%;text-align:left;padding:9px 13px;border-radius:11px;border:none;cursor:pointer;font-size:12.5px;font-weight:600;font-family:'DM Sans',sans-serif;transition:all .2s;margin-bottom:4px;}
.dark  .ag-quick-btn        {background:transparent;color:#3D5068;}
.light .ag-quick-btn        {background:transparent;color:#9CA3AF;}
.dark  .ag-quick-btn.active {background:rgba(56,189,248,.12);color:#38BDF8;}
.light .ag-quick-btn.active {background:rgba(56,189,248,.1);color:#0369A1;}
.ag-quick-btn:hover:not(.active){background:rgba(56,189,248,.06);color:#38BDF8;}

.ag-q-card{border-radius:18px;padding:22px 24px;margin-bottom:12px;border-left:3px solid #38BDF8;animation:ag-slide-up .45s cubic-bezier(.16,1,.3,1) both;}
.dark  .ag-q-card{background:rgba(11,22,42,.95);border-top:1px solid rgba(255,255,255,.06);border-right:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);}
.light .ag-q-card{background:#fff;border-top:1px solid #E5E7EB;border-right:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;box-shadow:0 2px 10px rgba(0,0,0,.04);}

.ag-q-num{font-family:'Syne',sans-serif;font-size:12px;font-weight:800;color:#38BDF8;flex-shrink:0;padding-top:2px;min-width:26px;}
.ag-q-text{font-size:14px;font-weight:600;line-height:1.6;}
.dark  .ag-q-text{color:#EDE8DF;}
.light .ag-q-text{color:#111827;}

.ag-opt{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;margin-top:7px;font-size:13px;transition:background .15s;}
.dark  .ag-opt        {background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);}
.light .ag-opt        {background:#F8FAFC;border:1px solid #F1F5F9;}
.dark  .ag-opt.correct{background:rgba(34,197,94,.13);border-color:rgba(34,197,94,.25);}
.light .ag-opt.correct{background:rgba(34,197,94,.09);border-color:rgba(34,197,94,.3);}

.ag-opt-dot{width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;}
.ag-opt.correct .ag-opt-dot{background:#22C55E;color:white;}
.dark  .ag-opt:not(.correct) .ag-opt-dot{background:rgba(255,255,255,.06);color:#4B5568;}
.light .ag-opt:not(.correct) .ag-opt-dot{background:#F1F5F9;color:#9CA3AF;}

.ag-opt-text{font-size:13px;}
.dark  .ag-opt-text              {color:#94A3B8;}
.light .ag-opt-text              {color:#374151;}
.dark  .ag-opt.correct .ag-opt-text{color:#86EFAC;font-weight:600;}
.light .ag-opt.correct .ag-opt-text{color:#15803D;font-weight:600;}

.ag-explanation{font-size:12px;line-height:1.65;padding-top:12px;margin-top:12px;}
.dark  .ag-explanation{color:#3D5068;border-top:1px solid rgba(255,255,255,.05);}
.light .ag-explanation{color:#9CA3AF;border-top:1px solid #F1F5F9;}

.ag-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.badge-easy  {background:rgba(34,197,94,.12);color:#22C55E;}
.badge-medium{background:rgba(234,179,8,.12);color:#EAB308;}
.badge-hard  {background:rgba(239,68,68,.12);color:#EF4444;}
.badge-mixed {background:rgba(139,92,246,.12);color:#8B5CF6;}

.ag-spinner{width:20px;height:20px;border-radius:50%;border:2.5px solid rgba(255,255,255,.2);border-top-color:white;animation:ag-spin .7s linear infinite;flex-shrink:0;}

.ag-error  {padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600;margin-top:10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#F87171;}
.ag-success{padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#86EFAC;display:flex;align-items:center;gap:8px;}

.ag-saved-row{border-radius:18px;padding:20px 24px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;transition:border-color .2s;animation:ag-slide-up .4s cubic-bezier(.16,1,.3,1) both;}
.dark  .ag-saved-row{background:rgba(11,22,42,.97);border:1px solid rgba(255,255,255,.07);}
.light .ag-saved-row{background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 10px rgba(0,0,0,.04);}
.ag-saved-row:hover{border-color:rgba(56,189,248,.3);}

.ag-hr{height:1px;margin:4px 0;}
.dark  .ag-hr{background:rgba(255,255,255,.05);}
.light .ag-hr{background:#F1F5F9;}

@keyframes ag-spin    {to{transform:rotate(360deg)}}
@keyframes ag-slide-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes ag-fade-up {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.ag-fade-up{animation:ag-fade-up .55s cubic-bezier(.16,1,.3,1) both;}
.s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}.s4{animation-delay:.2s}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:rgba(56,189,248,.2);border-radius:2px;}
`;

export default function AssessmentGenerator() {
  const { dark } = useApp();
  const theme = dark ? "dark" : "light";

  const [tab,        setTab]        = useState("generate");
  const [topic,      setTopic]      = useState("");
  const [subject,    setSubject]    = useState("Mathematics");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count,      setCount]      = useState(10);
  const [loading,    setLoading]    = useState(false);
  const [questions,  setQuestions]  = useState(null);
  const [error,      setError]      = useState("");
  const [copied,     setCopied]     = useState(false);
  const [sentOk,     setSentOk]     = useState(false);

  const M = dark ? "#3D5068" : "#9CA3AF";
  const T = dark ? "#EDE8DF" : "#111827";

  /* ── Generate via Ollama ── */
  const generate = async () => {
    if (!topic.trim()) { setError("Please enter a topic first."); return; }
    setError(""); setLoading(true); setQuestions(null); setSentOk(false);

    const prompt = `You are an expert Indian school teacher. Generate exactly ${count} multiple-choice questions about "${topic}" for ${subject} class, difficulty level: ${difficulty}.

IMPORTANT: Return ONLY a raw JSON array. No markdown. No code blocks. No explanation. No text before or after. Start directly with [ and end with ].

Format:
[
  {
    "q": "Full question text here?",
    "opts": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "One sentence explaining why this answer is correct."
  }
]

The "answer" field must be a number: 0 for A, 1 for B, 2 for C, 3 for D.
Make all questions relevant to Indian CBSE curriculum for ${subject}.`;

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1",
          prompt,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`Ollama responded with ${res.status}`);

      const data = await res.json();
      const raw  = data.response || "";

      // Robustly extract JSON array even if model wraps in extra text
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Model did not return a JSON array");

      const parsed = JSON.parse(match[0]);

      if (!Array.isArray(parsed) || parsed.length === 0)
        throw new Error("Empty or invalid response");
      if (!parsed[0].q || !parsed[0].opts)
        throw new Error("Questions missing required fields");

      setQuestions(parsed);
    } catch (e) {
      const isNetwork = e.message.includes("fetch") || e.message.includes("Failed to fetch") || e.message.includes("ERR_CONNECTION_REFUSED");
      if (isNetwork) {
        setError("Cannot connect to Ollama. Open a terminal and run: ollama serve");
      } else {
        setError(`Something went wrong: ${e.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Copy as plain text ── */
  const handleCopy = () => {
    if (!questions) return;
    const text = questions.map((q, i) => [
      `Q${i+1}. ${q.q}`,
      ...q.opts.map((o, j) => `   ${String.fromCharCode(65+j)}) ${o}`),
      `Answer: ${String.fromCharCode(65 + q.answer)}`,
      q.explanation ? `Explanation: ${q.explanation}` : "",
      "",
    ].filter(Boolean).join("\n")).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
  
        <div className={`ag-wrap ${theme}`}>
          <div style={{ maxWidth:920, margin:"0 auto", padding:"28px 24px 80px" }}>

            {/* Header */}
            <div className="ag-fade-up" style={{ marginBottom:26 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                  <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:T, marginBottom:5 }}>
                    🤖 AI Assessment Generator
                  </h1>
                  <p style={{ fontSize:13, color:M }}>
                    Type a topic — Ollama (llama3.1) generates exam-ready MCQs instantly
                  </p>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {["generate","saved"].map(t => (
                    <button key={t} className={`ag-tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>
                      {t === "generate" ? "⚡ Generate" : `📋 Saved (${SAVED.length})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ════ GENERATE TAB ════ */}
            {tab === "generate" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 270px", gap:18, alignItems:"start" }}>

                {/* Left */}
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                  {/* Form card */}
                  <div className="ag-card ag-fade-up s1">

                    {/* Topic */}
                    <div style={{ marginBottom:18 }}>
                      <label className="ag-label">Topic / Chapter</label>
                      <input
                        className="ag-input"
                        placeholder="e.g. Quadratic Equations, Photosynthesis, French Revolution…"
                        value={topic}
                        onChange={e => { setTopic(e.target.value); setError(""); }}
                        onKeyDown={e => e.key === "Enter" && !loading && generate()}
                      />
                    </div>

                    {/* 3 selects */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
                      <div>
                        <label className="ag-label">Subject</label>
                        <select className="ag-select" value={subject} onChange={e => setSubject(e.target.value)}>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="ag-label">Difficulty</label>
                        <select className="ag-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="ag-label">Questions</label>
                        <select className="ag-select" value={count} onChange={e => setCount(Number(e.target.value))}>
                          {COUNTS.map(c => <option key={c} value={c}>{c} questions</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Error */}
                    {error && <div className="ag-error">⚠️ {error}</div>}

                    {/* Generate button */}
                    <button
                      className="btn-generate"
                      onClick={generate}
                      disabled={loading}
                      style={{ marginTop: error ? 12 : 4 }}
                    >
                      {loading
                        ? <><div className="ag-spinner"/> Generating {count} questions…</>
                        : <>⚡ Generate {count} Questions</>}
                    </button>
                  </div>

                  {/* Empty state */}
                  {!questions && !loading && (
                    <div className="ag-card ag-fade-up s2" style={{ padding:"40px 24px", textAlign:"center" }}>
                      <div style={{ fontSize:42, marginBottom:14 }}>📝</div>
                      <p style={{ fontSize:15, fontWeight:700, color:T, marginBottom:8 }}>
                        Ready to generate
                      </p>
                      <p style={{ fontSize:13, color:M, lineHeight:1.7 }}>
                        Enter a topic above and press Enter or click Generate.<br/>
                        Ollama will create {count} MCQs with answers and explanations.
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {questions && (
                    <div className="ag-fade-up">

                      {/* Results header bar */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:T }}>
                            ✅ {questions.length} Questions Ready
                          </h2>
                          <span className={`ag-badge badge-${difficulty.toLowerCase()}`}>{difficulty}</span>
                          <span style={{ fontSize:12, color:M, fontWeight:600 }}>{subject}</span>
                        </div>
                        <div style={{ display:"flex", gap:8 }}>
                          <button className="btn-ghost" onClick={handleCopy}>
                            {copied ? "✓ Copied!" : "📋 Copy All"}
                          </button>
                          <button className="btn-sky" onClick={() => { setSentOk(true); setTimeout(() => setSentOk(false), 3000); }}>
                            {sentOk ? "✓ Sent!" : "📤 Send to Class"}
                          </button>
                        </div>
                      </div>

                      {/* Sent success */}
                      {sentOk && (
                        <div className="ag-success" style={{ marginBottom:14 }}>
                          ✅ Assessment sent to all 28 students!
                        </div>
                      )}

                      {/* Question cards */}
                      {questions.map((q, i) => (
                        <div key={i} className="ag-q-card" style={{ animationDelay:`${i * 0.04}s` }}>

                          {/* Question text */}
                          <div style={{ display:"flex", gap:12, marginBottom:12 }}>
                            <span className="ag-q-num">Q{i+1}</span>
                            <p className="ag-q-text">{q.q}</p>
                          </div>

                          {/* Options */}
                          {Array.isArray(q.opts) && q.opts.map((opt, j) => (
                            <div key={j} className={`ag-opt ${j === Number(q.answer) ? "correct" : ""}`}>
                              <div className="ag-opt-dot">
                                {j === Number(q.answer) ? "✓" : String.fromCharCode(65+j)}
                              </div>
                              <span className="ag-opt-text">{opt}</span>
                            </div>
                          ))}

                          {/* Explanation */}
                          {q.explanation && (
                            <p className="ag-explanation">
                              💡 <strong style={{ color: dark?"#4B5568":"#6B7280" }}>Why:</strong>{" "}
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Bottom actions */}
                      <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap" }}>
                        <button className="btn-ghost" onClick={() => { setQuestions(null); }}>🗑 Clear</button>
                        <button className="btn-ghost" onClick={generate}>🔄 Regenerate</button>
                        <button className="btn-ghost" onClick={handleCopy}>
                          {copied ? "✓ Copied" : "📋 Copy as Text"}
                        </button>
                        <button className="btn-sky" onClick={() => { setSentOk(true); setTimeout(() => setSentOk(false), 3000); }}>
                          {sentOk ? "✓ Sent!" : "📤 Send to Class"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Quick topics */}
                  <div className="ag-card ag-fade-up s2" style={{ padding:20 }}>
                    <label className="ag-label">Quick Topics</label>
                    {QUICK_TOPICS.map(t => (
                      <button key={t} className={`ag-quick-btn ${topic===t?"active":""}`}
                        onClick={() => { setTopic(t); setError(""); }}>
                        {topic === t ? "→ " : ""}{t}
                      </button>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="ag-card ag-fade-up s3" style={{ padding:20 }}>
                    <label className="ag-label">Tips</label>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {[
                        { icon:"🎯", text:"Be specific — 'Quadratic: discriminant' beats just 'Maths'" },
                        { icon:"🔀", text:"Use 'Mixed' difficulty for revision tests" },
                        { icon:"📋", text:"Copy as text and paste into Google Forms" },
                        { icon:"📤", text:"Send to class pushes to all 28 students at once" },
                        { icon:"🔄", text:"Not happy with the results? Click Regenerate" },
                      ].map((tip, i) => (
                        <div key={i} style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
                          <span style={{ fontSize:13, flexShrink:0 }}>{tip.icon}</span>
                          <p style={{ fontSize:12, color:M, lineHeight:1.6 }}>{tip.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ollama status */}
                  <div className="ag-card ag-fade-up s4" style={{ padding:18 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 6px #22C55E" }}/>
                      <span style={{ fontSize:13, fontWeight:700, color:T }}>Ollama · llama3.1</span>
                    </div>
                    <p style={{ fontSize:12, color:M, lineHeight:1.65, marginBottom:10 }}>
                      Running locally at <code style={{ color:"#38BDF8", fontSize:11 }}>localhost:11434</code>.<br/>
                      Your data never leaves your device.
                    </p>
                    <div className="ag-hr" style={{ margin:"10px 0" }}/>
                    <p style={{ fontSize:11, color:M, lineHeight:1.65 }}>
                      Not running? Open a terminal:<br/>
                      <code style={{ fontSize:11, color:"#38BDF8" }}>ollama serve</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ════ SAVED TAB ════ */}
            {tab === "saved" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <p className="ag-fade-up" style={{ fontSize:13, color:M, marginBottom:6 }}>
                  {SAVED.length} saved assessments · click to preview or re-send
                </p>
                {SAVED.map((a, i) => (
                  <div key={a.id} className="ag-saved-row" style={{ animationDelay:`${i * 0.06}s` }}>
                    <div style={{ width:46, height:46, borderRadius:14, flexShrink:0,
                      background: dark?"rgba(56,189,248,.1)":"rgba(56,189,248,.08)",
                      border:"1px solid rgba(56,189,248,.2)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                      📋
                    </div>
                    <div style={{ flex:1, minWidth:160 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:T }}>{a.title}</h3>
                        <span className={`ag-badge badge-${a.difficulty.toLowerCase()}`}>{a.difficulty}</span>
                        {a.sent && (
                          <span style={{ fontSize:10, fontWeight:800, color:"#22C55E",
                            background:"rgba(34,197,94,.12)", padding:"2px 8px",
                            borderRadius:20, border:"1px solid rgba(34,197,94,.2)" }}>
                            ✓ Sent
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize:12, color:M }}>
                        {a.subject} · {a.questions} questions · {a.date} · Avg:{" "}
                        <span style={{ color:"#38BDF8", fontWeight:700 }}>{a.avgScore}%</span>
                      </p>
                    </div>
                    <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                      <button className="btn-ghost" style={{ fontSize:11, padding:"7px 14px" }}>👁 Preview</button>
                      <button className="btn-sky"   style={{ fontSize:11, padding:"7px 14px" }}>📤 Re-send</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
     
    </>
  );
}