/**
 * Credentials.jsx — Student Open Badge Credentials
 * src/pages/student/Credentials.jsx
 *
 * Shows earned badges, skill progress toward next badge,
 * shareable credential cards, and employer verification view.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/* ── Badge data ── */
const ALL_BADGES = [
  {
    id: "math-bronze",
    subject: "Mathematics",
    icon: "∑",
    tier: "Bronze",
    tierIcon: "🥉",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.35)",
    gradient: "linear-gradient(135deg, #92400e, #b45309, #CD7F32)",
    earned: true,
    earnedDate: "12 Jan 2026",
    score: 74,
    desc: "Demonstrated foundational understanding of algebraic concepts and equations.",
    skills: ["Algebra", "Linear Equations", "Basic Geometry"],
    shareUrl: "https://pathwayai.in/verify/MATH-BRZ-2026-001",
  },
  {
    id: "science-bronze",
    subject: "Science",
    icon: "⚗",
    tier: "Bronze",
    tierIcon: "🥉",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.35)",
    gradient: "linear-gradient(135deg, #92400e, #b45309, #CD7F32)",
    earned: true,
    earnedDate: "18 Jan 2026",
    score: 78,
    desc: "Solid grasp of fundamental physics and chemistry concepts.",
    skills: ["Newton's Laws", "Chemical Reactions", "Matter & Energy"],
    shareUrl: "https://pathwayai.in/verify/SCI-BRZ-2026-003",
  },
  {
    id: "math-silver",
    subject: "Mathematics",
    icon: "∑",
    tier: "Silver",
    tierIcon: "🥈",
    color: "#94A3B8",
    glow: "rgba(148,163,184,0.35)",
    gradient: "linear-gradient(135deg, #475569, #64748b, #94A3B8)",
    earned: true,
    earnedDate: "25 Jan 2026",
    score: 87,
    desc: "Advanced proficiency in quadratic equations, trigonometry, and statistical analysis.",
    skills: ["Quadratic Equations", "Trigonometry", "Statistics", "Coordinate Geometry"],
    shareUrl: "https://pathwayai.in/verify/MATH-SLV-2026-007",
  },
  {
    id: "coding-bronze",
    subject: "Coding",
    icon: "</>",
    tier: "Bronze",
    tierIcon: "🥉",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.35)",
    gradient: "linear-gradient(135deg, #92400e, #b45309, #CD7F32)",
    earned: true,
    earnedDate: "02 Feb 2026",
    score: 81,
    desc: "Demonstrated competency in Python basics, arrays, and sorting algorithms.",
    skills: ["Python Basics", "Arrays", "Sorting Algorithms", "OOP Concepts"],
    shareUrl: "https://pathwayai.in/verify/CODE-BRZ-2026-012",
  },
  {
    id: "math-gold",
    subject: "Mathematics",
    icon: "∑",
    tier: "Gold",
    tierIcon: "🥇",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
    gradient: "linear-gradient(135deg, #92400e, #d97706, #F59E0B, #fbbf24)",
    earned: false,
    progress: 72,
    required: 90,
    desc: "Master-level mathematics — calculus, probability, and advanced geometry.",
    skills: ["Calculus", "Probability", "Advanced Geometry", "Number Theory"],
    unlockHint: "Score 90%+ on 3 more Math quizzes",
  },
  {
    id: "science-silver",
    subject: "Science",
    icon: "⚗",
    tier: "Silver",
    tierIcon: "🥈",
    color: "#94A3B8",
    glow: "rgba(148,163,184,0.3)",
    gradient: "linear-gradient(135deg, #475569, #64748b, #94A3B8)",
    earned: false,
    progress: 45,
    required: 85,
    desc: "Advanced science — electromagnetism, organic chemistry, cell biology.",
    skills: ["Electromagnetism", "Organic Chemistry", "Cell Biology"],
    unlockHint: "Complete 5 more Science quizzes with 80%+ score",
  },
  {
    id: "history-bronze",
    subject: "History",
    icon: "🏛",
    tier: "Bronze",
    tierIcon: "🥉",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.3)",
    gradient: "linear-gradient(135deg, #92400e, #b45309, #CD7F32)",
    earned: false,
    progress: 30,
    required: 70,
    desc: "Foundation in ancient and modern Indian history.",
    skills: ["Ancient India", "Freedom Movement", "Modern History"],
    unlockHint: "Score 70%+ on 2 History quizzes",
  },
  {
    id: "mentor-star",
    subject: "Peer Mentor",
    icon: "⭐",
    tier: "Gold",
    tierIcon: "🥇",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
    gradient: "linear-gradient(135deg, #78350f, #d97706, #fbbf24)",
    earned: false,
    progress: 0,
    required: 100,
    desc: "Recognised for exceptional peer mentoring and teaching impact.",
    skills: ["Teaching", "Mentorship", "Communication"],
    unlockHint: "Complete 10 mentor sessions with 4.5★+ rating",
  },
];

const earned  = ALL_BADGES.filter(b => b.earned);
const locked  = ALL_BADGES.filter(b => !b.earned);

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cred-app { min-height: 100vh; font-family: 'DM Sans', sans-serif; transition: background 0.3s, color 0.3s; }
  .cred-app.dark  { background: #070E1C; color: #E2EEFF; }
  .cred-app.light { background: #EBF4FF; color: #0F172A; }

  /* Mesh */
  .mesh-fixed { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  @keyframes orb-float { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,-15px)scale(1.05)} }
  .orb { position: absolute; border-radius: 50%; animation: orb-float 12s ease-in-out infinite; }

  /* Animations */
  @keyframes fade-up  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scale-in { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes badge-spin { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
  @keyframes glow-breathe { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.1)} }
  @keyframes float-badge { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-8px) rotate(1deg)} }
  @keyframes particle { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0} }
  @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
  @keyframes slide-in-right { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }

  .animate-fade-up  { animation: fade-up  0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-float    { animation: float-badge 5s ease-in-out infinite; }
  .animate-slide-right { animation: slide-in-right 0.5s cubic-bezier(0.16,1,0.3,1) both; }

  .d1{animation-delay:0.05s} .d2{animation-delay:0.1s} .d3{animation-delay:0.15s}
  .d4{animation-delay:0.2s}  .d5{animation-delay:0.25s} .d6{animation-delay:0.3s}
  .d7{animation-delay:0.35s} .d8{animation-delay:0.4s}

  .text-shimmer {
    background: linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  /* Badge hex shape */
  .badge-hex {
    width: 110px; height: 110px;
    clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
    display: flex; align-items: center; justify-content: center;
    position: relative; flex-shrink: 0;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    cursor: pointer;
  }
  .badge-hex:hover { transform: scale(1.08) rotate(3deg); }
  .badge-hex-sm {
    width: 72px; height: 72px;
    clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* Card */
  .cred-card {
    border-radius: 24px;
    transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
  }
  .dark  .cred-card { background: rgba(13,27,46,0.85); border: 1px solid rgba(59,130,246,0.15); backdrop-filter: blur(20px); }
  .light .cred-card { background: rgba(255,255,255,0.88); border: 1px solid rgba(147,197,253,0.4); backdrop-filter: blur(20px); box-shadow: 0 4px 24px rgba(37,99,235,0.07); }
  .cred-card:hover  { transform: translateY(-3px); }

  /* Earned badge card */
  .badge-card { border-radius: 20px; padding: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
  .dark  .badge-card { background: rgba(13,27,46,0.9); border: 1px solid rgba(59,130,246,0.15); }
  .light .badge-card { background: rgba(255,255,255,0.9); border: 1px solid rgba(147,197,253,0.3); box-shadow: 0 4px 20px rgba(37,99,235,0.06); }
  .badge-card:hover  { transform: translateY(-5px); }

  /* Locked badge card */
  .locked-card { border-radius: 20px; padding: 20px; transition: all 0.25s; }
  .dark  .locked-card { background: rgba(10,20,38,0.7); border: 1px solid rgba(59,130,246,0.08); }
  .light .locked-card { background: rgba(248,250,252,0.8); border: 1px solid rgba(147,197,253,0.25); }

  /* Progress bar */
  .prog-track { height: 6px; border-radius: 3px; overflow: hidden; }
  .dark  .prog-track { background: rgba(255,255,255,0.07); }
  .light .prog-track { background: rgba(0,0,0,0.07); }
  .prog-fill { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

  /* Skill pill */
  .skill-pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .dark  .skill-pill { background: rgba(59,130,246,0.15); color: #93C5FD; border: 1px solid rgba(59,130,246,0.2); }
  .light .skill-pill { background: rgba(219,234,254,0.7); color: #1D4ED8; border: 1px solid rgba(147,197,253,0.4); }

  /* Share card overlay */
  .share-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .share-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); }
  .share-modal { position: relative; z-index: 1; width: 100%; max-width: 480px; border-radius: 28px; overflow: hidden; animation: scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both; }

  /* Credential card (shareable) */
  .credential-card-preview {
    padding: 36px; background: linear-gradient(145deg, #0D2744, #163B5C, #0D2744);
    position: relative; overflow: hidden;
  }

  /* QR mock */
  .qr-mock { width: 72px; height: 72px; border-radius: 10px; background: white; display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; padding: 8px; }
  .qr-cell { border-radius: 1px; }

  /* Pulse ring */
  .pulse-ring {
    position: absolute; border-radius: 50%;
    animation: pulse-ring 2s ease-out infinite;
    pointer-events: none;
  }

  /* Tab */
  .tab-btn { padding: 9px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 3px; }

  /* Tooltip */
  .copy-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 14px; background: #22C55E; color: white; font-weight: 700; font-size: 13px; animation: fade-up 0.3s ease both; z-index: 200; box-shadow: 0 8px 24px rgba(34,197,94,0.4); }
`;

/* ─────────────────────────────────────────────
   QR CODE MOCK
───────────────────────────────────────────── */
function QRMock({ seed }) {
  const pattern = Array.from({ length: 49 }, (_, i) => ((seed * (i + 1) * 7) % 3) !== 0);
  return (
    <div className="qr-mock">
      {pattern.map((filled, i) => (
        <div key={i} className="qr-cell" style={{ background: filled ? "#0D2744" : "transparent" }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARE MODAL — credential card
───────────────────────────────────────────── */
function ShareModal({ badge, user, onClose, dark }) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast]   = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(badge.shareUrl).catch(() => {});
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const textMain = dark ? "#E2EEFF" : "#0F172A";
  const textMuted = dark ? "#64748B" : "#94A3B8";

  return (
    <>
      <div className="share-overlay">
        <div className="share-backdrop" onClick={onClose} />
        <div className="share-modal animate-scale-in">
          {/* Credential card preview */}
          <div className="credential-card-preview">
            {/* Background decoration */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(59,130,246,0.08) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${badge.glow} 0%, transparent 70%)` }} />

            {/* PathwayAI header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, position: "relative" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #38BDF8, #1A5A9A)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 14, fontFamily: "'Syne', sans-serif" }}>P</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "white", fontFamily: "'Syne', sans-serif" }}>PathwayAI</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>OPEN BADGE CREDENTIAL</div>
              </div>
              <div style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", fontSize: 10, color: "#86EFAC", fontWeight: 700 }}>✓ VERIFIED</div>
            </div>

            {/* Badge + info */}
            <div style={{ display: "flex", gap: 20, alignItems: "center", position: "relative" }}>
              <div className="badge-hex" style={{ width: 80, height: 80, background: badge.gradient, animation: "float-badge 4s ease-in-out infinite" }}>
                <span style={{ fontSize: 28, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>{badge.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{badge.tierIcon} {badge.tier} Badge</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "white", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{badge.subject}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{badge.desc}</div>
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginTop: 20, position: "relative" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>VERIFIED SKILLS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {badge.skills.map(s => (
                  <span key={s} style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(59,130,246,0.25)", border: "1px solid rgba(59,130,246,0.35)", fontSize: 11, fontWeight: 600, color: "#93C5FD" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Footer — holder + QR */}
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>AWARDED TO</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "white", fontFamily: "'Syne', sans-serif" }}>{user?.name || "Student"}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Earned {badge.earnedDate} · Score {badge.score}%</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <QRMock seed={badge.id.length * 17} />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>SCAN TO VERIFY</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ padding: 20, background: dark ? "#0F1A2E" : "white", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 12, color: textMuted, textAlign: "center", marginBottom: 4 }}>
              Share this credential with employers or on social media
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={copyLink} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${dark ? "rgba(59,130,246,0.3)" : "rgba(147,197,253,0.5)"}`, background: dark ? "rgba(59,130,246,0.1)" : "rgba(219,234,254,0.5)", color: dark ? "#93C5FD" : "#1D4ED8", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                🔗 Copy Link
              </button>
              <button style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                📱 WhatsApp
              </button>
              <button style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0077B5, #005885)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                💼 LinkedIn
              </button>
            </div>
            <button onClick={onClose} style={{ padding: "10px 0", borderRadius: 12, border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, background: "transparent", color: textMuted, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Close
            </button>
          </div>
        </div>
      </div>
      {toast && <div className="copy-toast">✓ Link copied to clipboard!</div>}
    </>
  );
}

/* ─────────────────────────────────────────────
   EARNED BADGE CARD
───────────────────────────────────────────── */
function EarnedBadgeCard({ badge, index, onShare, dark }) {
  const textMain  = dark ? "#E2EEFF"  : "#0F172A";
  const textMuted = dark ? "#64748B"  : "#94A3B8";

  return (
    <div className={`badge-card animate-fade-up d${index + 1}`} onClick={() => onShare(badge)}
      style={{ boxShadow: `0 8px 32px ${badge.glow}` }}>

      {/* Glow pulse behind hex */}
      <div className="pulse-ring" style={{ width: 80, height: 80, top: 20, left: 20, border: `2px solid ${badge.color}`, opacity: 0.3 }} />

      {/* Top row */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
        <div className="badge-hex animate-float" style={{ background: badge.gradient, boxShadow: `0 8px 24px ${badge.glow}` }}>
          <span style={{ fontSize: 36, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))", lineHeight: 1 }}>{badge.icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{badge.tierIcon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: badge.color }}>{badge.tier}</span>
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: textMain, marginBottom: 4 }}>{badge.subject}</h3>
          <div style={{ fontSize: 12, color: textMuted }}>Earned {badge.earnedDate} · {badge.score}%</div>
        </div>
        {/* Share icon */}
        <div style={{ width: 32, height: 32, borderRadius: 10, background: dark ? "rgba(59,130,246,0.15)" : "rgba(219,234,254,0.7)", border: `1px solid ${dark ? "rgba(59,130,246,0.25)" : "rgba(147,197,253,0.5)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer", flexShrink: 0 }}>
          ↗
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: textMuted, lineHeight: 1.6, marginBottom: 14 }}>{badge.desc}</p>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {badge.skills.map(s => (
          <span key={s} className="skill-pill">{s}</span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, padding: "9px 14px", borderRadius: 12, background: `${badge.color}18`, border: `1px solid ${badge.color}40`, textAlign: "center", fontSize: 12, fontWeight: 700, color: badge.color, cursor: "pointer" }}>
          🔗 Share Credential
        </div>
        <div style={{ padding: "9px 14px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, fontSize: 12, fontWeight: 600, color: textMuted, cursor: "pointer", whiteSpace: "nowrap" }}>
          View Details
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOCKED BADGE CARD
───────────────────────────────────────────── */
function LockedBadgeCard({ badge, index, dark }) {
  const textMain  = dark ? "#E2EEFF"  : "#0F172A";
  const textMuted = dark ? "#475569"  : "#94A3B8";

  return (
    <div className={`locked-card animate-fade-up d${index + 1}`}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
        {/* Greyed-out hex */}
        <div className="badge-hex-sm" style={{ background: "linear-gradient(135deg, rgba(71,85,105,0.5), rgba(100,116,139,0.4))", filter: "grayscale(0.6)", opacity: 0.7 }}>
          <span style={{ fontSize: 22, opacity: 0.7 }}>{badge.icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 14, opacity: 0.5 }}>{badge.tierIcon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: dark ? "#334155" : "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.06em" }}>{badge.tier} · Locked 🔒</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: dark ? "#94A3B8" : "#64748B" }}>{badge.subject}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: dark ? "#334155" : "#CBD5E1" }}>{badge.progress}%</div>
      </div>

      {/* Progress bar */}
      <div className="prog-track" style={{ marginBottom: 8 }}>
        <div className="prog-fill" style={{ width: `${badge.progress}%`, background: `linear-gradient(90deg, ${badge.color}88, ${badge.color})` }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textMuted, marginBottom: 10 }}>
        <span>{badge.progress}% complete</span>
        <span>Need {badge.required}% to unlock</span>
      </div>

      <p style={{ fontSize: 12, color: dark ? "#334155" : "#CBD5E1", fontStyle: "italic" }}>💡 {badge.unlockHint}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Credentials() {
  const navigate = useNavigate();
  const { dark, toggleDark, user } = useApp();

  const [tab, setTab]           = useState("earned");   // earned | locked | verify
  const [shareModal, setShareModal] = useState(null);   // badge object
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const theme   = dark ? "dark" : "light";
  const textMain  = dark ? "#E2EEFF"  : "#0F172A";
  const textMuted = dark ? "#64748B"  : "#94A3B8";
  const cardBg    = { background: dark ? "rgba(13,27,46,0.85)" : "rgba(255,255,255,0.88)", border: `1px solid ${dark ? "rgba(59,130,246,0.15)" : "rgba(147,197,253,0.4)"}`, backdropFilter: "blur(20px)", borderRadius: 24 };

  // Fake verify result
  const handleVerify = () => {
    const found = ALL_BADGES.find(b => b.earned && b.shareUrl?.includes(verifyId.toUpperCase()));
    setVerifyResult(found ? { valid: true, badge: found } : verifyId.length > 5 ? { valid: false } : null);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`cred-app ${theme}`}>

        {/* Mesh */}
        <div className="mesh-fixed">
          <div style={{ position: "absolute", inset: 0, background: dark ? "radial-gradient(ellipse at 25% 35%, #0d2744 0%, #070E1C 60%)" : "radial-gradient(ellipse at 25% 35%, #dbeafe 0%, #EBF4FF 60%)" }} />
          <div className="orb" style={{ width: 500, height: 500, top: "-15%", right: "-10%", background: dark ? "radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)" : "radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)" }} />
          <div className="orb" style={{ width: 350, height: 350, bottom: "5%", left: "-5%", animationDelay: "5s", background: dark ? "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)" : "radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: dark ? "linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)" : "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* Topbar */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: dark ? "rgba(7,14,28,0.88)" : "rgba(235,244,255,0.88)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${dark ? "rgba(59,130,246,0.12)" : "rgba(147,197,253,0.4)"}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/student/dashboard")} style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${dark ? "rgba(59,130,246,0.25)" : "rgba(147,197,253,0.5)"}`, background: "transparent", color: textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Dashboard</button>
          <div style={{ flex: 1, fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: textMain }}>🏅 My Credentials</div>
          <div style={{ fontSize: 12, color: textMuted, fontWeight: 600 }}>{earned.length} earned · {locked.length} locked</div>
          <button onClick={toggleDark} style={{ width: 46, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: dark ? "#0284c7" : "#e2e8f0", padding: 2, display: "flex", alignItems: "center", transition: "background 0.3s" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", transform: dark ? "translateX(22px)" : "translateX(0)", transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{dark ? "🌙" : "☀"}</div>
          </button>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>

          {/* ── Hero stats ── */}
          <div className="animate-fade-up" style={{ ...cardBg, padding: 32, marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              {/* Big badge showcase */}
              <div style={{ display: "flex", gap: -8, position: "relative" }}>
                {earned.slice(0, 3).map((b, i) => (
                  <div key={b.id} className="badge-hex" style={{ width: 70, height: 70, background: b.gradient, marginLeft: i > 0 ? -16 : 0, zIndex: 3 - i, boxShadow: `0 6px 20px ${b.glow}` }} onClick={() => setShareModal(b)}>
                    <span style={{ fontSize: 22 }}>{b.icon}</span>
                  </div>
                ))}
                {earned.length > 3 && (
                  <div style={{ width: 70, height: 70, clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)", background: dark ? "rgba(30,50,80,0.9)" : "rgba(219,234,254,0.9)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: -16, zIndex: 0, fontSize: 13, fontWeight: 800, color: textMuted }}>
                    +{earned.length - 3}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: textMain, marginBottom: 6 }}>
                  {user?.name || "Student"}'s <span className="text-shimmer">Credential Portfolio</span>
                </h2>
                <p style={{ fontSize: 14, color: textMuted, marginBottom: 16 }}>
                  Verified by PathwayAI · Open Badge Standard · Shareable with employers
                </p>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[
                    { label: "Badges Earned",  val: earned.length,  color: "#F59E0B" },
                    { label: "Skills Verified", val: earned.reduce((s, b) => s + b.skills.length, 0), color: "#22C55E" },
                    { label: "In Progress",    val: locked.length,  color: "#3B82F6" },
                    { label: "Top Score",      val: Math.max(...earned.map(b => b.score)) + "%", color: "#818CF8" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: textMuted, fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employer verify button */}
              <button onClick={() => setTab("verify")} style={{ padding: "12px 22px", borderRadius: 14, background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(37,99,235,0.35)", whiteSpace: "nowrap" }}>
                🔍 Verify a Badge
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="animate-fade-up d1" style={{ display: "flex", gap: 8, marginBottom: 24, background: dark ? "rgba(13,27,46,0.7)" : "rgba(255,255,255,0.7)", padding: 6, borderRadius: 16, border: `1px solid ${dark ? "rgba(59,130,246,0.12)" : "rgba(147,197,253,0.35)"}`, backdropFilter: "blur(10px)", width: "fit-content" }}>
            {[
              { id: "earned", label: `🏅 Earned (${earned.length})` },
              { id: "locked", label: `🔒 In Progress (${locked.length})` },
              { id: "verify", label: "🔍 Verify" },
            ].map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
                style={{
                  background: tab === t.id ? "linear-gradient(135deg, #2563EB, #3B82F6)" : "transparent",
                  color: tab === t.id ? "white" : textMuted,
                  boxShadow: tab === t.id ? "0 3px 12px rgba(37,99,235,0.3)" : "none",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── EARNED TAB ── */}
          {tab === "earned" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {earned.map((b, i) => (
                <EarnedBadgeCard key={b.id} badge={b} index={i} onShare={setShareModal} dark={dark} />
              ))}
            </div>
          )}

          {/* ── LOCKED TAB ── */}
          {tab === "locked" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p className="animate-fade-up" style={{ fontSize: 14, color: textMuted, marginBottom: 4 }}>
                Complete quizzes and AI sessions to unlock these credentials. They're shareable with employers once earned.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                {locked.map((b, i) => (
                  <LockedBadgeCard key={b.id} badge={b} index={i} dark={dark} />
                ))}
              </div>

              {/* How to earn */}
              <div className="animate-fade-up d4" style={{ ...cardBg, padding: 24, marginTop: 8 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: textMain, marginBottom: 16 }}>🎯 How to Earn Badges</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  {[
                    { icon: "📝", label: "Take Quizzes", desc: "Score 70%+ on subject quizzes to build progress" },
                    { icon: "🤖", label: "Use AI Tutor", desc: "Complete AI tutor sessions for skill verification" },
                    { icon: "⭐", label: "Mentor Others", desc: "High-rated mentoring sessions earn bonus progress" },
                    { icon: "📈", label: "Consistency", desc: "Regular study streaks accelerate badge unlock" },
                  ].map(item => (
                    <div key={item.label} style={{ padding: "14px 16px", borderRadius: 14, background: dark ? "rgba(15,30,55,0.6)" : "rgba(241,245,249,0.8)", border: `1px solid ${dark ? "rgba(59,130,246,0.1)" : "rgba(147,197,253,0.3)"}` }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: textMain, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── VERIFY TAB ── */}
          {tab === "verify" && (
            <div className="animate-fade-up" style={{ maxWidth: 560 }}>
              <div style={{ ...cardBg, padding: 32, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: textMain, marginBottom: 8 }}>🔍 Verify a Credential</h3>
                <p style={{ fontSize: 14, color: textMuted, marginBottom: 24, lineHeight: 1.6 }}>
                  Employers can verify any PathwayAI credential by entering the badge ID or scanning the QR code on the certificate.
                </p>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  <input
                    value={verifyId}
                    onChange={e => { setVerifyId(e.target.value); setVerifyResult(null); }}
                    placeholder="Enter badge ID e.g. MATH-SLV-2026-007"
                    style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${dark ? "rgba(59,130,246,0.25)" : "rgba(147,197,253,0.5)"}`, background: dark ? "rgba(15,30,55,0.8)" : "rgba(255,255,255,0.9)", color: textMain, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    onKeyDown={e => e.key === "Enter" && handleVerify()}
                  />
                  <button onClick={handleVerify} style={{ padding: "12px 22px", borderRadius: 12, background: "linear-gradient(135deg, #2563EB, #3B82F6)", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                    Verify →
                  </button>
                </div>

                {/* Verify result */}
                {verifyResult?.valid && (
                  <div className="animate-slide-right" style={{ padding: 20, borderRadius: 16, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✓</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#86EFAC" }}>✅ Credential Verified</div>
                        <div style={{ fontSize: 12, color: "#4ADE80" }}>This is a genuine PathwayAI credential</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                      {[
                        ["Badge", `${verifyResult.badge.tierIcon} ${verifyResult.badge.tier} · ${verifyResult.badge.subject}`],
                        ["Holder", user?.name || "Student"],
                        ["Issued", verifyResult.badge.earnedDate],
                        ["Score", `${verifyResult.badge.score}%`],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <span style={{ color: "#4ADE80", fontWeight: 700 }}>{k}: </span>
                          <span style={{ color: "#86EFAC" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {verifyResult?.valid === false && (
                  <div className="animate-slide-right" style={{ padding: 16, borderRadius: 14, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", fontSize: 14, fontWeight: 600 }}>
                    ❌ No matching credential found. Check the ID and try again.
                  </div>
                )}

                {/* Try sample IDs */}
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 12, color: textMuted, marginBottom: 8, fontWeight: 600 }}>Try a sample ID:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {earned.map(b => {
                      const id = b.shareUrl.split("/verify/")[1];
                      return (
                        <button key={b.id} onClick={() => { setVerifyId(id); setVerifyResult(null); }} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${dark ? "rgba(59,130,246,0.25)" : "rgba(147,197,253,0.5)"}`, background: "transparent", color: dark ? "#60A5FA" : "#2563EB", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          {id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* What employers see */}
              <div style={{ ...cardBg, padding: 24 }}>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 14 }}>📋 What Employers See</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Student's full name and photo", "Subject, tier, and skills verified", "Date earned and quiz score", "Signed by PathwayAI & teacher endorsement", "One-click verification link"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: textMuted }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#4ADE80", flexShrink: 0 }}>✓</div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share modal */}
      {shareModal && <ShareModal badge={shareModal} user={user} onClose={() => setShareModal(null)} dark={dark} />}
    </>
  );
}