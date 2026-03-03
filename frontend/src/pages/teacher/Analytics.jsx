/**
 * Analytics.jsx — PathwayAI Teacher Analytics
 * Deep-dive class performance: trends, subject breakdown, student leaderboard
 * src/pages/teacher/Analytics.jsx
 */

import { useState } from "react";
import { useApp } from "../../context/AppContext";

const STUDENTS = [
  { name:"Rahul K.",  avatar:"R", grad:"from-sky-500 to-blue-600",     scores:{ Mathematics:45, Science:72, History:68, English:61, Geography:55 }, streak:5,  sessions:8  },
  { name:"Priya M.",  avatar:"P", grad:"from-teal-500 to-cyan-600",    scores:{ Mathematics:88, Science:79, History:91, English:94, Geography:82 }, streak:14, sessions:21 },
  { name:"Arjun T.",  avatar:"A", grad:"from-violet-500 to-purple-600",scores:{ Mathematics:62, Science:55, History:48, English:52, Geography:49 }, streak:2,  sessions:5  },
  { name:"Meera S.",  avatar:"M", grad:"from-amber-500 to-orange-500", scores:{ Mathematics:73, Science:81, History:76, English:88, Geography:71 }, streak:8,  sessions:14 },
  { name:"Raj P.",    avatar:"R", grad:"from-green-500 to-emerald-600",scores:{ Mathematics:91, Science:88, History:82, English:79, Geography:85 }, streak:21, sessions:28 },
  { name:"Sunita D.", avatar:"S", grad:"from-red-500 to-rose-600",     scores:{ Mathematics:34, Science:41, History:52, English:38, Geography:44 }, streak:0,  sessions:3  },
  { name:"Dev R.",    avatar:"D", grad:"from-indigo-500 to-blue-600",  scores:{ Mathematics:67, Science:63, History:71, English:58, Geography:60 }, streak:4,  sessions:9  },
  { name:"Aisha K.",  avatar:"A", grad:"from-pink-500 to-rose-500",    scores:{ Mathematics:79, Science:84, History:77, English:92, Geography:80 }, streak:11, sessions:17 },
];

const SUBJECTS = ["Mathematics","Science","History","English","Geography"];
const WEEKS    = ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"];
const TREND_DATA = {
  Mathematics: [58,61,63,60,65,68],
  Science:     [65,67,70,69,72,74],
  History:     [60,63,62,65,67,70],
  English:     [70,72,71,74,75,76],
  Geography:   [55,58,60,59,62,64],
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
.an-wrap { min-height:100vh; font-family:'DM Sans',sans-serif; }
.an-wrap.dark  { background:#070F1C; color:#EDE8DF; }
.an-wrap.light { background:#F4F6FA; color:#111827; }

.an-card {
  border-radius:20px;
  transition:border-color .25s, box-shadow .25s;
}
.dark  .an-card { background:rgba(11,22,42,.97); border:1px solid rgba(255,255,255,.07); }
.light .an-card { background:#fff; border:1px solid #E5E7EB; box-shadow:0 2px 12px rgba(0,0,0,.05); }

.an-tab { padding:8px 18px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; border:none; font-family:'DM Sans',sans-serif; transition:all .2s; }
.dark  .an-tab        { background:transparent; color:#3D5068; }
.light .an-tab        { background:transparent; color:#9CA3AF; }
.dark  .an-tab.active { background:rgba(139,92,246,.14); color:#A78BFA; }
.light .an-tab.active { background:rgba(139,92,246,.1);  color:#7C3AED; }

.an-stat {
  border-radius:16px; padding:20px; text-align:center;
  transition:transform .3s, box-shadow .3s;
}
.an-stat:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.12); }
.dark  .an-stat { background:rgba(11,22,42,.9); border:1px solid rgba(255,255,255,.07); }
.light .an-stat { background:#fff; border:1px solid #E5E7EB; }

.an-bar-track { height:8px; border-radius:4px; overflow:hidden; }
.dark  .an-bar-track { background:rgba(255,255,255,.06); }
.light .an-bar-track { background:#F1F5F9; }
.an-bar-fill  { height:100%; border-radius:4px; transition:width 1.2s cubic-bezier(.16,1,.3,1); }

.an-row {
  display:flex; align-items:center; gap:14px; padding:14px 18px;
  border-radius:14px; margin-bottom:6px; cursor:default;
  transition:background .2s;
}
.dark  .an-row { border:1px solid rgba(255,255,255,.05); }
.light .an-row { border:1px solid #F1F5F9; }
.dark  .an-row:hover { background:rgba(255,255,255,.03); }
.light .an-row:hover { background:#F9FAFB; }

.an-chip {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;
}

@keyframes an-fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
.an-fade-up { animation:an-fade-up .5s cubic-bezier(.16,1,.3,1) both; }
.s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}.s4{animation-delay:.2s}.s5{animation-delay:.25s}
`;

function avg(scores) {
  const v = Object.values(scores);
  return Math.round(v.reduce((a,b)=>a+b,0)/v.length);
}

function subjectAvg(sub) {
  return Math.round(STUDENTS.reduce((a,s)=>a+s.scores[sub],0)/STUDENTS.length);
}

function scoreColor(v) {
  if (v < 50) return "#EF4444";
  if (v < 65) return "#F97316";
  if (v < 78) return "#EAB308";
  if (v < 88) return "#22C55E";
  return "#38BDF8";
}

// Mini bar chart component
function BarChart({ data, labels, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
      {data.map((v,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:10, fontWeight:700, color }}>{v}</span>
          <div style={{ width:"100%", borderRadius:4, background:color, opacity:.7+(i/data.length)*.3, height:`${(v/max)*100}%`, minHeight:8, transition:"height 1s cubic-bezier(.16,1,.3,1)" }}/>
          <span style={{ fontSize:9, color:"#6B7280", whiteSpace:"nowrap" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Line chart SVG
function LineChart({ datasets, labels, dark }) {
  const W=460, H=120, PAD=20;
  const allVals = datasets.flatMap(d=>d.data);
  const min=Math.min(...allVals)-5, max=Math.max(...allVals)+5;
  const xStep=(W-PAD*2)/(labels.length-1);
  const yScale=(H-PAD*2)/(max-min);

  const path = (data) => data.map((v,i)=>`${i===0?"M":"L"}${PAD+i*xStep},${H-PAD-(v-min)*yScale}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      {datasets.map((ds,di) => (
        <g key={di}>
          <path d={path(ds.data)} fill="none" stroke={ds.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={.85}/>
          {ds.data.map((v,i) => (
            <circle key={i} cx={PAD+i*xStep} cy={H-PAD-(v-min)*yScale} r="3.5" fill={ds.color}/>
          ))}
        </g>
      ))}
      {labels.map((l,i) => (
        <text key={i} x={PAD+i*xStep} y={H+4} textAnchor="middle" fontSize="9" fill={dark?"#3D5068":"#9CA3AF"}>{l}</text>
      ))}
    </svg>
  );
}

export default function Analytics() {
  const { dark } = useApp();
  const theme = dark ? "dark" : "light";
  const [tab, setTab] = useState("overview");
  const [selSubject, setSelSubject] = useState("Mathematics");

  const M = dark ? "#4B5568" : "#9CA3AF";
  const T = dark ? "#EDE8DF" : "#111827";

  const sorted    = [...STUDENTS].sort((a,b) => avg(b.scores)-avg(a.scores));
  const atRisk    = STUDENTS.filter(s => avg(s.scores) < 60 || s.streak === 0);
  const overallAvg= Math.round(STUDENTS.reduce((a,s)=>a+avg(s.scores),0)/STUDENTS.length);

  const lineDatasets = SUBJECTS.map(sub => ({
    label: sub, color: scoreColor(subjectAvg(sub)), data: TREND_DATA[sub]
  }));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
     
        <div className={`an-wrap ${theme}`}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"28px 24px 80px" }}>

            {/* Header */}
            <div className="an-fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:26 }}>
              <div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:4, color:T }}>📊 Class Analytics</h1>
                <p style={{ fontSize:13, color:M }}>Class XII · Section A · 28 students · Real-time performance data</p>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {["overview","subjects","students"].map(t => (
                  <button key={t} className={`an-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* ── OVERVIEW ── */}
            {tab==="overview" && (
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

                {/* Stat pills */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
                  {[
                    { val:`${overallAvg}%`,         label:"Class Average",    icon:"📈", color:"#38BDF8" },
                    { val:`${atRisk.length}`,         label:"At Risk",          icon:"🚨", color:"#EF4444" },
                    { val:`${STUDENTS.filter(s=>s.streak>=7).length}`, label:"Active Streaks", icon:"🔥", color:"#F59E0B" },
                    { val:"3",                        label:"Assessments",      icon:"📋", color:"#22C55E" },
                    { val:"86%",                      label:"Submission Rate",  icon:"✅", color:"#8B5CF6" },
                  ].map((s,i) => (
                    <div key={s.label} className={`an-stat an-fade-up s${i+1}`}>
                      <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:s.color, lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:T, marginTop:4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* 6-week trend */}
                <div className="an-card an-fade-up s2" style={{ padding:24 }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".06em", textTransform:"uppercase", color:M, marginBottom:6 }}>6-Week Score Trend</h3>
                  <p style={{ fontSize:12, color:M, marginBottom:16 }}>Average score per subject across the last 6 weeks</p>
                  <LineChart datasets={lineDatasets} labels={WEEKS} dark={dark}/>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginTop:14 }}>
                    {SUBJECTS.map(sub => (
                      <div key={sub} style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:10, height:10, borderRadius:2, background:scoreColor(subjectAvg(sub)) }}/>
                        <span style={{ fontSize:11, color:M, fontWeight:600 }}>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject averages */}
                <div className="an-card an-fade-up s3" style={{ padding:24 }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".06em", textTransform:"uppercase", color:M, marginBottom:18 }}>Subject Averages</h3>
                  {SUBJECTS.map(sub => {
                    const a = subjectAvg(sub);
                    const c = scoreColor(a);
                    return (
                      <div key={sub} style={{ marginBottom:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13 }}>
                          <span style={{ fontWeight:600, color:T }}>{sub}</span>
                          <span style={{ fontWeight:800, color:c }}>{a}%</span>
                        </div>
                        <div className="an-bar-track">
                          <div className="an-bar-fill" style={{ width:`${a}%`, background:c }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* At risk */}
                {atRisk.length > 0 && (
                  <div className="an-card an-fade-up s4" style={{ padding:22 }}>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, letterSpacing:".06em", textTransform:"uppercase", color:"#EF4444", marginBottom:14 }}>
                      ⚠️ At-Risk Students ({atRisk.length})
                    </h3>
                    {atRisk.map(s => (
                      <div key={s.name} className="an-row">
                        <div style={{ width:36,height:36,borderRadius:11,background:`linear-gradient(135deg,#EF4444,#F97316)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"white",flexShrink:0 }}>{s.avatar}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:T }}>{s.name}</div>
                          <div style={{ fontSize:11, color:M }}>Avg: {avg(s.scores)}% · Streak: {s.streak} days</div>
                        </div>
                        <span className="an-chip" style={{ background:"rgba(239,68,68,.12)", color:"#EF4444" }}>
                          {s.streak===0 ? "Inactive" : "Low Scores"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SUBJECTS ── */}
            {tab==="subjects" && (
              <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:18, alignItems:"start" }}>
                <div className="an-card" style={{ padding:16 }}>
                  <p style={{ fontSize:11, fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:M, marginBottom:10 }}>Select Subject</p>
                  {SUBJECTS.map(sub => {
                    const a = subjectAvg(sub);
                    return (
                      <button key={sub} onClick={()=>setSelSubject(sub)}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 12px", borderRadius:11, border:"none", cursor:"pointer", marginBottom:3, transition:"all .2s",
                          background: selSubject===sub ? "rgba(139,92,246,.14)" : "transparent",
                          color: selSubject===sub ? "#A78BFA" : M,
                        }}>
                        <span style={{ fontSize:13, fontWeight:600 }}>{sub}</span>
                        <span style={{ fontSize:12, fontWeight:800, color:scoreColor(a) }}>{a}%</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div className="an-card an-fade-up" style={{ padding:24 }}>
                    <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:T, marginBottom:4 }}>{selSubject}</h2>
                    <p style={{ fontSize:12, color:M, marginBottom:20 }}>Class average: <span style={{ color:scoreColor(subjectAvg(selSubject)), fontWeight:700 }}>{subjectAvg(selSubject)}%</span></p>
                    <BarChart data={TREND_DATA[selSubject]} labels={WEEKS} color={scoreColor(subjectAvg(selSubject))}/>
                  </div>

                  <div className="an-card an-fade-up s2" style={{ padding:24 }}>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800, letterSpacing:".08em", textTransform:"uppercase", color:M, marginBottom:14 }}>Student Breakdown</h3>
                    {[...STUDENTS].sort((a,b)=>b.scores[selSubject]-a.scores[selSubject]).map(s => {
                      const sc = s.scores[selSubject];
                      const c  = scoreColor(sc);
                      return (
                        <div key={s.name} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                          <div style={{ width:28,height:28,borderRadius:9,background:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0,opacity:.85 }}>{s.avatar}</div>
                          <span style={{ fontSize:13, fontWeight:600, color:T, width:90, flexShrink:0 }}>{s.name}</span>
                          <div className="an-bar-track" style={{ flex:1 }}>
                            <div className="an-bar-fill" style={{ width:`${sc}%`, background:c }}/>
                          </div>
                          <span style={{ fontSize:13, fontWeight:800, color:c, width:36, textAlign:"right" }}>{sc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── STUDENTS ── */}
            {tab==="students" && (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div className="an-card an-fade-up" style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:12, color:M, fontWeight:600 }}>Sorted by average score · highest first</span>
                  <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                    {[["#EF4444","<60"],["#F97316","60–74"],["#22C55E","75–87"],["#38BDF8","88+"]].map(([c,l])=>(
                      <span key={l} style={{ fontSize:11, color:c, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ width:8,height:8,borderRadius:2,background:c,display:"inline-block" }}/>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                {sorted.map((s,i) => {
                  const a = avg(s.scores);
                  const c = scoreColor(a);
                  return (
                    <div key={s.name} className={`an-card an-fade-up`} style={{ padding:"18px 22px", animationDelay:`${i*.04}s` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:M, width:22 }}>#{i+1}</span>
                        <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${c}99,${c})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"white" }}>{s.avatar}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:T }}>{s.name}</div>
                          <div style={{ fontSize:11, color:M }}>🔥 {s.streak} day streak · {s.sessions} sessions</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:c, lineHeight:1 }}>{a}%</div>
                          <div style={{ fontSize:11, color:M }}>avg score</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {SUBJECTS.map(sub => {
                          const sc = s.scores[sub];
                          const sc_c = scoreColor(sc);
                          return (
                            <span key={sub} style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:`${sc_c}18`, color:sc_c, border:`1px solid ${sc_c}30` }}>
                              {sub.slice(0,3)}: {sc}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
  
    </>
  );
}