/**
 * Resources.jsx — PathwayAI Teacher Resource Library
 * Upload, organise and share study materials with students
 * src/pages/teacher/Resources.jsx
 */

import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";

const SUBJECTS = ["All","Mathematics","Science","History","English","Geography"];
const TYPES    = ["All","PDF","Video","Notes","Worksheet","Slides"];

const RESOURCES = [
  { id:1, title:"Quadratic Equations — Complete Notes",  subject:"Mathematics", type:"PDF",       size:"2.4 MB", uploaded:"Nov 28", sharedWith:28, downloads:22, icon:"📄", color:"#38BDF8" },
  { id:2, title:"Photosynthesis Diagram Worksheet",     subject:"Science",     type:"Worksheet", size:"1.1 MB", uploaded:"Nov 26", sharedWith:28, downloads:18, icon:"📝", color:"#22C55E" },
  { id:3, title:"French Revolution — Key Events Slides",subject:"History",     type:"Slides",    size:"5.6 MB", uploaded:"Nov 24", sharedWith:28, downloads:15, icon:"📊", color:"#8B5CF6" },
  { id:4, title:"Newton's Laws — Explanation Video",    subject:"Science",     type:"Video",     size:"45 MB",  uploaded:"Nov 22", sharedWith:28, downloads:24, icon:"🎥", color:"#F97316" },
  { id:5, title:"Trigonometry Formula Sheet",           subject:"Mathematics", type:"PDF",       size:"0.8 MB", uploaded:"Nov 20", sharedWith:28, downloads:26, icon:"📄", color:"#38BDF8" },
  { id:6, title:"English Grammar — Tenses Reference",  subject:"English",     type:"Notes",     size:"1.3 MB", uploaded:"Nov 18", sharedWith:28, downloads:20, icon:"📋", color:"#F59E0B" },
  { id:7, title:"Periodic Table — High Resolution",    subject:"Science",     type:"PDF",       size:"3.2 MB", uploaded:"Nov 15", sharedWith:28, downloads:28, icon:"📄", color:"#22C55E" },
  { id:8, title:"Map Skills — Geography Worksheet",    subject:"Geography",   type:"Worksheet", size:"1.8 MB", uploaded:"Nov 12", sharedWith:28, downloads:14, icon:"🗺️",  color:"#14B8A6" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
.rs-wrap { min-height:100vh; font-family:'DM Sans',sans-serif; }
.rs-wrap.dark  { background:#070F1C; color:#EDE8DF; }
.rs-wrap.light { background:#F4F6FA; color:#111827; }

.rs-card {
  border-radius:18px;
  transition:border-color .25s, box-shadow .25s, transform .25s;
}
.dark  .rs-card { background:rgba(11,22,42,.97); border:1px solid rgba(255,255,255,.07); }
.light .rs-card { background:#fff; border:1px solid #E5E7EB; box-shadow:0 2px 10px rgba(0,0,0,.05); }
.rs-card:hover { border-color:rgba(20,184,166,.3); transform:translateY(-2px); }

.rs-pill {
  padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700;
  cursor:pointer; border:none; font-family:'DM Sans',sans-serif; transition:all .2s;
}
.dark  .rs-pill        { background:rgba(255,255,255,.05); color:#4B5568; }
.light .rs-pill        { background:#F1F5F9; color:#9CA3AF; }
.dark  .rs-pill.active { background:rgba(20,184,166,.14); color:#14B8A6; }
.light .rs-pill.active { background:rgba(20,184,166,.1);  color:#0F766E; }

.btn-teal {
  display:inline-flex; align-items:center; gap:8px;
  padding:11px 22px; border-radius:13px; border:none; cursor:pointer;
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:800;
  background:linear-gradient(135deg,#0F766E,#14B8A6);
  color:white; box-shadow:0 4px 16px rgba(20,184,166,.3);
  transition:transform .2s, box-shadow .2s;
}
.btn-teal:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(20,184,166,.4); }

.btn-ghost-sm {
  padding:7px 14px; border-radius:10px; font-size:11px; font-weight:700;
  cursor:pointer; font-family:'DM Sans',sans-serif;
  background:transparent; transition:all .2s;
}
.dark  .btn-ghost-sm { border:1.5px solid rgba(255,255,255,.08); color:#4B5568; }
.light .btn-ghost-sm { border:1.5px solid #E5E7EB; color:#9CA3AF; }
.btn-ghost-sm:hover { border-color:#14B8A6; color:#14B8A6; }

.drop-zone {
  border-radius:18px; padding:36px; text-align:center; cursor:pointer;
  transition:all .25s;
}
.dark  .drop-zone { border:2px dashed rgba(20,184,166,.25); background:rgba(20,184,166,.04); }
.light .drop-zone { border:2px dashed rgba(20,184,166,.35); background:rgba(20,184,166,.03); }
.drop-zone:hover, .drop-zone.over {
  border-color:#14B8A6;
  background:rgba(20,184,166,.1);
}

.rs-type-badge {
  padding:2px 9px; border-radius:20px; font-size:10px; font-weight:800; letter-spacing:.04em;
}
.badge-PDF       { background:rgba(56,189,248,.14);  color:#38BDF8; }
.badge-Video     { background:rgba(249,115,22,.14);  color:#F97316; }
.badge-Notes     { background:rgba(245,158,11,.14);  color:#F59E0B; }
.badge-Worksheet { background:rgba(34,197,94,.14);   color:#22C55E; }
.badge-Slides    { background:rgba(139,92,246,.14);  color:#8B5CF6; }

.rs-search {
  padding:10px 14px; border-radius:12px; font-size:13px;
  font-family:'DM Sans',sans-serif; outline:none; width:100%;
  transition:border-color .2s, box-shadow .2s;
}
.dark  .rs-search { background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.08); color:#EDE8DF; }
.light .rs-search { background:#F9FAFB; border:1.5px solid #E5E7EB; color:#111827; }
.rs-search:focus { border-color:#14B8A6; box-shadow:0 0 0 3px rgba(20,184,166,.1); }

@keyframes rs-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.rs-fade-up { animation:rs-fade-up .5s cubic-bezier(.16,1,.3,1) both; }
.s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}
`;

export default function Resources() {
  const { dark } = useApp();
  const theme = dark ? "dark" : "light";
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterType,    setFilterType]    = useState("All");
  const [search,        setSearch]        = useState("");
  const [dragOver,      setDragOver]      = useState(false);
  const [uploaded,      setUploaded]      = useState([]);
  const [shareOk,       setShareOk]       = useState(null);
  const fileRef = useRef();

  const M = dark ? "#4B5568" : "#9CA3AF";
  const T = dark ? "#EDE8DF" : "#111827";

  const filtered = RESOURCES.filter(r => {
    const matchSub  = filterSubject==="All" || r.subject===filterSubject;
    const matchType = filterType==="All"    || r.type===filterType;
    const matchQ    = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchType && matchQ;
  });

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploaded(u => [...u, ...files.map(f => ({ name:f.name, size:`${(f.size/1024/1024).toFixed(1)} MB` }))]);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    setUploaded(u => [...u, ...files.map(f => ({ name:f.name, size:`${(f.size/1024/1024).toFixed(1)} MB` }))]);
  };

  const doShare = (id) => {
    setShareOk(id); setTimeout(()=>setShareOk(null), 2000);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div className={`rs-wrap ${theme}`}>
          <div style={{ maxWidth:960, margin:"0 auto", padding:"28px 24px 80px" }}>

            {/* Header */}
            <div className="rs-fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:26 }}>
              <div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:4, color:T }}>📚 Resource Library</h1>
                <p style={{ fontSize:13, color:M }}>{RESOURCES.length} materials · Share instantly with your class</p>
              </div>
              <button className="btn-teal" onClick={() => fileRef.current.click()}>⬆ Upload Material</button>
              <input ref={fileRef} type="file" multiple style={{ display:"none" }} onChange={handleFileInput}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:18, alignItems:"start" }}>

              {/* Left */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                {/* Search + filters */}
                <div className="rs-card rs-fade-up s1" style={{ padding:18 }}>
                  <input className="rs-search" placeholder="Search resources…" value={search} onChange={e=>setSearch(e.target.value)} style={{ marginBottom:14 }}/>
                  <div style={{ marginBottom:10 }}>
                    <p style={{ fontSize:11, fontWeight:800, letterSpacing:".07em", textTransform:"uppercase", color:M, marginBottom:8 }}>Subject</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {SUBJECTS.map(s => <button key={s} className={`rs-pill ${filterSubject===s?"active":""}`} onClick={()=>setFilterSubject(s)}>{s}</button>)}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize:11, fontWeight:800, letterSpacing:".07em", textTransform:"uppercase", color:M, marginBottom:8 }}>Type</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {TYPES.map(t => <button key={t} className={`rs-pill ${filterType===t?"active":""}`} onClick={()=>setFilterType(t)}>{t}</button>)}
                    </div>
                  </div>
                </div>

                {/* Resource list */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {filtered.length === 0 && (
                    <div style={{ textAlign:"center", padding:"48px 0", color:M }}>
                      <div style={{ fontSize:32, marginBottom:8 }}>📂</div>
                      <p style={{ fontSize:14 }}>No resources match your filters</p>
                    </div>
                  )}
                  {filtered.map((r,i) => (
                    <div key={r.id} className="rs-card rs-fade-up" style={{ padding:"18px 22px", animationDelay:`${i*.05}s`, display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:46,height:46,borderRadius:14,background:`${r.color}18`,border:`1px solid ${r.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>
                        {r.icon}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                          <span style={{ fontSize:14, fontWeight:700, color:T, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</span>
                          <span className={`rs-type-badge badge-${r.type}`}>{r.type}</span>
                        </div>
                        <p style={{ fontSize:12, color:M }}>{r.subject} · {r.size} · {r.uploaded} · {r.downloads} downloads</p>
                      </div>
                      <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                        <button className="btn-ghost-sm" onClick={() => doShare(r.id)}>
                          {shareOk===r.id ? "✓ Shared!" : "📤 Share"}
                        </button>
                        <button className="btn-ghost-sm">⬇</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                {/* Upload drop zone */}
                <div
                  className={`drop-zone rs-fade-up s2 ${dragOver?"over":""}`}
                  onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current.click()}
                >
                  <div style={{ fontSize:32, marginBottom:10 }}>☁️</div>
                  <p style={{ fontSize:14, fontWeight:700, color:T, marginBottom:6 }}>Drop files here</p>
                  <p style={{ fontSize:12, color:M }}>PDF, Video, Slides, Worksheets<br/>Max 100 MB per file</p>
                </div>

                {/* Newly uploaded */}
                {uploaded.length > 0 && (
                  <div className="rs-card" style={{ padding:18 }}>
                    <p style={{ fontSize:11, fontWeight:800, letterSpacing:".07em", textTransform:"uppercase", color:M, marginBottom:12 }}>Just Uploaded</p>
                    {uploaded.map((f,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i<uploaded.length-1?`1px solid ${dark?"rgba(255,255,255,.06)":"#F1F5F9"}`:"none" }}>
                        <span style={{ fontSize:18 }}>📄</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:12, fontWeight:600, color:T, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</p>
                          <p style={{ fontSize:11, color:M }}>{f.size}</p>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:"#22C55E" }}>✓</span>
                      </div>
                    ))}
                    <button className="btn-teal" style={{ width:"100%", justifyContent:"center", marginTop:12, fontSize:12, padding:"10px" }}>
                      📤 Share with Class
                    </button>
                  </div>
                )}

                {/* Stats card */}
                <div className="rs-card rs-fade-up s3" style={{ padding:20 }}>
                  <p style={{ fontSize:11, fontWeight:800, letterSpacing:".07em", textTransform:"uppercase", color:M, marginBottom:14 }}>Library Stats</p>
                  {[
                    { label:"Total Files",     val:RESOURCES.length,                           color:"#14B8A6" },
                    { label:"Total Downloads", val:RESOURCES.reduce((a,r)=>a+r.downloads,0),   color:"#38BDF8" },
                    { label:"Students Shared", val:28,                                         color:"#22C55E" },
                    { label:"Most Popular",    val:"Trig Formula Sheet",                        color:"#F59E0B" },
                  ].map(s => (
                    <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${dark?"rgba(255,255,255,.05)":"#F1F5F9"}` }}>
                      <span style={{ fontSize:12, color:M }}>{s.label}</span>
                      <span style={{ fontSize:13, fontWeight:800, color:s.color }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}