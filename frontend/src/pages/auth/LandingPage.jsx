/**
 * PathwayAI — Enhanced Landing Page
 * React + Tailwind CSS only
 * Features: Light/Dark mode, Smooth animations, Gradient backgrounds, Polished UI/UX
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
  .font-display { font-family: 'DM Serif Display', serif; }

  /* ── Animated gradient mesh ── */
  @keyframes mesh-rotate {
    0%   { transform: rotate(0deg) scale(1.2); }
    50%  { transform: rotate(180deg) scale(1.4); }
    100% { transform: rotate(360deg) scale(1.2); }
  }
  @keyframes mesh-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 30px) scale(0.98); }
  }
  @keyframes orb-pulse {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(1.1); }
  }

  /* ── Entrance animations ── */
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slide-right {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-left {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50%       { transform: translateY(-18px) rotate(1deg); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(2deg); }
    50%       { transform: translateY(-12px) rotate(-1deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ping-slow {
    0%    { transform: scale(1); opacity: 0.8; }
    80%   { transform: scale(2.2); opacity: 0; }
    100%  { transform: scale(2.2); opacity: 0; }
  }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes dash {
    to { stroke-dashoffset: 0; }
  }
  @keyframes counter {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(50px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(56,139,199,0.3); }
    50%       { box-shadow: 0 0 50px rgba(56,139,199,0.6), 0 0 80px rgba(56,139,199,0.2); }
  }
  @keyframes border-dance {
    0%, 100% { border-color: rgba(56,139,199,0.4); }
    50%       { border-color: rgba(56,139,199,0.9); }
  }

  .animate-fade-up    { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .animate-fade-in    { animation: fade-in 0.8s ease both; }
  .animate-slide-right{ animation: slide-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .animate-slide-left { animation: slide-left  0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .animate-scale-in   { animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .animate-float      { animation: float 6s ease-in-out infinite; }
  .animate-float-del  { animation: float-delayed 5s ease-in-out 1s infinite; }
  .animate-spin-slow  { animation: spin-slow 12s linear infinite; }
  .animate-ping-slow  { animation: ping-slow 2.5s ease-out infinite; }
  .animate-marquee    { animation: marquee 28s linear infinite; }
  .animate-card-in    { animation: card-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }

  .delay-0   { animation-delay: 0s; }
  .delay-1   { animation-delay: 0.1s; }
  .delay-2   { animation-delay: 0.2s; }
  .delay-3   { animation-delay: 0.3s; }
  .delay-4   { animation-delay: 0.4s; }
  .delay-5   { animation-delay: 0.5s; }
  .delay-6   { animation-delay: 0.6s; }
  .delay-7   { animation-delay: 0.7s; }
  .delay-8   { animation-delay: 0.8s; }
  .delay-10  { animation-delay: 1.0s; }
  .delay-12  { animation-delay: 1.2s; }

  /* ── Shimmer text ── */
  .text-shimmer {
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  /* ── Mesh blobs ── */
  .orb { animation: orb-pulse 6s ease-in-out infinite; }
  .orb-drift { animation: mesh-drift 12s ease-in-out infinite; }

  /* ── Card hover effects ── */
  .feature-card {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.4s ease;
    transform-style: preserve-3d;
  }
  .feature-card:hover {
    transform: translateY(-10px) scale(1.02);
  }

  /* ── Gradient border ── */
  .gradient-border {
    position: relative;
    background: linear-gradient(135deg, #1a3a5c, #0d2744) padding-box,
                linear-gradient(135deg, rgba(96,165,250,0.5), rgba(167,139,250,0.5)) border-box;
    border: 1.5px solid transparent;
  }
  .gradient-border-light {
    position: relative;
    background: linear-gradient(135deg, #ffffff, #f0f7ff) padding-box,
                linear-gradient(135deg, rgba(56,139,199,0.4), rgba(139,92,246,0.4)) border-box;
    border: 1.5px solid transparent;
  }

  /* ── Scroll indicator ── */
  .scroll-line {
    width: 1px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(96,165,250,0.8), transparent);
    animation: fade-in 1s ease 1.5s both;
  }

  /* ── Nav link underline ── */
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    border-radius: 2px;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .nav-link:hover::after { width: 100%; }

  /* ── Toggle switch ── */
  .toggle-track {
    transition: background 0.3s ease;
  }
  .toggle-thumb {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ── Glass effect ── */
  .glass-dark {
    background: rgba(13, 29, 52, 0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .glass-light {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }

  /* Smooth theme transition */
  *, *::before, *::after {
    transition-property: background-color, border-color, color, box-shadow;
    transition-duration: 0.35s;
    transition-timing-function: ease;
  }
  /* But NOT animations */
  .animate-fade-up, .animate-fade-in, .animate-slide-right, .animate-slide-left,
  .animate-scale-in, .animate-float, .animate-float-del, .animate-spin-slow,
  .animate-ping-slow, .animate-marquee, .animate-card-in, .animate-glow-pulse,
  .orb, .orb-drift, .feature-card, .toggle-thumb, .toggle-track, .nav-link::after {
    transition-property: none;
  }
  .feature-card { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s, border-color 0.4s; }
  .toggle-thumb { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .toggle-track { transition: background 0.3s ease; }
  .nav-link::after { transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

  /* custom scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(56,139,199,0.4); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(56,139,199,0.7); }
`;

/* ─────────────────────────────────────────────────────────
   SCROLL-TRIGGERED FADE
───────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const ref = useRef();
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const anim = { up: "animate-fade-up", right: "animate-slide-right", left: "animate-slide-left", scale: "animate-scale-in" }[direction] || "animate-fade-up";

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: vis ? undefined : 0,
        animation: vis ? `${anim.replace("animate-", "")} 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s both` : "none",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const Icons = {
  LogoMark: () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8"/>
          <stop offset="1" stopColor="#1A5A9A"/>
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#lg1)"/>
      <path d="M8 9h9a5.5 5.5 0 0 1 0 11H8V9z" fill="white" fillOpacity="0.95"/>
      <circle cx="27" cy="24" r="3.5" fill="white" fillOpacity="0.85"/>
      <line x1="27" y1="9" x2="27" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85"/>
    </svg>
  ),
  Sun: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="17" x2="21" y2="17"/>
    </svg>
  ),
  Close: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 5l4 4 4-4"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L13.09 8.26L19 6L14.74 10.74L21 12L14.74 13.26L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.26L3 12L9.26 10.74L5 6L10.91 8.26L12 2Z"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────────────────── */
function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className={`relative flex items-center w-14 h-7 rounded-full px-1 ${dark ? "bg-sky-600" : "bg-slate-200"} toggle-track focus:outline-none`}
      aria-label="Toggle theme"
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md toggle-thumb ${dark ? "translate-x-7 bg-white text-sky-700" : "translate-x-0 bg-white text-amber-500"}`}>
        {dark ? <Icons.Moon /> : <Icons.Sun />}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED MESH BACKGROUND
───────────────────────────────────────────────────────── */
function MeshBackground({ dark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: dark
          ? "radial-gradient(ellipse at 20% 50%, #0d2744 0%, #060d1a 50%, #0a1628 100%)"
          : "radial-gradient(ellipse at 20% 50%, #dbeafe 0%, #f0f9ff 50%, #eff6ff 100%)"
      }}/>

      {/* Animated orbs */}
      <div className="orb orb-drift absolute rounded-full" style={{
        width: 600, height: 600,
        top: "-15%", left: "-10%",
        background: dark
          ? "radial-gradient(circle, rgba(56,139,199,0.25) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(56,139,199,0.2) 0%, transparent 70%)"
      }}/>
      <div className="orb absolute rounded-full" style={{
        width: 500, height: 500, animationDelay: "2s",
        top: "30%", right: "-8%",
        background: dark
          ? "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)"
      }}/>
      <div className="orb absolute rounded-full" style={{
        width: 400, height: 400, animationDelay: "4s",
        bottom: "5%", left: "30%",
        background: dark
          ? "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)"
      }}/>

      {/* Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: dark
          ? "linear-gradient(rgba(56,139,199,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,199,0.04) 1px, transparent 1px)"
          : "linear-gradient(rgba(56,139,199,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,199,0.06) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }}/>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute rounded-full orb" style={{
          width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
          left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%`,
          background: dark ? "rgba(96,165,250,0.6)" : "rgba(56,139,199,0.4)",
          animationDelay: `${i * 0.7}s`,
        }}/>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
// ─── REPLACE your Navbar function in LandingPage.jsx with this ───
// (Only the Navbar function changes — everything else stays the same)

function Navbar({ dark, toggleDark }) {
  const navigate = useNavigate(); // ← ADD THIS (already imported at top of file)
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setLoginOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const links = [
    { label: "Home",     href: "#home"     },
    { label: "About",    href: "#about"    },
    { label: "Features", href: "#features" },
    { label: "Stories",  href: "#stories"  },
    { label: "Contact",  href: "#contact"  },
  ];

  const roles = [
    { label: "Student",     emoji: "🎓", path: "/login/student" },
    { label: "Teacher",     emoji: "📚", path: "/login/teacher" },
    { label: "Peer Mentor", emoji: "⭐", path: "/login/mentor"  },
  ];

  const navBg = scrolled
    ? dark
      ? "glass-dark border-b border-white/10 shadow-2xl"
      : "glass-light border-b border-sky-100 shadow-lg"
    : "bg-transparent";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${navBg}`}
        style={{ transition: "background 0.4s ease, box-shadow 0.4s ease" }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 shrink-0">
            <Icons.LogoMark />
            <span className={`font-display text-xl tracking-tight ${dark ? "text-white" : "text-slate-800"}`}>
              Pathway<span className="text-sky-500 font-bold">AI</span>
            </span>
          </a>

          {/* Nav links — desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`nav-link relative text-sm font-semibold ${dark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-sky-700"}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle dark={dark} toggle={toggleDark} />

            {/* Login dropdown */}
            <div className="relative hidden md:block" ref={dropRef}>
              <button
                onClick={() => setLoginOpen((o) => !o)}
                className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                  dark
                    ? "border-sky-500/50 text-sky-300 hover:bg-sky-500/15 hover:border-sky-400"
                    : "border-sky-400 text-sky-700 hover:bg-sky-50"
                }`}
              >
                Log In <Icons.ChevronDown />
              </button>

              {loginOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-scale-in ${
                    dark ? "bg-slate-900 border-slate-700" : "bg-white border-sky-100"
                  }`}
                >
                  {roles.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => {
                        setLoginOpen(false);
                        navigate(r.path); // ← FIXED: actually navigates
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-left ${
                        dark
                          ? "text-slate-200 hover:bg-slate-800"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                    >
                      <span className="text-base">{r.emoji}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Up button */}
            <button
              onClick={() => navigate("/role")} // ← FIXED: goes to role portal
              className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 px-5 py-2 rounded-xl shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign Up <Icons.ArrowRight />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className={`lg:hidden ${dark ? "text-white" : "text-slate-800"}`}
            >
              {mobileOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className={`lg:hidden border-t px-5 py-5 space-y-1 animate-fade-up ${
              dark ? "bg-slate-900 border-slate-800" : "bg-white border-sky-100"
            }`}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold ${
                  dark ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-sky-50"
                }`}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex gap-3">
              <button
                onClick={() => { setMobileOpen(false); navigate("/login/student"); }}
                className={`flex-1 text-sm font-bold py-2.5 rounded-xl border-2 ${
                  dark ? "border-sky-500 text-sky-300" : "border-sky-400 text-sky-700"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/role"); }}
                className="flex-1 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 rounded-xl"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   APP MOCKUP ILLUSTRATION
───────────────────────────────────────────────────────── */
function AppMockup({ dark }) {
  const bg = dark ? "#0f1f35" : "#f0f7ff";
  const surface = dark ? "#162840" : "#ffffff";
  const surfaceAlt = dark ? "#1c3450" : "#f8fbff";
  const border = dark ? "#1e3a55" : "#dbeafe";
  const textPrimary = dark ? "#f1f5f9" : "#1e293b";
  const textMuted = dark ? "#64748b" : "#94a3b8";
  const accent = "#38bdf8";
  const accentDark = "#0369a1";

  return (
    <svg viewBox="0 0 420 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 420, filter: dark ? "drop-shadow(0 32px 64px rgba(0,0,0,0.5))" : "drop-shadow(0 24px 48px rgba(56,139,199,0.18))" }}>

      {/* ── Phone shell ── */}
      <rect x="60" y="10" width="300" height="480" rx="36" fill={dark ? "#0a1525" : "#e2eaf4"} />
      <rect x="64" y="14" width="292" height="472" rx="33" fill={bg} />

      {/* Notch */}
      <rect x="155" y="18" width="110" height="22" rx="11" fill={dark ? "#0a1525" : "#e2eaf4"} />
      <circle cx="210" cy="29" r="4" fill={dark ? "#1e2d42" : "#c7d8ec"} />

      {/* ── Status bar ── */}
      <text x="84" y="52" fontSize="9" fill={textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">9:41</text>
      <rect x="312" y="45" width="28" height="10" rx="3" fill="none" stroke={textMuted} strokeWidth="1.2"/>
      <rect x="313.5" y="46.5" width="20" height="7" rx="2" fill={accent} fillOpacity="0.8"/>
      <rect x="340" y="48" width="3" height="4" rx="1.5" fill={textMuted}/>

      {/* ── Top bar / header ── */}
      <rect x="64" y="60" width="292" height="52" fill={surface} />
      {/* Logo mark */}
      <rect x="82" y="74" width="24" height="24" rx="7" fill="url(#mkgrd)"/>
      <text x="94" y="90" fontSize="10" fill="white" textAnchor="middle" fontWeight="800" fontFamily="sans-serif">P</text>
      <text x="116" y="88" fontSize="11" fill={textPrimary} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">PathwayAI</text>
      {/* Avatar */}
      <circle cx="332" cy="86" r="14" fill="url(#avtr)"/>
      <text x="332" y="91" fontSize="11" fill="white" textAnchor="middle" fontWeight="700" fontFamily="sans-serif">K</text>
      {/* Notif dot */}
      <circle cx="343" cy="75" r="4" fill="#ef4444"/>

      {/* ── Tab bar ── */}
      <rect x="64" y="112" width="292" height="34" fill={surfaceAlt} />
      {[["Learn", 110], ["Earn", 176], ["Progress", 242], ["Mentor", 316]].map(([tab, x], i) => (
        <g key={tab}>
          {i === 0 && <rect x={x - 2} y="112" width={tab.length * 7 + 10} height="34" fill={accent} fillOpacity="0.15" rx="0"/>}
          {i === 0 && <rect x={x - 2} y="142" width={tab.length * 7 + 10} height="4" fill={accent} rx="2"/>}
          <text x={x + (tab.length * 3.5)} y="134" fontSize="9.5" fill={i === 0 ? accent : textMuted}
            fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={i === 0 ? "700" : "500"} textAnchor="middle">{tab}</text>
        </g>
      ))}

      {/* ── Main content area ── */}
      {/* Greeting */}
      <text x="82" y="168" fontSize="11" fill={textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500">Good morning, Kavya 👋</text>
      <text x="82" y="185" fontSize="15" fill={textPrimary} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">Ready to learn today?</text>

      {/* ── Today's plan card ── */}
      <rect x="82" y="196" width="256" height="72" rx="16" fill="url(#plangrd)"/>
      <text x="100" y="215" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" letterSpacing="1">TODAY'S PLAN</text>
      <text x="100" y="232" fontSize="13" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">Quadratic Equations</text>
      <text x="100" y="248" fontSize="9.5" fill="rgba(255,255,255,0.75)" fontFamily="'Plus Jakarta Sans', sans-serif">Chapter 4 · 3 exercises remaining</text>
      {/* Progress ring outline */}
      <circle cx="308" cy="232" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
      <circle cx="308" cy="232" r="20" fill="none" stroke="white" strokeWidth="3"
        strokeDasharray="75 126" strokeDashoffset="31" strokeLinecap="round"/>
      <text x="308" y="237" fontSize="10" fill="white" textAnchor="middle" fontWeight="700" fontFamily="sans-serif">60%</text>

      {/* ── AI Chat section ── */}
      <text x="82" y="290" fontSize="10" fill={textMuted} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">🤖 Ask AI Tutor</text>

      {/* Chat box bg */}
      <rect x="82" y="298" width="256" height="100" rx="16" fill={surface} stroke={border} strokeWidth="1.2"/>

      {/* User bubble */}
      <rect x="160" y="310" width="160" height="26" rx="13" fill={accent} fillOpacity="0.15" stroke={accent} strokeOpacity="0.3" strokeWidth="1"/>
      <text x="240" y="327" fontSize="9.5" fill={dark ? "#7dd3fc" : "#0369a1"} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500">प्रकाश संश्लेषण क्या है?</text>

      {/* AI bubble */}
      <rect x="90" y="344" width="178" height="26" rx="13" fill={accent} stroke="none"/>
      <text x="179" y="361" fontSize="9" fill="white" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500">Plants make food using sunlight...</text>

      {/* Audio wave bars */}
      {[4,7,5,9,6,8,4,7,5,6,8,4].map((h, i) => (
        <rect key={i} x={90 + i * 13} y={385 - h} width="7" height={h * 1.4} rx="3.5" fill={accent} fillOpacity={0.3 + (i % 3) * 0.2}/>
      ))}

      {/* ── Stats row ── */}
      {[
        { label: "Streak", val: "12 days", icon: "🔥", col: "#f97316" },
        { label: "Sessions", val: "6 this wk", icon: "⭐", col: "#f59e0b" },
        { label: "Earned", val: "₹2,400", icon: "💰", col: "#22c55e" },
      ].map(({ label, val, icon, col }, i) => (
        <g key={label}>
          <rect x={82 + i * 90} y="412" width="82" height="56" rx="14" fill={surface} stroke={border} strokeWidth="1.2"/>
          <text x={123 + i * 90} y="432" fontSize="14" textAnchor="middle">{icon}</text>
          <text x={123 + i * 90} y="447" fontSize="10" fill={col} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">{val}</text>
          <text x={123 + i * 90} y="460" fontSize="8" fill={textMuted} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif">{label}</text>
        </g>
      ))}

      {/* ── Bottom nav ── */}
      <rect x="64" y="476" width="292" height="10" rx="0" fill={surface}/>

      {/* ── Gradient defs ── */}
      <defs>
        <linearGradient id="mkgrd" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8"/><stop offset="1" stopColor="#1a5a9a"/>
        </linearGradient>
        <linearGradient id="avtr" x1="318" y1="72" x2="346" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b"/><stop offset="1" stopColor="#d97706"/>
        </linearGradient>
        <linearGradient id="plangrd" x1="82" y1="196" x2="338" y2="268" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb"/><stop offset="1" stopColor="#0369a1"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */
function Hero({ dark }) {
  const chips = [
    { icon: "📶", text: "Works on 2G & offline" },
    { icon: "🗣️", text: "9 Indian languages" },
    { icon: "🆓", text: "Free for students" },
    { icon: "💰", text: "Earn ₹2,800+/month" },
  ];

  const stats = [
    { val: "9+", label: "Languages" },
    { val: "2G", label: "Ready" },
    { val: "88%", label: "UPI Payout" },
    { val: "₹0", label: "For Students" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <MeshBackground dark={dark} />

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <div>
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8 border"
              style={{
                background: dark ? "rgba(56,139,199,0.15)" : "rgba(56,139,199,0.1)",
                borderColor: dark ? "rgba(56,139,199,0.4)" : "rgba(56,139,199,0.3)"
              }}>
              <span className="animate-ping-slow inline-flex w-2 h-2 rounded-full bg-sky-400" />
              <span className={`text-xs font-bold tracking-widest uppercase ${dark ? "text-sky-300" : "text-sky-700"}`}>
                Enactus · EnCode 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-1 font-display text-6xl md:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-6">
              <span className={`italic block ${dark ? "text-white" : "text-slate-900"}`}>Pathway</span>
              <span className="text-shimmer font-display block">AI</span>
              <span className={`italic text-4xl md:text-5xl xl:text-6xl block mt-2 ${dark ? "text-slate-300" : "text-slate-600"}`}>for Bharat.</span>
            </h1>

            {/* Sub */}
            <p className={`animate-fade-up delay-2 text-lg md:text-xl leading-relaxed mb-8 max-w-lg ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Learn in your language. Earn while you teach.{" "}
              <span className={`font-bold ${dark ? "text-sky-300" : "text-sky-700"}`}>Belong to a system built for you.</span>
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-3 flex flex-wrap gap-3 mb-10">
              <button className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 px-8 py-4 rounded-2xl shadow-xl shadow-sky-500/30 hover:-translate-y-1 active:translate-y-0 animate-glow-pulse">
                Start Your Journey
                <span className="animate-float-del inline-block"><Icons.ArrowRight /></span>
              </button>
              <button className={`text-sm font-bold px-7 py-4 rounded-2xl border-2 hover:-translate-y-1 active:translate-y-0 ${dark ? "border-slate-600 text-slate-200 hover:border-sky-500 hover:text-sky-300 hover:bg-sky-500/10" : "border-slate-300 text-slate-700 hover:border-sky-400 hover:text-sky-700 hover:bg-sky-50"}`}>
                Watch Demo ▶
              </button>
            </div>

            {/* Chips */}
            <div className="animate-fade-up delay-4 flex flex-wrap gap-2 mb-10">
              {chips.map((c, i) => (
                <span key={i} className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full border ${dark ? "bg-slate-800/70 border-slate-700 text-slate-300" : "bg-white/80 border-slate-200 text-slate-600 shadow-sm"}`}>
                  <span>{c.icon}</span> {c.text}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-5 grid grid-cols-4 gap-4 max-w-sm">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`text-xl font-black ${dark ? "text-sky-300" : "text-sky-600"}`}>{s.val}</div>
                  <div className={`text-xs font-semibold mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Clean app mockup illustration ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="animate-fade-up delay-3 w-full max-w-md">
              <AppMockup dark={dark} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in delay-10">
          <span className={`text-xs font-semibold tracking-widest uppercase ${dark ? "text-slate-500" : "text-slate-400"}`}>Scroll to explore</span>
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────────────────── */
function MarqueeStrip({ dark }) {
  const items = ["AI Tutoring", "Voice Enabled", "9 Languages", "Offline First", "2G Ready", "Free for Students", "Peer Mentors", "Open Badges", "UPI Payouts", "Teacher Analytics"];
  const doubled = [...items, ...items];

  return (
    <div className={`py-4 overflow-hidden ${dark ? "bg-sky-900/30 border-y border-sky-800/30" : "bg-sky-600 border-y border-sky-500"}`}>
      <div className="animate-marquee flex gap-10 whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className={`text-sm font-bold tracking-wide ${dark ? "text-sky-300" : "text-white"}`}>{item}</span>
            <span className={`text-lg ${dark ? "text-sky-600" : "text-sky-300"}`}>·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────── */
function About({ dark }) {
  const pillars = [
    { icon: "🎓", title: "Learn", desc: "AI tutoring in your language, adapted to your pace" },
    { icon: "💰", title: "Earn", desc: "Top students become mentors earning ₹2,800+/month" },
    { icon: "🤝", title: "Belong", desc: "Verifiable credentials employers actually recognise" },
  ];

  return (
    <section id="about" className={`py-28 px-5 md:px-10 relative overflow-hidden ${dark ? "bg-slate-900" : "bg-white"}`}>
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{
        background: dark ? "radial-gradient(circle, rgba(56,139,199,0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(56,139,199,0.07) 0%, transparent 70%)",
        transform: "translate(30%, -30%)"
      }}/>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <FadeIn direction="right">
            <p className={`text-xs font-black tracking-widest uppercase mb-5 ${dark ? "text-sky-400" : "text-sky-600"}`}>Who We Are</p>
            <h2 className={`font-display text-4xl md:text-5xl leading-tight mb-6 ${dark ? "text-white" : "text-slate-900"}`}>
              Bridging ambition and access<br />
              <span className={dark ? "text-sky-300" : "text-sky-600"}>for every student in India.</span>
            </h2>
            <p className={`text-base leading-relaxed mb-8 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              PathwayAI is a connectivity-aware, AI-powered learning platform built for semi-urban and rural India.
              It adapts to the student's language, device, and bandwidth — personalising learning, empowering teachers
              with real intelligence, and connecting struggling students to peer mentors who earn while they teach.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { sdg: "SDG 4", desc: "Quality Education" },
                { sdg: "SDG 5", desc: "Gender Equality" },
                { sdg: "SDG 8", desc: "Decent Work" },
                { sdg: "SDG 10", desc: "Reduced Inequalities" },
              ].map((s) => (
                <div key={s.sdg} className={`px-3.5 py-2 rounded-xl border text-xs ${dark ? "border-sky-800 bg-sky-900/30 text-sky-300" : "border-sky-200 bg-sky-50 text-sky-700"}`}>
                  <span className="font-black">{s.sdg}</span> · {s.desc}
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right: pillars */}
          <div className="space-y-5">
            {pillars.map((p, i) => (
              <FadeIn key={p.title} direction="left" delay={i * 0.15}>
                <div className={`flex items-start gap-5 p-6 rounded-2xl border feature-card ${dark ? "bg-slate-800/70 border-slate-700 hover:border-sky-700" : "bg-slate-50 border-slate-100 hover:border-sky-200 hover:shadow-sky-100"}`}>
                  <span className="text-4xl shrink-0">{p.icon}</span>
                  <div>
                    <h3 className={`font-display text-xl mb-1 ${dark ? "text-white" : "text-slate-800"}`}>{p.title}</h3>
                    <p className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    emoji: "🤖",
    title: "AI Support 24/7",
    desc: "Ask doubts anytime in Hindi, Marathi, Tamil or 6 other Indian languages. Powered by Llama 3.1 — responds by voice, day or night.",
    accent: "#38BDF8",
    bg: ["from-sky-500/10 to-blue-500/5", "from-sky-900/30 to-blue-900/10"],
    border: ["border-sky-100 hover:border-sky-300", "border-sky-800/50 hover:border-sky-600"],
    tag: "Core AI",
  },
  {
    emoji: "🎙️",
    title: "Voice-Enabled Learning",
    desc: "Speak naturally in your language. Whisper STT converts questions; Coqui TTS reads answers aloud. Works on any basic Android phone.",
    accent: "#14B8A6",
    bg: ["from-teal-500/10 to-cyan-500/5", "from-teal-900/30 to-cyan-900/10"],
    border: ["border-teal-100 hover:border-teal-300", "border-teal-800/50 hover:border-teal-600"],
    tag: "Accessibility",
  },
  {
    emoji: "📅",
    title: "Smart Study Plans",
    desc: "Personalised weekly schedules generated every Monday — built around your weak areas, teacher schedule, and daily availability.",
    accent: "#8B5CF6",
    bg: ["from-violet-500/10 to-purple-500/5", "from-violet-900/30 to-purple-900/10"],
    border: ["border-violet-100 hover:border-violet-300", "border-violet-800/50 hover:border-violet-600"],
    tag: "Personalisation",
  },
  {
    emoji: "🌡️",
    title: "Teacher Heatmap Analytics",
    desc: "See every student × every topic colour-coded in real time. Know who's struggling before the exam — not after.",
    accent: "#EF4444",
    bg: ["from-red-500/10 to-rose-500/5", "from-red-900/30 to-rose-900/10"],
    border: ["border-red-100 hover:border-red-300", "border-red-800/50 hover:border-red-600"],
    tag: "For Teachers",
  },
  {
    emoji: "💸",
    title: "Learn While You Earn",
    desc: "Top students become paid peer mentors. ₹50–₹150/session. 88% payout direct to UPI. Average ₹2,800/month while still studying.",
    accent: "#F59E0B",
    bg: ["from-amber-500/10 to-yellow-500/5", "from-amber-900/30 to-yellow-900/10"],
    border: ["border-amber-100 hover:border-amber-300", "border-amber-800/50 hover:border-amber-600"],
    tag: "Monetisation",
  },
  {
    emoji: "🏅",
    title: "Smart Credentials",
    desc: "Open Badge credentials for sustained mastery. Shareable on WhatsApp, scannable by employers. Better than a marksheet.",
    accent: "#22C55E",
    bg: ["from-green-500/10 to-emerald-500/5", "from-green-900/30 to-emerald-900/10"],
    border: ["border-green-100 hover:border-green-300", "border-green-800/50 hover:border-green-600"],
    tag: "Careers",
  },
];

function FeatureCard({ f, dark, index }) {
  const [hov, setHov] = useState(false);
  const bgClass = f.bg[dark ? 1 : 0];
  const borderClass = f.border[dark ? 1 : 0];

  return (
    <FadeIn delay={index * 0.08} direction="up">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={`feature-card relative rounded-3xl p-7 border bg-gradient-to-br h-full ${bgClass} ${borderClass} cursor-default overflow-hidden`}
        style={{ boxShadow: hov ? `0 20px 60px ${f.accent}22, 0 4px 20px rgba(0,0,0,0.08)` : undefined }}
      >
        {/* Accent glow */}
        <div className="absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 0% 0%, ${f.accent}18 0%, transparent 60%)`, opacity: hov ? 1 : 0 }} />

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 h-1 rounded-t-3xl transition-all duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${f.accent}, transparent)`,
            width: hov ? "100%" : "40%",
            opacity: hov ? 0.9 : 0.4
          }} />

        {/* Tag */}
        <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: `${f.accent}22`, color: f.accent }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.accent }} />
          {f.tag}
        </div>

        {/* Icon */}
        <div className="text-4xl mb-4 transition-transform duration-300" style={{ transform: hov ? "scale(1.15) rotate(-5deg)" : "scale(1)" }}>
          {f.emoji}
        </div>

        <h3 className={`font-display text-xl mb-3 ${dark ? "text-white" : "text-slate-800"}`}>{f.title}</h3>
        <p className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{f.desc}</p>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-2 text-xs font-bold transition-all duration-300"
          style={{ color: f.accent, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(-8px)" }}>
          Learn more <Icons.ArrowRight />
        </div>
      </div>
    </FadeIn>
  );
}

function Features({ dark }) {
  return (
    <section id="features" className={`py-28 px-5 md:px-10 relative overflow-hidden ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: dark
          ? "linear-gradient(rgba(56,139,199,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,199,0.03) 1px, transparent 1px)"
          : "linear-gradient(rgba(56,139,199,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,139,199,0.05) 1px, transparent 1px)",
        backgroundSize: "64px 64px"
      }}/>

      <div className="max-w-7xl mx-auto relative">
        <FadeIn>
          <div className="text-center mb-16">
            <p className={`text-xs font-black tracking-widest uppercase mb-5 ${dark ? "text-sky-400" : "text-sky-600"}`}>Platform Features</p>
            <h2 className={`font-display text-4xl md:text-5xl tracking-tight mb-5 ${dark ? "text-white" : "text-slate-900"}`}>
              Everything a student needs —<br />
              <span className={dark ? "text-sky-300" : "text-sky-600"}>in one platform.</span>
            </h2>
            <p className={`text-base max-w-xl mx-auto ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Six pillars working together — from AI tutoring to career credentials — without requiring good internet.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} dark={dark} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "For the first time I can see which concept my whole class missed — not after the exam, but the very next morning. It changed how I teach.",
    name: "Sunita Deshpande", role: "Maths Teacher, Pune", avatar: "S", gradient: "from-sky-500 to-blue-600",
  },
  {
    quote: "Main Hindi mein poochta hoon aur AI Hindi mein hi samjhata hai. Pehle English mein sab kuch tha — samajh hi nahi aata tha.",
    name: "Rajan Yadav", role: "Class 10 Student, Nagpur", avatar: "R", gradient: "from-teal-500 to-cyan-600",
  },
  {
    quote: "I do 6 mentor sessions a week and earn ₹2,400 a month. My parents didn't believe me until they saw the UPI transfer arrive.",
    name: "Kavya Nair", role: "Gold Mentor, Kochi", avatar: "K", gradient: "from-amber-500 to-orange-600",
  },
  {
    quote: "My village has 2G only in the evenings. PathwayAI works all day regardless — the offline mode is genuinely a game changer.",
    name: "Arjun Meena", role: "Class 11 Student, Rajasthan", avatar: "A", gradient: "from-violet-500 to-purple-600",
  },
  {
    quote: "Assessment generation used to take me two hours every Sunday. Now I type a prompt, review in ten minutes, and publish instantly.",
    name: "Pradeep Kulkarni", role: "Science Teacher, Solapur", avatar: "P", gradient: "from-green-500 to-emerald-600",
  },
];

function Testimonials({ dark }) {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const go = useCallback((idx) => {
    setActive(idx);
    setAnimKey(k => k + 1);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go((active + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [active, go]);

  const t = TESTIMONIALS[active];

  return (
    <section id="stories" className={`py-28 px-5 md:px-10 relative overflow-hidden ${dark ? "bg-slate-900" : "bg-white"}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: dark
          ? "radial-gradient(ellipse at center, rgba(56,139,199,0.08) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(56,139,199,0.05) 0%, transparent 70%)"
      }}/>

      <div className="max-w-4xl mx-auto relative">
        <FadeIn>
          <div className="text-center mb-16">
            <p className={`text-xs font-black tracking-widest uppercase mb-5 ${dark ? "text-sky-400" : "text-sky-600"}`}>Real Stories</p>
            <h2 className={`font-display text-4xl md:text-5xl ${dark ? "text-white" : "text-slate-900"}`}>
              Heard from the ground.
            </h2>
          </div>
        </FadeIn>

        {/* Main testimonial card */}
        <div key={animKey} className={`animate-card-in rounded-3xl p-10 md:p-14 text-center border ${dark ? "bg-slate-800/60 border-slate-700 backdrop-blur-sm" : "bg-gradient-to-br from-slate-50 to-sky-50/50 border-slate-200 shadow-xl shadow-slate-100"}`}>
          <div className={`font-display text-8xl leading-none mb-6 select-none ${dark ? "text-sky-500/30" : "text-sky-200"}`}>"</div>

          <blockquote className={`font-display text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto ${dark ? "text-white" : "text-slate-800"}`}>
            {t.quote}
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xl font-black shadow-lg`}>
              {t.avatar}
            </div>
            <div className="text-left">
              <div className={`font-bold ${dark ? "text-white" : "text-slate-800"}`}>{t.name}</div>
              <div className={`text-sm ${dark ? "text-slate-400" : "text-slate-400"}`}>{t.role}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => go((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${dark ? "border-slate-700 text-slate-400 hover:border-sky-600 hover:text-sky-400" : "border-slate-200 text-slate-400 hover:border-sky-400 hover:text-sky-600"}`}>
            ←
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className={`rounded-full border-none transition-all duration-300 ${i === active ? "w-8 h-3 bg-sky-500" : `w-3 h-3 ${dark ? "bg-slate-700 hover:bg-slate-500" : "bg-slate-200 hover:bg-slate-300"}`}`} />
            ))}
          </div>
          <button onClick={() => go((active + 1) % TESTIMONIALS.length)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${dark ? "border-slate-700 text-slate-400 hover:border-sky-600 hover:text-sky-400" : "border-slate-200 text-slate-400 hover:border-sky-400 hover:text-sky-600"}`}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────────────────── */
function CTABanner({ dark }) {
  return (
    <section className="py-28 px-5 md:px-10 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, #0D2744 0%, #163B5C 50%, #1A4A72 100%)"
      }}/>
      {/* Mesh orbs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none orb" style={{
        background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)"
      }}/>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none orb" style={{
        background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", animationDelay: "3s"
      }}/>

      <div className="max-w-4xl mx-auto relative text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8">
            <span className="text-sky-300"><Icons.Sparkle /></span>
            <span className="text-sky-200 text-xs font-bold tracking-widest uppercase">Join 10,000+ learners</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-6 leading-tight">
            Your journey starts<br />
            <span className="text-shimmer">right here.</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            No internet required. No English required. No money required.
            Just sign up and start learning in your language today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 font-bold text-white bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 px-10 py-4 rounded-2xl shadow-xl shadow-sky-500/30 hover:-translate-y-1 text-base animate-glow-pulse">
              Get Started Free <Icons.ArrowRight />
            </button>
            <button className="font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 px-8 py-4 rounded-2xl text-base hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
function Footer({ dark }) {
  const sections = [
    {
      title: "Platform",
      links: ["For Students", "For Teachers", "For Mentors", "Offline Mode", "AI Tutor", "Study Plans"],
    },
    {
      title: "Organisation",
      links: ["About Us", "Our Mission", "Enactus", "SDG Alignment", "Press Kit", "Careers"],
    },
  ];

  return (
    <footer id="contact" className={`px-5 md:px-10 pt-20 pb-10 ${dark ? "bg-slate-950" : "bg-slate-950"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Icons.LogoMark />
              <span className="font-display text-xl text-white">Pathway<span className="text-sky-400 font-bold">AI</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-52">
              Learn in your language. Earn while you teach. Belong to a system that works for you.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["SDG 4", "SDG 5", "SDG 8", "SDG 10"].map(s => (
                <span key={s} className="text-xs font-bold text-sky-400 bg-sky-950 border border-sky-900 px-2.5 py-1 rounded-lg">{s}</span>
              ))}
            </div>
            <div className="flex gap-3">
              {[Icons.Twitter, Icons.LinkedIn, Icons.Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-700 flex items-center justify-center text-slate-400 hover:text-white">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {sections.map((s) => (
            <div key={s.title}>
              <p className="text-xs font-black tracking-widest text-slate-600 uppercase mb-6">{s.title}</p>
              <ul className="space-y-3">
                {s.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-400 hover:text-sky-400">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="text-xs font-black tracking-widest text-slate-600 uppercase mb-6">Contact Us</p>
            <div className="space-y-5">
              {[
                { icon: "✉️", label: "Email", val: "pathwayai@enactus.org" },
                { icon: "📍", label: "Location", val: "India · Serving Bharat" },
                { icon: "🌐", label: "Website", val: "pathwayai.in" },
                { icon: "💬", label: "WhatsApp", val: "+91 98765 43210" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{c.icon}</span>
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wide mb-0.5">{c.label}</p>
                    <p className="text-sm text-slate-400">{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 PathwayAI · Enactus EnCode · Education Domain</p>
          <p>Works on 2G · Offline · 9 Indian languages · Free for students</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [dark, setDark] = useState(true);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className={`w-full min-h-screen overflow-x-hidden ${dark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        <Navbar dark={dark} toggleDark={() => setDark(d => !d)} />
        <Hero dark={dark} />
        <MarqueeStrip dark={dark} />
        <About dark={dark} />
        <Features dark={dark} />
        <Testimonials dark={dark} />
        <CTABanner dark={dark} />
        <Footer dark={dark} />
      </div>
    </>
  );
}