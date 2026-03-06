// ResumeBuilder.jsx
import { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { supabase } from "../../lib/supabase";

/* ── Hardcoded SDE resume template ── */
const SDE_RESUME = {
  name: "Sarthak Sharma",
  email: "sarthak@gmail.com",
  phone: "+91 98765 43210",
  location: "Mumbai, Maharashtra",
  linkedin: "linkedin.com/in/sarthaksharma",
  github: "github.com/sarthaksharma",
  objective: "Motivated Computer Science student with strong foundations in Web Development, SQL, and Data Structures & Algorithms. Passionate about building scalable applications and solving complex engineering problems. Seeking a Software Development Engineer role to contribute to impactful products.",
  education: [
    { school: "SSHS (Senior Secondary High School)", degree: "Class 12 — Science (PCM)", year: "2024", score: "95%" },
    { school: "SSHS (Senior Secondary High School)", degree: "Class 10 — CBSE", year: "2022", score: "95%" },
  ],
  experience: [],
  projects: [
    {
      name: "To-Do App",
      tech: "React, Node.js, MongoDB",
      duration: "Jan 2024 – Mar 2024",
      desc: "Built a custom full-stack To-Do application with user authentication, task prioritisation, and deadline reminders. Implemented REST APIs and responsive UI.",
    },
  ],
  skills: {
    languages: ["JavaScript", "Python", "SQL", "HTML", "CSS"],
    frameworks: ["React", "Node.js", "Express"],
    tools: ["Git", "GitHub", "VS Code", "MongoDB"],
    concepts: ["Data Structures & Algorithms", "Web Development", "REST APIs", "OOP"],
  },
  certifications: [],
  achievements: [
    "Scored 95% in Class 12 and Class 10 Board Examinations",
    "Completed DSA course on LeetCode (50+ problems solved)",
  ],
};

const LOADING_STEPS = [
  "Connecting to Ollama llama3.1…",
  "Analysing your profile…",
  "Generating SDE resume structure…",
  "Writing professional objective…",
  "Formatting sections…",
  "Polishing final output…",
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .rb *, .rb *::before, .rb *::after { box-sizing: border-box; }
  .rb { font-family: 'Plus Jakarta Sans', sans-serif; }
  .rb-input {
    width: 100%; padding: 10px 14px; border-radius: 10px; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .rb-input:focus { box-shadow: 0 0 0 3px rgba(14,165,233,0.2); }
  .rb-btn { display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;transition:all .2s; }
  .rb-btn:hover:not(:disabled) { opacity:.88;transform:translateY(-1px); }
  .rb-btn:disabled { opacity:.5;cursor:not-allowed;transform:none; }
  @keyframes rb-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .rb-up { animation:rb-up .4s cubic-bezier(.16,1,.3,1) both; }
  @keyframes rb-spin { to{transform:rotate(360deg)} }
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
  .dot { width:10px;height:10px;border-radius:50%;background:#0ea5e9;display:inline-block; }
  .dot:nth-child(1){animation:dot-bounce 1.4s 0s infinite ease-in-out}
  .dot:nth-child(2){animation:dot-bounce 1.4s .2s infinite ease-in-out}
  .dot:nth-child(3){animation:dot-bounce 1.4s .4s infinite ease-in-out}
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  .text-shimmer { background:linear-gradient(90deg,#38bdf8,#818cf8,#34d399,#38bdf8);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite; }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(14,165,233,0.3)} 50%{box-shadow:0 0 0 14px rgba(14,165,233,0)} }
  .rb-version:hover { opacity:.9;cursor:pointer; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(14,165,233,.3);border-radius:3px}

  /* Print styles */
  @media print {
    .no-print { display: none !important; }
    .print-page { background: white !important; padding: 0 !important; }
    .print-resume { box-shadow: none !important; border: none !important; }
  }
`;

export default function ResumeBuilder() {
  const { dark, user } = useApp();

  const [screen, setScreen]       = useState("landing");   // landing | generating | editor | view
  const [form, setForm]           = useState(null);
  const [versions, setVersions]   = useState([]);
  const [activeId, setActiveId]   = useState(null);
  const [tab, setTab]             = useState("edit");       // edit | preview
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [modal, setModal]         = useState(false);
  const [vName, setVName]         = useState("");
  const [loadStep, setLoadStep]   = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [projInput, setProjInput] = useState({ name:"", tech:"", duration:"", desc:"" });
  const [editSection, setEditSection] = useState(null);

  const bg   = dark ? "#060d1a" : "#f0f7ff";
  const card = dark ? "rgba(13,27,46,0.92)"  : "rgba(255,255,255,0.96)";
  const bdr  = dark ? "rgba(59,130,246,0.2)" : "rgba(147,197,253,0.5)";
  const tx   = dark ? "#e2eeff" : "#0f172a";
  const mu   = dark ? "#64748b" : "#94a3b8";
  const iBg  = dark ? "rgba(255,255,255,0.05)" : "#fff";
  const iBdr = dark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.12)";

  const notify = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const sf = (key) => (e) => setForm(p=>({...p,[key]:e.target.value}));

  useEffect(() => { if (user?.id) loadVersions(); }, [user?.id]);

  const loadVersions = async () => {
    const { data } = await supabase.from("resumes")
      .select("id,name,created_at,form_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setVersions(data);
  };

  /* ── Fake Ollama generation ── */
  const generate = () => {
    setScreen("generating");
    setLoadStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setLoadStep(i);
      if (i >= LOADING_STEPS.length) {
        clearInterval(iv);
        // Populate with user data if available
        const resume = {
          ...SDE_RESUME,
          name: user?.name || SDE_RESUME.name,
          email: user?.email || SDE_RESUME.email,
        };
        setForm(resume);
        setTimeout(() => { setScreen("editor"); setTab("edit"); }, 400);
      }
    }, Math.floor((6000 / LOADING_STEPS.length))); // spread across ~6s
  };

  /* ── Save ── */
  const save = async () => {
    if (!user?.id) { notify("Not logged in", "err"); return; }
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        name: vName || `Resume ${new Date().toLocaleDateString("en-IN")}`,
        form_data: form,
        updated_at: new Date().toISOString(),
      };
      if (activeId) {
        const { error } = await supabase.from("resumes").update(payload).eq("id", activeId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("resumes").insert(payload).select().single();
        if (error) throw error;
        if (data) setActiveId(data.id);
      }
      await loadVersions();
      notify("Saved ✓");
    } catch(e) { notify(e.message||"Save failed","err"); }
    finally { setSaving(false); setModal(false); }
  };

  const loadVersion = (v) => {
    setForm(v.form_data);
    setActiveId(v.id);
    setScreen("editor");
    setTab("preview");
    notify(`Loaded: ${v.name}`);
  };

  const deleteVersion = async (id, e) => {
    e.stopPropagation();
    await supabase.from("resumes").delete().eq("id", id);
    if (activeId===id) { setActiveId(null); setForm(null); setScreen("landing"); }
    await loadVersions();
    notify("Deleted");
  };

  /* ─────────────────────────────────────
     SCREENS
  ───────────────────────────────────── */

  /* ══ LANDING ══ */
  if (screen === "landing") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className="rb" style={{ minHeight:"100vh", background:bg, color:tx }}>
        {toast && <Toast toast={toast}/>}
        <div style={{ maxWidth:700, margin:"0 auto", padding:"64px 24px", textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:20 }}>📄</div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:38, fontStyle:"italic", color:tx, marginBottom:12 }}>
            Resume <span className="text-shimmer">Builder</span>
          </h1>
          <p style={{ fontSize:15, color:mu, marginBottom:40, maxWidth:440, margin:"0 auto 40px" }}>
            AI-powered SDE resume builder. Generate, edit, save, and revisit your resumes anytime.
          </p>

          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
            <button className="rb-btn" onClick={generate} style={{ padding:"16px 36px", borderRadius:16, background:"linear-gradient(135deg,#0ea5e9,#3b82f6)", color:"white", fontSize:16 }}>
              ✨ Generate My SDE Resume
            </button>
            {versions.length > 0 && (
              <button className="rb-btn" onClick={()=>setScreen("history")} style={{ padding:"16px 28px", borderRadius:16, background:"transparent", color:mu, fontSize:15, border:`1px solid ${bdr}` }}>
                🕓 My Resumes ({versions.length})
              </button>
            )}
          </div>

          {versions.length > 0 && (
            <div style={{ textAlign:"left" }}>
              <p style={{ fontSize:12, fontWeight:700, color:mu, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>Recent Resumes</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {versions.slice(0,3).map(v=>(
                  <div key={v.id} className="rb-version" onClick={()=>loadVersion(v)} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                    <span style={{ fontSize:22 }}>📄</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:tx }}>{v.name}</div>
                      <div style={{ fontSize:11, color:mu }}>{new Date(v.created_at).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</div>
                    </div>
                    <button onClick={(e)=>deleteVersion(v.id,e)} style={{ fontSize:11, padding:"4px 10px", borderRadius:8, background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"none", cursor:"pointer", fontWeight:700 }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  /* ══ GENERATING ══ */
  if (screen === "generating") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className="rb" style={{ minHeight:"100vh", background:bg, color:tx, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", padding:40 }}>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(14,165,233,0.12)", border:"2px solid rgba(14,165,233,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, margin:"0 auto 24px", animation:"pulse-glow 2s ease-in-out infinite" }}>
            🤖
          </div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontStyle:"italic", color:tx, marginBottom:8 }}>
            Ollama is crafting your resume…
          </h2>
          <p style={{ fontSize:14, color:"#0ea5e9", fontWeight:600, marginBottom:24 }}>
            {LOADING_STEPS[Math.min(loadStep, LOADING_STEPS.length-1)]}
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:32 }}>
            <span className="dot"/><span className="dot"/><span className="dot"/>
          </div>
          {/* Step list */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, width:300, margin:"0 auto", textAlign:"left" }}>
            {LOADING_STEPS.map((step,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:loadStep>i?"#86efac":loadStep===i?"#0ea5e9":mu, fontWeight:loadStep>=i?600:400 }}>
                <span style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, background:loadStep>i?"rgba(34,197,94,0.2)":loadStep===i?"rgba(14,165,233,0.2)":"rgba(100,116,139,0.1)", color:loadStep>i?"#86efac":loadStep===i?"#0ea5e9":mu }}>
                  {loadStep>i?"✓":i+1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  /* ══ HISTORY ══ */
  if (screen === "history") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className="rb" style={{ minHeight:"100vh", background:bg, color:tx }}>
        {toast && <Toast toast={toast}/>}
        <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <button className="rb-btn" onClick={()=>setScreen("landing")} style={{ padding:"8px 16px", borderRadius:12, background:"transparent", color:mu, fontSize:13, border:`1px solid ${bdr}` }}>← Back</button>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontStyle:"italic", color:tx }}>My Resumes</h1>
            <button className="rb-btn" onClick={generate} style={{ marginLeft:"auto", padding:"8px 20px", borderRadius:12, background:"linear-gradient(135deg,#0ea5e9,#3b82f6)", color:"white", fontSize:13 }}>+ New Resume</button>
          </div>
          {versions.length===0 ? (
            <div style={{ textAlign:"center", padding:60, color:mu }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
              <p style={{ fontSize:15, fontWeight:600 }}>No saved resumes yet</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {versions.map(v=>(
                <div key={v.id} className="rb-version" onClick={()=>loadVersion(v)} style={{ background:card, border:`1px solid ${activeId===v.id?"#0ea5e9":bdr}`, borderRadius:16, padding:"18px 22px", display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:activeId===v.id?"rgba(14,165,233,0.18)":(dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:tx, marginBottom:2 }}>{v.name}</div>
                    <div style={{ fontSize:12, color:mu }}>{new Date(v.created_at).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</div>
                    <div style={{ fontSize:12, color:mu }}>{v.form_data?.name} · {v.form_data?.email}</div>
                  </div>
                  {activeId===v.id && <span style={{ fontSize:11, fontWeight:700, color:"#0ea5e9", background:"rgba(14,165,233,0.12)", padding:"3px 10px", borderRadius:20 }}>Active</span>}
                  <button onClick={(e)=>deleteVersion(v.id,e)} style={{ padding:"6px 12px", borderRadius:8, background:"rgba(239,68,68,0.1)", color:"#ef4444", fontWeight:700, fontSize:12, border:"none", cursor:"pointer" }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  /* ══ EDITOR ══ */
  if (screen === "editor" && form) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className="rb" style={{ minHeight:"100vh", background:bg, color:tx }}>
        {toast && <Toast toast={toast}/>}

        {/* Save modal */}
        {modal && (
          <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div className="rb-up" style={{ background:card, border:`1px solid ${bdr}`, borderRadius:20, padding:28, width:340 }}>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, fontStyle:"italic", color:tx, marginBottom:16 }}>Name this version</h3>
              <input autoFocus className="rb-input" placeholder="e.g. SDE Fresher, Internship 2025…" value={vName} onChange={e=>setVName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, marginBottom:16 }}/>
              <div style={{ display:"flex", gap:10 }}>
                <button className="rb-btn" onClick={save} disabled={saving} style={{ flex:1, padding:"10px 0", borderRadius:12, background:"linear-gradient(135deg,#0ea5e9,#3b82f6)", color:"white", fontSize:13 }}>{saving?"Saving…":"Save"}</button>
                <button className="rb-btn" onClick={()=>setModal(false)} style={{ flex:1, padding:"10px 0", borderRadius:12, background:"transparent", color:mu, fontSize:13, border:`1px solid ${bdr}` }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div style={{ position:"sticky", top:0, zIndex:100, background:dark?"rgba(6,13,26,0.92)":"rgba(240,247,255,0.92)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${bdr}`, padding:"12px 24px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }} className="no-print">
          <button className="rb-btn" onClick={()=>setScreen("landing")} style={{ padding:"7px 14px", borderRadius:10, background:"transparent", color:mu, fontSize:13, border:`1px solid ${bdr}` }}>← Back</button>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, fontStyle:"italic", color:tx }}>Resume Editor</span>
          {activeId && <span style={{ fontSize:11, color:"#0ea5e9", fontWeight:700 }}>● {versions.find(v=>v.id===activeId)?.name}</span>}
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            {[["edit","✏️ Edit"],["preview","👁 Preview"]].map(([id,lbl])=>(
              <button key={id} className="rb-btn" onClick={()=>setTab(id)} style={{ padding:"7px 16px", borderRadius:10, fontSize:13, background:tab===id?"linear-gradient(135deg,#0ea5e9,#3b82f6)":(dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)"), color:tab===id?"white":mu }}>
                {lbl}
              </button>
            ))}
            <button className="rb-btn" onClick={()=>setScreen("history")} style={{ padding:"7px 14px", borderRadius:10, fontSize:13, background:"transparent", color:mu, border:`1px solid ${bdr}` }}>🕓 History</button>
            <button className="rb-btn" onClick={()=>{setVName(activeId?versions.find(v=>v.id===activeId)?.name||"":"");setModal(true);}} disabled={saving} style={{ padding:"7px 20px", borderRadius:10, fontSize:13, background:"linear-gradient(135deg,#0ea5e9,#3b82f6)", color:"white" }}>
              {saving?"Saving…":activeId?"💾 Update":"💾 Save"}
            </button>
          </div>
        </div>

        <div style={{ maxWidth:tab==="preview"?800:1000, margin:"0 auto", padding:"28px 20px" }}>

          {/* ── EDIT TAB ── */}
          {tab==="edit" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }} className="rb-up">

              {/* LEFT */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                {/* Basic Info */}
                <EditCard title="Basic Info" dark={dark} card={card} bdr={bdr} mu={mu}>
                  {[["name","Full Name"],["email","Email"],["phone","Phone"],["location","Location"],["linkedin","LinkedIn"],["github","GitHub"]].map(([k,lbl])=>(
                    <EditField key={k} label={lbl} value={form[k]} onChange={sf(k)} iBg={iBg} iBdr={iBdr} tx={tx} mu={mu}/>
                  ))}
                </EditCard>

                {/* Objective */}
                <EditCard title="Objective" dark={dark} card={card} bdr={bdr} mu={mu}>
                  <textarea className="rb-input" rows={5} value={form.objective} onChange={sf("objective")} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, resize:"none" }}/>
                </EditCard>

                {/* Skills */}
                <EditCard title="Skills" dark={dark} card={card} bdr={bdr} mu={mu}>
                  {["languages","frameworks","tools","concepts"].map(cat=>(
                    <div key={cat} style={{ marginBottom:14 }}>
                      <label style={{ fontSize:10, fontWeight:700, color:mu, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{cat}</label>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:6 }}>
                        {(form.skills[cat]||[]).map(s=>(
                          <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, background:"rgba(14,165,233,0.12)", color:"#0ea5e9", border:"1px solid rgba(14,165,233,0.25)" }}>
                            {s}
                            <button onClick={()=>setForm(p=>({...p,skills:{...p.skills,[cat]:p.skills[cat].filter(x=>x!==s)}}))} style={{ background:"none", border:"none", cursor:"pointer", color:"#0ea5e9", fontSize:14, lineHeight:1, padding:0 }}>×</button>
                          </span>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <input className="rb-input" placeholder={`Add ${cat} skill + Enter`} onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){setForm(p=>({...p,skills:{...p.skills,[cat]:[...p.skills[cat],e.target.value.trim()]}}));e.target.value="";}}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, fontSize:12, padding:"8px 12px" }}/>
                      </div>
                    </div>
                  ))}
                </EditCard>

                {/* Achievements */}
                <EditCard title="Achievements" dark={dark} card={card} bdr={bdr} mu={mu}>
                  {form.achievements.map((a,i)=>(
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
                      <input className="rb-input" value={a} onChange={e=>{const arr=[...form.achievements];arr[i]=e.target.value;setForm(p=>({...p,achievements:arr}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, fontSize:13 }}/>
                      <button onClick={()=>setForm(p=>({...p,achievements:p.achievements.filter((_,j)=>j!==i)}))} style={{ padding:"0 10px", borderRadius:8, background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"none", cursor:"pointer", fontWeight:700, flexShrink:0 }}>×</button>
                    </div>
                  ))}
                  <button className="rb-btn" onClick={()=>setForm(p=>({...p,achievements:[...p.achievements,""]}))} style={{ fontSize:12, padding:"6px 14px", borderRadius:8, background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:mu }}>+ Add</button>
                </EditCard>
              </div>

              {/* RIGHT */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                {/* Education */}
                <EditCard title="Education" dark={dark} card={card} bdr={bdr} mu={mu}
                  action={<button className="rb-btn" onClick={()=>setForm(p=>({...p,education:[...p.education,{school:"",degree:"",year:"",score:""}]}))} style={{ fontSize:11, padding:"4px 12px", borderRadius:8, background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:mu }}>+ Add</button>}
                >
                  {form.education.map((edu,i)=>(
                    <div key={i} style={{ marginBottom:14, padding:14, borderRadius:12, background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)", border:`1px solid ${bdr}` }}>
                      {[["school","School"],["degree","Degree / Class"],["year","Year"],["score","Score / %"]].map(([k,lbl])=>(
                        <div key={k} style={{ marginBottom:8 }}>
                          <label style={{ fontSize:10, fontWeight:700, color:mu, display:"block", marginBottom:3 }}>{lbl}</label>
                          <input className="rb-input" value={edu[k]} onChange={e=>{const a=[...form.education];a[i]={...a[i],[k]:e.target.value};setForm(p=>({...p,education:a}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, padding:"8px 12px" }}/>
                        </div>
                      ))}
                      <button onClick={()=>setForm(p=>({...p,education:p.education.filter((_,j)=>j!==i)}))} style={{ fontSize:11, color:"#ef4444", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Remove</button>
                    </div>
                  ))}
                </EditCard>

                {/* Projects */}
                <EditCard title="Projects" dark={dark} card={card} bdr={bdr} mu={mu}
                  action={<button className="rb-btn" onClick={()=>setForm(p=>({...p,projects:[...p.projects,{name:"",tech:"",duration:"",desc:""}]}))} style={{ fontSize:11, padding:"4px 12px", borderRadius:8, background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:mu }}>+ Add</button>}
                >
                  {form.projects.map((proj,i)=>(
                    <div key={i} style={{ marginBottom:14, padding:14, borderRadius:12, background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)", border:`1px solid ${bdr}` }}>
                      {[["name","Project Name"],["tech","Tech Stack"],["duration","Duration"]].map(([k,lbl])=>(
                        <div key={k} style={{ marginBottom:8 }}>
                          <label style={{ fontSize:10, fontWeight:700, color:mu, display:"block", marginBottom:3 }}>{lbl}</label>
                          <input className="rb-input" value={proj[k]} onChange={e=>{const a=[...form.projects];a[i]={...a[i],[k]:e.target.value};setForm(p=>({...p,projects:a}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, padding:"8px 12px" }}/>
                        </div>
                      ))}
                      <div style={{ marginBottom:8 }}>
                        <label style={{ fontSize:10, fontWeight:700, color:mu, display:"block", marginBottom:3 }}>Description</label>
                        <textarea className="rb-input" rows={3} value={proj.desc} onChange={e=>{const a=[...form.projects];a[i]={...a[i],desc:e.target.value};setForm(p=>({...p,projects:a}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, padding:"8px 12px", resize:"none" }}/>
                      </div>
                      <button onClick={()=>setForm(p=>({...p,projects:p.projects.filter((_,j)=>j!==i)}))} style={{ fontSize:11, color:"#ef4444", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Remove</button>
                    </div>
                  ))}
                </EditCard>

                {/* Experience */}
                <EditCard title="Work Experience" dark={dark} card={card} bdr={bdr} mu={mu}
                  action={<button className="rb-btn" onClick={()=>setForm(p=>({...p,experience:[...p.experience,{role:"",org:"",duration:"",desc:""}]}))} style={{ fontSize:11, padding:"4px 12px", borderRadius:8, background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:mu }}>+ Add</button>}
                >
                  {form.experience.length===0 && <p style={{ fontSize:12, color:mu }}>No experience yet — add internships or part-time roles.</p>}
                  {form.experience.map((exp,i)=>(
                    <div key={i} style={{ marginBottom:14, padding:14, borderRadius:12, background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)", border:`1px solid ${bdr}` }}>
                      {[["role","Role"],["org","Organisation"],["duration","Duration"]].map(([k,lbl])=>(
                        <div key={k} style={{ marginBottom:8 }}>
                          <label style={{ fontSize:10, fontWeight:700, color:mu, display:"block", marginBottom:3 }}>{lbl}</label>
                          <input className="rb-input" value={exp[k]} onChange={e=>{const a=[...form.experience];a[i]={...a[i],[k]:e.target.value};setForm(p=>({...p,experience:a}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, padding:"8px 12px" }}/>
                        </div>
                      ))}
                      <div style={{ marginBottom:8 }}>
                        <label style={{ fontSize:10, fontWeight:700, color:mu, display:"block", marginBottom:3 }}>Description</label>
                        <textarea className="rb-input" rows={2} value={exp.desc} onChange={e=>{const a=[...form.experience];a[i]={...a[i],desc:e.target.value};setForm(p=>({...p,experience:a}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, padding:"8px 12px", resize:"none" }}/>
                      </div>
                      <button onClick={()=>setForm(p=>({...p,experience:p.experience.filter((_,j)=>j!==i)}))} style={{ fontSize:11, color:"#ef4444", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Remove</button>
                    </div>
                  ))}
                </EditCard>

                {/* Certifications */}
                <EditCard title="Certifications" dark={dark} card={card} bdr={bdr} mu={mu}
                  action={<button className="rb-btn" onClick={()=>setForm(p=>({...p,certifications:[...p.certifications,{title:"",issuer:"",year:""}]}))} style={{ fontSize:11, padding:"4px 12px", borderRadius:8, background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:mu }}>+ Add</button>}
                >
                  {form.certifications.length===0 && <p style={{ fontSize:12, color:mu }}>No certifications yet.</p>}
                  {form.certifications.map((cert,i)=>(
                    <div key={i} style={{ marginBottom:12, padding:14, borderRadius:12, background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)", border:`1px solid ${bdr}` }}>
                      {[["title","Title"],["issuer","Issuer"],["year","Year"]].map(([k,lbl])=>(
                        <div key={k} style={{ marginBottom:8 }}>
                          <label style={{ fontSize:10, fontWeight:700, color:mu, display:"block", marginBottom:3 }}>{lbl}</label>
                          <input className="rb-input" value={cert[k]} onChange={e=>{const a=[...form.certifications];a[i]={...a[i],[k]:e.target.value};setForm(p=>({...p,certifications:a}));}} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx, padding:"8px 12px" }}/>
                        </div>
                      ))}
                      <button onClick={()=>setForm(p=>({...p,certifications:p.certifications.filter((_,j)=>j!==i)}))} style={{ fontSize:11, color:"#ef4444", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Remove</button>
                    </div>
                  ))}
                </EditCard>

              </div>
            </div>
          )}

          {/* ── PREVIEW TAB ── */}
          {tab==="preview" && (
            <div className="rb-up print-page">
              <div className="no-print" style={{ textAlign:"right", marginBottom:16 }}>
                <button className="rb-btn" onClick={()=>window.print()} style={{ padding:"10px 24px", borderRadius:12, background:"linear-gradient(135deg,#0ea5e9,#3b82f6)", color:"white", fontSize:13 }}>🖨 Print / Save PDF</button>
              </div>
              <ResumePreview form={form}/>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return null;
}

/* ── Sub-components ── */

function Toast({ toast }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, padding:"12px 20px", borderRadius:14, fontSize:13, fontWeight:600, background:toast.type==="err"?"rgba(239,68,68,0.95)":"rgba(34,197,94,0.95)", color:"white", boxShadow:"0 8px 32px rgba(0,0,0,0.2)", animation:"rb-up .3s ease both" }}>
      {toast.type==="err"?"⚠ ":"✓ "}{toast.msg}
    </div>
  );
}

function EditCard({ title, children, dark, card, bdr, mu, action }) {
  return (
    <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:20, padding:22 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h3 style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color:mu }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EditField({ label, value, onChange, iBg, iBdr, tx, mu }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:700, color:mu, marginBottom:5 }}>{label}</label>
      <input className="rb-input" value={value||""} onChange={onChange} style={{ background:iBg, border:`1.5px solid ${iBdr}`, color:tx }}/>
    </div>
  );
}

function ResumePreview({ form }) {
  const divider = <div style={{ height:1, background:"#e2e8f0", margin:"14px 0" }}/>;
  const sectionTitle = (title) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <h2 style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#0ea5e9", whiteSpace:"nowrap" }}>{title}</h2>
      <div style={{ flex:1, height:1, background:"#bfdbfe" }}/>
    </div>
  );

  return (
    <div className="print-resume" style={{ background:"white", borderRadius:20, padding:"44px 52px", color:"#0f172a", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 20px 60px rgba(0,0,0,0.12)", fontSize:13 }}>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{form.name}</h1>
        <div style={{ fontSize:12, color:"#64748b", display:"flex", flexWrap:"wrap", gap:"4px 14px" }}>
          {form.email && <span>✉ {form.email}</span>}
          {form.phone && <span>📞 {form.phone}</span>}
          {form.location && <span>📍 {form.location}</span>}
          {form.linkedin && <span>🔗 {form.linkedin}</span>}
          {form.github && <span>💻 {form.github}</span>}
        </div>
      </div>

      {divider}

      {/* Objective */}
      {form.objective && <>
        {sectionTitle("Objective")}
        <p style={{ fontSize:13, lineHeight:1.75, color:"#334155", marginBottom:14 }}>{form.objective}</p>
      </>}

      {/* Education */}
      {form.education?.length>0 && <>
        {sectionTitle("Education")}
        {form.education.map((e,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{e.degree}</div>
              <div style={{ fontSize:12, color:"#64748b" }}>{e.school}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0, marginLeft:16 }}>
              {e.score && <div style={{ fontSize:13, fontWeight:700, color:"#0ea5e9" }}>{e.score}</div>}
              <div style={{ fontSize:12, color:"#94a3b8" }}>{e.year}</div>
            </div>
          </div>
        ))}
        <div style={{ marginBottom:14 }}/>
      </>}

      {/* Skills */}
      {form.skills && <>
        {sectionTitle("Technical Skills")}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 24px", marginBottom:14 }}>
          {Object.entries(form.skills).filter(([,v])=>v?.length>0).map(([cat,items])=>(
            <div key={cat}>
              <span style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"capitalize" }}>{cat}: </span>
              <span style={{ fontSize:12, color:"#334155" }}>{items.join(", ")}</span>
            </div>
          ))}
        </div>
      </>}

      {/* Projects */}
      {form.projects?.length>0 && <>
        {sectionTitle("Projects")}
        {form.projects.map((p,i)=>(
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{p.name}</span>
              <span style={{ fontSize:11, color:"#94a3b8" }}>{p.duration}</span>
            </div>
            {p.tech && <div style={{ fontSize:12, color:"#0ea5e9", fontWeight:600, marginBottom:3 }}>Tech: {p.tech}</div>}
            {p.desc && <div style={{ fontSize:12, color:"#475569", lineHeight:1.65 }}>{p.desc}</div>}
          </div>
        ))}
      </>}

      {/* Experience */}
      {form.experience?.length>0 && <>
        {sectionTitle("Work Experience")}
        {form.experience.map((e,i)=>(
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, fontSize:14 }}>{e.role}</span>
              <span style={{ fontSize:11, color:"#94a3b8" }}>{e.duration}</span>
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginBottom:3 }}>{e.org}</div>
            {e.desc && <div style={{ fontSize:12, color:"#475569", lineHeight:1.65 }}>{e.desc}</div>}
          </div>
        ))}
      </>}

      {/* Certifications */}
      {form.certifications?.length>0 && <>
        {sectionTitle("Certifications")}
        {form.certifications.map((c,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <div>
              <span style={{ fontWeight:700, fontSize:13 }}>{c.title}</span>
              {c.issuer && <span style={{ fontSize:12, color:"#64748b" }}> — {c.issuer}</span>}
            </div>
            <span style={{ fontSize:12, color:"#94a3b8" }}>{c.year}</span>
          </div>
        ))}
        <div style={{ marginBottom:10 }}/>
      </>}

      {/* Achievements */}
      {form.achievements?.length>0 && <>
        {sectionTitle("Achievements")}
        <ul style={{ paddingLeft:18, margin:0 }}>
          {form.achievements.filter(Boolean).map((a,i)=>(
            <li key={i} style={{ fontSize:12, color:"#334155", marginBottom:5, lineHeight:1.6 }}>{a}</li>
          ))}
        </ul>
      </>}

    </div>
  );
}