/**
 * MyCredentials.jsx — Mentor's earned Open Badges + teacher endorsements
 * Shareable on WhatsApp, scannable by employers
 */
import { useState } from "react";
import { useApp } from "../../context/AppContext";

const CREDENTIALS = [
  {
    id: "badge-bronze",
    type: "badge",
    title: "Bronze Mentor",
    issuer: "PathwayAI",
    desc: "Completed 12 verified peer mentoring sessions with a minimum 4.0 average rating.",
    earned: true,
    date: "Nov 15, 2025",
    icon: "🏅",
    color: "#CD7F32",
    bg: "rgba(205,127,50,0.12)",
    skills: ["Peer Teaching", "Mathematics", "Communication"],
  },
  {
    id: "badge-math",
    type: "badge",
    title: "Mathematics Expert",
    issuer: "PathwayAI",
    desc: "Demonstrated mastery in teaching Class 9–12 Mathematics with 10+ sessions and 4.5+ rating.",
    earned: true,
    date: "Nov 22, 2025",
    icon: "📐",
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.12)",
    skills: ["Algebra", "Geometry", "Trigonometry", "Calculus"],
  },
  {
    id: "endorsement-1",
    type: "endorsement",
    title: "Teacher Endorsement",
    issuer: "Mrs. Sunita Deshpande",
    issuerRole: "Mathematics Teacher, Govt. High School Pune",
    desc: "Kavya is an exceptional peer mentor. Her ability to explain quadratic equations in simple terms helped 5 of my students improve their grades significantly.",
    earned: true,
    date: "Nov 20, 2025",
    icon: "📚",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.12)",
    skills: ["Student Outcomes", "Curriculum Knowledge"],
  },
  {
    id: "badge-silver",
    type: "badge",
    title: "Silver Mentor",
    issuer: "PathwayAI",
    desc: "Complete 50 sessions with 4.3+ average rating to unlock.",
    earned: false,
    date: null,
    icon: "🥈",
    color: "#94A3B8",
    bg: "rgba(148,163,184,0.08)",
    skills: ["Advanced Teaching", "Curriculum Design"],
    progress: 24,
    goal: 50,
  },
  {
    id: "badge-gold",
    type: "badge",
    title: "Gold Mentor",
    issuer: "PathwayAI",
    desc: "Complete 150 sessions with 4.5+ average rating to unlock.",
    earned: false,
    date: null,
    icon: "🥇",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    skills: ["Mentorship Excellence", "Career Readiness"],
    progress: 24,
    goal: 150,
  },
];

function CredentialCard({ cred, dark }) {
  const [shared, setShared] = useState(false);
  const text  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className={`rounded-2xl border p-5 ${card} ${!cred.earned ? "opacity-50" : ""}`}
      style={cred.earned ? { borderColor: `${cred.color}35`, boxShadow: `0 0 20px ${cred.color}08` } : {}}>

      {/* Top accent */}
      {cred.earned && (
        <div className="h-1 rounded-full mb-4 -mx-5 -mt-5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${cred.color}, transparent)` }} />
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: cred.bg }}>
          {cred.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className={`font-bold ${text}`}>{cred.title}</h3>
              <p className={`text-xs ${muted}`}>
                {cred.type === "endorsement" ? `${cred.issuer} · ${cred.issuerRole}` : `Issued by ${cred.issuer}`}
                {cred.date && ` · ${cred.date}`}
              </p>
            </div>
            {/* Type pill */}
            <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: cred.bg, color: cred.color }}>
              {cred.type === "endorsement" ? "Endorsement" : "Badge"}
            </span>
          </div>

          <p className={`text-xs leading-relaxed mb-3 ${muted}`}>{cred.desc}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {cred.skills.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: cred.bg, color: cred.color }}>
                {s}
              </span>
            ))}
          </div>

          {/* Progress bar (locked badges) */}
          {!cred.earned && cred.progress !== undefined && (
            <div>
              <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                <div className="h-full rounded-full" style={{ width: `${(cred.progress / cred.goal) * 100}%`, background: cred.color }} />
              </div>
              <p className={`text-xs mt-1 ${muted}`}>{cred.progress} / {cred.goal} sessions</p>
            </div>
          )}

          {/* Share actions */}
          {cred.earned && (
            <div className="flex gap-2">
              <button onClick={handleShare}
                className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                style={{ background: shared ? "rgba(34,197,94,0.15)" : cred.bg, color: shared ? "#22C55E" : cred.color, border: `1px solid ${shared ? "rgba(34,197,94,0.3)" : cred.color + "40"}` }}>
                {shared ? "✓ Link copied!" : "🔗 Share"}
              </button>
              <button className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${dark ? "border-slate-700 text-slate-400 hover:text-slate-200" : "border-slate-200 text-slate-500 hover:text-slate-700"}`}>
                📱 WhatsApp
              </button>
              <button className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${dark ? "border-slate-700 text-slate-400 hover:text-slate-200" : "border-slate-200 text-slate-500 hover:text-slate-700"}`}>
                💼 LinkedIn
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyCredentials() {
  const { dark } = useApp();
  const [filter, setFilter] = useState("all");

  const bg    = dark ? "bg-slate-950" : "bg-slate-50";
  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-200";

  const earned = CREDENTIALS.filter(c => c.earned);
  const filtered = filter === "all" ? CREDENTIALS : filter === "earned" ? earned : CREDENTIALS.filter(c => c.type === filter);

  return (
    
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className={`font-display text-3xl italic mb-1 ${text}`}>🏅 My Credentials</h1>
            <p className={`text-sm ${muted}`}>Your Open Badges and teacher endorsements — shareable, scannable, verifiable</p>
          </div>

          {/* Summary */}
          <div className={`rounded-2xl border p-5 mb-6 grid grid-cols-3 gap-4 ${card}`}>
            {[
              { label: "Badges Earned",    val: earned.filter(c => c.type === "badge").length,       color: "#F59E0B", icon: "🏅" },
              { label: "Endorsements",     val: earned.filter(c => c.type === "endorsement").length,  color: "#14B8A6", icon: "📚" },
              { label: "Skills Verified",  val: earned.reduce((acc, c) => acc + c.skills.length, 0),  color: "#8B5CF6", icon: "⭐" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className={`text-xs ${muted}`}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className={`flex gap-2 flex-wrap border-b pb-4 mb-5 ${divider}`}>
            {[
              { id: "all",         label: `All (${CREDENTIALS.length})` },
              { id: "earned",      label: `Earned (${earned.length})` },
              { id: "badge",       label: "Badges" },
              { id: "endorsement", label: "Endorsements" },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                  filter === f.id
                    ? "bg-amber-500 text-white border-amber-500"
                    : dark ? "border-slate-700 text-slate-400 hover:border-amber-600 hover:text-amber-400" : "border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-600"
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Credential cards */}
          <div className="space-y-4">
            {filtered.map(cred => (
              <CredentialCard key={cred.id} cred={cred} dark={dark} />
            ))}
          </div>

          {/* Bottom note */}
          <div className={`mt-8 rounded-2xl border p-5 text-center ${card}`}>
            <p className={`text-xs ${muted} mb-1`}>All credentials are verifiable Open Badges hosted by PathwayAI</p>
            <p className={`text-xs font-bold ${dark ? "text-sky-400" : "text-sky-600"}`}>
              Share your credential link — employers can scan and verify instantly
            </p>
          </div>
        </div>
      </div>
 
  );
}