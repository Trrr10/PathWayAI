/**
 * MentorProfile.jsx — Rebuilt UI/UX
 * - Fixed all overlapping issues
 * - Proper spacing and layout
 * - Navigation to all mentor pages
 * src/pages/mentor/MentorProfile.jsx
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const REVIEWS = [
  { student:"Rahul K.",  avatar:"R", color:"#38BDF8", rating:5, subject:"Mathematics", text:"Kavya explained quadratic equations so clearly — I finally understood the discriminant! She stayed an extra 20 minutes just to make sure I got it.", date:"2 days ago" },
  { student:"Priya M.",  avatar:"P", color:"#14B8A6", rating:5, subject:"Science",     text:"Newton's laws session was amazing. She used cricket examples which made it click instantly. Would book again every week.", date:"5 days ago" },
  { student:"Arjun T.",  avatar:"A", color:"#8B5CF6", rating:4, subject:"Mathematics", text:"Very patient and thorough. Trigonometry was my biggest fear but not anymore. Clear explanations, good pace.", date:"1 week ago" },
  { student:"Meera S.",  avatar:"M", color:"#F97316", rating:5, subject:"Mathematics", text:"Best mentor on the platform. Explains step-by-step and checks understanding before moving on. 10/10.", date:"2 weeks ago" },
];

const SUBJECTS = [
  { name:"Mathematics", level:"Class 9–12", sessions:28, color:"#F59E0B", progress:85 },
  { name:"Physics",     level:"Class 9–10", sessions:8,  color:"#818CF8", progress:60 },
  { name:"Science",     level:"Class 6–8",  sessions:6,  color:"#34D399", progress:45 },
];

const BADGES = [
  { icon:"🏅", label:"Bronze Mentor", desc:"12 sessions completed", earned:true,  color:"#CD7F32" },
  { icon:"🥈", label:"Silver Mentor", desc:"50 sessions required",  earned:false, color:"#94A3B8" },
  { icon:"🥇", label:"Gold Mentor",   desc:"150 sessions required", earned:false, color:"#F59E0B" },
];

const TABS = [
  { id:"overview",    label:"Overview",    icon:"◈" },
  { id:"reviews",     label:"Reviews",     icon:"★" },
  { id:"subjects",    label:"Subjects",    icon:"◉" },
  { id:"credentials", label:"Credentials", icon:"⬡" },
];

/* ─── Quick nav cards to other mentor pages ─── */
const NAV_CARDS = [
  { icon:"📅", label:"Sessions",    sub:"Manage bookings",     path:"/mentor/session",     color:"#38BDF8" },
  { icon:"💰", label:"Earnings",    sub:"Wallet & payouts",    path:"/mentor/wallet",     color:"#22C55E" },
  { icon:"🔔", label:"Requests",    sub:"Pending students",    path:"/mentor/request",     color:"#F59E0B" },
  { icon:"🏅", label:"Credentials", sub:"Badges & certs",      path:"/mentor/credentials",  color:"#8B5CF6" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.mp-root{min-height:100vh;font-family:'DM Sans',sans-serif;}
.mp-root.dark {--bg:#070C18;--bg2:#0D1829;--card:rgba(13,24,42,0.98);--border:rgba(245,158,11,0.12);--text:#F0E6D3;--muted:#4B5568;--accent:#F59E0B;background:var(--bg);color:var(--text);}
.mp-root.light{--bg:#FDF8F0;--bg2:#FFF8ED;--card:rgba(255,255,255,0.98);--border:rgba(245,158,11,0.18);--text:#1C1008;--muted:#78716C;--accent:#D97706;background:var(--bg);color:var(--text);}

/* ── Cover — fixed height, no overlap ── */
.mp-cover{
  height:180px;width:100%;position:relative;overflow:hidden;flex-shrink:0;
  background:linear-gradient(135deg,#0A1628 0%,#132240 50%,#0A1628 100%);
}
.mp-cover-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(245,158,11,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.05) 1px,transparent 1px);background-size:28px 28px;}
.mp-cover-orb{position:absolute;border-radius:50%;filter:blur(48px);pointer-events:none;}
.mp-cover-bottom{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent);}

/* ── Profile header — sits BELOW cover ── */
.mp-header{
  padding:0 28px 20px;
  position:relative;
  z-index:2;
}
.mp-avatar-row{
  display:flex;align-items:flex-end;gap:18px;
  margin-top:-44px; /* pull avatar up to overlap cover slightly */
  margin-bottom:16px;
  flex-wrap:wrap;
}
.mp-avatar{
  width:88px;height:88px;border-radius:22px;flex-shrink:0;
  background:linear-gradient(135deg,#D97706,#F97316,#FBBF24);
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;font-size:32px;font-weight:900;color:white;
  box-shadow:0 8px 28px rgba(217,119,6,0.4);
  position:relative;z-index:3;
}
.dark  .mp-avatar{border:3px solid #070C18;}
.light .mp-avatar{border:3px solid #FDF8F0;}

.mp-name-block{padding-bottom:4px;flex:1;min-width:180px;}
.mp-name{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;line-height:1.2;margin-bottom:5px;}
.dark  .mp-name{color:#F0E6D3;}
.light .mp-name{color:#1C1008;}
.mp-sub{font-size:12.5px;color:var(--muted);}

.mp-edit-btn{
  padding:9px 18px;border-radius:11px;border:none;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;
  transition:all .2s;margin-bottom:4px;
}
.dark  .mp-edit-btn{background:rgba(245,158,11,.1);border:1.5px solid rgba(245,158,11,.3);color:#F59E0B;}
.light .mp-edit-btn{background:rgba(217,119,6,.08);border:1.5px solid rgba(217,119,6,.3);color:#D97706;}
.mp-edit-btn:hover{background:rgba(245,158,11,.18);}

/* ── Stat strip ── */
.mp-stats{
  display:flex;gap:0;
  border-radius:16px;overflow:hidden;
  margin-bottom:20px;
}
.dark  .mp-stats{background:rgba(13,24,42,.98);border:1px solid rgba(245,158,11,.1);}
.light .mp-stats{background:#fff;border:1px solid #EDE4D8;box-shadow:0 2px 10px rgba(0,0,0,.05);}

.mp-stat{
  flex:1;padding:16px 12px;text-align:center;
  border-right:1px solid rgba(245,158,11,.08);
}
.mp-stat:last-child{border-right:none;}
.mp-stat-val{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;line-height:1;}
.mp-stat-label{font-size:11px;font-weight:600;margin-top:4px;}
.dark  .mp-stat-label{color:#3D5068;}
.light .mp-stat-label{color:#9CA3AF;}

/* ── Tags ── */
.mp-tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px;}
.mp-tag{
  display:inline-flex;align-items:center;
  padding:5px 12px;border-radius:20px;
  font-size:11px;font-weight:700;
  background:rgba(245,158,11,.08);
  border:1px solid rgba(245,158,11,.18);
  color:var(--accent);
}

/* ── Quick nav cards ── */
.mp-nav-grid{display:grid;gridTemplateColumns:repeat(4,1fr);gap:10px;margin-bottom:24px;}
.mp-nav-card{
  border-radius:15px;padding:16px 14px;cursor:pointer;border:none;
  text-align:left;font-family:'DM Sans',sans-serif;
  transition:all .22s cubic-bezier(.16,1,.3,1);
}
.dark  .mp-nav-card{background:rgba(13,24,42,.98);border:1px solid rgba(255,255,255,.06);}
.light .mp-nav-card{background:#fff;border:1px solid #EDE4D8;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.mp-nav-card:hover{transform:translateY(-3px);}
.mp-nav-card-icon{font-size:22px;margin-bottom:8px;}
.mp-nav-card-label{font-size:13px;font-weight:800;margin-bottom:2px;}
.mp-nav-card-sub{font-size:11px;color:var(--muted);}

/* ── Tabs ── */
.mp-tabs{
  display:flex;gap:0;overflow-x:auto;
  border-bottom:1px solid var(--border);
  margin-bottom:24px;
}
.mp-tabs::-webkit-scrollbar{display:none;}
.mp-tab{
  padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;
  border:none;background:transparent;font-family:'DM Sans',sans-serif;
  border-bottom:2.5px solid transparent;color:var(--muted);
  transition:all .2s;display:flex;align-items:center;gap:7px;white-space:nowrap;
}
.mp-tab:hover:not(.active){color:var(--accent);}
.mp-tab.active{border-color:var(--accent);color:var(--accent);}

/* ── Content cards ── */
.mp-card{
  border-radius:18px;
  transition:border-color .2s;
}
.dark  .mp-card{background:rgba(13,24,42,.98);border:1px solid rgba(245,158,11,.1);}
.light .mp-card{background:#fff;border:1px solid #EDE4D8;box-shadow:0 2px 10px rgba(0,0,0,.04);}
.mp-card:hover{border-color:rgba(245,158,11,.28);}

/* ── Progress bar ── */
.prog-track{height:6px;border-radius:3px;overflow:hidden;background:rgba(245,158,11,.1);}
.prog-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#D97706,#F59E0B);transition:width 1.2s cubic-bezier(.16,1,.3,1);}

/* ── Review card ── */
.review-card{
  border-radius:16px;padding:20px;
  transition:all .22s;
}
.dark  .review-card{background:rgba(13,24,42,.98);border:1px solid rgba(245,158,11,.08);}
.light .review-card{background:#fff;border:1px solid #EDE4D8;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.review-card:hover{transform:translateY(-2px);border-color:rgba(245,158,11,.28);}

/* ── Rating bar ── */
.rbar-track{flex:1;height:7px;border-radius:4px;background:rgba(245,158,11,.1);overflow:hidden;}
.rbar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#D97706,#F59E0B);}

/* ── Badge card ── */
.badge-card{
  border-radius:18px;padding:22px 24px;
  display:flex;align-items:center;gap:18px;
  transition:all .22s;
}
.dark  .badge-card{background:rgba(13,24,42,.98);border:1px solid rgba(245,158,11,.08);}
.light .badge-card{background:#fff;border:1px solid #EDE4D8;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.badge-card.earned{border-color:rgba(245,158,11,.25);}
.badge-card.earned:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,158,11,.12);}
.badge-card.locked{opacity:.55;}

/* ── Bio edit ── */
.bio-edit{
  width:100%;padding:14px;border-radius:13px;
  font-size:14px;font-family:'DM Sans',sans-serif;
  outline:none;resize:none;line-height:1.75;
  transition:border-color .2s,box-shadow .2s;
}
.dark  .bio-edit{background:rgba(7,12,24,.8);border:1.5px solid rgba(245,158,11,.2);color:#F0E6D3;}
.light .bio-edit{background:#FFF8ED;border:1.5px solid rgba(217,119,6,.3);color:#1C1008;}
.bio-edit:focus{border-color:#F59E0B;box-shadow:0 0 0 3px rgba(245,158,11,.1);}

/* ── Buttons ── */
.btn-amber{
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 22px;border-radius:12px;border:none;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;
  background:linear-gradient(135deg,#D97706,#F59E0B);color:white;
  box-shadow:0 4px 14px rgba(217,119,6,.3);transition:all .2s;
}
.btn-amber:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(217,119,6,.4);}
.btn-ghost{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:11px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;
  background:transparent;transition:all .2s;
}
.dark  .btn-ghost{border:1.5px solid rgba(245,158,11,.25);color:#F59E0B;}
.light .btn-ghost{border:1.5px solid rgba(217,119,6,.3);color:#D97706;}
.btn-ghost:hover{background:rgba(245,158,11,.1);}

/* ── Section headings ── */
.sec-head{
  font-family:'Syne',sans-serif;font-size:11px;font-weight:800;
  letter-spacing:.09em;text-transform:uppercase;
  margin-bottom:14px;
}
.dark  .sec-head{color:#3D5068;}
.light .sec-head{color:#9CA3AF;}

/* ── Divider ── */
.mp-hr{height:1px;margin:16px 0;background:var(--border);}

/* ── Slot row ── */
.slot-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:9px 13px;border-radius:11px;margin-bottom:7px;
}
.dark  .slot-row{background:rgba(7,12,24,.7);}
.light .slot-row{background:rgba(255,248,237,.9);}

/* ── Animations ── */
@keyframes mp-fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes mp-scale-in{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
.mp-fade-up{animation:mp-fade-up .5s cubic-bezier(.16,1,.3,1) both;}
.mp-scale-in{animation:mp-scale-in .45s cubic-bezier(.16,1,.3,1) both;}
.s1{animation-delay:.04s}.s2{animation-delay:.08s}.s3{animation-delay:.12s}
.s4{animation-delay:.16s}.s5{animation-delay:.2s}.s6{animation-delay:.24s}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:rgba(245,158,11,.25);border-radius:2px;}
`;

function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:size, color:i<=rating?"#F59E0B":"rgba(100,116,139,.35)" }}>★</span>
      ))}
    </span>
  );
}

function Ava({ letter, color, size=38, radius=11 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0,
      background:`${color}20`, border:`2px solid ${color}40`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Syne',sans-serif", fontSize:size*.38, fontWeight:800, color }}>
      {letter}
    </div>
  );
}

export default function MentorProfile() {
  const { dark } = useApp();
  const navigate = useNavigate();
  const theme = dark ? "dark" : "light";

  const [activeTab, setActiveTab] = useState("overview");
  const [editing,   setEditing]   = useState(false);
  const [bio, setBio] = useState("Hi! I'm Kavya, a Class 12 student from Kochi passionate about Mathematics and Science. I've been mentoring for 3 months and love breaking down complex concepts into simple steps. I use real-life examples — cricket, cooking, everyday life — to make abstract ideas click. Available evenings and weekends.");
  const [bioEdit, setBioEdit] = useState(bio);

  const T = dark ? "#F0E6D3" : "#1C1008";
  const M = dark ? "#4B5568" : "#78716C";
  const accent = dark ? "#F59E0B" : "#D97706";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
     
        <div className={`mp-root ${theme}`}>

          {/* ── COVER ── */}
          <div className="mp-cover">
            <div className="mp-cover-grid"/>
            <div className="mp-cover-orb" style={{ width:280, height:280, top:-80, right:-40, background:"radial-gradient(circle,rgba(245,158,11,.14) 0%,transparent 70%)" }}/>
            <div className="mp-cover-orb" style={{ width:180, height:180, bottom:-50, left:"15%", background:"radial-gradient(circle,rgba(249,115,22,.09) 0%,transparent 70%)" }}/>
            <div className="mp-cover-bottom"/>
            {/* Live dot */}
            <div style={{ position:"absolute", top:16, left:24, display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 8px #22C55E" }}/>
              <span style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,.55)", letterSpacing:".1em", textTransform:"uppercase" }}>PathwayAI · Mentor</span>
            </div>
          </div>

          {/* ── SCROLLABLE CONTENT ── */}
          <div style={{ maxWidth:880, margin:"0 auto", padding:"0 20px 80px" }}>

            {/* ── PROFILE HEADER ── */}
            <div className="mp-header" style={{ padding:"0 0 0 0" }}>
              <div className="mp-avatar-row">

                {/* Avatar */}
                <div className="mp-avatar mp-scale-in">K</div>

                {/* Name + meta */}
                <div className="mp-name-block mp-fade-up s1">
                  <div style={{ display:"flex", alignItems:"center", gap:9, flexWrap:"wrap", marginBottom:6 }}>
                    <h1 className="mp-name">Kavya Nair</h1>
                    <span style={{ padding:"3px 11px", borderRadius:20, background:"rgba(205,127,50,.18)", border:"1px solid rgba(205,127,50,.35)", fontSize:11, fontWeight:800, color:"#CD7F32" }}>
                      🏅 Bronze
                    </span>
                    <span style={{ fontSize:11, fontWeight:700, color:"#22C55E", display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block" }}/>
                      Verified
                    </span>
                  </div>
                  <p className="mp-sub">Class 12 · Kochi, Kerala · Joined Oct 2025</p>
                </div>

                {/* Edit / Save */}
                <div className="mp-fade-up s2" style={{ alignSelf:"flex-end" }}>
                  {editing
                    ? <button className="btn-amber" onClick={() => { setBio(bioEdit); setEditing(false); }}>✓ Save</button>
                    : <button className="mp-edit-btn" onClick={() => { setBioEdit(bio); setEditing(true); }}>✏ Edit Profile</button>
                  }
                </div>
              </div>
            </div>

            {/* ── STAT STRIP ── */}
            <div className="mp-stats mp-fade-up s2" style={{ marginBottom:18 }}>
              {[
                { val:"4.8", label:"Rating",     icon:"★",  color:"#F59E0B" },
                { val:"42",  label:"Sessions",   icon:"📅", color:"#38BDF8" },
                { val:"₹2,400", label:"Earned",  icon:"💰", color:"#22C55E" },
                { val:"100%", label:"Reply Rate", icon:"⚡", color:"#8B5CF6" },
                { val:"3",   label:"Subjects",   icon:"📚", color:"#F97316" },
              ].map(s => (
                <div key={s.label} className="mp-stat">
                  <div style={{ fontSize:18, marginBottom:5 }}>{s.icon}</div>
                  <div className="mp-stat-val" style={{ color:s.color }}>{s.val}</div>
                  <div className="mp-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── TAGS ── */}
            <div className="mp-tags mp-fade-up s3">
              {["Mon–Fri 5–8 PM","Weekends 10 AM–6 PM","Hindi","English","Malayalam","₹80/session","Online"].map(tag => (
                <span key={tag} className="mp-tag">{tag}</span>
              ))}
            </div>

            {/* ── QUICK NAV TO OTHER PAGES ── */}
            <div className="mp-fade-up s3" style={{ marginBottom:24 }}>
              <p className="sec-head">Quick Access</p>
              <div className="mp-nav-grid">
                {NAV_CARDS.map(c => (
                  <button key={c.path} className="mp-nav-card" onClick={() => navigate(c.path)}
                    style={{ borderColor:`${c.color}20` }}>
                    <div className="mp-nav-card-icon">{c.icon}</div>
                    <div className="mp-nav-card-label" style={{ color:c.color }}>{c.label}</div>
                    <div className="mp-nav-card-sub">{c.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="mp-tabs mp-fade-up s4">
              {TABS.map(tab => (
                <button key={tab.id} className={`mp-tab ${activeTab===tab.id?"active":""}`} onClick={() => setActiveTab(tab.id)}>
                  <span style={{ fontSize:12 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ══════════════ OVERVIEW ══════════════ */}
            {activeTab === "overview" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:18, alignItems:"start" }}>

                {/* Left */}
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                  {/* Bio */}
                  <div className="mp-card mp-fade-up" style={{ padding:24 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                      <p className="sec-head" style={{ margin:0 }}>About Me</p>
                      {!editing && (
                        <button className="btn-ghost" style={{ fontSize:11, padding:"5px 12px" }}
                          onClick={() => { setBioEdit(bio); setEditing(true); }}>✏ Edit</button>
                      )}
                    </div>
                    {editing ? (
                      <div>
                        <textarea className="bio-edit" value={bioEdit} onChange={e => setBioEdit(e.target.value)} rows={5}/>
                        <div style={{ display:"flex", gap:8, marginTop:10 }}>
                          <button className="btn-amber" onClick={() => { setBio(bioEdit); setEditing(false); }}>✓ Save</button>
                          <button className="btn-ghost" onClick={() => { setBioEdit(bio); setEditing(false); }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize:14, color:M, lineHeight:1.75 }}>{bio}</p>
                    )}
                  </div>

                  {/* Recent reviews */}
                  <div className="mp-card mp-fade-up s1" style={{ padding:24 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                      <p className="sec-head" style={{ margin:0 }}>Recent Reviews</p>
                      <button onClick={() => setActiveTab("reviews")} style={{ fontSize:12, fontWeight:700, color:accent, background:"none", border:"none", cursor:"pointer" }}>
                        All {REVIEWS.length} →
                      </button>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                      {REVIEWS.slice(0,2).map((r,i) => (
                        <div key={i}>
                          <div style={{ display:"flex", gap:12 }}>
                            <Ava letter={r.avatar} color={r.color}/>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                                <span style={{ fontSize:13, fontWeight:700, color:T }}>{r.student}</span>
                                <Stars rating={r.rating} size={11}/>
                                <span style={{ fontSize:11, color:M }}>{r.date}</span>
                              </div>
                              <p style={{ fontSize:13, color:M, lineHeight:1.65 }}>{r.text}</p>
                            </div>
                          </div>
                          {i < 1 && <div className="mp-hr"/>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Book CTA */}
                  <div className="mp-fade-up s1" style={{ borderRadius:18, padding:22, background:"linear-gradient(135deg,#0D2744,#1A3A5C)", border:"1px solid rgba(245,158,11,.2)", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,158,11,.12) 0%,transparent 70%)" }}/>
                    <div style={{ position:"relative", zIndex:1 }}>
                      <div style={{ fontSize:22, marginBottom:10 }}>📅</div>
                      <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:"white", marginBottom:6 }}>Book a Session</h4>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,.55)", lineHeight:1.55, marginBottom:16 }}>₹80/session · 60 min · Online</p>
                      <button className="btn-amber" style={{ width:"100%", justifyContent:"center" }}>Book Now →</button>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mp-card mp-fade-up s2" style={{ padding:22 }}>
                    <p className="sec-head">Subjects I Teach</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                      {SUBJECTS.map(s => (
                        <div key={s.name}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, boxShadow:`0 0 6px ${s.color}` }}/>
                              <div>
                                <div style={{ fontSize:13, fontWeight:700, color:T }}>{s.name}</div>
                                <div style={{ fontSize:11, color:M }}>{s.level}</div>
                              </div>
                            </div>
                            <span style={{ fontSize:12, fontWeight:800, color:s.color }}>{s.sessions}</span>
                          </div>
                          <div className="prog-track">
                            <div className="prog-fill" style={{ width:`${s.progress}%`, background:`linear-gradient(90deg,${s.color}90,${s.color})` }}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available slots */}
                  <div className="mp-card mp-fade-up s3" style={{ padding:20 }}>
                    <p className="sec-head">Next Available</p>
                    {["Today · 6:00 PM","Tomorrow · 5:30 PM","Sat · 10:00 AM"].map(slot => (
                      <div key={slot} className="slot-row">
                        <span style={{ fontSize:12, color:T, fontWeight:600 }}>🗓 {slot}</span>
                        <button style={{ fontSize:11, fontWeight:700, color:accent, background:"none", border:"none", cursor:"pointer" }}>Book</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════ REVIEWS ══════════════ */}
            {activeTab === "reviews" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                {/* Summary */}
                <div className="mp-card mp-fade-up" style={{ padding:28 }}>
                  <div style={{ display:"flex", gap:32, alignItems:"center", flexWrap:"wrap" }}>
                    <div style={{ textAlign:"center", flexShrink:0 }}>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:52, fontWeight:800, color:accent, lineHeight:1 }}>4.8</div>
                      <Stars rating={5} size={15}/>
                      <div style={{ fontSize:12, color:M, marginTop:6 }}>{REVIEWS.length} reviews</div>
                    </div>
                    <div style={{ flex:1, minWidth:180, display:"flex", flexDirection:"column", gap:8 }}>
                      {[5,4,3,2,1].map(star => {
                        const count = REVIEWS.filter(r => r.rating===star).length;
                        return (
                          <div key={star} style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:12, color:M, width:14 }}>{star}</span>
                            <span style={{ fontSize:11, color:"#F59E0B" }}>★</span>
                            <div className="rbar-track">
                              <div className="rbar-fill" style={{ width:`${(count/REVIEWS.length)*100}%` }}/>
                            </div>
                            <span style={{ fontSize:11, color:M, width:16 }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:12, flexShrink:0 }}>
                      {[{val:"100%",label:"Recommend"},{val:"4.9",label:"Communication"},{val:"4.8",label:"Clarity"}].map(s => (
                        <div key={s.label} style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:accent }}>{s.val}</div>
                          <div style={{ fontSize:11, color:M }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review cards */}
                {REVIEWS.map((r,i) => (
                  <div key={i} className={`review-card mp-fade-up s${(i%5)+1}`}>
                    <div style={{ display:"flex", gap:14 }}>
                      <Ava letter={r.avatar} color={r.color} size={42} radius={12}/>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:7 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <span style={{ fontSize:14, fontWeight:800, color:T }}>{r.student}</span>
                            <span style={{ padding:"2px 9px", borderRadius:20, background:`${r.color}15`, border:`1px solid ${r.color}28`, fontSize:11, fontWeight:700, color:r.color }}>{r.subject}</span>
                          </div>
                          <span style={{ fontSize:11, color:M }}>{r.date}</span>
                        </div>
                        <div style={{ marginBottom:8 }}><Stars rating={r.rating}/></div>
                        <p style={{ fontSize:13.5, color:M, lineHeight:1.68 }}>{r.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ══════════════ SUBJECTS ══════════════ */}
            {activeTab === "subjects" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {SUBJECTS.map((s,i) => (
                  <div key={s.name} className={`mp-card mp-fade-up s${i+1}`} style={{ padding:26 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                      <div style={{ width:46, height:46, borderRadius:14, background:`${s.color}15`, border:`2px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", background:s.color, boxShadow:`0 0 10px ${s.color}` }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:T, marginBottom:3 }}>{s.name}</h3>
                        <p style={{ fontSize:12, color:M }}>{s.level} · {s.sessions} sessions completed</p>
                      </div>
                      <Stars rating={5}/>
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:M, marginBottom:7, fontWeight:600 }}>
                        <span>Proficiency</span>
                        <span style={{ color:s.color }}>{s.progress}%</span>
                      </div>
                      <div className="prog-track" style={{ height:7 }}>
                        <div className="prog-fill" style={{ width:`${s.progress}%`, background:`linear-gradient(90deg,${s.color}80,${s.color})` }}/>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                      {[
                        { label:"Sessions", val:s.sessions, color:s.color },
                        { label:"Avg Rating", val:"4.8 ★", color:"#F59E0B" },
                        { label:"Earned", val:`₹${s.sessions*80}`, color:"#22C55E" },
                      ].map(st => (
                        <div key={st.label} style={{ borderRadius:13, padding:"14px 10px", textAlign:"center",
                          background:dark?"rgba(7,12,24,.7)":"rgba(255,248,237,.9)",
                          border:`1px solid ${st.color}1A` }}>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:900, color:st.color, marginBottom:3 }}>{st.val}</div>
                          <div style={{ fontSize:11, color:M, fontWeight:600 }}>{st.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ══════════════ CREDENTIALS ══════════════ */}
            {activeTab === "credentials" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <p className="mp-fade-up" style={{ fontSize:13, color:M, marginBottom:4, lineHeight:1.65 }}>
                  PathwayAI credentials are verified by your teacher and earned through completed mentoring sessions.
                </p>

                {BADGES.map((b,i) => (
                  <div key={i} className={`badge-card mp-fade-up s${i+1} ${b.earned?"earned":"locked"}`}>
                    <div style={{ width:58, height:58, borderRadius:16, background:`${b.color}18`, border:`2px solid ${b.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
                      {b.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:5 }}>
                        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:b.earned?T:M }}>{b.label}</h3>
                        {b.earned && <span style={{ padding:"2px 9px", borderRadius:20, background:`${b.color}20`, border:`1px solid ${b.color}40`, fontSize:10, fontWeight:800, color:b.color }}>EARNED</span>}
                      </div>
                      <p style={{ fontSize:13, color:M }}>{b.desc}</p>
                    </div>
                    {b.earned ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                        <button className="btn-amber" style={{ fontSize:12, padding:"8px 16px" }}>🔗 Share</button>
                        <button className="btn-ghost" style={{ fontSize:11, padding:"6px 14px" }}>⬇ Download</button>
                      </div>
                    ) : (
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:20 }}>🔒</div>
                        <div style={{ fontSize:11, color:M, fontWeight:600, marginTop:4 }}>Locked</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Progress CTA */}
                <div className="mp-fade-up s4" style={{ borderRadius:18, padding:26, background:"linear-gradient(135deg,#0D2744,#1A3A5C)", border:"1px solid rgba(245,158,11,.2)", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>🎯</div>
                  <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"white", marginBottom:7 }}>Unlock Silver Badge</h4>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", marginBottom:16, lineHeight:1.6 }}>
                    Complete 8 more sessions to earn your Silver badge and charge ₹150/session.
                  </p>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, justifyContent:"center" }}>
                    <div style={{ flex:1, maxWidth:260, height:8, borderRadius:4, background:"rgba(255,255,255,.1)", overflow:"hidden" }}>
                      <div style={{ width:"84%", height:"100%", borderRadius:4, background:"linear-gradient(90deg,#D97706,#F59E0B)" }}/>
                    </div>
                    <span style={{ fontSize:12, fontWeight:800, color:"#F59E0B" }}>42/50</span>
                  </div>
                  <button className="btn-amber" onClick={() => navigate("/mentor/requests")}>Find Students →</button>
                </div>
              </div>
            )}

          </div>
        </div>
      
    </>
  );
}