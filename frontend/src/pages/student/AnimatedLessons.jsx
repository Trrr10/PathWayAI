/**
 * AnimatedLessons.jsx — Offline Animated Concept Lessons
 * src/pages/student/AnimatedLessons.jsx
 *
 * 100% offline — pure CSS animations, zero network calls, zero external deps.
 * Works without internet. All animations are hand-crafted per concept.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/* ─── Global CSS ─────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .al-root { min-height: 100vh; font-family: 'DM Sans', sans-serif; transition: background 0.3s; }
  .al-root.dark  { background: #060C18; color: #E2EEFF; }
  .al-root.light { background: #F2F6FF; color: #0F172A; }

  /* ── Entrance ── */
  @keyframes fadeslide { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popin     { 0%{opacity:0;transform:scale(0.88)} 60%{transform:scale(1.03)} 100%{opacity:1;transform:scale(1)} }
  @keyframes shimmer   { 0%{background-position:-300% center} 100%{background-position:300% center} }
  .fade  { animation: fadeslide 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .pop   { animation: popin     0.4s  cubic-bezier(0.16,1,0.3,1) both; }
  .d1{animation-delay:.05s}.d2{animation-delay:.10s}.d3{animation-delay:.15s}
  .d4{animation-delay:.20s}.d5{animation-delay:.25s}.d6{animation-delay:.30s}
  .d7{animation-delay:.35s}.d8{animation-delay:.40s}

  .shimmer-text {
    background: linear-gradient(90deg,#6366F1,#38BDF8,#34D399,#F59E0B,#6366F1);
    background-size: 300% auto;
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmer 5s linear infinite;
  }

  /* ── Cards ── */
  .lesson-card {
    border-radius: 22px; cursor: pointer; transition: transform 0.25s, box-shadow 0.25s;
    overflow: hidden; position: relative;
  }
  .lesson-card:hover { transform: translateY(-4px); }
  .dark  .lesson-card { background: rgba(10,20,40,0.9); border: 1px solid rgba(99,102,241,0.18); }
  .light .lesson-card { background: rgba(255,255,255,0.95); border: 1px solid rgba(165,180,252,0.35); box-shadow: 0 4px 24px rgba(99,102,241,0.07); }

  /* ── Tab bar ── */
  .tab-btn { padding: 8px 20px; border-radius: 20px; border: none; cursor: pointer; font-family: 'DM Sans',sans-serif; font-size: 13px; font-weight: 700; transition: all 0.2s; }
  .tab-btn.active { color: white; box-shadow: 0 4px 14px rgba(0,0,0,0.2); }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    animation: fadeslide 0.25s ease both;
    padding: 16px;
  }
  .modal-box {
    border-radius: 24px; width: 100%; max-width: 720px; max-height: 90vh;
    overflow-y: auto; position: relative;
    animation: popin 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }
  .dark  .modal-box { background: #0A1428; border: 1px solid rgba(99,102,241,0.2); }
  .light .modal-box { background: #fff; border: 1px solid rgba(165,180,252,0.4); box-shadow: 0 24px 80px rgba(0,0,0,0.15); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }

  /* ════════════════════════════════════
     LESSON-SPECIFIC ANIMATIONS
  ════════════════════════════════════ */

  /* ── PHOTOSYNTHESIS ── */
  @keyframes sunpulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
  @keyframes raydance  { 0%{transform:rotate(0deg)}  100%{transform:rotate(360deg)} }
  @keyframes co2float  { 0%{transform:translateY(0) translateX(0); opacity:0.9} 100%{transform:translateY(-90px) translateX(8px); opacity:0} }
  @keyframes o2rise    { 0%{transform:translateY(0) scale(0.5); opacity:0} 50%{opacity:1} 100%{transform:translateY(-110px) scale(1); opacity:0} }
  @keyframes waterrise { 0%{transform:translateY(30px); opacity:0} 100%{transform:translateY(-10px); opacity:1} }
  @keyframes leafsway  { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
  @keyframes glucglow  { 0%,100%{opacity:0.5} 50%{opacity:1; filter:brightness(1.4)} }
  @keyframes rootpulse { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.05)} }

  /* ── NEWTON'S LAWS ── */
  @keyframes ballroll  { 0%{left:10%} 100%{left:78%} }
  @keyframes ballbounce{ 0%,100%{bottom:44px} 50%{bottom:110px} }
  @keyframes forcearrow{ 0%{opacity:0;transform:scaleX(0)} 40%{opacity:1;transform:scaleX(1)} 100%{opacity:0;transform:scaleX(1)} }
  @keyframes walljolt  { 0%,100%{transform:translateX(0)} 10%,30%{transform:translateX(-5px)} 20%,40%{transform:translateX(5px)} }
  @keyframes rocketfly { 0%{transform:translateY(0) rotate(-5deg)} 100%{transform:translateY(-140px) rotate(5deg)} }
  @keyframes exhaust   { 0%{height:0;opacity:0} 100%{height:60px;opacity:0.7} }

  /* ── QUADRATIC GRAPH ── */
  @keyframes drawcurve { from{stroke-dashoffset:600} to{stroke-dashoffset:0} }
  @keyframes dotslide  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes axisline  { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }

  /* ── WATER CYCLE ── */
  @keyframes evap      { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-80px);opacity:0} }
  @keyframes cloudform { 0%,100%{transform:scale(1) translateX(0)} 50%{transform:scale(1.07) translateX(8px)} }
  @keyframes raindrip  { 0%{transform:translateY(-10px);opacity:0} 60%{opacity:1} 100%{transform:translateY(70px);opacity:0} }
  @keyframes rivflow   { 0%{transform:translateX(-20px);opacity:0} 100%{transform:translateX(20px);opacity:0.7} }
  @keyframes sunshine  { 0%,100%{opacity:0.7} 50%{opacity:1} }

  /* ── DNA ── */
  @keyframes helixspin { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
  @keyframes basepair  { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.7)} }
  @keyframes unzip     { 0%{clip-path:inset(0 0 100% 0)} 100%{clip-path:inset(0 0 0% 0)} }
  @keyframes newstrand { 0%{opacity:0;transform:translateX(20px)} 100%{opacity:1;transform:translateX(0)} }

  /* ── ACID-BASE ── */
  @keyframes bubble    { 0%{transform:translateY(0) scale(0.5);opacity:0} 50%{opacity:1} 100%{transform:translateY(-60px) scale(1.2);opacity:0} }
  @keyframes phchange  { 0%{background:#EF4444} 50%{background:#8B5CF6} 100%{background:#3B82F6} }
  @keyframes ionmove   { 0%{transform:translateX(0)} 50%{transform:translateX(40px)} 100%{transform:translateX(80px)} }
  @keyframes colorflood{ 0%{clip-path:inset(0 100% 0 0)} 100%{clip-path:inset(0 0% 0 0)} }

  /* ── BINARY SEARCH ── */
  @keyframes highlight { 0%,100%{background:rgba(99,102,241,0.3)} 50%{background:rgba(99,102,241,0.8)} }
  @keyframes eliminate { 0%{opacity:1;transform:scale(1)} 100%{opacity:0.2;transform:scale(0.85)} }
  @keyframes arrowbob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  /* ── FRENCH REVOLUTION ── */
  @keyframes flagwave  { 0%,100%{transform:skewX(0deg) scaleX(1)} 50%{transform:skewX(-8deg) scaleX(0.95)} }
  @keyframes timelinegrow { from{width:0} to{width:100%} }
  @keyframes eventpop  { 0%{opacity:0;transform:translateY(12px) scale(0.9)} 100%{opacity:1;transform:translateY(0) scale(1)} }
`;

/* ─── Subject palette ─────────────────────────────────────────────────── */
const SUBJECTS = [
  { id:"biology",   label:"Biology",   icon:"🧬", color:"#10B981", soft:"#ECFDF5", dark2:"rgba(16,185,129,0.15)" },
  { id:"chemistry", label:"Chemistry", icon:"⚗️",  color:"#8B5CF6", soft:"#F5F3FF", dark2:"rgba(139,92,246,0.15)" },
  { id:"physics",   label:"Physics",   icon:"⚛️",  color:"#3B82F6", soft:"#EFF6FF", dark2:"rgba(59,130,246,0.15)"  },
  { id:"math",      label:"Maths",     icon:"📐", color:"#F59E0B", soft:"#FFFBEB", dark2:"rgba(245,158,11,0.15)"  },
  { id:"geography", label:"Geography", icon:"🌍", color:"#06B6D4", soft:"#ECFEFF", dark2:"rgba(6,182,212,0.15)"   },
  { id:"cs",        label:"CS",        icon:"💻", color:"#6366F1", soft:"#EEF2FF", dark2:"rgba(99,102,241,0.15)"  },
  { id:"history",   label:"History",   icon:"🏛️",  color:"#EF4444", soft:"#FEF2F2", dark2:"rgba(239,68,68,0.15)"  },
];

/* ════════════════════════════════════════════════════════════
   LESSON ANIMATIONS — each returns a self-contained JSX scene
════════════════════════════════════════════════════════════ */

/* ── 1. PHOTOSYNTHESIS ────────────────────────────────── */
function PhotosynthesisAnim({ playing }) {
  return (
    <div style={{ position:"relative", width:"100%", height:260, overflow:"hidden",
      background:"linear-gradient(to bottom,#0EA5E920,#16A34A15)", borderRadius:14 }}>

      {/* Sky */}
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to bottom,#BAE6FD,#D1FAE5)", borderRadius:14 }} />

      {/* Sun */}
      <div style={{ position:"absolute", top:18, right:40,
        width:54, height:54, borderRadius:"50%",
        background:"radial-gradient(circle,#FDE68A,#F59E0B)",
        boxShadow:"0 0 30px #F59E0B88",
        animation: playing ? "sunpulse 2s ease-in-out infinite" : "none" }}>
        {/* Rays */}
        {[...Array(8)].map((_,i) => (
          <div key={i} style={{
            position:"absolute", top:"50%", left:"50%",
            width:36, height:3, borderRadius:3,
            background:"#FCD34D88",
            transformOrigin:"left center",
            transform:`rotate(${i*45}deg) translateX(28px)`,
          }} />
        ))}
      </div>

      {/* Sun label */}
      <div style={{ position:"absolute", top:20, right:100,
        fontSize:11, fontWeight:700, color:"#92400E",
        background:"#FEF3C7DD", padding:"2px 8px", borderRadius:20 }}>
        ☀️ Sunlight (Energy)
      </div>

      {/* Soil */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:55,
        background:"linear-gradient(to bottom,#92400E,#78350F)", borderRadius:"0 0 14px 14px" }} />

      {/* Plant stem */}
      <div style={{ position:"absolute", bottom:52, left:"48%", width:8, height:90,
        background:"linear-gradient(to top,#16A34A,#22C55E)", borderRadius:4 }} />

      {/* Leaves */}
      {[
        { left:"38%", bottom:110, rotate:"-40deg", delay:"0s" },
        { left:"50%", bottom:130, rotate:"40deg",  delay:"0.5s" },
        { left:"35%", bottom:140, rotate:"-55deg", delay:"1s"   },
        { left:"52%", bottom:155, rotate:"55deg",  delay:"1.5s" },
      ].map((l,i) => (
        <div key={i} style={{
          position:"absolute", left:l.left, bottom:l.bottom,
          width:42, height:22, borderRadius:"50% 0 50% 0",
          background:"linear-gradient(135deg,#22C55E,#16A34A)",
          boxShadow:"0 2px 8px #16A34A44",
          transform:`rotate(${l.rotate})`,
          transformOrigin:"right center",
          animation: playing ? `leafsway 2.5s ${l.delay} ease-in-out infinite` : "none",
        }} />
      ))}

      {/* Roots */}
      {[
        { left:"49%", height:28, rotate:"0deg"  },
        { left:"44%", height:22, rotate:"-20deg" },
        { left:"54%", height:22, rotate:"20deg"  },
      ].map((r,i) => (
        <div key={i} style={{
          position:"absolute", bottom:24, left:r.left, width:6, height:r.height,
          background:"#92400E", borderRadius:3,
          transform:`rotate(${r.rotate})`, transformOrigin:"top center",
          animation: playing ? `rootpulse 3s ease-in-out infinite` : "none",
        }} />
      ))}

      {/* CO2 molecules floating up */}
      {playing && [0,1,2].map(i => (
        <div key={i} style={{
          position:"absolute", left:`${28+i*14}%`, bottom:70,
          fontSize:11, fontWeight:800, color:"#6B7280",
          background:"#F3F4F6CC", padding:"2px 6px", borderRadius:20,
          animation:`co2float 3s ${i*1}s ease-in-out infinite`,
        }}>CO₂</div>
      ))}

      {/* Water drops */}
      {playing && [0,1].map(i => (
        <div key={i} style={{
          position:"absolute", left:`${44+i*8}%`, bottom:50,
          fontSize:14, animation:`waterrise 2s ${i*0.8}s ease-in-out infinite`,
        }}>💧</div>
      ))}

      {/* O2 rising */}
      {playing && [0,1,2].map(i => (
        <div key={i} style={{
          position:"absolute", left:`${40+i*12}%`, bottom:170,
          fontSize:11, fontWeight:800, color:"#0EA5E9",
          background:"#E0F2FECC", padding:"2px 6px", borderRadius:20,
          animation:`o2rise 3s ${i*1.2}s ease-in-out infinite`,
        }}>O₂</div>
      ))}

      {/* Glucose glow on leaf */}
      <div style={{
        position:"absolute", left:"58%", bottom:148,
        fontSize:10, fontWeight:800, color:"#D97706",
        background:"#FEF3C7EE", padding:"2px 7px", borderRadius:20,
        animation: playing ? "glucglow 2s ease-in-out infinite" : "none",
      }}>Glucose ✨</div>

      {/* Equation */}
      <div style={{
        position:"absolute", bottom:60, left:12, right:12,
        textAlign:"center", fontSize:11, fontWeight:700,
        color:"#065F46",
        background:"#D1FAE5CC", padding:"4px 10px", borderRadius:20,
      }}>
        6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
      </div>
    </div>
  );
}

/* ── 2. NEWTON'S LAWS ─────────────────────────────────── */
function NewtonAnim({ playing, step }) {
  // step 0 = 1st law (inertia), 1 = 2nd law (F=ma), 2 = 3rd law (action-reaction)
  const [law, setLaw] = useState(0);
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:12, justifyContent:"center" }}>
        {["1st Law","2nd Law","3rd Law"].map((l,i) => (
          <button key={i} onClick={()=>setLaw(i)} style={{
            padding:"5px 14px", borderRadius:20, border:"none", cursor:"pointer",
            fontWeight:700, fontSize:12, fontFamily:"inherit",
            background: law===i ? "#3B82F6" : "#EFF6FF",
            color: law===i ? "white" : "#3B82F6",
            transition:"all 0.2s",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ position:"relative", width:"100%", height:200, overflow:"hidden",
        background:"linear-gradient(135deg,#1E3A5F,#0F172A)", borderRadius:14 }}>

        {law === 0 && (
          <>
            {/* Inertia — ball on frictionless surface */}
            <div style={{ position:"absolute", bottom:40, left:0, right:0, height:3,
              background:"#94A3B8", borderRadius:2 }} />
            <div style={{
              position:"absolute", bottom:42, left:"10%",
              width:32, height:32, borderRadius:"50%",
              background:"radial-gradient(circle,#60A5FA,#3B82F6)",
              boxShadow:"0 0 16px #3B82F688",
              animation: playing ? "ballroll 3s linear infinite" : "none",
            }} />
            <div style={{ position:"absolute", top:20, left:0, right:0, textAlign:"center",
              color:"#93C5FD", fontSize:13, fontWeight:700 }}>
              🔵 An object in motion stays in motion…
            </div>
            <div style={{ position:"absolute", bottom:10, left:0, right:0, textAlign:"center",
              color:"#64748B", fontSize:11 }}>No friction → ball rolls forever</div>
          </>
        )}

        {law === 1 && (
          <>
            {/* F = ma — box pushed by force */}
            <div style={{ position:"absolute", bottom:40, left:0, right:0, height:3, background:"#94A3B8" }} />
            <div style={{
              position:"absolute", bottom:42, left:"20%",
              width:50, height:50, borderRadius:8,
              background:"linear-gradient(135deg,#F59E0B,#D97706)",
              boxShadow:"0 4px 18px #F59E0B55",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:800, color:"white",
              animation: playing ? "ballroll 2s ease-in-out infinite" : "none",
            }}>m=2kg</div>
            {/* Force arrow */}
            <div style={{
              position:"absolute", bottom:58, left:"10%",
              height:14, width:80,
              background:"linear-gradient(to right,transparent,#EF4444)",
              clipPath:"polygon(0 30%,85% 30%,85% 0%,100% 50%,85% 100%,85% 70%,0 70%)",
              animation: playing ? "forcearrow 2s ease-in-out infinite" : "none",
            }} />
            <div style={{ position:"absolute", top:20, left:0, right:0, textAlign:"center",
              color:"#FCD34D", fontSize:13, fontWeight:700 }}>F = ma</div>
            <div style={{ position:"absolute", top:42, left:0, right:0, textAlign:"center",
              color:"#94A3B8", fontSize:11 }}>Force → Acceleration proportional to mass</div>
            <div style={{ position:"absolute", bottom:10, left:0, right:0, textAlign:"center",
              color:"#F87171", fontSize:11, fontWeight:700 }}>→ Force (F)</div>
          </>
        )}

        {law === 2 && (
          <>
            {/* Action-Reaction — rocket */}
            <div style={{ position:"absolute", bottom:20, left:"45%",
              fontSize:36,
              animation: playing ? "rocketfly 3s ease-in-out infinite alternate" : "none",
            }}>🚀</div>
            {/* Exhaust */}
            {playing && (
              <div style={{
                position:"absolute", bottom:16, left:"50%",
                width:8, borderRadius:4,
                background:"linear-gradient(to bottom,#FCD34D,transparent)",
                animation:"exhaust 3s ease-in-out infinite alternate",
              }} />
            )}
            <div style={{ position:"absolute", top:16, left:0, right:0, textAlign:"center",
              color:"#A78BFA", fontSize:13, fontWeight:700 }}>Action & Reaction</div>
            <div style={{ position:"absolute", top:36, left:0, right:0, textAlign:"center",
              color:"#64748B", fontSize:11 }}>Gas pushed DOWN → Rocket pushed UP</div>
            <div style={{ position:"absolute", bottom:8, left:0, right:0, textAlign:"center",
              color:"#6EE7B7", fontSize:11, fontWeight:700 }}>Every action has an equal & opposite reaction</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── 3. QUADRATIC GRAPH ───────────────────────────────── */
function QuadraticAnim({ playing }) {
  return (
    <div style={{ width:"100%", height:240, position:"relative",
      background:"#0F172A", borderRadius:14, overflow:"hidden" }}>

      <svg width="100%" height="100%" viewBox="0 0 400 220" style={{ display:"block" }}>
        {/* Grid */}
        {[50,100,150,200,250,300,350].map(x=>(
          <line key={x} x1={x} y1={0} x2={x} y2={220} stroke="#1E293B" strokeWidth={1}/>
        ))}
        {[40,80,120,160,200].map(y=>(
          <line key={y} x1={0} y1={y} x2={400} y2={y} stroke="#1E293B" strokeWidth={1}/>
        ))}

        {/* Axes */}
        <line x1={10} y1={110} x2={390} y2={110} stroke="#475569" strokeWidth={1.5}
          style={{ transformOrigin:"left center",
            animation: playing ? "axisline 0.5s ease both" : "none" }} />
        <line x1={200} y1={10} x2={200} y2={210} stroke="#475569" strokeWidth={1.5} />

        {/* Axis labels */}
        <text x={385} y={105} fill="#64748B" fontSize={11}>x</text>
        <text x={205} y={20}  fill="#64748B" fontSize={11}>y</text>

        {/* Parabola y = 0.04(x-200)² - 80 → vertex at (200,110-80=30) */}
        <path
          d="M 0,210 Q 100,10 200,30 Q 300,10 400,210"
          fill="none" stroke="#6366F1" strokeWidth={3}
          strokeDasharray={700} strokeDashoffset={0}
          style={{ animation: playing ? "drawcurve 2s ease-out forwards" : "none",
            strokeDashoffset: playing ? undefined : 700 }}
        />

        {/* Vertex */}
        <circle cx={200} cy={30} r={5} fill="#F59E0B"
          style={{ animation: playing ? "dotslide 0.5s 1.8s both" : "none", opacity: playing ? undefined : 0 }} />
        <text x={210} y={28} fill="#FCD34D" fontSize={11} fontWeight="bold">Vertex</text>

        {/* Roots */}
        <circle cx={80} cy={110} r={5} fill="#34D399"
          style={{ animation: playing ? "dotslide 0.5s 2s both" : "none", opacity: playing ? undefined : 0 }} />
        <circle cx={320} cy={110} r={5} fill="#34D399"
          style={{ animation: playing ? "dotslide 0.5s 2.2s both" : "none", opacity: playing ? undefined : 0 }} />
        <text x={62} y={128} fill="#6EE7B7" fontSize={10}>Root 1</text>
        <text x={302} y={128} fill="#6EE7B7" fontSize={10}>Root 2</text>

        {/* Axis of symmetry */}
        <line x1={200} y1={30} x2={200} y2={110} stroke="#F59E0B55" strokeWidth={1.5} strokeDasharray={4} />

        {/* Equation */}
        <text x={20} y={30} fill="#818CF8" fontSize={13} fontWeight="bold">y = ax² + bx + c</text>
      </svg>

      <div style={{ position:"absolute", bottom:10, right:12,
        fontSize:10, color:"#475569", fontStyle:"italic" }}>
        Parabola opens upward when a {">"} 0
      </div>
    </div>
  );
}

/* ── 4. WATER CYCLE ───────────────────────────────────── */
function WaterCycleAnim({ playing }) {
  return (
    <div style={{ position:"relative", width:"100%", height:260,
      background:"linear-gradient(to bottom,#BAE6FD,#DBEAFE,#ECFDF5)", borderRadius:14, overflow:"hidden" }}>

      {/* Sun */}
      <div style={{ position:"absolute", top:14, left:20, width:46, height:46, borderRadius:"50%",
        background:"radial-gradient(circle,#FDE68A,#F59E0B)",
        boxShadow:"0 0 22px #F59E0B88",
        animation: playing ? "sunpulse 3s ease-in-out infinite" : "none",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>☀️</div>

      {/* Ocean */}
      <div style={{ position:"absolute", bottom:0, left:0, right:"50%", height:60,
        background:"linear-gradient(to bottom,#0EA5E9,#0284C7)", borderRadius:"0 0 0 14px" }} />
      <div style={{ position:"absolute", bottom:56, left:0, right:"50%",
        color:"white", fontSize:11, fontWeight:700, textAlign:"center" }}>🌊 Ocean / Lake</div>

      {/* Mountain */}
      <div style={{ position:"absolute", bottom:0, right:0, width:"55%", height:100,
        background:"linear-gradient(to top,#6B7280,#9CA3AF)",
        clipPath:"polygon(0 100%,50% 0%,100% 100%)" }} />
      <div style={{ position:"absolute", bottom:94, right:"18%",
        color:"white", fontSize:11, fontWeight:700 }}>🏔️</div>

      {/* Cloud */}
      <div style={{ position:"absolute", top:30, left:"42%",
        fontSize:42,
        animation: playing ? "cloudform 4s ease-in-out infinite" : "none" }}>☁️</div>
      <div style={{ position:"absolute", top:76, left:"46%",
        fontSize:11, fontWeight:700, color:"#1E40AF" }}>Cloud</div>

      {/* Evaporation arrows */}
      {playing && [0,1,2].map(i=>(
        <div key={i} style={{
          position:"absolute", left:`${8+i*10}%`, bottom:60,
          fontSize:14,
          animation:`evap 2.5s ${i*0.7}s ease-in-out infinite`,
        }}>💧</div>
      ))}

      {/* Evaporation label */}
      <div style={{ position:"absolute", left:"12%", bottom:85,
        fontSize:10, fontWeight:800, color:"#0369A1",
        background:"#BAE6FDCC", padding:"2px 8px", borderRadius:20 }}>
        ⬆ Evaporation
      </div>

      {/* Rain */}
      {playing && [0,1,2,3].map(i=>(
        <div key={i} style={{
          position:"absolute", left:`${48+i*7}%`, top:90,
          fontSize:12,
          animation:`raindrip 1.8s ${i*0.4}s ease-in infinite`,
        }}>💧</div>
      ))}
      <div style={{ position:"absolute", top:150, left:"50%", transform:"translateX(-50%)",
        fontSize:10, fontWeight:800, color:"#1D4ED8",
        background:"#DBEAFECC", padding:"2px 8px", borderRadius:20 }}>
        ⬇ Precipitation
      </div>

      {/* Runoff arrow */}
      <div style={{ position:"absolute", bottom:40, left:"32%",
        fontSize:10, fontWeight:800, color:"#0369A1",
        background:"#BAE6FDCC", padding:"2px 8px", borderRadius:20,
        animation: playing ? "rivflow 3s ease-in-out infinite" : "none",
      }}>→ Runoff</div>

      {/* Condensation label */}
      <div style={{ position:"absolute", top:14, left:"40%",
        fontSize:10, fontWeight:700, color:"#4338CA",
        background:"#E0E7FFCC", padding:"2px 8px", borderRadius:20 }}>
        ↺ Condensation
      </div>
    </div>
  );
}

/* ── 5. DNA REPLICATION ───────────────────────────────── */
function DNAAnim({ playing }) {
  const pairs = [
    ["A","T","#EF4444","#F87171"],
    ["T","A","#F87171","#EF4444"],
    ["G","C","#3B82F6","#60A5FA"],
    ["C","G","#60A5FA","#3B82F6"],
    ["A","T","#EF4444","#F87171"],
    ["G","C","#3B82F6","#60A5FA"],
    ["T","A","#F87171","#EF4444"],
  ];
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPhase(p=>(p+1)%3), 2400);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div style={{ width:"100%", height:240, background:"#0A1428", borderRadius:14,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"16px 0",
      position:"relative", overflow:"hidden" }}>

      {/* Phase labels */}
      <div style={{ display:"flex", gap:10, marginBottom:8 }}>
        {["Original DNA","Unzipping","New Strands Built"].map((l,i)=>(
          <div key={i} style={{
            padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
            background: phase===i?"#6366F1":"rgba(99,102,241,0.15)",
            color: phase===i?"white":"#818CF8",
            transition:"all 0.3s",
          }}>{l}</div>
        ))}
      </div>

      {/* DNA visualization */}
      <div style={{ display:"flex", flexDirection:"column", gap:4, position:"relative" }}>
        {pairs.map((pair, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:0,
            animation: playing ? `eventpop 0.4s ${i*0.08}s both` : "none",
          }}>
            {/* Left base */}
            <div style={{
              width:32, height:22, borderRadius:"4px 0 0 4px",
              background:pair[2], display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:900, color:"white",
              transform: phase===1 ? "translateX(-18px)" : "translateX(0)",
              transition:"transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: phase===1 ? 0.6 : 1,
            }}>{pair[0]}</div>

            {/* Bond */}
            <div style={{
              width: phase===1?0:20, height:3, borderRadius:2,
              background:`linear-gradient(to right,${pair[2]},${pair[3]})`,
              transition:"width 0.5s ease",
              overflow:"hidden",
            }} />

            {/* Right base */}
            <div style={{
              width:32, height:22, borderRadius:"0 4px 4px 0",
              background:pair[3], display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:900, color:"white",
              transform: phase===1 ? "translateX(18px)" : "translateX(0)",
              transition:"transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: phase===1 ? 0.6 : 1,
            }}>{pair[1]}</div>

            {/* New complementary bases (phase 2) */}
            {phase===2 && (
              <>
                <div style={{
                  width:28, height:22, borderRadius:"0 4px 4px 0", marginLeft:4,
                  background:pair[3]+"CC", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:900, color:"white", border:"2px dashed white",
                  animation:"newstrand 0.4s ease both",
                }}>★</div>
                <div style={{
                  width:28, height:22, borderRadius:"4px 0 0 4px", marginRight:4,
                  background:pair[2]+"CC", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, fontWeight:900, color:"white", border:"2px dashed white",
                  animation:"newstrand 0.4s ease both", marginLeft:-62,
                  transform:"translateX(-68px)",
                }}>★</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize:11, color:"#64748B", marginTop:6, fontStyle:"italic" }}>
        {["Double helix — A pairs T, G pairs C",
          "Helicase enzyme unzips the two strands",
          "New complementary bases added by polymerase"][phase]}
      </div>
    </div>
  );
}

/* ── 6. ACID-BASE REACTION ────────────────────────────── */
function AcidBaseAnim({ playing }) {
  const [ph, setPH] = useState(2);
  useEffect(() => {
    if (!playing) { setPH(2); return; }
    let v = 2; let dir = 1;
    const t = setInterval(() => {
      v += dir * 0.15;
      if (v >= 12) dir = -1;
      if (v <= 2)  dir = 1;
      setPH(Math.round(v*10)/10);
    }, 80);
    return () => clearInterval(t);
  }, [playing]);

  const phColor = ph < 7
    ? `hsl(${(ph/7)*30},80%,50%)`
    : ph === 7 ? "#8B5CF6"
    : `hsl(${200+(ph-7)*8},70%,45%)`;

  const phLabel = ph < 6 ? "Acid 🔴" : ph > 8 ? "Base 🔵" : "Neutral 🟣";

  return (
    <div style={{ width:"100%", height:240, background:"#0A1428", borderRadius:14,
      padding:20, display:"flex", flexDirection:"column", gap:14, overflow:"hidden" }}>

      {/* Beakers */}
      <div style={{ display:"flex", gap:20, justifyContent:"center", alignItems:"flex-end" }}>
        {/* Acid beaker */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#F87171", fontWeight:700, marginBottom:4 }}>HCl (Acid)</div>
          <div style={{ width:60, height:70, border:"3px solid #F87171", borderTop:"none",
            borderRadius:"0 0 8px 8px", position:"relative", overflow:"hidden",
            background:"rgba(239,68,68,0.1)" }}>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60%",
              background:"rgba(239,68,68,0.4)", transition:"height 0.3s" }} />
            {/* Bubbles */}
            {playing && [0,1].map(i=>(
              <div key={i} style={{
                position:"absolute", left:`${20+i*25}%`, bottom:8,
                width:6, height:6, borderRadius:"50%",
                background:"#F8717188",
                animation:`bubble 1.5s ${i*0.5}s ease-in infinite`,
              }} />
            ))}
          </div>
          <div style={{ fontSize:9, color:"#94A3B8", marginTop:2 }}>pH ~2</div>
        </div>

        {/* Mix arrow */}
        <div style={{ fontSize:22, marginBottom:28, color:"#F59E0B",
          animation: playing ? "arrowbob 1s ease-in-out infinite" : "none" }}>⟷</div>

        {/* Base beaker */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#60A5FA", fontWeight:700, marginBottom:4 }}>NaOH (Base)</div>
          <div style={{ width:60, height:70, border:"3px solid #60A5FA", borderTop:"none",
            borderRadius:"0 0 8px 8px", position:"relative", overflow:"hidden",
            background:"rgba(59,130,246,0.1)" }}>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60%",
              background:"rgba(59,130,246,0.4)" }} />
            {playing && [0,1].map(i=>(
              <div key={i} style={{
                position:"absolute", left:`${20+i*25}%`, bottom:8,
                width:6, height:6, borderRadius:"50%", background:"#60A5FA88",
                animation:`bubble 1.5s ${i*0.7}s ease-in infinite`,
              }} />
            ))}
          </div>
          <div style={{ fontSize:9, color:"#94A3B8", marginTop:2 }}>pH ~12</div>
        </div>

        {/* Result beaker */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, fontWeight:700, marginBottom:4, color:"#A78BFA" }}>Result</div>
          <div style={{ width:60, height:70, border:"3px solid #8B5CF6", borderTop:"none",
            borderRadius:"0 0 8px 8px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"70%",
              background:phColor, transition:"background 0.3s",
              opacity:0.7 }} />
          </div>
          <div style={{ fontSize:9, color:"#94A3B8", marginTop:2 }}>{phLabel}</div>
        </div>
      </div>

      {/* pH bar */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#64748B", marginBottom:4 }}>
          <span>Acidic (0)</span><span>Neutral (7)</span><span>Basic (14)</span>
        </div>
        <div style={{ height:16, borderRadius:8, overflow:"hidden",
          background:"linear-gradient(to right,#EF4444,#F59E0B,#EAB308,#22C55E,#22C55E,#3B82F6,#1D4ED8)",
          position:"relative" }}>
          <div style={{
            position:"absolute", top:0, bottom:0, width:4, borderRadius:2,
            background:"white", boxShadow:"0 0 6px rgba(0,0,0,0.4)",
            left:`${(ph/14)*100}%`, transition:"left 0.1s",
          }} />
        </div>
        <div style={{ textAlign:"center", marginTop:6, fontSize:13, fontWeight:800, color: phColor }}>
          pH = {ph.toFixed(1)} — {phLabel}
        </div>
      </div>

      <div style={{ textAlign:"center", fontSize:11, color:"#64748B", fontStyle:"italic" }}>
        HCl + NaOH → NaCl + H₂O (neutralisation)
      </div>
    </div>
  );
}

/* ── 7. BINARY SEARCH ─────────────────────────────────── */
function BinarySearchAnim({ playing }) {
  const arr = [2,5,8,12,16,23,38,42,55,72];
  const target = 23;
  const [step, setStep] = useState(0);
  const [lo,setLo] = useState(0);
  const [hi,setHi] = useState(9);
  const [mid,setMid] = useState(4);
  const [found,setFound] = useState(false);
  const [eliminated,setElim] = useState([]);

  useEffect(() => {
    if (!playing) { setStep(0);setLo(0);setHi(9);setMid(4);setFound(false);setElim([]); return; }
    if (found) return;
    const timer = setTimeout(() => {
      const m = Math.floor((lo+hi)/2);
      setMid(m);
      if (arr[m]===target) { setFound(true); return; }
      if (arr[m]<target) {
        const newElim=[...eliminated,...Array.from({length:m-lo+1},(_,i)=>lo+i)];
        setElim(newElim); setLo(m+1);
      } else {
        const newElim=[...eliminated,...Array.from({length:hi-m+1},(_,i)=>m+i)];
        setElim(newElim); setHi(m-1);
      }
      setStep(s=>s+1);
    }, 1400);
    return () => clearTimeout(timer);
  }, [playing, step, found]);

  return (
    <div style={{ width:"100%", height:240, background:"#0A1428", borderRadius:14,
      padding:20, display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ textAlign:"center", fontSize:12, fontWeight:700, color:"#E2EEFF" }}>
        🔍 Searching for <span style={{color:"#F59E0B",fontSize:15}}>23</span> in sorted array
      </div>

      {/* Array boxes */}
      <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
        {arr.map((v,i) => (
          <div key={i} style={{
            width:36, height:36, borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:800,
            transition:"all 0.4s",
            background: found && i===mid ? "#22C55E"
              : i===mid ? "#6366F1"
              : eliminated.includes(i) ? "rgba(71,85,105,0.3)"
              : "rgba(99,102,241,0.2)",
            color: eliminated.includes(i) ? "#334155" : found && i===mid ? "white" : "#E2EEFF",
            border: `2px solid ${found && i===mid ? "#22C55E" : i===mid ? "#818CF8" : "transparent"}`,
            transform: eliminated.includes(i) ? "scale(0.85)" : "scale(1)",
            boxShadow: i===mid ? "0 0 16px #6366F188" : "none",
          }}>{v}</div>
        ))}
      </div>

      {/* Low / Mid / High markers */}
      <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
        {arr.map((_,i) => (
          <div key={i} style={{
            width:36, textAlign:"center", fontSize:9, fontWeight:700,
            color: i===lo?"#34D399":i===mid?"#818CF8":i===hi?"#F87171":"transparent",
          }}>
            {i===lo?"LO":i===mid?"MID":i===hi?"HI":""}
          </div>
        ))}
      </div>

      {/* Step info */}
      <div style={{
        textAlign:"center", padding:"8px 16px", borderRadius:10,
        background: found ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.12)",
        border: `1px solid ${found?"rgba(34,197,94,0.3)":"rgba(99,102,241,0.2)"}`,
      }}>
        <span style={{ fontSize:12, fontWeight:700, color: found?"#4ADE80":"#A5B4FC" }}>
          {found
            ? `✅ Found 23 at index ${mid} in just ${step+1} step${step>0?"s":""}!`
            : `Step ${step+1}: Check mid[${mid}]=${arr[mid]} — ${arr[mid]<target?"too small, go right ➡":"too big, go left ⬅"}`}
        </span>
      </div>

      <div style={{ textAlign:"center", fontSize:10, color:"#475569" }}>
        O(log n) — halves the search space each step vs O(n) linear
      </div>
    </div>
  );
}

/* ── 8. FRENCH REVOLUTION TIMELINE ───────────────────── */
function FrenchRevAnim({ playing }) {
  const events = [
    { year:"1789", event:"Storming of the Bastille", icon:"🏰", color:"#EF4444" },
    { year:"1791", event:"Constitutional Monarchy",   icon:"📜", color:"#F59E0B" },
    { year:"1792", event:"First French Republic",     icon:"🏛️",  color:"#8B5CF6" },
    { year:"1793", event:"Reign of Terror",           icon:"⚔️",  color:"#DC2626" },
    { year:"1799", event:"Napoleon Takes Power",      icon:"👑", color:"#6366F1" },
  ];
  return (
    <div style={{ width:"100%", height:240, background:"#1A0A00", borderRadius:14,
      padding:"16px 20px", overflow:"hidden", position:"relative" }}>

      {/* Flag decoration */}
      <div style={{ position:"absolute", top:10, right:16, display:"flex", gap:2 }}>
        {["#002395","#FFFFFF","#ED2939"].map((c,i)=>(
          <div key={i} style={{ width:10, height:24, background:c,
            animation: playing ? `flagwave 2s ${i*0.1}s ease-in-out infinite` : "none" }} />
        ))}
      </div>

      <div style={{ fontSize:12, fontWeight:800, color:"#FCD34D", marginBottom:12 }}>
        🏛️ French Revolution (1789–1799)
      </div>

      {/* Timeline line */}
      <div style={{ position:"relative", height:160, paddingLeft:24 }}>
        <div style={{
          position:"absolute", left:8, top:10, bottom:10, width:3,
          background:"linear-gradient(to bottom,#EF4444,#6366F1)", borderRadius:2,
          animation: playing ? "timelinegrow 2s ease both" : "none",
          transformOrigin:"top",
        }} />

        {events.map((e,i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:10, marginBottom:22,
            animation: playing ? `eventpop 0.4s ${i*0.3}s both` : "none",
            opacity: playing ? undefined : 0,
          }}>
            {/* Dot */}
            <div style={{
              position:"absolute", left:4, width:11, height:11, borderRadius:"50%",
              background:e.color, boxShadow:`0 0 8px ${e.color}`,
              marginTop:2,
            }} />
            {/* Content */}
            <div style={{ marginLeft:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:16 }}>{e.icon}</span>
                <span style={{ fontSize:11, fontWeight:900, color:e.color, fontFamily:"'Syne',sans-serif" }}>
                  {e.year}
                </span>
                <span style={{ fontSize:12, fontWeight:700, color:"#E2EEFF" }}>{e.event}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── All Lessons Data ────────────────────────────────────────────────── */
const LESSONS = [
  {
    id:"photosynthesis", subject:"biology", title:"Photosynthesis",
    emoji:"🌿", tagline:"How plants make food from sunlight",
    difficulty:"Easy", duration:"3 min",
    keyPoints:["Chlorophyll absorbs sunlight","CO₂ + H₂O → Glucose + O₂","Happens in chloroplasts","Produces oxygen we breathe"],
    Component: PhotosynthesisAnim,
  },
  {
    id:"dna", subject:"biology", title:"DNA Replication",
    emoji:"🧬", tagline:"How DNA copies itself before cell division",
    difficulty:"Medium", duration:"4 min",
    keyPoints:["Double helix structure","A-T and G-C base pairs","Helicase unzips the strand","Each strand becomes a template"],
    Component: DNAAnim,
  },
  {
    id:"newton", subject:"physics", title:"Newton's Laws",
    emoji:"⚛️", tagline:"The three fundamental laws of motion",
    difficulty:"Easy", duration:"4 min",
    keyPoints:["Inertia: objects resist change","F = ma (Force = mass × acceleration)","Every action has equal reaction","Basis of classical mechanics"],
    Component: NewtonAnim,
  },
  {
    id:"quadratic", subject:"math", title:"Quadratic Functions",
    emoji:"📐", tagline:"Parabolas, roots, and the vertex",
    difficulty:"Medium", duration:"3 min",
    keyPoints:["y = ax² + bx + c is a parabola","Vertex is the turning point","Roots are where y = 0","Opens up when a > 0"],
    Component: QuadraticAnim,
  },
  {
    id:"watercycle", subject:"geography", title:"The Water Cycle",
    emoji:"🌍", tagline:"How water circulates through Earth",
    difficulty:"Easy", duration:"3 min",
    keyPoints:["Evaporation: water → vapour","Condensation forms clouds","Precipitation: rain & snow","Runoff returns to oceans"],
    Component: WaterCycleAnim,
  },
  {
    id:"acidbase", subject:"chemistry", title:"Acid-Base Reactions",
    emoji:"⚗️", tagline:"Neutralisation and the pH scale",
    difficulty:"Medium", duration:"4 min",
    keyPoints:["pH < 7 = acidic, pH > 7 = basic","Acid + Base → Salt + Water","Neutralisation = balancing pH","HCl + NaOH → NaCl + H₂O"],
    Component: AcidBaseAnim,
  },
  {
    id:"binarysearch", subject:"cs", title:"Binary Search",
    emoji:"💻", tagline:"Efficiently find values in sorted arrays",
    difficulty:"Medium", duration:"4 min",
    keyPoints:["Array must be sorted first","Halves search space each step","O(log n) time complexity","Much faster than linear O(n)"],
    Component: BinarySearchAnim,
  },
  {
    id:"frenchrev", subject:"history", title:"French Revolution",
    emoji:"🏛️", tagline:"10 years that changed the world",
    difficulty:"Easy", duration:"3 min",
    keyPoints:["1789: Bastille stormed","Liberty, Equality, Fraternity","Monarchy replaced by Republic","Led to Napoleon's rise"],
    Component: FrenchRevAnim,
  },
];

/* ─── Lesson Modal ────────────────────────────────────────────────────── */
function LessonModal({ lesson, dark, onClose }) {
  const [playing, setPlaying] = useState(false);
  const { Component } = lesson;
  const t  = dark ? "#E2EEFF" : "#0F172A";
  const mu = dark ? "#64748B" : "#94A3B8";
  const subj = SUBJECTS.find(s=>s.id===lesson.subject);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"24px 24px 0" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ fontSize:32 }}>{lesson.emoji}</div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:900, color:t }}>
                {lesson.title}
              </h2>
              <p style={{ fontSize:13, color:mu }}>{lesson.tagline}</p>
            </div>
            <button onClick={onClose} style={{
              width:32, height:32, borderRadius:"50%", border:"none", cursor:"pointer",
              background: dark?"rgba(99,102,241,0.15)":"rgba(165,180,252,0.3)",
              color:mu, fontSize:16, fontWeight:700, fontFamily:"inherit",
            }}>✕</button>
          </div>

          {/* Meta */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {[
              { label:`📚 ${subj?.label}`, col:subj?.color },
              { label:`⏱ ${lesson.duration}` },
              { label:`${lesson.difficulty==="Easy"?"🟢":"🟡"} ${lesson.difficulty}` },
            ].map((tag,i)=>(
              <span key={i} style={{
                padding:"3px 11px", borderRadius:20, fontSize:11, fontWeight:700,
                background: tag.col ? `${tag.col}20` : (dark?"rgba(99,102,241,0.1)":"rgba(238,242,255,0.8)"),
                border:`1px solid ${tag.col?`${tag.col}40`:(dark?"rgba(99,102,241,0.2)":"rgba(165,180,252,0.4)")}`,
                color: tag.col || (dark?"#818CF8":"#6366F1"),
              }}>{tag.label}</span>
            ))}
          </div>
        </div>

        {/* Animation area */}
        <div style={{ padding:"0 24px" }}>
          <Component playing={playing} />
        </div>

        {/* Controls */}
        <div style={{ padding:"16px 24px 0", display:"flex", justifyContent:"center" }}>
          <button onClick={()=>setPlaying(!playing)} style={{
            padding:"10px 32px", borderRadius:12, border:"none", cursor:"pointer",
            background: playing
              ? "linear-gradient(135deg,#EF4444,#F87171)"
              : "linear-gradient(135deg,#6366F1,#818CF8)",
            color:"white", fontFamily:"inherit", fontSize:14, fontWeight:800,
            boxShadow: playing ? "0 4px 16px rgba(239,68,68,0.4)" : "0 4px 16px rgba(99,102,241,0.4)",
            transition:"all 0.2s",
          }}>
            {playing ? "⏸ Pause Animation" : "▶ Play Animation"}
          </button>
        </div>

        {/* Key Points */}
        <div style={{ padding:"16px 24px 24px" }}>
          <p style={{ fontSize:11, fontWeight:800, color:mu, textTransform:"uppercase",
            letterSpacing:"0.08em", marginBottom:10 }}>Key Concepts</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {lesson.keyPoints.map((pt,i)=>(
              <div key={i} style={{
                display:"flex", gap:8, alignItems:"flex-start",
                padding:"8px 12px", borderRadius:10,
                background: dark?"rgba(99,102,241,0.08)":"rgba(238,242,255,0.7)",
                border:`1px solid ${dark?"rgba(99,102,241,0.12)":"rgba(165,180,252,0.35)"}`,
              }}>
                <span style={{ color:subj?.color||"#6366F1", fontSize:14, flexShrink:0, marginTop:1 }}>◆</span>
                <span style={{ fontSize:12, color:t, lineHeight:1.45, fontWeight:500 }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Lesson Card ─────────────────────────────────────────────────────── */
function LessonCard({ lesson, dark, onClick, index }) {
  const subj = SUBJECTS.find(s=>s.id===lesson.subject);
  const t  = dark ? "#E2EEFF" : "#0F172A";
  const mu = dark ? "#64748B" : "#94A3B8";

  return (
    <div className={`lesson-card fade d${(index%8)+1}`} onClick={onClick}
      style={{ padding:20 }}>

      {/* Subject badge */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{
          padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
          background: dark ? `${subj?.color}22` : `${subj?.color}18`,
          border:`1px solid ${subj?.color}40`, color:subj?.color,
        }}>{subj?.icon} {subj?.label}</span>
        <span style={{
          fontSize:10, fontWeight:700,
          color: lesson.difficulty==="Easy"?"#4ADE80":"#FCD34D",
          background: lesson.difficulty==="Easy"?"rgba(74,222,128,0.12)":"rgba(252,211,77,0.12)",
          padding:"2px 8px", borderRadius:20,
        }}>{lesson.difficulty==="Easy"?"🟢":"🟡"} {lesson.difficulty}</span>
      </div>

      <div style={{ fontSize:32, marginBottom:8 }}>{lesson.emoji}</div>

      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:900,
        color:t, marginBottom:5 }}>{lesson.title}</h3>
      <p style={{ fontSize:12, color:mu, lineHeight:1.5, marginBottom:14 }}>{lesson.tagline}</p>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, color:mu }}>⏱ {lesson.duration}</span>
        <div style={{
          padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700,
          background:`linear-gradient(135deg,${subj?.color},${subj?.color}CC)`,
          color:"white", boxShadow:`0 2px 10px ${subj?.color}44`,
        }}>▶ Watch</div>
      </div>

      {/* Bottom accent bar */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:3,
        background:`linear-gradient(to right,${subj?.color},${subj?.color}44,transparent)`,
        borderRadius:"0 0 22px 22px",
      }} />
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────────────────── */
export default function AnimatedLessons() {
  const navigate   = useNavigate();
  const { dark, toggleDark } = useApp();
  const [activeSubj, setActiveSubj] = useState("all");
  const [openLesson, setOpenLesson] = useState(null);

  const t  = dark ? "#E2EEFF" : "#0F172A";
  const mu = dark ? "#64748B" : "#94A3B8";

  const filtered = activeSubj==="all"
    ? LESSONS
    : LESSONS.filter(l=>l.subject===activeSubj);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className={`al-root ${dark?"dark":"light"}`}>

        {/* Nav */}
        <nav style={{
          position:"sticky", top:0, zIndex:50,
          background: dark?"rgba(6,12,24,0.93)":"rgba(242,246,255,0.93)",
          backdropFilter:"blur(20px)",
          borderBottom:`1px solid ${dark?"rgba(99,102,241,0.12)":"rgba(165,180,252,0.4)"}`,
          padding:"12px 24px", display:"flex", alignItems:"center", gap:12,
        }}>
          <button onClick={()=>navigate("/student/dashboard")} style={{
            padding:"7px 16px", borderRadius:10,
            border:`1px solid ${dark?"rgba(99,102,241,0.25)":"rgba(165,180,252,0.5)"}`,
            background:"transparent", color:mu, cursor:"pointer",
            fontSize:13, fontWeight:700, fontFamily:"inherit",
          }}>← Back</button>

          <div style={{ flex:1 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:900, color:t }}>
              🎬 Animated Lessons
            </span>
            <span style={{ marginLeft:10, fontSize:11, fontWeight:700,
              color:"#4ADE80", background:"rgba(74,222,128,0.12)",
              padding:"2px 8px", borderRadius:20, border:"1px solid rgba(74,222,128,0.3)" }}>
              ✈ Works Offline
            </span>
          </div>

          <button onClick={toggleDark} style={{
            width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
            background:dark?"#4F46E5":"#E2E8F0", padding:2, display:"flex", alignItems:"center",
          }}>
            <div style={{
              width:20, height:20, borderRadius:"50%", background:"white",
              transform:dark?"translateX(20px)":"translateX(0)",
              transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:11,
            }}>{dark?"🌙":"☀️"}</div>
          </button>
        </nav>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 20px 80px" }}>

          {/* Hero */}
          <div className="fade" style={{ textAlign:"center", marginBottom:40 }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif",
              fontSize:"clamp(28px,5vw,44px)", fontWeight:900, lineHeight:1.1, marginBottom:10 }}>
              <span className="shimmer-text">Learn Through Animation</span>
            </h1>
            <p style={{ fontSize:15, color:mu, maxWidth:460, margin:"0 auto", lineHeight:1.65 }}>
              Pure CSS animations — every concept visualised step-by-step.
              No internet required. Works on flights, offline, anywhere.
            </p>

            {/* Stats row */}
            <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:20, flexWrap:"wrap" }}>
              {[
                { n:`${LESSONS.length}`, label:"Lessons" },
                { n:"7", label:"Subjects" },
                { n:"100%", label:"Offline" },
                { n:"0", label:"Ads" },
              ].map((s,i)=>(
                <div key={i} className={`fade d${i+1}`} style={{
                  padding:"10px 20px", borderRadius:14,
                  background: dark?"rgba(13,27,46,0.85)":"rgba(255,255,255,0.9)",
                  border:`1px solid ${dark?"rgba(99,102,241,0.18)":"rgba(165,180,252,0.35)"}`,
                  textAlign:"center",
                }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:900,
                    color:"#818CF8" }}>{s.n}</div>
                  <div style={{ fontSize:11, color:mu, fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Filter Tabs */}
          <div className="fade d2" style={{
            display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:32,
          }}>
            <button className={`tab-btn ${activeSubj==="all"?"active":""}`}
              onClick={()=>setActiveSubj("all")}
              style={{
                background: activeSubj==="all"
                  ? "linear-gradient(135deg,#6366F1,#818CF8)"
                  : (dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.9)"),
                color: activeSubj==="all" ? "white" : mu,
              }}>
              🔭 All ({LESSONS.length})
            </button>
            {SUBJECTS.map(s=>{
              const count = LESSONS.filter(l=>l.subject===s.id).length;
              if (!count) return null;
              return (
                <button key={s.id} className={`tab-btn ${activeSubj===s.id?"active":""}`}
                  onClick={()=>setActiveSubj(s.id)}
                  style={{
                    background: activeSubj===s.id
                      ? `linear-gradient(135deg,${s.color},${s.color}CC)`
                      : (dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.9)"),
                    color: activeSubj===s.id ? "white" : mu,
                  }}>
                  {s.icon} {s.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Lesson Grid */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
            gap:16,
          }}>
            {filtered.map((lesson,i)=>(
              <LessonCard key={lesson.id} lesson={lesson} dark={dark}
                index={i} onClick={()=>setOpenLesson(lesson)} />
            ))}
          </div>

          {/* Offline badge */}
          <div className="fade" style={{
            marginTop:48, padding:"18px 24px", borderRadius:16, textAlign:"center",
            background: dark
              ? "linear-gradient(135deg,rgba(74,222,128,0.08),rgba(34,197,94,0.05))"
              : "linear-gradient(135deg,rgba(209,250,229,0.8),rgba(167,243,208,0.5))",
            border:"1px solid rgba(74,222,128,0.25)",
          }}>
            
          </div>
        </div>

        {/* Modal */}
        {openLesson && (
          <LessonModal lesson={openLesson} dark={dark} onClose={()=>setOpenLesson(null)} />
        )}
      </div>
    </>
  );
}