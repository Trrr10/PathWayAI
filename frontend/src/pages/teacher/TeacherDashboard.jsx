/**
 * TeacherDashboard.jsx — PathwayAI
 * Glassmorphism soft pink calm aesthetic
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GLASS_CSS, scoreTheme, AVATAR_GRADIENTS } from "./glassTheme";

const SUBJECTS = ["Mathematics","Science","History","English","Geography"];

const STUDENTS = [
  { name:"Rahul K.",  avatar:"R", scores:{ Mathematics:45, Science:72, History:68, English:61, Geography:55 }, streak:5,  sessions:8,  lastActive:"Today" },
  { name:"Priya M.",  avatar:"P", scores:{ Mathematics:88, Science:79, History:91, English:94, Geography:82 }, streak:14, sessions:21, lastActive:"Today" },
  { name:"Arjun T.",  avatar:"A", scores:{ Mathematics:62, Science:55, History:48, English:52, Geography:49 }, streak:2,  sessions:5,  lastActive:"2d ago" },
  { name:"Meera S.",  avatar:"M", scores:{ Mathematics:73, Science:81, History:76, English:88, Geography:71 }, streak:8,  sessions:14, lastActive:"Today" },
  { name:"Raj P.",    avatar:"R", scores:{ Mathematics:91, Science:88, History:82, English:79, Geography:85 }, streak:21, sessions:28, lastActive:"Today" },
  { name:"Sunita D.", avatar:"S", scores:{ Mathematics:34, Science:41, History:52, English:38, Geography:44 }, streak:0,  sessions:3,  lastActive:"5d ago" },
  { name:"Dev R.",    avatar:"D", scores:{ Mathematics:67, Science:63, History:71, English:58, Geography:60 }, streak:4,  sessions:9,  lastActive:"Yesterday" },
  { name:"Aisha K.",  avatar:"A", scores:{ Mathematics:79, Science:84, History:77, English:92, Geography:80 }, streak:11, sessions:17, lastActive:"Today" },
];

const ASSESSMENTS = [
  { title:"Ch.4 Quadratic Equations Quiz", subject:"Mathematics", date:"Nov 28", submitted:22, total:28, avgScore:68 },
  { title:"Newton's Laws — MCQ",            subject:"Science",     date:"Nov 25", submitted:26, total:28, avgScore:74 },
  { title:"World War II Essay",             subject:"History",     date:"Nov 22", submitted:20, total:28, avgScore:71 },
];

const UPCOMING = [
  { title:"Remedial: Algebra Basics", type:"Remedial",  students:"Rahul, Sunita, Arjun", time:"Today 3 PM" },
  { title:"Ch.5 Chemical Reactions",  type:"New Topic", students:"All students",          time:"Tomorrow 9 AM" },
  { title:"Mid-Term Revision",        type:"Revision",  students:"All students",          time:"Dec 5, 10 AM" },
];

function avgScore(s) {
  const v = Object.values(s.scores);
  return Math.round(v.reduce((a,b) => a+b,0)/v.length);
}

function classAvg(sub) {
  return Math.round(STUDENTS.reduce((a,s) => a+s.scores[sub],0)/STUDENTS.length);
}

function Sparkline({ vals, color }) {
  const max = Math.max(...vals), min = Math.min(...vals);
  const W = 60, H = 24, PAD = 2;
  const xStep = (W - PAD*2)/(vals.length-1);
  const yScale = (H - PAD*2) / Math.max(max - min, 1);
  const d = vals.map((v,i) => `${i===0?"M":"L"}${PAD+i*xStep},${H-PAD-(v-min)*yScale}`).join(" ");
  return (
    <svg width={W} height={H} style={{ overflow:"visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={PAD+(vals.length-1)*xStep} cy={H-PAD-(vals[vals.length-1]-min)*yScale} r="2.5" fill={color} />
    </svg>
  );
}

const EXTRA_CSS = `
.td-heatmap td, .td-heatmap th { white-space: nowrap; }
.td-heatmap tr:hover td { background: rgba(232,164,184,0.05); }
.td-row-expanded td { background: rgba(252,232,237,0.4) !important; }
.td-quick-card {
  background: rgba(255,248,252,0.65);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(232,164,184,0.22);
  border-radius: 18px; padding: 22px;
  cursor: pointer; transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(201,116,142,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
  text-align: left;
}
.td-quick-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(201,116,142,0.12), inset 0 1px 0 rgba(255,255,255,0.9); border-color: rgba(201,116,142,0.35); }
.td-quick-card:disabled { cursor: default; transform: none; }
`;

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [hlCol, setHlCol] = useState(null);

  const overallAvg  = Math.round(STUDENTS.reduce((a,s) => a+avgScore(s),0)/STUDENTS.length);
  const activeCount = STUDENTS.filter(s => s.streak >= 7).length;
  const atRisk      = STUDENTS.filter(s => Object.values(s.scores).some(v => v < 50) || s.streak === 0);

  const typeColor = type =>
    type === "Remedial" ? "gl-pill-err" :
    type === "New Topic" ? "gl-pill-lav" : "gl-pill-mauve";

  return (
    <>
      <style>{GLASS_CSS + EXTRA_CSS}</style>
      <div className="gl-root">
        {/* Background orbs */}
        <div className="gl-orb" style={{ width:400, height:400, background:"rgba(232,164,184,0.18)", top:-100, left:-100 }} />
        <div className="gl-orb" style={{ width:300, height:300, background:"rgba(197,184,232,0.14)", top:200, right:-80, animationDelay:"3s" }} />
        <div className="gl-orb" style={{ width:250, height:250, background:"rgba(168,197,184,0.12)", bottom:100, left:"40%", animationDelay:"6s" }} />

        <div className="gl-content" style={{ maxWidth:1100, margin:"0 auto", padding:"36px 28px 80px" }}>

          {/* Header */}
          <div className="gl-fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:32 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-soft)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>
                Good morning, Mrs. Deshpande
              </div>
              <h1 className="gl-page-title">Teacher Dashboard</h1>
              <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:6 }}>
                Class XII · Section A · Real-time overview
              </p>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button className="gl-btn gl-btn-primary" onClick={() => navigate("/teacher/assessment")}>
                New Assessment
              </button>
              <button className="gl-btn gl-btn-ghost" onClick={() => navigate("/teacher/analytics")}>
                Full Analytics
              </button>
              <button className="gl-btn gl-btn-ghost" onClick={() => navigate("/teacher/videocall")}>
                Video Call
              </button>
            </div>
          </div>

          {/* At-risk alert */}
          {atRisk.length > 0 && (
            <div className="gl-alert gl-fade-up d1" style={{ display:"flex", gap:16, marginBottom:24, alignItems:"flex-start" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:"rgba(220,100,100,0.12)", border:"1px solid rgba(220,100,100,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:15 }}>!</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#b04040", marginBottom:8 }}>
                  {atRisk.length} students need attention
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {atRisk.map(s => (
                    <span key={s.name} className="gl-pill gl-pill-err" style={{ fontSize:11 }}>
                      {s.name} · {s.streak === 0 ? "inactive" : "low scores"}
                    </span>
                  ))}
                </div>
              </div>
              <button className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => navigate("/teacher/analytics")}>
                Details
              </button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
            {[
              { label:"Class Average", val:`${overallAvg}%`, color:"#c9748e", spark:[58,62,65,61,68,70,overallAvg], style:"--top-color:#e8a4b8" },
              { label:"Active Streaks", val:`${activeCount}/${STUDENTS.length}`, color:"#9b8ed4", spark:[3,4,4,5,5,6,activeCount], style:"--top-color:#c5b8e8" },
              { label:"At Risk",        val:atRisk.length, color:"#c04040", spark:[5,4,4,4,3,3,atRisk.length], style:"--top-color:rgba(220,100,100,0.6)" },
              { label:"Assessments",    val:ASSESSMENTS.length, color:"#4a7a64", spark:[0,1,1,2,2,3,ASSESSMENTS.length], style:"--top-color:#a8c5b8" },
            ].map((s, i) => (
              <div key={s.label} className={`gl-stat gl-fade-up d${i+2}`} style={{ [s.style.split(":")[0].replace("--","")]: undefined }}>
                <style>{`.gl-stat-${i}::before{background:${s.color}!important}`}</style>
                <div className={`gl-stat gl-stat-${i}`} style={{ padding:0, background:"transparent", border:"none", boxShadow:"none" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"var(--text-soft)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{s.label}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:s.color, fontFamily:"'Instrument Serif',serif", fontStyle:"italic", marginBottom:10 }}>{s.val}</div>
                  <Sparkline vals={s.spark} color={s.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="gl-card gl-fade-up d3" style={{ marginBottom:24, overflow:"hidden" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid rgba(232,164,184,0.2)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <div>
                <div className="gl-section-title" style={{ marginBottom:4 }}>Struggle Score Heatmap</div>
                <p style={{ fontSize:12, color:"var(--text-soft)" }}>Click subject column to highlight · Click row to expand</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[["< 50","#c04040"],["50–64","#b87a1a"],["65–77","#8b5a7a"],["78–87","#4a7a64"],["88+","#6a5aaa"]].map(([l,c]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:c, opacity:0.7 }} />
                    <span style={{ fontSize:10, color:"var(--text-soft)", fontFamily:"'JetBrains Mono',monospace" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ overflowX:"auto" }}>
              <table className="td-heatmap" style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"rgba(252,232,237,0.3)" }}>
                    <th style={{ padding:"12px 20px", textAlign:"left", fontSize:10, fontWeight:700, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Student</th>
                    {SUBJECTS.map(sub => (
                      <th key={sub} onClick={() => setHlCol(hlCol === sub ? null : sub)}
                        style={{ padding:"12px 10px", textAlign:"center", fontSize:10, fontWeight:700, cursor:"pointer", userSelect:"none",
                          color: hlCol === sub ? "var(--pink-deep)" : "var(--text-soft)",
                          background: hlCol === sub ? "rgba(232,164,184,0.12)" : "transparent",
                          textTransform:"uppercase", letterSpacing:"0.08em", transition:"all 0.2s" }}>
                        {sub.slice(0,4)}{hlCol===sub?" ▾":""}
                      </th>
                    ))}
                    {["Avg","Streak","Active"].map(h => (
                      <th key={h} style={{ padding:"12px 10px", textAlign:"center", fontSize:10, fontWeight:700, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{h}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {/* Class avg row */}
                  <tr style={{ background:"rgba(252,232,237,0.25)", borderBottom:"1px solid rgba(232,164,184,0.15)" }}>
                    <td style={{ padding:"10px 20px", fontSize:10, fontWeight:800, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Class Avg</td>
                    {SUBJECTS.map(sub => {
                      const a = classAvg(sub);
                      const c = scoreTheme(a);
                      return (
                        <td key={sub} style={{ padding:"10px", textAlign:"center" }}>
                          <span className="gl-score" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}` }}>{a}</span>
                        </td>
                      );
                    })}
                    <td colSpan={4} />
                  </tr>

                  {STUDENTS.map((s, idx) => {
                    const avg = avgScore(s);
                    const isAlert = atRisk.includes(s);
                    const isExp = expanded === s.name;
                    return (
                      <>
                        <tr key={s.name} onClick={() => setExpanded(isExp ? null : s.name)}
                          style={{ borderBottom:"1px solid rgba(232,164,184,0.12)", cursor:"pointer",
                            background: isAlert ? "rgba(220,100,100,0.04)" : "transparent",
                            transition:"background 0.2s" }}>
                          <td style={{ padding:"12px 20px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div className="gl-avatar" style={{ width:34, height:34, borderRadius:10, background:AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length], fontSize:13 }}>
                                {s.avatar}
                              </div>
                              <div>
                                <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{s.name}</div>
                                <div style={{ fontSize:11, color:"var(--text-soft)" }}>{s.sessions} sessions</div>
                              </div>
                            </div>
                          </td>
                          {SUBJECTS.map(sub => {
                            const val = s.scores[sub];
                            const c = scoreTheme(val);
                            return (
                              <td key={sub} style={{ padding:"12px 10px", textAlign:"center",
                                background: hlCol === sub ? "rgba(232,164,184,0.08)" : "transparent",
                                transition:"background 0.2s" }}>
                                <span className="gl-score" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}` }}>{val}</span>
                              </td>
                            );
                          })}
                          <td style={{ padding:"12px 10px", textAlign:"center" }}>
                            <span style={{ fontSize:13, fontWeight:700, color:scoreTheme(avg).text, fontFamily:"'JetBrains Mono',monospace" }}>{avg}</span>
                          </td>
                          <td style={{ padding:"12px 10px", textAlign:"center" }}>
                            <span style={{ fontSize:11, fontWeight:600,
                              color: s.streak === 0 ? "#c04040" : s.streak < 7 ? "#b87a1a" : "#4a7a64" }}>
                              {s.streak === 0 ? "—" : `${s.streak}d`}
                            </span>
                          </td>
                          <td style={{ padding:"12px 10px", textAlign:"center" }}>
                            <span style={{ fontSize:11, fontWeight:600, color: s.lastActive === "Today" ? "#4a7a64" : "var(--text-soft)" }}>{s.lastActive}</span>
                          </td>
                          <td style={{ padding:"12px 16px", textAlign:"right" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end" }}>
                              {isAlert && <span className="gl-pill gl-pill-err" style={{ fontSize:9 }}>Alert</span>}
                              <span style={{ fontSize:11, color:"var(--text-soft)" }}>{isExp ? "▲" : "▼"}</span>
                            </div>
                          </td>
                        </tr>
                        {isExp && (
                          <tr key={`${s.name}-exp`} className="td-row-expanded" style={{ borderBottom:"1px solid rgba(232,164,184,0.15)" }}>
                            <td colSpan={SUBJECTS.length + 5} style={{ padding:"16px 24px" }}>
                              <div style={{ display:"flex", flexWrap:"wrap", gap:24, alignItems:"flex-start" }}>
                                <div>
                                  <div style={{ fontSize:10, fontWeight:700, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Weakest Subjects</div>
                                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                                    {Object.entries(s.scores).sort(([,a],[,b]) => a-b).slice(0,3).map(([sub,val]) => {
                                      const c = scoreTheme(val);
                                      return <span key={sub} className="gl-pill" style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}`, fontSize:11 }}>{sub}: {val}</span>;
                                    })}
                                  </div>
                                </div>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontSize:10, fontWeight:700, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Recommended Action</div>
                                  <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.7 }}>
                                    {s.streak === 0 ? "Student inactive 5+ days — send a check-in today"
                                      : avg < 55 ? "Assign to peer mentor for remedial sessions this week"
                                      : avg < 70 ? "Share targeted revision material for their weakest subjects"
                                      : "On track — encourage consistency and offer optional challenges"}
                                  </p>
                                </div>
                                <button className="gl-btn gl-btn-ghost gl-btn-sm">Message Student</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom columns */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
            {/* Assessments */}
            <div className="gl-card gl-fade-up d4">
              <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(232,164,184,0.2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div className="gl-section-title" style={{ marginBottom:0 }}>Recent Assessments</div>
                <button className="gl-btn gl-btn-ghost gl-btn-sm" onClick={() => navigate("/teacher/assessment")}>New</button>
              </div>
              {ASSESSMENTS.map((a,i) => (
                <div key={i} className="gl-row" style={{ padding:"16px 22px" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:11, color:"var(--text-soft)", marginBottom:10 }}>{a.subject} · {a.date}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div className="gl-prog-track" style={{ flex:1 }}>
                        <div className="gl-prog-fill" style={{ width:`${(a.submitted/a.total)*100}%`, background:"linear-gradient(90deg,var(--pink),var(--mauve))" }} />
                      </div>
                      <span style={{ fontSize:10, color:"var(--text-soft)", fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{a.submitted}/{a.total}</span>
                    </div>
                  </div>
                  <span style={{ fontSize:16, fontWeight:700, color:scoreTheme(a.avgScore).text, fontFamily:"'Instrument Serif',serif", fontStyle:"italic", flexShrink:0 }}>{a.avgScore}%</span>
                </div>
              ))}
              <div style={{ padding:"12px 22px" }}>
                <button className="gl-btn gl-btn-ghost gl-btn-sm" style={{ width:"100%", justifyContent:"center" }} onClick={() => navigate("/teacher/assessment")}>
                  View all assessments
                </button>
              </div>
            </div>

            {/* Upcoming */}
            <div className="gl-card gl-fade-up d5">
              <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(232,164,184,0.2)" }}>
                <div className="gl-section-title" style={{ marginBottom:0 }}>Upcoming Sessions</div>
              </div>
              {UPCOMING.map((u,i) => (
                <div key={i} className="gl-row" style={{ padding:"16px 22px" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{u.title}</span>
                      <span className={`gl-pill ${typeColor(u.type)}`} style={{ fontSize:9 }}>{u.type}</span>
                    </div>
                    <div style={{ fontSize:11, color:"var(--text-soft)", marginBottom:3 }}>{u.students}</div>
                    <div style={{ fontSize:11, fontWeight:600, color: u.time.startsWith("Today") ? "var(--pink-deep)" : "var(--text-soft)" }}>{u.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }} className="gl-fade-up d6">
            {[
              { label:"Assessment Generator", desc:"AI-generated quizzes", path:"/teacher/assessment", color:"var(--pink-deep)" },
              { label:"Full Analytics",        desc:"Deep-dive performance",  path:"/teacher/analytics",  color:"#7b68bb" },
              { label:"Resource Library",      desc:"Upload & share files",   path:"/teacher/resources",  color:"#5a8a74" },
              { label:"28 Students",           desc:"Class XII · Section A",  path:null,                  color:"#b87a1a" },
            ].map(a => (
              <button key={a.label} className="td-quick-card" onClick={a.path ? () => navigate(a.path) : undefined} disabled={!a.path}>
                <div style={{ width:28, height:4, borderRadius:2, background:a.color, marginBottom:16, opacity:0.6 }} />
                <div style={{ fontSize:13, fontWeight:700, color:a.color, marginBottom:5 }}>{a.label}</div>
                <div style={{ fontSize:11, color:"var(--text-soft)" }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
