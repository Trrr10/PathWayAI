// Analytics.jsx
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";

export default function Analytics() {
  const { dark } = useApp();
  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  const TREND = [40, 52, 48, 60, 55, 68, 72, 69, 75, 80, 76, 84];
  const max = Math.max(...TREND);

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-5xl mx-auto">
          <h1 className={`font-display text-3xl italic mb-2 ${text}`}>📊 Class Analytics</h1>
          <p className={`text-sm ${muted} mb-8`}>Real-time performance trends, engagement data, and early intervention alerts.</p>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Class Avg Score", value: "68", sub: "+4 from last week", color: "#22C55E" },
              { label: "Students at Risk", value: "3", sub: "Below threshold", color: "#EF4444" },
              { label: "Avg Daily Sessions", value: "4.2", sub: "per student", color: "#38BDF8" },
              { label: "Assessments Done", value: "12", sub: "this month", color: "#8B5CF6" },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-5 ${card}`}>
                <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className={`text-xs font-bold ${text}`}>{s.label}</div>
                <div className={`text-xs mt-0.5 ${muted}`}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Trend chart (SVG bar chart) */}
          <div className={`rounded-2xl border p-6 mb-6 ${card}`}>
            <h2 className={`font-bold mb-5 ${text}`}>Class Average — Past 12 Weeks</h2>
            <div className="flex items-end gap-2 h-32">
              {TREND.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-sky-600 to-blue-400 transition-all duration-700"
                    style={{ height: `${(val / max) * 100}%`, minHeight: 4 }} />
                  <span className={`text-xs ${muted}`}>{`W${i + 1}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert students */}
          <div className={`rounded-2xl border ${card}`}>
            <div className={`px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-200"}`}>
              <h2 className={`font-bold ${text}`}>🚨 Students Requiring Attention</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: "Rahul K.", issue: "Math score dropped 18 points in 2 weeks. Has not logged in for 3 days.", action: "Send message" },
                { name: "Arjun T.", issue: "Consistently below 55 in all 3 subjects. Zero AI tutor usage this week.", action: "Schedule call" },
                { name: "Sunita D.", issue: "Streak broken. 0 quiz attempts this week. Parent message suggested.", action: "Contact parent" },
              ].map(s => (
                <div key={s.name} className={`flex items-start gap-4 p-4 rounded-xl border ${dark ? "border-red-800/40 bg-red-900/10" : "border-red-200 bg-red-50"}`}>
                  <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center text-sm font-black shrink-0">{s.name[0]}</div>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${text}`}>{s.name}</div>
                    <div className={`text-xs ${muted}`}>{s.issue}</div>
                  </div>
                  <button className="text-xs font-bold text-red-400 hover:underline shrink-0">{s.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}