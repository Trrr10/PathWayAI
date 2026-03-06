/**
 * AuthPage.jsx — with real Supabase auth
 * src/pages/auth/AuthPage.jsx
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const AUTH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
  .font-display { font-family: 'DM Serif Display', serif; }

  @keyframes orb-pulse  { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.08)} }
  @keyframes mesh-drift { 0%,100%{transform:translate(0,0)scale(1)} 33%{transform:translate(24px,-16px)scale(1.04)} 66%{transform:translate(-16px,24px)scale(0.97)} }
  @keyframes fade-up    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scale-in   { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes ping-slow  { 0%{transform:scale(1);opacity:0.8} 80%,100%{transform:scale(2.2);opacity:0} }
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 18px rgba(56,189,248,0.25)} 50%{box-shadow:0 0 45px rgba(56,189,248,0.55),0 0 70px rgba(56,189,248,0.15)} }
  @keyframes spin       { to{transform:rotate(360deg)} }

  .orb              { animation: orb-pulse  6s ease-in-out infinite; }
  .orb-drift        { animation: mesh-drift 14s ease-in-out infinite; }
  .animate-fade-up  { animation: fade-up   0.75s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-scale-in { animation: scale-in  0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-ping-slow{ animation: ping-slow 2.5s ease-out infinite; }
  .animate-glow-pulse{ animation: glow-pulse 3s ease-in-out infinite; }
  .animate-spin     { animation: spin 0.9s linear infinite; }

  .delay-1{animation-delay:0.08s} .delay-2{animation-delay:0.16s}
  .delay-3{animation-delay:0.24s} .delay-4{animation-delay:0.32s}

  .text-shimmer {
    background: linear-gradient(90deg,#60a5fa,#a78bfa,#34d399,#60a5fa);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .glass-dark  { background:rgba(13,29,52,0.72); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); }
  .glass-light { background:rgba(255,255,255,0.8); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); }

  .auth-input {
    width: 100%; padding: 13px 16px;
    border-radius: 14px; font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; transition: border-color 0.25s, box-shadow 0.25s;
  }
  .auth-input:focus { box-shadow: 0 0 0 3px rgba(56,189,248,0.22); }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background:rgba(56,139,199,0.4); border-radius:3px; }
`;

const ROLE_CONFIG = {
  student: {
    emoji: "🎓", label: "Student",
    accent: "#38BDF8", accentDim: "rgba(56,189,248,0.15)",
    tagline: "Your learning journey starts here.",
    sideBg: "linear-gradient(145deg, #062040, #0a2a4a)",
    extraSignup: [
      { id: "class",    label: "Class / Grade",      type: "text",   placeholder: "e.g. Class 10 or 12th" },
      { id: "language", label: "Preferred Language", type: "select",
        options: ["Hindi","Marathi","Tamil","Bengali","Telugu","Kannada","Urdu","Gujarati","English"] },
    ],
    dashboard: "/student/dashboard",
  },
  teacher: {
    emoji: "📚", label: "Teacher",
    accent: "#14B8A6", accentDim: "rgba(20,184,166,0.15)",
    tagline: "Empower your classroom with real intelligence.",
    sideBg: "linear-gradient(145deg, #042626, #063030)",
    extraSignup: [
      { id: "school",  label: "School Name",       type: "text", placeholder: "e.g. Govt. High School, Pune" },
      { id: "subject", label: "Subject(s) Taught", type: "text", placeholder: "e.g. Mathematics, Science" },
    ],
    dashboard: "/teacher/dashboard",
  },
  mentor: {
    emoji: "⭐", label: "Peer Mentor",
    accent: "#F59E0B", accentDim: "rgba(245,158,11,0.15)",
    tagline: "Teach others. Build credentials. Earn while you learn.",
    sideBg: "linear-gradient(145deg, #271800, #3a2200)",
    extraSignup: [
      { id: "subject", label: "Subject Expertise",    type: "text", placeholder: "e.g. Mathematics" },
      { id: "upi",     label: "UPI ID (for payouts)", type: "text", placeholder: "e.g. yourname@upi" },
    ],
    dashboard: "/mentor/dashboard",
  },
};

/* ── Icons ── */
const LogoMark = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
    <defs>
      <linearGradient id="auth-lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8"/><stop offset="1" stopColor="#1A5A9A"/>
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#auth-lg)"/>
    <path d="M8 9h9a5.5 5.5 0 0 1 0 11H8V9z" fill="white" fillOpacity="0.95"/>
    <circle cx="27" cy="24" r="3.5" fill="white" fillOpacity="0.85"/>
    <line x1="27" y1="9" x2="27" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85"/>
  </svg>
);

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="3" y1="3" x2="21" y2="21"/>
  </svg>
);
const CheckShield = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.2" stroke="currentColor" strokeOpacity="0.4"/>
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function MeshBg({ dark, accent }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        background: dark
          ? "radial-gradient(ellipse at 50% 60%, #0d2744 0%, #060d1a 60%, #0a1628 100%)"
          : "radial-gradient(ellipse at 50% 60%, #e0f2fe 0%, #f0f9ff 60%, #f8fafc 100%)"
      }}/>
      <div className="orb orb-drift absolute rounded-full" style={{
        width: 500, height: 500, top: "-15%", right: "-10%",
        background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`
      }}/>
      <div className="orb absolute rounded-full" style={{
        width: 380, height: 380, animationDelay: "3s", bottom: "0%", left: "-8%",
        background: dark
          ? "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)"
      }}/>
      <div className="absolute inset-0" style={{
        backgroundImage: dark
          ? "linear-gradient(rgba(56,139,199,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,139,199,0.03) 1px,transparent 1px)"
          : "linear-gradient(rgba(56,139,199,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(56,139,199,0.05) 1px,transparent 1px)",
        backgroundSize: "58px 58px"
      }}/>
    </div>
  );
}

function Field({ id, label, type = "text", placeholder, value, onChange, required, options, dark, children }) {
  const borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const bg          = dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)";
  const textColor   = dark ? "#f1f5f9" : "#1e293b";

  if (type === "select") {
    return (
      <div>
        <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: dark ? "#64748b" : "#94a3b8" }}>
          {label}
        </label>
        <select
          id={id} value={value} onChange={onChange} required={required}
          className="auth-input"
          style={{ background: bg, border: `1.5px solid ${borderColor}`, color: textColor }}
        >
          <option value="">Select language…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: dark ? "#64748b" : "#94a3b8" }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id} type={type} placeholder={placeholder}
          value={value} onChange={onChange} required={required}
          className="auth-input"
          style={{
            background: bg,
            border: `1.5px solid ${borderColor}`,
            color: textColor,
            paddingRight: children ? 44 : 16,
          }}
        />
        {children && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{children}</div>
        )}
      </div>
    </div>
  );
}

function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="flex items-center rounded-full px-1 focus:outline-none"
      style={{
        width: 56, height: 28,
        background: dark ? "#0284c7" : "#e2e8f0",
        transition: "background 0.3s ease",
      }}
      aria-label="Toggle theme"
    >
      <div
        className="flex items-center justify-center rounded-full bg-white shadow-md"
        style={{
          width: 20, height: 20,
          transform: dark ? "translateX(28px)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          color: dark ? "#0284c7" : "#f59e0b",
        }}
      >
        {dark ? <MoonIcon /> : <SunIcon />}
      </div>
    </button>
  );
}

export default function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const { role = "student" } = useParams();
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const isLogin = mode === "login";

  const { user, login, signup, dark: globalDark, toggleDark } = useApp();

  const [dark, setDark] = useState(globalDark);
  useEffect(() => { setDark(globalDark); }, [globalDark]);

  // ✅ Navigate as soon as user is set in context (after onAuthStateChange fires)
  useEffect(() => {
    if (user) navigate(cfg.dashboard, { replace: true });
  }, [user, cfg.dashboard, navigate]);

  const localToggle = () => { toggleDark(); setDark(d => !d); };

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
    class: "", language: "", school: "", subject: "", upi: "",
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [successMsg,  setSuccessMsg]  = useState("");

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isLogin && form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!isLogin && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        // ✅ No navigate here — the useEffect above handles it when user state updates
      } else {
        await signup(form.email, form.password, {
          name:     form.name || form.email.split("@")[0],
          role,
          language: form.language || null,
          school:   form.school   || null,
          subject:  form.subject  || null,
          upi:      form.upi      || null,
        });
        // If email confirmation is OFF in Supabase, user is set immediately and
        // the useEffect above will navigate. If it's ON, show the message below.
        setSuccessMsg("Account created! Check your email to confirm, then log in.");
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else if (msg.includes("User already registered")) {
        setError("An account with this email already exists. Try logging in.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Please check your email and confirm your account first.");
      } else if (msg.includes("fetch") || msg.includes("network")) {
        setError("Network error. Check your internet connection.");
      } else {
        setError(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cardBg = dark ? "rgba(13,25,45,0.82)" : "rgba(255,255,255,0.88)";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: AUTH_CSS }} />

      <div className={`w-full min-h-screen flex overflow-x-hidden relative ${dark ? "text-white" : "text-slate-900"}`}>
        <MeshBg dark={dark} accent={cfg.accent} />

        {/* ════ LEFT PANEL ════ */}
        <div
          className="hidden lg:flex flex-col justify-between w-[42%] shrink-0 relative overflow-hidden p-12"
          style={{ background: cfg.sideBg }}
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none orb"
            style={{ background: `radial-gradient(circle, ${cfg.accent}18 0%, transparent 70%)` }}/>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none orb"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)", animationDelay: "3s" }}/>

          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 w-fit">
            <LogoMark />
            <span className="font-display text-xl italic text-white tracking-tight">
              Pathway<span className="text-sky-400 font-bold not-italic">AI</span>
            </span>
          </button>

          <div>
            <div className="text-5xl mb-5">{cfg.emoji}</div>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: cfg.accent }}>
              {cfg.label} Portal
            </p>
            <h2 className="font-display text-3xl italic text-white leading-snug mb-6 tracking-tight">
              {cfg.tagline}
            </h2>

            <div className="space-y-3.5">
              {[
                "Works on 2G and fully offline",
                "9 Indian languages supported",
                "Free forever for students",
                "Backed by Enactus India",
                "No ads, ever",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}45` }}>
                    <CheckShield style={{ color: cfg.accent }} />
                  </div>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-8">
              {[
                { id: "student", emoji: "🎓" },
                { id: "teacher", emoji: "📚" },
                { id: "mentor",  emoji: "⭐" },
              ].map((r) => (
                <button key={r.id} onClick={() => navigate(`/${mode}/${r.id}`)}
                  className="w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: role === r.id ? `${cfg.accent}25` : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${role === r.id ? cfg.accent + "60" : "rgba(255,255,255,0.1)"}`,
                  }}>
                  {r.emoji}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2026 PathwayAI · Enactus EnCode</p>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="flex-1 flex items-center justify-center p-5 md:p-10 relative">

          {/* Mobile top bar */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 glass-dark border-b border-white/10">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <LogoMark />
              <span className="font-display text-lg italic text-white">
                Pathway<span className="text-sky-400 font-bold">AI</span>
              </span>
            </button>
            <ThemeToggle dark={dark} toggle={localToggle} />
          </div>

          <div className="w-full max-w-[440px] mt-10 lg:mt-0">

            {/* Desktop top bar */}
            <div className="hidden lg:flex items-center justify-between mb-7">
              <button onClick={() => navigate("/role")}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border"
                style={{
                  borderColor: dark ? "#1e293b" : "#e2e8f0",
                  color: dark ? "#64748b" : "#94a3b8",
                }}>
                ← Change role
              </button>
              <ThemeToggle dark={dark} toggle={localToggle} />
            </div>

            {/* Auth card */}
            <div
              className="animate-fade-up rounded-3xl p-8 md:p-9 backdrop-blur-lg border"
              style={{
                background: cardBg,
                borderColor: `${cfg.accent}30`,
                boxShadow: `0 24px 64px ${cfg.accent}18, 0 4px 24px rgba(0,0,0,${dark ? "0.4" : "0.08"})`,
              }}
            >
              {/* Role badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{ background: cfg.accentDim, color: cfg.accent, border: `1px solid ${cfg.accent}35` }}
              >
                <span>{cfg.emoji}</span> {cfg.label}
              </div>

              {/* Heading */}
              <h1 className="font-display text-3xl italic tracking-tight mb-1.5">
                <span style={{ color: dark ? "#f1f5f9" : "#0f172a" }}>
                  {isLogin ? "Welcome back." : "Create account."}
                </span>
              </h1>
              <p className="text-sm mb-6" style={{ color: dark ? "#64748b" : "#94a3b8" }}>
                {isLogin
                  ? `Log in to your ${cfg.label.toLowerCase()} account.`
                  : `Join PathwayAI as a ${cfg.label.toLowerCase()}.`}
              </p>

              {/* Login / Signup tabs */}
              <div
                className="flex rounded-xl p-1 mb-6"
                style={{ background: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}
              >
                {[["login", "Log In"], ["signup", "Sign Up"]].map(([m, lbl]) => (
                  <button
                    key={m}
                    onClick={() => { setError(""); setSuccessMsg(""); navigate(`/${m}/${role}`); }}
                    className="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                    style={{
                      background: mode === m
                        ? `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}bb)`
                        : "transparent",
                      color: mode === m ? "#fff" : (dark ? "#475569" : "#94a3b8"),
                      boxShadow: mode === m ? `0 2px 12px ${cfg.accent}35` : "none",
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Success banner */}
              {successMsg && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" }}>
                  ✅ {successMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {!isLogin && (
                  <Field id="name" label="Full Name" placeholder="Your full name"
                    value={form.name} onChange={set("name")} required dark={dark} />
                )}

                <Field id="email" label="Email Address" type="email" placeholder="you@email.com"
                  value={form.email} onChange={set("email")} required dark={dark} />

                {!isLogin && (
                  <Field id="phone" label="Mobile Number" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={set("phone")} dark={dark} />
                )}

                {!isLogin && cfg.extraSignup.map((f) => (
                  <Field
                    key={f.id} id={f.id} label={f.label} type={f.type}
                    placeholder={f.placeholder} options={f.options}
                    value={form[f.id]} onChange={set(f.id)}
                    dark={dark}
                  />
                ))}

                <Field
                  id="password" label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder={isLogin ? "Your password" : "Create a strong password (min 6 chars)"}
                  value={form.password} onChange={set("password")} required dark={dark}
                >
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ color: dark ? "#475569" : "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
                    {showPass ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </Field>

                {!isLogin && (
                  <Field
                    id="confirm" label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirm} onChange={set("confirm")} required dark={dark}
                  >
                    <button type="button" onClick={() => setShowConfirm(s => !s)}
                      style={{ color: dark ? "#475569" : "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
                      {showConfirm ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </Field>
                )}

                {isLogin && (
                  <div className="text-right -mt-1">
                    <button type="button" className="text-xs font-bold hover:underline"
                      style={{ color: cfg.accent, background: "none", border: "none", cursor: "pointer" }}>
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="animate-glow-pulse"
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontWeight: 700, color: "white", fontSize: 14,
                    padding: "14px 0", borderRadius: 16, border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}99)`,
                    boxShadow: `0 6px 24px ${cfg.accent}35`,
                    opacity: loading ? 0.65 : 1,
                    marginTop: 8,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      {isLogin ? "Signing in…" : "Creating account…"}
                    </>
                  ) : (
                    isLogin ? `Log in as ${cfg.label} →` : `Create ${cfg.label} Account →`
                  )}
                </button>

                <p className="text-center text-xs pt-1" style={{ color: dark ? "#475569" : "#94a3b8" }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setSuccessMsg(""); navigate(`/${isLogin ? "signup" : "login"}/${role}`); }}
                    className="font-bold hover:underline"
                    style={{ color: cfg.accent, background: "none", border: "none", cursor: "pointer" }}
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </p>
              </form>
            </div>

            {/* Mobile role switcher */}
            <div className="flex justify-center gap-2.5 mt-5 lg:hidden">
              {[
                { id: "student", emoji: "🎓", label: "Student" },
                { id: "teacher", emoji: "📚", label: "Teacher" },
                { id: "mentor",  emoji: "⭐", label: "Mentor"  },
              ].map((r) => (
                <button key={r.id} onClick={() => navigate(`/${mode}/${r.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    borderColor: role === r.id ? cfg.accent : (dark ? "#1e293b" : "#e2e8f0"),
                    color: role === r.id ? cfg.accent : (dark ? "#475569" : "#94a3b8"),
                    background: role === r.id ? `${cfg.accent}12` : "transparent",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}