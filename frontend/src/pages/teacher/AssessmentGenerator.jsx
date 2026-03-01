// AssessmentGenerator.jsx
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useApp } from "../../context/AppContext";

const SAMPLE_QUESTIONS = [
  { q: "State Newton's Second Law of Motion and write its mathematical expression.", type: "Short Answer", marks: 3 },
  { q: "A car of mass 1200 kg accelerates from 0 to 72 km/h in 10 seconds. Calculate the force applied.", type: "Numerical", marks: 4 },
  { q: "Which of the following is the correct formula for Newton's Second Law? (a) F=mv (b) F=ma (c) F=m/a (d) F=ma²", type: "MCQ", marks: 1 },
  { q: "Explain the difference between mass and weight with an example.", type: "Short Answer", marks: 3 },
  { q: "A rocket ejects gas backward at high speed. Using Newton's Laws, explain how the rocket moves forward.", type: "Long Answer", marks: 5 },
];

export default function AssessmentGenerator() {
  const { dark } = useApp();
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setQuestions([]);
    await new Promise(r => setTimeout(r, 2000));
    setQuestions(SAMPLE_QUESTIONS);
    setLoading(false);
  };

  const bg   = dark ? "bg-slate-950" : "bg-slate-50";
  const card = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const inputCls = `w-full text-sm rounded-xl border px-4 py-3 outline-none ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600" : "bg-white border-slate-300 text-slate-800"}`;

  return (
    <Sidebar>
      <div className={`min-h-screen ${bg} p-6 md:p-8`}>
        <div className="max-w-3xl mx-auto">
          <h1 className={`font-display text-3xl italic mb-2 ${text}`}>📋 AI Assessment Generator</h1>
          <p className={`text-sm ${muted} mb-8`}>Type a prompt in plain language. AI generates questions in seconds. Review, edit, then publish to your class.</p>

          {/* Prompt card */}
          <div className={`rounded-2xl border p-6 mb-6 ${card}`}>
            <label className={`block text-xs font-bold mb-2 ${muted}`}>Describe the assessment you need</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Create 5 questions on Newton's Laws of Motion for Class 9, mix of MCQ and short answer, medium difficulty. Include one numerical problem."
              rows={4}
              className={`${inputCls} resize-none mb-4`}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {["Newton's Laws Class 9", "Quadratic Equations Class 10", "Freedom Movement Class 8", "Chemical Reactions Class 9"].map(p => (
                <button key={p} onClick={() => setPrompt(`Create 5 questions on ${p}, mix of MCQ and short answer, medium difficulty.`)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${dark ? "border-slate-700 text-slate-400 hover:border-sky-700 hover:text-sky-300" : "border-slate-300 text-slate-500 hover:border-sky-400"}`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={generate} disabled={!prompt.trim() || loading}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-50">
              {loading ? "✨ Generating…" : "✨ Generate with AI →"}
            </button>
          </div>

          {/* Generated questions */}
          {questions.length > 0 && (
            <div className={`rounded-2xl border ${card}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-200"}`}>
                <div>
                  <div className={`font-bold ${text}`}>{questions.length} questions generated</div>
                  <div className={`text-xs ${muted}`}>Review and edit before publishing</div>
                </div>
                <button onClick={() => { setPublished(true); setTimeout(() => setPublished(false), 3000); }}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl">
                  {published ? "✓ Published!" : "Publish to Class →"}
                </button>
              </div>
              <div className="p-5 space-y-4">
                {questions.map((q, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${dark ? "border-slate-700" : "border-slate-100"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`text-xs font-black w-6 shrink-0 ${muted}`}>{i + 1}.</span>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold mb-2 ${text}`}>{q.q}</div>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{q.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-teal-900/30 text-teal-300" : "bg-teal-100 text-teal-700"}`}>{q.marks} marks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}