// ResumeBuilder.jsx
import { useState } from "react";

import { useApp } from "../../context/AppContext";

export default function ResumeBuilder() {
  const { dark, user } = useApp();
  const [form, setForm] = useState({
    name: user?.name || "Kavya Nair",
    email: user?.email || "kavya@example.com",
    phone: "+91 98765 43210",
    location: "Kochi, Kerala",
    objective: "Motivated Class 12 student with proven mathematical excellence, certified peer mentor, and strong communication skills in 3 languages.",
    skills: ["Mathematics", "Communication", "Hindi", "Malayalam", "English", "Teaching"],
  });

  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const inputCls = `w-full text-sm rounded-xl border px-4 py-3 outline-none ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600" : "bg-white border-slate-300 text-slate-800 placeholder-slate-400"}`;

  return (
    
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`font-display text-3xl italic mb-2 ${text}`}>📄 Resume Builder</h1>
          <p className={`text-sm ${muted} mb-8`}>Your PathwayAI credentials automatically populate your resume. Download as PDF or share as link.</p>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h2 className={`font-bold text-sm mb-5 ${text}`}>Edit Details</h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Email", key: "email" },
                  { label: "Phone", key: "phone" },
                  { label: "Location", key: "location" },
                ].map(f => (
                  <div key={f.key}>
                    <label className={`block text-xs font-bold mb-1.5 ${muted}`}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${muted}`}>Objective</label>
                  <textarea value={form.objective} onChange={e => setForm(p => ({ ...p, objective: e.target.value }))} rows={4} className={`${inputCls} resize-none`} />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl text-sm"
                  onClick={() => alert("PDF download coming soon with backend integration!")}>
                  Download PDF →
                </button>
                <button className={`flex-1 font-bold py-3 rounded-xl text-sm border ${dark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-600"}`}>
                  Share Link
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className={`rounded-2xl border p-6 font-mono text-xs ${card}`}>
              <div className={`border-b pb-4 mb-4 ${dark ? "border-slate-700" : "border-slate-200"}`}>
                <div className={`text-lg font-black ${text}`}>{form.name}</div>
                <div className={muted}>{form.email} · {form.phone} · {form.location}</div>
              </div>
              <div className={`font-bold text-sky-400 text-xs uppercase tracking-wider mb-1`}>Objective</div>
              <p className={`text-xs leading-relaxed mb-4 ${text}`}>{form.objective}</p>

              <div className={`font-bold text-sky-400 text-xs uppercase tracking-wider mb-2`}>PathwayAI Credentials</div>
              {["🏅 Mathematics Mastery — Gold", "🥈 Science Explorer — Silver", "⭐ Peer Mentor — Bronze"].map(c => (
                <div key={c} className={`text-xs mb-1 ${text}`}>• {c}</div>
              ))}

              <div className={`font-bold text-sky-400 text-xs uppercase tracking-wider mb-2 mt-4`}>Skills</div>
              <div className="flex flex-wrap gap-1">
                {form.skills.map(s => <span key={s} className={`text-xs px-2 py-0.5 rounded ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}