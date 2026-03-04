/**
 * Dashboard.jsx — PathWay AI · Soft Aesthetic Edition
 * Aesthetic: Warm cream + dusty sage + soft lavender · Glassmorphism · Serene · Professional
 * Fonts: Cormorant Garamond (display) + Figtree (body)
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  /* Backgrounds */
  bg:        "linear-gradient(145deg, #f5f0eb 0%, #ede8f0 35%, #e8eef5 65%, #eef2e8 100%)",
  bgSolid:   "#f5f0eb",

  /* Glass surfaces */
  glass:     "rgba(255,255,255,0.55)",
  glassDark: "rgba(255,255,255,0.35)",
  glassDeep: "rgba(255,255,255,0.72)",

  /* Borders */
  border:    "rgba(255,255,255,0.7)",
  borderSub: "rgba(200,195,210,0.35)",

  /* Text */
  ink:       "#2d2a35",
  inkMid:    "#5a5468",
  inkSoft:   "#8c87a0",
  inkFaint:  "#b8b3c8",

  /* Accents */
  sage:      "#7fa88a",     /* soft green */
  sageL:     "#a8c9b0",
  sageXL:    "#d4e8da",
  lavender:  "#9b8ec4",     /* soft purple */
  lavenderL: "#c4b9e8",
  lavenderXL:"#e8e4f5",
  blush:     "#c4788a",     /* rose */
  blushL:    "#e8b4be",
  blushXL:   "#f8e8ec",
  sand:      "#c4a882",
  sandL:     "#e8d4b8",
  sandXL:    "#f8f0e4",

  /* Shadows */
  shadowSm:  "0 2px 12px rgba(100,90,130,0.08)",
  shadowMd:  "0 8px 32px rgba(100,90,130,0.12)",
  shadowLg:  "0 20px 60px rgba(100,90,130,0.16)",
  shadowXl:  "0 32px 80px rgba(100,90,130,0.2)",

  /* Glows */
  sageGlow:  "0 0 24px rgba(127,168,138,0.25)",
  lavGlow:   "0 0 24px rgba(155,142,196,0.25)",
  blushGlow: "0 0 24px rgba(196,120,138,0.25)",
};

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Figtree:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Figtree', sans-serif;
    background: #f5f0eb;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(155,142,196,0.3); border-radius: 10px; }

  /* ── Fonts ── */
  .garamond    { font-family: 'Cormorant Garamond', serif; }
  .mono-text   { font-family: 'DM Mono', monospace; }

  /* ── Keyframes ── */
  @keyframes softUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatOrb {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(20px,-15px) scale(1.05); }
    66%      { transform: translate(-15px,10px) scale(0.97); }
  }
  @keyframes floatOrb2 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(-25px,20px) scale(0.94); }
    66%      { transform: translate(18px,-12px) scale(1.04); }
  }
  @keyframes shimmerSoft {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes breathe {
    0%,100% { opacity: 0.6; transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.015); }
  }
  @keyframes barFill {
    from { width: 0; }
    to   { width: var(--w); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes ringGrow {
    from { stroke-dashoffset: var(--circ); }
    to   { stroke-dashoffset: var(--off); }
  }
  @keyframes softBlink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }
  @keyframes spinRing {
    to { transform: rotate(360deg); }
  }
  @keyframes ripple {
    0%   { transform: scale(0.8); opacity: 0.6; }
    100% { transform: scale(2);   opacity: 0; }
  }
  @keyframes camLine {
    0%   { top: 0%; opacity: 0.7; }
    100% { top: 100%; opacity: 0; }
  }

  /* ── Delays ── */
  .fade-up { animation: softUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
  .d1 { animation-delay: 0.07s; }  .d2 { animation-delay: 0.14s; }
  .d3 { animation-delay: 0.21s; }  .d4 { animation-delay: 0.28s; }
  .d5 { animation-delay: 0.35s; }  .d6 { animation-delay: 0.42s; }
  .d7 { animation-delay: 0.49s; }

  /* ── Glass card ── */
  .glass-card {
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.7);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(100,90,130,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.35s ease;
    position: relative;
    overflow: hidden;
  }
  .glass-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
  }
  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(100,90,130,0.18), inset 0 1px 0 rgba(255,255,255,0.9);
  }

  /* ── Stat card variant ── */
  .stat-glass {
    background: rgba(255,255,255,0.62);
    backdrop-filter: blur(24px) saturate(200%);
    -webkit-backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(100,90,130,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
    position: relative; overflow: hidden;
  }
  .stat-glass:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(100,90,130,0.16); }
  .stat-glass::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Shimmer text ── */
  .shimmer-name {
    background: linear-gradient(90deg, #7fa88a 0%, #9b8ec4 40%, #c4788a 70%, #7fa88a 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerSoft 5s linear infinite;
  }

  /* ── Score bar ── */
  .score-fill {
    height: 100%; border-radius: 999px;
    animation: barFill 1.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── Action button ── */
  .soft-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    cursor: pointer; width: 100%; text-align: left;
    font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500;
    color: #5a5468;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    position: relative; overflow: hidden;
  }
  .soft-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--btn-bg, rgba(127,168,138,0.08));
    opacity: 0; transition: opacity 0.25s;
  }
  .soft-btn:hover { transform: translateX(4px); border-color: rgba(255,255,255,0.85); box-shadow: 0 4px 20px rgba(100,90,130,0.1); }
  .soft-btn:hover::before { opacity: 1; }

  .btn-icon {
    width: 30px; height: 30px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--icon-bg, rgba(127,168,138,0.15));
    border: 1px solid var(--icon-border, rgba(127,168,138,0.25));
    transition: all 0.25s;
  }
  .soft-btn:hover .btn-icon {
    box-shadow: 0 4px 12px var(--icon-glow, rgba(127,168,138,0.3));
    transform: scale(1.08);
  }

  /* ── Plan row ── */
  .plan-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 14px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    border: 1px solid transparent;
  }
  .plan-row:hover {
    background: rgba(255,255,255,0.5);
    border-color: rgba(255,255,255,0.7);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(100,90,130,0.08);
  }

  /* ── Tab button ── */
  .tab-pill {
    padding: 6px 16px; border-radius: 999px;
    font-family: 'Figtree', sans-serif;
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.25s ease;
    border: none;
  }

  /* ── Live dot ── */
  .pulse-dot { animation: softBlink 2.2s ease-in-out infinite; }

  /* ── Camera ── */
  .cam-glass {
    border-radius: 18px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.7);
    box-shadow: 0 8px 32px rgba(100,90,130,0.12);
    position: relative; line-height: 0;
  }
  .cam-glow {
    box-shadow: 0 0 0 2px rgba(127,168,138,0.3), 0 8px 40px rgba(127,168,138,0.2);
    animation: breathe 3s ease-in-out infinite;
  }

  /* ── Toast ── */
  .toast-soft {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 13px 20px; border-radius: 16px;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 12px 40px rgba(100,90,130,0.18);
    color: #2d2a35; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    animation: toastIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
    font-family: 'Figtree', sans-serif;
  }

  /* ── Ripple on live badge ── */
  .ripple-ring {
    position: absolute; inset: -4px; border-radius: 50%;
    border: 1.5px solid var(--rcolor, #7fa88a);
    animation: ripple 2s ease-out infinite;
  }

  /* ── Toggle ── */
  .toggle-track {
    width: 44px; height: 24px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.7);
    cursor: pointer; padding: 3px; display: flex; align-items: center;
    transition: background 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .toggle-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: white; box-shadow: 0 2px 8px rgba(100,90,130,0.2);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* Credential ring animation */
  .cred-ring circle.fill {
    animation: ringGrow 1.4s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* Weekly bar */
  .week-bar-inner {
    transition: height 1.2s cubic-bezier(0.16,1,0.3,1);
  }

  @media (max-width: 980px) {
    .main-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 640px) {
    .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
    .dash-pad   { padding: 18px 16px !important; }
  }
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const STRUGGLE = [
  { sub: "Mathematics", score: 62, tag: "Quadratic Eq.", trend: -3, accent: T.lavender,  accentL: T.lavenderL,  accentXL: T.lavenderXL },
  { sub: "Science",     score: 78, tag: "Newton's Laws",  trend: +5, accent: T.sage,      accentL: T.sageL,      accentXL: T.sageXL     },
  { sub: "History",     score: 85, tag: "Freedom Mvmt.",  trend: +2, accent: T.blush,     accentL: T.blushL,     accentXL: T.blushXL    },
  { sub: "English",     score: 70, tag: "Essay Writing",  trend: +1, accent: T.sand,      accentL: T.sandL,      accentXL: T.sandXL     },
];

const PLAN_INIT = [
  { time: "4:00 PM", sub: "Mathematics", topic: "Quadratic Equations — Factorisation", type: "Lesson", done: false, dur: "60 min", accent: T.lavender },
  { time: "5:00 PM", sub: "Science",     topic: "Newton's Laws — Quiz",               type: "Quiz",   done: true,  dur: "30 min", accent: T.sage    },
  { time: "5:30 PM", sub: "History",     topic: "Non-Cooperation Movement",           type: "Lesson", done: false, dur: "45 min", accent: T.blush   },
  { time: "6:15 PM", sub: "English",     topic: "Essay Writing — Argument Structure", type: "Lesson", done: false, dur: "40 min", accent: T.sand    },
];

const STATS = [
  { label: "Day Streak",    value: "12",     sub: "+2 this week",  accent: T.sage,      accentXL: T.sageXL,      sym: "↑" },
  { label: "Sessions / wk", value: "6",      sub: "On track",       accent: T.lavender,  accentXL: T.lavenderXL,  sym: "◎" },
  { label: "Earned",         value: "₹2,400", sub: "+₹400 today",   accent: T.blush,     accentXL: T.blushXL,     sym: "◈" },
  { label: "Credentials",   value: "3",      sub: "1 pending",     accent: T.sand,      accentXL: T.sandXL,      sym: "◆" },
];

const ACTIONS = [
  { label: "Ask AI Tutor",      path: "/student/ai-tutor",    accent: T.sage,     accentXL: T.sageXL,     icon: "AI",  badge: null     },
  { label: "Take a Quiz",       path: "/student/quiz",        accent: T.lavender, accentXL: T.lavenderXL, icon: "QZ",  badge: "3 new"  },
  { label: "Find a Mentor",     path: "/student/mentors",     accent: T.blush,    accentXL: T.blushXL,    icon: "MT",  badge: null     },
  { label: "Credentials",       path: "/student/credentials", accent: T.sand,     accentXL: T.sandXL,     icon: "CR",  badge: "Ready"  },
  { label: "Browse Employers",  path: "/student/employers",   accent: T.sage,     accentXL: T.sageXL,     icon: "EM",  badge: null     },
  { label: "Study Plan",        path: "/student/study-plan",  accent: T.lavender, accentXL: T.lavenderXL, icon: "SP",  badge: null     },
  { label: "Animated Lessons",  path: "/student/lessons",     accent: T.blush,    accentXL: T.blushXL,    icon: "AL",  badge: "New"    },
  { label: "Voice Notes",       path: "/student/voice-notes", accent: T.sand,     accentXL: T.sandXL,     icon: "VN",  badge: null     },
];

const WEEKLY = [
  { d: "Mon", n: 2, goal: 3 }, { d: "Tue", n: 3, goal: 3 },
  { d: "Wed", n: 1, goal: 3 }, { d: "Thu", n: 3, goal: 3 },
  { d: "Fri", n: 2, goal: 3 }, { d: "Sat", n: 0, goal: 3 },
  { d: "Sun", n: 0, goal: 3 },
];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function SLabel({ children, accent = T.sage }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
      <div style={{ width: 4, height: 4, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}` }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: T.inkSoft, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Figtree', sans-serif" }}>
        {children}
      </span>
    </div>
  );
}

function RingProgress({ value, size = 48, stroke = 3.5, accent = T.sage }) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={accent + "25"} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={accent} strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={off}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 4px ${accent}60)` }}
      />
    </svg>
  );
}

function WeekChart() {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
      {WEEKLY.map((d, i) => {
        const pct  = d.n / d.goal;
        const now  = i === 2;
        const done = d.n >= d.goal;
        const color = now ? T.lavender : done ? T.sage : T.inkFaint;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: "100%", height: 48, borderRadius: 8, overflow: "hidden", background: "rgba(200,195,210,0.15)", position: "relative" }}>
              <div className="week-bar-inner" style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: `${pct * 100}%`,
                background: now
                  ? `linear-gradient(180deg, ${T.lavenderL}, ${T.lavender})`
                  : done
                  ? `linear-gradient(180deg, ${T.sageL}, ${T.sage})`
                  : "rgba(200,195,210,0.3)",
                borderRadius: "6px 6px 0 0",
                boxShadow: now ? `0 -4px 12px ${T.lavender}40` : done ? `0 -4px 10px ${T.sage}35` : "none",
              }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>{d.d}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
export default function Dashboard() {
  const { user, dark, toggleDark } = useApp();
  const navigate = useNavigate();

  const videoRef  = useRef(null);
  const [letter,    setLetter]    = useState("");
  const [detecting, setDetecting] = useState(false);
  const [camReady,  setCamReady]  = useState(false);
  const [camError,  setCamError]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [plan,      setPlan]      = useState(PLAN_INIT);
  const [tab,       setTab]       = useState("plan");
  const [history,   setHistory]   = useState([]);
  const [clock,     setClock]     = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => { if (videoRef.current) { videoRef.current.srcObject = s; setCamReady(true); } })
      .catch(() => setCamError(true));
    return () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); };
  }, []);

  const showToast = (msg, accent = T.sage) => {
    setToast({ msg, accent });
    setTimeout(() => setToast(null), 3000);
  };

  const detect = async () => {
    if (!videoRef.current || detecting) return;
    setDetecting(true); setLetter("");
    const c = document.createElement("canvas");
    c.width = 300; c.height = 300;
    c.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 300);
    const blob = await new Promise(r => c.toBlob(r, "image/jpeg"));
    const fd   = new FormData(); fd.append("file", blob);
    try {
      const res  = await fetch("http://127.0.0.1:8000/detect-sign", { method: "POST", body: fd });
      const data = await res.json();
      const l    = data.letter || data.word || data.result || JSON.stringify(data);
      setLetter(l);
      setHistory(h => [{ l, t: clock.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) }, ...h.slice(0, 4)]);
      showToast(`Detected: ${l}`);
    } catch {
      setLetter("Backend offline");
      showToast("Could not reach backend", T.blush);
    } finally { setDetecting(false); }
  };

  const togglePlan = (i) => {
    setPlan(prev => {
      const n = [...prev]; n[i] = { ...n[i], done: !n[i].done };
      if (!n[i].done) showToast(`${n[i].sub} complete!`);
      return n;
    });
  };

  const hr     = clock.getHours();
  const greet  = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const name   = user?.name || "Kavya";
  const done   = plan.filter(p => p.done).length;
  const pct    = Math.round((done / plan.length) * 100);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast-soft">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: toast.accent, flexShrink: 0, boxShadow: `0 0 8px ${toast.accent}` }} />
          {toast.msg}
        </div>
      )}

      {/* ── FULL PAGE WRAPPER ── */}
      <div style={{
        minHeight: "100vh",
        background: T.bg,
        position: "relative",
        overflow: "hidden",
      }}>

        {/* ── AMBIENT BLOBS ── */}
        <div style={{ position: "fixed", top: -180, left: -180, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(155,142,196,0.22) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0, animation: "floatOrb 20s ease-in-out infinite" }} />
        <div style={{ position: "fixed", bottom: -140, right: -140, width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, rgba(127,168,138,0.2) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0, animation: "floatOrb2 24s ease-in-out infinite" }} />
        <div style={{ position: "fixed", top: "38%", right: -80, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(196,120,138,0.14) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", top: "55%", left: "20%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(196,168,130,0.14) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

        {/* ── NOISE TEXTURE overlay ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }} />

        {/* ── MAIN CONTENT ── */}
        <div className="dash-pad" style={{ position: "relative", zIndex: 1, padding: "32px 28px" }}>

          {/* ════ TOP BAR ════ */}
          <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>

            {/* Identity */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                {/* live dot with ripple */}
                <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.sage, boxShadow: `0 0 8px ${T.sage}` }} />
                  <div className="ripple-ring" style={{ "--rcolor": T.sage }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.inkSoft, letterSpacing: "0.04em" }}>{greet}</span>
                <span style={{ color: T.inkFaint, fontSize: 12 }}>·</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: T.inkFaint, fontFamily: "'DM Mono', monospace" }}>
                  {clock.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <h1 className="garamond" style={{ fontSize: 48, fontWeight: 400, color: T.ink, lineHeight: 1.05, margin: 0 }}>
                Ready to learn,
              </h1>
              <h1 className="garamond shimmer-name" style={{ fontSize: 48, fontWeight: 500, fontStyle: "italic", lineHeight: 1.05, margin: 0 }}>
                {name}.
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                <div style={{ height: 1, width: 24, background: `linear-gradient(90deg, ${T.sage}, transparent)` }} />
                <span style={{ fontSize: 13, color: T.inkSoft }}>
                  {done} of {plan.length} tasks done today
                </span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginTop: 6 }}>
              {/* dark toggle */}
              <button onClick={toggleDark} className="toggle-track" style={{ background: dark ? "rgba(155,142,196,0.25)" : "rgba(255,255,255,0.5)" }}>
                <div className="toggle-thumb" style={{ transform: dark ? "translateX(20px)" : "translateX(0)", background: dark ? T.lavender : "white" }} />
              </button>

              {/* notif */}
              <button onClick={() => showToast("3 new notifications", T.lavender)} style={{
                width: 38, height: 38, borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: T.inkSoft, position: "relative",
                boxShadow: "0 2px 12px rgba(100,90,130,0.08)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.75)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(100,90,130,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.5)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(100,90,130,0.08)"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.inkSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <div style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: T.blush, border: "1.5px solid rgba(255,255,255,0.8)", boxShadow: `0 0 5px ${T.blush}` }} />
              </button>

              {/* home */}
              <button onClick={() => navigate("/")} style={{
                padding: "9px 18px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                color: T.inkMid, fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Figtree', sans-serif",
                boxShadow: "0 2px 12px rgba(100,90,130,0.08)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.75)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(100,90,130,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.5)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(100,90,130,0.08)"; }}
              >
                Home
              </button>
            </div>
          </div>

          {/* ════ STATS ════ */}
          <div className="fade-up d1 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 12 }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-glass" style={{ padding: "20px 22px" }}>
                {/* top accent stripe */}
                <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 2, borderRadius: "0 0 4px 4px", background: s.accent, opacity: 0.5 }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: s.accentXL,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: s.accent, fontWeight: 700,
                  }}>{s.sym}</div>
                  <span style={{ fontSize: 11, color: T.inkSoft, fontWeight: 500 }}>{s.sub}</span>
                </div>

                <div className="garamond" style={{ fontSize: 36, fontWeight: 500, color: T.ink, lineHeight: 1, marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: T.inkSoft, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── progress bar ── */}
          <div className="fade-up d1 glass-card" style={{ marginBottom: 20, marginTop: 0, padding: "14px 22px", borderRadius: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.inkMid, whiteSpace: "nowrap" }}>Today's progress</span>
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: "rgba(200,195,210,0.3)", overflow: "hidden" }}>
              <div className="score-fill" style={{
                "--w": `${pct}%`, width: `${pct}%`,
                background: `linear-gradient(90deg, ${T.sage}, ${T.lavender})`,
                boxShadow: `0 0 10px ${T.sage}60`,
              }} />
            </div>
            <span className="garamond" style={{ fontSize: 22, fontWeight: 500, color: T.sage, whiteSpace: "nowrap" }}>{pct}%</span>
          </div>

          {/* ════ MAIN GRID ════ */}
          <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.85fr) minmax(0,1fr)", gap: 16 }}>

            {/* ══ LEFT ══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* SIGN DETECTION */}
              <div className="fade-up d2 glass-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <SLabel accent={T.sage}>Sign Language Detection</SLabel>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18 }}>
                    <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: camReady ? T.sage : T.blush, boxShadow: `0 0 6px ${camReady ? T.sage : T.blush}` }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: camReady ? T.sage : T.blush }}>
                      {camReady ? "Camera ready" : camError ? "Access denied" : "Connecting..."}
                    </span>
                  </div>
                </div>

                {camError ? (
                  <div style={{ padding: "36px", border: "1px dashed rgba(200,195,210,0.5)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: T.lavenderXL, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.lavender} strokeWidth="1.5" strokeLinecap="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.inkMid, marginBottom: 4 }}>Camera unavailable</p>
                      <p style={{ fontSize: 12, color: T.inkSoft }}>Please enable camera permissions to use sign detection.</p>
                    </div>
                  </div>
                ) : (
                  <div className={`cam-glass ${camReady ? "cam-glow" : ""}`} style={{ marginBottom: 14 }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", display: "block" }} />
                    {camReady && (
                      <div style={{
                        position: "absolute", left: "10%", right: "10%", height: 1,
                        background: `linear-gradient(90deg, transparent, ${T.sage}80, transparent)`,
                        animation: "camLine 3s ease-in-out infinite",
                        pointerEvents: "none",
                      }} />
                    )}
                    {detecting && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, borderRadius: 18 }}>
                        <div style={{ width: 36, height: 36, border: `2px solid ${T.sage}30`, borderTop: `2px solid ${T.sage}`, borderRadius: "50%", animation: "spinRing 0.8s linear infinite" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.sage }}>Analysing...</span>
                      </div>
                    )}
                  </div>
                )}

                <button onClick={detect} disabled={!camReady || detecting} style={{
                  width: "100%", padding: "13px",
                  background: camReady && !detecting
                    ? `linear-gradient(135deg, ${T.sage}, ${T.sageL})`
                    : "rgba(200,195,210,0.3)",
                  color: camReady && !detecting ? "white" : T.inkFaint,
                  border: "none", borderRadius: 14,
                  fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 600,
                  cursor: camReady && !detecting ? "pointer" : "not-allowed",
                  boxShadow: camReady && !detecting ? `0 6px 20px ${T.sage}40` : "none",
                  transition: "all 0.3s",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => { if (camReady && !detecting) e.currentTarget.style.boxShadow = `0 10px 30px ${T.sage}60`; }}
                onMouseLeave={e => { if (camReady && !detecting) e.currentTarget.style.boxShadow = `0 6px 20px ${T.sage}40`; }}
                >
                  {detecting ? "Detecting..." : "Detect Sign"}
                </button>

                {/* result */}
                <div style={{
                  marginTop: 12, padding: "14px 18px", borderRadius: 14,
                  background: letter && letter !== "Backend offline" ? T.sageXL : "rgba(200,195,210,0.15)",
                  border: `1px solid ${letter && letter !== "Backend offline" ? T.sageL : "rgba(200,195,210,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 3, height: 32, borderRadius: 4, background: letter ? T.sage : "rgba(200,195,210,0.4)" }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: T.inkSoft, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Detected sign</div>
                      <div className="garamond" style={{ fontSize: 28, fontWeight: 500, color: letter ? T.sage : T.inkFaint, lineHeight: 1 }}>{letter || "—"}</div>
                    </div>
                  </div>
                  {letter && (
                    <button onClick={() => setLetter("")} style={{ background: "rgba(200,195,210,0.2)", border: "none", width: 28, height: 28, borderRadius: 8, cursor: "pointer", color: T.inkSoft, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  )}
                </div>

                {history.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {history.map((h, i) => (
                      <span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: T.sageXL, color: T.sage, fontWeight: 600 }}>
                        {h.l} · {h.t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* PERFORMANCE */}
              <div className="fade-up d3 glass-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <SLabel accent={T.lavender}>Performance Index</SLabel>
                  <span style={{ fontSize: 11, color: T.inkSoft, fontWeight: 500, marginBottom: 18 }}>Lower score = needs focus</span>
                </div>

                {STRUGGLE.map((s, i) => (
                  <div key={s.sub}
                    onClick={() => navigate(`/student/study-plan?subject=${s.sub}`)}
                    style={{ padding: "14px 0", borderBottom: i < STRUGGLE.length - 1 ? "1px solid rgba(200,195,210,0.25)" : "none", cursor: "pointer", transition: "padding-left 0.25s" }}
                    onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
                    onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.accent, flexShrink: 0, boxShadow: `0 0 5px ${s.accent}80` }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{s.sub}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color: T.inkSoft }}>{s.tag}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                          background: s.trend > 0 ? T.sageXL : T.blushXL,
                          color: s.trend > 0 ? T.sage : T.blush,
                        }}>
                          {s.trend > 0 ? "+" : ""}{s.trend}%
                        </span>
                        <span className="garamond" style={{ fontSize: 22, fontWeight: 500, color: s.accent, minWidth: 32, textAlign: "right", filter: `drop-shadow(0 0 6px ${s.accent}60)` }}>
                          {s.score}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: "rgba(200,195,210,0.2)", overflow: "hidden" }}>
                      <div className="score-fill" style={{
                        "--w": `${s.score}%`, width: `${s.score}%`,
                        background: `linear-gradient(90deg, ${s.accentL}, ${s.accent})`,
                        boxShadow: `0 0 8px ${s.accent}50`,
                        animationDelay: `${i * 0.1}s`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* PLAN / WEEKLY */}
              <div className="fade-up d4 glass-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  {/* tabs */}
                  <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 999, background: "rgba(200,195,210,0.2)" }}>
                    {[["plan", "Today's Plan"], ["weekly", "Weekly"]].map(([t, l]) => (
                      <button key={t} className="tab-pill" onClick={() => setTab(t)} style={{
                        background: tab === t ? "white" : "transparent",
                        color: tab === t ? T.ink : T.inkSoft,
                        boxShadow: tab === t ? "0 2px 10px rgba(100,90,130,0.12)" : "none",
                      }}>{l}</button>
                    ))}
                  </div>
                  <button onClick={() => navigate("/student/study-plan")} style={{
                    fontSize: 13, color: T.lavender, fontWeight: 600, background: "none", border: "none",
                    cursor: "pointer", fontFamily: "'Figtree', sans-serif",
                  }}>
                    Full plan →
                  </button>
                </div>

                {tab === "plan" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {plan.map((item, i) => (
                      <div key={i} className="plan-row" onClick={() => togglePlan(i)} style={{ opacity: item.done ? 0.5 : 1 }}>
                        {/* checkbox */}
                        <div style={{
                          width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                          border: `1.5px solid ${item.done ? T.sage : "rgba(200,195,210,0.6)"}`,
                          background: item.done ? T.sageXL : "rgba(255,255,255,0.5)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.25s",
                          boxShadow: item.done ? `0 0 8px ${T.sage}40` : "none",
                        }}>
                          {item.done && <svg width="10" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.5 8L11 1" stroke={T.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>

                        <div style={{ width: 3, height: 28, borderRadius: 4, background: item.done ? "rgba(200,195,210,0.3)" : item.accent, flexShrink: 0, boxShadow: item.done ? "none" : `0 0 6px ${item.accent}60` }} />

                        <span style={{ fontSize: 11, color: T.inkSoft, width: 54, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{item.time}</span>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: T.inkSoft, marginBottom: 2 }}>{item.sub}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: item.done ? "line-through" : "none" }}>
                            {item.topic}
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 8,
                            background: item.type === "Quiz" ? T.lavenderXL : T.sageXL,
                            color: item.type === "Quiz" ? T.lavender : T.sage,
                          }}>{item.type}</span>
                          <span style={{ fontSize: 11, color: T.inkFaint }}>{item.dur}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <WeekChart />
                    <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                      {[[T.lavender, "Today"], [T.sage, "Goal met"], [T.inkFaint, "Pending"]].map(([c, l]) => (
                        <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                          <span style={{ fontSize: 11, color: T.inkSoft, fontWeight: 500 }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
            {/* ══ END LEFT ══ */}

            {/* ══ RIGHT ══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* QUICK ACTIONS */}
              <div className="fade-up d2 glass-card" style={{ padding: 22 }}>
                <SLabel accent={T.sage}>Quick Actions</SLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {ACTIONS.map((a) => (
                    <button key={a.path} className="soft-btn" onClick={() => navigate(a.path)}
                      style={{ "--btn-bg": `${a.accentXL}` }}
                    >
                      <div className="btn-icon" style={{
                        "--icon-bg": a.accentXL,
                        "--icon-border": `${a.accent}30`,
                        "--icon-glow": `${a.accent}40`,
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: a.accent, fontFamily: "'DM Mono', monospace" }}>{a.icon}</span>
                      </div>
                      <span style={{ flex: 1 }}>{a.label}</span>
                      {a.badge && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                          background: a.accentXL, color: a.accent,
                        }}>{a.badge}</span>
                      )}
                      <span style={{ color: T.inkFaint, fontSize: 14 }}>›</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI TIP */}
              <div className="fade-up d3 glass-card" style={{ padding: 22, background: "rgba(155,142,196,0.12)", borderColor: "rgba(155,142,196,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <SLabel accent={T.lavender}>AI Study Insight</SLabel>
                  <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: T.lavender, marginBottom: 18 }} />
                </div>

                <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.7)", marginBottom: 14 }}>
                  <p style={{ fontSize: 13.5, color: T.inkMid, lineHeight: 1.75 }}>
                    Your weakest area is{" "}
                    <span style={{ color: T.lavender, fontWeight: 700 }}>Quadratic Equations</span>
                    . Three incomplete attempts. A focused 20-min session now could push your score past{" "}
                    <span style={{ color: T.sage, fontWeight: 700 }}>70</span>.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[["Score", "62", T.blush], ["Target", "75", T.sage], ["Gap", "+13", T.lavender]].map(([k, v, c]) => (
                    <div key={k} style={{
                      flex: 1, padding: "10px 8px", borderRadius: 12,
                      background: "rgba(255,255,255,0.5)", textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.7)",
                    }}>
                      <div className="garamond" style={{ fontSize: 24, fontWeight: 500, color: c, lineHeight: 1 }}>{v}</div>
                      <div style={{ fontSize: 10, color: T.inkSoft, fontWeight: 500, marginTop: 2 }}>{k}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate("/student/ai-tutor")} style={{
                  width: "100%", padding: "12px",
                  background: `linear-gradient(135deg, ${T.lavender}, ${T.lavenderL})`,
                  color: "white", border: "none", borderRadius: 14,
                  fontFamily: "'Figtree', sans-serif", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", boxShadow: `0 6px 20px ${T.lavender}40`,
                  transition: "box-shadow 0.25s",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 10px 32px ${T.lavender}60`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 6px 20px ${T.lavender}40`}
                >
                  Ask AI Tutor →
                </button>
              </div>

              {/* MENTOR CTA */}
              <div className="fade-up d4 glass-card" style={{
                padding: 22,
                background: "rgba(196,120,138,0.1)",
                borderColor: "rgba(196,120,138,0.25)",
              }}>
                <SLabel accent={T.blush}>Earn as Mentor</SLabel>

                <p style={{ fontSize: 13.5, color: T.inkMid, lineHeight: 1.75, marginBottom: 16 }}>
                  Your History score qualifies you for peer mentoring. Earn{" "}
                  <span style={{ color: T.blush, fontWeight: 700 }}>₹50–₹150</span>
                  {" "}per session.
                </p>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigate("/student/mentors")} style={{
                    flex: 1, padding: "12px",
                    background: `linear-gradient(135deg, ${T.blush}, ${T.blushL})`,
                    color: "white", border: "none", borderRadius: 14,
                    fontFamily: "'Figtree', sans-serif", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", boxShadow: `0 6px 20px ${T.blush}35`,
                    transition: "box-shadow 0.25s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 10px 28px ${T.blush}55`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 6px 20px ${T.blush}35`}
                  >
                    Apply →
                  </button>
                  <button onClick={() => showToast("Saved for later", T.sand)} style={{
                    padding: "12px 18px", borderRadius: 14,
                    border: "1px solid rgba(196,120,138,0.25)",
                    background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)",
                    color: T.inkMid, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Figtree', sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
                  >
                    Later
                  </button>
                </div>
              </div>

              {/* CREDENTIALS */}
              <div className="fade-up d5 glass-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <SLabel accent={T.sand}>Credentials</SLabel>
                  <button onClick={() => navigate("/student/credentials")} style={{
                    fontSize: 13, color: T.sand, fontWeight: 600, background: "none",
                    border: "none", cursor: "pointer", fontFamily: "'Figtree', sans-serif",
                    marginBottom: 18,
                  }}>
                    View all →
                  </button>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { label: "Math Jr.", color: T.lavender, score: 62 },
                    { label: "Science",  color: T.sage,     score: 78 },
                    { label: "History",  color: T.blush,    score: 85 },
                  ].map(c => (
                    <div key={c.label}
                      onClick={() => navigate("/student/credentials")}
                      style={{
                        flex: 1, padding: "16px 10px", borderRadius: 16,
                        background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.7)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        cursor: "pointer", transition: "all 0.3s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.75)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}20`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.5)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                    >
                      <div style={{ position: "relative" }}>
                        <RingProgress value={c.score} size={50} stroke={3.5} accent={c.color} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="garamond" style={{ fontSize: 14, fontWeight: 500, color: c.color }}>{c.score}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: T.inkSoft, textAlign: "center", lineHeight: 1.3 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            {/* ══ END RIGHT ══ */}

          </div>

          {/* ── FOOTER ── */}
          <div style={{ marginTop: 24, padding: "16px 0", borderTop: "1px solid rgba(200,195,210,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.inkFaint, fontWeight: 500 }}>PathWay AI · Student Dashboard</span>
            <span style={{ fontSize: 12, color: T.inkFaint, fontFamily: "'DM Mono', monospace" }}>
              {clock.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · Session active
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
