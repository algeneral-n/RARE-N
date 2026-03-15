import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const TABS = ["CHAT", "IMAGES", "VIDEO", "AUDIO", "FILES", "PROJECTS"];

const UploadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const SendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

export default function RareHub() {
  const [tab, setTab] = useState("CHAT");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to RareHub. I am RARE, your supreme AI assistant. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are RARE, a supreme AI assistant with a military-grade cyber mindset. Be concise and precise. User says: ${input}`,
    });
    setMessages(prev => [...prev, { role: "assistant", content: typeof res === "string" ? res : res.response || "Processing..." }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pb-52">
      {/* Tabs */}
      <div className="flex overflow-x-auto px-4 gap-2 py-3 border-b border-slate-800/50">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
              ${tab === t ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-50"
                  : "bg-slate-900/80 border border-slate-700/50 text-slate-200"}`}>
                {msg.role === "assistant" && (
                  <div className="text-xs text-cyan-400 font-bold mb-1 tracking-wider">RARE</div>
                )}
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-slate-900/80 border border-slate-700/50 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 items-end rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur p-2">
          <label className="p-2 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
            <input type="file" className="hidden" accept="*/*" />
            <UploadIcon />
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Message RARE..." rows={1}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none resize-none py-1" />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            className="p-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}