/**
 * Dashboard.jsx — Student main dashboard
 * src/pages/student/Dashboard.jsx
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext"; // ← FIXED IMPORT

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
  .font-display { font-family: 'DM Serif Display', serif; }
  @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fade-up 0.5s ease both; }
  .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.1s; } .d3 { animation-delay: 0.15s; }
  .d4 { animation-delay: 0.2s; } .d5 { animation-delay: 0.25s; }
  .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
`;

const STRUGGLE_DATA = [
  { subject: "Mathematics", score: 62, icon: "📐", accent: "#38BDF8", topics: ["Quadratic Eq", "Trigonometry"] },
  { subject: "Science",     score: 78, icon: "⚛️", accent: "#14B8A6", topics: ["Newton's Laws", "Reactions"]   },
  { subject: "History",     score: 85, icon: "📖", accent: "#8B5CF6", topics: ["Freedom Movement"]             },
];

const TODAY_PLAN = [
  { time: "4:00 PM", subject: "Mathematics", topic: "Quadratic Equations — Factorisation", type: "lesson", icon: "📐", done: false },
  { time: "5:00 PM", subject: "Science",     topic: "Newton's Laws — Quiz",               type: "quiz",   icon: "📝", done: true  },
  { time: "5:30 PM", subject: "History",     topic: "Non-Cooperation Movement",           type: "lesson", icon: "📖", done: false },
];

const QUICK_STATS = [
  { label: "Day Streak",   value: "12",     icon: "🔥", color: "#F97316" },
  { label: "Sessions/wk", value: "6",      icon: "⭐", color: "#F59E0B" },
  { label: "Earned",       value: "₹2,400", icon: "💰", color: "#22C55E" },
  { label: "Credentials", value: "3",      icon: "🏅", color: "#38BDF8" },
];

function ScoreBar({ score }) {
  const color = score < 60 ? "#EF4444" : score < 75 ? "#F59E0B" : "#22C55E";
  return (
    <div style={{ height: 8, borderRadius: 999, background: "rgba(148,163,184,0.2)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 999, transition: "width 0.7s ease" }} />
    </div>
  );
}

export default function Dashboard() {
  const { user, dark, toggleDark } = useApp(); // ← reads from context
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = user?.name || "Kavya";

  const bg   = dark ? "#020817"    : "#f8fafc";
  const card = dark ? { background: "#0f172a", border: "1px solid #1e293b" }
                    : { background: "#ffffff",  border: "1px solid #e2e8f0" };
  const text  = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#64748b" : "#94a3b8";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div style={{ minHeight: "100vh", background: bg, padding: "32px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Top bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }} className="fade-up">
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 4 }}>{greeting} 👋</p>
            <h1 className="font-display" style={{ fontSize: 28, color: text, fontStyle: "italic", margin: 0 }}>
              Ready to learn, <span style={{ color: "#38BDF8" }}>{name}?</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Theme toggle */}
            <button
              onClick={toggleDark}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: dark ? "#0284c7" : "#e2e8f0", padding: 2, display: "flex", alignItems: "center",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "white",
                transform: dark ? "translateX(20px)" : "translateX(0)",
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11,
              }}>
                {dark ? "🌙" : "☀"}
              </div>
            </button>
            {/* Logout */}
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "6px 14px", borderRadius: 10, border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
                background: "transparent", color: muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Home
            </button>
          </div>
        </div>

        {/* ── Quick stats ── */}
        <div className="fade-up d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 28 }}>
          {QUICK_STATS.map((s) => (
            <div key={s.label} className="card-hover" style={{ ...card, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: muted }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 24 }}>

            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Struggle Scores */}
              <div className="fade-up d2" style={{ ...card, borderRadius: 20, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 className="font-display" style={{ fontSize: 18, color: text, fontStyle: "italic", margin: 0 }}>Struggle Score</h2>
                  <span style={{ fontSize: 11, fontWeight: 600, color: muted, background: dark ? "#1e293b" : "#f1f5f9", padding: "4px 10px", borderRadius: 8 }}>
                    Lower = needs work
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {STRUGGLE_DATA.map((s) => (
                    <div key={s.subject}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{s.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{s.subject}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: muted }}>{s.topics[0]}</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: s.score < 60 ? "#EF4444" : s.score < 75 ? "#F59E0B" : "#22C55E" }}>
                            {s.score}
                          </span>
                        </div>
                      </div>
                      <ScoreBar score={s.score} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Plan */}
              <div className="fade-up d3" style={{ ...card, borderRadius: 20, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 className="font-display" style={{ fontSize: 18, color: text, fontStyle: "italic", margin: 0 }}>Today's Plan</h2>
                  <button onClick={() => navigate("/student/study-plan")}
                    style={{ fontSize: 12, color: "#38BDF8", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Full plan →
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TODAY_PLAN.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                      borderRadius: 14, border: `1px solid ${item.done ? (dark ? "#1e293b" : "#e2e8f0") : (dark ? "#334155" : "#bfdbfe")}`,
                      opacity: item.done ? 0.55 : 1, background: item.done ? "transparent" : (dark ? "#0f1f35" : "#f0f9ff"),
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: muted, width: 52, flexShrink: 0 }}>{item.time}</span>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: muted, marginBottom: 2 }}>{item.subject}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.topic}</div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, flexShrink: 0,
                        background: item.type === "quiz" ? (dark ? "rgba(139,92,246,0.2)" : "#ede9fe") : (dark ? "rgba(56,189,248,0.15)" : "#e0f2fe"),
                        color: item.type === "quiz" ? (dark ? "#c4b5fd" : "#7c3aed") : (dark ? "#7dd3fc" : "#0369a1"),
                      }}>
                        {item.type}
                      </span>
                      {item.done && <span style={{ color: "#22C55E", fontSize: 14, flexShrink: 0 }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Quick Actions */}
              <div className="fade-up d4" style={{ ...card, borderRadius: 20, padding: 20 }}>
                <h2 className="font-display" style={{ fontSize: 18, color: text, fontStyle: "italic", margin: "0 0 16px" }}>Quick Actions</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Ask AI Tutor",    path: "/student/ai-tutor",    icon: "🤖", accent: "#38BDF8" },
                    { label: "Take a Quiz",     path: "/student/quiz",        icon: "📝", accent: "#8B5CF6" },
                    { label: "Find a Mentor",   path: "/student/mentors",     icon: "⭐", accent: "#F59E0B" },
                    { label: "Credentials",     path: "/student/credentials", icon: "🏅", accent: "#22C55E" },
                    { label: "Browse Employers",path: "/student/employers",   icon: "💼", accent: "#14B8A6" },
                    {label: "Study Plan",path:"/student/studyplan",icon:"📚", accent:"#14B8A6"},
                     {label: "Animated Lessons",path:"/student/lessons",icon:"🎬", accent:"#14B8A6"},
                  ].map((a) => (
                    <button key={a.path} onClick={() => navigate(a.path)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                        borderRadius: 12, border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
                        background: "transparent", cursor: "pointer", textAlign: "left", width: "100%",
                        fontSize: 13, fontWeight: 600, color: dark ? "#cbd5e1" : "#475569",
                        transition: "all 0.2s",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = a.accent + "80";
                        e.currentTarget.style.background = a.accent + "10";
                        e.currentTarget.style.color = dark ? "#f1f5f9" : "#0f172a";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = dark ? "#1e293b" : "#e2e8f0";
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = dark ? "#cbd5e1" : "#475569";
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{a.icon}</span>
                      <span style={{ flex: 1 }}>{a.label}</span>
                      <span style={{ color: a.accent, fontSize: 12 }}>→</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mentor tip card */}
              <div className="fade-up d5" style={{ borderRadius: 20, padding: 20, background: "linear-gradient(135deg, #0D2744, #163B5C)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>⭐</span>
                  <span style={{ color: "#7dd3fc", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>Earn as Mentor</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                  Your Math score is above 85! You're eligible to become a peer mentor and earn{" "}
                  <span style={{ color: "#FBB F24", fontWeight: 700, color: "#fbbf24" }}>₹50–₹150/session</span>.
                </p>
                <button onClick={() => navigate("/student/mentors")}
                  style={{
                    width: "100%", background: "linear-gradient(135deg, #f59e0b, #f97316)",
                    color: "white", fontSize: 12, fontWeight: 700, padding: "10px 0",
                    borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                  Apply to Mentor →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}