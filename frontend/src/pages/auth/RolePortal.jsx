/**
 * RolePortal.jsx
 * Role selection page — fully matched to the enhanced LandingPage.
 * Same design tokens: DM Serif Display, Plus Jakarta Sans, sky/slate palette,
 * mesh background, glass cards, glow effects, dark/light toggle.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── Shared CSS (imports fonts + shared animations from LandingPage) ── */
const PORTAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
  .font-display { font-family: 'DM Serif Display', serif; }

  @keyframes orb-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.08); }
  }
  @keyframes mesh-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(24px, -16px) scale(1.04); }
    66%       { transform: translate(-16px, 24px) scale(0.97); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ping-slow {
    0%   { transform: scale(1); opacity: 0.8; }
    80%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.25); }
    50%       { box-shadow: 0 0 50px rgba(56,189,248,0.55), 0 0 80px rgba(56,189,248,0.15); }
  }
  @keyframes card-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }

  .orb          { animation: orb-pulse 6s ease-in-out infinite; }
  .orb-drift    { animation: mesh-drift 14s ease-in-out infinite; }
  .animate-fade-up  { animation: fade-up  0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-ping-slow { animation: ping-slow 2.5s ease-out infinite; }
  .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }
  .delay-6 { animation-delay: 0.6s; }
  .delay-7 { animation-delay: 0.7s; }

  .text-shimmer {
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .role-card {
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                box-shadow  0.4s cubic-bezier(0.16,1,0.3,1),
                border-color 0.3s ease;
  }
  .role-card:hover { transform: translateY(-10px) scale(1.02); }

  .glass-dark  { background: rgba(13,29,52,0.72); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
  .glass-light { background: rgba(255,255,255,0.78); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }

  /* smooth theme transitions */
  *, *::before, *::after {
    transition-property: background-color, border-color, color, box-shadow;
    transition-duration: 0.32s;
    transition-timing-function: ease;
  }
  .role-card, .orb, .orb-drift, .animate-fade-up, .animate-scale-in,
  .animate-ping-slow, .animate-glow-pulse { transition-property: none; }
  .role-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.3s; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(56,139,199,0.4); border-radius: 3px; }
`;

/* ── Icons ── */
const LogoMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <defs>
      <linearGradient id="rp-lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8"/><stop offset="1" stopColor="#1A5A9A"/>
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#rp-lg)"/>
    <path d="M8 9h9a5.5 5.5 0 0 1 0 11H8V9z" fill="white" fillOpacity="0.95"/>
    <circle cx="27" cy="24" r="3.5" fill="white" fillOpacity="0.85"/>
    <line x1="27" y1="9" x2="27" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.35"/>
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ── Mesh background (same as LandingPage) ── */
function MeshBg({ dark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        background: dark
          ? "radial-gradient(ellipse at 30% 40%, #0d2744 0%, #060d1a 55%, #0a1628 100%)"
          : "radial-gradient(ellipse at 30% 40%, #dbeafe 0%, #f0f9ff 55%, #eff6ff 100%)"
      }}/>
      <div className="orb orb-drift absolute rounded-full" style={{
        width: 560, height: 560, top: "-20%", left: "-12%",
        background: dark
          ? "radial-gradient(circle, rgba(56,139,199,0.22) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(56,139,199,0.18) 0%, transparent 70%)"
      }}/>
      <div className="orb absolute rounded-full" style={{
        width: 440, height: 440, animationDelay: "2.5s",
        top: "40%", right: "-10%",
        background: dark
          ? "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)"
      }}/>
      <div className="orb absolute rounded-full" style={{
        width: 320, height: 320, animationDelay: "4.5s",
        bottom: "5%", left: "35%",
        background: dark
          ? "radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)"
      }}/>
      <div className="absolute inset-0" style={{
        backgroundImage: dark
          ? "linear-gradient(rgba(56,139,199,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,199,0.035) 1px, transparent 1px)"
          : "linear-gradient(rgba(56,139,199,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,199,0.055) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }}/>
    </div>
  );
}

/* ── Role data ── */
const ROLES = [
  {
    id: "student",
    emoji: "🎓",
    title: "Student",
    tagline: "Learn in your language",
    desc: "AI tutoring in 9 Indian languages, personalised study plans, offline lessons, peer mentors, and skill credentials — all free.",
    perks: ["AI Tutor in 9 languages", "Works offline on 2G", "Peer mentor sessions", "Skill credentials & Open Badges"],
    accent: "#38BDF8",
    gradFrom: "from-sky-500",
    gradTo: "to-blue-600",
    borderD: "border-sky-700/60 hover:border-sky-500",
    borderL: "border-sky-200 hover:border-sky-400",
    glowD: "rgba(56,189,248,0.18)",
    glowL: "rgba(56,189,248,0.14)",
    tagBg: "rgba(56,189,248,0.14)",
    btnPath: "/signup/student",
    loginPath: "/login/student",
  },
  {
    id: "teacher",
    emoji: "📚",
    title: "Teacher",
    tagline: "See your classroom clearly",
    desc: "AI assessment generator, real-time class heatmap, struggle score alerts, and resource sharing — all in one dashboard.",
    perks: ["AI assessment generator", "Real-time class heatmap", "Struggle score early alerts", "1-on-1 session scheduling"],
    accent: "#14B8A6",
    gradFrom: "from-teal-500",
    gradTo: "to-cyan-600",
    borderD: "border-teal-700/60 hover:border-teal-500",
    borderL: "border-teal-200 hover:border-teal-400",
    glowD: "rgba(20,184,166,0.18)",
    glowL: "rgba(20,184,166,0.14)",
    tagBg: "rgba(20,184,166,0.14)",
    btnPath: "/signup/teacher",
    loginPath: "/login/teacher",
  },
  {
    id: "mentor",
    emoji: "⭐",
    title: "Peer Mentor",
    tagline: "Teach, earn, grow",
    desc: "Set your own schedule, earn ₹50–₹150 per session, get teacher endorsements, and build a verifiable credential portfolio.",
    perks: ["₹50–₹150 per session", "88% payout direct to UPI", "Bronze → Silver → Gold tiers", "Teacher-endorsed credentials"],
    accent: "#F59E0B",
    gradFrom: "from-amber-500",
    gradTo: "to-orange-500",
    borderD: "border-amber-700/60 hover:border-amber-500",
    borderL: "border-amber-200 hover:border-amber-400",
    glowD: "rgba(245,158,11,0.18)",
    glowL: "rgba(245,158,11,0.14)",
    tagBg: "rgba(245,158,11,0.14)",
    btnPath: "/signup/mentor",
    loginPath: "/login/mentor",
  },
];

/* ── Role Card ── */
function RoleCard({ role, dark, index, navigate }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className={`animate-fade-up delay-${index + 2}`}
      style={{ animationDelay: `${0.15 + index * 0.1}s` }}
    >
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={`role-card relative rounded-3xl p-7 border h-full flex flex-col cursor-default overflow-hidden
          ${dark ? `bg-slate-900/70 backdrop-blur-sm ${role.borderD}` : `bg-white/80 backdrop-blur-sm ${role.borderL}`}`}
        style={{
          boxShadow: hov
            ? `0 24px 64px ${dark ? role.glowD : role.glowL}, 0 4px 20px rgba(0,0,0,0.1)`
            : `0 4px 24px rgba(0,0,0,${dark ? "0.2" : "0.06"})`,
        }}
      >
        {/* Radial glow on hover */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 10% 10%, ${role.accent}14 0%, transparent 65%)`,
            opacity: hov ? 1 : 0,
          }}
        />

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 h-1 rounded-t-3xl pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${role.accent}, transparent)`,
            width: hov ? "100%" : "35%",
            opacity: hov ? 0.9 : 0.45,
            transition: "width 0.45s ease, opacity 0.45s ease",
          }}
        />

        {/* Tag */}
        <div
          className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit"
          style={{ background: role.tagBg, color: role.accent }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: role.accent }} />
          {role.tagline}
        </div>

        {/* Emoji */}
        <div
          className="text-5xl mb-4 transition-transform duration-300"
          style={{ transform: hov ? "scale(1.15) rotate(-4deg)" : "scale(1)" }}
        >
          {role.emoji}
        </div>

        {/* Title */}
        <h2 className={`font-display text-2xl italic mb-3 tracking-tight ${dark ? "text-white" : "text-slate-800"}`}>
          {role.title}
        </h2>

        {/* Desc */}
        <p className={`text-sm leading-relaxed mb-6 flex-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {role.desc}
        </p>

        {/* Perks */}
        <ul className="space-y-2.5 mb-7">
          {role.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm" style={{ color: dark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" }}>
              <span style={{ color: role.accent }}><CheckCircle /></span>
              {perk}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => navigate(role.btnPath)}
            className={`w-full flex items-center justify-center gap-2 font-bold text-white text-sm py-3.5 rounded-2xl
              bg-gradient-to-r ${role.gradFrom} ${role.gradTo}
              shadow-lg hover:-translate-y-0.5 active:translate-y-0 animate-glow-pulse`}
            style={{ boxShadow: `0 6px 24px ${role.accent}35` }}
          >
            Sign Up as {role.title} <ArrowRight />
          </button>
          <button
            onClick={() => navigate(role.loginPath)}
            className={`w-full font-semibold text-sm py-3 rounded-2xl border-2 transition-all duration-200
              hover:-translate-y-0.5`}
            style={{
              borderColor: `${role.accent}55`,
              color: role.accent,
              background: hov ? `${role.accent}0f` : "transparent",
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Root ── */
export default function RolePortal() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);

  // Read dark preference from localStorage if set by LandingPage
  useEffect(() => {
    const stored = localStorage.getItem("pathwayai-dark");
    if (stored !== null) setDark(stored === "true");
  }, []);

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem("pathwayai-dark", String(!d));
      return !d;
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PORTAL_CSS }} />
      <div className={`w-full min-h-screen overflow-x-hidden relative ${dark ? "text-white" : "text-slate-900"}`}>
        <MeshBg dark={dark} />

        {/* ── Top bar ── */}
        <div className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-5 md:px-10
          ${dark ? "glass-dark border-b border-white/8" : "glass-light border-b border-sky-100/80"}`}
          style={{ borderBottomWidth: 1 }}
        >
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <LogoMark />
            <span className={`font-display text-xl tracking-tight ${dark ? "text-white" : "text-slate-800"}`}>
              Pathway<span className="text-sky-500 font-bold">AI</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            {/* Back link */}
            <button
              onClick={() => navigate("/")}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all
                ${dark ? "border-slate-700 text-slate-400 hover:border-sky-700 hover:text-sky-400" : "border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600"}`}
            >
              ← Back to home
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleDark}
              className={`relative flex items-center w-14 h-7 rounded-full px-1 focus:outline-none ${dark ? "bg-sky-600" : "bg-slate-200"}`}
              style={{ transition: "background 0.3s ease" }}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md bg-white ${dark ? "translate-x-7" : "translate-x-0"}`}
                style={{ transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", color: dark ? "#0284c7" : "#f59e0b" }}
              >
                {dark ? <Moon /> : <Sun />}
              </div>
            </button>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 pt-28 pb-20">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-7 border"
              style={{
                background: dark ? "rgba(56,139,199,0.14)" : "rgba(56,139,199,0.08)",
                borderColor: dark ? "rgba(56,139,199,0.38)" : "rgba(56,139,199,0.28)"
              }}>
              <span className="animate-ping-slow inline-flex w-2 h-2 rounded-full bg-sky-400" />
              <span className={`text-xs font-bold tracking-widest uppercase ${dark ? "text-sky-300" : "text-sky-700"}`}>
                Choose Your Role
              </span>
            </div>

            <h1 className="animate-fade-up delay-1 font-display text-5xl md:text-6xl italic tracking-tight mb-4">
              <span className={dark ? "text-white" : "text-slate-900"}>Who are you</span>
              <br />
              <span className="text-shimmer">joining as?</span>
            </h1>

            <p className={`animate-fade-up delay-2 text-base md:text-lg max-w-lg mx-auto leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>
              PathwayAI adapts entirely to your role. Pick yours and get an experience built for you.
            </p>
          </div>

          {/* Role cards — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {ROLES.map((role, i) => (
              <RoleCard key={role.id} role={role} dark={dark} index={i} navigate={navigate} />
            ))}
          </div>

          {/* Trust strip */}
          <div className={`animate-fade-up delay-6 rounded-2xl border p-6 flex flex-wrap items-center justify-center gap-8 ${dark ? "bg-slate-900/50 border-slate-800 backdrop-blur-sm" : "bg-white/60 border-slate-200 backdrop-blur-sm"}`}>
            {[
              { icon: "📶", text: "Works on 2G & offline" },
              { icon: "🗣️", text: "9 Indian languages" },
              { icon: "🆓", text: "Always free for students" },
              { icon: "🔒", text: "No ads, ever" },
              { icon: "🏅", text: "Verifiable credentials" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base">{t.icon}</span>
                <span className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>{t.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className={`text-center text-xs mt-7 ${dark ? "text-slate-600" : "text-slate-400"}`}>
            PathwayAI is{" "}
            <span className={`font-bold ${dark ? "text-slate-400" : "text-slate-600"}`}>
              always free for students.
            </span>{" "}
            No credit card. No catch.
          </p>
        </div>
      </div>
    </>
  );
}