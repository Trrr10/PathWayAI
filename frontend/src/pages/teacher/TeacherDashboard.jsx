// TeacherDashboard.jsx
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";

const STUDENTS = [
  { name: "Rahul K.",  math: 45, sci: 72, hist: 68, streak: 5,  alert: true  },
  { name: "Priya M.",  math: 88, sci: 79, hist: 91, streak: 14, alert: false },
  { name: "Arjun T.",  math: 62, sci: 55, hist: 48, streak: 2,  alert: true  },
  { name: "Meera S.",  math: 73, sci: 81, hist: 76, streak: 8,  alert: false },
  { name: "Raj P.",    math: 91, sci: 88, hist: 82, streak: 21, alert: false },
  { name: "Sunita D.", math: 34, sci: 41, hist: 52, streak: 0,  alert: true  },
];

function ScoreCell({ val }) {
  const color = val < 50 ? "bg-red-500" : val < 70 ? "bg-yellow-500" : val < 85 ? "bg-sky-500" : "bg-emerald-500";
  return <td className="px-4 py-3 text-center"><span className={`inline-block w-10 text-center text-white text-xs font-bold py-1 rounded-lg ${color}`}>{val}</span></td>;
}

export default function TeacherDashboard() {
  const { dark } = useApp();
  const navigate = useNavigate();
  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const thCls = `px-4 py-3 text-left text-xs font-black uppercase tracking-wider ${muted}`;

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <h1 className={`font-display text-3xl italic mb-2 ${text}`}>📊 Teacher Dashboard</h1>
        <p className={`text-sm ${muted} mb-6`}>Real-time class overview · Struggle Score heatmap</p>

        {/* Alert strip */}
        <div className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${dark ? "bg-red-900/20 border border-red-800/50" : "bg-red-50 border border-red-200"}`}>
          <span className="text-xl">⚠️</span>
          <div>
            <div className="text-red-400 font-bold text-sm">3 students need attention</div>
            <div className={`text-xs ${muted}`}>Rahul, Arjun, and Sunita have low Struggle Scores across multiple subjects.</div>
          </div>
          <button onClick={() => navigate("/teacher/analytics")} className="ml-auto text-xs font-bold text-red-400 hover:underline shrink-0">View Details →</button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Create Assessment", icon: "📋", path: "/teacher/assessment", accent: "#38BDF8" },
            { label: "Full Analytics",    icon: "📊", path: "/teacher/analytics",  accent: "#8B5CF6" },
            { label: "Share Resources",   icon: "📚", path: "/teacher/resources",  accent: "#14B8A6" },
            { label: "Total Students",    icon: "👥", value: "28",                  accent: "#F59E0B" },
          ].map((a, i) => (
            <button key={i} onClick={a.path ? () => navigate(a.path) : undefined}
              className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${card}`}>
              <div className="text-2xl mb-2">{a.icon}</div>
              {a.value ? (
                <>
                  <div className="text-2xl font-black" style={{ color: a.accent }}>{a.value}</div>
                  <div className={`text-xs font-semibold ${muted}`}>{a.label}</div>
                </>
              ) : (
                <div className={`text-sm font-bold ${text}`}>{a.label}</div>
              )}
            </button>
          ))}
        </div>

        {/* Heatmap table */}
        <div className={`rounded-2xl border overflow-hidden ${card}`}>
          <div className={`px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-200"}`}>
            <h2 className={`font-bold ${text}`}>Class Heatmap — Struggle Scores</h2>
            <p className={`text-xs ${muted}`}>Green = strong, Red = needs intervention</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={dark ? "bg-slate-800/50" : "bg-slate-50"}>
                <tr>
                  <th className={`${thCls} text-left`}>Student</th>
                  <th className={`${thCls} text-center`}>Mathematics</th>
                  <th className={`${thCls} text-center`}>Science</th>
                  <th className={`${thCls} text-center`}>History</th>
                  <th className={`${thCls} text-center`}>Streak</th>
                  <th className={`${thCls}`}></th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((s, i) => (
                  <tr key={s.name} className={`border-t ${dark ? "border-slate-800" : "border-slate-100"} ${s.alert ? (dark ? "bg-red-900/10" : "bg-red-50/50") : ""}`}>
                    <td className="px-4 py-3">
                      <div className={`font-semibold text-sm ${text}`}>{s.name}</div>
                    </td>
                    <ScoreCell val={s.math} />
                    <ScoreCell val={s.sci} />
                    <ScoreCell val={s.hist} />
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${s.streak === 0 ? "text-red-400" : s.streak < 5 ? "text-yellow-400" : "text-emerald-400"}`}>
                        {s.streak === 0 ? "⚠ 0" : `🔥 ${s.streak}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.alert && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-bold">Alert</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}