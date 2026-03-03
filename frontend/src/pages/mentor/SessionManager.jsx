/**
 * SessionManager.jsx — Mentor session calendar + history
 * Upcoming bookings, join session, accept/decline, past log
 */
import { useState } from "react";
import { useApp } from "../../context/AppContext";

const UPCOMING = [
  { id: 1, student: "Rahul K.", avatar: "R", grad: "from-sky-500 to-blue-600", subject: "Mathematics", topic: "Quadratic Equations", date: "Today", time: "5:00 PM", duration: "45 min", mode: "Voice", status: "confirmed" },
  { id: 2, student: "Sneha P.", avatar: "S", grad: "from-teal-500 to-cyan-600", subject: "Physics", topic: "Laws of Motion", date: "Tomorrow", time: "6:30 PM", duration: "60 min", mode: "Text", status: "confirmed" },
  { id: 3, student: "Arjun T.", avatar: "A", grad: "from-violet-500 to-purple-600", subject: "Mathematics", topic: "Trigonometry", date: "Dec 5", time: "5:00 PM", duration: "45 min", mode: "Voice", status: "confirmed" },
];

const HISTORY = [
  { student: "Priya M.", avatar: "P", grad: "from-amber-500 to-orange-500", subject: "Science", topic: "Newton's Laws", date: "Yesterday", duration: "45 min", rating: 5, earned: 100 },
  { student: "Meera S.", avatar: "M", grad: "from-pink-500 to-rose-500", subject: "Mathematics", topic: "Coordinate Geometry", date: "Nov 25", duration: "60 min", rating: 5, earned: 130 },
  { student: "Dev R.",   avatar: "D", grad: "from-green-500 to-emerald-600", subject: "Mathematics", topic: "Statistics", date: "Nov 23", duration: "45 min", rating: 4, earned: 100 },
  { student: "Aisha K.", avatar: "A", grad: "from-indigo-500 to-blue-600", subject: "Science", topic: "Periodic Table", date: "Nov 20", duration: "30 min", rating: 5, earned: 80 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];
// available[day][slot]
const AVAIL = {
  "Mon": ["5 PM","6 PM","7 PM"], "Tue": ["5 PM","6 PM"],
  "Wed": ["6 PM","7 PM"],       "Thu": ["5 PM","7 PM","8 PM"],
  "Fri": ["5 PM","6 PM","7 PM"],"Sat": ["10 AM","11 AM","4 PM","5 PM","6 PM"],
  "Sun": ["10 AM","11 AM","4 PM","5 PM"],
};

export default function SessionManager() {
  const { dark } = useApp();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sessions, setSessions] = useState(UPCOMING);

  const bg    = dark ? "bg-slate-950" : "bg-slate-50";
  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-200";

  return (
  
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`font-display text-3xl italic mb-1 ${text}`}>📅 Sessions</h1>
              <p className={`text-sm ${muted}`}>Manage your upcoming and past mentor sessions</p>
            </div>
            <div className={`text-center px-4 py-2 rounded-2xl border ${card}`}>
              <div className="text-xl font-black text-sky-400">{UPCOMING.length}</div>
              <div className={`text-xs ${muted}`}>Upcoming</div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-1 border-b mb-6 ${divider}`}>
            {["upcoming", "availability", "history"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold capitalize border-b-2 -mb-px transition-all ${
                  activeTab === tab
                    ? "border-sky-500 text-sky-400"
                    : `border-transparent ${muted}`
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* ── Upcoming ── */}
          {activeTab === "upcoming" && (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className={`rounded-2xl border p-5 ${card}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white font-black text-lg shrink-0`}>
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-bold ${text}`}>{s.student}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-sky-900/50 text-sky-300" : "bg-sky-50 text-sky-600"}`}>{s.subject}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{s.mode}</span>
                      </div>
                      <div className={`text-sm font-semibold mb-2 ${muted}`}>{s.topic}</div>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { icon: "📅", val: `${s.date} · ${s.time}` },
                          { icon: "⏱", val: s.duration },
                        ].map(d => (
                          <span key={d.val} className={`text-xs flex items-center gap-1 ${muted}`}>
                            {d.icon} {d.val}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {s.date === "Today" ? (
                        <button className="text-xs font-black text-white bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 transition-all">
                          Join →
                        </button>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-2 rounded-xl text-center ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                          Scheduled
                        </span>
                      )}
                      <button
                        onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${dark ? "border-red-800 text-red-400 hover:bg-red-900/20" : "border-red-200 text-red-500 hover:bg-red-50"}`}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className={`rounded-2xl border p-12 text-center ${card}`}>
                  <div className="text-4xl mb-3">📅</div>
                  <p className={`font-bold ${text}`}>No upcoming sessions</p>
                  <p className={`text-sm ${muted}`}>New session requests will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* ── Availability grid ── */}
          {activeTab === "availability" && (
            <div className={`rounded-2xl border ${card}`}>
              <div className={`px-5 py-4 border-b ${divider}`}>
                <h3 className={`font-bold ${text}`}>Weekly Availability</h3>
                <p className={`text-xs ${muted} mt-0.5`}>Click slots to toggle your availability for students to book</p>
              </div>
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className={`text-left pb-3 font-bold ${muted}`}>Time</th>
                      {DAYS.map(d => (
                        <th key={d} className={`text-center pb-3 font-bold ${text}`}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SLOTS.map(slot => (
                      <tr key={slot}>
                        <td className={`pr-4 py-1.5 font-semibold shrink-0 ${muted}`}>{slot}</td>
                        {DAYS.map(day => {
                          const available = (AVAIL[day] || []).includes(slot);
                          return (
                            <td key={day} className="text-center py-1.5 px-1">
                              <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                available
                                  ? "bg-sky-500 text-white font-bold text-xs hover:bg-sky-400"
                                  : dark ? "bg-slate-800 text-slate-700 hover:bg-slate-700" : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                              }`}>
                                {available ? "✓" : ""}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`px-5 py-3 border-t ${divider} flex justify-end`}>
                <button className="text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 rounded-xl">
                  Save Availability
                </button>
              </div>
            </div>
          )}

          {/* ── History ── */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {/* Summary */}
              <div className={`rounded-2xl border p-5 grid grid-cols-3 gap-4 ${card}`}>
                {[
                  { label: "Total Sessions", val: HISTORY.length + 8, color: "#38BDF8" },
                  { label: "Total Hours",    val: "18h",              color: "#8B5CF6" },
                  { label: "Total Earned",   val: "₹2,400",          color: "#22C55E" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-black text-lg" style={{ color: s.color }}>{s.val}</div>
                    <div className={`text-xs ${muted}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              {HISTORY.map((s, i) => (
                <div key={i} className={`rounded-2xl border p-4 flex items-center gap-4 ${card}`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white font-bold shrink-0`}>{s.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${text}`}>{s.student}</div>
                    <div className={`text-xs ${muted}`}>{s.subject} · {s.topic}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-amber-400">{'★'.repeat(s.rating)}</div>
                    <div className={`text-xs ${muted}`}>{s.date}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-green-400">+₹{s.earned}</div>
                    <div className={`text-xs ${muted}`}>{s.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}