/**
 * Videocall.jsx — PathwayAI Teacher Video Call
 * Glassmorphism soft pink calm aesthetic
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { GLASS_CSS } from "./glassTheme";

const EXTRA_CSS = `
.vc-root {
  position: fixed; inset: 0; z-index: 100;
  font-family: 'DM Sans', sans-serif;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(232,164,184,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(197,184,232,0.15) 0%, transparent 50%),
    #fdf0f5;
  overflow: hidden;
  display: flex; flex-direction: column;
}

/* Top bar */
.vc-topbar {
  height: 58px; flex-shrink: 0;
  background: rgba(255,240,245,0.75);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(232,164,184,0.2);
  display: flex; align-items: center; padding: 0 24px; gap: 16px;
  box-shadow: 0 2px 16px rgba(201,116,142,0.08);
}

.vc-logo {
  font-family: 'Instrument Serif', serif;
  font-size: 18px; font-style: italic;
  color: var(--pink-deep); letter-spacing: 0.02em;
}

.vc-live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #c04040;
  box-shadow: 0 0 8px rgba(192,64,64,0.6);
  animation: pulse-red 1.5s ease-in-out infinite;
}
@keyframes pulse-red { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }

.vc-timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; color: var(--text-soft); letter-spacing: 0.05em;
}

.vc-end-btn {
  padding: 8px 20px; border-radius: 12px; border: none;
  background: rgba(192,64,64,0.12); border: 1px solid rgba(192,64,64,0.25);
  color: #b04040; font-size: 12px; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.vc-end-btn:hover { background: rgba(192,64,64,0.2); }

/* Body */
.vc-body { flex: 1; display: flex; overflow: hidden; }

/* Video area */
.vc-video-area {
  flex: 1; display: flex; flex-direction: column;
  padding: 16px; gap: 12px; overflow: hidden;
}

/* Main video tile */
.vc-main-tile {
  flex: 1; border-radius: 20px; overflow: hidden; position: relative;
  background: linear-gradient(135deg, rgba(252,232,237,0.8), rgba(240,232,252,0.7));
  border: 1px solid rgba(232,164,184,0.25);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 40px rgba(201,116,142,0.1), inset 0 1px 0 rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  min-height: 0;
}

.vc-video-mesh {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(232,164,184,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,164,184,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
}

.vc-main-avatar {
  width: 90px; height: 90px; border-radius: 22px;
  background: linear-gradient(135deg, var(--pink), var(--mauve));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Instrument Serif', serif;
  font-size: 40px; font-weight: 400; font-style: italic;
  color: white; position: relative; z-index: 1;
  box-shadow: 0 8px 32px rgba(201,116,142,0.3);
  transition: box-shadow 0.5s;
}

.vc-speaking-ring {
  position: absolute; inset: 0; border-radius: 20px;
  border: 2px solid transparent; pointer-events: none;
  transition: border-color 0.4s, box-shadow 0.4s;
}
.vc-speaking-ring.speaking {
  border-color: rgba(201,116,142,0.5);
  box-shadow: inset 0 0 24px rgba(232,164,184,0.1);
}

.vc-name-tag {
  position: absolute; bottom: 14px; left: 14px;
  background: rgba(255,240,245,0.85); backdrop-filter: blur(12px);
  border: 1px solid rgba(232,164,184,0.2);
  padding: 6px 12px; border-radius: 10px;
  display: flex; align-items: center; gap: 7px;
  box-shadow: 0 2px 12px rgba(201,116,142,0.1);
}
.vc-name-tag span { font-size: 12px; font-weight: 600; color: var(--text); }

/* Thumbnails */
.vc-thumbs { display: flex; gap: 10px; height: 110px; flex-shrink: 0; }

.vc-thumb {
  flex: 1; border-radius: 14px;
  background: rgba(252,232,237,0.6);
  border: 1px solid rgba(232,164,184,0.2);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; position: relative; overflow: hidden;
  backdrop-filter: blur(8px); transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(201,116,142,0.06);
}
.vc-thumb:hover { border-color: rgba(201,116,142,0.4); transform: translateY(-2px); }
.vc-thumb.active-t { border-color: rgba(201,116,142,0.5); box-shadow: 0 4px 20px rgba(201,116,142,0.15); }

.vc-thumb-avatar {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Instrument Serif', serif; font-size: 18px; font-style: italic;
  color: white;
}
.vc-thumb-name {
  position: absolute; bottom: 6px; left: 0; right: 0; text-align: center;
  font-size: 10px; font-weight: 600; color: var(--text-soft);
}

/* Controls */
.vc-controls {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; padding: 12px; flex-shrink: 0;
  background: rgba(255,240,245,0.7); backdrop-filter: blur(16px);
  border-top: 1px solid rgba(232,164,184,0.15);
}

.vc-ctrl {
  width: 48px; height: 48px; border-radius: 14px; border: none;
  background: rgba(255,240,245,0.8); border: 1px solid rgba(232,164,184,0.2);
  color: var(--text-mid); cursor: pointer; font-size: 17px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; backdrop-filter: blur(8px);
  box-shadow: 0 2px 10px rgba(201,116,142,0.06);
}
.vc-ctrl:hover { background: rgba(255,232,240,0.9); border-color: rgba(201,116,142,0.35); transform: translateY(-1px); }
.vc-ctrl.off { background: rgba(192,64,64,0.1); border-color: rgba(192,64,64,0.25); color: #b04040; }
.vc-ctrl.on-active { background: rgba(201,116,142,0.12); border-color: rgba(201,116,142,0.35); color: var(--pink-deep); }

.vc-ctrl-label { font-size: 9px; font-weight: 600; color: var(--text-soft); margin-top: 3px; letter-spacing: 0.04em; text-align: center; }
.vc-ctrl-group { display: flex; flex-direction: column; align-items: center; gap: 2px; }

/* Panel */
.vc-panel {
  width: 310px; flex-shrink: 0;
  background: rgba(255,240,245,0.6); backdrop-filter: blur(20px);
  border-left: 1px solid rgba(232,164,184,0.2);
  display: flex; flex-direction: column;
  transition: width 0.3s ease;
}
.vc-panel.hidden { width: 0; overflow: hidden; }

.vc-panel-tabs {
  display: flex; border-bottom: 1px solid rgba(232,164,184,0.15); flex-shrink: 0;
  background: rgba(255,240,245,0.5);
}

.vc-ptab {
  flex: 1; padding: 13px 6px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; border: none;
  background: transparent; color: var(--text-soft); cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: all 0.2s; font-family: 'DM Sans', sans-serif;
}
.vc-ptab:hover { color: var(--text-mid); }
.vc-ptab.active { color: var(--pink-deep); border-color: var(--pink-deep); }

/* Chat */
.vc-chat-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.vc-chat-body::-webkit-scrollbar { width: 3px; }
.vc-chat-body::-webkit-scrollbar-thumb { background: rgba(201,116,142,0.2); border-radius: 2px; }

.vc-msg { display: flex; gap: 8px; align-items: flex-start; }
.vc-msg.me { flex-direction: row-reverse; }

.vc-msg-bubble {
  max-width: 200px; padding: 10px 13px; border-radius: 14px;
  font-size: 12px; line-height: 1.6; color: var(--text-mid);
  background: rgba(255,240,245,0.8);
  border: 1px solid rgba(232,164,184,0.2);
  backdrop-filter: blur(8px);
}
.vc-msg.me .vc-msg-bubble {
  background: rgba(201,116,142,0.1);
  border-color: rgba(201,116,142,0.2);
  text-align: right;
}
.vc-msg-name { font-size: 10px; font-weight: 700; color: var(--pink-deep); margin-bottom: 3px; }

.vc-chat-input-row {
  padding: 12px; border-top: 1px solid rgba(232,164,184,0.15); display: flex; gap: 8px; flex-shrink: 0;
}
.vc-chat-input {
  flex: 1; background: rgba(255,240,245,0.7); border: 1px solid rgba(232,164,184,0.25);
  border-radius: 12px; padding: 9px 12px; font-size: 12px; color: var(--text);
  outline: none; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  backdrop-filter: blur(8px);
}
.vc-chat-input:focus { border-color: rgba(201,116,142,0.45); box-shadow: 0 0 0 3px rgba(232,164,184,0.12); }
.vc-chat-input::placeholder { color: var(--text-soft); }

.vc-send-btn {
  width: 38px; height: 38px; border-radius: 11px; border: none;
  background: linear-gradient(135deg, var(--pink-deep), var(--mauve));
  color: white; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(201,116,142,0.3); transition: all 0.2s;
}
.vc-send-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,116,142,0.4); }

/* Participants */
.vc-participants { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 8px; }

.vc-p-row {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: rgba(255,240,245,0.6); border: 1px solid rgba(232,164,184,0.18);
  border-radius: 12px; backdrop-filter: blur(8px); transition: all 0.2s;
}
.vc-p-row:hover { background: rgba(255,240,245,0.85); border-color: rgba(201,116,142,0.3); }
.vc-p-name { flex: 1; font-size: 13px; font-weight: 600; color: var(--text); }

/* AI insight */
.vc-ai-card {
  margin: 12px; background: rgba(197,184,232,0.15); border: 1px solid rgba(197,184,232,0.3);
  border-radius: 14px; padding: 16px; backdrop-filter: blur(12px);
}
.vc-ai-title {
  font-family: 'Instrument Serif', serif; font-size: 13px; font-style: italic;
  color: #7b68bb; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;
}
.vc-ai-item { font-size: 11px; color: var(--text-soft); margin-bottom: 6px; line-height: 1.65; }
.vc-ai-item strong { color: #7b68bb; }

/* Whiteboard */
.vc-whiteboard { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.vc-wb-toolbar {
  display: flex; align-items: center; gap: 6px; padding: 10px 14px;
  border-bottom: 1px solid rgba(232,164,184,0.15); flex-wrap: wrap; flex-shrink: 0;
  background: rgba(255,240,245,0.5);
}
.vc-wb-btn {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid rgba(232,164,184,0.2);
  background: rgba(255,240,245,0.7); color: var(--text-mid);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 13px; transition: all 0.2s;
}
.vc-wb-btn:hover { background: rgba(255,232,240,0.9); }
.vc-wb-btn.active-wb { background: rgba(201,116,142,0.15); border-color: rgba(201,116,142,0.35); color: var(--pink-deep); }
.vc-color-dot { width: 20px; height: 20px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; flex-shrink: 0; }
.vc-color-dot.sel { border-color: var(--pink-deep); transform: scale(1.2); }
.vc-canvas-wrap { flex: 1; position: relative; overflow: hidden; }
canvas.vc-canvas { width: 100%; height: 100%; background: #fffdf9; cursor: crosshair; display: block; }
.vc-wb-clear {
  margin-left: auto; padding: 5px 11px; border-radius: 7px;
  border: 1px solid rgba(192,64,64,0.2); background: transparent;
  color: rgba(192,64,64,0.7); font-size: 10px; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
}
.vc-wb-clear:hover { background: rgba(192,64,64,0.08); color: #b04040; }

@keyframes vc-fade-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.vc-new-msg { animation: vc-fade-in 0.3s ease; }

.vc-toast {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  background: rgba(255,240,245,0.9); border: 1px solid rgba(232,164,184,0.3);
  color: var(--pink-deep); padding: 8px 18px; border-radius: 20px;
  font-size: 12px; font-weight: 700; backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(201,116,142,0.15);
  animation: vc-fade-in 0.3s ease; pointer-events: none; z-index: 20; white-space: nowrap;
}
`;

function Whiteboard() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x:0, y:0 });
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#3d2a35");
  const [size, setSize] = useState(3);
  const COLORS = ["#3d2a35","#c9748e","#9b8ed4","#6a9a88","#c49878","#7aa8c8","#b87a1a"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 400;
    canvas.height = canvas.offsetHeight || 300;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffdf9"; ctx.fillRect(0,0,canvas.width,canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x:(clientX-rect.left)*(canvas.width/rect.width), y:(clientY-rect.top)*(canvas.height/rect.height) };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault(); drawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#fffdf9" : color;
    ctx.lineWidth = tool === "eraser" ? size*5 : size;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }, [tool, color, size]);

  const stopDraw = useCallback(() => { drawing.current = false; }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffdf9"; ctx.fillRect(0,0,canvas.width,canvas.height);
  };

  return (
    <div className="vc-whiteboard">
      <div className="vc-wb-toolbar">
        <button className={`vc-wb-btn ${tool==="pen"?"active-wb":""}`} onClick={() => setTool("pen")} title="Pen">✏</button>
        <button className={`vc-wb-btn ${tool==="eraser"?"active-wb":""}`} onClick={() => setTool("eraser")} title="Erase">◻</button>
        <div style={{ width:1, height:20, background:"rgba(232,164,184,0.2)", margin:"0 3px" }} />
        {[2,4,8].map(s => (
          <button key={s} className={`vc-wb-btn ${size===s?"active-wb":""}`} onClick={() => setSize(s)} style={{ fontSize:6+s }}>●</button>
        ))}
        <div style={{ width:1, height:20, background:"rgba(232,164,184,0.2)", margin:"0 3px" }} />
        {COLORS.map(c => (
          <div key={c} className={`vc-color-dot ${color===c?"sel":""}`}
            style={{ background:c, boxShadow: color===c ? `0 0 6px ${c}` : "none" }}
            onClick={() => setColor(c)} />
        ))}
        <button className="vc-wb-clear" onClick={clear}>Clear</button>
      </div>
      <div className="vc-canvas-wrap">
        <canvas ref={canvasRef} className="vc-canvas"
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
      </div>
    </div>
  );
}

const PARTICIPANTS = [
  { name:"Mrs. Sunita Deshpande", letter:"S", color:"linear-gradient(135deg,#e8a4b8,#c9748e)", role:"Teacher", mic:true,  cam:true  },
  { name:"Rahul K.",              letter:"R", color:"linear-gradient(135deg,#b8d4e8,#7aa8c8)", role:"Student", mic:true,  cam:false },
  { name:"Priya M.",              letter:"P", color:"linear-gradient(135deg,#c4e8c4,#88b888)", role:"Student", mic:false, cam:true  },
  { name:"Arjun T.",              letter:"A", color:"linear-gradient(135deg,#c5b8e8,#9b8ed4)", role:"Student", mic:true,  cam:true  },
];

export default function Videocall() {
  const [micOn,   setMicOn]   = useState(true);
  const [camOn,   setCamOn]   = useState(true);
  const [panel,   setPanel]   = useState("chat");
  const [showPanel, setShowPanel] = useState(true);
  const [timer,   setTimer]   = useState(0);
  const [speaking, setSpeaking] = useState(0);
  const [toast,   setToast]   = useState(null);
  const [msg,     setMsg]     = useState("");
  const [messages, setMessages] = useState([
    { id:1, from:"Mrs. Deshpande", letter:"S", color:"#c9748e", text:"Good afternoon class! Let's begin with Chapter 5.", time:"3:00", me:false },
    { id:2, from:"Rahul K.",       letter:"R", color:"#7aa8c8", text:"Ready! I had a doubt from last class too.", time:"3:01", me:false },
    { id:3, from:"You",            letter:"S", color:"#c9748e", text:"Perfect, we'll cover that too. Open your textbooks.", time:"3:01", me:true },
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTimer(s => s+1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSpeaking(s => (s+1)%2), 5000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const sendMsg = () => {
    if (!msg.trim()) return;
    const now = new Date();
    setMessages(m => [...m, { id:Date.now(), from:"You", letter:"S", color:"#c9748e", text:msg, time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`, me:true }]);
    setMsg("");
    setTimeout(() => chatRef.current?.scrollTo({ top:99999, behavior:"smooth" }), 50);
    setTimeout(() => {
      setMessages(m => [...m, { id:Date.now()+1, from:"Rahul K.", letter:"R", color:"#7aa8c8", text:"Understood! Could you explain that once more please?", time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`, me:false }]);
      setTimeout(() => chatRef.current?.scrollTo({ top:99999, behavior:"smooth" }), 50);
    }, 2000);
  };

  const togglePanel = (tab) => {
    if (panel === tab && showPanel) setShowPanel(false);
    else { setPanel(tab); setShowPanel(true); }
  };

  return (
    <>
      <style>{GLASS_CSS + EXTRA_CSS}</style>
      <div className="vc-root">
        {/* Top bar */}
        <div className="vc-topbar">
          <div className="vc-logo">PathwayAI</div>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>Chemical Reactions — Class XII</span>
            <div className="vc-live-dot" />
            <span style={{ fontSize:11, fontWeight:600, color:"#c04040" }}>Live</span>
            <span className="vc-timer">{fmt(timer)}</span>
          </div>
          <button className="vc-end-btn">End Class</button>
        </div>

        {/* Body */}
        <div className="vc-body">
          <div className="vc-video-area">
            {/* Main tile */}
            <div className="vc-main-tile">
              <div className="vc-video-mesh" />
              <div className="vc-main-avatar"
                style={{ boxShadow: speaking===0 ? "0 0 0 4px rgba(201,116,142,0.4), 0 8px 40px rgba(201,116,142,0.25)" : "0 8px 32px rgba(201,116,142,0.2)" }}>
                {PARTICIPANTS[speaking].letter}
              </div>
              <div className={`vc-speaking-ring ${speaking===0?"speaking":""}`} />
              <div className="vc-name-tag">
                <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--pink-deep)", opacity:0.7 }} />
                <span>{PARTICIPANTS[speaking].name}</span>
              </div>
              {toast && <div className="vc-toast">{toast}</div>}
            </div>

            {/* Thumbnails */}
            <div className="vc-thumbs">
              {PARTICIPANTS.map((p,i) => (
                <div key={i} className={`vc-thumb ${speaking===i?"active-t":""}`}>
                  <div className="vc-thumb-avatar" style={{ background:p.color }}>{p.letter}</div>
                  <div className="vc-thumb-name">{p.name.split(" ")[0]}</div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="vc-controls">
              {[
                { icon:micOn?"🎙":"🔇", label:micOn?"Mute":"Unmute", off:!micOn, action:()=>setMicOn(m=>!m) },
                { icon:"📷",           label:camOn?"Stop":"Start",    off:!camOn, action:()=>setCamOn(c=>!c) },
                { icon:"🖥",           label:"Share",   off:false, active:false, action:()=>showToast("Screen share started") },
                { icon:"✋",           label:"Hand",    off:false, active:false, action:()=>showToast("Hand raised") },
                { icon:"💬",          label:"Chat",    off:false, active:panel==="chat"&&showPanel, action:()=>togglePanel("chat") },
                { icon:"✏",           label:"Board",   off:false, active:panel==="whiteboard"&&showPanel, action:()=>togglePanel("whiteboard") },
                { icon:"👥",          label:"People",  off:false, active:panel==="participants"&&showPanel, action:()=>togglePanel("participants") },
              ].map((c,i) => (
                <div key={i} className="vc-ctrl-group">
                  <button className={`vc-ctrl ${c.off?"off":""} ${c.active?"on-active":""}`} onClick={c.action}>{c.icon}</button>
                  <div className="vc-ctrl-label">{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel */}
          <div className={`vc-panel ${showPanel?"":"hidden"}`}>
            <div className="vc-panel-tabs">
              {[
                { id:"chat",         label:"Chat" },
                { id:"whiteboard",   label:"Board" },
                { id:"participants", label:"People" },
              ].map(t => (
                <button key={t.id} className={`vc-ptab ${panel===t.id?"active":""}`} onClick={() => setPanel(t.id)}>{t.label}</button>
              ))}
            </div>

            {/* Chat */}
            {panel === "chat" && (
              <>
                <div className="vc-chat-body" ref={chatRef}>
                  {messages.map(m => (
                    <div key={m.id} className={`vc-msg ${m.me?"me":""} vc-new-msg`}>
                      <div style={{ width:26, height:26, borderRadius:8, background:m.me?"linear-gradient(135deg,var(--pink),var(--mauve))":"rgba(232,164,184,0.2)", border:"1px solid rgba(232,164,184,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontFamily:"'Instrument Serif',serif", fontStyle:"italic", color:m.me?"white":m.color, flexShrink:0 }}>
                        {m.letter}
                      </div>
                      <div className="vc-msg-bubble">
                        <div className="vc-msg-name">{m.from}</div>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="vc-chat-input-row">
                  <input className="vc-chat-input" placeholder="Message class..."
                    value={msg} onChange={e=>setMsg(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&sendMsg()} />
                  <button className="vc-send-btn" onClick={sendMsg}>↑</button>
                </div>
              </>
            )}

            {panel === "whiteboard" && <Whiteboard />}

            {panel === "participants" && (
              <>
                <div className="vc-participants">
                  {PARTICIPANTS.map((p,i) => (
                    <div key={i} className="vc-p-row">
                      <div style={{ width:34, height:34, borderRadius:10, background:p.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontFamily:"'Instrument Serif',serif", fontStyle:"italic", color:"white", flexShrink:0 }}>{p.letter}</div>
                      <div className="vc-p-name">{p.name}</div>
                      <span className="gl-pill" style={{ fontSize:9 }}>{p.role}</span>
                      <div style={{ display:"flex", gap:5 }}>
                        <span style={{ fontSize:12, opacity:p.mic?1:0.3 }}>🎙</span>
                        <span style={{ fontSize:12, opacity:p.cam?1:0.3 }}>📷</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="vc-ai-card">
                  <div className="vc-ai-title">Session Insights</div>
                  <div className="vc-ai-item"><strong>Engagement:</strong> High — 3 students active</div>
                  <div className="vc-ai-item"><strong>Coverage:</strong> 42% of Chapter 5</div>
                  <div className="vc-ai-item"><strong>Suggestion:</strong> Practice problem next</div>
                  <div className="vc-ai-item"><strong>Remaining:</strong> ~{Math.max(0,45-Math.floor(timer/60))} min</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
