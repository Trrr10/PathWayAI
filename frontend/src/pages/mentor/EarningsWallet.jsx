/**
 * EarningsWallet.jsx — Mentor earnings, UPI payouts, tier progress
 */
import { useState } from "react";

import { useApp } from "../../context/AppContext";

const TRANSACTIONS = [
  { id: "TXN001", student: "Priya M.",  subject: "Science",     date: "Nov 28", amount: 100, status: "paid",    utr: "UTR934821" },
  { id: "TXN002", student: "Meera S.",  subject: "Mathematics", date: "Nov 25", amount: 130, status: "paid",    utr: "UTR821043" },
  { id: "TXN003", student: "Dev R.",    subject: "Mathematics", date: "Nov 23", amount: 100, status: "paid",    utr: "UTR712389" },
  { id: "TXN004", student: "Aisha K.",  subject: "Science",     date: "Nov 20", amount: 80,  status: "paid",    utr: "UTR601234" },
  { id: "TXN005", student: "Rahul K.",  subject: "Mathematics", date: "Today",  amount: 100, status: "pending", utr: null },
  { id: "TXN006", student: "Sneha P.",  subject: "Physics",     date: "Tomorrow", amount: 120, status: "upcoming", utr: null },
];

const TIERS = [
  { label: "Bronze", icon: "🏅", color: "#CD7F32", min: 0,   max: 50,  sessions: 12, perks: ["₹50–₹100/session", "Profile badge", "Basic analytics"] },
  { label: "Silver", icon: "🥈", color: "#94A3B8", min: 50,  max: 150, sessions: 0,  perks: ["₹80–₹150/session", "Priority matching", "Teacher endorsements", "Advanced analytics"] },
  { label: "Gold",   icon: "🥇", color: "#F59E0B", min: 150, max: 500, sessions: 0,  perks: ["₹100–₹200/session", "Featured profile", "Direct employer visibility", "Dedicated support"] },
];

export default function EarningsWallet() {
  const { dark } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [upiId, setUpiId] = useState("kavya.nair@upi");
  const [editUpi, setEditUpi] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawDone, setWithdrawDone] = useState(false);

  const bg    = dark ? "bg-slate-950" : "bg-slate-50";
  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-slate-800" : "border-slate-200";

  const totalEarned  = 2400;
  const available    = 410;
  const withdrawn    = 1990;
  const currentTier  = TIERS[0];
  const nextTier     = TIERS[1];
  const sessionsLeft = nextTier.min - currentTier.sessions;
  const pct = (currentTier.sessions / nextTier.min) * 100;

  const handleWithdraw = () => {
    if (!withdrawAmt || isNaN(withdrawAmt)) return;
    setWithdrawDone(true);
    setTimeout(() => setWithdrawDone(false), 3000);
    setWithdrawAmt("");
  };

  return (
  
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className={`font-display text-3xl italic mb-1 ${text}`}>💰 Earnings & Wallet</h1>
            <p className={`text-sm ${muted}`}>Track your income, manage payouts, and level up your tier</p>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Earned",  val: `₹${totalEarned.toLocaleString()}`, icon: "💰", color: "#22C55E" },
              { label: "Available",     val: `₹${available}`,  icon: "💳", color: "#38BDF8" },
              { label: "Withdrawn",     val: `₹${withdrawn.toLocaleString()}`,  icon: "✅", color: "#8B5CF6" },
              { label: "This Month",    val: "₹410",  icon: "📈", color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-5 ${card}`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className={`text-xs font-semibold mt-0.5 ${muted}`}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className={`flex gap-1 border-b mb-6 ${divider}`}>
            {["overview", "withdraw", "history", "tiers"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold capitalize border-b-2 -mb-px transition-all ${
                  activeTab === tab
                    ? "border-green-500 text-green-400"
                    : `border-transparent ${muted}`
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Tier progress */}
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{currentTier.icon}</span>
                      <span className={`font-black ${text}`}>{currentTier.label} Mentor</span>
                    </div>
                    <p className={`text-xs ${muted}`}>
                      {sessionsLeft} more sessions to reach {nextTier.icon} {nextTier.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${muted}`}>{currentTier.sessions} / {nextTier.min}</div>
                    <div className="text-xs text-amber-400 font-bold">sessions</div>
                  </div>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                    style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-bold" style={{ color: currentTier.color }}>{currentTier.label}</span>
                  <span className="text-xs font-bold" style={{ color: nextTier.color }}>{nextTier.label}</span>
                </div>
              </div>

              {/* UPI info */}
              <div className={`rounded-2xl border p-5 ${card}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold text-sm ${text}`}>Payout Account</h3>
                  <button onClick={() => setEditUpi(e => !e)}
                    className={`text-xs font-bold ${dark ? "text-sky-400" : "text-sky-600"} hover:underline`}>
                    {editUpi ? "Save" : "Edit"}
                  </button>
                </div>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                  <span className="text-xl">📱</span>
                  {editUpi ? (
                    <input value={upiId} onChange={e => setUpiId(e.target.value)}
                      onBlur={() => setEditUpi(false)}
                      className={`flex-1 bg-transparent text-sm outline-none font-semibold ${text}`}
                      autoFocus />
                  ) : (
                    <span className={`flex-1 text-sm font-semibold ${text}`}>{upiId}</span>
                  )}
                  <span className="text-xs text-green-400 font-bold">✓ Verified</span>
                </div>
                <p className={`text-xs mt-2 ${muted}`}>88% payout rate · Transfers within 24 hours</p>
              </div>

              {/* Recent transactions */}
              <div className={`rounded-2xl border ${card}`}>
                <div className={`px-5 py-4 border-b ${divider}`}>
                  <h3 className={`font-bold text-sm ${text}`}>Recent Transactions</h3>
                </div>
                <div className="divide-y" style={{ borderColor: dark ? "#1e293b" : "#f1f5f9" }}>
                  {TRANSACTIONS.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        t.status === "paid" ? "bg-green-500/20 text-green-400" :
                        t.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {t.status === "paid" ? "✓" : t.status === "pending" ? "⏳" : "📅"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold ${text}`}>{t.student} · {t.subject}</div>
                        <div className={`text-xs ${muted}`}>{t.date} {t.utr ? `· ${t.utr}` : ""}</div>
                      </div>
                      <div className={`text-sm font-black ${t.status === "paid" ? "text-green-400" : t.status === "pending" ? "text-amber-400" : muted}`}>
                        {t.status === "paid" ? "+" : ""}₹{t.amount}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`px-5 py-3 border-t ${divider}`}>
                  <button onClick={() => setActiveTab("history")}
                    className={`text-xs font-bold ${dark ? "text-sky-400" : "text-sky-600"} hover:underline`}>
                    View full history →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Withdraw ── */}
          {activeTab === "withdraw" && (
            <div className="space-y-5 max-w-sm">
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">💳</div>
                  <div className={`text-3xl font-black text-green-400`}>₹{available}</div>
                  <div className={`text-sm ${muted}`}>Available to withdraw</div>
                </div>

                {withdrawDone ? (
                  <div className="text-center p-5 rounded-2xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-green-400 font-bold text-sm">Withdrawal initiated!</p>
                    <p className={`text-xs mt-1 ${muted}`}>Will arrive in {upiId} within 24 hours</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className={`block text-xs font-bold mb-2 ${muted}`}>Amount (₹)</label>
                      <input
                        type="number" placeholder={`Max ₹${available}`}
                        value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none font-semibold ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                      />
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                      <span>📱</span>
                      <span className={`text-sm font-semibold ${text}`}>{upiId}</span>
                    </div>
                    <button onClick={handleWithdraw}
                      disabled={!withdrawAmt}
                      className="w-full py-3.5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:-translate-y-0.5 transition-all disabled:opacity-40 shadow-lg shadow-green-500/25">
                      Withdraw to UPI →
                    </button>
                    <p className={`text-xs text-center mt-3 ${muted}`}>88% payout · ₹{Math.round(Number(withdrawAmt || 0) * 0.88)} after platform fee</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── History ── */}
          {activeTab === "history" && (
            <div className={`rounded-2xl border ${card}`}>
              <div className={`px-5 py-4 border-b ${divider} flex items-center justify-between`}>
                <h3 className={`font-bold text-sm ${text}`}>All Transactions</h3>
                <span className={`text-xs ${muted}`}>{TRANSACTIONS.length} records</span>
              </div>
              <div className="divide-y" style={{ borderColor: dark ? "#1e293b" : "#f1f5f9" }}>
                {TRANSACTIONS.map((t, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      t.status === "paid" ? "bg-green-500/20 text-green-400" :
                      t.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      "bg-slate-700 text-slate-400"
                    }`}>
                      {t.status === "paid" ? "✓" : t.status === "pending" ? "⏳" : "📅"}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${text}`}>{t.student} · {t.subject}</div>
                      <div className={`text-xs ${muted}`}>{t.id} · {t.date}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-black ${t.status === "paid" ? "text-green-400" : t.status === "pending" ? "text-amber-400" : muted}`}>
                        ₹{t.amount}
                      </div>
                      {t.utr && <div className={`text-xs ${muted}`}>{t.utr}</div>}
                      {!t.utr && <div className={`text-xs font-bold ${t.status === "pending" ? "text-amber-400" : muted}`}>{t.status}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tiers ── */}
          {activeTab === "tiers" && (
            <div className="space-y-4">
              {TIERS.map((tier, i) => {
                const isCurrent = tier.label === "Bronze";
                return (
                  <div key={i} className={`rounded-2xl border p-6 ${card} ${isCurrent ? "" : "opacity-60"}`}
                    style={isCurrent ? { borderColor: `${tier.color}50`, boxShadow: `0 0 24px ${tier.color}15` } : {}}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{tier.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg" style={{ color: tier.color }}>{tier.label}</span>
                          {isCurrent && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${tier.color}20`, color: tier.color }}>Current</span>}
                        </div>
                        <div className={`text-xs ${muted}`}>{tier.min}–{tier.max} sessions required</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {tier.perks.map(p => (
                        <div key={p} className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: tier.color }}>✓</span>
                          <span className={`text-xs ${muted}`}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
   
  );
}