/**
 * Quiz.jsx — AI-Powered Quiz with Timer, Scoring & Explanations
 * src/pages/student/Quiz.jsx
 *
 * Flow:
 *  1. Topic Selection screen
 *  2. AI generates 5 MCQ questions via Llama
 *  3. Timed quiz (30s per question)
 *  4. Results screen with AI explanations per question
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const BACKEND = "http://localhost:3001";

/* ── Topics ── */
const TOPICS = [
  { id: "math",      label: "Mathematics", icon: "∑",   subs: ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics"] },
  { id: "science",   label: "Science",     icon: "⚗",   subs: ["Physics", "Chemistry", "Biology", "Environmental Science"] },
  { id: "history",   label: "History",     icon: "🏛",  subs: ["Ancient History", "Modern History", "Indian Freedom Movement", "World Wars"] },
  { id: "language",  label: "Language",    icon: "✍",   subs: ["Grammar", "Literature", "Comprehension", "Writing Skills"] },
  { id: "coding",    label: "Coding",      icon: "</>", subs: ["Arrays & Sorting", "Data Structures", "OOP Concepts", "Algorithms", "Python Basics"] },
  { id: "general",   label: "General GK",  icon: "✦",   subs: ["Current Affairs", "Science & Tech", "Sports", "Geography", "Art & Culture"] },
];

const DIFFICULTY = [
  { id: "easy",   label: "Easy",   color: "#22C55E", desc: "Basic concepts" },
  { id: "medium", label: "Medium", color: "#F59E0B", desc: "Application-level" },
  { id: "hard",   label: "Hard",   color: "#EF4444", desc: "Advanced thinking" },
];

const QUESTION_COUNTS = [3, 5, 10];
const TIME_PER_Q = 30; // seconds

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }

  .quiz-app {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
  }
  .quiz-app.dark  { background: #070E1C; color: #E2EEFF; }
  .quiz-app.light { background: #EBF4FF; color: #0F172A; }

  /* ── Mesh background ── */
  .mesh-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .mesh-orb {
    position: absolute; border-radius: 50%;
    animation: orb-drift 12s ease-in-out infinite;
  }
  @keyframes orb-drift {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(20px,-15px) scale(1.04); }
    66%      { transform: translate(-15px,20px) scale(0.97); }
  }

  /* ── Card ── */
  .card {
    border-radius: 24px;
    transition: all 0.3s ease;
  }
  .dark  .card { background: rgba(13,27,46,0.85); border: 1px solid rgba(59,130,246,0.2); backdrop-filter: blur(20px); }
  .light .card { background: rgba(255,255,255,0.85); border: 1px solid rgba(147,197,253,0.4); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(37,99,235,0.08); }

  /* ── Topic card ── */
  .topic-card {
    border-radius: 20px; padding: 20px; cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    border: 2px solid transparent;
  }
  .dark  .topic-card { background: rgba(15,30,55,0.7); }
  .light .topic-card { background: rgba(255,255,255,0.7); border-color: rgba(147,197,253,0.3); }
  .topic-card:hover  { transform: translateY(-4px); }
  .topic-card.selected { border-color: #3B82F6 !important; }
  .dark  .topic-card.selected { background: rgba(59,130,246,0.15); }
  .light .topic-card.selected { background: rgba(59,130,246,0.08); }

  /* ── Option buttons ── */
  .option-btn {
    width: 100%; text-align: left; padding: 16px 20px;
    border-radius: 16px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 500; transition: all 0.2s ease;
    display: flex; align-items: center; gap: 14px;
    border: 2px solid transparent;
  }
  .dark  .option-btn { background: rgba(15,30,55,0.8); color: #CBD5E1; border-color: rgba(59,130,246,0.15); }
  .light .option-btn { background: rgba(255,255,255,0.9); color: #334155; border-color: rgba(147,197,253,0.35); }
  .option-btn:hover:not(:disabled) { border-color: #3B82F6; }
  .dark  .option-btn:hover:not(:disabled) { background: rgba(59,130,246,0.12); color: #E2EEFF; }
  .light .option-btn:hover:not(:disabled) { background: rgba(219,234,254,0.6); color: #1E3A5F; }
  .option-btn:disabled { cursor: default; }
  .option-btn.correct  { border-color: #22C55E !important; background: rgba(34,197,94,0.15) !important; color: #86EFAC !important; }
  .option-btn.wrong    { border-color: #EF4444 !important; background: rgba(239,68,68,0.12) !important; color: #FCA5A5 !important; }
  .option-btn.selected-wrong { border-color: #EF4444 !important; background: rgba(239,68,68,0.2) !important; }

  /* ── Timer ring ── */
  .timer-ring { transform: rotate(-90deg); }
  .timer-circle-bg  { fill: none; stroke: rgba(100,116,139,0.2); }
  .timer-circle-fg  { fill: none; stroke-linecap: round; transition: stroke-dashoffset 1s linear, stroke 0.5s ease; }

  /* ── Progress bar ── */
  .progress-bar { height: 4px; border-radius: 2px; background: rgba(100,116,139,0.2); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #3B82F6, #818CF8); transition: width 0.5s ease; }

  /* ── Animations ── */
  @keyframes fade-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes scale-in  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes bounce-in { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.15)} 80%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes pulse-glow{ 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.3)} 50%{box-shadow:0 0 0 12px rgba(59,130,246,0)} }
  @keyframes tick      { 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }

  .animate-fade-up  { animation: fade-up  0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-fade-in  { animation: fade-in  0.5s ease both; }
  .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-bounce-in{ animation: bounce-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .animate-spin     { animation: spin 1s linear infinite; }
  .animate-tick     { animation: tick 1s ease-in-out infinite; }

  .d1{animation-delay:0.05s} .d2{animation-delay:0.1s} .d3{animation-delay:0.15s}
  .d4{animation-delay:0.2s}  .d5{animation-delay:0.25s} .d6{animation-delay:0.3s}

  .text-shimmer {
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  /* ── Score ring ── */
  .score-ring { filter: drop-shadow(0 0 16px rgba(59,130,246,0.4)); }

  /* ── Explanation card ── */
  .explanation-card {
    border-radius: 16px; padding: 16px 20px; margin-top: 12px;
    font-size: 14px; line-height: 1.7;
    animation: fade-up 0.4s ease both;
  }
  .dark  .explanation-card { background: rgba(30,58,138,0.2); border: 1px solid rgba(59,130,246,0.25); color: #93C5FD; }
  .light .explanation-card { background: rgba(219,234,254,0.5); border: 1px solid rgba(147,197,253,0.5); color: #1E40AF; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 3px; }

  /* ── Btn ── */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 32px; border-radius: 16px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    color: white; background: linear-gradient(135deg, #2563EB, #3B82F6);
    box-shadow: 0 4px 20px rgba(37,99,235,0.35);
    transition: all 0.2s ease;
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.45); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 12px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    transition: all 0.2s ease; background: transparent;
  }
  .dark  .btn-ghost { border: 1px solid rgba(59,130,246,0.3); color: #94A3B8; }
  .light .btn-ghost { border: 1px solid rgba(147,197,253,0.5); color: #64748B; }
  .btn-ghost:hover { border-color: #3B82F6; color: #3B82F6; }

  /* ─ Diff pill ─ */
  .diff-pill {
    padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 700;
    cursor: pointer; border: 2px solid transparent; transition: all 0.2s;
  }

  /* ─ Sub-topic chip ─ */
  .sub-chip {
    padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s;
  }
  .dark  .sub-chip { background: rgba(15,30,55,0.8); color: #64748B; border-color: rgba(59,130,246,0.15); }
  .light .sub-chip { background: rgba(241,245,249,0.8); color: #94A3B8; border-color: rgba(147,197,253,0.3); }
  .sub-chip:hover  { border-color: #3B82F6; color: #3B82F6; }
  .sub-chip.active { background: rgba(59,130,246,0.2); color: #60A5FA; border-color: #3B82F6; }
`;

/* ─────────────────────────────────────────────
   MESH BACKGROUND
───────────────────────────────────────────── */
function MeshBg({ dark }) {
  return (
    <div className="mesh-bg">
      <div style={{
        position: "absolute", inset: 0,
        background: dark
          ? "radial-gradient(ellipse at 20% 30%, #0d2744 0%, #070E1C 60%)"
          : "radial-gradient(ellipse at 20% 30%, #dbeafe 0%, #EBF4FF 60%)",
      }}/>
      <div className="mesh-orb" style={{ width: 500, height: 500, top: "-10%", left: "-5%", background: dark ? "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }}/>
      <div className="mesh-orb" style={{ width: 400, height: 400, bottom: "5%", right: "-8%", animationDelay: "4s", background: dark ? "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)" }}/>
      <div style={{ position: "absolute", inset: 0, backgroundImage: dark ? "linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)" : "linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)", backgroundSize: "60px 60px" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TIMER RING COMPONENT
───────────────────────────────────────────── */
function TimerRing({ total, questionKey, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(total);
  const intervalRef = useRef(null);

  // Reset and restart whenever questionKey changes (new question)
  useEffect(() => {
    setTimeLeft(total);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          onExpire();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [questionKey]);

  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = timeLeft / total;
  const offset = circ * (1 - pct);
  const color = timeLeft <= 5 ? "#EF4444" : timeLeft <= 10 ? "#F59E0B" : "#3B82F6";

  return (
    <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
      <svg width="96" height="96" className="timer-ring">
        <circle className="timer-circle-bg" cx="48" cy="48" r={r} strokeWidth="6" />
        <circle
          className="timer-circle-fg"
          cx="48" cy="48" r={r} strokeWidth="6"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{timeLeft}</span>
        <span style={{ fontSize: 9, color: "#64748B", fontWeight: 600, letterSpacing: "0.05em" }}>SEC</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCORE DISPLAY
───────────────────────────────────────────── */
function ScoreRing({ score, total }) {
  const pct = score / total;
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct >= 0.8 ? "#22C55E" : pct >= 0.5 ? "#F59E0B" : "#EF4444";
  const emoji = pct >= 0.8 ? "🏆" : pct >= 0.5 ? "⭐" : "💪";

  return (
    <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
      <svg width="160" height="160" className="score-ring timer-ring">
        <circle className="timer-circle-bg" cx="80" cy="80" r={r} strokeWidth="8" />
        <circle
          className="timer-circle-fg"
          cx="80" cy="80" r={r} strokeWidth="8"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 2,
      }}>
        <span style={{ fontSize: 28 }}>{emoji}</span>
        <span style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
          {score}/{total}
        </span>
        <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
          {Math.round(pct * 100)}%
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN QUIZ COMPONENT
───────────────────────────────────────────── */
export default function Quiz() {
  const navigate = useNavigate();
  const { dark, toggleDark } = useApp();

  /* ── Setup state ── */
  const [screen, setScreen]         = useState("setup");   // setup | generating | quiz | results
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSub, setSelectedSub]     = useState(null);
  const [difficulty, setDifficulty]       = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  /* ── Quiz state ── */
  const [questions, setQuestions]   = useState([]);
  const [currentQ, setCurrentQ]     = useState(0);

  const [selectedAns, setSelectedAns] = useState(null);  // index chosen
  const [answered, setAnswered]     = useState(false);
  const [answers, setAnswers]       = useState([]);       // [{chosen, correct, timedOut}]
  const [genError, setGenError]     = useState(null);

  /* ── Results state ── */
  const [explanations, setExplanations] = useState({});   // {qIndex: "..."}
  const [loadingExp, setLoadingExp]     = useState({});

  // timerRef moved into TimerRing

  /* Timer now runs inside TimerRing component */

  /* ── Handle answer selection ── */
  const handleAnswer = useCallback((chosenIdx, timedOut = false) => {
    setAnswered(true);
    setSelectedAns(chosenIdx);

    const q = questions[currentQ];
    const correct = chosenIdx === q.correctIndex;

    setAnswers(prev => [...prev, {
      chosen: chosenIdx,
      correct: q.correctIndex,
      isCorrect: correct && !timedOut,
      timedOut,
    }]);
  }, [questions, currentQ]);

  /* ── Next question ── */
  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setScreen("results");
    } else {
      setCurrentQ(q => q + 1);
      setSelectedAns(null);
      setAnswered(false);
    }
  }, [currentQ, questions.length]);

  /* ── Generate questions via AI ── */
  const generateQuiz = async () => {
    setScreen("generating");
    setGenError(null);
    setAnswers([]);
    setCurrentQ(0);
    setExplanations({});

    const topic = selectedSub || selectedTopic?.label;
    const prompt = `Generate exactly ${questionCount} multiple choice quiz questions about "${topic}" at ${difficulty} difficulty level for a student.

STRICT JSON FORMAT — respond with ONLY this JSON, no other text:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "hint": "Brief one-line hint"
    }
  ]
}

Rules:
- correctIndex is 0-3 (index of correct option in options array)
- Make all 4 options plausible
- Questions should test real understanding
- Difficulty: ${difficulty} (${DIFFICULTY.find(d=>d.id===difficulty)?.desc})
- Topic: ${topic}
- Count: exactly ${questionCount} questions`;

    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const raw = data.reply;

      // Extract JSON from response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI didn't return valid JSON. Try again.");

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.questions?.length) throw new Error("No questions in response.");

      // Validate each question
      const valid = parsed.questions.filter(q =>
        q.question && Array.isArray(q.options) && q.options.length === 4 &&
        typeof q.correctIndex === "number"
      );

      if (valid.length === 0) throw new Error("Questions malformed. Regenerating...");

      setQuestions(valid);
      setAnswered(false);
      setSelectedAns(null);
      setScreen("quiz");

    } catch (err) {
      setGenError(err.message);
      setScreen("setup");
    }
  };

  /* ── Fetch explanation for a question ── */
  const fetchExplanation = async (qIndex) => {
    if (explanations[qIndex] || loadingExp[qIndex]) return;
    setLoadingExp(prev => ({ ...prev, [qIndex]: true }));

    const q = questions[qIndex];
    const ans = answers[qIndex];
    const topic = selectedSub || selectedTopic?.label;

    const prompt = `A student just answered a quiz question about ${topic}.

Question: ${q.question}
Options: ${q.options.map((o,i) => `${i === q.correctIndex ? "✓" : "✗"} ${o}`).join(" | ")}
Student answered: ${ans.timedOut ? "Ran out of time (no answer)" : q.options[ans.chosen]}
Correct answer: ${q.options[q.correctIndex]}

Give a clear, friendly 2-3 sentence explanation of WHY the correct answer is right. 
${!ans.isCorrect ? "Also briefly explain why their answer was wrong." : ""}
Keep it educational and encouraging. No bullet points, just natural explanation.`;

    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setExplanations(prev => ({ ...prev, [qIndex]: data.reply }));
    } catch {
      setExplanations(prev => ({ ...prev, [qIndex]: "Could not load explanation. Check if backend is running." }));
    } finally {
      setLoadingExp(prev => ({ ...prev, [qIndex]: false }));
    }
  };

  /* ── Reset ── */
  const reset = () => {
    setScreen("setup");
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setExplanations({});
    setSelectedAns(null);
    setAnswered(false);
    setSelectedTopic(null);
    setSelectedSub(null);
  };

  const score = answers.filter(a => a.isCorrect).length;
  const theme = dark ? "dark" : "light";
  const textMuted = dark ? "#64748B" : "#94A3B8";
  const textMain  = dark ? "#E2EEFF"  : "#0F172A";
  const cardStyle = {
    background: dark ? "rgba(13,27,46,0.85)" : "rgba(255,255,255,0.85)",
    border: `1px solid ${dark ? "rgba(59,130,246,0.2)" : "rgba(147,197,253,0.4)"}`,
    backdropFilter: "blur(20px)",
    borderRadius: 24,
  };

  /* ════════════════════════════════════════════
     SCREEN: SETUP
  ════════════════════════════════════════════ */
  const SetupScreen = () => (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: dark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)", border: `1px solid ${dark ? "rgba(59,130,246,0.3)" : "rgba(147,197,253,0.5)"}`, marginBottom: 16 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }}/>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#60A5FA", textTransform: "uppercase" }}>AI-Powered Quiz</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>
          <span style={{ color: textMain }}>Test Your </span>
          <span className="text-shimmer">Knowledge</span>
        </h1>
        <p style={{ fontSize: 15, color: textMuted, fontWeight: 400 }}>
          Pick a topic, set difficulty, and let AI generate a personalised quiz for you.
        </p>
      </div>

      {genError && (
        <div className="animate-fade-up" style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: 13, marginBottom: 20, textAlign: "center" }}>
          ⚠ {genError}
        </div>
      )}

      {/* Step 1: Topic */}
      <div className="animate-fade-up d1" style={{ ...cardStyle, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white" }}>1</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: textMain }}>Choose a Subject</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {TOPICS.map(t => (
            <div
              key={t.id}
              className={`topic-card ${selectedTopic?.id === t.id ? "selected" : ""}`}
              onClick={() => { setSelectedTopic(t); setSelectedSub(null); }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{t.label}</div>
            </div>
          ))}
        </div>

        {/* Sub-topics */}
        {selectedTopic && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: 10 }}>Specific Topic (optional)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selectedTopic.subs.map(s => (
                <button key={s} className={`sub-chip ${selectedSub === s ? "active" : ""}`} onClick={() => setSelectedSub(selectedSub === s ? null : s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Difficulty */}
      <div className="animate-fade-up d2" style={{ ...cardStyle, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white" }}>2</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: textMain }}>Difficulty Level</h2>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {DIFFICULTY.map(d => (
            <button
              key={d.id}
              className="diff-pill"
              onClick={() => setDifficulty(d.id)}
              style={{
                borderColor: difficulty === d.id ? d.color : "transparent",
                background: difficulty === d.id ? `${d.color}20` : (dark ? "rgba(15,30,55,0.7)" : "rgba(241,245,249,0.8)"),
                color: difficulty === d.id ? d.color : textMuted,
              }}
            >
              {d.label}
              <span style={{ display: "block", fontSize: 11, fontWeight: 400, marginTop: 2, color: difficulty === d.id ? d.color : "#64748B" }}>{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Question count */}
      <div className="animate-fade-up d3" style={{ ...cardStyle, padding: 24, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white" }}>3</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: textMain }}>Number of Questions</h2>
          <span style={{ marginLeft: "auto", fontSize: 12, color: textMuted }}>⏱ {questionCount * TIME_PER_Q}s total</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {QUESTION_COUNTS.map(n => (
            <button
              key={n}
              className="diff-pill"
              onClick={() => setQuestionCount(n)}
              style={{
                flex: 1, textAlign: "center",
                borderColor: questionCount === n ? "#3B82F6" : "transparent",
                background: questionCount === n ? "rgba(59,130,246,0.2)" : (dark ? "rgba(15,30,55,0.7)" : "rgba(241,245,249,0.8)"),
                color: questionCount === n ? "#60A5FA" : textMuted,
                fontSize: 20, fontWeight: 900,
              }}
            >
              {n}
              <span style={{ display: "block", fontSize: 11, fontWeight: 500, marginTop: 2 }}>questions</span>
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div className="animate-fade-up d4" style={{ textAlign: "center" }}>
        <button
          className="btn-primary"
          disabled={!selectedTopic}
          onClick={generateQuiz}
          style={{ fontSize: 16, padding: "16px 48px" }}
        >
          {selectedTopic ? `Start ${selectedSub || selectedTopic.label} Quiz →` : "Select a subject first"}
        </button>
        {!selectedTopic && (
          <p style={{ marginTop: 10, fontSize: 13, color: textMuted }}>Pick a subject above to continue</p>
        )}
      </div>
    </div>
  );

  /* ════════════════════════════════════════════
     SCREEN: GENERATING
  ════════════════════════════════════════════ */
  const GeneratingScreen = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 24, padding: 32 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(59,130,246,0.15)", border: "2px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, animation: "pulse-glow 2s ease-in-out infinite" }}>
        🤖
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: textMain, marginBottom: 8 }}>
          Generating Your Quiz…
        </h2>
        <p style={{ color: textMuted, fontSize: 14 }}>
          AI is crafting {questionCount} {difficulty} questions on <strong style={{ color: "#60A5FA" }}>{selectedSub || selectedTopic?.label}</strong>
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#3B82F6", animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite` }}/>
        ))}
      </div>
      <p style={{ fontSize: 12, color: textMuted, fontStyle: "italic" }}>This takes 15-30 seconds…</p>
    </div>
  );

  /* ════════════════════════════════════════════
     SCREEN: QUIZ
  ════════════════════════════════════════════ */
  const QuizScreen = () => {
    if (!questions[currentQ]) return null;
    const q = questions[currentQ];
    const optionLabels = ["A", "B", "C", "D"];

    const getOptionClass = (idx) => {
      if (!answered) return "option-btn";
      if (idx === q.correctIndex) return "option-btn correct";
      if (idx === selectedAns && idx !== q.correctIndex) return "option-btn wrong";
      return "option-btn";
    };

    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px" }}>
        {/* Top bar */}
        <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button className="btn-ghost" onClick={reset} style={{ padding: "8px 14px", fontSize: 12 }}>← Exit</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: textMuted, marginBottom: 6, fontWeight: 600 }}>
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span style={{ color: DIFFICULTY.find(d=>d.id===difficulty)?.color }}>{difficulty.toUpperCase()}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQ) / questions.length) * 100}%` }}/>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: "#22C55E" }}>✓ {answers.filter(a=>a.isCorrect).length}</span>
            <span style={{ color: "#EF4444" }}>✗ {answers.filter(a=>!a.isCorrect).length}</span>
          </div>
        </div>

        {/* Question card */}
        <div className="animate-scale-in" key={currentQ} style={{ ...cardStyle, padding: 32, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
            {/* Timer */}
            <TimerRing total={TIME_PER_Q} questionKey={currentQ} onExpire={() => handleAnswer(null, true)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#60A5FA", marginBottom: 10 }}>
                {selectedSub || selectedTopic?.label}
              </div>
              <p style={{ fontSize: 18, fontWeight: 600, color: textMain, lineHeight: 1.5 }}>
                {q.question}
              </p>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={getOptionClass(idx)}
                disabled={answered}
                onClick={() => handleAnswer(idx)}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                  background: answered && idx === q.correctIndex ? "rgba(34,197,94,0.3)"
                    : answered && idx === selectedAns ? "rgba(239,68,68,0.3)"
                    : (dark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)"),
                  color: answered && idx === q.correctIndex ? "#86EFAC"
                    : answered && idx === selectedAns ? "#FCA5A5"
                    : "#60A5FA",
                }}>
                  {answered && idx === q.correctIndex ? "✓"
                    : answered && idx === selectedAns && idx !== q.correctIndex ? "✗"
                    : optionLabels[idx]}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            ))}
          </div>

          {/* Answer feedback */}
          {answered && (
            <div className="animate-fade-up" style={{ marginTop: 20, padding: "14px 18px", borderRadius: 14, background: answers[answers.length-1]?.isCorrect ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", border: `1px solid ${answers[answers.length-1]?.isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)"}` }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: answers[answers.length-1]?.isCorrect ? "#86EFAC" : "#FCA5A5", marginBottom: 4 }}>
                {answers[answers.length-1]?.timedOut ? "⏰ Time's up!"
                  : answers[answers.length-1]?.isCorrect ? "🎉 Correct!"
                  : "❌ Incorrect"}
              </p>
              {q.hint && <p style={{ fontSize: 13, color: textMuted }}>💡 {q.hint}</p>}
            </div>
          )}
        </div>

        {/* Next button */}
        {answered && (
          <div className="animate-fade-up" style={{ textAlign: "center" }}>
            <button className="btn-primary" onClick={nextQuestion}>
              {currentQ + 1 >= questions.length ? "See Results 🏆" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ════════════════════════════════════════════
     SCREEN: RESULTS
  ════════════════════════════════════════════ */
  const ResultsScreen = () => {
    const pct = score / questions.length;
    const message = pct >= 0.8 ? "Excellent work! You've mastered this topic." : pct >= 0.5 ? "Good effort! A bit more practice and you'll ace it." : "Keep going! Every attempt makes you stronger.";
    const diffColor = DIFFICULTY.find(d=>d.id===difficulty)?.color;

    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
        {/* Score hero */}
        <div className="animate-bounce-in" style={{ ...cardStyle, padding: 40, textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#60A5FA", marginBottom: 16 }}>Quiz Complete</p>
          <ScoreRing score={score} total={questions.length} />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: textMain, margin: "20px 0 8px" }}>
            {score >= questions.length * 0.8 ? "Outstanding! 🏆" : score >= questions.length * 0.5 ? "Well Done! ⭐" : "Keep Practising! 💪"}
          </h2>
          <p style={{ fontSize: 15, color: textMuted, maxWidth: 400, margin: "0 auto 24px" }}>{message}</p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Correct", value: score, color: "#22C55E" },
              { label: "Wrong",   value: answers.filter(a=>!a.isCorrect && !a.timedOut).length, color: "#EF4444" },
              { label: "Timed Out", value: answers.filter(a=>a.timedOut).length, color: "#F59E0B" },
              { label: "Difficulty", value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1), color: diffColor },
            ].map(s => (
              <div key={s.label} style={{ padding: "12px 20px", borderRadius: 14, background: dark ? "rgba(15,30,55,0.8)" : "rgba(241,245,249,0.8)", textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: textMuted, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Review questions */}
        <h3 className="animate-fade-up" style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: textMain, marginBottom: 16 }}>
          📋 Question Review
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {questions.map((q, idx) => {
            const ans = answers[idx];
            const isCorrect = ans?.isCorrect;
            const timedOut  = ans?.timedOut;

            return (
              <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 0.07}s`, ...cardStyle, padding: 24 }}>
                {/* Question header */}
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    background: isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                    color: isCorrect ? "#86EFAC" : "#FCA5A5",
                    fontWeight: 900,
                  }}>
                    {isCorrect ? "✓" : timedOut ? "⏰" : "✗"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: textMuted, marginBottom: 4 }}>Q{idx + 1}</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: textMain }}>{q.question}</p>
                  </div>
                </div>

                {/* Answer summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, paddingLeft: 44 }}>
                  <div style={{ fontSize: 13, color: "#86EFAC" }}>
                    ✓ Correct: <strong>{q.options[q.correctIndex]}</strong>
                  </div>
                  {!isCorrect && (
                    <div style={{ fontSize: 13, color: timedOut ? "#FBB F24" : "#FCA5A5", color: timedOut ? "#FBBF24" : "#FCA5A5" }}>
                      {timedOut ? "⏰ You ran out of time" : `✗ Your answer: ${q.options[ans.chosen]}`}
                    </div>
                  )}
                </div>

                {/* AI Explanation */}
                <div style={{ paddingLeft: 44 }}>
                  {!explanations[idx] && !loadingExp[idx] && (
                    <button
                      className="btn-ghost"
                      onClick={() => fetchExplanation(idx)}
                      style={{ fontSize: 12, padding: "8px 16px" }}
                    >
                      🤖 Get AI Explanation
                    </button>
                  )}
                  {loadingExp[idx] && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: textMuted }}>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeOpacity="0.3" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      AI is explaining…
                    </div>
                  )}
                  {explanations[idx] && (
                    <div className="explanation-card">
                      🤖 {explanations[idx]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="animate-fade-up" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={reset}>
            🔁 Try Another Quiz
          </button>
          <button className="btn-ghost" onClick={() => navigate("/student/dashboard")}>
            ← Back to Dashboard
          </button>
          <button className="btn-ghost" onClick={() => navigate("/student/ai-tutor")}>
            🤖 Ask AI Tutor
          </button>
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`quiz-app ${theme}`}>
        <MeshBg dark={dark} />

        {/* Top nav */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: dark ? "rgba(7,14,28,0.85)" : "rgba(235,244,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${dark ? "rgba(59,130,246,0.15)" : "rgba(147,197,253,0.4)"}`,
          padding: "14px 24px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <button className="btn-ghost" onClick={() => navigate("/student/dashboard")} style={{ padding: "7px 14px", fontSize: 13 }}>← Dashboard</button>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: textMain, flex: 1 }}>
            📝 Quiz
            {selectedTopic && screen !== "setup" && (
              <span style={{ fontSize: 13, fontWeight: 400, color: textMuted, marginLeft: 8 }}>
                · {selectedSub || selectedTopic.label} · {difficulty}
              </span>
            )}
          </div>
          {/* Theme toggle */}
          <button
            onClick={toggleDark}
            style={{
              width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
              background: dark ? "#0284c7" : "#e2e8f0", padding: 2,
              display: "flex", alignItems: "center", transition: "background 0.3s",
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: "white",
              transform: dark ? "translateX(22px)" : "translateX(0)",
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
            }}>
              {dark ? "🌙" : "☀"}
            </div>
          </button>
        </div>

        {/* Screen content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {screen === "setup"       && <SetupScreen />}
          {screen === "generating"  && <GeneratingScreen />}
          {screen === "quiz"        && <QuizScreen />}
          {screen === "results"     && <ResultsScreen />}
        </div>
      </div>
    </>
  );
}