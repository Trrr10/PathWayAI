/**
 * Analytics.jsx — PathwayAI Teacher Analytics
 * Glassmorphism soft pink calm aesthetic
 */
import { useState } from "react";
import { GLASS_CSS, scoreTheme, AVATAR_GRADIENTS } from "./glassTheme";

const STUDENTS = [
  { name:"Rahul K.",  avatar:"R", scores:{ Mathematics:45, Science:72, History:68, English:61, Geography:55 }, streak:5,  sessions:8  },
  { name:"Priya M.",  avatar:"P", scores:{ Mathematics:88, Science:79, History:91, English:94, Geography:82 }, streak:14, sessions:21 },
  { name:"Arjun T.",  avatar:"A", scores:{ Mathematics:62, Science:55, History:48, English:52, Geography:49 }, streak:2,  sessions:5  },
  { name:"Meera S.",  avatar:"M", scores:{ Mathematics:73, Science:81, History:76, English:88, Geography:71 }, streak:8,  sessions:14 },
  { name:"Raj P.",    avatar:"R", scores:{ Mathematics:91, Science:88, History:82, English:79, Geography:85 }, streak:21, sessions:28 },
  { name:"Sunita D.", avatar:"S", scores:{ Mathematics:34, Science:41, History:52, English:38, Geography:44 }, streak:0,  sessions:3  },
  { name:"Dev R.",    avatar:"D", scores:{ Mathematics:67, Science:63, History:71, English:58, Geography:60 }, streak:4,  sessions:9  },
  { name:"Aisha K.",  avatar:"A", scores:{ Mathematics:79, Science:84, History:77, English:92, Geography:80 }, streak:11, sessions:17 },
];

const SUBJECTS = ["Mathematics","Science","History","English","Geography"];
const WEEKS    = ["W1","W2","W3","W4","W5","W6"];
const TREND    = {
  Mathematics:[58,61,63,60,65,68],
  Science:    [65,67,70,69,72,74],
  History:    [60,63,62,65,67,70],
  English:    [70,72,71,74,75,76],
  Geography:  [55,58,60,59,62,64],
};

const SUBJECT_COLORS = {
  Mathematics: "#c9748e",
  Science:     "#9b8ed4",
  History:     "#7aa8c8",
  English:     "#6a9a88",
  Geography:   "#c49878",
};

function avg(scores) {
  const v = Object.values(scores);
  return Math.round(v.reduce((a,b)=>a+b,0)/v.length);
}
function subAvg(sub) {
  return Math.round(STUDENTS.reduce((a,s)=>a+s.scores[sub],0)/STUDENTS.length);
}

function LineChart({ datasets, labels }) {
  const W=480, H=130, PX=32, PY=16;
  const allVals = datasets.flatMap(d=>d.data);
  const mn=Math.min(...allVals)-4, mx=Math.max(...allVals)+4;
  const xStep=(W-PX*2)/(labels.length-1);
  const yScale=(H-PY*2)/(mx-mn);
  const path = data => data.map((v,i)=>`${i===0?"M":"L"}${PX+i*xStep},${H-PY-(v-mn)*yScale}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      {/* Grid lines */}
      {[0,0.25,0.5,0.75,1].map((t,i) => (
        <line key={i} x1={PX} x2={W-PX} y1={PY+t*(H-PY*2)} y2={PY+t*(H-PY*2)}
          stroke="rgba(232,164,184,0.15)" strokeWidth="1" />
      ))}
      {datasets.map((ds,di) => (
        <g key={di}>
          <path d={path(ds.data)} fill="none" stroke={ds.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
          {ds.data.map((v,i) => (
            <circle key={i} cx={PX+i*xStep} cy={H-PY-(v-mn)*yScale} r="3" fill={ds.color} opacity="0.9"/>
          ))}
        </g>
      ))}
      {labels.map((l,i) => (
        <text key={i} x={PX+i*xStep} y={H+14} textAnchor="middle" fontSize="9"
          fill="rgba(122,90,104,0.6)" fontFamily="'JetBrains Mono',monospace">{l}</text>
      ))}
    </svg>
  );
}

function BarChart({ data, labels, colors }) {
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80 }}>
      {data.map((v,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:10, fontWeight:700, color:colors[i], fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
          <div style={{ width:"100%", borderRadius:"4px 4px 0 0", background:colors[i], opacity:0.65, height:`${(v/max)*68}px`, minHeight:6, transition:"height 1s cubic-bezier(.16,1,.3,1)" }}/>
          <span style={{ fontSize:9, color:"var(--text-soft)", textAlign:"center", lineHeight:1.2 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [tab, setTab] = useState("overview");
  const [selSubject, setSelSubject] = useState("Mathematics");

  const sorted     = [...STUDENTS].sort((a,b) => avg(b.scores)-avg(a.scores));
  const atRisk     = STUDENTS.filter(s => avg(s.scores) < 60 || s.streak === 0);
  const overallAvg = Math.round(STUDENTS.reduce((a,s)=>a+avg(s.scores),0)/STUDENTS.length);

  const lineDatasets = SUBJECTS.map(sub => ({ label:sub, color:SUBJECT_COLORS[sub], data:TREND[sub] }));

  return (
    <>
      <style>{GLASS_CSS}</style>
      <div className="gl-root">
        <div className="gl-orb" style={{ width:350, height:350, background:"rgba(197,184,232,0.16)", top:-80, right:0 }} />
        <div className="gl-orb" style={{ width:280, height:280, background:"rgba(232,164,184,0.14)", bottom:0, left:"-5%" }} />

        <div className="gl-content" style={{ maxWidth:960, margin:"0 auto", padding:"36px 28px 80px" }}>

          {/* Header */}
          <div className="gl-fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:32 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-soft)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Class XII · Section A</div>
              <h1 className="gl-page-title">Class Analytics</h1>
              <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:6 }}>28 students · Real-time performance data</p>
            </div>
            <div className="gl-tabs">
              {["overview","subjects","students"].map(t => (
                <button key={t} className={`gl-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* Top stats */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }} className="gl-fade-up d1">
                {[
                  { label:"Class Average", val:`${overallAvg}%`, color:"#c9748e" },
                  { label:"Top Scorer",    val:sorted[0].name.split(" ")[0], color:"#6a9a88" },
                  { label:"At Risk",       val:atRisk.length, color:"#c04040" },
                  { label:"Avg Sessions",  val:Math.round(STUDENTS.reduce((a,s)=>a+s.sessions,0)/STUDENTS.length), color:"#7b68bb" },
                ].map(s => (
                  <div key={s.label} className="gl-stat">
                    <div style={{ fontSize:11, fontWeight:600, color:"var(--text-soft)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:"'Instrument Serif',serif", fontStyle:"italic" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Line chart */}
              <div className="gl-card gl-fade-up d2" style={{ padding:26 }}>
                <div className="gl-section-title">Score Trends (6 Weeks)</div>
                <LineChart datasets={lineDatasets} labels={WEEKS} />
                <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginTop:16 }}>
                  {SUBJECTS.map(sub => (
                    <div key={sub} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:20, height:3, borderRadius:2, background:SUBJECT_COLORS[sub] }} />
                      <span style={{ fontSize:11, color:"var(--text-soft)" }}>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject bars */}
              <div className="gl-card gl-fade-up d3" style={{ padding:26 }}>
                <div className="gl-section-title">Subject Averages</div>
                <BarChart
                  data={SUBJECTS.map(s => subAvg(s))}
                  labels={SUBJECTS}
                  colors={SUBJECTS.map(s => SUBJECT_COLORS[s])}
                />
              </div>

              {/* At risk */}
              {atRisk.length > 0 && (
                <div className="gl-card gl-fade-up d4" style={{ padding:24 }}>
                  <div className="gl-section-title">Students Needing Attention</div>
                  {atRisk.map((s,i) => (
                    <div key={i} className="gl-row">
                      <div className="gl-avatar" style={{ width:36, height:36, borderRadius:10, background:AVATAR_GRADIENTS[i%AVATAR_GRADIENTS.length], fontSize:13 }}>{s.avatar}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{s.name}</div>
                        <div style={{ fontSize:11, color:"var(--text-soft)" }}>
                          {s.streak===0?"No active streak · ":""}Avg: {avg(s.scores)}%
                        </div>
                      </div>
                      <span className="gl-pill gl-pill-err" style={{ fontSize:10 }}>{avg(s.scores) < 50 ? "Critical" : "At Risk"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subjects */}
          {tab === "subjects" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }} className="gl-fade-up d1">
                {SUBJECTS.map(sub => (
                  <button key={sub} className={`gl-btn ${selSubject===sub?"gl-btn-primary":"gl-btn-ghost"}`}
                    style={{ fontSize:12, padding:"8px 18px" }}
                    onClick={() => setSelSubject(sub)}>
                    {sub}
                  </button>
                ))}
              </div>

              <div className="gl-card gl-fade-up d2" style={{ padding:26 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:SUBJECT_COLORS[selSubject], boxShadow:`0 0 12px ${SUBJECT_COLORS[selSubject]}` }} />
                  <div className="gl-section-title" style={{ marginBottom:0 }}>{selSubject} — Trend</div>
                  <div style={{ marginLeft:"auto", fontSize:24, fontWeight:700, color:SUBJECT_COLORS[selSubject], fontFamily:"'Instrument Serif',serif", fontStyle:"italic" }}>
                    {subAvg(selSubject)}% avg
                  </div>
                </div>
                <LineChart datasets={[{ label:selSubject, color:SUBJECT_COLORS[selSubject], data:TREND[selSubject] }]} labels={WEEKS} />
              </div>

              <div className="gl-card gl-fade-up d3">
                <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(232,164,184,0.2)" }}>
                  <div className="gl-section-title" style={{ marginBottom:0 }}>{selSubject} — Student Breakdown</div>
                </div>
                {[...STUDENTS].sort((a,b)=>b.scores[selSubject]-a.scores[selSubject]).map((s,i) => {
                  const val = s.scores[selSubject];
                  const c = scoreTheme(val);
                  return (
                    <div key={i} className="gl-row" style={{ padding:"14px 22px" }}>
                      <div className="gl-avatar" style={{ width:34, height:34, borderRadius:10, background:AVATAR_GRADIENTS[i%AVATAR_GRADIENTS.length], fontSize:12 }}>{s.avatar}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:4 }}>{s.name}</div>
                        <div className="gl-prog-track">
                          <div className="gl-prog-fill" style={{ width:`${val}%`, background:`linear-gradient(90deg,${c.text}44,${c.text})` }} />
                        </div>
                      </div>
                      <span className="gl-score mono" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}`, marginLeft:12 }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Students */}
          {tab === "students" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {sorted.map((s, i) => (
                <div key={i} className={`gl-card gl-fade-up d${Math.min(i+1,6)}`} style={{ padding:22 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                    <div style={{ position:"relative" }}>
                      <div className="gl-avatar" style={{ width:46, height:46, borderRadius:13, background:AVATAR_GRADIENTS[i%AVATAR_GRADIENTS.length], fontSize:16 }}>{s.avatar}</div>
                      {i < 3 && (
                        <div style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:["#c9748e","#9b8ed4","#7aa8c8"][i], display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:"white" }}>
                          {i+1}
                        </div>
                      )}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:3 }}>{s.name}</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <span className="gl-pill" style={{ fontSize:10 }}>Avg: {avg(s.scores)}%</span>
                        <span className={`gl-pill ${s.streak>7?"gl-pill-ok":"gl-pill-warn"}`} style={{ fontSize:10 }}>{s.streak}d streak</span>
                        <span className="gl-pill gl-pill-mauve" style={{ fontSize:10 }}>{s.sessions} sessions</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                    {SUBJECTS.map(sub => {
                      const val = s.scores[sub];
                      const c = scoreTheme(val);
                      return (
                        <div key={sub} style={{ textAlign:"center" }}>
                          <div style={{ fontSize:9, color:"var(--text-soft)", marginBottom:5, fontWeight:600 }}>{sub.slice(0,4)}</div>
                          <div className="gl-prog-track" style={{ marginBottom:5 }}>
                            <div className="gl-prog-fill" style={{ width:`${val}%`, background:`linear-gradient(90deg,${c.text}44,${c.text})` }} />
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, color:c.text, fontFamily:"'JetBrains Mono',monospace" }}>{val}</span>
                        </div>
                      );
                    })}
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
