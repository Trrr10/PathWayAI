/**
 * Mentors.jsx — Find & Book a Peer Mentor
 * src/pages/student/Mentors.jsx
 *
 * Flow:
 *  1. Subject + need selector
 *  2. Matched mentor list (with credentials, ratings, price)
 *  3. Book session modal → confirmation
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/* ── Mentor data ── */
const MENTORS = [
  {
    id: 1,
    name: "Arjun Sharma",
    avatar: "AS",
    avatarColor: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
    class: "Class 12 · CBSE",
    location: "Pune, Maharashtra",
    subjects: ["Mathematics", "Physics", "Coding"],
    speciality: "Quadratic Equations, Calculus, Python",
    rating: 4.9,
    reviews: 38,
    sessions: 62,
    rate: 80,
    badges: ["🥇 Mathematics Gold", "🥉 Coding Bronze"],
    badgeColors: ["#F59E0B", "#CD7F32"],
    languages: ["English", "Hindi", "Marathi"],
    about: "I scored 98 in Math in boards and love breaking down hard concepts into simple steps. I use visual methods and real examples.",
    available: ["Mon 4–6 PM", "Wed 5–7 PM", "Sat 10 AM–1 PM"],
    streak: 24,
    topSkills: ["Algebra", "Trigonometry", "Python Basics", "Newton's Laws"],
    verified: true,
    responseTime: "~15 min",
  },
  {
    id: 2,
    name: "Priya Nair",
    avatar: "PN",
    avatarColor: "linear-gradient(135deg,#7C3AED,#A78BFA)",
    class: "Class 11 · State Board",
    location: "Nagpur, Maharashtra",
    subjects: ["Science", "Biology", "Chemistry"],
    speciality: "Cell Biology, Organic Chemistry, Ecology",
    rating: 4.8,
    reviews: 27,
    sessions: 44,
    rate: 60,
    badges: ["🥈 Science Silver", "🥉 Biology Bronze"],
    badgeColors: ["#94A3B8", "#CD7F32"],
    languages: ["English", "Hindi", "Telugu"],
    about: "Biology and Chemistry are my passion! I use diagrams, mnemonics and practice MCQs to make concepts stick.",
    available: ["Tue 5–7 PM", "Thu 4–6 PM", "Sun 2–5 PM"],
    streak: 18,
    topSkills: ["Cell Biology", "Organic Reactions", "Ecology", "Human Body"],
    verified: true,
    responseTime: "~10 min",
  },
  {
    id: 3,
    name: "Rohan Desai",
    avatar: "RD",
    avatarColor: "linear-gradient(135deg,#059669,#34D399)",
    class: "Class 12 · ICSE",
    location: "Mumbai, Maharashtra",
    subjects: ["History", "Geography", "Language"],
    speciality: "Indian Freedom Movement, Map Work, Essay Writing",
    rating: 4.7,
    reviews: 19,
    sessions: 31,
    rate: 50,
    badges: ["🥇 History Gold"],
    badgeColors: ["#F59E0B"],
    languages: ["English", "Marathi", "Hindi"],
    about: "History isn't dates — it's stories. I connect events to today's world to make everything memorable and exam-relevant.",
    available: ["Mon 6–8 PM", "Fri 5–7 PM", "Sat 2–5 PM"],
    streak: 12,
    topSkills: ["Freedom Movement", "World Wars", "Essay Writing", "Map Skills"],
    verified: true,
    responseTime: "~20 min",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    avatar: "SK",
    avatarColor: "linear-gradient(135deg,#DB2777,#F472B6)",
    class: "Class 10 · CBSE",
    location: "Nashik, Maharashtra",
    subjects: ["Mathematics", "Science"],
    speciality: "Class 9–10 Math, Basic Science, Exam prep",
    rating: 4.9,
    reviews: 51,
    sessions: 89,
    rate: 70,
    badges: ["🥈 Mathematics Silver", "🥉 Science Bronze"],
    badgeColors: ["#94A3B8", "#CD7F32"],
    languages: ["Hindi", "Marathi", "English"],
    about: "I cleared Class 10 boards with 95% and have been helping juniors ever since. I focus heavily on CBSE exam patterns.",
    available: ["Daily 4–6 PM", "Sun All Day"],
    streak: 42,
    topSkills: ["Algebra", "Mensuration", "Light & Sound", "Chemical Reactions"],
    verified: true,
    responseTime: "~5 min",
  },
  {
    id: 5,
    name: "Vikram Iyer",
    avatar: "VI",
    avatarColor: "linear-gradient(135deg,#D97706,#FCD34D)",
    class: "Class 12 · CBSE",
    location: "Chennai (Remote)",
    subjects: ["Coding", "Mathematics"],
    speciality: "DSA, Competitive Programming, Calculus",
    rating: 4.6,
    reviews: 14,
    sessions: 22,
    rate: 90,
    badges: ["🥇 Coding Gold", "🥉 Mathematics Bronze"],
    badgeColors: ["#F59E0B", "#CD7F32"],
    languages: ["English", "Tamil"],
    about: "Competitive programmer who loves teaching. I help students crack coding Olympiads and understand math proofs.",
    available: ["Wed 7–9 PM", "Sat 6–9 PM", "Sun 6–9 PM"],
    streak: 9,
    topSkills: ["Arrays & Sorting", "Data Structures", "Calculus", "Number Theory"],
    verified: false,
    responseTime: "~30 min",
  },
  {
    id: 6,
    name: "Anjali Mehta",
    avatar: "AM",
    avatarColor: "linear-gradient(135deg,#0891B2,#38BDF8)",
    class: "Class 11 · State Board",
    location: "Aurangabad, Maharashtra",
    subjects: ["Language", "History", "General GK"],
    speciality: "Grammar, Literature, Current Affairs",
    rating: 4.8,
    reviews: 22,
    sessions: 37,
    rate: 45,
    badges: ["🥈 Language Silver"],
    badgeColors: ["#94A3B8"],
    languages: ["English", "Hindi", "Urdu"],
    about: "English and Hindi literature are my strengths. I help with grammar, comprehension, essay writing, and GK for competitive exams.",
    available: ["Mon–Fri 6–8 PM", "Sun 10 AM–12 PM"],
    streak: 16,
    topSkills: ["Grammar", "Essay Writing", "Comprehension", "Current Affairs"],
    verified: true,
    responseTime: "~10 min",
  },
];

const SUBJECTS = ["Mathematics", "Science", "History", "Language", "Coding", "General GK"];

const NEEDS = [
  { id: "concept",  label: "Understand a concept",   icon: "💡" },
  { id: "homework", label: "Help with homework",      icon: "📝" },
  { id: "exam",     label: "Exam preparation",        icon: "🎯" },
  { id: "doubt",    label: "Clear a specific doubt",  icon: "❓" },
  { id: "practice", label: "Practice & mock tests",   icon: "🔁" },
];

const BUDGETS = [
  { id: "any",    label: "Any",       max: 999 },
  { id: "low",    label: "Under ₹60", max: 60  },
  { id: "mid",    label: "₹60–₹80",  max: 80  },
  { id: "high",   label: "₹80+",     max: 999 },
];

/* ─────────────────────────────
   CSS
───────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .men-app { min-height: 100vh; font-family: 'DM Sans', sans-serif; transition: background 0.3s, color 0.3s; }
  .men-app.dark  { background: #070E1C; color: #E2EEFF; }
  .men-app.light { background: #EBF4FF; color: #0F172A; }

  /* Mesh bg */
  .mesh-fixed { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  @keyframes orb-float { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(18px,-14px)scale(1.04)} }
  .orb { position: absolute; border-radius: 50%; animation: orb-float 14s ease-in-out infinite; }

  /* Animations */
  @keyframes fade-up   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scale-in  { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
  @keyframes slide-up  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes confetti  { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-80px) rotate(360deg);opacity:0} }

  .animate-fade-up  { animation: fade-up  0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-scale-in { animation: scale-in 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both; }

  .d1{animation-delay:0.04s} .d2{animation-delay:0.08s} .d3{animation-delay:0.12s}
  .d4{animation-delay:0.16s} .d5{animation-delay:0.2s}  .d6{animation-delay:0.24s}

  .text-gradient {
    background: linear-gradient(135deg,#38BDF8,#818CF8,#34D399);
    -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
  }
  .text-shimmer {
    background: linear-gradient(90deg,#38BDF8,#818CF8,#38BDF8);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
    animation: shimmer 3s linear infinite;
  }

  /* Cards */
  .glass-card { border-radius: 22px; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
  .dark  .glass-card { background:rgba(13,27,46,0.85); border:1px solid rgba(59,130,246,0.15); backdrop-filter:blur(20px); }
  .light .glass-card { background:rgba(255,255,255,0.88); border:1px solid rgba(147,197,253,0.4); backdrop-filter:blur(20px); box-shadow:0 4px 24px rgba(37,99,235,0.07); }

  /* Mentor card */
  .mentor-card { border-radius: 22px; padding: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
  .dark  .mentor-card { background:rgba(13,27,46,0.9); border:1px solid rgba(59,130,246,0.12); }
  .light .mentor-card { background:rgba(255,255,255,0.92); border:1px solid rgba(147,197,253,0.35); box-shadow:0 4px 20px rgba(37,99,235,0.06); }
  .mentor-card:hover { transform:translateY(-5px); }
  .dark  .mentor-card:hover { border-color:rgba(56,189,248,0.4); box-shadow:0 12px 40px rgba(56,189,248,0.1); }
  .light .mentor-card:hover { border-color:rgba(56,189,248,0.5); box-shadow:0 12px 40px rgba(56,189,248,0.12); }

  /* Stars */
  .stars { color:#F59E0B; letter-spacing:-1px; font-size:13px; }

  /* Pills */
  .pill { padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; }
  .dark  .pill { background:rgba(56,189,248,0.12); color:#7DD3FC; border:1px solid rgba(56,189,248,0.2); }
  .light .pill { background:rgba(219,234,254,0.8); color:#1D4ED8; border:1px solid rgba(147,197,253,0.4); }

  .badge-pill { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }

  /* Filter chip */
  .filter-chip { padding:8px 18px; border-radius:20px; font-size:13px; font-weight:700; cursor:pointer; border:2px solid transparent; transition:all 0.2s; font-family:'DM Sans',sans-serif; }

  /* Need chip */
  .need-chip { padding:10px 16px; border-radius:14px; font-size:13px; font-weight:600; cursor:pointer; border:2px solid transparent; transition:all 0.2s; font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:8px; }

  /* Avatar */
  .avatar { width:52px; height:52px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:white; flex-shrink:0; }
  .avatar-lg { width:72px; height:72px; border-radius:20px; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:white; flex-shrink:0; }

  /* Modal */
  .modal-overlay { position:fixed; inset:0; z-index:100; display:flex; align-items:flex-end; justify-content:center; }
  @media(min-width:640px) { .modal-overlay { align-items:center; } }
  .modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); }
  .modal-sheet { position:relative; z-index:1; width:100%; max-width:560px; border-radius:28px 28px 0 0; overflow:hidden; animation:slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both; max-height:92vh; overflow-y:auto; }
  @media(min-width:640px) { .modal-sheet { border-radius:28px; animation:scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both; } }
  .dark  .modal-sheet { background:#0D1B2E; border:1px solid rgba(59,130,246,0.2); }
  .light .modal-sheet { background:#fff; border:1px solid rgba(147,197,253,0.4); box-shadow:0 24px 64px rgba(37,99,235,0.15); }

  /* Btn */
  .btn-primary { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 28px; border-radius:14px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; color:white; background:linear-gradient(135deg,#0EA5E9,#3B82F6); box-shadow:0 4px 16px rgba(14,165,233,0.35); transition:all 0.2s; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,165,233,0.45); }
  .btn-ghost { display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:12px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; background:transparent; transition:all 0.2s; }
  .dark  .btn-ghost { border:1px solid rgba(59,130,246,0.25); color:#94A3B8; }
  .light .btn-ghost { border:1px solid rgba(147,197,253,0.5); color:#64748B; }
  .btn-ghost:hover { border-color:#38BDF8; color:#38BDF8; }

  /* Verified badge */
  .verified-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); color:#4ADE80; }

  /* Online dot */
  .online-dot { width:9px; height:9px; border-radius:50%; background:#22C55E; animation:pulse-dot 2s ease-in-out infinite; flex-shrink:0; }

  /* Progress bar */
  .prog { height:5px; border-radius:3px; overflow:hidden; }
  .dark  .prog { background:rgba(255,255,255,0.07); }
  .light .prog { background:rgba(0,0,0,0.07); }
  .prog-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#38BDF8,#818CF8); }

  /* Scrollbar */
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-thumb { background:rgba(56,189,248,0.3); border-radius:3px; }

  /* Confirmation celebration */
  .confetti-piece { position:absolute; width:8px; height:8px; border-radius:2px; animation:confetti 1s ease-out both; }
`;

/* ─────────────────────────────
   STAR RATING
───────────────────────────── */
function Stars({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

/* ─────────────────────────────
   MENTOR CARD
───────────────────────────── */
function MentorCard({ mentor, onBook, dark, index }) {
  const t = dark ? "#E2EEFF" : "#0F172A";
  const m = dark ? "#64748B" : "#94A3B8";

  return (
    <div className={`mentor-card animate-fade-up d${(index % 6) + 1}`} onClick={() => onBook(mentor)}>
      {/* Top row */}
      <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
        <div className="avatar" style={{ background:mentor.avatarColor }}>
          {mentor.avatar}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:t }}>{mentor.name}</span>
            {mentor.verified && <span className="verified-badge">✓ Verified</span>}
          </div>
          <div style={{ fontSize:12, color:m, marginBottom:6 }}>{mentor.class} · {mentor.location}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Stars rating={mentor.rating} />
            <span style={{ fontSize:12, fontWeight:700, color:t }}>{mentor.rating}</span>
            <span style={{ fontSize:12, color:m }}>({mentor.reviews} reviews)</span>
            <span className="online-dot" title="Online" />
          </div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:900, color:"#38BDF8" }}>₹{mentor.rate}</div>
          <div style={{ fontSize:11, color:m, fontWeight:600 }}>per session</div>
        </div>
      </div>

      {/* Subjects */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
        {mentor.subjects.map(s => (
          <span key={s} className="pill">{s}</span>
        ))}
      </div>

      {/* Speciality */}
      <p style={{ fontSize:13, color:m, marginBottom:14, lineHeight:1.55 }}>
        <span style={{ color:t, fontWeight:600 }}>Specialises in: </span>{mentor.speciality}
      </p>

      {/* Badges earned */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {mentor.badges.map((b, i) => (
          <span key={b} className="badge-pill" style={{ background:`${mentor.badgeColors[i]}18`, border:`1px solid ${mentor.badgeColors[i]}40`, color:mentor.badgeColors[i] }}>{b}</span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display:"flex", gap:16, paddingTop:14, borderTop:`1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}`, marginBottom:14 }}>
        {[
          { label:"Sessions", val:mentor.sessions },
          { label:"Streak",   val:`${mentor.streak}🔥` },
          { label:"Reply",    val:mentor.responseTime },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize:14, fontWeight:800, color:t }}>{s.val}</div>
            <div style={{ fontSize:11, color:m, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ marginLeft:"auto" }}>
          <div style={{ fontSize:12, color:m, fontWeight:600, marginBottom:4 }}>Languages</div>
          <div style={{ fontSize:12, color:t, fontWeight:600 }}>{mentor.languages.join(", ")}</div>
        </div>
      </div>

      {/* Book button */}
      <button className="btn-primary" style={{ width:"100%", fontSize:13 }} onClick={e => { e.stopPropagation(); onBook(mentor); }}>
        📅 Book a Session — ₹{mentor.rate}
      </button>
    </div>
  );
}

/* ─────────────────────────────
   BOOK MODAL
───────────────────────────── */
function BookModal({ mentor, subject, need, onClose, onConfirm, dark }) {
  const [slot,    setSlot]    = useState(null);
  const [note,    setNote]    = useState("");
  const [step,    setStep]    = useState(1); // 1=details, 2=confirm, 3=booked
  const [paying,  setPaying]  = useState(false);

  const t = dark ? "#E2EEFF"  : "#0F172A";
  const m = dark ? "#64748B"  : "#94A3B8";
  const inputStyle = { width:"100%", padding:"11px 14px", borderRadius:12, border:`1.5px solid ${dark?"rgba(59,130,246,0.2)":"rgba(147,197,253,0.4)"}`, background:dark?"rgba(15,30,55,0.8)":"rgba(248,250,252,0.9)", color:t, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none" };

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 1600)); // simulate payment
    setPaying(false);
    setStep(3);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={step < 3 ? onClose : undefined} />
      <div className="modal-sheet">

        {/* Step 1 — Details */}
        {step === 1 && (
          <div style={{ padding:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
              <div className="avatar-lg" style={{ background:mentor.avatarColor }}>{mentor.avatar}</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:t }}>{mentor.name}</div>
                <div style={{ fontSize:13, color:m }}>{mentor.class} · {mentor.location}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                  <Stars rating={mentor.rating} />
                  <span style={{ fontSize:12, fontWeight:700, color:t }}>{mentor.rating} ({mentor.reviews})</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div style={{ padding:"14px 16px", borderRadius:14, background:dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)", border:`1px solid ${dark?"rgba(59,130,246,0.1)":"rgba(147,197,253,0.3)"}`, marginBottom:20 }}>
              <p style={{ fontSize:13, color:m, lineHeight:1.6 }}>"{mentor.about}"</p>
            </div>

            {/* Top skills */}
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Top Skills</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {mentor.topSkills.map(s => <span key={s} className="pill">{s}</span>)}
              </div>
            </div>

            {/* Pick slot */}
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Available Slots</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {mentor.available.map(s => (
                  <button key={s} onClick={() => setSlot(s)}
                    style={{ padding:"10px 14px", borderRadius:12, border:`2px solid ${slot===s?"#38BDF8":dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.3)"}`, background:slot===s?(dark?"rgba(56,189,248,0.12)":"rgba(219,234,254,0.6)"):"transparent", color:slot===s?"#38BDF8":m, fontWeight:600, fontSize:13, cursor:"pointer", textAlign:"left", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                    🗓 {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom:24 }}>
              <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>What do you need help with? (optional)</p>
              <textarea rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder={`e.g. I'm struggling with ${subject || "the topic"}…`} style={{ ...inputStyle, resize:"none" }} />
            </div>

            <button className="btn-primary" style={{ width:"100%" }} disabled={!slot} onClick={() => setStep(2)}>
              Continue → ₹{mentor.rate}
            </button>
            <button className="btn-ghost" style={{ width:"100%", marginTop:8, justifyContent:"center" }} onClick={onClose}>Cancel</button>
          </div>
        )}

        {/* Step 2 — Payment summary */}
        {step === 2 && (
          <div style={{ padding:28 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:t, marginBottom:4 }}>Confirm Booking</h2>
            <p style={{ fontSize:14, color:m, marginBottom:24 }}>Review your session details before paying</p>

            {/* Summary card */}
            <div style={{ padding:20, borderRadius:18, background:dark?"rgba(15,30,55,0.8)":"rgba(241,245,249,0.8)", border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.35)"}`, marginBottom:20 }}>
              {[
                ["Mentor",   mentor.name],
                ["Subject",  subject || "General"],
                ["Need",     need?.label || "—"],
                ["Slot",     slot],
                ["Duration", "60 minutes"],
                ["Language", mentor.languages[0]],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", paddingBottom:10, marginBottom:10, borderBottom:`1px solid ${dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"}` }}>
                  <span style={{ fontSize:13, color:m, fontWeight:600 }}>{k}</span>
                  <span style={{ fontSize:13, color:t, fontWeight:700 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:4 }}>
                <span style={{ fontSize:15, fontWeight:800, color:t }}>Total</span>
                <span style={{ fontSize:18, fontWeight:900, color:"#38BDF8" }}>₹{mentor.rate}</span>
              </div>
            </div>

            {/* Payment methods */}
            <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Pay via</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:24 }}>
              {[["📱 UPI", "#22C55E"], ["💳 Card", "#3B82F6"], ["🏦 Net Banking", "#8B5CF6"]].map(([label, color]) => (
                <div key={label} style={{ padding:"10px 8px", borderRadius:12, border:`1px solid ${color}40`, background:`${color}10`, textAlign:"center", fontSize:12, fontWeight:700, color, cursor:"pointer" }}>{label}</div>
              ))}
            </div>

            <button className="btn-primary" style={{ width:"100%" }} onClick={handlePay} disabled={paying}>
              {paying ? "Processing…" : `Pay ₹${mentor.rate} & Confirm`}
            </button>
            <button className="btn-ghost" style={{ width:"100%", marginTop:8, justifyContent:"center" }} onClick={() => setStep(1)}>← Back</button>
          </div>
        )}

        {/* Step 3 — Booked! */}
        {step === 3 && (
          <div style={{ padding:36, textAlign:"center", position:"relative", overflow:"hidden" }}>
            {/* Confetti */}
            {["#38BDF8","#F59E0B","#22C55E","#818CF8","#F472B6"].map((c,i) => (
              <div key={i} className="confetti-piece" style={{ background:c, left:`${15+i*17}%`, top:"20%", animationDelay:`${i*0.1}s`, "--dx":`${(i-2)*30}px`, "--dy":"-60px" }} />
            ))}
            <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:t, marginBottom:8 }}>Session Booked!</h2>
            <p style={{ fontSize:15, color:m, lineHeight:1.6, marginBottom:24 }}>
              Your session with <strong style={{ color:t }}>{mentor.name}</strong> on <strong style={{ color:"#38BDF8" }}>{slot}</strong> is confirmed. You'll receive a WhatsApp reminder 30 minutes before.
            </p>
            <div style={{ padding:16, borderRadius:16, background:dark?"rgba(34,197,94,0.1)":"rgba(220,252,231,0.7)", border:"1px solid rgba(34,197,94,0.3)", marginBottom:24 }}>
              <p style={{ fontSize:13, color:"#4ADE80", fontWeight:700 }}>✓ ₹{mentor.rate} paid · Booking ID: PTH-{mentor.id}{Date.now().toString().slice(-4)}</p>
              <p style={{ fontSize:12, color:m, marginTop:4 }}>Refundable if cancelled 2hrs before session</p>
            </div>
            <button className="btn-primary" style={{ width:"100%" }} onClick={() => { onConfirm(mentor); onClose(); }}>
              🏠 Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────
   MAIN COMPONENT
───────────────────────────── */
export default function MentorMarketPlace() {
  const navigate = useNavigate();
  const { dark, toggleDark, user } = useApp();

  const [step,      setStep]    = useState("filter"); // filter | list
  const [subject,   setSubject] = useState(null);
  const [need,      setNeed]    = useState(null);
  const [budget,    setBudget]  = useState("any");
  const [language,  setLang]    = useState(null);
  const [bookModal, setBookModal] = useState(null);
  const [bookedSessions, setBooked] = useState([]);

  const theme = dark ? "dark" : "light";
  const t  = dark ? "#E2EEFF"  : "#0F172A";
  const m  = dark ? "#64748B"  : "#94A3B8";
  const cardBg = { background:dark?"rgba(13,27,46,0.85)":"rgba(255,255,255,0.88)", border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.4)"}`, backdropFilter:"blur(20px)", borderRadius:22 };

  /* Filter mentors */
  const matched = MENTORS.filter(mn => {
    const subOk  = !subject || mn.subjects.includes(subject);
    const budMax = BUDGETS.find(b => b.id === budget)?.max || 999;
    const budOk  = mn.rate <= budMax;
    const langOk = !language || mn.languages.includes(language);
    return subOk && budOk && langOk;
  }).sort((a, b) => b.rating - a.rating);

  const ALL_LANGS = [...new Set(MENTORS.flatMap(m => m.languages))].sort();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`men-app ${theme}`}>

        {/* Mesh */}
        <div className="mesh-fixed">
          <div style={{ position:"absolute", inset:0, background:dark?"radial-gradient(ellipse at 30% 30%,#0d2744 0%,#070E1C 65%)":"radial-gradient(ellipse at 30% 30%,#dbeafe 0%,#EBF4FF 65%)" }}/>
          <div className="orb" style={{ width:480,height:480,top:"-12%",right:"-8%", background:dark?"radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%)":"radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%)" }}/>
          <div className="orb" style={{ width:360,height:360,bottom:"5%",left:"-6%",animationDelay:"6s", background:dark?"radial-gradient(circle,rgba(129,140,248,0.06) 0%,transparent 70%)":"radial-gradient(circle,rgba(129,140,248,0.09) 0%,transparent 70%)" }}/>
          <div style={{ position:"absolute",inset:0,backgroundImage:dark?"linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px)":"linear-gradient(rgba(56,189,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px" }}/>
        </div>

        {/* Topbar */}
        <div style={{ position:"sticky",top:0,zIndex:50,background:dark?"rgba(7,14,28,0.88)":"rgba(235,244,255,0.88)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${dark?"rgba(56,189,248,0.1)":"rgba(147,197,253,0.4)"}`,padding:"14px 24px",display:"flex",alignItems:"center",gap:12 }}>
          <button onClick={() => navigate("/student/dashboard")} style={{ padding:"7px 14px",borderRadius:10,border:`1px solid ${dark?"rgba(56,189,248,0.2)":"rgba(147,197,253,0.5)"}`,background:"transparent",color:m,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Dashboard</button>
          <div style={{ flex:1,fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:t }}>⭐ Find a Mentor</div>
          {bookedSessions.length > 0 && (
            <div style={{ padding:"5px 12px",borderRadius:20,background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)",fontSize:12,fontWeight:700,color:"#4ADE80" }}>
              ✓ {bookedSessions.length} Booked
            </div>
          )}
          <button onClick={toggleDark} style={{ width:46,height:24,borderRadius:12,border:"none",cursor:"pointer",background:dark?"#0284c7":"#e2e8f0",padding:2,display:"flex",alignItems:"center",transition:"background 0.3s" }}>
            <div style={{ width:20,height:20,borderRadius:"50%",background:"white",transform:dark?"translateX(22px)":"translateX(0)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>{dark?"🌙":"☀"}</div>
          </button>
        </div>

        <div style={{ position:"relative",zIndex:1,maxWidth:900,margin:"0 auto",padding:"32px 20px" }}>

          {/* ── STEP 1: Filter ── */}
          {step === "filter" && (
            <>
              {/* Hero */}
              <div className="animate-fade-up" style={{ textAlign:"center",marginBottom:36 }}>
                <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"5px 16px",borderRadius:20,background:dark?"rgba(56,189,248,0.1)":"rgba(219,234,254,0.8)",border:`1px solid ${dark?"rgba(56,189,248,0.25)":"rgba(147,197,253,0.5)"}`,marginBottom:16 }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"#38BDF8",display:"inline-block" }}/>
                  <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:"#38BDF8",textTransform:"uppercase" }}>Peer Mentors · PathwayAI</span>
                </div>
                <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(26px,5vw,42px)",fontWeight:800,lineHeight:1.1,marginBottom:10 }}>
                  <span style={{ color:t }}>Learn from </span>
                  <span className="text-shimmer">Students Like You</span>
                </h1>
                <p style={{ fontSize:15,color:m,maxWidth:440,margin:"0 auto" }}>
                  Peer mentors who've already cracked the same syllabus. Affordable, relatable, effective.
                </p>
              </div>

              {/* Filter card */}
              <div className="animate-fade-up d1" style={{ ...cardBg,padding:28,marginBottom:24 }}>

                {/* Subject */}
                <div style={{ marginBottom:24 }}>
                  <p style={{ fontSize:11,fontWeight:700,color:m,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12 }}>📚 What subject do you need help with?</p>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                    {SUBJECTS.map(s => (
                      <button key={s} className="filter-chip"
                        onClick={() => setSubject(subject===s?null:s)}
                        style={{ borderColor:subject===s?"#38BDF8":"transparent",background:subject===s?(dark?"rgba(56,189,248,0.15)":"rgba(219,234,254,0.7)"):(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)"),color:subject===s?"#38BDF8":m }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Need */}
                <div style={{ marginBottom:24 }}>
                  <p style={{ fontSize:11,fontWeight:700,color:m,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12 }}>🎯 What kind of help do you need?</p>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8 }}>
                    {NEEDS.map(n => (
                      <button key={n.id} className="need-chip"
                        onClick={() => setNeed(need?.id===n.id?null:n)}
                        style={{ borderColor:need?.id===n.id?"#38BDF8":"transparent",background:need?.id===n.id?(dark?"rgba(56,189,248,0.12)":"rgba(219,234,254,0.6)"):(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)"),color:need?.id===n.id?"#38BDF8":m }}>
                        <span>{n.icon}</span>{n.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget + Language */}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
                  <div>
                    <p style={{ fontSize:11,fontWeight:700,color:m,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10 }}>💰 Budget per session</p>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                      {BUDGETS.map(b => (
                        <button key={b.id} className="filter-chip"
                          onClick={() => setBudget(b.id)}
                          style={{ fontSize:12,borderColor:budget===b.id?"#38BDF8":"transparent",background:budget===b.id?(dark?"rgba(56,189,248,0.15)":"rgba(219,234,254,0.7)"):(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)"),color:budget===b.id?"#38BDF8":m }}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize:11,fontWeight:700,color:m,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10 }}>🗣 Language preference</p>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                      {ALL_LANGS.map(l => (
                        <button key={l} className="filter-chip"
                          onClick={() => setLang(language===l?null:l)}
                          style={{ fontSize:12,borderColor:language===l?"#38BDF8":"transparent",background:language===l?(dark?"rgba(56,189,248,0.15)":"rgba(219,234,254,0.7)"):(dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)"),color:language===l?"#38BDF8":m }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Find button */}
              <div className="animate-fade-up d2" style={{ textAlign:"center",marginBottom:32 }}>
                <button className="btn-primary" style={{ fontSize:16,padding:"15px 44px" }} onClick={() => setStep("list")}>
                  Find Mentors ({matched.length} available) →
                </button>
              </div>

              {/* Stats bar */}
              <div className="animate-fade-up d3" style={{ ...cardBg,padding:20,display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center" }}>
                {[
                  { icon:"👨‍🏫", label:"Active Mentors",   val:`${MENTORS.length}+` },
                  { icon:"⭐",   label:"Avg Rating",        val:"4.8" },
                  { icon:"💬",   label:"Sessions Done",     val:"285+" },
                  { icon:"💰",   label:"Starting from",     val:"₹45/hr" },
                  { icon:"🌐",   label:"Languages",         val:"9 Indian" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:20,marginBottom:4 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:900,color:"#38BDF8" }}>{s.val}</div>
                    <div style={{ fontSize:11,fontWeight:600,color:m }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── STEP 2: Mentor list ── */}
          {step === "list" && (
            <>
              {/* Header */}
              <div className="animate-fade-up" style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap" }}>
                <button className="btn-ghost" onClick={() => setStep("filter")}>← Filters</button>
                <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:t,flex:1 }}>
                  {matched.length} Mentors Found
                  {subject && <span style={{ fontSize:14,fontWeight:400,color:m }}> · {subject}</span>}
                </h2>
                {/* Active filters */}
                <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                  {subject  && <span className="pill">{subject}</span>}
                  {need     && <span className="pill">{need.icon} {need.label}</span>}
                  {budget !== "any" && <span className="pill">{BUDGETS.find(b=>b.id===budget)?.label}</span>}
                  {language && <span className="pill">🗣 {language}</span>}
                </div>
              </div>

              {matched.length === 0 ? (
                <div style={{ ...cardBg,padding:40,textAlign:"center" }}>
                  <div style={{ fontSize:40,marginBottom:12 }}>🔍</div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:t,marginBottom:8 }}>No mentors match your filters</h3>
                  <p style={{ color:m,fontSize:14,marginBottom:20 }}>Try removing the budget or language filter</p>
                  <button className="btn-primary" onClick={() => { setBudget("any"); setLang(null); }}>Reset Filters</button>
                </div>
              ) : (
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:20 }}>
                  {matched.map((mn,i) => (
                    <MentorCard key={mn.id} mentor={mn} onBook={setBookModal} dark={dark} index={i} />
                  ))}
                </div>
              )}

              {/* Bottom CTA — become a mentor */}
              <div className="animate-fade-up" style={{ marginTop:32,borderRadius:22,padding:28,background:"linear-gradient(135deg,#0D2744,#163B5C)",textAlign:"center" }}>
                <div style={{ fontSize:28,marginBottom:10 }}>⭐</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"white",marginBottom:8 }}>Your Score is High Enough to Mentor!</h3>
                <p style={{ fontSize:14,color:"rgba(255,255,255,0.65)",marginBottom:20,maxWidth:400,margin:"0 auto 20px" }}>
                  If you have a Silver or Gold badge in any subject, you can start earning ₹50–₹150/session as a peer mentor.
                </p>
                <button className="btn-primary" style={{ background:"linear-gradient(135deg,#F59E0B,#F97316)" }}>
                  Apply to Become a Mentor →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Book modal */}
      {bookModal && (
        <BookModal
          mentor={bookModal}
          subject={subject}
          need={need}
          dark={dark}
          onClose={() => setBookModal(null)}
          onConfirm={(mn) => {
            setBooked(prev => [...prev, mn]);
            setBookModal(null);
          }}
        />
      )}
    </>
  );
}