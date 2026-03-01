// MentorMarketplace.jsx
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";
import { mentorData } from "../../data/allData";

export default function MentorMarketplace() {
  const { dark } = useApp();
  const [filter, setFilter] = useState("All");
  const [booking, setBooking] = useState(null);

  const subjects = ["All", "Mathematics", "Science", "History"];
  const filtered = filter === "All" ? mentorData : mentorData.filter(m => m.subject === filter);

  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  const BADGE_COLOR = { Gold: "#F59E0B", Silver: "#94A3B8", Bronze: "#CD7F32" };

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-5xl mx-auto">
          <h1 className={`font-display text-3xl italic mb-2 ${text}`}>⭐ Mentor Marketplace</h1>
          <p className={`text-sm ${muted} mb-6`}>Book 1-on-1 sessions with top-performing students. ₹50–₹150/session, UPI payout within 48h.</p>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {subjects.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                  filter === s
                    ? "bg-sky-600 border-sky-600 text-white"
                    : (dark ? "border-slate-700 text-slate-400 hover:border-sky-700 hover:text-sky-300" : "border-slate-300 text-slate-500 hover:border-sky-400")
                }`}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(mentor => (
              <div key={mentor.id} className={`rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-xl ${card}`}>
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mentor.gradient} flex items-center justify-center text-white text-lg font-black shrink-0`}>
                    {mentor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold truncate ${text}`}>{mentor.name}</div>
                    <div className={`text-xs ${muted}`}>{mentor.location}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${BADGE_COLOR[mentor.badge]}25`, color: BADGE_COLOR[mentor.badge] }}>
                        {mentor.badge} Mentor
                      </span>
                      {mentor.endorsedByTeacher && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-teal-900/40 text-teal-300" : "bg-teal-100 text-teal-700"}`}>Teacher ✓</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`text-sm leading-relaxed mb-3 ${muted}`}>{mentor.bio}</div>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-sm font-black text-amber-400`}>★ {mentor.rating}</div>
                    <div className={`text-xs ${muted}`}>Rating</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-black ${text}`}>{mentor.sessions}</div>
                    <div className={`text-xs ${muted}`}>Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-black text-emerald-400`}>₹{mentor.price}</div>
                    <div className={`text-xs ${muted}`}>per session</div>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.language.map(l => (
                    <span key={l} className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{l}</span>
                  ))}
                </div>

                <button
                  onClick={() => setBooking(mentor)}
                  disabled={!mentor.available}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                    mentor.available
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:-translate-y-0.5"
                      : (dark ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed")
                  }`}>
                  {mentor.available ? "Book Session →" : "Not Available"}
                </button>
              </div>
            ))}
          </div>

          {/* Booking modal */}
          {booking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className={`w-full max-w-sm rounded-3xl border p-6 ${card}`}>
                <h2 className={`font-bold text-lg mb-1 ${text}`}>Book {booking.name}</h2>
                <p className={`text-xs ${muted} mb-4`}>{booking.subSubject}</p>
                <div className={`p-4 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-50"} mb-4`}>
                  <div className={`flex justify-between text-sm ${text}`}>
                    <span>Session fee</span><span className="font-bold">₹{booking.price}</span>
                  </div>
                  <div className={`flex justify-between text-xs ${muted} mt-1`}>
                    <span>Platform fee (12%)</span><span>-₹{Math.round(booking.price * 0.12)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl text-sm"
                    onClick={() => { alert("Booking confirmed! (Backend integration coming soon)"); setBooking(null); }}>
                    Confirm Booking
                  </button>
                  <button onClick={() => setBooking(null)}
                    className={`flex-1 font-bold py-3 rounded-xl text-sm border ${dark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-600"}`}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}