/**
 * glassTheme.js — Shared glassmorphism soft pink theme tokens
 * Import in all teacher pages
 */

export const GLASS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --pink:        #e8a4b8;
  --pink-light:  #f2c4d0;
  --pink-soft:   #fce8ed;
  --pink-deep:   #c9748e;
  --mauve:       #d4a8c7;
  --lavender:    #c5b8e8;
  --sage:        #a8c5b8;
  --cream:       #fdf6f0;
  --warm-white:  #fff9f5;
  --text:        #3d2a35;
  --text-mid:    #7a5a68;
  --text-soft:   #b8909e;
  --glass-bg:    rgba(255,240,245,0.55);
  --glass-border:rgba(232,164,184,0.25);
  --glass-shadow:rgba(201,116,142,0.08);
  --blur:        blur(20px);
}

.gl-root {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background:
    radial-gradient(ellipse at 0% 0%, rgba(232,164,184,0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 0%, rgba(197,184,232,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(168,197,184,0.15) 0%, transparent 60%),
    #fdf6f0;
  color: var(--text);
  position: relative;
}

/* Subtle grain texture */
.gl-root::before {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.6;
}

/* Floating orbs */
.gl-orb {
  position: fixed; border-radius: 50%;
  filter: blur(80px); pointer-events: none; z-index: 0;
  animation: orb-drift 12s ease-in-out infinite alternate;
}

@keyframes orb-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(20px, -30px) scale(1.05); }
}

/* Glass card */
.gl-card {
  background: var(--glass-bg);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow:
    0 4px 24px var(--glass-shadow),
    inset 0 1px 0 rgba(255,255,255,0.7);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  position: relative; z-index: 1;
}

.gl-card:hover {
  box-shadow:
    0 8px 40px rgba(201,116,142,0.12),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

/* Glass card elevated */
.gl-card-raised {
  background: rgba(255,248,252,0.75);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  border: 1px solid rgba(232,164,184,0.3);
  border-radius: 20px;
  box-shadow:
    0 8px 40px rgba(201,116,142,0.1),
    0 2px 8px rgba(201,116,142,0.06),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

/* Stat card with colored top */
.gl-stat {
  background: rgba(255,248,252,0.65);
  backdrop-filter: var(--blur);
  -webkit-backdrop-filter: var(--blur);
  border: 1px solid rgba(232,164,184,0.2);
  border-radius: 18px;
  padding: 22px;
  position: relative; overflow: hidden;
  box-shadow: 0 4px 20px rgba(201,116,142,0.07), inset 0 1px 0 rgba(255,255,255,0.8);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  z-index: 1;
}
.gl-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--top-color, var(--pink));
  opacity: 0.6;
}
.gl-stat:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(201,116,142,0.14), inset 0 1px 0 rgba(255,255,255,0.9); }

/* Pill / tag */
.gl-pill {
  display: inline-flex; align-items: center;
  padding: 4px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.03em;
  background: rgba(232,164,184,0.15);
  border: 1px solid rgba(232,164,184,0.3);
  color: var(--pink-deep);
  backdrop-filter: blur(8px);
}

.gl-pill-mauve { background: rgba(212,168,199,0.15); border-color: rgba(212,168,199,0.3); color: #9b6b8a; }
.gl-pill-sage  { background: rgba(168,197,184,0.15); border-color: rgba(168,197,184,0.3); color: #5a8a74; }
.gl-pill-lav   { background: rgba(197,184,232,0.15); border-color: rgba(197,184,232,0.3); color: #7b68bb; }
.gl-pill-warn  { background: rgba(245,158,11,0.12);  border-color: rgba(245,158,11,0.25);  color: #b87a1a; }
.gl-pill-ok    { background: rgba(168,197,184,0.2);  border-color: rgba(168,197,184,0.35); color: #4a7a64; }
.gl-pill-err   { background: rgba(220,100,100,0.12); border-color: rgba(220,100,100,0.25); color: #b04040; }

/* Buttons */
.gl-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: 14px; border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
  position: relative; z-index: 1;
}

.gl-btn-primary {
  background: linear-gradient(135deg, var(--pink-deep), var(--mauve));
  color: white;
  box-shadow: 0 4px 18px rgba(201,116,142,0.3);
}
.gl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,116,142,0.42); }

.gl-btn-ghost {
  background: rgba(255,240,245,0.6);
  border: 1px solid rgba(232,164,184,0.3);
  color: var(--pink-deep);
  backdrop-filter: blur(8px);
}
.gl-btn-ghost:hover { background: rgba(255,240,245,0.9); box-shadow: 0 4px 16px rgba(201,116,142,0.15); }

.gl-btn-sm {
  padding: 7px 14px; border-radius: 10px; font-size: 11px;
}

/* Input */
.gl-input {
  width: 100%;
  background: rgba(255,248,252,0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(232,164,184,0.25);
  border-radius: 12px;
  padding: 11px 15px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; color: var(--text);
  outline: none; transition: all 0.2s;
}
.gl-input:focus {
  border-color: rgba(201,116,142,0.5);
  box-shadow: 0 0 0 3px rgba(232,164,184,0.15);
  background: rgba(255,248,252,0.85);
}
.gl-input::placeholder { color: var(--text-soft); }

/* Tabs */
.gl-tabs { display: flex; gap: 4px; padding: 5px; background: rgba(232,164,184,0.1); border-radius: 14px; border: 1px solid rgba(232,164,184,0.15); }
.gl-tab {
  padding: 8px 18px; border-radius: 10px; font-size: 12px; font-weight: 600;
  border: none; background: transparent; cursor: pointer; color: var(--text-soft);
  transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.03em;
}
.gl-tab.active {
  background: rgba(255,248,252,0.9);
  color: var(--pink-deep);
  box-shadow: 0 2px 10px rgba(201,116,142,0.15);
}

/* Section title */
.gl-section-title {
  font-family: 'Instrument Serif', serif;
  font-size: 13px;
  font-style: italic;
  color: var(--text-soft);
  letter-spacing: 0.04em;
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.gl-section-title::before {
  content: '';
  width: 20px; height: 1px;
  background: var(--pink);
  opacity: 0.5;
}

/* Page title */
.gl-page-title {
  font-family: 'Instrument Serif', serif;
  font-size: 32px;
  font-style: italic;
  color: var(--text);
  line-height: 1.2;
}

/* Divider */
.gl-divider { border: none; border-top: 1px solid rgba(232,164,184,0.2); }

/* Progress bar */
.gl-prog-track { height: 5px; background: rgba(232,164,184,0.15); border-radius: 3px; overflow: hidden; }
.gl-prog-fill  { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

/* Row item */
.gl-row {
  display: flex; align-items: center; gap: 14px;
  padding: 13px 18px;
  border-bottom: 1px solid rgba(232,164,184,0.12);
  transition: background 0.2s;
}
.gl-row:last-child { border-bottom: none; }
.gl-row:hover { background: rgba(232,164,184,0.06); }

/* Score badge */
.gl-score {
  display: inline-block; min-width: 36px;
  text-align: center; padding: 3px 8px;
  border-radius: 8px; font-size: 11px; font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

/* Avatar */
.gl-avatar {
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; color: white;
  flex-shrink: 0;
}

/* Animations */
@keyframes gl-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gl-fade-up { animation: gl-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both; }
.d1 { animation-delay: 0.04s; }
.d2 { animation-delay: 0.08s; }
.d3 { animation-delay: 0.12s; }
.d4 { animation-delay: 0.16s; }
.d5 { animation-delay: 0.20s; }
.d6 { animation-delay: 0.24s; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(201,116,142,0.2); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: rgba(201,116,142,0.4); }

/* Alert strip */
.gl-alert {
  background: rgba(220,100,100,0.07);
  border: 1px solid rgba(220,100,100,0.2);
  border-radius: 16px; padding: 16px 20px;
  backdrop-filter: blur(12px);
}

/* Mono data */
.mono { font-family: 'JetBrains Mono', monospace; }

/* Content z-index wrapper */
.gl-content { position: relative; z-index: 1; }
`;

export const SCORE_COLORS = {
  bad:    { bg:"rgba(220,100,100,0.15)",  text:"#c04040", border:"rgba(220,100,100,0.3)"  },
  warn:   { bg:"rgba(245,158,11,0.12)",   text:"#b87a1a", border:"rgba(245,158,11,0.25)"  },
  ok:     { bg:"rgba(212,168,199,0.2)",   text:"#8b5a7a", border:"rgba(212,168,199,0.35)" },
  good:   { bg:"rgba(168,197,184,0.2)",   text:"#4a7a64", border:"rgba(168,197,184,0.35)" },
  great:  { bg:"rgba(197,184,232,0.2)",   text:"#6a5aaa", border:"rgba(197,184,232,0.35)" },
};

export function scoreTheme(val) {
  if (val < 50) return SCORE_COLORS.bad;
  if (val < 65) return SCORE_COLORS.warn;
  if (val < 78) return SCORE_COLORS.ok;
  if (val < 88) return SCORE_COLORS.good;
  return SCORE_COLORS.great;
}

export const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#e8a4b8,#c9748e)",
  "linear-gradient(135deg,#c5b8e8,#9b8ed4)",
  "linear-gradient(135deg,#a8c5b8,#6a9a88)",
  "linear-gradient(135deg,#f2c4d0,#d4879a)",
  "linear-gradient(135deg,#d4a8c7,#b07898)",
  "linear-gradient(135deg,#b8d4e8,#7aa8c8)",
  "linear-gradient(135deg,#e8c4a8,#c89878)",
  "linear-gradient(135deg,#c4e8c4,#88b888)",
];
