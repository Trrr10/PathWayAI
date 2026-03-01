// ──────────────────────────────────────────────────────────────────────────────
// StudyPlan.jsx
// ──────────────────────────────────────────────────────────────────────────────
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";
import { planData } from "../../data/allData";

const TYPE_STYLE = {
  "lesson":      { bg: "from-sky-500 to-blue-600",     label: "Lesson"  },
  "quiz":        { bg: "from-violet-500 to-purple-600", label: "Quiz"    },
  "ai-session":  { bg: "from-teal-500 to-cyan-500",    label: "AI"      },
  "mentor":      { bg: "from-amber-500 to-orange-500", label: "Mentor"  },
  "free":        { bg: "from-slate-500 to-slate-600",  label: "Free"    },
  "review":      { bg: "from-emerald-500 to-green-600", label: "Review" },
};

export function StudyPlan() {
  const { dark } = useApp();
  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className={`font-display text-3xl italic ${text}`}>📅 Weekly Study Plan</h1>
            <p className={`text-sm ${muted}`}>{planData.weekLabel} · AI-generated {planData.generatedAt}</p>
          </div>
          <div className="grid gap-4">
            {planData.days.map((day) => (
              <div key={day.day} className={`rounded-2xl border ${card}`}>
                <div className={`flex items-center gap-3 px-5 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                  <span className={`text-sm font-black ${text}`}>{day.day}</span>
                  <span className={`text-xs ${muted}`}>{day.date}</span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {day.items.map((item, i) => {
                    const ts = TYPE_STYLE[item.type] || TYPE_STYLE.lesson;
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${dark ? "border-slate-700/50" : "border-slate-100"}`}>
                        <div className={`text-xs font-bold w-16 shrink-0 ${muted}`}>{item.time}</div>
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs ${muted}`}>{item.subject}</div>
                          <div className={`text-sm font-semibold truncate ${text}`}>{item.topic}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs ${muted}`}>{item.duration}m</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg text-white bg-gradient-to-r ${ts.bg}`}>{ts.label}</span>
                          {item.priority === "high" && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default StudyPlan;