/**
 * MentorDashboard.jsx — PathwayAI Mentor Suite
 * Unified enhanced UI: MentorProfile, SessionManager, StudentRequests,
 * EarningsWallet, MyCredentials
 * Design: Dark neon — black / electric green / cyan blue / neon pink
 */

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
const T = {
  bg:       "#040810",
  bg2:      "#080f1c",
  bg3:      "#0c1526",
  card:     "#0a1220",
  border:   "rgba(255,255,255,0.06)",
  green:    "#00ff88",
  blue:     "#00b4ff",
  pink:     "#ff2d78",
  cyan:     "#00e5ff",
  text:     "#e8f0fe",
  muted:    "#4a6080",
  muted2:   "#2a3a55",
};

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #00ff88;
    --blue: #00b4ff;
    --pink: #ff2d78;
    --cyan: #00e5ff;
    --bg: #040810;
    --card: #0a1220;
  }

  body { background: var(--bg); }

  .md-root {
    min-height: 100vh;
    font-family: 'Space Grotesk', sans-serif;
    background: var(--bg);
    color: #e8f0fe;
    overflow-x: hidden;
  }

  /* Animated noise grain overlay */
  .md-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }

  .md-layout { display: flex; min-height: 100vh; position: relative; z-index: 1; }

  /* ── Sidebar ── */
  .md-sidebar {
    width: 72px;
    background: #060d1a;
    border-right: 1px solid rgba(0,255,136,0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    gap: 8px;
    position: fixed;
    top: 0; bottom: 0; left: 0;
    z-index: 100;
  }

  .md-logo {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--green), var(--blue));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 14px; font-weight: 900;
    color: #040810;
    margin-bottom: 24px;
    box-shadow: 0 0 20px rgba(0,255,136,0.3);
    flex-shrink: 0;
  }

  .md-nav-btn {
    width: 46px; height: 46px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: #2a3a55;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    transition: all 0.2s ease;
    position: relative;
  }

  .md-nav-btn:hover {
    background: rgba(0,255,136,0.08);
    color: var(--green);
  }

  .md-nav-btn.active {
    background: rgba(0,255,136,0.12);
    color: var(--green);
    box-shadow: 0 0 16px rgba(0,255,136,0.15);
  }

  .md-nav-btn.active::before {
    content: '';
    position: absolute;
    left: -1px; top: 50%; transform: translateY(-50%);
    width: 3px; height: 24px;
    background: var(--green);
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 8px var(--green);
  }

  .md-nav-btn .badge {
    position: absolute;
    top: 6px; right: 6px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: var(--pink);
    font-size: 8px;
    font-weight: 800;
    color: white;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 8px var(--pink);
  }

  /* ── Main content ── */
  .md-main {
    margin-left: 72px;
    flex: 1;
    padding: 32px;
    max-width: 100%;
  }

  /* ── Cards ── */
  .md-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .md-card:hover {
    border-color: rgba(0,255,136,0.12);
  }

  .md-card-glow-green { box-shadow: 0 0 32px rgba(0,255,136,0.06); border-color: rgba(0,255,136,0.15); }
  .md-card-glow-blue  { box-shadow: 0 0 32px rgba(0,180,255,0.06); border-color: rgba(0,180,255,0.15); }
  .md-card-glow-pink  { box-shadow: 0 0 32px rgba(255,45,120,0.06); border-color: rgba(255,45,120,0.15); }

  /* ── Neon text ── */
  .neon-green { color: var(--green); text-shadow: 0 0 20px rgba(0,255,136,0.5); }
  .neon-blue  { color: var(--blue);  text-shadow: 0 0 20px rgba(0,180,255,0.5); }
  .neon-pink  { color: var(--pink);  text-shadow: 0 0 20px rgba(255,45,120,0.5); }
  .neon-cyan  { color: var(--cyan);  text-shadow: 0 0 20px rgba(0,229,255,0.4); }

  /* ── Page title ── */
  .page-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #e8f0fe;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  /* ── Tabs ── */
  .md-tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 28px;
  }

  .md-tab {
    padding: 10px 18px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    background: transparent;
    color: #2a3a55;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.2s;
    font-family: 'Space Grotesk', sans-serif;
  }

  .md-tab:hover { color: #4a6080; }
  .md-tab.active-green { color: var(--green); border-color: var(--green); }
  .md-tab.active-blue  { color: var(--blue);  border-color: var(--blue); }
  .md-tab.active-pink  { color: var(--pink);  border-color: var(--pink); }

  /* ── Buttons ── */
  .btn-primary {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  .btn-green {
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #040810;
    box-shadow: 0 4px 20px rgba(0,255,136,0.25);
  }
  .btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,255,136,0.4); }

  .btn-blue {
    background: linear-gradient(135deg, #00b4ff, #0080d0);
    color: white;
    box-shadow: 0 4px 20px rgba(0,180,255,0.25);
  }
  .btn-blue:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,180,255,0.4); }

  .btn-pink {
    background: linear-gradient(135deg, #ff2d78, #cc0055);
    color: white;
    box-shadow: 0 4px 20px rgba(255,45,120,0.25);
  }
  .btn-pink:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,45,120,0.4); }

  .btn-ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    color: #4a6080;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: #e8f0fe; }

  .btn-ghost-danger {
    background: transparent;
    border: 1px solid rgba(255,45,120,0.2);
    color: rgba(255,45,120,0.7);
  }
  .btn-ghost-danger:hover { border-color: var(--pink); color: var(--pink); background: rgba(255,45,120,0.05); }

  /* ── Pill badges ── */
  .pill {
    display: inline-flex; align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .pill-green { background: rgba(0,255,136,0.1); color: var(--green); border: 1px solid rgba(0,255,136,0.2); }
  .pill-blue  { background: rgba(0,180,255,0.1); color: var(--blue);  border: 1px solid rgba(0,180,255,0.2); }
  .pill-pink  { background: rgba(255,45,120,0.1); color: var(--pink); border: 1px solid rgba(255,45,120,0.2); }
  .pill-amber { background: rgba(255,160,0,0.1); color: #ffb300;      border: 1px solid rgba(255,160,0,0.2); }
  .pill-muted { background: rgba(255,255,255,0.04); color: #4a6080;   border: 1px solid rgba(255,255,255,0.06); }

  /* ── Avatar ── */
  .md-avatar {
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    color: #040810;
    flex-shrink: 0;
  }

  /* ── Progress bar ── */
  .prog-track {
    height: 6px;
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
    overflow: hidden;
  }
  .prog-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── Input ── */
  .md-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    color: #e8f0fe;
    outline: none;
    transition: border-color 0.2s;
  }
  .md-input:focus { border-color: rgba(0,255,136,0.4); box-shadow: 0 0 0 3px rgba(0,255,136,0.06); }

  /* ── Stat card ── */
  .stat-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 22px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card.sc-green::before { background: linear-gradient(90deg, var(--green), transparent); box-shadow: 0 0 12px var(--green); }
  .stat-card.sc-blue::before  { background: linear-gradient(90deg, var(--blue), transparent); box-shadow: 0 0 12px var(--blue); }
  .stat-card.sc-pink::before  { background: linear-gradient(90deg, var(--pink), transparent); box-shadow: 0 0 12px var(--pink); }
  .stat-card.sc-cyan::before  { background: linear-gradient(90deg, var(--cyan), transparent); box-shadow: 0 0 12px var(--cyan); }

  .stat-val {
    font-family: 'Orbitron', sans-serif;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #2a3a55;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,136,0.2); }
    50%       { box-shadow: 0 0 0 6px rgba(0,255,136,0); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up.d1 { animation-delay: 0.05s; }
  .fade-up.d2 { animation-delay: 0.10s; }
  .fade-up.d3 { animation-delay: 0.15s; }
  .fade-up.d4 { animation-delay: 0.20s; }
  .fade-up.d5 { animation-delay: 0.25s; }

  .pulse-green { animation: pulse-glow 2.5s ease-in-out infinite; }

  /* ── Mono data ── */
  .mono { font-family: 'JetBrains Mono', monospace; }

  /* ── Divider ── */
  .md-divider { border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 0; }

  /* ── Section header ── */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }

  /* ── Row items ── */
  .row-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s;
  }
  .row-item:last-child { border-bottom: none; }
  .row-item:hover { background: rgba(255,255,255,0.02); }

  /* ── Session card ── */
  .session-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s ease;
  }
  .session-card:hover {
    border-color: rgba(0,180,255,0.2);
    box-shadow: 0 0 24px rgba(0,180,255,0.05);
    transform: translateY(-2px);
  }

  /* ── Request card ── */
  .request-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .request-card:hover {
    border-color: rgba(255,45,120,0.2);
    box-shadow: 0 0 24px rgba(255,45,120,0.05);
  }

  /* ── Availability grid ── */
  .avail-cell {
    width: 36px; height: 32px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    transition: all 0.2s;
  }
  .avail-cell.on  { background: rgba(0,255,136,0.15); color: var(--green); border: 1px solid rgba(0,255,136,0.3); }
  .avail-cell.off { background: rgba(255,255,255,0.03); color: #1a2a3a; border: 1px solid rgba(255,255,255,0.05); }
  .avail-cell.on:hover  { background: rgba(0,255,136,0.25); box-shadow: 0 0 12px rgba(0,255,136,0.2); }
  .avail-cell.off:hover { background: rgba(255,255,255,0.06); color: #2a3a55; }

  /* ── Credential card ── */
  .cred-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 22px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .cred-card.earned:hover {
    transform: translateY(-2px);
  }
  .cred-card.locked { opacity: 0.45; }

  /* ── Top edge accent ── */
  .cred-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
  }

  /* ── Stars ── */
  .stars { display: flex; gap: 2px; }
  .star-filled { color: #ffb300; font-size: 11px; }
  .star-empty  { color: #1a2a3a; font-size: 11px; }

  /* ── Tier card ── */
  .tier-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  /* ── Profile cover ── */
  .profile-cover {
    height: 160px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    margin-bottom: -52px;
    background: linear-gradient(135deg, #060f1e 0%, #0a1830 40%, #060d1a 100%);
  }

  .cover-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .cover-scan {
    position: absolute; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent);
    animation: scanline 4s linear infinite;
    opacity: 0.6;
  }

  .cover-orb {
    position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none;
  }

  /* ── Withdraw success ── */
  .withdraw-success {
    border-radius: 14px;
    padding: 28px;
    text-align: center;
    background: rgba(0,255,136,0.05);
    border: 1px solid rgba(0,255,136,0.2);
  }

  /* ── Profile avatar large ── */
  .profile-avatar-lg {
    width: 96px; height: 96px;
    border-radius: 20px;
    background: linear-gradient(135deg, var(--green), var(--blue));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 34px; font-weight: 900;
    color: #040810;
    border: 3px solid #040810;
    box-shadow: 0 0 32px rgba(0,255,136,0.3);
    position: relative; z-index: 2;
  }

  /* ── Tooltip ── */
  .md-nav-btn .tip {
    position: absolute;
    left: 60px;
    background: #0c1526;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e8f0fe;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    font-family: 'Space Grotesk', sans-serif;
  }

  .md-nav-btn:hover .tip { opacity: 1; }

  /* ── Shimmer loading effect ── */
  .shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
    background-size: 200% auto;
    animation: shimmer 2s linear infinite;
  }
`;

/* ─────────────────────────── MOCK DATA ─────────────────────────── */
const TRANSACTIONS = [
  { id:"TXN001", student:"Priya M.",  subject:"Science",     date:"Nov 28", amount:100, status:"paid",     utr:"UTR934821" },
  { id:"TXN002", student:"Meera S.",  subject:"Mathematics", date:"Nov 25", amount:130, status:"paid",     utr:"UTR821043" },
  { id:"TXN003", student:"Dev R.",    subject:"Mathematics", date:"Nov 23", amount:100, status:"paid",     utr:"UTR712389" },
  { id:"TXN004", student:"Aisha K.",  subject:"Science",     date:"Nov 20", amount:80,  status:"paid",     utr:"UTR601234" },
  { id:"TXN005", student:"Rahul K.",  subject:"Mathematics", date:"Today",  amount:100, status:"pending",  utr:null },
  { id:"TXN006", student:"Sneha P.",  subject:"Physics",     date:"Tomorrow",amount:120,status:"upcoming", utr:null },
];

const TIERS = [
  { label:"Bronze", color:"#cd7f32", min:0,   max:50,  sessions:12, perks:["₹50–₹100/session","Profile badge","Basic analytics"] },
  { label:"Silver", color:"#94a3b8", min:50,  max:150, sessions:0,  perks:["₹80–₹150/session","Priority matching","Teacher endorsements","Advanced analytics"] },
  { label:"Gold",   color:"#f59e0b", min:150, max:500, sessions:0,  perks:["₹100–₹200/session","Featured profile","Direct employer visibility","Dedicated support"] },
];

const UPCOMING_SESSIONS = [
  { id:1, student:"Rahul K.",  avatar:"R", color:"#00b4ff", subject:"Mathematics", topic:"Quadratic Equations", date:"Today",    time:"5:00 PM", duration:"45 min", mode:"Voice" },
  { id:2, student:"Sneha P.",  avatar:"S", color:"#00ff88", subject:"Physics",      topic:"Laws of Motion",      date:"Tomorrow", time:"6:30 PM", duration:"60 min", mode:"Text" },
  { id:3, student:"Arjun T.",  avatar:"A", color:"#ff2d78", subject:"Mathematics", topic:"Trigonometry",         date:"Dec 5",    time:"5:00 PM", duration:"45 min", mode:"Voice" },
];

const SESSION_HISTORY = [
  { student:"Priya M.",  avatar:"P", color:"#00ff88", subject:"Science",      topic:"Newton's Laws",       date:"Yesterday", duration:"45 min", rating:5, earned:100 },
  { student:"Meera S.",  avatar:"M", color:"#ff2d78", subject:"Mathematics",  topic:"Coordinate Geometry", date:"Nov 25",    duration:"60 min", rating:5, earned:130 },
  { student:"Dev R.",    avatar:"D", color:"#00b4ff", subject:"Mathematics",  topic:"Statistics",          date:"Nov 23",    duration:"45 min", rating:4, earned:100 },
  { student:"Aisha K.",  avatar:"A", color:"#9b5de5", subject:"Science",      topic:"Periodic Table",      date:"Nov 20",    duration:"30 min", rating:5, earned:80  },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const SLOTS = ["4 PM","5 PM","6 PM","7 PM","8 PM"];
const INIT_AVAIL = {
  Mon:["5 PM","6 PM","7 PM"], Tue:["5 PM","6 PM"],
  Wed:["6 PM","7 PM"],        Thu:["5 PM","7 PM","8 PM"],
  Fri:["5 PM","6 PM","7 PM"], Sat:["4 PM","5 PM","6 PM"],
  Sun:["4 PM","5 PM"],
};

const REQUESTS = [
  { id:1, student:"Ananya R.", avatar:"A", color:"#ff2d78",  class:"Class 10", subject:"Mathematics", topic:"Quadratic Equations", doubt:"I don't understand how to find the nature of roots using the discriminant. My board exams are in 2 weeks and this is really important.", time:"Weekday evenings 5–7 PM", lang:"Hindi",   urgency:"high",   when:"2 min ago" },
  { id:2, student:"Karan V.",  avatar:"K", color:"#00b4ff",  class:"Class 9",  subject:"Science",      topic:"Gravitation",        doubt:"I'm confused about the difference between g and G — why does g change at different heights but G doesn't? I've read the chapter 3 times.", time:"Saturday 10 AM–12 PM", lang:"English",  urgency:"medium", when:"15 min ago" },
  { id:3, student:"Riya S.",   avatar:"R", color:"#9b5de5",  class:"Class 11", subject:"Mathematics", topic:"Trigonometry",        doubt:"How do I prove trigonometric identities? I always get lost halfway through the proof. Can you show me a systematic approach?", time:"Any time this weekend", lang:"English",  urgency:"low",    when:"1 hr ago" },
  { id:4, student:"Yash M.",   avatar:"Y", color:"#00ff88",  class:"Class 8",  subject:"Science",      topic:"Photosynthesis",     doubt:"My teacher explained photosynthesis but I can't remember the steps in order. Can you make it easy to remember?", time:"Today evening", lang:"Marathi",  urgency:"high",   when:"3 hr ago" },
];

const REVIEWS = [
  { student:"Rahul K.", avatar:"R", color:"#00b4ff", rating:5, subject:"Mathematics", text:"Kavya explained quadratic equations so clearly — I finally understood the discriminant! She stayed an extra 20 minutes just to make sure I got it.", date:"2 days ago" },
  { student:"Priya M.", avatar:"P", color:"#00ff88", rating:5, subject:"Science",     text:"Newton's laws session was amazing. She used cricket examples which made it click instantly. Would book again every week.", date:"5 days ago" },
  { student:"Arjun T.", avatar:"A", color:"#9b5de5", rating:4, subject:"Mathematics", text:"Very patient and thorough. Trigonometry was my biggest fear but not anymore. Clear explanations, good pace.", date:"1 week ago" },
  { student:"Meera S.", avatar:"M", color:"#ff2d78", rating:5, subject:"Mathematics", text:"Best mentor on the platform. Explains step-by-step and checks understanding before moving on.", date:"2 weeks ago" },
];

const SUBJECTS = [
  { name:"Mathematics", level:"Class 9–12", sessions:28, color:"#00ff88", progress:85 },
  { name:"Physics",     level:"Class 9–10", sessions:8,  color:"#00b4ff", progress:60 },
  { name:"Science",     level:"Class 6–8",  sessions:6,  color:"#ff2d78", progress:45 },
];

const CREDENTIALS = [
  { id:"bronze",   type:"badge",       title:"Bronze Mentor",      issuer:"PathwayAI",           issuerRole:null,                                    desc:"Completed 12 verified peer mentoring sessions with a minimum 4.0 average rating.", earned:true,  date:"Nov 15, 2025", color:"#cd7f32", skills:["Peer Teaching","Mathematics","Communication"],   progress:null, goal:null },
  { id:"math",     type:"badge",       title:"Mathematics Expert", issuer:"PathwayAI",           issuerRole:null,                                    desc:"Demonstrated mastery in teaching Class 9–12 Mathematics with 10+ sessions and 4.5+ rating.", earned:true, date:"Nov 22, 2025", color:"#00b4ff", skills:["Algebra","Geometry","Trigonometry","Calculus"], progress:null, goal:null },
  { id:"endorse1", type:"endorsement", title:"Teacher Endorsement",issuer:"Mrs. Sunita Deshpande",issuerRole:"Mathematics Teacher, Govt. High School Pune", desc:"Kavya is an exceptional peer mentor. Her ability to explain quadratic equations helped 5 students improve grades significantly.", earned:true,  date:"Nov 20, 2025", color:"#00ff88", skills:["Student Outcomes","Curriculum Knowledge"],      progress:null, goal:null },
  { id:"silver",   type:"badge",       title:"Silver Mentor",      issuer:"PathwayAI",           issuerRole:null,                                    desc:"Complete 50 sessions with 4.3+ average rating to unlock.", earned:false, date:null,          color:"#94a3b8", skills:["Advanced Teaching","Curriculum Design"],         progress:24,   goal:50 },
  { id:"gold",     type:"badge",       title:"Gold Mentor",        issuer:"PathwayAI",           issuerRole:null,                                    desc:"Complete 150 sessions with 4.5+ average rating to unlock.", earned:false, date:null,          color:"#f59e0b", skills:["Mentorship Excellence","Career Readiness"],      progress:24,   goal:150 },
];

const URGENCY_CONFIG = {
  high:   { label:"Urgent",    color:"#ff2d78", bg:"rgba(255,45,120,0.1)",   border:"rgba(255,45,120,0.2)" },
  medium: { label:"This Week", color:"#ffb300", bg:"rgba(255,179,0,0.1)",    border:"rgba(255,179,0,0.2)" },
  low:    { label:"Flexible",  color:"#00ff88", bg:"rgba(0,255,136,0.1)",    border:"rgba(0,255,136,0.2)" },
};

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

function Stars({ rating, max = 5 }) {
  return (
    <div className="stars">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
          {i < rating ? "★" : "★"}
        </span>
      ))}
    </div>
  );
}

function Avatar({ letter, color, size = 40, radius = 10 }) {
  return (
    <div className="md-avatar" style={{
      width: size, height: size, borderRadius: radius,
      background: `linear-gradient(135deg, ${color}cc, ${color}55)`,
      border: `1px solid ${color}40`,
      fontSize: size * 0.38,
      boxShadow: `0 0 16px ${color}20`,
    }}>
      {letter}
    </div>
  );
}

function StatCard({ label, value, colorClass, note }) {
  return (
    <div className={`stat-card ${colorClass} fade-up`}>
      <div className={`stat-label`} style={{ marginBottom: 10 }}>{label}</div>
      <div className={`stat-val ${colorClass.replace("sc-", "neon-")}`}>{value}</div>
      {note && <div style={{ fontSize: 10, color: "#2a3a55", marginTop: 6, fontFamily:"'JetBrains Mono', monospace" }}>{note}</div>}
    </div>
  );
}

/* ─────────────────────────── PAGES ─────────────────────────── */

/* ── Profile ── */
function ProfilePage() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ maxWidth: 780, margin:"0 auto" }}>
      {/* Cover */}
      <div className="profile-cover">
        <div className="cover-grid" />
        <div className="cover-scan" />
        <div className="cover-orb" style={{ width:200, height:200, background:"rgba(0,255,136,0.06)", top:-60, right:60 }} />
        <div className="cover-orb" style={{ width:160, height:160, background:"rgba(0,180,255,0.05)", bottom:-40, left:80 }} />
        <div className="cover-orb" style={{ width:100, height:100, background:"rgba(255,45,120,0.05)", top:20, left:200 }} />
      </div>

      {/* Header */}
      <div style={{ padding:"0 4px", marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:16, marginBottom:18 }}>
          <div className="profile-avatar-lg">K</div>
          <div style={{ flex:1, paddingBottom:6 }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:700, color:"#e8f0fe", marginBottom:4, letterSpacing:"0.03em" }}>
              Kavya Nair
            </div>
            <div style={{ fontSize:12, color:"#2a3a55", marginBottom:8 }}>
              Peer Mentor · Pune, Maharashtra · <span className="neon-green">Active</span>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["Mathematics","Physics","Science"].map(s => (
                <span key={s} className="pill pill-green" style={{ fontSize:9 }}>{s}</span>
              ))}
              <span className="pill pill-muted" style={{ fontSize:9 }}>English / Hindi</span>
            </div>
          </div>
          <button className="btn-primary btn-green" style={{ flexShrink:0 }}>Edit Profile</button>
        </div>

        {/* Stats strip */}
        <div className="md-card" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", marginBottom:20 }}>
          {[
            { label:"Sessions",  val:"42",   color:"#00ff88" },
            { label:"Rating",    val:"4.9",  color:"#ffb300" },
            { label:"Students",  val:"18",   color:"#00b4ff" },
            { label:"Hours",     val:"36h",  color:"#9b5de5" },
            { label:"Earned",    val:"₹2.4k",color:"#00ff88" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding:"16px 8px", textAlign:"center", borderRight: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:700, color:s.color, marginBottom:4 }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="md-tabs">
        {["overview","reviews","subjects","credentials"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`md-tab ${tab === t ? "active-green" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Bio */}
          <div className="md-card fade-up d1" style={{ padding:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2a3a55", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>About</div>
            <p style={{ fontSize:13.5, color:"#4a6080", lineHeight:1.75 }}>
              Class 12 student at Pune Model School with a passion for making mathematics accessible. 
              I break down complex concepts into simple steps using real-world analogies. 
              Specialising in Class 9–12 Math and Science with a 4.9 rating across 42 sessions.
            </p>
          </div>

          {/* Quick nav */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }} className="fade-up d2">
            {[
              { label:"Sessions",    sub:"Manage bookings", color:"#00b4ff" },
              { label:"Earnings",    sub:"Wallet & payouts",color:"#00ff88" },
              { label:"Requests",    sub:"4 pending",       color:"#ff2d78" },
              { label:"Credentials", sub:"Badges & certs",  color:"#9b5de5" },
            ].map(n => (
              <div key={n.label} className="md-card" style={{ padding:18, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = n.color+"30"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = ""; }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:n.color, boxShadow:`0 0 8px ${n.color}`, marginBottom:12 }} />
                <div style={{ fontSize:13, fontWeight:700, color:"#e8f0fe", marginBottom:4 }}>{n.label}</div>
                <div style={{ fontSize:11, color:"#2a3a55" }}>{n.sub}</div>
              </div>
            ))}
          </div>

          {/* Recent reviews snippet */}
          <div className="md-card fade-up d3">
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#2a3a55", letterSpacing:"0.08em", textTransform:"uppercase" }}>Recent Reviews</span>
              <button className="btn-ghost btn-primary" style={{ padding:"6px 12px", fontSize:10 }} onClick={() => setTab("reviews")}>View all</button>
            </div>
            {REVIEWS.slice(0,2).map((r,i) => (
              <div key={i} className="row-item">
                <Avatar letter={r.avatar} color={r.color} size={36} radius={9} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#e8f0fe", marginBottom:2 }}>{r.student}</div>
                  <div style={{ fontSize:12, color:"#2a3a55", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.text}</div>
                </div>
                <Stars rating={r.rating} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {tab === "reviews" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Summary */}
          <div className="md-card fade-up d1" style={{ padding:24 }}>
            <div style={{ display:"flex", gap:32, alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:48, fontWeight:900, color:"#ffb300", lineHeight:1 }}>4.9</div>
                <Stars rating={5} />
                <div style={{ fontSize:11, color:"#2a3a55", marginTop:6 }}>42 reviews</div>
              </div>
              <div style={{ flex:1 }}>
                {[5,4,3,2,1].map(n => {
                  const count = n === 5 ? 36 : n === 4 ? 5 : n === 3 ? 1 : 0;
                  return (
                    <div key={n} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:10, color:"#2a3a55", width:12, textAlign:"right" }}>{n}</span>
                      <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.04)", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(count/42)*100}%`, background:"#ffb300", borderRadius:3, boxShadow:"0 0 8px #ffb30060" }} />
                      </div>
                      <span style={{ fontSize:10, color:"#2a3a55", width:16 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[{val:"100%",label:"Recommend"},{val:"4.9",label:"Communication"},{val:"4.8",label:"Clarity"}].map(s => (
                  <div key={s.label} style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, fontWeight:700, color:"#00ff88" }}>{s.val}</div>
                    <div style={{ fontSize:10, color:"#2a3a55" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {REVIEWS.map((r,i) => (
            <div key={i} className={`md-card fade-up d${i+1}`} style={{ padding:22 }}>
              <div style={{ display:"flex", gap:14 }}>
                <Avatar letter={r.avatar} color={r.color} size={42} radius={11} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontWeight:700, fontSize:13, color:"#e8f0fe" }}>{r.student}</span>
                      <span className="pill pill-muted" style={{ fontSize:9 }}>{r.subject}</span>
                    </div>
                    <span style={{ fontSize:11, color:"#1a2a3a" }}>{r.date}</span>
                  </div>
                  <div style={{ marginBottom:10 }}><Stars rating={r.rating} /></div>
                  <p style={{ fontSize:13, color:"#4a6080", lineHeight:1.7 }}>{r.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subjects */}
      {tab === "subjects" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {SUBJECTS.map((s,i) => (
            <div key={s.name} className={`md-card fade-up d${i+1}`} style={{ padding:26 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
                <div style={{ width:48, height:48, borderRadius:13, background:`${s.color}10`, border:`1px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background:s.color, boxShadow:`0 0 12px ${s.color}` }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:700, color:"#e8f0fe", marginBottom:3 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:"#2a3a55" }}>{s.level} · {s.sessions} sessions</div>
                </div>
                <Stars rating={5} />
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#2a3a55", marginBottom:8 }}>
                  <span>Proficiency</span>
                  <span style={{ color:s.color, fontWeight:700 }}>{s.progress}%</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width:`${s.progress}%`, background:`linear-gradient(90deg,${s.color}60,${s.color})`, boxShadow:`0 0 10px ${s.color}40` }} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {[
                  { label:"Sessions",   val:s.sessions,          color:s.color },
                  { label:"Avg Rating", val:"4.8",               color:"#ffb300" },
                  { label:"Earned",     val:`₹${s.sessions*80}`, color:"#00ff88" },
                ].map(st => (
                  <div key={st.label} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${st.color}15`, borderRadius:12, padding:"14px 10px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:700, color:st.color, marginBottom:3 }}>{st.val}</div>
                    <div style={{ fontSize:10, color:"#2a3a55", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>{st.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Credentials preview */}
      {tab === "credentials" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {CREDENTIALS.filter(c => c.earned).map((c, i) => (
            <div key={c.id} className={`cred-card earned fade-up d${i+1}`} style={{ borderColor:`${c.color}20` }}>
              <div className="cred-accent" style={{ background:`linear-gradient(90deg,${c.color},transparent)` }} />
              <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${c.color}12`, border:`1px solid ${c.color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:c.color, boxShadow:`0 0 14px ${c.color}` }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, fontWeight:700, color:"#e8f0fe", marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:11, color:"#2a3a55", marginBottom:8 }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {c.skills.map(s => (
                      <span key={s} className="pill" style={{ background:`${c.color}10`, color:c.color, border:`1px solid ${c.color}25`, fontSize:9 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <span className="pill pill-green" style={{ fontSize:9, flexShrink:0 }}>Earned</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sessions ── */
function SessionsPage() {
  const [tab, setTab] = useState("upcoming");
  const [sessions, setSessions] = useState(UPCOMING_SESSIONS);
  const [avail, setAvail] = useState(INIT_AVAIL);

  const toggleSlot = (day, slot) => {
    setAvail(prev => {
      const curr = prev[day] || [];
      return { ...prev, [day]: curr.includes(slot) ? curr.filter(s => s !== slot) : [...curr, slot] };
    });
  };

  return (
    <div style={{ maxWidth: 780, margin:"0 auto" }}>
      <div className="section-header">
        <div>
          <div className="page-title" style={{ marginBottom: 6 }}>Sessions</div>
          <div style={{ fontSize:12, color:"#2a3a55" }}>Manage your upcoming bookings and past history</div>
        </div>
        <div className="md-card" style={{ padding:"12px 20px", textAlign:"center", minWidth:80 }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:22, fontWeight:700, color:"#00b4ff" }}>{sessions.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      <div className="md-tabs">
        {["upcoming","availability","history"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`md-tab ${tab === t ? "active-blue" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Upcoming */}
      {tab === "upcoming" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {sessions.length === 0 ? (
            <div className="md-card" style={{ padding:60, textAlign:"center" }}>
              <div style={{ width:48, height:48, borderRadius:12, background:"rgba(0,180,255,0.08)", border:"1px solid rgba(0,180,255,0.15)", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:16, height:16, borderRadius:"50%", background:"#00b4ff", opacity:0.5 }} />
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:"#e8f0fe", marginBottom:6 }}>No upcoming sessions</div>
              <div style={{ fontSize:12, color:"#2a3a55" }}>New bookings will appear here</div>
            </div>
          ) : sessions.map((s,i) => (
            <div key={s.id} className={`session-card fade-up d${i+1}`}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <Avatar letter={s.avatar} color={s.color} size={44} radius={12} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#e8f0fe" }}>{s.student}</span>
                    <span className="pill pill-blue" style={{ fontSize:9 }}>{s.subject}</span>
                    <span className="pill pill-muted" style={{ fontSize:9 }}>{s.mode}</span>
                  </div>
                  <div style={{ fontSize:13, color:"#4a6080", marginBottom:10 }}>{s.topic}</div>
                  <div style={{ display:"flex", gap:20 }}>
                    <span style={{ fontSize:11, color:"#2a3a55", display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#00b4ff", display:"inline-block" }} />
                      {s.date} · {s.time}
                    </span>
                    <span style={{ fontSize:11, color:"#2a3a55" }}>{s.duration}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
                  {s.date === "Today" ? (
                    <button className="btn-primary btn-blue pulse-green" style={{ fontSize:11, padding:"9px 16px" }}>
                      Join Session
                    </button>
                  ) : (
                    <span className="pill pill-muted" style={{ textAlign:"center" }}>Scheduled</span>
                  )}
                  <button className="btn-primary btn-ghost-danger" style={{ fontSize:11, padding:"7px 14px" }}
                    onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Availability */}
      {tab === "availability" && (
        <div className="md-card fade-up">
          <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#e8f0fe", marginBottom:2 }}>Weekly Availability</div>
              <div style={{ fontSize:11, color:"#2a3a55" }}>Toggle slots students can book</div>
            </div>
          </div>
          <div style={{ padding:22, overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"4px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign:"left", paddingBottom:12, fontSize:10, color:"#2a3a55", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Time</th>
                  {DAYS.map(d => (
                    <th key={d} style={{ textAlign:"center", paddingBottom:12, fontSize:10, color:"#e8f0fe", fontWeight:700, letterSpacing:"0.04em" }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map(slot => (
                  <tr key={slot}>
                    <td style={{ paddingRight:16, fontSize:11, color:"#2a3a55", fontFamily:"'JetBrains Mono',monospace", paddingBottom:4 }}>{slot}</td>
                    {DAYS.map(day => {
                      const on = (avail[day] || []).includes(slot);
                      return (
                        <td key={day} style={{ textAlign:"center", paddingBottom:4 }}>
                          <button className={`avail-cell ${on ? "on" : "off"}`}
                            onClick={() => toggleSlot(day, slot)}>
                            {on ? "✓" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"14px 22px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"flex-end" }}>
            <button className="btn-primary btn-green" style={{ fontSize:11 }}>Save Availability</button>
          </div>
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }} className="fade-up d1">
            <StatCard label="Total Sessions" value="32" colorClass="sc-blue" />
            <StatCard label="Total Hours" value="28h" colorClass="sc-cyan" />
            <StatCard label="Total Earned" value="₹2,400" colorClass="sc-green" />
          </div>

          <div className="md-card fade-up d2">
            {SESSION_HISTORY.map((s, i) => (
              <div key={i} className="row-item">
                <Avatar letter={s.avatar} color={s.color} size={40} radius={10} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8f0fe", marginBottom:2 }}>{s.student}</div>
                  <div style={{ fontSize:11, color:"#2a3a55" }}>{s.subject} · {s.topic}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <Stars rating={s.rating} />
                  <div style={{ fontSize:10, color:"#2a3a55", marginTop:2 }}>{s.date}</div>
                </div>
                <div style={{ textAlign:"right", minWidth:60 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:"#00ff88" }}>+₹{s.earned}</div>
                  <div style={{ fontSize:10, color:"#2a3a55" }}>{s.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Requests ── */
function RequestsPage() {
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState(REQUESTS);
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const accept  = id => { setAccepted(a => [...a, pending.find(r => r.id === id)]); setPending(p => p.filter(r => r.id !== id)); };
  const decline = id => { setDeclined(d => [...d, pending.find(r => r.id === id)]); setPending(p => p.filter(r => r.id !== id)); };

  const RequestCard = ({ req, showActions }) => {
    const urg = URGENCY_CONFIG[req.urgency];
    const isExp = expanded === req.id;
    return (
      <div className="request-card">
        <div style={{ padding:20 }}>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <Avatar letter={req.avatar} color={req.color} size={44} radius={12} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:13, color:"#e8f0fe" }}>{req.student}</span>
                <span style={{ fontSize:10, color:"#4a6080" }}>{req.class}</span>
                <span className="pill" style={{ background:urg.bg, color:urg.color, border:`1px solid ${urg.border}`, fontSize:9 }}>{urg.label}</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                <span className="pill pill-blue" style={{ fontSize:9 }}>{req.subject}</span>
                <span className="pill pill-muted" style={{ fontSize:9 }}>{req.topic}</span>
                <span className="pill pill-muted" style={{ fontSize:9 }}>{req.lang}</span>
              </div>
              <p style={{ fontSize:12, color:"#4a6080", lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:isExp?999:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {req.doubt}
              </p>
              {req.doubt.length > 100 && (
                <button onClick={() => setExpanded(isExp ? null : req.id)}
                  style={{ fontSize:11, fontWeight:700, color:"#00b4ff", background:"none", border:"none", cursor:"pointer", marginTop:4, padding:0 }}>
                  {isExp ? "Show less" : "Read more"}
                </button>
              )}
              {isExp && (
                <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(0,180,255,0.05)", border:"1px solid rgba(0,180,255,0.1)", borderRadius:10 }}>
                  <div style={{ fontSize:10, color:"#2a3a55", marginBottom:4, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>Preferred Time</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#e8f0fe" }}>{req.time}</div>
                </div>
              )}
            </div>
            <div style={{ fontSize:10, color:"#1a2a3a", flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>{req.when}</div>
          </div>
        </div>
        {showActions && (
          <div style={{ display:"flex", gap:10, padding:"14px 20px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
            <button className="btn-primary btn-green" style={{ flex:1, fontSize:11 }} onClick={() => accept(req.id)}>
              Accept Request
            </button>
            <button className="btn-primary btn-ghost-danger" style={{ padding:"10px 18px", fontSize:11 }} onClick={() => decline(req.id)}>
              Decline
            </button>
          </div>
        )}
      </div>
    );
  };

  const lists = { pending, accepted, declined };

  return (
    <div style={{ maxWidth: 720, margin:"0 auto" }}>
      <div className="section-header">
        <div>
          <div className="page-title" style={{ marginBottom:6 }}>Student Requests</div>
          <div style={{ fontSize:12, color:"#2a3a55" }}>Incoming session requests — review and respond</div>
        </div>
        {pending.length > 0 && (
          <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,45,120,0.15)", border:"1px solid rgba(255,45,120,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#ff2d78", boxShadow:"0 0 16px rgba(255,45,120,0.2)" }}>
            {pending.length}
          </div>
        )}
      </div>

      <div className="md-tabs">
        {[
          { id:"pending",  label:`Pending (${pending.length})` },
          { id:"accepted", label:`Accepted (${accepted.length})` },
          { id:"declined", label:`Declined (${declined.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`md-tab ${tab === t.id ? "active-pink" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14, opacity: tab === "declined" ? 0.6 : 1 }}>
        {lists[tab].length === 0 ? (
          <div className="md-card" style={{ padding:60, textAlign:"center" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#e8f0fe", marginBottom:6 }}>
              {tab === "pending" ? "All caught up!" : `No ${tab} requests`}
            </div>
            <div style={{ fontSize:12, color:"#2a3a55" }}>
              {tab === "pending" ? "New requests will appear here" : ""}
            </div>
          </div>
        ) : lists[tab].map((req, i) => (
          <div key={req.id} className={`fade-up d${i+1}`} style={{ position:"relative" }}>
            {tab !== "pending" && (
              <div style={{ position:"absolute", top:14, right:14, zIndex:2 }}>
                <span className={`pill ${tab === "accepted" ? "pill-green" : "pill-muted"}`} style={{ fontSize:9 }}>
                  {tab === "accepted" ? "Accepted" : "Declined"}
                </span>
              </div>
            )}
            <RequestCard req={req} showActions={tab === "pending"} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Earnings ── */
function EarningsPage() {
  const [tab, setTab] = useState("overview");
  const [upiId, setUpiId] = useState("kavya.nair@upi");
  const [editUpi, setEditUpi] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawDone, setWithdrawDone] = useState(false);

  const currentTier = TIERS[0];
  const nextTier    = TIERS[1];
  const pct = (currentTier.sessions / nextTier.min) * 100;

  const handleWithdraw = () => {
    if (!withdrawAmt || isNaN(withdrawAmt)) return;
    setWithdrawDone(true);
    setTimeout(() => setWithdrawDone(false), 3500);
    setWithdrawAmt("");
  };

  const statusColor = s => s === "paid" ? "#00ff88" : s === "pending" ? "#ffb300" : "#2a3a55";
  const statusLabel = s => s === "paid" ? "Paid" : s === "pending" ? "Pending" : "Upcoming";

  return (
    <div style={{ maxWidth: 840, margin:"0 auto" }}>
      <div className="section-header">
        <div>
          <div className="page-title" style={{ marginBottom:6 }}>Earnings & Wallet</div>
          <div style={{ fontSize:12, color:"#2a3a55" }}>Track income, manage payouts, and level up your tier</div>
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
        <StatCard label="Total Earned"  value="₹2,400" colorClass="sc-green" note="Since Nov 2025" />
        <StatCard label="Available"     value="₹410"   colorClass="sc-blue"  />
        <StatCard label="Withdrawn"     value="₹1,990" colorClass="sc-pink"  />
        <StatCard label="This Month"    value="₹410"   colorClass="sc-cyan"  />
      </div>

      <div className="md-tabs">
        {["overview","withdraw","history","tiers"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`md-tab ${tab === t ? "active-green" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Tier progress */}
          <div className="md-card fade-up d1" style={{ padding:26 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#cd7f32", boxShadow:"0 0 10px #cd7f32" }} />
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:700, color:"#e8f0fe" }}>{currentTier.label} Mentor</span>
                </div>
                <div style={{ fontSize:11, color:"#2a3a55" }}>
                  {nextTier.min - currentTier.sessions} more sessions to reach {nextTier.label}
                </div>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#2a3a55" }}>
                {currentTier.sessions} / {nextTier.min}
              </div>
            </div>
            <div className="prog-track" style={{ height:8, marginBottom:8 }}>
              <div className="prog-fill" style={{ width:`${pct}%`, background:"linear-gradient(90deg,#cd7f3280,#cd7f32)", boxShadow:"0 0 14px #cd7f3250" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, fontWeight:700, color:"#cd7f32" }}>{currentTier.label}</span>
              <span style={{ fontSize:10, fontWeight:700, color:"#94a3b8" }}>{nextTier.label}</span>
            </div>
          </div>

          {/* UPI payout */}
          <div className="md-card fade-up d2" style={{ padding:22 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#e8f0fe" }}>Payout Account</div>
              <button onClick={() => setEditUpi(e => !e)}
                style={{ fontSize:11, fontWeight:700, color:"#00b4ff", background:"none", border:"none", cursor:"pointer" }}>
                {editUpi ? "Save" : "Edit"}
              </button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 8px #00ff88" }} />
              {editUpi ? (
                <input value={upiId} onChange={e => setUpiId(e.target.value)} onBlur={() => setEditUpi(false)}
                  className="md-input" style={{ flex:1, padding:"4px 0", background:"transparent", border:"none", borderRadius:0 }} autoFocus />
              ) : (
                <span style={{ flex:1, fontSize:13, fontWeight:600, color:"#e8f0fe", fontFamily:"'JetBrains Mono',monospace" }}>{upiId}</span>
              )}
              <span style={{ fontSize:10, fontWeight:800, color:"#00ff88" }}>Verified</span>
            </div>
            <div style={{ fontSize:11, color:"#2a3a55", marginTop:10 }}>88% payout rate · Transfers within 24 hours</div>
          </div>

          {/* Recent transactions */}
          <div className="md-card fade-up d3">
            <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#e8f0fe" }}>Recent Transactions</div>
              <button onClick={() => setTab("history")} style={{ fontSize:11, fontWeight:700, color:"#00b4ff", background:"none", border:"none", cursor:"pointer" }}>
                View all
              </button>
            </div>
            {TRANSACTIONS.slice(0,4).map((t, i) => (
              <div key={i} className="row-item">
                <div style={{ width:8, height:8, borderRadius:"50%", background:statusColor(t.status), boxShadow:`0 0 8px ${statusColor(t.status)}`, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#e8f0fe", marginBottom:1 }}>{t.student} · {t.subject}</div>
                  <div style={{ fontSize:10, color:"#2a3a55", fontFamily:"'JetBrains Mono',monospace" }}>{t.date}{t.utr ? ` · ${t.utr}` : ""}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:statusColor(t.status) }}>
                    {t.status === "paid" ? "+" : ""}₹{t.amount}
                  </div>
                  <div style={{ fontSize:10, color:statusColor(t.status), fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{statusLabel(t.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Withdraw */}
      {tab === "withdraw" && (
        <div style={{ maxWidth:440, margin:"0 auto" }}>
          <div className="md-card fade-up" style={{ padding:32 }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:42, fontWeight:900, color:"#00ff88", lineHeight:1, marginBottom:8, textShadow:"0 0 40px rgba(0,255,136,0.4)" }}>
                ₹410
              </div>
              <div style={{ fontSize:12, color:"#2a3a55", letterSpacing:"0.08em", textTransform:"uppercase" }}>Available to withdraw</div>
            </div>

            {withdrawDone ? (
              <div className="withdraw-success">
                <div style={{ width:48, height:48, borderRadius:12, background:"rgba(0,255,136,0.1)", border:"1px solid rgba(0,255,136,0.2)", margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:22, color:"#00ff88" }}>✓</div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"#00ff88", marginBottom:6 }}>Withdrawal initiated</div>
                <div style={{ fontSize:11, color:"#4a6080" }}>Arriving at {upiId} within 24 hours</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, color:"#2a3a55", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Amount (₹)</label>
                  <input type="number" placeholder="Max ₹410"
                    value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)}
                    className="md-input" />
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, marginBottom:20, fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#4a6080" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 8px #00ff88" }} />
                  {upiId}
                </div>
                <button className="btn-primary btn-green" style={{ width:"100%", padding:"14px", fontSize:13 }}
                  onClick={handleWithdraw} disabled={!withdrawAmt}>
                  Withdraw to UPI
                </button>
                {withdrawAmt && !isNaN(withdrawAmt) && (
                  <div style={{ fontSize:11, color:"#2a3a55", textAlign:"center", marginTop:12 }}>
                    ₹{Math.round(Number(withdrawAmt) * 0.88)} after 12% platform fee
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div className="md-card fade-up">
          <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#e8f0fe" }}>All Transactions</div>
            <div style={{ fontSize:10, color:"#2a3a55", fontFamily:"'JetBrains Mono',monospace" }}>{TRANSACTIONS.length} records</div>
          </div>
          {TRANSACTIONS.map((t, i) => (
            <div key={i} className="row-item">
              <div style={{ width:8, height:8, borderRadius:"50%", background:statusColor(t.status), boxShadow:`0 0 8px ${statusColor(t.status)}`, flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#e8f0fe", marginBottom:1 }}>{t.student} · {t.subject}</div>
                <div style={{ fontSize:10, color:"#2a3a55", fontFamily:"'JetBrains Mono',monospace" }}>{t.id} · {t.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:statusColor(t.status) }}>₹{t.amount}</div>
                {t.utr ? (
                  <div style={{ fontSize:10, color:"#1a2a3a", fontFamily:"'JetBrains Mono',monospace" }}>{t.utr}</div>
                ) : (
                  <div style={{ fontSize:10, fontWeight:700, color:statusColor(t.status), textTransform:"uppercase", letterSpacing:"0.06em" }}>{statusLabel(t.status)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tiers */}
      {tab === "tiers" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {TIERS.map((tier, i) => {
            const isCurrent = tier.label === "Bronze";
            return (
              <div key={i} className={`tier-card fade-up d${i+1}`} style={{
                borderColor: isCurrent ? `${tier.color}30` : "rgba(255,255,255,0.06)",
                boxShadow: isCurrent ? `0 0 32px ${tier.color}10` : "none",
                opacity: isCurrent ? 1 : 0.5,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:`${tier.color}10`, border:`1px solid ${tier.color}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:tier.color, boxShadow:`0 0 14px ${tier.color}` }} />
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                      <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, fontWeight:700, color:tier.color }}>{tier.label}</span>
                      {isCurrent && <span className="pill" style={{ background:`${tier.color}15`, color:tier.color, border:`1px solid ${tier.color}30`, fontSize:9 }}>Current</span>}
                    </div>
                    <div style={{ fontSize:11, color:"#2a3a55" }}>{tier.min}–{tier.max} sessions required</div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
                  {tier.perks.map(p => (
                    <div key={p} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:tier.color, flexShrink:0, boxShadow:`0 0 6px ${tier.color}` }} />
                      <span style={{ fontSize:12, color:"#4a6080" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Credentials ── */
function CredentialsPage() {
  const [filter, setFilter] = useState("all");
  const [shared, setShared] = useState(null);

  const earned = CREDENTIALS.filter(c => c.earned);
  const filtered = filter === "all" ? CREDENTIALS : filter === "earned" ? earned : CREDENTIALS.filter(c => c.type === filter);

  const handleShare = id => {
    setShared(id);
    setTimeout(() => setShared(null), 2000);
  };

  return (
    <div style={{ maxWidth:720, margin:"0 auto" }}>
      <div className="section-header">
        <div>
          <div className="page-title" style={{ marginBottom:6 }}>Credentials</div>
          <div style={{ fontSize:12, color:"#2a3a55" }}>Open Badges and teacher endorsements — shareable and verifiable</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
        <StatCard label="Badges Earned"   value={earned.filter(c => c.type === "badge").length}       colorClass="sc-cyan"  />
        <StatCard label="Endorsements"    value={earned.filter(c => c.type === "endorsement").length}  colorClass="sc-green" />
        <StatCard label="Skills Verified" value={earned.reduce((a,c) => a + c.skills.length, 0)}       colorClass="sc-pink"  />
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {[
          { id:"all",         label:`All (${CREDENTIALS.length})` },
          { id:"earned",      label:`Earned (${earned.length})` },
          { id:"badge",       label:"Badges" },
          { id:"endorsement", label:"Endorsements" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="btn-primary"
            style={{
              padding:"8px 16px", fontSize:10, letterSpacing:"0.06em", textTransform:"uppercase",
              background: filter === f.id ? "rgba(0,255,136,0.15)" : "transparent",
              color: filter === f.id ? "#00ff88" : "#2a3a55",
              border: `1px solid ${filter === f.id ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map((cred, i) => (
          <div key={cred.id} className={`cred-card ${cred.earned ? "earned" : "locked"} fade-up d${i+1}`}
            style={{ borderColor: cred.earned ? `${cred.color}20` : "rgba(255,255,255,0.04)" }}>
            {cred.earned && <div className="cred-accent" style={{ background:`linear-gradient(90deg,${cred.color},transparent)`, boxShadow:`0 0 8px ${cred.color}` }} />}

            <div style={{ display:"flex", gap:18, alignItems:"flex-start" }}>
              {/* Icon */}
              <div style={{ width:54, height:54, borderRadius:15, background:`${cred.color}10`, border:`1px solid ${cred.color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:cred.color, boxShadow:`0 0 16px ${cred.color}` }} />
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                  <div>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, fontWeight:700, color: cred.earned ? "#e8f0fe" : "#2a3a55", marginBottom:3 }}>{cred.title}</div>
                    <div style={{ fontSize:10, color:"#2a3a55", fontFamily:"'JetBrains Mono',monospace" }}>
                      {cred.issuerRole ? `${cred.issuer}` : `${cred.issuer}`}{cred.date ? ` · ${cred.date}` : ""}
                    </div>
                  </div>
                  <span className="pill" style={{ background:`${cred.color}10`, color:cred.color, border:`1px solid ${cred.color}25`, fontSize:9, flexShrink:0 }}>
                    {cred.type === "endorsement" ? "Endorsement" : "Badge"}
                  </span>
                </div>

                <p style={{ fontSize:12, color:"#4a6080", lineHeight:1.65, marginBottom:12 }}>{cred.desc}</p>

                {/* Skills */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom: cred.earned ? 14 : 0 }}>
                  {cred.skills.map(s => (
                    <span key={s} className="pill" style={{ background:`${cred.color}08`, color:cred.color, border:`1px solid ${cred.color}20`, fontSize:9 }}>{s}</span>
                  ))}
                </div>

                {/* Progress (locked) */}
                {!cred.earned && cred.progress != null && (
                  <div style={{ marginTop:12 }}>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width:`${(cred.progress/cred.goal)*100}%`, background:cred.color }} />
                    </div>
                    <div style={{ fontSize:10, color:"#2a3a55", marginTop:6, fontFamily:"'JetBrains Mono',monospace" }}>{cred.progress} / {cred.goal} sessions</div>
                  </div>
                )}

                {/* Share actions (earned) */}
                {cred.earned && (
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn-primary" onClick={() => handleShare(cred.id)}
                      style={{
                        fontSize:10, padding:"7px 14px", letterSpacing:"0.06em",
                        background: shared === cred.id ? "rgba(0,255,136,0.15)" : `${cred.color}10`,
                        color: shared === cred.id ? "#00ff88" : cred.color,
                        border: `1px solid ${shared === cred.id ? "rgba(0,255,136,0.3)" : cred.color+"30"}`,
                      }}>
                      {shared === cred.id ? "Link Copied" : "Share"}
                    </button>
                    <button className="btn-primary btn-ghost" style={{ fontSize:10, padding:"7px 14px" }}>WhatsApp</button>
                    <button className="btn-primary btn-ghost" style={{ fontSize:10, padding:"7px 14px" }}>LinkedIn</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="md-card fade-up" style={{ marginTop:24, padding:20, textAlign:"center" }}>
        <div style={{ fontSize:11, color:"#2a3a55", marginBottom:4 }}>All credentials are verifiable Open Badges hosted by PathwayAI</div>
        <div style={{ fontSize:11, fontWeight:700, color:"#00b4ff" }}>Share your credential link — employers can scan and verify instantly</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
const NAV_ITEMS = [
  { id:"profile",     icon:"◈", label:"Profile",     badgeCount:0 },
  { id:"sessions",    icon:"▦", label:"Sessions",    badgeCount:3 },
  { id:"requests",    icon:"◎", label:"Requests",    badgeCount:4 },
  { id:"earnings",    icon:"◆", label:"Earnings",    badgeCount:0 },
  { id:"credentials", icon:"⬡", label:"Credentials", badgeCount:0 },
];

export default function MentorDashboard() {
  const [page, setPage] = useState("profile");

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="md-root">
        <div className="md-layout">

          {/* Sidebar */}
          <nav className="md-sidebar">
            <div className="md-logo">PA</div>

            {NAV_ITEMS.map(n => (
              <button key={n.id} className={`md-nav-btn ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}>
                <span style={{ fontSize:17 }}>{n.icon}</span>
                {n.badgeCount > 0 && (
                  <span className="badge">{n.badgeCount}</span>
                )}
                <span className="tip">{n.label}</span>
              </button>
            ))}

            {/* Bottom avatar */}
            <div style={{ marginTop:"auto" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#00ff88,#00b4ff)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:700, color:"#040810", cursor:"pointer" }}>
                K
              </div>
            </div>
          </nav>

          {/* Content */}
          <main className="md-main">
            {page === "profile"     && <ProfilePage />}
            {page === "sessions"    && <SessionsPage />}
            {page === "requests"    && <RequestsPage />}
            {page === "earnings"    && <EarningsPage />}
            {page === "credentials" && <CredentialsPage />}
          </main>
        </div>
      </div>
    </>
  );
}
