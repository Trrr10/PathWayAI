/**
 * Employers.jsx — Browse Employers + AI Resume Builder
 * src/pages/student/Employers.jsx
 */

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/* ── Hardcoded SDE resume ── */
const HARDCODED_RESUME = {
  name: "Sarthak Sharma",
  tagline: "Aspiring Software Development Engineer · Web Dev · DSA · SQL",
  email: "sarthak@gmail.com",
  phone: "+91 98765 43210",
  location: "Mumbai, Maharashtra",
  linkedin: "linkedin.com/in/sarthaksharma",
  summary: "Motivated and detail-oriented Computer Science student with a strong academic record and hands-on experience building full-stack web applications. Proficient in Data Structures & Algorithms, SQL, and modern web technologies. Passionate about writing clean, scalable code and solving real-world engineering challenges. Actively seeking a Software Development Engineer role to contribute to impactful products.",
  education: [
    { school: "SSHS (Senior Secondary High School)", degree: "Class 12 — Science (PCM) · CBSE", year: "2024", score: "95%" },
    { school: "SSHS (Senior Secondary High School)", degree: "Class 10 · CBSE", year: "2022", score: "95%" },
  ],
  skills: ["JavaScript", "React.js", "Node.js", "SQL", "Data Structures & Algorithms", "HTML", "CSS", "Git", "GitHub", "REST APIs", "Problem Solving", "MongoDB"],
  projects: [
    {
      name: "To-Do App",
      tech: "React, Node.js, MongoDB",
      description: "Built a custom full-stack To-Do application with user authentication, task prioritisation, and deadline reminders. Implemented RESTful APIs with Node.js/Express and a responsive React frontend. Reduced task management friction by enabling real-time updates and persistent storage via MongoDB.",
    },
  ],
  experience: [],
  achievements: [
    "Scored 95% in both Class 10 and Class 12 CBSE Board Examinations",
    "Solved 50+ DSA problems on LeetCode covering arrays, linked lists, trees, and dynamic programming",
    "Completed full-stack web development coursework covering React, Node.js, and databases",
  ],
};

const LOADING_STEPS = [
  { msg: "Connecting to Ollama llama3.1…",        sub: "Initialising local model…" },
  { msg: "Analysing your profile & skills…",       sub: "Parsing education, projects, target role…" },
  { msg: "Generating resume structure…",           sub: "Building sections: summary, education, skills…" },
  { msg: "Writing professional summary…",          sub: "Tailoring objective for SDE role…" },
  { msg: "Optimising for ATS keywords…",           sub: "Adding action verbs and impact metrics…" },
  { msg: "Polishing final output…",                sub: "Formatting and reviewing…" },
];

/* ── Employer data ── */
const EMPLOYERS = [
  {
    id: 1, name: "Tata Consultancy Services", short: "TCS",
    logo: "TCS", logoColor: "linear-gradient(135deg,#0057A8,#00AEEF)",
    type: "IT & Services", location: "Pan India",
    roles: ["Software Engineer Intern", "Junior Developer", "Data Analyst"],
    stipend: "₹15,000–₹25,000/mo", openings: 120,
    skills: ["Python", "Java", "SQL", "Communication"],
    badge: "🏢 Fortune 500", verified: true,
    about: "India's largest IT company hiring fresh graduates across all engineering streams.",
  },
  {
    id: 2, name: "Infosys", short: "INFY",
    logo: "INFY", logoColor: "linear-gradient(135deg,#007CC3,#00BCD4)",
    type: "IT & Consulting", location: "Bangalore, Pune, Hyderabad",
    roles: ["Systems Engineer", "Technology Analyst", "Power Programmer"],
    stipend: "₹12,000–₹20,000/mo", openings: 85,
    skills: ["JavaScript", "Python", "Problem Solving", "Agile"],
    badge: "🌍 Global Tech", verified: true,
    about: "Global leader in next-generation digital services and consulting.",
  },
  {
    id: 3, name: "Flipkart", short: "FK",
    logo: "FK", logoColor: "linear-gradient(135deg,#F7931E,#FFB347)",
    type: "E-Commerce", location: "Bangalore",
    roles: ["Product Intern", "Data Science Intern", "Software Dev Intern"],
    stipend: "₹20,000–₹40,000/mo", openings: 30,
    skills: ["Python", "Machine Learning", "Product Thinking", "SQL"],
    badge: "🛒 Top Startup", verified: true,
    about: "India's leading e-commerce marketplace with cutting-edge tech problems to solve.",
  },
  {
    id: 4, name: "Zomato", short: "ZMT",
    logo: "ZMT", logoColor: "linear-gradient(135deg,#E23744,#FF6B6B)",
    type: "Food Tech", location: "Gurgaon (Remote OK)",
    roles: ["Growth Intern", "Data Analyst", "Backend Intern"],
    stipend: "₹18,000–₹35,000/mo", openings: 22,
    skills: ["Analytics", "SQL", "Communication", "Python"],
    badge: "🍕 Unicorn", verified: true,
    about: "Leading food delivery platform solving hyper-local logistics at massive scale.",
  },
  {
    id: 5, name: "ISRO", short: "ISRO",
    logo: "ISRO", logoColor: "linear-gradient(135deg,#FF6600,#FF9900)",
    type: "Space & Research", location: "Bangalore, Ahmedabad",
    roles: ["Junior Research Fellow", "Technical Assistant", "Project Intern"],
    stipend: "₹8,000–₹18,000/mo", openings: 15,
    skills: ["Mathematics", "Physics", "C++", "Research"],
    badge: "🚀 Govt Research", verified: true,
    about: "India's national space agency — work on real satellite missions and space tech.",
  },
  {
    id: 6, name: "Byju's", short: "BYJ",
    logo: "BYJ", logoColor: "linear-gradient(135deg,#6C3CE1,#A78BFA)",
    type: "EdTech", location: "Bangalore (Remote)",
    roles: ["Content Developer", "Tutor Intern", "UX Researcher"],
    stipend: "₹10,000–₹22,000/mo", openings: 40,
    skills: ["Communication", "Subject Expertise", "Curriculum Design"],
    badge: "📚 EdTech Leader", verified: false,
    about: "World's most valued EdTech company creating engaging learning content.",
  },
];

const STEPS = [
  { id: "personal",     title: "Personal Info",   icon: "👤", desc: "Your basic details" },
  { id: "education",    title: "Education",        icon: "🎓", desc: "Schools & scores" },
  { id: "skills",       title: "Skills",           icon: "⚡", desc: "Technical & soft skills" },
  { id: "projects",     title: "Projects",         icon: "🛠", desc: "What you've built" },
  { id: "experience",   title: "Experience",       icon: "💼", desc: "Internships & work" },
  { id: "achievements", title: "Achievements",     icon: "🏆", desc: "Awards & certs" },
  { id: "target",       title: "Target Role",      icon: "🎯", desc: "What you're applying for" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .emp-app { min-height: 100vh; font-family: 'DM Sans', sans-serif; }
  .emp-app.dark  { background: #070E1C; color: #E2EEFF; }
  .emp-app.light { background: #F0F6FF; color: #0F172A; }

  .mesh-fixed { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  @keyframes orb-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
  .orb { position: absolute; border-radius: 50%; animation: orb-float 14s ease-in-out infinite; }

  @keyframes fade-up  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scale-in { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes slide-r  { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }

  .fade-up  { animation: fade-up  0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .scale-in { animation: scale-in 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .slide-r  { animation: slide-r  0.4s cubic-bezier(0.16,1,0.3,1) both; }

  .d1{animation-delay:0.04s} .d2{animation-delay:0.08s} .d3{animation-delay:0.12s}
  .d4{animation-delay:0.16s} .d5{animation-delay:0.2s}  .d6{animation-delay:0.24s}

  .text-shimmer {
    background: linear-gradient(90deg,#38BDF8,#818CF8,#34D399,#38BDF8);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .card { border-radius: 20px; transition: all 0.3s ease; }
  .dark  .card { background: rgba(13,27,46,0.88); border: 1px solid rgba(59,130,246,0.15); backdrop-filter: blur(20px); }
  .light .card { background: rgba(255,255,255,0.92); border: 1px solid rgba(147,197,253,0.4); backdrop-filter: blur(20px); box-shadow: 0 4px 24px rgba(37,99,235,0.07); }

  .emp-card { border-radius: 20px; padding: 22px; transition: all 0.3s ease; cursor: pointer; }
  .dark  .emp-card { background: rgba(13,27,46,0.9); border: 1px solid rgba(59,130,246,0.12); }
  .light .emp-card { background: rgba(255,255,255,0.95); border: 1px solid rgba(147,197,253,0.35); box-shadow: 0 4px 16px rgba(37,99,235,0.06); }
  .emp-card:hover { transform: translateY(-4px); }
  .dark  .emp-card:hover { border-color: rgba(56,189,248,0.4); box-shadow: 0 12px 36px rgba(56,189,248,0.1); }
  .light .emp-card:hover { border-color: rgba(56,189,248,0.5); box-shadow: 0 12px 36px rgba(56,189,248,0.12); }

  .field { width: 100%; padding: 11px 14px; border-radius: 12px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .dark  .field { background: rgba(15,30,55,0.8); border: 1.5px solid rgba(59,130,246,0.2); color: #E2EEFF; }
  .light .field { background: rgba(248,250,252,0.9); border: 1.5px solid rgba(147,197,253,0.4); color: #0F172A; }
  .field:focus { border-color: #38BDF8; box-shadow: 0 0 0 3px rgba(56,189,248,0.15); }
  .field::placeholder { color: #475569; }
  textarea.field { resize: vertical; min-height: 80px; }

  .tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .dark  .tag { background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.25); color: #7DD3FC; }
  .light .tag { background: rgba(219,234,254,0.8); border: 1px solid rgba(147,197,253,0.4); color: #1D4ED8; }
  .tag-x { cursor: pointer; opacity: 0.7; font-size: 14px; line-height: 1; }
  .tag-x:hover { opacity: 1; }

  .step-dot  { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; transition: all 0.3s; flex-shrink: 0; }
  .step-line { flex: 1; height: 2px; transition: background 0.3s; }

  .resume-wrap { font-family: 'Crimson Pro', serif; line-height: 1.6; }
  .resume-section-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; padding-bottom: 4px; margin-bottom: 12px; }

  .editable { position: relative; border-radius: 6px; transition: all 0.2s; cursor: text; }
  .editable:hover::after { content: '✎ edit'; position: absolute; top: -20px; right: 0; font-size: 10px; font-weight: 700; color: #38BDF8; background: rgba(56,189,248,0.1); padding: 2px 6px; border-radius: 4px; font-family: 'DM Sans', sans-serif; pointer-events: none; white-space: nowrap; }
  .editable.edited::before { content: '●'; position: absolute; top: 2px; left: -12px; font-size: 8px; color: #F59E0B; }
  .editable:hover { background: rgba(56,189,248,0.07); outline: 1px dashed rgba(56,189,248,0.4); }
  .editable:focus-within { background: rgba(56,189,248,0.08); outline: 2px solid #38BDF8; }

  .version-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .dark  .version-pill { background: rgba(15,30,55,0.8); border: 1px solid rgba(59,130,246,0.2); color: #64748B; }
  .light .version-pill { background: rgba(241,245,249,0.9); border: 1px solid rgba(147,197,253,0.4); color: #94A3B8; }
  .version-pill.active { border-color: #38BDF8; color: #38BDF8; background: rgba(56,189,248,0.1); }
  .version-pill:hover  { border-color: #38BDF8; color: #38BDF8; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 12px 26px; border-radius: 13px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; transition: all 0.2s; }
  .btn-primary { background: linear-gradient(135deg,#0EA5E9,#3B82F6); color: white; box-shadow: 0 4px 14px rgba(14,165,233,0.35); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(14,165,233,0.45); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-ghost { background: transparent; }
  .dark  .btn-ghost { border: 1px solid rgba(59,130,246,0.25); color: #94A3B8; }
  .light .btn-ghost { border: 1px solid rgba(147,197,253,0.5); color: #64748B; }
  .btn-ghost:hover { border-color: #38BDF8; color: #38BDF8; }
  .btn-amber { background: linear-gradient(135deg,#F59E0B,#F97316); color: white; box-shadow: 0 4px 14px rgba(245,158,11,0.35); }
  .btn-amber:hover { transform: translateY(-2px); }

  .pill { padding: 4px 11px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .dark  .pill { background: rgba(56,189,248,0.12); color: #7DD3FC; border: 1px solid rgba(56,189,248,0.2); }
  .light .pill { background: rgba(219,234,254,0.8); color: #1D4ED8; border: 1px solid rgba(147,197,253,0.4); }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 3px; }

  .lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px; display: block; color: #64748B; }
  .vbadge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ADE80; }
  .changed-dot { width: 7px; height: 7px; border-radius: 50%; background: #F59E0B; display: inline-block; margin-left: 4px; animation: pulse 1.5s ease-in-out infinite; }

  /* Generating dots */
  .gen-dot { width: 11px; height: 11px; border-radius: 50%; background: #38BDF8; display: inline-block; }
  .gen-dot:nth-child(1){animation:dot-bounce 1.4s 0s infinite ease-in-out}
  .gen-dot:nth-child(2){animation:dot-bounce 1.4s .2s infinite ease-in-out}
  .gen-dot:nth-child(3){animation:dot-bounce 1.4s .4s infinite ease-in-out}
`;

/* ── TagInput ── */
function TagInput({ tags, onChange, placeholder, dark }) {
  const [input, setInput] = useState("");
  const add = (val) => { const v = val.trim(); if (v && !tags.includes(v)) onChange([...tags, v]); setInput(""); };
  const remove = (t) => onChange(tags.filter(x => x !== t));
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"8px 10px", borderRadius:12, border:`1.5px solid ${dark?"rgba(59,130,246,0.2)":"rgba(147,197,253,0.4)"}`, background:dark?"rgba(15,30,55,0.8)":"rgba(248,250,252,0.9)", minHeight:44, alignItems:"center" }}>
      {tags.map(t => <span key={t} className="tag">{t}<span className="tag-x" onClick={()=>remove(t)}>×</span></span>)}
      <input value={input} placeholder={tags.length===0?placeholder:"Add more…"} onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();add(input);}if(e.key==="Backspace"&&!input&&tags.length)remove(tags[tags.length-1]);}}
        onBlur={()=>input&&add(input)}
        style={{ border:"none", background:"transparent", outline:"none", fontSize:13, color:dark?"#E2EEFF":"#0F172A", fontFamily:"'DM Sans',sans-serif", minWidth:120, flex:1 }}/>
    </div>
  );
}

/* ── EditableField ── */
function EditableField({ value, onChange, multiline, style, className, isEdited }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const commit = () => { setEditing(false); if (draft !== value) onChange(draft); };
  if (editing) {
    const shared = { value:draft, onChange:e=>setDraft(e.target.value), onBlur:commit, onKeyDown:e=>{if(!multiline&&e.key==="Enter")commit();if(e.key==="Escape"){setDraft(value);setEditing(false);}}, autoFocus:true, style:{...style,background:"rgba(56,189,248,0.08)",border:"2px solid #38BDF8",borderRadius:6,padding:"2px 6px",outline:"none",fontFamily:"inherit",fontSize:"inherit",fontWeight:"inherit",color:"inherit",width:"100%",resize:multiline?"vertical":"none"} };
    return multiline ? <textarea rows={3} {...shared}/> : <input {...shared}/>;
  }
  return (
    <span className={`editable ${isEdited?"edited":""} ${className||""}`} style={{...style,display:"block",padding:"2px 4px",cursor:"text",position:"relative"}} onClick={()=>{setDraft(value);setEditing(true);}}>
      {value||<span style={{opacity:0.4,fontStyle:"italic"}}>Click to edit…</span>}
      {isEdited&&<span className="changed-dot" title="Edited"/>}
    </span>
  );
}

/* ── ResumeViewer ── */
function ResumeViewer({ resume, onEdit, editedFields, dark }) {
  const t  = dark ? "#E2EEFF" : "#1A1A2E";
  const m  = dark ? "#94A3B8" : "#64748B";
  const ac = "#1D4ED8";
  const divColor = dark ? "rgba(59,130,246,0.3)" : "#CBD5E1";
  const field = (key, val, opts={}) => (
    <EditableField value={val||""} onChange={v=>onEdit(key,v)} isEdited={editedFields.has(key)} multiline={opts.multiline} style={opts.style}/>
  );
  return (
    <div className="resume-wrap" style={{ background:dark?"#0D1B2E":"#FFFFFF", color:t, padding:"40px 44px", borderRadius:16, maxWidth:760, margin:"0 auto", boxShadow:dark?"0 20px 60px rgba(0,0,0,0.6)":"0 20px 60px rgba(37,99,235,0.12)", position:"relative" }}>
      <div style={{ textAlign:"center", marginBottom:28, paddingBottom:24, borderBottom:`2px solid ${divColor}` }}>
        {field("name", resume.name, { style:{fontFamily:"'Syne',sans-serif",fontSize:30,fontWeight:800,color:t,textAlign:"center",letterSpacing:"-0.5px"} })}
        {field("tagline", resume.tagline, { style:{fontSize:13,color:ac,fontWeight:600,textAlign:"center",marginTop:4} })}
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:16, marginTop:10, fontSize:12, color:m }}>
          {field("email", resume.email, { style:{fontSize:12,color:m} })}
          <span>·</span>{field("phone", resume.phone, { style:{fontSize:12,color:m} })}
          <span>·</span>{field("location", resume.location, { style:{fontSize:12,color:m} })}
          {resume.linkedin&&<><span>·</span>{field("linkedin",resume.linkedin,{style:{fontSize:12,color:ac}})}</>}
        </div>
      </div>
      {resume.summary&&(
        <div style={{ marginBottom:24 }}>
          <div className="resume-section-title" style={{ color:ac, borderBottom:`1.5px solid ${divColor}` }}>Professional Summary</div>
          {field("summary", resume.summary, { multiline:true, style:{fontSize:14,color:t,lineHeight:1.7} })}
        </div>
      )}
      {resume.education?.length>0&&(
        <div style={{ marginBottom:24 }}>
          <div className="resume-section-title" style={{ color:ac, borderBottom:`1.5px solid ${divColor}` }}>Education</div>
          {resume.education.map((edu,i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap" }}>
                {field(`edu_${i}_school`, edu.school, { style:{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:t} })}
                {field(`edu_${i}_year`, edu.year, { style:{fontSize:12,color:m,fontStyle:"italic"} })}
              </div>
              {field(`edu_${i}_degree`, edu.degree, { style:{fontSize:13,color:m,marginTop:2} })}
              {edu.score&&field(`edu_${i}_score`, edu.score, { style:{fontSize:12,color:ac,fontWeight:600,marginTop:2} })}
            </div>
          ))}
        </div>
      )}
      {resume.skills?.length>0&&(
        <div style={{ marginBottom:24 }}>
          <div className="resume-section-title" style={{ color:ac, borderBottom:`1.5px solid ${divColor}` }}>Skills</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {resume.skills.map((s,i)=>(
              <span key={i} style={{ padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:600, background:dark?"rgba(29,78,216,0.2)":"rgba(219,234,254,0.8)", border:`1px solid ${dark?"rgba(59,130,246,0.3)":"rgba(147,197,253,0.5)"}`, color:dark?"#93C5FD":"#1D4ED8", fontFamily:"'DM Sans',sans-serif" }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {resume.projects?.length>0&&(
        <div style={{ marginBottom:24 }}>
          <div className="resume-section-title" style={{ color:ac, borderBottom:`1.5px solid ${divColor}` }}>Projects</div>
          {resume.projects.map((p,i)=>(
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap", gap:8 }}>
                {field(`proj_${i}_name`, p.name, { style:{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:t} })}
                {p.tech&&field(`proj_${i}_tech`, p.tech, { style:{fontSize:11,color:ac,fontWeight:600} })}
              </div>
              {field(`proj_${i}_desc`, p.description, { multiline:true, style:{fontSize:13,color:m,marginTop:4,lineHeight:1.65} })}
            </div>
          ))}
        </div>
      )}
      {resume.experience?.length>0&&(
        <div style={{ marginBottom:24 }}>
          <div className="resume-section-title" style={{ color:ac, borderBottom:`1.5px solid ${divColor}` }}>Experience</div>
          {resume.experience.map((ex,i)=>(
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                {field(`exp_${i}_role`, ex.role, { style:{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:t} })}
                {field(`exp_${i}_duration`, ex.duration, { style:{fontSize:12,color:m,fontStyle:"italic"} })}
              </div>
              {field(`exp_${i}_company`, ex.company, { style:{fontSize:13,color:ac,fontWeight:600,marginTop:2} })}
              {field(`exp_${i}_desc`, ex.description, { multiline:true, style:{fontSize:13,color:m,marginTop:4,lineHeight:1.65} })}
            </div>
          ))}
        </div>
      )}
      {resume.achievements?.length>0&&(
        <div style={{ marginBottom:24 }}>
          <div className="resume-section-title" style={{ color:ac, borderBottom:`1.5px solid ${divColor}` }}>Achievements & Certifications</div>
          {resume.achievements.map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
              <span style={{ color:ac, marginTop:2, flexShrink:0 }}>▸</span>
              {field(`ach_${i}`, a, { style:{fontSize:13,color:t} })}
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign:"center", paddingTop:20, borderTop:`1px solid ${divColor}`, marginTop:8 }}>
        <span style={{ fontSize:10, color:dark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)", fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:"0.1em" }}>
          BUILT WITH PATHWAYAI · VERIFIED CREDENTIALS
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────
   MAIN
───────────────────────── */
export default function Employers() {
  const navigate = useNavigate();
  const { dark, toggleDark, user } = useApp();

  const [screen, setScreen]   = useState("employers");
  const [wizStep, setWizStep] = useState(0);
  const [loadStep, setLoadStep] = useState(0);

  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: "", location: "",
    linkedin: "", github: "",
    school: "", schoolYear: "", schoolScore: "",
    college: "", degree: "", collegeYear: "", collegeScore: "",
    techSkills: [], softSkills: [],
    projects: [{ name: "", tech: "", description: "" }],
    experience: [{ role: "", company: "", duration: "", description: "" }],
    achievements: [""],
    targetRole: "", targetCompany: "", targetTone: "professional",
  });

  const [resume, setResume]             = useState(null);
  const [editedFields, setEditedFields] = useState(new Set());
  const [versions, setVersions]         = useState([]);
  const [activeVersion, setActiveVersion] = useState(0);
  const [genError, setGenError]         = useState(null);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const theme = dark ? "dark" : "light";
  const t  = dark ? "#E2EEFF" : "#0F172A";
  const m  = dark ? "#64748B" : "#94A3B8";
  const cardStyle = { background:dark?"rgba(13,27,46,0.88)":"rgba(255,255,255,0.92)", border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.4)"}`, backdropFilter:"blur(20px)", borderRadius:20 };

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const canNext = () => {
    if (wizStep === 0) return form.name && form.email;
    if (wizStep === 1) return form.school;
    if (wizStep === 2) return form.techSkills.length > 0;
    return true;
  };

  /* ── FAKE Ollama generation — no API, instant hardcoded resume ── */
  const generateResume = () => {
    setScreen("generating");
    setGenError(null);
    setLoadStep(0);

    let i = 0;
    const iv = setInterval(() => {
      i++;
      setLoadStep(i);
      if (i >= LOADING_STEPS.length) {
        clearInterval(iv);
        // Merge user-entered name/email into the hardcoded resume
        const built = {
          ...HARDCODED_RESUME,
          name:  form.name  || HARDCODED_RESUME.name,
          email: form.email || HARDCODED_RESUME.email,
          phone: form.phone || HARDCODED_RESUME.phone,
          location: form.location || HARDCODED_RESUME.location,
          linkedin: form.linkedin || HARDCODED_RESUME.linkedin,
          // Merge wizard skills if user added any
          skills: form.techSkills.length > 0
            ? [...new Set([...form.techSkills, ...form.softSkills, ...HARDCODED_RESUME.skills])].slice(0, 16)
            : HARDCODED_RESUME.skills,
          // Merge wizard projects if user added any
          projects: form.projects.filter(p => p.name).length > 0
            ? form.projects.filter(p => p.name).map(p => ({ name:p.name, tech:p.tech, description:p.description }))
            : HARDCODED_RESUME.projects,
          // Merge achievements
          achievements: form.achievements.filter(Boolean).length > 1
            ? form.achievements.filter(Boolean)
            : HARDCODED_RESUME.achievements,
        };

        setTimeout(() => {
          const initial = { label: "AI Draft v1", resume: built, editedFields: new Set() };
          setVersions([initial]);
          setActiveVersion(0);
          setResume(built);
          setEditedFields(new Set());
          setScreen("resume");
        }, 300);
      }
    }, Math.floor(7000 / LOADING_STEPS.length)); // spread over ~7 seconds
  };

  /* ── Edit a field ── */
  const handleEdit = useCallback((key, value) => {
    setVersions(prev => {
      const newVersions = [...prev];
      if (!editedFields.has(key)) {
        newVersions.push({ label: `Edit ${editedFields.size + 1}`, resume: { ...resume }, editedFields: new Set(editedFields), editedKey: key });
      }
      return newVersions;
    });
    setResume(prev => {
      const parts = key.split("_");
      if (parts[0]==="edu")  { const i=parseInt(parts[1]),f=parts.slice(2).join("_"),a=[...(prev.education||[])];  a[i]={...a[i],[f]:value}; return {...prev,education:a}; }
      if (parts[0]==="proj") { const i=parseInt(parts[1]),f=parts.slice(2).join("_"),a=[...(prev.projects||[])];   a[i]={...a[i],[f]:value}; return {...prev,projects:a}; }
      if (parts[0]==="exp")  { const i=parseInt(parts[1]),f=parts.slice(2).join("_"),a=[...(prev.experience||[])]; a[i]={...a[i],[f]:value}; return {...prev,experience:a}; }
      if (parts[0]==="ach")  { const i=parseInt(parts[1]),a=[...(prev.achievements||[])]; a[i]=value; return {...prev,achievements:a}; }
      return { ...prev, [key]: value };
    });
    setEditedFields(prev => new Set([...prev, key]));
    setActiveVersion(versions.length);
  }, [resume, editedFields, versions]);

  const restoreVersion = (idx) => {
    const v = versions[idx];
    if (!v) return;
    setResume({ ...v.resume });
    setEditedFields(new Set(v.editedFields));
    setActiveVersion(idx);
  };

  /* ── Wizard steps ── */
  const renderWizStep = () => {
    switch (wizStep) {
      case 0: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><span className="lbl">Full Name *</span><input className="field" value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Your Name"/></div>
            <div><span className="lbl">Email *</span><input className="field" type="email" value={form.email} onChange={e=>setF("email",e.target.value)} placeholder="you@email.com"/></div>
            <div><span className="lbl">Phone</span><input className="field" value={form.phone} onChange={e=>setF("phone",e.target.value)} placeholder="+91 98765 43210"/></div>
            <div><span className="lbl">City / Location</span><input className="field" value={form.location} onChange={e=>setF("location",e.target.value)} placeholder="Mumbai, Maharashtra"/></div>
            <div><span className="lbl">LinkedIn URL</span><input className="field" value={form.linkedin} onChange={e=>setF("linkedin",e.target.value)} placeholder="linkedin.com/in/you"/></div>
            <div><span className="lbl">GitHub (optional)</span><input className="field" value={form.github} onChange={e=>setF("github",e.target.value)} placeholder="github.com/you"/></div>
          </div>
        </div>
      );
      case 1: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:t, marginBottom:12 }}>🏫 School / Class 10–12</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              <div style={{ gridColumn:"span 3" }}><span className="lbl">School Name *</span><input className="field" value={form.school} onChange={e=>setF("school",e.target.value)} placeholder="SSHS, Delhi Public School…"/></div>
              <div><span className="lbl">Board & Stream</span><input className="field" value={form.schoolYear} onChange={e=>setF("schoolYear",e.target.value)} placeholder="CBSE · Science"/></div>
              <div><span className="lbl">Year</span><input className="field" value={form.collegeYear} onChange={e=>setF("collegeYear",e.target.value)} placeholder="2024"/></div>
              <div><span className="lbl">Score / %</span><input className="field" value={form.schoolScore} onChange={e=>setF("schoolScore",e.target.value)} placeholder="95%"/></div>
            </div>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:t, marginBottom:12 }}>🎓 College / University (if applicable)</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ gridColumn:"span 2" }}><span className="lbl">College Name</span><input className="field" value={form.college} onChange={e=>setF("college",e.target.value)} placeholder="COEP, IIT, NIT…"/></div>
              <div><span className="lbl">Degree / Branch</span><input className="field" value={form.degree} onChange={e=>setF("degree",e.target.value)} placeholder="B.Tech Computer Engineering"/></div>
              <div><span className="lbl">Year / CGPA</span><input className="field" value={form.collegeScore} onChange={e=>setF("collegeScore",e.target.value)} placeholder="2nd Year · 8.7 CGPA"/></div>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div>
            <span className="lbl">Technical Skills * <span style={{ textTransform:"none", fontWeight:400 }}>(press Enter or comma after each)</span></span>
            <TagInput tags={form.techSkills} onChange={v=>setF("techSkills",v)} placeholder="React, SQL, DSA, Python…" dark={dark}/>
          </div>
          <div>
            <span className="lbl">Soft Skills</span>
            <TagInput tags={form.softSkills} onChange={v=>setF("softSkills",v)} placeholder="Communication, Leadership…" dark={dark}/>
          </div>
          <div style={{ padding:"12px 16px", borderRadius:12, background:dark?"rgba(56,189,248,0.08)":"rgba(219,234,254,0.5)", border:`1px solid ${dark?"rgba(56,189,248,0.2)":"rgba(147,197,253,0.4)"}` }}>
            <p style={{ fontSize:12, color:"#38BDF8", fontWeight:700, marginBottom:8 }}>🎯 Quick add from your PathwayAI profile:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {["Web Development","SQL","Data Structures & Algorithms","Problem Solving"].map(s=>(
                <button key={s} onClick={()=>!form.techSkills.includes(s)&&setF("techSkills",[...form.techSkills,s])} style={{ padding:"4px 12px", borderRadius:20, border:"1px solid rgba(56,189,248,0.4)", background:"transparent", color:"#38BDF8", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>+ {s}</button>
              ))}
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <p style={{ fontSize:13, color:m }}>Add your best 1–3 projects.</p>
          {form.projects.map((p,i)=>(
            <div key={i} style={{ padding:16, borderRadius:14, border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.3)"}`, background:dark?"rgba(15,30,55,0.5)":"rgba(248,250,252,0.7)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:13, fontWeight:700, color:t }}>Project {i+1}</span>
                {i>0&&<button onClick={()=>setF("projects",form.projects.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"#EF4444", cursor:"pointer", fontSize:18 }}>×</button>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div><span className="lbl">Project Name</span><input className="field" value={p.name} onChange={e=>{const ps=[...form.projects];ps[i].name=e.target.value;setF("projects",ps);}} placeholder="To-Do App"/></div>
                <div><span className="lbl">Tech Stack</span><input className="field" value={p.tech} onChange={e=>{const ps=[...form.projects];ps[i].tech=e.target.value;setF("projects",ps);}} placeholder="React, Node.js, MongoDB"/></div>
              </div>
              <div><span className="lbl">Description</span><textarea className="field" rows={2} value={p.description} onChange={e=>{const ps=[...form.projects];ps[i].description=e.target.value;setF("projects",ps);}} placeholder="Built a custom to-do app…"/></div>
            </div>
          ))}
          {form.projects.length<3&&<button onClick={()=>setF("projects",[...form.projects,{name:"",tech:"",description:""}])} className="btn btn-ghost" style={{ alignSelf:"flex-start" }}>+ Add Project</button>}
        </div>
      );
      case 4: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <p style={{ fontSize:13, color:m }}>Add internships or part-time jobs. Skip if none.</p>
          {form.experience.map((ex,i)=>(
            <div key={i} style={{ padding:16, borderRadius:14, border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.3)"}`, background:dark?"rgba(15,30,55,0.5)":"rgba(248,250,252,0.7)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:13, fontWeight:700, color:t }}>Experience {i+1}</span>
                {i>0&&<button onClick={()=>setF("experience",form.experience.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"#EF4444", cursor:"pointer", fontSize:18 }}>×</button>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div><span className="lbl">Role</span><input className="field" value={ex.role} onChange={e=>{const es=[...form.experience];es[i].role=e.target.value;setF("experience",es);}} placeholder="Software Intern"/></div>
                <div><span className="lbl">Company</span><input className="field" value={ex.company} onChange={e=>{const es=[...form.experience];es[i].company=e.target.value;setF("experience",es);}} placeholder="TCS, Startup…"/></div>
                <div><span className="lbl">Duration</span><input className="field" value={ex.duration} onChange={e=>{const es=[...form.experience];es[i].duration=e.target.value;setF("experience",es);}} placeholder="Jun–Aug 2024"/></div>
              </div>
              <div><span className="lbl">Key Achievements</span><textarea className="field" rows={2} value={ex.description} onChange={e=>{const es=[...form.experience];es[i].description=e.target.value;setF("experience",es);}} placeholder="What did you build / achieve?"/></div>
            </div>
          ))}
          {form.experience.length<3&&<button onClick={()=>setF("experience",[...form.experience,{role:"",company:"",duration:"",description:""}])} className="btn btn-ghost" style={{ alignSelf:"flex-start" }}>+ Add Experience</button>}
        </div>
      );
      case 5: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <p style={{ fontSize:13, color:m }}>Awards, certifications, competitions…</p>
          {form.achievements.map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
              <input className="field" style={{ flex:1 }} value={a} onChange={e=>{const ac=[...form.achievements];ac[i]=e.target.value;setF("achievements",ac);}} placeholder="State Math Olympiad Winner 2023"/>
              {i>0&&<button onClick={()=>setF("achievements",form.achievements.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"#EF4444", cursor:"pointer", fontSize:20, padding:"0 4px" }}>×</button>}
            </div>
          ))}
          {form.achievements.length<6&&<button onClick={()=>setF("achievements",[...form.achievements,""])} className="btn btn-ghost" style={{ alignSelf:"flex-start" }}>+ Add</button>}
        </div>
      );
      case 6: return (
        <div className="slide-r" style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <p style={{ fontSize:13, color:m }}>Tell Llama what role you're targeting.</p>
          <div><span className="lbl">Target Job Role *</span><input className="field" value={form.targetRole} onChange={e=>setF("targetRole",e.target.value)} placeholder="Software Engineer Intern, SDE…"/></div>
          <div><span className="lbl">Target Company (optional)</span><input className="field" value={form.targetCompany} onChange={e=>setF("targetCompany",e.target.value)} placeholder="TCS, Flipkart, Google…"/></div>
          <div>
            <span className="lbl">Resume Tone</span>
            <div style={{ display:"flex", gap:8 }}>
              {[{id:"professional",label:"Professional",desc:"Corporate & formal"},{id:"dynamic",label:"Dynamic",desc:"Bold & energetic"},{id:"academic",label:"Academic",desc:"Research-focused"}].map(tone=>(
                <button key={tone.id} onClick={()=>setF("targetTone",tone.id)} style={{ flex:1, padding:"10px 8px", borderRadius:12, border:`2px solid ${form.targetTone===tone.id?"#38BDF8":(dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.3)")}`, background:form.targetTone===tone.id?(dark?"rgba(56,189,248,0.12)":"rgba(219,234,254,0.6)"):"transparent", color:form.targetTone===tone.id?"#38BDF8":m, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                  {tone.label}<br/><span style={{ fontWeight:400, fontSize:11 }}>{tone.desc}</span>
                </button>
              ))}
            </div>
          </div>
          {selectedEmployer&&(
            <div style={{ padding:"12px 16px", borderRadius:12, background:dark?"rgba(56,189,248,0.08)":"rgba(219,234,254,0.5)", border:`1px solid ${dark?"rgba(56,189,248,0.2)":"rgba(147,197,253,0.4)"}` }}>
              <p style={{ fontSize:12, color:"#38BDF8", fontWeight:700, marginBottom:4 }}>🎯 Optimising for {selectedEmployer.name}</p>
              <p style={{ fontSize:12, color:m }}>Skills tailored for: {selectedEmployer.skills.join(", ")}</p>
            </div>
          )}
        </div>
      );
      default: return null;
    }
  };

  const MeshBg = () => (
    <div className="mesh-fixed">
      <div style={{ position:"absolute", inset:0, background:dark?"radial-gradient(ellipse at 25% 25%,#0d2744 0%,#070E1C 65%)":"radial-gradient(ellipse at 25% 25%,#dbeafe 0%,#F0F6FF 65%)" }}/>
      <div className="orb" style={{ width:500, height:500, top:"-10%", right:"-8%", background:dark?"radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%)":"radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%)" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:dark?"linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px)":"linear-gradient(rgba(56,189,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>
    </div>
  );

  const DarkToggle = () => (
    <button onClick={toggleDark} style={{ width:46, height:24, borderRadius:12, border:"none", cursor:"pointer", background:dark?"#0284c7":"#e2e8f0", padding:2, display:"flex", alignItems:"center" }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:"white", transform:dark?"translateX(22px)":"translateX(0)", transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>{dark?"🌙":"☀"}</div>
    </button>
  );

  /* ── SCREEN: Employers ── */
  if (screen === "employers") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className={`emp-app ${theme}`}>
        <MeshBg/>
        <div style={{ position:"sticky", top:0, zIndex:50, background:dark?"rgba(7,14,28,0.88)":"rgba(240,246,255,0.88)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${dark?"rgba(56,189,248,0.1)":"rgba(147,197,253,0.4)"}`, padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>navigate("/student/dashboard")} className="btn btn-ghost" style={{ padding:"7px 14px", fontSize:13 }}>← Dashboard</button>
          <div style={{ flex:1, fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:t }}>💼 Browse Employers</div>
          <button className="btn btn-amber" onClick={()=>setScreen("wizard")}>✨ Build AI Resume</button>
          <DarkToggle/>
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:960, margin:"0 auto", padding:"32px 20px" }}>
          <div className="fade-up" style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:20, background:dark?"rgba(56,189,248,0.1)":"rgba(219,234,254,0.8)", border:`1px solid ${dark?"rgba(56,189,248,0.25)":"rgba(147,197,253,0.5)"}`, marginBottom:16 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#38BDF8", textTransform:"uppercase" }}>{EMPLOYERS.length} Employers Actively Hiring</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,5vw,42px)", fontWeight:800, lineHeight:1.1, marginBottom:10 }}>
              <span style={{ color:t }}>Your Career </span><span className="text-shimmer">Starts Here</span>
            </h1>
            <p style={{ fontSize:15, color:m, maxWidth:480, margin:"0 auto 24px" }}>Browse top companies hiring from PathwayAI. Select one to tailor your AI resume.</p>
            <button className="btn btn-amber" style={{ fontSize:15, padding:"14px 36px" }} onClick={()=>setScreen("wizard")}>✨ Generate My AI Resume with Llama</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:18 }}>
            {EMPLOYERS.map((emp,i)=>(
              <div key={emp.id} className={`emp-card fade-up d${(i%6)+1}`}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:emp.logoColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:900, color:"white", flexShrink:0 }}>{emp.logo}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:t }}>{emp.name}</span>
                      {emp.verified&&<span className="vbadge">✓ Verified</span>}
                    </div>
                    <div style={{ fontSize:12, color:m }}>{emp.type} · {emp.location}</div>
                  </div>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:dark?"rgba(34,197,94,0.12)":"rgba(220,252,231,0.7)", border:"1px solid rgba(34,197,94,0.3)", color:"#4ADE80", whiteSpace:"nowrap" }}>{emp.openings} openings</span>
                </div>
                <p style={{ fontSize:13, color:m, marginBottom:12, lineHeight:1.55 }}>{emp.about}</p>
                <div style={{ marginBottom:12 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Open Roles</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{emp.roles.map(r=><span key={r} className="pill">{r}</span>)}</div>
                </div>
                <div style={{ marginBottom:16, padding:"10px 12px", borderRadius:10, background:dark?"rgba(15,30,55,0.6)":"rgba(241,245,249,0.8)" }}>
                  <p style={{ fontSize:11, fontWeight:700, color:m, marginBottom:6 }}>Skills they want:</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {emp.skills.map((s,i)=><span key={s} style={{ fontSize:11, color:m }}>{i>0&&<span style={{ marginRight:5 }}>·</span>}{s}</span>)}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn btn-primary" style={{ flex:1, fontSize:13 }} onClick={()=>{setSelectedEmployer(emp);setF("targetCompany",emp.name);setF("targetRole",emp.roles[0]);setScreen("wizard");}}>
                    ✨ Build Resume for {emp.short}
                  </button>
                  <div style={{ padding:"10px 14px", borderRadius:12, background:dark?"rgba(15,30,55,0.7)":"rgba(241,245,249,0.8)", border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(147,197,253,0.3)"}`, fontSize:13, fontWeight:700, color:"#38BDF8" }}>{emp.stipend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  /* ── SCREEN: Wizard ── */
  if (screen === "wizard") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className={`emp-app ${theme}`}>
        <MeshBg/>
        <div style={{ position:"sticky", top:0, zIndex:50, background:dark?"rgba(7,14,28,0.9)":"rgba(240,246,255,0.9)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${dark?"rgba(56,189,248,0.1)":"rgba(147,197,253,0.4)"}`, padding:"14px 24px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setScreen("employers")} className="btn btn-ghost" style={{ padding:"7px 14px", fontSize:13 }}>← Back</button>
          <div style={{ flex:1, fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:t }}>
            ✨ AI Resume Builder
            {selectedEmployer&&<span style={{ fontSize:13, fontWeight:400, color:m, marginLeft:8 }}>· For {selectedEmployer.name}</span>}
          </div>
          <span style={{ fontSize:12, color:m, fontWeight:600 }}>Step {wizStep+1} of {STEPS.length}</span>
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:680, margin:"0 auto", padding:"32px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:36 }}>
            {STEPS.map((s,i)=>(
              <div key={s.id} style={{ display:"contents" }}>
                <div className="step-dot" style={{ background:i<wizStep?"#22C55E":i===wizStep?"#38BDF8":(dark?"rgba(59,130,246,0.12)":"rgba(147,197,253,0.2)"), color:i<=wizStep?"white":m, cursor:i<wizStep?"pointer":"default", boxShadow:i===wizStep?"0 0 0 4px rgba(56,189,248,0.2)":"none" }} onClick={()=>i<wizStep&&setWizStep(i)} title={s.title}>
                  {i<wizStep?"✓":s.icon}
                </div>
                {i<STEPS.length-1&&<div className="step-line" style={{ background:i<wizStep?"#22C55E":(dark?"rgba(59,130,246,0.1)":"rgba(147,197,253,0.3)") }}/>}
              </div>
            ))}
          </div>
          <div style={{ ...cardStyle, padding:28, marginBottom:20 }}>
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:t, marginBottom:4 }}>{STEPS[wizStep].icon} {STEPS[wizStep].title}</h2>
              <p style={{ fontSize:13, color:m }}>{STEPS[wizStep].desc}</p>
            </div>
            {renderWizStep()}
          </div>
          {genError&&<div style={{ padding:"12px 18px", borderRadius:12, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#F87171", fontSize:13, marginBottom:16 }}>⚠ {genError}</div>}
          <div style={{ display:"flex", gap:10, justifyContent:"space-between" }}>
            <button className="btn btn-ghost" onClick={()=>wizStep>0?setWizStep(w=>w-1):setScreen("employers")}>← {wizStep===0?"Cancel":"Back"}</button>
            <div style={{ display:"flex", gap:10 }}>
              {wizStep<STEPS.length-1?(
                <>
                  <button className="btn btn-ghost" onClick={()=>setWizStep(w=>w+1)}>Skip</button>
                  <button className="btn btn-primary" disabled={!canNext()} onClick={()=>setWizStep(w=>w+1)}>Next → {STEPS[wizStep+1]?.icon}</button>
                </>
              ):(
                <button className="btn btn-amber" style={{ fontSize:15, padding:"13px 32px" }} onClick={generateResume} disabled={!form.name||!form.email}>
                  🤖 Generate Resume with Llama →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* ── SCREEN: Generating (fake Ollama) ── */
  if (screen === "generating") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className={`emp-app ${theme}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
        <div style={{ textAlign:"center", padding:40, maxWidth:420 }}>
          <div style={{ width:88, height:88, borderRadius:"50%", background:"linear-gradient(135deg,rgba(56,189,248,0.2),rgba(129,140,248,0.2))", border:"2px solid rgba(56,189,248,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px", animation:"pulse 2s infinite" }}>🤖</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:t, marginBottom:8 }}>Llama is Building Your Resume…</h2>
          <p style={{ color:"#38BDF8", fontSize:14, fontWeight:600, marginBottom:4 }}>{LOADING_STEPS[Math.min(loadStep, LOADING_STEPS.length-1)].msg}</p>
          <p style={{ color:m, fontSize:13, marginBottom:24 }}>{LOADING_STEPS[Math.min(loadStep, LOADING_STEPS.length-1)].sub}</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:32 }}>
            <span className="gen-dot"/><span className="gen-dot"/><span className="gen-dot"/>
          </div>
          {/* Step progress */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, textAlign:"left" }}>
            {LOADING_STEPS.map((step,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:loadStep>i?"#86efac":loadStep===i?"#38BDF8":m, fontWeight:loadStep>=i?600:400 }}>
                <span style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, background:loadStep>i?"rgba(34,197,94,0.2)":loadStep===i?"rgba(56,189,248,0.2)":"rgba(100,116,139,0.1)", color:loadStep>i?"#86efac":loadStep===i?"#38BDF8":m }}>
                  {loadStep>i?"✓":i+1}
                </span>
                {step.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  /* ── SCREEN: Resume ── */
  if (screen === "resume") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }}/>
      <div className={`emp-app ${theme}`}>
        <MeshBg/>
        <div style={{ position:"sticky", top:0, zIndex:50, background:dark?"rgba(7,14,28,0.9)":"rgba(240,246,255,0.9)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${dark?"rgba(56,189,248,0.1)":"rgba(147,197,253,0.4)"}`, padding:"12px 24px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <button onClick={()=>setScreen("employers")} className="btn btn-ghost" style={{ padding:"7px 14px", fontSize:13 }}>← Employers</button>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:t, flex:1 }}>
            📄 Your Resume
            {editedFields.size>0&&<span style={{ marginLeft:8, fontSize:11, padding:"2px 8px", borderRadius:20, background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", color:"#F59E0B", fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>● {editedFields.size} edits</span>}
          </div>
          {versions.length>1&&(
            <div style={{ display:"flex", alignItems:"center", gap:6, overflowX:"auto", maxWidth:300 }}>
              <span style={{ fontSize:11, color:m, fontWeight:600, whiteSpace:"nowrap" }}>History:</span>
              {versions.map((v,i)=>(
                <button key={i} className={`version-pill ${activeVersion===i?"active":""}`} onClick={()=>restoreVersion(i)}>
                  {i===0?"🤖 Draft":`✎ v${i}`}{activeVersion===i&&" ←"}
                </button>
              ))}
            </div>
          )}
          <button className="btn btn-ghost" style={{ fontSize:13, padding:"8px 16px" }} onClick={()=>setScreen("wizard")}>🔄 Regenerate</button>
          <button className="btn btn-primary" style={{ fontSize:13, padding:"8px 16px" }} onClick={()=>window.print()}>⬇ Download PDF</button>
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:780, margin:"0 auto", padding:"16px 20px 0" }}>
          <div style={{ padding:"10px 16px", borderRadius:12, background:dark?"rgba(56,189,248,0.08)":"rgba(219,234,254,0.6)", border:`1px solid ${dark?"rgba(56,189,248,0.2)":"rgba(147,197,253,0.4)"}`, display:"flex", alignItems:"center", gap:10, marginBottom:16, fontSize:13 }}>
            <span style={{ fontSize:16 }}>✎</span>
            <span style={{ color:t, fontWeight:600 }}>Click any text to edit it inline.</span>
            <span style={{ color:m }}>Edits show a <span style={{ color:"#F59E0B" }}>●</span> dot. Use version history to undo.</span>
          </div>
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:780, margin:"0 auto", padding:"0 20px 60px" }}>
          {resume&&<ResumeViewer resume={resume} onEdit={handleEdit} editedFields={editedFields} dark={dark}/>}
        </div>
      </div>
    </>
  );

  return null;
}