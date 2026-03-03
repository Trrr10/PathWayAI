/**
 * App.jsx — PathwayAI Root Router
 * FIXED: All routes correctly mapped with unique paths.
 */

import { Routes, Route, Navigate } from "react-router-dom";

// Landing + Auth
import LandingPage from "./pages/auth/LandingPage";
import RolePortal  from "./pages/auth/RolePortal";
import AuthPage    from "./pages/auth/AuthPage";

// Student
import Dashboard        from "./pages/student/Dashboard";
import AITutor          from "./pages/student/AITutor";
import StudyPlan        from "./pages/student/StudyPlan";
import Quiz             from "./pages/student/Quiz";
import Forum            from "./pages/student/Forum";
import MentorMarketplace from "./pages/student/MentorMarketplace";
import Credentials      from "./pages/student/Credentials";
import ResumeBuilder    from "./pages/student/ResumeBuilder";
import Employers        from "./pages/student/Employers";
import AnimatedLessons from "./pages/student/AnimatedLessons";

// Teacher
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AssessmentGenerator from "./pages/teacher/AssessmentGenerator";
import Analytics from "./pages/teacher/Analytics";
import Resources from "./pages/teacher/Resources";
import VideoCall from "./pages/teacher/Videocall";
//Mentor
import MentorProfile from "./pages/mentor/Mentorprofile";
import EarningsWallet from "./pages/mentor/EarningsWallet";
import MyCredentials from "./pages/mentor/MyCredentials";
import SessionManager from "./pages/mentor/SessionManager";
import StudentRequests from "./pages/mentor/StudentRequests";
// Context
import { AppProvider }  from "./context/AppContext";
import { ConnProvider } from "./context/ConnContext";

export default function App() {
  return (
    <AppProvider>
      <ConnProvider>
        
          <Routes>
            {/* Landing page */}
            <Route path="/"     element={<LandingPage />} />

            {/* Role selection portal */}
            <Route path="/role" element={<RolePortal />} />

            {/* Auth — login & signup per role (student | teacher | mentor) */}
            <Route path="/login/:role"  element={<AuthPage mode="login" />} />
            <Route path="/signup/:role" element={<AuthPage mode="signup" />} />

            {/* Student routes */}
            <Route path="/student/dashboard"  element={<Dashboard />} />
            <Route path="/student/ai-tutor"   element={<AITutor />} />
            <Route path="/student/study-plan" element={<StudyPlan />} />
            <Route path="/student/quiz"       element={<Quiz />} />
            <Route path="/student/forum"      element={<Forum />} />
            <Route path="/student/mentors"    element={<MentorMarketplace />} />
            <Route path="/student/credentials" element={<Credentials />} />
            <Route path="/student/resume"     element={<ResumeBuilder />} />
            <Route path="/student/employers"  element={<Employers />} />
            <Route path="/student/lessons" element={<AnimatedLessons />} />
            
            {/* Teacher routes */}
           <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
           <Route path="/teacher/assessment" element={<AssessmentGenerator />} />
           <Route path="/teacher/analytics" element={<Analytics />} />
           <Route path="/teacher/resources" element={<Resources />} />
           <Route path="/teacher/videocall" element={<VideoCall />} />
           

            {/* Mentor routes */}
             <Route path="/mentor/dashboard" element={<MentorProfile />} />
            <Route path="/mentor/wallet" element={<EarningsWallet />} />
             <Route path="/mentor/credentials" element={<MyCredentials />} />
              <Route path="/mentor/session" element={<SessionManager />} />
               <Route path="/mentor/request" element={<StudentRequests />} />
            {/* Fallback — unknown routes go to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        
      </ConnProvider>
    </AppProvider>
  );
}