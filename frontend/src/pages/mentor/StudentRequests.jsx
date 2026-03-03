/**
 * StudentRequests.jsx — Incoming session requests from students
 * Accept / decline, view doubt description, pick time slot
 */
import { useState } from "react";

import { useApp } from "../../context/AppContext";

const INITIAL_REQUESTS = [
  { id: 1, student: "Ananya R.", avatar: "A", grad: "from-pink-500 to-rose-500", class: "Class 10", subject: "Mathematics", topic: "Quadratic Equations", doubt: "I don't understand how to find the nature of roots using the discriminant. My board exams are in 2 weeks and this is really important.", preferredTime: "Weekday evenings 5–7 PM", language: "Hindi", urgency: "high", requestedAt: "2 min ago" },
  { id: 2, student: "Karan V.",  avatar: "K", grad: "from-blue-500 to-indigo-600", class: "Class 9", subject: "Science", topic: "Gravitation", doubt: "I'm confused about the difference between g and G — why does g change at different heights but G doesn't? I've read the chapter 3 times and still don't get it.", preferredTime: "Saturday 10 AM–12 PM", language: "English", urgency: "medium", requestedAt: "15 min ago" },
  { id: 3, student: "Riya S.",   avatar: "R", grad: "from-violet-500 to-purple-600", class: "Class 11", subject: "Mathematics", topic: "Trigonometry", doubt: "How do I prove trigonometric identities? I always get lost halfway through the proof. Can you show me a systematic approach?", preferredTime: "Any time this weekend", language: "English", urgency: "low", requestedAt: "1 hr ago" },
  { id: 4, student: "Yash M.",   avatar: "Y", grad: "from-teal-500 to-cyan-600", class: "Class 8", subject: "Science", topic: "Photosynthesis", doubt: "My teacher explained photosynthesis but I can't remember the steps in order. Can you make it easy to remember?", preferredTime: "Today evening", language: "Marathi", urgency: "high", requestedAt: "3 hr ago" },
];

const URGENCY = {
  high:   { label: "Urgent", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  medium: { label: "This week", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  low:    { label: "Flexible", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
};

export default function StudentRequests() {
  const { dark } = useApp();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [accepted, setAccepted] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const bg    = dark ? "bg-slate-950" : "bg-slate-50";
  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-200";

  const accept  = (id) => { setAccepted(a => [...a, requests.find(r => r.id === id)]); setRequests(r => r.filter(x => x.id !== id)); };
  const decline = (id) => { setDeclined(d => [...d, requests.find(r => r.id === id)]); setRequests(r => r.filter(x => x.id !== id)); };

  const RequestCard = ({ req, showActions = true }) => {
    const urg = URGENCY[req.urgency];
    const isExpanded = expanded === req.id;

    return (
      <div className={`rounded-2xl border ${card} overflow-hidden`}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${req.grad} flex items-center justify-center text-white font-black text-lg shrink-0`}>
              {req.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`font-bold text-sm ${text}`}>{req.student}</span>
                <span className={`text-xs ${muted}`}>·</span>
                <span className={`text-xs font-semibold ${muted}`}>{req.class}</span>
                {/* Urgency */}
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: urg.bg, color: urg.color }}>
                  {urg.label}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-sky-900/40 text-sky-300" : "bg-sky-50 text-sky-600"}`}>{req.subject}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{req.topic}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>🗣 {req.language}</span>
              </div>
              {/* Doubt preview */}
              <p className={`text-xs leading-relaxed ${muted} ${!isExpanded ? "line-clamp-2" : ""}`}>{req.doubt}</p>
              {req.doubt.length > 100 && (
                <button onClick={() => setExpanded(isExpanded ? null : req.id)}
                  className={`text-xs font-bold mt-1 ${dark ? "text-sky-400" : "text-sky-600"}`}>
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
            <div className={`text-xs ${muted} shrink-0`}>{req.requestedAt}</div>
          </div>

          {isExpanded && (
            <div className={`mt-4 px-4 py-3 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
              <p className={`text-xs font-bold mb-1 ${muted}`}>Preferred time</p>
              <p className={`text-sm font-semibold ${text}`}>📅 {req.preferredTime}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className={`flex gap-3 px-5 py-4 border-t ${divider}`}>
            <button onClick={() => accept(req.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-sky-500/20">
              ✓ Accept Request
            </button>
            <button onClick={() => decline(req.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all hover:-translate-y-0.5 ${dark ? "border-red-800 text-red-400 hover:bg-red-900/20" : "border-red-200 text-red-500 hover:bg-red-50"}`}>
              Decline
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
   
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`font-display text-3xl italic mb-1 ${text}`}>🔔 Student Requests</h1>
              <p className={`text-sm ${muted}`}>Students asking for your help — accept to schedule a session</p>
            </div>
            {requests.length > 0 && (
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-black">
                {requests.length}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className={`flex gap-1 border-b mb-6 ${divider}`}>
            {[
              { id: "pending",  label: `Pending (${requests.length})` },
              { id: "accepted", label: `Accepted (${accepted.length})` },
              { id: "declined", label: `Declined (${declined.length})` },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs font-bold border-b-2 -mb-px transition-all ${
                  activeTab === tab.id
                    ? "border-sky-500 text-sky-400"
                    : `border-transparent ${muted}`
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pending */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className={`rounded-2xl border p-12 text-center ${card}`}>
                  <div className="text-4xl mb-3">🎉</div>
                  <p className={`font-bold ${text}`}>All caught up!</p>
                  <p className={`text-sm ${muted}`}>No pending requests right now</p>
                </div>
              ) : requests.map(req => <RequestCard key={req.id} req={req} showActions />)}
            </div>
          )}

          {/* Accepted */}
          {activeTab === "accepted" && (
            <div className="space-y-4">
              {accepted.length === 0 ? (
                <div className={`rounded-2xl border p-12 text-center ${card}`}>
                  <p className={`font-bold ${text}`}>No accepted requests yet</p>
                </div>
              ) : accepted.map(req => (
                <div key={req.id} className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>
                      ✓ Accepted
                    </span>
                  </div>
                  <RequestCard req={req} showActions={false} />
                </div>
              ))}
            </div>
          )}

          {/* Declined */}
          {activeTab === "declined" && (
            <div className="space-y-4 opacity-60">
              {declined.length === 0 ? (
                <div className={`rounded-2xl border p-12 text-center ${card}`}>
                  <p className={`font-bold ${text}`}>No declined requests</p>
                </div>
              ) : declined.map(req => <RequestCard key={req.id} req={req} showActions={false} />)}
            </div>
          )}
        </div>
      </div>
    
  );
}