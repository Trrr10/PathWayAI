/**
 * App.jsx — PathwayAI Root Router
 * src/App.jsx
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import LandingPage  from "./pages/auth/LandingPage";
import RolePortal   from "./pages/auth/RolePortal";
import AuthPage     from "./pages/auth/AuthPage";
import Dashboard    from "./pages/student/Dashboard";
import AITutor      from "./pages/student/AITutor";
import Quiz         from "./pages/student/Quiz";
import Credentials  from "./pages/student/Credentials";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public */}
        <Route path="/"             element={<LandingPage />} />
        <Route path="/role"         element={<RolePortal />} />
        <Route path="/login/:role"  element={<AuthPage mode="login" />} />
        <Route path="/signup/:role" element={<AuthPage mode="signup" />} />

        {/* Student */}
        <Route path="/student/dashboard"    element={<Dashboard />} />
        <Route path="/student/ai-tutor"     element={<AITutor />} />
        <Route path="/student/quiz"         element={<Quiz />} />
        <Route path="/student/credentials"  element={<Credentials />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}