// Resources.jsx
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";

export default function Resources() {
  const { dark } = useApp();
  const [resources, setResources] = useState([
    { id: 1, title: "Khan Academy — Newton's Laws", url: "https://khanacademy.org", subject: "Science", topic: "Newton's Laws", type: "Video", sharedWith: "Class 9", addedBy: "You" },
    { id: 2, title: "NCERT Solutions Math Class 10", url: "https://ncert.nic.in", subject: "Mathematics", topic: "Quadratic Equations", type: "Document", sharedWith: "Class 10", addedBy: "You" },
    { id: 3, title: "History — Non-Cooperation Movement (YouTube)", url: "https://youtube.com", subject: "History", topic: "Freedom Movement", type: "Video", sharedWith: "Class 8", addedBy: "You" },
  ]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const inputCls = `flex-1 text-sm rounded-xl border px-4 py-3 outline-none ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"}`;

  const addResource = () => {
    if (!newUrl || !newTitle) return;
    setResources(r => [...r, { id: Date.now(), title: newTitle, url: newUrl, subject: "Mathematics", topic: "General", type: "Link", sharedWith: "All Classes", addedBy: "You" }]);
    setNewUrl(""); setNewTitle("");
  };

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-3xl mx-auto">
          <h1 className={`font-display text-3xl italic mb-2 ${text}`}>📚 Share Resources</h1>
          <p className={`text-sm ${muted} mb-6`}>Share YouTube videos, links, and documents with your class. They appear on students' dashboards contextually.</p>

          {/* Add resource */}
          <div className={`rounded-2xl border p-5 mb-6 ${card}`}>
            <div className={`text-xs font-bold mb-3 ${muted}`}>Add New Resource</div>
            <div className="flex gap-3 mb-3">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Resource title…" className={inputCls} />
              <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL (YouTube/NCERT/etc)…" className={inputCls} />
              <button onClick={addResource} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold px-5 py-3 rounded-xl text-sm whitespace-nowrap">
                Share +
              </button>
            </div>
          </div>

          {/* Resource list */}
          <div className="space-y-3">
            {resources.map(r => (
              <div key={r.id} className={`flex items-center gap-4 p-5 rounded-2xl border ${card}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                  {r.type === "Video" ? "▶️" : r.type === "Document" ? "📄" : "🔗"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold truncate ${text}`}>{r.title}</div>
                  <div className={`text-xs ${muted}`}>{r.subject} · {r.topic} · Shared with {r.sharedWith}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-sky-400 hover:underline">Open →</a>
                  <button onClick={() => setResources(rs => rs.filter(x => x.id !== r.id))} className={`text-xs ${muted} hover:text-red-400`}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}