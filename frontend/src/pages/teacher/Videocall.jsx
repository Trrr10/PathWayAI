/**
 * VideoCall.jsx — PathwayAI Teacher Video Call
 * Simulated class video call: webcam tiles, mic/cam/screen/whiteboard controls
 * Uses real browser MediaDevices API for actual camera/mic access
 * src/pages/teacher/VideoCall.jsx
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../../context/AppContext";

/* ── Students in the call ── */
const STUDENTS = [
  { id:1, name:"Priya M.",  avatar:"P", color:"#14B8A6", speaking:false, hand:true  },
  { id:2, name:"Raj P.",    avatar:"R", color:"#22C55E", speaking:true,  hand:false },
  { id:3, name:"Meera S.",  avatar:"M", color:"#F59E0B", speaking:false, hand:false },
  { id:4, name:"Arjun T.",  avatar:"A", color:"#8B5CF6", speaking:false, hand:true  },
  { id:5, name:"Aisha K.",  avatar:"A", color:"#F97316", speaking:false, hand:false },
  { id:6, name:"Dev R.",    avatar:"D", color:"#38BDF8", speaking:false, hand:false },
  { id:7, name:"Rahul K.",  avatar:"R", color:"#EF4444", speaking:false, hand:false },
  { id:8, name:"Sunita D.", avatar:"S", color:"#EC4899", speaking:false, hand:false },
];

/* ── Whiteboard colours ── */
const COLORS  = ["#FFFFFF","#EF4444","#F59E0B","#22C55E","#38BDF8","#8B5CF6","#F97316","#EC4899"];
const BRUSHES = [2, 4, 8, 14];
const TOOLS   = ["pen","eraser","rect","circle","line","text"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

.vc-wrap { width:100%; height:100vh; overflow:hidden; display:flex; flex-direction:column; font-family:'DM Sans',sans-serif; background:#060E1C; color:white; }

/* ── Top bar ── */
.vc-topbar { height:56px; background:rgba(6,14,28,.95); border-bottom:1px solid rgba(255,255,255,.07); display:flex; align-items:center; padding:0 20px; gap:16px; flex-shrink:0; backdrop-filter:blur(12px); }
.vc-topbar-title { fontFamily:'Syne',sans-serif; font-size:15px; font-weight:800; color:#EDE8DF; }
.vc-topbar-sub   { font-size:12px; color:#3D5068; margin-left:4px; }
.rec-dot { width:8px; height:8px; border-radius:50%; background:#EF4444; box-shadow:0 0 0 0 rgba(239,68,68,.5); animation:vc-ping 2s ease-in-out infinite; flex-shrink:0; }
@keyframes vc-ping { 0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)} 70%{box-shadow:0 0 0 8px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
.vc-timer { font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#EF4444; margin-left:auto; }

/* ── Layout ── */
.vc-body { flex:1; display:flex; overflow:hidden; }

/* ── Main area ── */
.vc-main { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative; }

/* ── Teacher video ── */
.vc-teacher { flex:1; position:relative; background:#0A1628; overflow:hidden; }
.vc-teacher video { width:100%; height:100%; object-fit:cover; }
.vc-teacher-label { position:absolute; bottom:14px; left:14px; background:rgba(0,0,0,.65); backdrop-filter:blur(8px); padding:5px 12px; border-radius:10px; font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px; }

/* ── Whiteboard ── */
.vc-whiteboard { flex:1; position:relative; background:#1a1a2e; overflow:hidden; }
.vc-wb-canvas  { cursor:crosshair; display:block; }

/* ── Whiteboard toolbar ── */
.wb-toolbar {
  position:absolute; left:12px; top:50%; transform:translateY(-50%);
  background:rgba(6,14,28,.92); border:1px solid rgba(255,255,255,.09);
  border-radius:16px; padding:10px 8px; display:flex; flex-direction:column; gap:8px;
  backdrop-filter:blur(12px);
}
.wb-btn {
  width:36px; height:36px; border-radius:10px; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center; font-size:15px;
  background:transparent; color:#4B5568; transition:all .2s;
}
.wb-btn:hover, .wb-btn.active { background:rgba(56,189,248,.14); color:#38BDF8; }
.wb-btn.active { box-shadow:0 0 0 1.5px rgba(56,189,248,.4); }
.wb-divider { height:1px; background:rgba(255,255,255,.07); margin:2px 0; }

/* Color picker row */
.wb-color-row {
  position:absolute; left:64px; top:50%; transform:translateY(-50%);
  background:rgba(6,14,28,.92); border:1px solid rgba(255,255,255,.09);
  border-radius:14px; padding:10px 8px; display:flex; flex-direction:column; gap:6px;
  backdrop-filter:blur(12px);
}
.wb-color-dot {
  width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent;
  transition:transform .15s, border-color .15s;
}
.wb-color-dot:hover, .wb-color-dot.active { transform:scale(1.25); border-color:white; }

/* ── Student grid ── */
.vc-students { width:200px; flex-shrink:0; background:rgba(6,14,28,.8); border-left:1px solid rgba(255,255,255,.07); overflow-y:auto; padding:12px 10px; display:flex; flex-direction:column; gap:8px; }
.vc-students::-webkit-scrollbar { width:3px; }
.vc-students::-webkit-scrollbar-thumb { background:rgba(56,189,248,.2); border-radius:2px; }
.vc-students-label { font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#3D5068; padding:0 4px; margin-bottom:2px; }

.student-tile {
  border-radius:14px; overflow:hidden; position:relative; aspect-ratio:4/3;
  background:#0D1829; border:1.5px solid rgba(255,255,255,.07);
  display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4;
  transition:border-color .2s;
}
.student-tile.speaking { border-color:#22C55E; box-shadow:0 0 12px rgba(34,197,94,.25); }
.student-tile-name { font-size:10px; font-weight:700; color:rgba(255,255,255,.6); margin-top:4px; }
.student-tile-avatar {
  width:38px; height:38px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:white;
}
.hand-badge { position:absolute; top:6px; right:6px; font-size:14px; animation:vc-bounce .6s ease-in-out infinite alternate; }
@keyframes vc-bounce { from{transform:translateY(0)} to{transform:translateY(-4px)} }
.mic-off { position:absolute; bottom:6px; left:6px; font-size:10px; background:rgba(239,68,68,.8); padding:2px 5px; border-radius:6px; }

/* ── Bottom control bar ── */
.vc-controls { height:72px; background:rgba(6,14,28,.97); border-top:1px solid rgba(255,255,255,.07); display:flex; align-items:center; justify-content:center; gap:12px; flex-shrink:0; }
.ctrl-btn {
  width:48px; height:48px; border-radius:14px; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center; font-size:20px;
  background:rgba(255,255,255,.07); color:white; transition:all .2s;
}
.ctrl-btn:hover { background:rgba(255,255,255,.12); transform:translateY(-2px); }
.ctrl-btn.off   { background:rgba(239,68,68,.2); color:#F87171; border:1px solid rgba(239,68,68,.3); }
.ctrl-btn.active{ background:rgba(56,189,248,.15); color:#38BDF8; border:1px solid rgba(56,189,248,.3); }
.ctrl-btn.end   { background:rgba(239,68,68,.9); color:white; width:64px; border-radius:18px; font-size:14px; font-weight:800; font-family:'DM Sans',sans-serif; }
.ctrl-btn.end:hover { background:#EF4444; }
.ctrl-label { font-size:9px; color:#3D5068; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-top:3px; }
.ctrl-wrap  { display:flex; flex-direction:column; align-items:center; }

/* ── Chat panel ── */
.vc-chat { width:0; transition:width .3s ease; overflow:hidden; flex-shrink:0; }
.vc-chat.open { width:260px; border-left:1px solid rgba(255,255,255,.07); }
.vc-chat-inner { width:260px; height:100%; display:flex; flex-direction:column; background:rgba(8,18,38,.9); }
.vc-chat-header { padding:14px 16px; border-bottom:1px solid rgba(255,255,255,.07); font-size:13px; font-weight:700; color:#EDE8DF; display:flex; justify-content:space-between; }
.vc-chat-msgs   { flex:1; overflow-y:auto; padding:12px 14px; display:flex; flex-direction:column; gap:10px; }
.vc-chat-msgs::-webkit-scrollbar { width:3px; }
.chat-msg { font-size:12px; line-height:1.55; }
.chat-msg-name { font-weight:700; margin-bottom:2px; }
.chat-msg-body { color:rgba(255,255,255,.6); }
.vc-chat-input-row { padding:10px 12px; border-top:1px solid rgba(255,255,255,.07); display:flex; gap:8px; }
.vc-chat-input { flex:1; background:rgba(255,255,255,.05); border:1.5px solid rgba(255,255,255,.08); border-radius:10px; padding:8px 12px; font-size:12px; color:white; outline:none; font-family:'DM Sans',sans-serif; }
.vc-chat-input:focus { border-color:#38BDF8; }
.vc-chat-send { background:#38BDF8; border:none; border-radius:10px; padding:8px 12px; font-size:12px; font-weight:700; color:white; cursor:pointer; }

/* ── Raised hands panel ── */
.hands-badge { position:absolute; top:-4px; right:-4px; width:16px; height:16px; border-radius:50%; background:#F59E0B; font-size:9px; font-weight:800; color:white; display:flex; align-items:center; justify-content:center; }
`;

/* ── Whiteboard component ── */
function Whiteboard({ dark }) {
  const canvasRef  = useRef(null);
  const drawing    = useRef(false);
  const lastPos    = useRef({ x:0, y:0 });
  const [tool,     setTool]     = useState("pen");
  const [color,    setColor]    = useState("#FFFFFF");
  const [brushIdx, setBrushIdx] = useState(1);
  const [showColors, setShowColors] = useState(true);
  const history    = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    drawing.current = true;
    lastPos.current = pos;
    const ctx = canvas.getContext("2d");
    history.current.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    if (history.current.length > 40) history.current.shift();
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const pos    = getPos(e, canvas);
    ctx.lineWidth   = BRUSHES[brushIdx];
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.strokeStyle = tool === "eraser" ? "#1a1a2e" : color;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { drawing.current = false; };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    history.current.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  };

  const undo = () => {
    if (!history.current.length) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.putImageData(history.current.pop(), 0, 0);
  };

  const TOOL_ICONS = { pen:"✏️", eraser:"⬜", rect:"▭", circle:"○", line:"╱", text:"T" };

  return (
    <div className="vc-whiteboard">
      {/* Whiteboard toolbar */}
      <div className="wb-toolbar">
        {TOOLS.map(t => (
          <button key={t} className={`wb-btn ${tool===t?"active":""}`} onClick={()=>setTool(t)} title={t}>
            {TOOL_ICONS[t]}
          </button>
        ))}
        <div className="wb-divider"/>
        {BRUSHES.map((b,i) => (
          <button key={b} className={`wb-btn ${brushIdx===i?"active":""}`} onClick={()=>setBrushIdx(i)} title={`Size ${b}`}>
            <div style={{ width:b, height:b, borderRadius:"50%", background: brushIdx===i?"#38BDF8":"#4B5568", maxWidth:14, maxHeight:14 }}/>
          </button>
        ))}
        <div className="wb-divider"/>
        <button className="wb-btn" onClick={undo} title="Undo">↩</button>
        <button className="wb-btn" onClick={clearBoard} title="Clear">🗑</button>
      </div>

      {/* Color picker */}
      {showColors && (
        <div className="wb-color-row">
          {COLORS.map(c => (
            <div key={c} className={`wb-color-dot ${color===c?"active":""}`}
              style={{ background:c }} onClick={()=>setColor(c)}/>
          ))}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="vc-wb-canvas"
        style={{ width:"100%", height:"100%" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      {/* Whiteboard label */}
      <div style={{ position:"absolute", top:14, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,.6)", padding:"5px 14px", borderRadius:10, fontSize:12, fontWeight:700, color:"rgba(255,255,255,.5)" }}>
        📝 Whiteboard — visible to all students
      </div>
    </div>
  );
}

/* ── Timer hook ── */
function useTimer() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s+1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs/3600)).padStart(2,"0");
  const m = String(Math.floor((secs%3600)/60)).padStart(2,"0");
  const s = String(secs%60).padStart(2,"0");
  return `${h}:${m}:${s}`;
}

/* ── Main component ── */
export default function VideoCall() {
  const { dark } = useApp();
  const videoRef   = useRef(null);
  const [micOn,    setMicOn]    = useState(true);
  const [camOn,    setCamOn]    = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [wb,       setWb]       = useState(false);
  const [chat,     setChat]     = useState(false);
  const [chatMsg,  setChatMsg]  = useState("");
  const [messages, setMessages] = useState([
    { id:1, name:"Priya M.",  color:"#14B8A6", body:"Good morning ma'am! 🙏" },
    { id:2, name:"Raj P.",    color:"#22C55E", body:"Ready for class!" },
    { id:3, name:"Arjun T.",  color:"#8B5CF6", body:"Can you share the notes afterwards?" },
  ]);
  const [stream,   setStream]   = useState(null);
  const [students, setStudents] = useState(STUDENTS);
  const [ended,    setEnded]    = useState(false);
  const timer = useTimer();
  const handsUp = students.filter(s => s.hand).length;

  /* ── Start camera ── */
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video:true, audio:true })
      .then(s => { setStream(s); if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {});
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  /* ── Toggle cam ── */
  const toggleCam = () => {
    stream?.getVideoTracks().forEach(t => { t.enabled = !camOn; });
    setCamOn(c => !c);
  };
  const toggleMic = () => {
    stream?.getAudioTracks().forEach(t => { t.enabled = !micOn; });
    setMicOn(m => !m);
  };

  /* ── Screen share ── */
  const toggleScreen = async () => {
    if (screenOn) { setScreenOn(false); return; }
    try {
      const sc = await navigator.mediaDevices.getDisplayMedia({ video:true });
      if (videoRef.current) videoRef.current.srcObject = sc;
      setScreenOn(true);
      sc.getVideoTracks()[0].onended = () => setScreenOn(false);
    } catch {}
  };

  /* ── Lower hand ── */
  const lowerHand = (id) => {
    setStudents(s => s.map(st => st.id===id ? {...st, hand:false} : st));
  };

  /* ── Send chat ── */
  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setMessages(m => [...m, { id:Date.now(), name:"You (Teacher)", color:"#38BDF8", body:chatMsg }]);
    setChatMsg("");
  };

  /* ── End call ── */
  const endCall = () => {
    stream?.getTracks().forEach(t => t.stop());
    setEnded(true);
  };

  if (ended) {
    return (
     
        <div style={{ minHeight:"100vh", background:"#060E1C", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
          <div style={{ fontSize:48 }}>📞</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#EDE8DF" }}>Call Ended</h2>
          <p style={{ color:"#3D5068", fontSize:14 }}>Duration: {timer} · {STUDENTS.length} students attended</p>
          <button onClick={()=>setEnded(false)}
            style={{ marginTop:12, padding:"12px 28px", borderRadius:14, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#0369A1,#38BDF8)", color:"white", fontSize:14, fontWeight:800, fontFamily:"'DM Sans',sans-serif" }}>
            Start New Call
          </button>
        </div>
      
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
        <div className="vc-wrap">

          {/* ── TOP BAR ── */}
          <div className="vc-topbar">
            <div className="rec-dot"/>
            <span className="vc-topbar-title">Class XII · Section A</span>
            <span className="vc-topbar-sub">Live · {STUDENTS.length} students</span>
            {handsUp > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:"rgba(245,158,11,.14)", border:"1px solid rgba(245,158,11,.3)" }}>
                <span style={{ fontSize:13 }}>✋</span>
                <span style={{ fontSize:12, fontWeight:700, color:"#F59E0B" }}>{handsUp} hand{handsUp>1?"s":""} raised</span>
              </div>
            )}
            <span className="vc-timer">{timer}</span>
          </div>

          {/* ── BODY ── */}
          <div className="vc-body">

            {/* ── MAIN ── */}
            <div className="vc-main">

              {/* Teacher video or whiteboard */}
              {wb ? (
                <Whiteboard dark={dark}/>
              ) : (
                <div className="vc-teacher">
                  {stream && camOn ? (
                    <video ref={videoRef} autoPlay muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  ) : (
                    <div style={{ width:"100%", height:"100%", background:"linear-gradient(145deg,#07101F,#0D1829)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
                      <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#0369A1,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:800,color:"white",fontFamily:"'Syne',sans-serif" }}>T</div>
                      <span style={{ fontSize:14, color:"rgba(255,255,255,.4)", fontWeight:600 }}>Camera is off</span>
                    </div>
                  )}
                  <div className="vc-teacher-label">
                    <div style={{ width:8,height:8,borderRadius:"50%",background:"#22C55E",animation:"vc-ping 2s ease-in-out infinite" }}/>
                    <span style={{ fontSize:12, fontWeight:700 }}>Mrs. Sunita Deshpande · You</span>
                    {!micOn && <span style={{ marginLeft:4, fontSize:11, color:"#F87171" }}>🔇</span>}
                  </div>
                </div>
              )}
            </div>

            {/* ── STUDENT GRID ── */}
            <div className="vc-students">
              <p className="vc-students-label">Students ({STUDENTS.length})</p>
              {students.map(s => (
                <div key={s.id} className={`student-tile ${s.speaking?"speaking":""}`}>
                  <div className="student-tile-avatar" style={{ background:`${s.color}25`, border:`2px solid ${s.color}40`, color:s.color }}>
                    {s.avatar}
                  </div>
                  <span className="student-tile-name">{s.name.split(" ")[0]}</span>
                  {s.hand && (
                    <div className="hand-badge" onClick={() => lowerHand(s.id)} style={{ cursor:"pointer" }} title="Lower hand">✋</div>
                  )}
                  {s.speaking && <div style={{ position:"absolute", bottom:6, right:6, width:8,height:8,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 6px #22C55E" }}/>}
                </div>
              ))}
            </div>

            {/* ── CHAT PANEL ── */}
            <div className={`vc-chat ${chat?"open":""}`}>
              <div className="vc-chat-inner">
                <div className="vc-chat-header">
                  <span>💬 Class Chat</span>
                  <button onClick={()=>setChat(false)} style={{ background:"none",border:"none",cursor:"pointer",color:"#4B5568",fontSize:16 }}>✕</button>
                </div>
                <div className="vc-chat-msgs">
                  {messages.map(msg => (
                    <div key={msg.id} className="chat-msg">
                      <div className="chat-msg-name" style={{ color:msg.color }}>{msg.name}</div>
                      <div className="chat-msg-body">{msg.body}</div>
                    </div>
                  ))}
                </div>
                <div className="vc-chat-input-row">
                  <input className="vc-chat-input" placeholder="Type a message…" value={chatMsg}
                    onChange={e=>setChatMsg(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
                  <button className="vc-chat-send" onClick={sendChat}>→</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTROL BAR ── */}
          <div className="vc-controls">
            {[
              { icon: micOn?"🎙":"🔇",     label:"Mic",    action:toggleMic,             active:!micOn,   off:!micOn   },
              { icon: camOn?"📹":"🚫",     label:"Camera", action:toggleCam,             active:!camOn,   off:!camOn   },
              { icon:"🖥",                  label:"Screen", action:toggleScreen,          active:screenOn, off:false    },
              { icon:"📝",                  label:"Board",  action:()=>setWb(w=>!w),      active:wb,       off:false    },
              { icon:"💬",                  label:"Chat",   action:()=>setChat(c=>!c),    active:chat,     off:false    },
              { icon:"✋",                  label:`Hands${handsUp>0?` (${handsUp})`:""}`, action:()=>lowerHand(students.find(s=>s.hand)?.id), active:false, off:false },
            ].map(({ icon,label,action,active,off }) => (
              <div key={label} className="ctrl-wrap">
                <button className={`ctrl-btn ${active?"active":""} ${off?"off":""}`} onClick={action}>{icon}</button>
                <span className="ctrl-label">{label}</span>
              </div>
            ))}

            <div style={{ width:1, height:36, background:"rgba(255,255,255,.08)", margin:"0 4px" }}/>

            <div className="ctrl-wrap">
              <button className="ctrl-btn end" onClick={endCall}>End</button>
              <span className="ctrl-label">End Call</span>
            </div>
          </div>

        </div>
    </>
  );
}