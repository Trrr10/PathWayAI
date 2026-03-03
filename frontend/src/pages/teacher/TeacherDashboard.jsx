/**
 * TeacherDashboard.jsx — PathwayAI Teacher Dashboard
 * - Struggle Score heatmap (student x subject, colour-coded)
 * - At-risk alert strip with names
 * - Class health stats with sparklines
 * - Expandable student rows with recommendations
 * - Recent assessments + upcoming sessions
 * - Quick-action buttons to other teacher pages
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";

const SUBJECTS = ["Mathematics", "Science", "History", "English", "Geography"];

const STUDENTS = [
  { name:"Rahul K.",  avatar:"R", grad:"from-sky-500 to-blue-600",     scores:{ Mathematics:45, Science:72, History:68, English:61, Geography:55 }, streak:5,  sessions:8,  lastActive:"Today" },
  { name:"Priya M.",  avatar:"P", grad:"from-teal-500 to-cyan-600",    scores:{ Mathematics:88, Science:79, History:91, English:94, Geography:82 }, streak:14, sessions:21, lastActive:"Today" },
  { name:"Arjun T.",  avatar:"A", grad:"from-violet-500 to-purple-600",scores:{ Mathematics:62, Science:55, History:48, English:52, Geography:49 }, streak:2,  sessions:5,  lastActive:"2d ago" },
  { name:"Meera S.",  avatar:"M", grad:"from-amber-500 to-orange-500", scores:{ Mathematics:73, Science:81, History:76, English:88, Geography:71 }, streak:8,  sessions:14, lastActive:"Today" },
  { name:"Raj P.",    avatar:"R", grad:"from-green-500 to-emerald-600",scores:{ Mathematics:91, Science:88, History:82, English:79, Geography:85 }, streak:21, sessions:28, lastActive:"Today" },
  { name:"Sunita D.", avatar:"S", grad:"from-red-500 to-rose-600",     scores:{ Mathematics:34, Science:41, History:52, English:38, Geography:44 }, streak:0,  sessions:3,  lastActive:"5d ago" },
  { name:"Dev R.",    avatar:"D", grad:"from-indigo-500 to-blue-600",  scores:{ Mathematics:67, Science:63, History:71, English:58, Geography:60 }, streak:4,  sessions:9,  lastActive:"Yesterday" },
  { name:"Aisha K.",  avatar:"A", grad:"from-pink-500 to-rose-500",    scores:{ Mathematics:79, Science:84, History:77, English:92, Geography:80 }, streak:11, sessions:17, lastActive:"Today" },
];

const ASSESSMENTS = [
  { title:"Ch.4 Quadratic Equations Quiz", subject:"Mathematics", date:"Nov 28", submitted:22, total:28, avgScore:68 },
  { title:"Newton's Laws — MCQ",            subject:"Science",     date:"Nov 25", submitted:26, total:28, avgScore:74 },
  { title:"World War II Essay",             subject:"History",     date:"Nov 22", submitted:20, total:28, avgScore:71 },
];

const UPCOMING = [
  { title:"Remedial: Algebra Basics", type:"Remedial",  students:"Rahul, Sunita, Arjun", time:"Today 3 PM",    icon:"📐" },
  { title:"Ch.5 Chemical Reactions",  type:"New Topic", students:"All students",          time:"Tomorrow 9 AM", icon:"⚗️" },
  { title:"Mid-Term Revision",        type:"Revision",  students:"All students",          time:"Dec 5, 10 AM",  icon:"📋" },
];

function scoreColor(val) {
  if (val < 50) return { bg:"#EF4444", fg:"#fff" };
  if (val < 65) return { bg:"#F97316", fg:"#fff" };
  if (val < 78) return { bg:"#EAB308", fg:"#1e293b" };
  if (val < 88) return { bg:"#22C55E", fg:"#fff" };
  return               { bg:"#0EA5E9", fg:"#fff" };
}

function avgScore(s) {
  const v = Object.values(s.scores);
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
}

function classAvg(sub) {
  return Math.round(STUDENTS.reduce((a, s) => a + s.scores[sub], 0) / STUDENTS.length);
}

function Spark({ vals, color }) {
  const max = Math.max(...vals);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {vals.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm"
          style={{ height: `${Math.max(10, (v / max) * 100)}%`, background: color, opacity: 0.4 + i * 0.09 }} />
      ))}
    </div>
  );
}

export default function TeacherDashboard() {
  const { dark } = useApp();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [hlCol, setHlCol] = useState(null);

  const bg      = dark ? "bg-slate-950" : "bg-slate-50";
  const card    = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text    = dark ? "text-white" : "text-slate-900";
  const muted   = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-200";

  const overallAvg  = Math.round(STUDENTS.reduce((a, s) => a + avgScore(s), 0) / STUDENTS.length);
  const activeCount = STUDENTS.filter(s => s.streak >= 7).length;
  const atRisk      = STUDENTS.filter(s => Object.values(s.scores).some(v => v < 50) || s.streak === 0);

  return (

      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Header ── */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className={`font-display text-3xl italic mb-1 ${text}`}>📊 Teacher Dashboard</h1>
              <p className={`text-sm ${muted}`}>Real-time class overview · Struggle Score heatmap · Mrs. Sunita Deshpande</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/teacher/assessment")}
                className="text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                + New Assessment
              </button>
              <button onClick={() => navigate("/teacher/analytics")}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border-2 transition-all ${dark ? "border-slate-700 text-slate-300 hover:border-sky-600 hover:text-sky-300" : "border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-600"}`}>
                Full Analytics →
              </button>
              <button onClick={() => navigate("/teacher/videocall")}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border-2 transition-all ${dark ? "border-slate-700 text-slate-300 hover:border-sky-600 hover:text-sky-300" : "border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-600"}`}>
                Video Call →
              </button>
            </div>
          </div>

          {/* ── At-risk alert ── */}
          {atRisk.length > 0 && (
            <div className={`rounded-2xl p-4 flex items-start gap-4 ${dark ? "bg-red-900/20 border border-red-800/40" : "bg-red-50 border border-red-200"}`}>
              <span className="text-2xl shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="text-red-400 font-bold text-sm mb-2">{atRisk.length} students need immediate attention</p>
                <div className="flex flex-wrap gap-2">
                  {atRisk.map(s => (
                    <span key={s.name} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      {s.name} {s.streak === 0 ? "· no streak" : "· low scores"}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate("/teacher/analytics")} className="text-xs font-bold text-red-400 hover:underline shrink-0 mt-0.5">
                Details →
              </button>
            </div>
          )}

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:"Class Avg Score",   val:`${overallAvg}%`,               icon:"📈", color:"#38BDF8", spark:[58,62,65,61,68,70,overallAvg] },
              { label:"7-Day Streaks",     val:`${activeCount}/${STUDENTS.length}`, icon:"🔥", color:"#F59E0B", spark:[3,4,4,5,5,6,activeCount] },
              { label:"At-Risk Students",  val:atRisk.length,                   icon:"🚨", color:"#EF4444", spark:[5,4,4,4,3,3,atRisk.length] },
              { label:"Assessments Sent",  val:ASSESSMENTS.length,              icon:"📋", color:"#22C55E", spark:[0,1,1,2,2,3,ASSESSMENTS.length] },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-5 ${card}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`text-xs font-semibold mb-1 ${muted}`}>{s.label}</p>
                    <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
                  </div>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <Spark vals={s.spark} color={s.color} />
              </div>
            ))}
          </div>

          {/* ── Heatmap ── */}
          <div className={`rounded-2xl border overflow-hidden ${card}`}>
            <div className={`px-5 py-4 border-b ${divider} flex flex-wrap items-center justify-between gap-3`}>
              <div>
                <h2 className={`font-bold ${text}`}>Struggle Score Heatmap</h2>
                <p className={`text-xs ${muted}`}>Click a subject to highlight · Click any row to expand recommendations</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
                {[["< 50","#EF4444"],["50–64","#F97316"],["65–77","#EAB308"],["78–87","#22C55E"],["88+","#0EA5E9"]].map(([l,c]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: c }} />
                    <span className={muted}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className={dark ? "bg-slate-800/60" : "bg-slate-50"}>
                    <th className={`px-4 py-3 text-left text-xs font-black uppercase tracking-wider ${muted}`}>Student</th>
                    {SUBJECTS.map(sub => (
                      <th key={sub}
                        onClick={() => setHlCol(hlCol === sub ? null : sub)}
                        className={`px-3 py-3 text-center text-xs font-black uppercase tracking-wider cursor-pointer select-none transition-all ${hlCol === sub ? "text-sky-400 bg-sky-500/10" : muted}`}>
                        {sub.slice(0, 4)}{hlCol === sub ? " ▾" : ""}
                      </th>
                    ))}
                    <th className={`px-3 py-3 text-center text-xs font-black uppercase tracking-wider ${muted}`}>Avg</th>
                    <th className={`px-3 py-3 text-center text-xs font-black uppercase tracking-wider ${muted}`}>Streak</th>
                    <th className={`px-3 py-3 text-center text-xs font-black uppercase tracking-wider ${muted}`}>Active</th>
                    <th className={`px-3 py-3 ${muted}`}></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Class average row */}
                  <tr className={`border-t ${divider} ${dark ? "bg-slate-800/30" : "bg-slate-50/80"}`}>
                    <td className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider ${muted}`}>Class Avg</td>
                    {SUBJECTS.map(sub => {
                      const avg = classAvg(sub);
                      const c = scoreColor(avg);
                      return (
                        <td key={sub} className="px-3 py-2.5 text-center">
                          <span className="inline-block w-10 text-center text-xs font-black py-1 rounded-lg"
                            style={{ background: c.bg, color: c.fg }}>{avg}</span>
                        </td>
                      );
                    })}
                    <td colSpan={4} />
                  </tr>

                  {/* Student rows */}
                  {STUDENTS.map(s => {
                    const avg    = avgScore(s);
                    const isAlert = atRisk.includes(s);
                    const isExp  = expanded === s.name;
                    return (
                      <>
                        <tr key={s.name}
                          onClick={() => setExpanded(isExp ? null : s.name)}
                          className={`border-t ${divider} cursor-pointer transition-all ${dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"} ${isAlert ? (dark ? "bg-red-900/10" : "bg-red-50/40") : ""}`}>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                {s.avatar}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${text}`}>{s.name}</p>
                                <p className={`text-xs ${muted}`}>{s.sessions} sessions</p>
                              </div>
                            </div>
                          </td>

                          {SUBJECTS.map(sub => {
                            const val = s.scores[sub];
                            const c = scoreColor(val);
                            return (
                              <td key={sub} className={`px-3 py-3 text-center transition-all ${hlCol === sub ? "ring-1 ring-inset ring-sky-500/30 bg-sky-500/5" : ""}`}>
                                <span className="inline-block w-10 text-center text-xs font-bold py-1 rounded-lg"
                                  style={{ background: c.bg, color: c.fg }}>{val}</span>
                              </td>
                            );
                          })}

                          <td className="px-3 py-3 text-center">
                            <span className="text-sm font-black" style={{ color: scoreColor(avg).bg }}>{avg}</span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-bold ${s.streak === 0 ? "text-red-400" : s.streak < 7 ? "text-amber-400" : "text-emerald-400"}`}>
                              {s.streak === 0 ? "⚠ 0" : `🔥 ${s.streak}`}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-semibold ${s.lastActive === "Today" ? "text-emerald-400" : muted}`}>{s.lastActive}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              {isAlert && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-lg font-bold">Alert</span>}
                              <span className={`text-xs ${muted}`}>{isExp ? "▲" : "▼"}</span>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {isExp && (
                          <tr key={`${s.name}-exp`} className={`border-t ${divider} ${dark ? "bg-slate-800/30" : "bg-sky-50/40"}`}>
                            <td colSpan={SUBJECTS.length + 4} className="px-6 py-4">
                              <div className="flex flex-wrap gap-6 items-start">
                                <div>
                                  <p className={`text-xs font-bold mb-2 ${muted}`}>Weakest subjects</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {Object.entries(s.scores).sort(([, a], [, b]) => a - b).slice(0, 3).map(([sub, val]) => {
                                      const c = scoreColor(val);
                                      return (
                                        <span key={sub} className="text-xs font-bold px-2.5 py-1 rounded-lg"
                                          style={{ background: `${c.bg}25`, color: c.bg, border: `1px solid ${c.bg}40` }}>
                                          {sub}: {val}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <p className={`text-xs font-bold mb-2 ${muted}`}>Recommended action</p>
                                  <p className={`text-xs leading-relaxed ${text}`}>
                                    {s.streak === 0
                                      ? "⚠️ Student inactive 5+ days — send a check-in notification today"
                                      : avg < 55
                                      ? "🎯 Assign to peer mentor for remedial sessions this week"
                                      : avg < 70
                                      ? "📘 Share targeted revision material for their 2 weakest subjects"
                                      : "✅ On track — encourage consistency and offer optional challenges"}
                                  </p>
                                </div>
                                <button className={`ml-auto shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${dark ? "border-sky-700 text-sky-400 hover:bg-sky-900/20" : "border-sky-300 text-sky-600 hover:bg-sky-50"}`}>
                                  Message Student →
                                </button>
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

          {/* ── Bottom two columns ── */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Recent assessments */}
            <div className={`rounded-2xl border ${card}`}>
              <div className={`px-5 py-4 border-b ${divider} flex items-center justify-between`}>
                <h2 className={`font-bold text-sm ${text}`}>📋 Recent Assessments</h2>
                <button onClick={() => navigate("/teacher/assessment")} className={`text-xs font-bold ${dark ? "text-sky-400" : "text-sky-600"} hover:underline`}>+ New</button>
              </div>
              <div className="divide-y" style={{ borderColor: dark ? "#1e293b" : "#f1f5f9" }}>
                {ASSESSMENTS.map((a, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className={`text-sm font-bold ${text}`}>{a.title}</p>
                        <p className={`text-xs ${muted}`}>{a.subject} · {a.date}</p>
                      </div>
                      <span className="text-sm font-black" style={{ color: scoreColor(a.avgScore).bg }}>{a.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 h-1.5 rounded-full ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                        <div className="h-full rounded-full bg-sky-500" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                      </div>
                      <span className={`text-xs shrink-0 ${muted}`}>{a.submitted}/{a.total} submitted</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`px-5 py-3 border-t ${divider}`}>
                <button onClick={() => navigate("/teacher/assessment")} className={`text-xs font-bold ${dark ? "text-sky-400" : "text-sky-600"} hover:underline`}>
                  View all assessments →
                </button>
              </div>
            </div>

            {/* Upcoming sessions */}
            <div className={`rounded-2xl border ${card}`}>
              <div className={`px-5 py-4 border-b ${divider}`}>
                <h2 className={`font-bold text-sm ${text}`}>📅 Upcoming Sessions</h2>
              </div>
              <div className="divide-y" style={{ borderColor: dark ? "#1e293b" : "#f1f5f9" }}>
                {UPCOMING.map((u, i) => (
                  <div key={i} className="px-5 py-4 flex items-start gap-3">
                    <span className="text-2xl shrink-0">{u.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className={`text-sm font-bold ${text}`}>{u.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          u.type === "Remedial"   ? dark ? "bg-red-900/40 text-red-400"    : "bg-red-50 text-red-500"
                          : u.type === "New Topic" ? dark ? "bg-sky-900/40 text-sky-400"   : "bg-sky-50 text-sky-600"
                                                   : dark ? "bg-violet-900/40 text-violet-400" : "bg-violet-50 text-violet-600"
                        }`}>{u.type}</span>
                      </div>
                      <p className={`text-xs mb-1 ${muted}`}>{u.students}</p>
                      <p className={`text-xs font-bold ${u.time.startsWith("Today") ? "text-amber-400" : muted}`}>📅 {u.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:"AI Assessment Generator", icon:"🤖", desc:"Generate quizzes from topics", path:"/teacher/assessment", color:"#38BDF8" },
              { label:"Full Analytics",           icon:"📊", desc:"Deep-dive class performance",  path:"/teacher/analytics",  color:"#8B5CF6" },
              { label:"Resource Library",         icon:"📚", desc:"Upload & share materials",     path:"/teacher/resources",  color:"#14B8A6" },
              { label:"28 Students Enrolled",     icon:"👥", desc:"Class XII · Section A",        path:null,                  color:"#F59E0B" },
            ].map((a, i) => (
              <button key={i}
                onClick={a.path ? () => navigate(a.path) : undefined}
                disabled={!a.path}
                className={`rounded-2xl border p-5 text-left transition-all ${a.path ? "hover:-translate-y-0.5 cursor-pointer" : "cursor-default"} ${card}`}>
                <div className="text-3xl mb-3">{a.icon}</div>
                <p className="text-sm font-bold mb-0.5" style={{ color: a.color }}>{a.label}</p>
                <p className={`text-xs ${muted}`}>{a.desc}</p>
              </button>
            ))}
          </div>

        </div>
      </div>

  );
}