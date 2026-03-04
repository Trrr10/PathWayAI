/**
 * Resources.jsx — PathwayAI Teacher Resource Library
 * Glassmorphism soft pink calm aesthetic
 */
import { useState, useRef } from "react";
import { GLASS_CSS } from "./glassTheme";

const SUBJECTS = ["All","Mathematics","Science","History","English","Geography"];
const TYPES    = ["All","PDF","Video","Notes","Worksheet","Slides"];

const RESOURCES = [
  { id:1, title:"Quadratic Equations — Complete Notes",  subject:"Mathematics", type:"PDF",       size:"2.4 MB", uploaded:"Nov 28", downloads:22, color:"#c9748e" },
  { id:2, title:"Photosynthesis Diagram Worksheet",      subject:"Science",     type:"Worksheet", size:"1.1 MB", uploaded:"Nov 26", downloads:18, color:"#6a9a88" },
  { id:3, title:"French Revolution — Key Events Slides", subject:"History",     type:"Slides",    size:"5.6 MB", uploaded:"Nov 24", downloads:15, color:"#7b68bb" },
  { id:4, title:"Newton's Laws — Explanation Video",     subject:"Science",     type:"Video",     size:"45 MB",  uploaded:"Nov 22", downloads:24, color:"#c49878" },
  { id:5, title:"Trigonometry Formula Sheet",            subject:"Mathematics", type:"PDF",       size:"0.8 MB", uploaded:"Nov 20", downloads:26, color:"#c9748e" },
  { id:6, title:"English Grammar — Tenses Reference",   subject:"English",     type:"Notes",     size:"1.3 MB", uploaded:"Nov 18", downloads:20, color:"#9b8ed4" },
  { id:7, title:"Periodic Table — High Resolution",     subject:"Science",     type:"PDF",       size:"3.2 MB", uploaded:"Nov 15", downloads:28, color:"#6a9a88" },
  { id:8, title:"Map Skills — Geography Worksheet",     subject:"Geography",   type:"Worksheet", size:"1.8 MB", uploaded:"Nov 12", downloads:14, color:"#7aa8c8" },
];

const TYPE_COLORS = {
  PDF:       { bg:"rgba(201,116,142,0.12)", text:"#c9748e", border:"rgba(201,116,142,0.25)" },
  Video:     { bg:"rgba(196,152,120,0.12)", text:"#c49878", border:"rgba(196,152,120,0.25)" },
  Notes:     { bg:"rgba(155,142,212,0.12)", text:"#9b8ed4", border:"rgba(155,142,212,0.25)" },
  Worksheet: { bg:"rgba(106,154,136,0.12)", text:"#6a9a88", border:"rgba(106,154,136,0.25)" },
  Slides:    { bg:"rgba(123,104,187,0.12)", text:"#7b68bb", border:"rgba(123,104,187,0.25)" },
};

const EXTRA_CSS = `
.rs-resource-card {
  background: rgba(255,248,252,0.65);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(232,164,184,0.18);
  border-radius: 16px;
  padding: 18px 22px;
  display: flex; align-items: center; gap:16px;
  transition: all 0.25s;
  box-shadow: 0 3px 14px rgba(201,116,142,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
}
.rs-resource-card:hover {
  border-color: rgba(201,116,142,0.3);
  transform: translateX(4px);
  box-shadow: 0 6px 24px rgba(201,116,142,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
}
.rs-drop-zone {
  border: 2px dashed rgba(201,116,142,0.3);
  border-radius: 18px; padding: 36px 20px; text-align:center; cursor:pointer;
  background: rgba(252,232,237,0.2);
  backdrop-filter: blur(12px);
  transition: all 0.25s;
}
.rs-drop-zone:hover, .rs-drop-zone.over {
  border-color: rgba(201,116,142,0.6);
  background: rgba(252,232,237,0.4);
}
.rs-icon-box {
  width: 46px; height: 46px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 10px; font-weight: 800;
  letter-spacing: 0.04em;
  font-family: 'JetBrains Mono', monospace;
}
`;

export default function Resources() {
  const [filterSub,  setFilterSub]  = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [search,     setSearch]     = useState("");
  const [dragOver,   setDragOver]   = useState(false);
  const [uploaded,   setUploaded]   = useState([]);
  const [shareOk,    setShareOk]    = useState(null);
  const fileRef = useRef();

  const filtered = RESOURCES.filter(r => {
    const ms = filterSub  === "All" || r.subject === filterSub;
    const mt = filterType === "All" || r.type    === filterType;
    const mq = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return ms && mt && mq;
  });

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploaded(u => [...u, ...files.map(f => ({ name:f.name, size:`${(f.size/1024/1024).toFixed(1)} MB` }))]);
  };

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setUploaded(u => [...u, ...files.map(f => ({ name:f.name, size:`${(f.size/1024/1024).toFixed(1)} MB` }))]);
  };

  const doShare = (id) => { setShareOk(id); setTimeout(()=>setShareOk(null), 2000); };

  return (
    <>
      <style>{GLASS_CSS + EXTRA_CSS}</style>
      <div className="gl-root">
        <div className="gl-orb" style={{ width:300, height:300, background:"rgba(168,197,184,0.14)", top:-60, right:100 }} />
        <div className="gl-orb" style={{ width:250, height:250, background:"rgba(232,164,184,0.16)", bottom:100, left:-60, animationDelay:"5s" }} />

        <div className="gl-content" style={{ maxWidth:1000, margin:"0 auto", padding:"36px 28px 80px" }}>

          {/* Header */}
          <div className="gl-fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:32 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-soft)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Shared Library</div>
              <h1 className="gl-page-title">Resources</h1>
              <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:6 }}>{RESOURCES.length} materials · Shared with your class</p>
            </div>
            <button className="gl-btn gl-btn-primary" onClick={() => fileRef.current.click()}>
              Upload Material
            </button>
            <input ref={fileRef} type="file" multiple style={{ display:"none" }} onChange={handleFile} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }}>

            {/* Left: filters + list */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Search + filters */}
              <div className="gl-card gl-fade-up d1" style={{ padding:22 }}>
                <input className="gl-input" placeholder="Search resources..." value={search}
                  onChange={e=>setSearch(e.target.value)} style={{ marginBottom:18 }} />

                <div style={{ marginBottom:14 }}>
                  <div className="gl-section-title" style={{ marginBottom:10 }}>Subject</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                    {SUBJECTS.map(s => (
                      <button key={s} onClick={() => setFilterSub(s)}
                        className={`gl-btn gl-btn-ghost gl-btn-sm ${filterSub===s?"gl-btn-primary":""}`}
                        style={{ fontSize:11, padding:"6px 14px" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="gl-section-title" style={{ marginBottom:10 }}>Type</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                    {TYPES.map(t => (
                      <button key={t} onClick={() => setFilterType(t)}
                        className={`gl-btn gl-btn-ghost gl-btn-sm ${filterType===t?"gl-btn-primary":""}`}
                        style={{ fontSize:11, padding:"6px 14px" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resource list */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filtered.length === 0 ? (
                  <div className="gl-card" style={{ padding:"48px 24px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontStyle:"italic", color:"var(--text-soft)", marginBottom:8 }}>
                      No resources found
                    </div>
                    <p style={{ fontSize:13, color:"var(--text-soft)" }}>Try adjusting your filters</p>
                  </div>
                ) : filtered.map((r,i) => {
                  const tc = TYPE_COLORS[r.type] || TYPE_COLORS.PDF;
                  return (
                    <div key={r.id} className={`rs-resource-card gl-fade-up`} style={{ animationDelay:`${i*0.05}s` }}>
                      <div className="rs-icon-box" style={{ background:tc.bg, border:`1px solid ${tc.border}`, color:tc.text }}>
                        {r.type.slice(0,3).toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                          <span style={{ fontSize:13, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</span>
                          <span className="gl-pill" style={{ background:tc.bg, color:tc.text, border:`1px solid ${tc.border}`, fontSize:9, flexShrink:0 }}>{r.type}</span>
                        </div>
                        <div style={{ fontSize:11, color:"var(--text-soft)" }}>
                          {r.subject} · {r.size} · {r.uploaded} · {r.downloads} downloads
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                        <button className="gl-btn gl-btn-ghost gl-btn-sm" style={{ fontSize:11 }} onClick={() => doShare(r.id)}>
                          {shareOk===r.id ? "Shared!" : "Share"}
                        </button>
                        <button className="gl-btn gl-btn-ghost gl-btn-sm" style={{ fontSize:11, padding:"7px 10px" }}>↓</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: upload + stats */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Drop zone */}
              <div className={`rs-drop-zone gl-fade-up d2 ${dragOver?"over":""}`}
                onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}>
                <div style={{ width:48, height:48, borderRadius:14, background:"rgba(232,164,184,0.2)", border:"1px solid rgba(232,164,184,0.3)", margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:20 }}>↑</div>
                </div>
                <p style={{ fontSize:14, fontWeight:600, color:"var(--text-mid)", marginBottom:6 }}>Drop files here</p>
                <p style={{ fontSize:12, color:"var(--text-soft)" }}>PDF, Video, Slides, Worksheets</p>
                <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:4 }}>Max 100 MB per file</p>
              </div>

              {/* Newly uploaded */}
              {uploaded.length > 0 && (
                <div className="gl-card gl-fade-up" style={{ padding:20 }}>
                  <div className="gl-section-title">Just Uploaded</div>
                  {uploaded.map((f,i) => (
                    <div key={i} className="gl-row" style={{ padding:"10px 0" }}>
                      <div style={{ width:32, height:32, borderRadius:9, background:"rgba(232,164,184,0.15)", border:"1px solid rgba(232,164,184,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"var(--pink-deep)", flexShrink:0 }}>
                        {f.name.split(".").pop().toUpperCase().slice(0,3)}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                        <div style={{ fontSize:11, color:"var(--text-soft)" }}>{f.size}</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:"#4a7a64" }}>✓</span>
                    </div>
                  ))}
                  <button className="gl-btn gl-btn-primary" style={{ width:"100%", justifyContent:"center", marginTop:14, fontSize:12 }}>
                    Share with Class
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="gl-card gl-fade-up d3" style={{ padding:22 }}>
                <div className="gl-section-title">Library Stats</div>
                {[
                  { label:"Total Files",     val:RESOURCES.length,                            color:"var(--pink-deep)" },
                  { label:"Total Downloads", val:RESOURCES.reduce((a,r)=>a+r.downloads,0),    color:"#7b68bb" },
                  { label:"Students Shared", val:28,                                          color:"#6a9a88" },
                  { label:"Most Popular",    val:"Trig Formula Sheet",                         color:"#c49878" },
                ].map(s => (
                  <div key={s.label} className="gl-row" style={{ padding:"10px 0" }}>
                    <span style={{ fontSize:12, color:"var(--text-soft)", flex:1 }}>{s.label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:s.color, fontFamily: typeof s.val === "number" ? "'JetBrains Mono',monospace" : "inherit" }}>{s.val}</span>
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
