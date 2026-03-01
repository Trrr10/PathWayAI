// Employers.jsx
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";
import { employerData } from "../../data/allData";

export default function Employers() {
  const { dark } = useApp();
  const [applying, setApplying] = useState(null);
  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-5xl mx-auto">
          <h1 className={`font-display text-3xl italic mb-2 ${text}`}>💼 Employers</h1>
          <p className={`text-sm ${muted} mb-8`}>Companies that accept PathwayAI credentials for direct shortlisting. Your badge matters here.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {employerData.map(emp => (
              <div key={emp.id} className={`rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${card}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${emp.logoGradient} flex items-center justify-center text-white font-black text-lg shrink-0`}>
                    {emp.logo}
                  </div>
                  <div>
                    <div className={`font-black ${text}`}>{emp.name}</div>
                    <div className={`text-sm font-semibold ${muted}`}>{emp.role}</div>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{emp.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{emp.location}</span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${muted}`}>{emp.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {emp.skills.map(s => <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-sky-900/30 text-sky-300" : "bg-sky-100 text-sky-700"}`}>{s}</span>)}
                </div>
                <div className={`flex justify-between text-sm mb-4 ${text}`}>
                  <span className="font-bold text-emerald-400">{emp.salary}</span>
                  <span className={`text-xs ${muted}`}>{emp.openings} openings · Deadline: {emp.deadline}</span>
                </div>
                {emp.requiredBadge && (
                  <div className={`text-xs font-bold mb-3 px-3 py-2 rounded-lg ${dark ? "bg-amber-900/30 text-amber-300" : "bg-amber-50 text-amber-700"}`}>
                    ⭐ Requires {emp.requiredBadge} Mentor Badge for priority shortlisting
                  </div>
                )}
                <button onClick={() => setApplying(emp)}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {applying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-sm rounded-3xl border p-6 ${card}`}>
            <h2 className={`font-bold text-lg mb-1 ${text}`}>Apply to {applying.name}</h2>
            <p className={`text-xs ${muted} mb-4`}>{applying.role}</p>
            <p className={`text-sm ${muted} mb-6`}>Your PathwayAI credential portfolio will be shared with {applying.name}. Employers receive your verified skill badges automatically.</p>
            <div className="flex gap-3">
              <button onClick={() => { alert("Application submitted! (Backend integration coming soon)"); setApplying(null); }}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl text-sm">
                Submit Application
              </button>
              <button onClick={() => setApplying(null)} className={`flex-1 font-bold py-3 rounded-xl text-sm border ${dark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-600"}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}