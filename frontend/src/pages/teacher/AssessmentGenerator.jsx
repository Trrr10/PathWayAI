/**
 * AssessmentGenerator.jsx — PathwayAI
 * Glassmorphism soft pink calm aesthetic
 */
import { useState } from "react";
import { GLASS_CSS } from "./glassTheme";

const SUBJECTS = ["Mathematics","Science","History","English","Geography","Physics","Chemistry"];
const TOPICS   = {
  Mathematics: ["Quadratic Equations","Trigonometry","Statistics","Coordinate Geometry","Calculus"],
  Science:     ["Newton's Laws","Photosynthesis","Chemical Reactions","Electricity","Evolution"],
  History:     ["French Revolution","World War II","Indian Independence","Cold War","Ancient Rome"],
  English:     ["Grammar — Tenses","Poetry Analysis","Essay Writing","Reading Comprehension","Shakespeare"],
  Geography:   ["Climate Zones","Maps & Cartography","Natural Resources","Population","Rivers"],
  Physics:     ["Optics","Waves","Thermodynamics","Magnetism","Modern Physics"],
  Chemistry:   ["Periodic Table","Bonding","Acids & Bases","Organic Chemistry","Equilibrium"],
};
const TYPES    = ["MCQ","True/False","Short Answer","Mixed"];
const DIFFS    = ["Easy","Medium","Hard","Mixed"];

const SAMPLE_QUESTIONS = [
  { q:"The discriminant of a quadratic equation ax²+bx+c=0 is given by:", opts:["b²−4ac","4ac−b²","b²+4ac","−b²+4ac"], ans:0, type:"MCQ" },
  { q:"If discriminant > 0, the quadratic equation has:", opts:["No real roots","One repeated root","Two distinct real roots","Complex roots"], ans:2, type:"MCQ" },
  { q:"Solve: x²−5x+6=0. What are the roots?", opts:["x=2, x=3","x=−2, x=−3","x=1, x=6","x=−1, x=−6"], ans:0, type:"MCQ" },
  { q:"The sum of roots of ax²+bx+c=0 is ___.", opts:["−b/a","b/a","c/a","−c/a"], ans:0, type:"MCQ" },
  { q:"A quadratic equation always has exactly two roots. True or False.", opts:["True","False"], ans:1, type:"True/False" },
];

const EXTRA_CSS = `
.ag-question {
  background: rgba(255,248,252,0.65);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(232,164,184,0.2);
  border-radius: 16px; padding: 22px;
  transition: all 0.25s;
  box-shadow: 0 3px 16px rgba(201,116,142,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
}
.ag-question:hover { border-color: rgba(201,116,142,0.3); transform: translateY(-1px); }

.ag-opt {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: 10px;
  background: rgba(252,232,237,0.3);
  border: 1px solid rgba(232,164,184,0.15);
  margin-top: 8px; cursor: pointer; transition: all 0.2s;
  font-size: 13px; color: var(--text-mid);
}
.ag-opt:hover { background: rgba(252,232,237,0.6); border-color: rgba(201,116,142,0.3); }
.ag-opt.correct { background: rgba(168,197,184,0.25); border-color: rgba(168,197,184,0.4); color: #4a7a64; }

.ag-opt-letter {
  width: 24px; height: 24px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  background: rgba(232,164,184,0.2); color: var(--pink-deep);
}
.ag-opt.correct .ag-opt-letter { background: rgba(168,197,184,0.35); color: #4a7a64; }

.ag-form-section {
  background: rgba(255,248,252,0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(232,164,184,0.22);
  border-radius: 20px; padding: 28px;
  box-shadow: 0 4px 24px rgba(201,116,142,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
}

.ag-select {
  width: 100%;
  background: rgba(255,248,252,0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(232,164,184,0.25);
  border-radius: 12px; padding: 11px 15px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; color: var(--text); outline: none;
  cursor: pointer; transition: all 0.2s;
  -webkit-appearance: none; appearance: none;
}
.ag-select:focus { border-color: rgba(201,116,142,0.5); box-shadow: 0 0 0 3px rgba(232,164,184,0.15); }
.ag-select option { background: #fdf6f0; color: var(--text); }

.ag-num-input {
  width: 80px;
  background: rgba(255,248,252,0.6);
  border: 1px solid rgba(232,164,184,0.25);
  border-radius: 10px; padding: 9px 12px;
  font-family: 'DM Sans', sans-serif; font-size:13px; color:var(--text);
  outline: none; transition: all 0.2s; text-align:center;
}
.ag-num-input:focus { border-color: rgba(201,116,142,0.5); }

.ag-generating {
  display: flex; flex-direction: column; align-items: center;
  padding: 60px 24px; gap: 16px;
}
.ag-spinner {
  width: 44px; height: 44px; border-radius: 50%;
  border: 3px solid rgba(232,164,184,0.2);
  border-top-color: var(--pink-deep);
  animation: ag-spin 1s linear infinite;
}
@keyframes ag-spin { to { transform: rotate(360deg); } }

.ag-diff-btn {
  padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600;
  border: 1px solid rgba(232,164,184,0.25);
  background: rgba(255,240,245,0.4);
  color: var(--text-soft); cursor: pointer; transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}
.ag-diff-btn.selected {
  background: rgba(201,116,142,0.15);
  border-color: rgba(201,116,142,0.4);
  color: var(--pink-deep);
}
`;

export default function AssessmentGenerator() {
  const [subject,    setSubject]    = useState("Mathematics");
  const [topic,      setTopic]      = useState("Quadratic Equations");
  const [type,       setType]       = useState("MCQ");
  const [diff,       setDiff]       = useState("Medium");
  const [count,      setCount]      = useState(5);
  const [generating, setGenerating] = useState(false);
  const [questions,  setQuestions]  = useState(null);
  const [revealed,   setRevealed]   = useState({});
  const [shared,     setShared]     = useState(false);

  const generate = () => {
    setGenerating(true);
    setQuestions(null);
    setRevealed({});
    setTimeout(() => {
      setGenerating(false);
      setQuestions(SAMPLE_QUESTIONS.slice(0, count));
    }, 2200);
  };

  const toggleReveal = (i) => setRevealed(r => ({ ...r, [i]: !r[i] }));

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <>
      <style>{GLASS_CSS + EXTRA_CSS}</style>
      <div className="gl-root">
        <div className="gl-orb" style={{ width:320, height:320, background:"rgba(232,164,184,0.18)", top:-60, left:-60 }} />
        <div className="gl-orb" style={{ width:260, height:260, background:"rgba(197,184,232,0.14)", bottom:80, right:-40, animationDelay:"4s" }} />

        <div className="gl-content" style={{ maxWidth:920, margin:"0 auto", padding:"36px 28px 80px" }}>

          {/* Header */}
          <div className="gl-fade-up" style={{ marginBottom:32 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--text-soft)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>AI-Powered</div>
            <h1 className="gl-page-title">Assessment Generator</h1>
            <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:6 }}>Generate quiz questions instantly — just pick a topic and difficulty</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:22, alignItems:"start" }}>

            {/* Form */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div className="ag-form-section gl-fade-up d1">
                <div className="gl-section-title">Assessment Settings</div>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {/* Subject */}
                  <div>
                    <label style={{ display:"block", fontSize:10, fontWeight:700, color:"var(--text-soft)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:7 }}>Subject</label>
                    <div style={{ position:"relative" }}>
                      <select className="ag-select" value={subject}
                        onChange={e => { setSubject(e.target.value); setTopic(TOPICS[e.target.value][0]); }}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-soft)", pointerEvents:"none", fontSize:10 }}>▾</span>
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label style={{ display:"block", fontSize:10, fontWeight:700, color:"var(--text-soft)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:7 }}>Topic</label>
                    <div style={{ position:"relative" }}>
                      <select className="ag-select" value={topic} onChange={e => setTopic(e.target.value)}>
                        {(TOPICS[subject]||[]).map(t => <option key={t}>{t}</option>)}
                      </select>
                      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-soft)", pointerEvents:"none", fontSize:10 }}>▾</span>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label style={{ display:"block", fontSize:10, fontWeight:700, color:"var(--text-soft)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:7 }}>Question Type</label>
                    <div style={{ position:"relative" }}>
                      <select className="ag-select" value={type} onChange={e => setType(e.target.value)}>
                        {TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-soft)", pointerEvents:"none", fontSize:10 }}>▾</span>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label style={{ display:"block", fontSize:10, fontWeight:700, color:"var(--text-soft)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:9 }}>Difficulty</label>
                    <div style={{ display:"flex", gap:8 }}>
                      {DIFFS.map(d => (
                        <button key={d} className={`ag-diff-btn ${diff===d?"selected":""}`} onClick={() => setDiff(d)}>{d}</button>
                      ))}
                    </div>
                  </div>

                  {/* Count */}
                  <div>
                    <label style={{ display:"block", fontSize:10, fontWeight:700, color:"var(--text-soft)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:9 }}>
                      Number of Questions
                    </label>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <input type="number" className="ag-num-input" min={1} max={20}
                        value={count} onChange={e => setCount(Math.min(20,Math.max(1,+e.target.value)))} />
                      <div style={{ flex:1, height:4, background:"rgba(232,164,184,0.15)", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(count/20)*100}%`, background:"linear-gradient(90deg,var(--pink),var(--mauve))", borderRadius:2, transition:"width 0.3s" }} />
                      </div>
                      <span style={{ fontSize:11, color:"var(--text-soft)", fontFamily:"'JetBrains Mono',monospace", width:32 }}>/{20}</span>
                    </div>
                  </div>

                  <button className="gl-btn gl-btn-primary" style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:14, marginTop:4 }}
                    onClick={generate} disabled={generating}>
                    {generating ? "Generating..." : "Generate Assessment"}
                  </button>
                </div>
              </div>

              {/* Info card */}
              <div className="ag-form-section gl-fade-up d2" style={{ padding:20 }}>
                <div className="gl-section-title">Current Selection</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { label:"Subject", val:subject },
                    { label:"Topic",   val:topic },
                    { label:"Type",    val:type },
                    { label:"Level",   val:diff },
                    { label:"Count",   val:`${count} questions` },
                  ].map(r => (
                    <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid rgba(232,164,184,0.12)" }}>
                      <span style={{ fontSize:11, color:"var(--text-soft)" }}>{r.label}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Output */}
            <div>
              {!generating && !questions && (
                <div className="gl-card gl-fade-up d1" style={{ padding:60, textAlign:"center" }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:"rgba(232,164,184,0.15)", border:"1px solid rgba(232,164,184,0.3)", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:"var(--pink)", opacity:0.5 }} />
                  </div>
                  <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontStyle:"italic", color:"var(--text-mid)", marginBottom:8 }}>
                    Ready to generate
                  </div>
                  <p style={{ fontSize:13, color:"var(--text-soft)" }}>Configure your settings and click Generate</p>
                </div>
              )}

              {generating && (
                <div className="gl-card" style={{ padding:"60px 24px" }}>
                  <div className="ag-generating">
                    <div className="ag-spinner" />
                    <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontStyle:"italic", color:"var(--text-mid)" }}>
                      Crafting your questions...
                    </div>
                    <p style={{ fontSize:12, color:"var(--text-soft)" }}>{topic} · {type} · {diff}</p>
                  </div>
                </div>
              )}

              {questions && !generating && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {/* Action bar */}
                  <div className="gl-fade-up d1" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                    <div>
                      <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontStyle:"italic", color:"var(--text)" }}>
                        {questions.length} questions generated
                      </span>
                      <span style={{ fontSize:12, color:"var(--text-soft)", marginLeft:10 }}>{subject} · {topic}</span>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="gl-btn gl-btn-ghost gl-btn-sm" onClick={generate}>Regenerate</button>
                      <button className="gl-btn gl-btn-primary gl-btn-sm" onClick={handleShare}>
                        {shared ? "Shared!" : "Share with Class"}
                      </button>
                    </div>
                  </div>

                  {questions.map((q,i) => (
                    <div key={i} className={`ag-question gl-fade-up d${Math.min(i+2,6)}`}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
                        <div style={{ width:28, height:28, borderRadius:9, background:"rgba(232,164,184,0.2)", border:"1px solid rgba(232,164,184,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"var(--pink-deep)", flexShrink:0 }}>
                          {i+1}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", lineHeight:1.6 }}>{q.q}</p>
                          <span className="gl-pill" style={{ marginTop:6, fontSize:9 }}>{q.type}</span>
                        </div>
                        <button className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => toggleReveal(i)}
                          style={{ fontSize:10, flexShrink:0 }}>
                          {revealed[i] ? "Hide Answer" : "Show Answer"}
                        </button>
                      </div>

                      {q.opts && (
                        <div>
                          {q.opts.map((opt,j) => (
                            <div key={j} className={`ag-opt ${revealed[i] && j===q.ans?"correct":""}`}>
                              <div className="ag-opt-letter">{String.fromCharCode(65+j)}</div>
                              <span>{opt}</span>
                              {revealed[i] && j===q.ans && <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:"#4a7a64" }}>Correct</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
