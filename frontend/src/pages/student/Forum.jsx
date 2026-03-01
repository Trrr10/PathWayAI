/**
 * Forum.jsx — Discussion forum with posts, replies, AI instant answers
 */

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";
import { forumData } from "../../data/allData";

export default function Forum() {
  const { dark } = useApp();
  const [posts, setPosts] = useState(forumData);
  const [selected, setSelected] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", body: "", subject: "Mathematics" });
  const [showNew, setShowNew] = useState(false);
  const [replyText, setReplyText] = useState("");

  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  const submitPost = () => {
    if (!newPost.title.trim()) return;
    const post = {
      id: `f${Date.now()}`,
      author: "You",
      avatar: "Y",
      avatarGrad: "from-sky-500 to-blue-600",
      subject: newPost.subject,
      title: newPost.title,
      body: newPost.body,
      timestamp: "just now",
      tags: [],
      replies: [],
      views: 1,
      solved: false,
    };
    setPosts(p => [post, ...p]);
    setNewPost({ title: "", body: "", subject: "Mathematics" });
    setShowNew(false);
    setSelected(post);
  };

  const submitReply = () => {
    if (!replyText.trim() || !selected) return;
    const reply = {
      id: `r${Date.now()}`,
      author: "You",
      avatar: "Y",
      avatarGrad: "from-sky-500 to-blue-600",
      body: replyText,
      timestamp: "just now",
      likes: 0,
    };
    const updatedPost = { ...selected, replies: [...selected.replies, reply] };
    setSelected(updatedPost);
    setPosts(p => p.map(po => po.id === selected.id ? updatedPost : po));
    setReplyText("");
  };

  const postView = selected && posts.find(p => p.id === selected.id) || selected;

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} flex`}>
        {/* Post list */}
        <div className={`w-full md:w-96 shrink-0 border-r h-screen overflow-y-auto ${dark ? "border-slate-800" : "border-slate-200"}`}>
          <div className={`sticky top-0 z-10 px-4 py-4 border-b flex items-center justify-between ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h1 className={`font-bold text-sm ${text}`}>💬 Forum</h1>
            <button onClick={() => setShowNew(true)}
              className="text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1.5 rounded-lg">
              + New Post
            </button>
          </div>
          {showNew && (
            <div className={`p-4 border-b ${dark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
              <select value={newPost.subject} onChange={e => setNewPost(p => ({ ...p, subject: e.target.value }))}
                className={`w-full text-xs rounded-lg border px-2 py-2 mb-2 outline-none ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"}`}>
                {["Mathematics","Science","History"].map(s => <option key={s}>{s}</option>)}
              </select>
              <input placeholder="Your question title…" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                className={`w-full text-sm rounded-lg border px-3 py-2 mb-2 outline-none ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"}`} />
              <textarea placeholder="More details (optional)…" value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} rows={2}
                className={`w-full text-sm rounded-lg border px-3 py-2 mb-2 outline-none resize-none ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"}`} />
              <div className="flex gap-2">
                <button onClick={submitPost} className="flex-1 text-xs font-bold bg-sky-600 text-white py-2 rounded-lg">Post</button>
                <button onClick={() => setShowNew(false)} className={`flex-1 text-xs font-bold py-2 rounded-lg border ${dark ? "border-slate-700 text-slate-400" : "border-slate-300 text-slate-500"}`}>Cancel</button>
              </div>
            </div>
          )}
          {posts.map(post => (
            <button key={post.id} onClick={() => setSelected(post)}
              className={`w-full text-left px-4 py-4 border-b transition-all ${
                selected?.id === post.id
                  ? (dark ? "bg-sky-900/20 border-sky-800" : "bg-sky-50 border-sky-200")
                  : (dark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-200 hover:bg-slate-50")
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${post.avatarGrad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{post.avatar}</div>
                <span className={`text-xs font-semibold ${muted}`}>{post.subject}</span>
                {post.solved && <span className="ml-auto text-emerald-400 text-xs">✓ Solved</span>}
              </div>
              <div className={`text-sm font-semibold leading-tight mb-1 ${text}`}>{post.title}</div>
              <div className={`text-xs ${muted}`}>{post.replies.length} replies · {post.views} views · {post.timestamp}</div>
            </button>
          ))}
        </div>

        {/* Post detail */}
        {postView ? (
          <div className="flex-1 flex flex-col h-screen overflow-hidden hidden md:flex">
            <div className={`px-6 py-5 border-b ${dark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
              <div className={`text-xs font-bold mb-1 ${muted}`}>{postView.subject}</div>
              <h2 className={`font-bold text-lg ${text}`}>{postView.title}</h2>
              {postView.body && <p className={`text-sm mt-2 ${muted}`}>{postView.body}</p>}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {postView.replies.map(reply => (
                <div key={reply.id} className={`flex gap-3 p-4 rounded-2xl border ${dark ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-white"}`}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${reply.avatarGrad || "from-slate-500 to-slate-600"} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{reply.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${text}`}>{reply.author}</span>
                      {reply.isTeacherVerified && <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-bold">Teacher ✓</span>}
                      {reply.isMentor && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Mentor ⭐</span>}
                      {reply.isAI && <span className="text-xs bg-sky-600 text-white px-2 py-0.5 rounded-full font-bold">AI 🤖</span>}
                      <span className={`text-xs ml-auto ${muted}`}>{reply.timestamp}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${text}`}>{reply.body}</p>
                  </div>
                </div>
              ))}
              {postView.replies.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-3xl mb-2">💬</div>
                  <p className={`text-sm ${muted}`}>No replies yet. Be the first to help!</p>
                </div>
              )}
            </div>
            <div className={`px-6 py-4 border-t ${dark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
              <div className="flex gap-3">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply…" rows={2}
                  className={`flex-1 text-sm rounded-xl border px-4 py-3 outline-none resize-none ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-800"}`} />
                <button onClick={submitReply}
                  className="self-end px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Reply →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className={`text-sm ${muted}`}>Select a post to read</p>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}