import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useConn } from "../../context/ConnContext";

/* ─────────── Nav link definitions ─────────── */
const STUDENT_NAV = [
  { label: "Dashboard",   path: "/student/dashboard",   icon: "🏠" },
  { label: "AI Tutor",    path: "/student/ai-tutor",    icon: "🤖" },
  { label: "Study Plan",  path: "/student/study-plan",  icon: "📅" },
  { label: "Quiz",        path: "/student/quiz",        icon: "📝" },
  { label: "Forum",       path: "/student/forum",       icon: "💬" },
  { label: "Mentors",     path: "/student/mentors",     icon: "⭐" },
  { label: "Credentials", path: "/student/credentials", icon: "🏅" },
  { label: "Resume",      path: "/student/resume",      icon: "📄" },
  { label: "Employers",   path: "/student/employers",   icon: "💼" },
];

const TEACHER_NAV = [
  { label: "Dashboard",   path: "/teacher/dashboard",   icon: "🏠" },
  { label: "Assessments", path: "/teacher/assessment",  icon: "📋" },
  { label: "Analytics",   path: "/teacher/analytics",   icon: "📊" },
  { label: "Resources",   path: "/teacher/resources",   icon: "📚" },
];

const MENTOR_NAV = [
  { label: "Dashboard",   path: "/mentor/dashboard",    icon: "🏠" },
  { label: "My Profile",  path: "/mentor/profile",      icon: "⭐" },
  { label: "Sessions",    path: "/mentor/sessions",     icon: "📅" },
  { label: "Earnings",    path: "/mentor/earnings",     icon: "💰" },
  { label: "Requests",    path: "/mentor/requests",     icon: "🔔" },
  { label: "Credentials", path: "/mentor/credentials",  icon: "🏅" },
];

function getNav(role) {
  if (role === "teacher") return TEACHER_NAV;
  if (role === "mentor")  return MENTOR_NAV;
  return STUDENT_NAV;
}

/* ─────────── CSS ─────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .sb-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Panel ── */
  .sb-panel {
    width: 230px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    transition: background 0.3s ease, border-color 0.3s ease;
  }
  .sb-panel.dark  {
    background: #0B1525;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .sb-panel.light {
    background: #FFFFFF;
    border-right: 1px solid #EEF0F3;
  }

  /* ── Logo area ── */
  .sb-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px 14px;
    flex-shrink: 0;
  }
  .sb-logo-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, #38BDF8, #1D6FA8);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 900; color: white;
    flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .sb-logo-name {
    font-size: 14px;
    font-weight: 800;
    line-height: 1.1;
  }
  .dark  .sb-logo-name { color: #F0EBE3; }
  .light .sb-logo-name { color: #111827; }
  .sb-logo-role {
    font-size: 11px;
    font-weight: 500;
    text-transform: capitalize;
    line-height: 1;
    margin-top: 2px;
  }
  .dark  .sb-logo-role { color: #3D4F6A; }
  .light .sb-logo-role { color: #9CA3AF; }

  /* ── Conn pill ── */
  .sb-conn {
    margin: 0 10px 6px;
    padding: 7px 11px;
    border-radius: 10px;
    font-size: 11.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .sb-conn.c4g.dark    { background: rgba(34,197,94,0.1);  color: #4ADE80; }
  .sb-conn.c4g.light   { background: rgba(34,197,94,0.08); color: #16A34A; }
  .sb-conn.c2g.dark    { background: rgba(234,179,8,0.1);  color: #FDE047; }
  .sb-conn.c2g.light   { background: rgba(234,179,8,0.08); color: #A16207; }
  .sb-conn.coff.dark   { background: rgba(239,68,68,0.1);  color: #F87171; }
  .sb-conn.coff.light  { background: rgba(239,68,68,0.08); color: #B91C1C; }
  .sb-conn-sync { margin-left: auto; opacity: 0.55; font-size: 10px; }

  /* ── Nav ── */
  .sb-nav {
    flex: 1;
    padding: 4px 8px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .sb-nav::-webkit-scrollbar { width: 3px; }
  .sb-nav::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.15); border-radius: 2px; }

  .sb-link {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 12px;
    border-radius: 11px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: background 0.18s ease, color 0.18s ease;
    position: relative;
    white-space: nowrap;
  }
  .sb-link-icon { font-size: 15px; flex-shrink: 0; }
  .sb-link-dot {
    margin-left: auto;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #38BDF8;
    flex-shrink: 0;
  }

  /* active state */
  .dark  .sb-link.active {
    background: rgba(56,189,248,0.12);
    color: #7DD3FC;
  }
  .light .sb-link.active {
    background: rgba(56,189,248,0.1);
    color: #0369A1;
  }

  /* inactive state */
  .dark  .sb-link:not(.active) { color: #3D4F6A; }
  .light .sb-link:not(.active) { color: #6B7280; }
  .dark  .sb-link:not(.active):hover { background: rgba(255,255,255,0.04); color: #94A3B8; }
  .light .sb-link:not(.active):hover { background: rgba(0,0,0,0.04);       color: #111827; }

  /* ── Divider ── */
  .sb-divider {
    height: 1px;
    margin: 4px 10px;
    flex-shrink: 0;
  }
  .dark  .sb-divider { background: rgba(255,255,255,0.05); }
  .light .sb-divider { background: rgba(0,0,0,0.06); }

  /* ── Bottom ── */
  .sb-bottom {
    padding: 8px;
    flex-shrink: 0;
  }

  .sb-theme {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    background: transparent;
    cursor: pointer;
    margin-bottom: 5px;
    transition: background 0.18s ease, color 0.18s ease;
  }
  .dark  .sb-theme { color: #3D4F6A; }
  .light .sb-theme { color: #9CA3AF; }
  .dark  .sb-theme:hover { background: rgba(255,255,255,0.04); color: #94A3B8; }
  .light .sb-theme:hover { background: rgba(0,0,0,0.04);       color: #374151; }

  .sb-user {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 11px;
    border-radius: 12px;
  }
  .dark  .sb-user { background: rgba(255,255,255,0.04); }
  .light .sb-user { background: rgba(0,0,0,0.04); }

  .sb-user-avatar {
    width: 30px; height: 30px; border-radius: 9px;
    background: linear-gradient(135deg, #D97706, #F59E0B);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; color: white;
    flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .sb-user-name {
    font-size: 12.5px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dark  .sb-user-name { color: #F0EBE3; }
  .light .sb-user-name { color: #111827; }
  .sb-user-role {
    font-size: 10.5px;
    font-weight: 500;
    text-transform: capitalize;
  }
  .dark  .sb-user-role { color: #3D4F6A; }
  .light .sb-user-role { color: #9CA3AF; }

  .sb-logout {
    margin-left: auto;
    background: none; border: none;
    cursor: pointer; font-size: 13px;
    padding: 3px; border-radius: 6px;
    opacity: 0.4;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
  }
  .sb-logout:hover { opacity: 0.8; }

  /* ── Main content ── */
  .sb-main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 0;
  }
  .dark  .sb-main { background: #070F1C; }
  .light .sb-main { background: #F8F9FB; }

  /* ── Mobile hamburger button ── */
  .sb-ham {
    display: none;
    position: fixed;
    top: 14px; left: 14px;
    z-index: 60;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: none; cursor: pointer;
    align-items: center; justify-content: center;
    font-size: 17px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .dark  .sb-ham { background: #0B1525; color: #94A3B8; }
  .light .sb-ham { background: #FFFFFF; color: #374151; }

  .sb-overlay {
    position: fixed; inset: 0; z-index: 40;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
  }
  .sb-drawer {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 50;
    width: 230px;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .sb-panel  { display: none; }
    .sb-ham    { display: flex; }
  }
`;

/* ─────────── Component ─────────── */
export default function Sidebar({ children }) {
  const { user, logout, dark, toggleDark } = useApp();
  const { conn, pendingSync } = useConn();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role  = user?.role || "student";
  const nav   = getNav(role);
  const theme = dark ? "dark" : "light";

  // conn class
  const connClass = conn === "2g" ? "c2g" : conn === "offline" ? "coff" : "c4g";
  const connDot   = conn === "2g" ? "🟡" : conn === "offline" ? "🔴" : "🟢";
  const connLabel = conn === "2g" ? "2G — Lite" : conn === "offline" ? "Offline" : "4G Online";

  const handleLogout = () => {
    logout();
    navigate("/role");
  };

  /* ── Single nav link button ── */
  function NavLink({ item }) {
    const active = location.pathname === item.path;
    return (
      <button
        className={`sb-link ${theme} ${active ? "active" : ""}`}
        onClick={() => { navigate(item.path); setMobileOpen(false); }}
      >
        <span className="sb-link-icon">{item.icon}</span>
        {item.label}
        {active && <span className="sb-link-dot" />}
      </button>
    );
  }

  /* ── The actual sidebar panel — reused for desktop + mobile drawer ── */
  function Panel() {
    return (
      <div className={`sb-panel ${theme}`}>

        {/* Logo */}
        <div className="sb-logo">
          <div className="sb-logo-icon">P</div>
          <div>
            <div className="sb-logo-name">PathwayAI</div>
            <div className="sb-logo-role">{role} portal</div>
          </div>
        </div>

        {/* Connectivity indicator */}
        <div className={`sb-conn ${connClass} ${theme}`}>
          <span>{connDot}</span>
          {connLabel}
          {pendingSync > 0 && (
            <span className="sb-conn-sync">{pendingSync} pending</span>
          )}
        </div>

        {/* Nav links */}
        <nav className="sb-nav">
          {nav.map(item => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="sb-divider" />

        {/* Bottom: theme + user */}
        <div className="sb-bottom">
          <button className={`sb-theme ${theme}`} onClick={toggleDark}>
            {dark ? "☀️  Light Mode" : "🌙  Dark Mode"}
          </button>

          <div className="sb-user">
            <div className="sb-user-avatar">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb-user-name">{user?.name || "User"}</div>
              <div className="sb-user-role">{role}</div>
            </div>
            <button className="sb-logout" onClick={handleLogout} title="Log out">
              ⏻
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className={`sb-shell ${theme}`}>

        {/* Desktop sidebar — hidden on mobile via CSS */}
        <Panel />

        {/* Mobile: floating hamburger */}
        <button
          className={`sb-ham ${theme}`}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>

        {/* Mobile: overlay + drawer */}
        {mobileOpen && (
          <>
            <div className="sb-overlay" onClick={() => setMobileOpen(false)} />
            <div className="sb-drawer">
              <Panel />
            </div>
          </>
        )}

        {/* Page content */}
        <main className={`sb-main ${theme}`}>
          {children}
        </main>

      </div>
    </>
  );
}