/**
 * Sidebar.jsx — Navigation sidebar + ConnBar + role indicator
 * Shared across all student/teacher/mentor pages.
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useConn } from "../../context/ConnContext";

const STUDENT_NAV = [
  { label: "Dashboard",    path: "/student/dashboard",   icon: "🏠" },
  { label: "AI Tutor",     path: "/student/ai-tutor",    icon: "🤖" },
  { label: "Study Plan",   path: "/student/study-plan",  icon: "📅" },
  { label: "Quiz",         path: "/student/quiz",        icon: "📝" },
  { label: "Forum",        path: "/student/forum",       icon: "💬" },
  { label: "Mentors",      path: "/student/mentors",     icon: "⭐" },
  { label: "Credentials",  path: "/student/credentials", icon: "🏅" },
  { label: "Resume",       path: "/student/resume",      icon: "📄" },
  { label: "Employers",    path: "/student/employers",   icon: "💼" },
];

const TEACHER_NAV = [
  { label: "Dashboard",    path: "/teacher/dashboard",   icon: "🏠" },
  { label: "Assessments",  path: "/teacher/assessment",  icon: "📋" },
  { label: "Analytics",    path: "/teacher/analytics",   icon: "📊" },
  { label: "Resources",    path: "/teacher/resources",   icon: "📚" },
];

const MENTOR_NAV = [
  { label: "Dashboard",    path: "/mentor/dashboard",    icon: "🏠" },
];

function getNav(role) {
  if (role === "teacher") return TEACHER_NAV;
  if (role === "mentor") return MENTOR_NAV;
  return STUDENT_NAV;
}

const CONN_STYLES = {
  "4g":      { label: "4G Online",  bg: "bg-emerald-500", dot: "🟢" },
  "2g":      { label: "2G — Lite",  bg: "bg-yellow-500",  dot: "🟡" },
  "offline": { label: "Offline",    bg: "bg-red-500",      dot: "🔴" },
};

export default function Sidebar({ children }) {
  const { user, logout, dark, toggleDark } = useApp();
  const { conn, pendingSync } = useConn();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || "student";
  const nav = getNav(role);
  const connStyle = CONN_STYLES[conn] || CONN_STYLES["4g"];

  const handleLogout = () => {
    logout();
    navigate("/role");
  };

  const NavLink = ({ item }) => {
    const active = location.pathname === item.path;
    return (
      <button
        onClick={() => { navigate(item.path); setMobileOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-200 ${
          active
            ? (dark ? "bg-sky-600/25 text-sky-300 border border-sky-700/50" : "bg-sky-100 text-sky-700 border border-sky-200")
            : (dark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
        }`}
      >
        <span className="text-base">{item.icon}</span>
        {item.label}
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${dark ? "bg-slate-900 border-r border-slate-800" : "bg-white border-r border-slate-200"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-200"}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-black text-sm">P</div>
        <div>
          <div className={`font-bold text-sm leading-tight ${dark ? "text-white" : "text-slate-800"}`}>PathwayAI</div>
          <div className={`text-xs capitalize font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>{role} Portal</div>
        </div>
      </div>

      {/* Conn bar */}
      <div className={`mx-3 mt-3 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold ${
        conn === "4g" ? (dark ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-50 text-emerald-700") :
        conn === "2g" ? (dark ? "bg-yellow-900/40 text-yellow-300" : "bg-yellow-50 text-yellow-700") :
                         (dark ? "bg-red-900/40 text-red-300" : "bg-red-50 text-red-700")
      }`}>
        <span>{connStyle.dot}</span>
        {connStyle.label}
        {pendingSync > 0 && <span className="ml-auto opacity-70">{pendingSync} to sync</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => <NavLink key={item.path} item={item} />)}
      </nav>

      {/* Bottom — user + theme */}
      <div className={`px-3 pb-4 space-y-2 border-t pt-3 ${dark ? "border-slate-800" : "border-slate-200"}`}>
        {/* Theme toggle */}
        <button onClick={toggleDark}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${dark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* User card */}
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold truncate ${dark ? "text-white" : "text-slate-800"}`}>{user?.name || "Student"}</div>
            <div className={`text-xs truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{user?.language || "Hindi"}</div>
          </div>
          <button onClick={handleLogout} className={`text-xs ${dark ? "text-slate-600 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`} title="Logout">⏻</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile: hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={`fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${dark ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}
        >
          ☰
        </button>
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 z-50 w-64">
              <SidebarContent />
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}