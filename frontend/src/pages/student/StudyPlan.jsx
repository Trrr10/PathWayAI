/**
 * StudyPlan.jsx — AI Weekly Study Roadmap (Visual Mindmap Edition)
 * src/pages/student/StudyPlan.jsx
 *
 * Strategy: Ask AI for plain structured text (no JSON at all),
 * parse it with simple string splitting, render as a visual flowchart/mindmap.
 * Zero JSON parse errors possible.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const BACKEND = "http://localhost:3001";

const SUBJECTS_LIST = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "History", "Geography", "Political Science", "Economics",
  "English", "Hindi", "Computer Science", "Coding / Programming",
  "General Knowledge", "Reasoning & Aptitude",
];

const GOALS = [
  { id: "board",       label: "Board Exams",        icon: "🎓" },
  { id: "jee",         label: "JEE / NEET",          icon: "⚗️" },
  { id: "competitive", label: "Competitive Exams",   icon: "🏆" },
  { id: "college",     label: "College Assignments",  icon: "📚" },
  { id: "skill",       label: "Skill Building",       icon: "⚡" },
  { id: "interview",   label: "Interview Prep",       icon: "💼" },
];

const HOURS_OPTIONS = ["1", "2", "3", "4", "5", "6+"];
const DAYS     = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DAY_SHORT = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
const DAY_EMOJI = ["🌅","📖","💡","🧠","🔥","⭐","😴"];

const PALETTES = [
  { bg:"#3B82F6", soft:"#EFF6FF", glow:"rgba(59,130,246,0.35)"  },
  { bg:"#8B5CF6", soft:"#F5F3FF", glow:"rgba(139,92,246,0.35)"  },
  { bg:"#10B981", soft:"#ECFDF5", glow:"rgba(16,185,129,0.35)"  },
  { bg:"#F59E0B", soft:"#FFFBEB", glow:"rgba(245,158,11,0.35)"  },
  { bg:"#EF4444", soft:"#FEF2F2", glow:"rgba(239,68,68,0.35)"   },
  { bg:"#EC4899", soft:"#FDF2F8", glow:"rgba(236,72,153,0.35)"  },
  { bg:"#06B6D4", soft:"#ECFEFF", glow:"rgba(6,182,212,0.35)"   },
  { bg:"#84CC16", soft:"#F7FEE7", glow:"rgba(132,204,22,0.35)"  },
];
const pal = (i) => PALETTES[i % PALETTES.length];

const YT_MAP = {
  "Mathematics":          "https://www.youtube.com/@khanacademy",
  "Physics":              "https://www.youtube.com/@PhysicsWallah",
  "Chemistry":            "https://www.youtube.com/@chemistrywallah7597",
  "Biology":              "https://www.youtube.com/@AmoebaSisters",
  "History":              "https://www.youtube.com/@unacademy",
  "Computer Science":     "https://www.youtube.com/@cs50",
  "Coding / Programming": "https://www.youtube.com/@CodeWithHarry",
  "English":              "https://www.youtube.com/@bbclearningenglish",
  "General Knowledge":    "https://www.youtube.com/@StudyIQEducation",
  "Reasoning & Aptitude": "https://www.youtube.com/@Adda247",
};

/* ──────────────────────────────────────────────
   PLAIN TEXT PARSER — no JSON, no parse errors
   Format the AI returns:
   TITLE: ...
   SUMMARY: ...
   GOAL: ...
   DAY: Monday
   SUBJECT: Math | HOURS: 2
   TOPIC: Quadratic Equations
   TASKS: Solve 20 problems, Read ch4, Watch video
   ...
   TIP: ...
   MILESTONE: ...
────────────────────────────────────────────── */
function parsePlan(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const plan  = { title:"", summary:"", weeklyGoal:"", days:{}, tips:[], milestones:[] };
  let curDay  = null;
  let curSess = null;

  const flush = () => {
    if (curSess && curDay) {
      if (!plan.days[curDay]) plan.days[curDay] = { sessions:[], isRest:false };
      plan.days[curDay].sessions.push(curSess);
      curSess = null;
    }
  };

  for (const line of lines) {
    if (line.startsWith("TITLE:"))     { plan.title      = line.slice(6).trim();  continue; }
    if (line.startsWith("SUMMARY:"))   { plan.summary     = line.slice(8).trim();  continue; }
    if (line.startsWith("GOAL:"))      { plan.weeklyGoal  = line.slice(5).trim();  continue; }
    if (line.startsWith("TIP:"))       { plan.tips.push(line.slice(4).trim());     continue; }
    if (line.startsWith("MILESTONE:")) { plan.milestones.push(line.slice(10).trim()); continue; }

    if (line.startsWith("DAY:")) {
      flush();
      curDay = line.slice(4).trim();
      if (!plan.days[curDay]) plan.days[curDay] = { sessions:[], isRest: curDay === "Sunday" };
      continue;
    }

    if (/^REST/i.test(line) && curDay) {
      plan.days[curDay].isRest = true;
      continue;
    }

    if (line.startsWith("SUBJECT:") && curDay) {
      flush();
      const hoursM = line.match(/HOURS:\s*([\d.]+)/i);
      const subj   = line.replace(/HOURS:[\d.\s]+/i,"").replace("SUBJECT:","").replace(/\|/g,"").trim();
      curSess = { subject: subj, hours: hoursM ? parseFloat(hoursM[1]) : 1, topic:"", tasks:[] };
      continue;
    }

    if (line.startsWith("TOPIC:") && curSess) {
      curSess.topic = line.slice(6).trim();
      continue;
    }

    if (line.startsWith("TASKS:") && curSess) {
      curSess.tasks = line.slice(6).split(",").map(x => x.trim()).filter(Boolean);
      continue;
    }
  }
  flush();

  // ensure all days exist
  for (const d of DAYS) {
    if (!plan.days[d]) plan.days[d] = { sessions:[], isRest: d === "Sunday" };
  }

  return plan;
}

/* ──────────────
   SESSION NODE
────────────── */
function SessionNode({ sess, subjIdx, dark }) {
  const [open, setOpen] = useState(false);
  const p = pal(subjIdx);
  return (
    <div onClick={() => setOpen(!open)} style={{
      cursor:"pointer", borderRadius:14, padding:"10px 13px",
      background: dark ? `${p.bg}18` : p.soft,
      border:`1.5px solid ${dark ? `${p.bg}45` : `${p.bg}35`}`,
      transition:"box-shadow 0.2s",
      boxShadow: open ? `0 4px 18px ${p.glow}` : "none",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:p.bg, flexShrink:0, boxShadow:`0 0 5px ${p.glow}` }} />
        <span style={{ fontSize:11, fontWeight:800, color:p.bg, fontFamily:"'Syne',sans-serif", letterSpacing:"0.05em", flex:1 }}>
          {sess.subject}
        </span>
        <span style={{ fontSize:10, color: dark?"#475569":"#94A3B8", fontWeight:600 }}>{sess.hours}h</span>
        <span style={{ fontSize:11, color: dark?"#334155":"#CBD5E1", transition:"transform 0.2s", display:"inline-block", transform: open?"rotate(180deg)":"none" }}>▾</span>
      </div>

      {sess.topic && (
        <p style={{ fontSize:13, fontWeight:700, color: dark?"#E2EEFF":"#1E293B", margin:"5px 0 0 14px", lineHeight:1.35 }}>
          {sess.topic}
        </p>
      )}

      {open && sess.tasks.length > 0 && (
        <div style={{ marginTop:8, paddingLeft:14, display:"flex", flexDirection:"column", gap:4 }}>
          {sess.tasks.map((tk, i) => (
            <div key={i} style={{ display:"flex", gap:5, alignItems:"flex-start" }}>
              <span style={{ color:p.bg, fontSize:9, marginTop:4, flexShrink:0 }}>◆</span>
              <span style={{ fontSize:12, color: dark?"#94A3B8":"#64748B", lineHeight:1.5 }}>{tk}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────
   DAY COLUMN
────────────── */
function DayCol({ day, data, di, dark, allSubjects }) {
  const isRest    = data.isRest || data.sessions.length === 0;
  const totalH    = data.sessions.reduce((s,x) => s+(x.hours||1), 0);
  const colPal    = pal(di);

  return (
    <div style={{ display:"flex", flexDirection:"column", width:210, flexShrink:0 }}>
      {/* Header */}
      <div style={{
        borderRadius:16, padding:"13px 10px", textAlign:"center", marginBottom:14,
        background: isRest
          ? (dark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.7)")
          : (dark ? `${colPal.bg}18` : colPal.soft),
        border:`2px solid ${isRest
          ? (dark?"rgba(71,85,105,0.3)":"rgba(203,213,225,0.5)")
          : `${colPal.bg}50`}`,
        position:"relative",
      }}>
        <div style={{ fontSize:22, marginBottom:3 }}>{DAY_EMOJI[di]}</div>
        <div style={{
          fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:900,
          letterSpacing:"0.12em", textTransform:"uppercase",
          color: isRest ? (dark?"#475569":"#94A3B8") : colPal.bg,
        }}>{DAY_SHORT[di]}</div>
        <div style={{ fontSize:10, color: dark?"#475569":"#94A3B8", marginTop:2, fontWeight:600 }}>
          {isRest ? "Rest Day" : `${totalH}h`}
        </div>
        {!isRest && (
          <div style={{
            position:"absolute", bottom:-7, left:"50%", transform:"translateX(-50%)",
            width:12, height:12, borderRadius:"50%",
            background:colPal.bg, boxShadow:`0 0 10px ${colPal.glow}`,
            border:`2px solid ${dark?"#070E1C":"#F0F4FF"}`,
          }} />
        )}
      </div>

      {/* Sessions */}
      {!isRest && data.sessions.length > 0 ? (
        <div style={{ position:"relative", paddingLeft:4 }}>
          {/* Vertical spine */}
          <div style={{
            position:"absolute", left:7, top:0, bottom:16, width:2,
            background:`linear-gradient(to bottom,${colPal.bg}70,transparent)`,
            borderRadius:2,
          }} />
          <div style={{ display:"flex", flexDirection:"column", gap:9, paddingLeft:20 }}>
            {data.sessions.map((sess, si) => {
              const idx = allSubjects.indexOf(sess.subject);
              return (
                <div key={si} style={{ position:"relative" }}>
                  {/* Branch arm */}
                  <div style={{
                    position:"absolute", left:-20, top:"50%", width:18, height:2,
                    background:`${pal(idx>=0?idx:si).bg}50`,
                  }} />
                  <SessionNode sess={sess} subjIdx={idx>=0?idx:si} dark={dark} />
                </div>
              );
            })}
          </div>
        </div>
      ) : isRest ? (
        <div style={{ textAlign:"center", padding:"18px 8px", color: dark?"#334155":"#CBD5E1", fontSize:12, fontStyle:"italic" }}>
          Rest & light review 🧘
        </div>
      ) : null}
    </div>
  );
}

/* ──────────────
   MAIN
────────────── */
export default function StudyPlan() {
  const navigate = useNavigate();
  const { dark, toggleDark } = useApp();

  const [screen, setScreen]     = useState("setup");
  const [subjects, setSubjects] = useState([]);
  const [hours, setHours]       = useState("3");
  const [examDate, setExamDate] = useState("");
  const [goal, setGoal]         = useState(null);
  const [note, setNote]         = useState("");
  const [plan, setPlan]         = useState(null);
  const [error, setError]       = useState(null);

  const t  = dark ? "#E2EEFF" : "#0F172A";
  const mu = dark ? "#64748B" : "#94A3B8";

  const card = {
    background: dark ? "rgba(13,27,46,0.85)" : "rgba(255,255,255,0.92)",
    border: `1px solid ${dark?"rgba(99,102,241,0.18)":"rgba(165,180,252,0.4)"}`,
    backdropFilter:"blur(20px)", borderRadius:20,
  };

  const toggleSubj = s => setSubjects(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  /* ── Generate ── */
  const generate = async () => {
    setScreen("generating");
    setError(null);
    const daysUntil = examDate ? Math.ceil((new Date(examDate)-new Date())/86400000) : null;

    const prompt = `You are a study planner. Output ONLY a 7-day study plan in the EXACT format below. No JSON. No markdown. No asterisks. No extra text before or after.

TITLE: [Short motivating title, max 8 words]
SUMMARY: [2 sentences on the strategy]
GOAL: [One sentence on what student achieves this week]

DAY: Monday
SUBJECT: [subject name] | HOURS: [number like 1.5]
TOPIC: [specific topic]
TASKS: [task 1], [task 2], [task 3]
SUBJECT: [subject name] | HOURS: [number]
TOPIC: [specific topic]
TASKS: [task 1], [task 2]

DAY: Tuesday
SUBJECT: [subject name] | HOURS: [number]
TOPIC: [specific topic]
TASKS: [task 1], [task 2], [task 3]

DAY: Wednesday
SUBJECT: [subject name] | HOURS: [number]
TOPIC: [specific topic]
TASKS: [task 1], [task 2]

DAY: Thursday
SUBJECT: [subject name] | HOURS: [number]
TOPIC: [specific topic]
TASKS: [task 1], [task 2], [task 3]

DAY: Friday
SUBJECT: [subject name] | HOURS: [number]
TOPIC: [specific topic]
TASKS: [task 1], [task 2]

DAY: Saturday
SUBJECT: [subject name] | HOURS: [number]
TOPIC: [specific topic]
TASKS: [task 1], [task 2], [task 3]

DAY: Sunday
REST

TIP: [practical tip 1]
TIP: [practical tip 2]
TIP: [practical tip 3]
MILESTONE: [what student completes by mid-week]
MILESTONE: [what student completes by end of week]

===
Student details:
Subjects: ${subjects.join(", ")}
Hours per day: ${hours}
Goal: ${goal?.label || "General improvement"}
Days until exam: ${daysUntil ? daysUntil+" days" : "Not specified"}
Notes: ${note || "None"}
${daysUntil && daysUntil < 14 ? "URGENT: Exam soon — prioritise high-weightage topics and past papers." : ""}

IMPORTANT: Output ONLY from TITLE: to the last MILESTONE: line. Nothing else.`;

    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          subject:"Study Planning",
          messages:[{ role:"user", content:prompt }],
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data  = await res.json();
      const parsed = parsePlan(data.reply);
      setPlan(parsed);
      setScreen("roadmap");
    } catch(err) {
      setError(err.message);
      setScreen("setup");
    }
  };

  const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    @keyframes fadein{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.82)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    .fade{animation:fadein 0.5s cubic-bezier(0.16,1,0.3,1) both;}
    .d1{animation-delay:.07s}.d2{animation-delay:.14s}.d3{animation-delay:.21s}
    .d4{animation-delay:.28s}.d5{animation-delay:.35s}.d6{animation-delay:.42s}.d7{animation-delay:.49s}
    .chip{transition:all 0.18s;cursor:pointer;border:none;}
    .chip:hover{transform:translateY(-2px);}
    ::-webkit-scrollbar{height:5px;width:5px}
    ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:3px}
    .shimmer-text{
      background:linear-gradient(90deg,#6366F1,#38BDF8,#34D399,#6366F1);
      background-size:200% auto;
      -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
      animation:shimmer 4s linear infinite;
    }
    @media print{nav{display:none!important}}
  `;

  const Nav = ({ children }) => (
    <nav style={{
      position:"sticky",top:0,zIndex:50,
      background: dark?"rgba(7,14,28,0.93)":"rgba(240,244,255,0.93)",
      backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${dark?"rgba(99,102,241,0.12)":"rgba(165,180,252,0.4)"}`,
      padding:"12px 24px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",
    }}>
      {children}
      {/* dark toggle */}
      <button onClick={toggleDark} style={{
        width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",
        background:dark?"#4F46E5":"#E2E8F0",padding:2,display:"flex",alignItems:"center",
      }}>
        <div style={{
          width:20,height:20,borderRadius:"50%",background:"white",
          transform:dark?"translateX(20px)":"translateX(0)",
          transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,
        }}>{dark?"🌙":"☀️"}</div>
      </button>
    </nav>
  );

  const GhostBtn = ({ onClick, children, style={} }) => (
    <button onClick={onClick} style={{
      padding:"7px 16px",borderRadius:10,border:`1px solid ${dark?"rgba(99,102,241,0.25)":"rgba(165,180,252,0.5)"}`,
      background:"transparent",color:mu,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",
      transition:"all 0.18s", ...style,
    }}>{children}</button>
  );

  /* ══════════ SETUP ══════════ */
  if (screen === "setup") return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:dark?"#070E1C":"#F0F4FF", color:t }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Nav>
        <GhostBtn onClick={() => navigate("/student/dashboard")}>← Back</GhostBtn>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, flex:1 }}>🗺 Study Roadmap Builder</span>
      </Nav>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"36px 20px 80px" }}>

        {/* Hero */}
        <div className="fade" style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:52, marginBottom:12, animation:"floaty 3s ease-in-out infinite" }}>🗺</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,5vw,40px)", fontWeight:900, lineHeight:1.1, marginBottom:10 }}>
            <span style={{color:t}}>Build Your </span>
            <span className="shimmer-text">Study Roadmap</span>
          </h1>
          <p style={{ fontSize:15, color:mu, maxWidth:420, margin:"0 auto", lineHeight:1.65 }}>
            Tell us your subjects and goal — we'll generate a beautiful 7-day visual mindmap with topics, tasks, and resources.
          </p>
        </div>

        {error && (
          <div className="fade" style={{
            padding:"12px 18px",borderRadius:12,marginBottom:20,
            background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#F87171",fontSize:13,
          }}>⚠️ {error}</div>
        )}

        {/* Step 1 */}
        <div className="fade d1" style={{ ...card, padding:26, marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:800 }}>1</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:t }}>Which subjects?</h3>
            {subjects.length > 0 && <span style={{ marginLeft:"auto",fontSize:12,color:"#818CF8",fontWeight:700 }}>{subjects.length} selected</span>}
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {SUBJECTS_LIST.map((s,i) => {
              const p = pal(i);
              const sel = subjects.includes(s);
              return (
                <button key={s} className="chip" onClick={() => toggleSubj(s)} style={{
                  padding:"7px 15px",borderRadius:20,fontSize:13,fontWeight:700,fontFamily:"inherit",
                  background: sel?(dark?`${p.bg}22`:p.soft):(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.9)"),
                  border:`2px solid ${sel?p.bg:"transparent"}`,color:sel?p.bg:mu,
                  boxShadow:sel?`0 0 10px ${p.glow}`:"none",
                }}>
                  {sel?"✓ ":""}{s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 */}
        <div className="fade d2" style={{ ...card, padding:26, marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:800 }}>2</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:t }}>Goal & schedule</h3>
          </div>

          <p style={{ fontSize:11,fontWeight:700,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>🎯 Your goal</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20 }}>
            {GOALS.map(g => (
              <button key={g.id} className="chip" onClick={() => setGoal(goal?.id===g.id?null:g)} style={{
                padding:"10px 8px",borderRadius:12,fontFamily:"inherit",
                border:`2px solid ${goal?.id===g.id?"#818CF8":(dark?"rgba(99,102,241,0.15)":"rgba(165,180,252,0.3)")}`,
                background:goal?.id===g.id?(dark?"rgba(129,140,248,0.15)":"rgba(238,242,255,0.8)"):"transparent",
                color:goal?.id===g.id?"#818CF8":mu,fontWeight:700,fontSize:12,
              }}>
                <div style={{ fontSize:18,marginBottom:3 }}>{g.icon}</div>{g.label}
              </button>
            ))}
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            <div>
              <p style={{ fontSize:11,fontWeight:700,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>⏱ Hours/day</p>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {HOURS_OPTIONS.map(h => (
                  <button key={h} className="chip" onClick={() => setHours(h)} style={{
                    padding:"7px 14px",borderRadius:20,fontFamily:"inherit",
                    border:`2px solid ${hours===h?"#818CF8":"transparent"}`,
                    background:hours===h?(dark?"rgba(129,140,248,0.15)":"rgba(238,242,255,0.8)"):(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.9)"),
                    color:hours===h?"#818CF8":mu,fontWeight:700,fontSize:13,
                  }}>{h}h</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:11,fontWeight:700,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8 }}>📅 Exam date (optional)</p>
              <input type="date" value={examDate} onChange={e=>setExamDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{
                  width:"100%",padding:"10px 13px",borderRadius:11,fontSize:14,fontFamily:"inherit",outline:"none",
                  background:dark?"rgba(15,30,55,0.8)":"rgba(248,250,252,0.9)",
                  border:`1.5px solid ${dark?"rgba(99,102,241,0.2)":"rgba(165,180,252,0.4)"}`,
                  color:t,colorScheme:dark?"dark":"light",
                }} />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="fade d3" style={{ ...card, padding:26, marginBottom:32 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:800 }}>3</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:t }}>Anything else?</h3>
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3}
            placeholder="e.g. Weak in Trigonometry, best in mornings, tuition on Wednesday evenings…"
            style={{
              width:"100%",padding:"11px 14px",borderRadius:11,fontSize:14,fontFamily:"inherit",
              outline:"none",resize:"vertical",
              background:dark?"rgba(15,30,55,0.8)":"rgba(248,250,252,0.9)",
              border:`1.5px solid ${dark?"rgba(99,102,241,0.2)":"rgba(165,180,252,0.4)"}`,color:t,
            }} />
        </div>

        {/* Generate CTA */}
        <div className="fade d4" style={{ textAlign:"center" }}>
          <button onClick={generate} disabled={subjects.length===0} style={{
            padding:"14px 52px",borderRadius:14,border:"none",
            cursor:subjects.length===0?"not-allowed":"pointer",
            background:subjects.length===0
              ?(dark?"rgba(99,102,241,0.15)":"rgba(199,210,254,0.4)")
              :"linear-gradient(135deg,#6366F1,#818CF8)",
            color:subjects.length===0?mu:"white",
            fontFamily:"inherit",fontSize:16,fontWeight:800,
            boxShadow:subjects.length>0?"0 4px 22px rgba(99,102,241,0.4)":"none",
            transition:"all 0.2s",opacity:subjects.length===0?0.5:1,
          }}>
            {subjects.length===0?"Select at least 1 subject ↑":"🤖 Generate My Study Roadmap →"}
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════ GENERATING ══════════ */
  if (screen === "generating") return (
    <div style={{
      minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:dark?"#070E1C":"#F0F4FF",fontFamily:"'DM Sans',sans-serif",
    }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ textAlign:"center",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:20,animation:"floaty 2s ease-in-out infinite" }}>🗺</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:t,marginBottom:8 }}>
          Crafting your roadmap…
        </h2>
        <p style={{ color:mu,fontSize:14,marginBottom:28,maxWidth:340,margin:"0 auto 28px" }}>
          Building a personalised plan for <strong style={{color:t}}>{subjects.slice(0,3).join(", ")}{subjects.length>3?` +${subjects.length-3} more`:""}</strong>
        </p>
        <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width:12,height:12,borderRadius:"50%",
              background:pal(i).bg,
              animation:`pulse 1.4s ${i*0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
        <p style={{ fontSize:12,color:dark?"#334155":"#CBD5E1",marginTop:20,fontStyle:"italic" }}>
          Usually 15–30 seconds…
        </p>
      </div>
    </div>
  );

  /* ══════════ ROADMAP / MINDMAP ══════════ */
  if (screen === "roadmap" && plan) return (
    <div style={{ minHeight:"100vh",background:dark?"#070E1C":"#F0F4FF",fontFamily:"'DM Sans',sans-serif",color:t }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Nav>
        <GhostBtn onClick={() => setScreen("setup")}>← Redo</GhostBtn>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,flex:1,color:t }}>
          🗺 {plan.title || "Your Study Roadmap"}
        </span>
        <GhostBtn onClick={() => window.print()}>⬇ Save</GhostBtn>
      </Nav>

      <div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 20px 80px" }}>

        {/* ── Summary Banner ── */}
        <div className="fade" style={{
          borderRadius:20,padding:"24px 28px",marginBottom:28,
          background:dark
            ?"linear-gradient(135deg,rgba(99,102,241,0.14),rgba(56,189,248,0.08))"
            :"linear-gradient(135deg,rgba(238,242,255,0.95),rgba(224,242,254,0.95))",
          border:`1px solid ${dark?"rgba(99,102,241,0.22)":"rgba(165,180,252,0.5)"}`,
          display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start",
        }}>
          <div style={{ flex:1,minWidth:260 }}>
            <p style={{ fontSize:11,fontWeight:800,color:"#818CF8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>
              This Week's Strategy
            </p>
            <p style={{ fontSize:15,color:t,lineHeight:1.7,marginBottom:14 }}>{plan.summary}</p>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,
              background:dark?"rgba(99,102,241,0.12)":"rgba(238,242,255,0.8)",
              border:`1px solid ${dark?"rgba(99,102,241,0.2)":"rgba(165,180,252,0.4)"}`,
            }}>
              <span>🎯</span>
              <span style={{ fontSize:13,color:"#818CF8",fontWeight:700 }}>{plan.weeklyGoal}</span>
            </div>
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7,maxWidth:340,alignContent:"flex-start" }}>
            {subjects.map((s,i) => {
              const p = pal(i);
              return (
                <span key={s} style={{
                  padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700,
                  background:dark?`${p.bg}20`:p.soft,border:`1px solid ${p.bg}45`,color:p.bg,
                }}>{s}</span>
              );
            })}
          </div>
        </div>

        {/* ── Milestones ── */}
        {plan.milestones.length > 0 && (
          <div className="fade d1" style={{ display:"flex",gap:12,marginBottom:28,flexWrap:"wrap" }}>
            {plan.milestones.map((ms,i) => (
              <div key={i} style={{
                flex:1,minWidth:200,padding:"14px 18px",borderRadius:14,
                background:dark?"rgba(13,27,46,0.85)":"rgba(255,255,255,0.9)",
                border:`1px solid ${dark?"rgba(99,102,241,0.15)":"rgba(165,180,252,0.4)"}`,
                display:"flex",gap:12,alignItems:"flex-start",
              }}>
                <span style={{ fontSize:22 }}>{i===0?"🏃":"🏆"}</span>
                <div>
                  <p style={{ fontSize:10,fontWeight:800,color:mu,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3 }}>
                    Milestone {i+1}
                  </p>
                  <p style={{ fontSize:13,fontWeight:700,color:t }}>{ms}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MINDMAP ── */}
        <div className="fade d2">
          <h2 style={{
            fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:900,color:t,
            marginBottom:20,display:"flex",alignItems:"center",gap:10,
          }}>
            <span style={{
              display:"inline-block",width:5,height:22,borderRadius:3,
              background:"linear-gradient(to bottom,#6366F1,#38BDF8)",
            }} />
            7-Day Visual Roadmap
            <span style={{ fontSize:12,fontWeight:600,color:mu,fontFamily:"inherit" }}>
              — tap any subject block to see tasks
            </span>
          </h2>

          {/* Central hub */}
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",marginBottom:20 }}>
            <div style={{
              padding:"13px 30px",borderRadius:50,
              background:"linear-gradient(135deg,#6366F1,#818CF8,#38BDF8)",
              boxShadow:"0 4px 28px rgba(99,102,241,0.45)",
              color:"white",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,
              letterSpacing:"0.06em",
            }}>
              🎓 {goal?.label || "Study Plan"} · {hours}h/day
            </div>
            <div style={{ width:2,height:20,background:"linear-gradient(to bottom,#6366F1,transparent)" }} />
            {/* Horizontal bar */}
            <div style={{
              width:"90%",height:2,
              background:"linear-gradient(to right,transparent,#6366F166,#6366F1,#6366F166,transparent)",
              marginBottom:18,
            }} />
          </div>

          {/* Day columns — horizontal scroll */}
          <div style={{ overflowX:"auto",paddingBottom:12 }}>
            <div style={{ display:"flex",gap:14,minWidth:"max-content",padding:"4px 4px 8px",alignItems:"flex-start" }}>
              {DAYS.map((day,di) => (
                <div key={day} className={`fade d${di+1}`}>
                  <DayCol
                    day={day}
                    data={plan.days[day] || { sessions:[], isRest:di===6 }}
                    di={di}
                    dark={dark}
                    allSubjects={subjects}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tips ── */}
        {plan.tips.length > 0 && (
          <div className="fade" style={{
            ...{ background:dark?"rgba(13,27,46,0.85)":"rgba(255,255,255,0.9)", border:`1px solid ${dark?"rgba(99,102,241,0.15)":"rgba(165,180,252,0.4)"}`, borderRadius:20 },
            padding:"22px 24px",marginTop:28,marginBottom:28,
          }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:t,marginBottom:16 }}>💡 Study Tips</h3>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12 }}>
              {plan.tips.map((tip,i) => (
                <div key={i} style={{
                  padding:"12px 14px",borderRadius:12,display:"flex",gap:10,alignItems:"flex-start",
                  background:dark?`${pal(i).bg}12`:`${pal(i).soft}`,
                  border:`1px solid ${pal(i).bg}30`,
                }}>
                  <span style={{ fontSize:16 }}>{"💡🔥⚡🎯"[i]||"✨"}</span>
                  <p style={{ fontSize:13,color:mu,lineHeight:1.55 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── YouTube ── */}
        <div className="fade">
          <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:t,marginBottom:14 }}>▶ YouTube Resources</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10 }}>
            {subjects.map((subj,i) => (
              <a key={subj} href={YT_MAP[subj]||"https://youtube.com"} target="_blank" rel="noreferrer" style={{
                display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderRadius:13,
                textDecoration:"none",
                background:dark?"rgba(15,30,55,0.7)":"rgba(248,250,255,0.9)",
                border:`1px solid ${dark?"rgba(99,102,241,0.12)":"rgba(165,180,252,0.3)"}`,
                transition:"border-color 0.18s",
              }}>
                <div style={{ width:36,height:36,borderRadius:10,background:"#FF0000",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,flexShrink:0 }}>▶</div>
                <div>
                  <p style={{ fontSize:13,fontWeight:700,color:t,marginBottom:2 }}>{subj}</p>
                  <p style={{ fontSize:11,color:mu }}>Watch on YouTube ↗</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return null;
}