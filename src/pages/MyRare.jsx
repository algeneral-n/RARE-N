import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const TABS = ["FAMILY CONTROL", "CYBER GUARDIAN", "INTEGRATIONS"];

const SendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ShieldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

export default function MyRare() {
  const [tab, setTab] = useState("FAMILY CONTROL");
  const [devices, setDevices] = useState([
    { id: 1, name: "Ahmed's iPhone", type: "phone", status: "online", location: "Riyadh, Saudi Arabia" },
    { id: 2, name: "Sara's iPad", type: "tablet", status: "online", location: "Riyadh, Saudi Arabia" },
    { id: 3, name: "Family MacBook", type: "laptop", status: "offline", location: "Last seen: Home" },
  ]);
  const [childEmail, setChildEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [childReport, setChildReport] = useState(null);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "RARE Cyber Guardian online. I monitor threats with military-grade intelligence. Report any suspicious activity." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are RARE Cyber Guardian with military cybersecurity expertise. Analyze and respond with precision. User: ${input}`,
      add_context_from_internet: true,
    });
    setMessages(prev => [...prev, { role: "assistant", content: typeof res === "string" ? res : "Analyzing..." }]);
    setLoading(false);
  };

  const searchChild = async () => {
    if (!childEmail) return;
    setSearching(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a mock family safety report for a child device registered with email ${childEmail}. Include location status, recent activity summary, and safety recommendations. Format as a brief report.`,
      response_json_schema: {
        type: "object",
        properties: {
          status: { type: "string" },
          location: { type: "string" },
          last_active: { type: "string" },
          summary: { type: "string" },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    });
    setChildReport(res);
    setSearching(false);
  };

  return (
    <div className="min-h-screen pb-56 flex flex-col">
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

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* FAMILY CONTROL */}
        {tab === "FAMILY CONTROL" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">Connected Devices</div>
            {devices.map(d => (
              <div key={d.id} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${d.status === "online" ? "bg-green-400" : "bg-slate-600"}`} />
                    <div className="text-sm font-medium text-slate-200">{d.name}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "online" ? "bg-green-500/20 text-green-400" : "bg-slate-800 text-slate-500"}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-3">{d.location}</div>
                <div className="flex gap-2">
                  {["Location", "Screen", "Apps", "Calls"].map(ctrl => (
                    <button key={ctrl} className="flex-1 py-1 rounded-lg text-xs border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                      {ctrl}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Child search */}
            <div className="rounded-xl border border-cyan-500/20 bg-slate-900/30 p-4 mt-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Monitor Child Device</div>
              <div className="flex gap-2 mb-3">
                <input value={childEmail} onChange={e => setChildEmail(e.target.value)}
                  placeholder="Child email or phone..."
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50" />
                <button onClick={searchChild} disabled={searching}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-all disabled:opacity-50">
                  {searching ? "..." : "Search"}
                </button>
              </div>
              {childReport && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Status</span><span className="text-green-400">{childReport.status}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Location</span><span className="text-slate-300">{childReport.location}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Last Active</span><span className="text-slate-300">{childReport.last_active}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">{childReport.summary}</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* CYBER GUARDIAN */}
        {tab === "CYBER GUARDIAN" && (
          <div className="flex flex-col h-[calc(100vh-300px)]">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                      ${msg.role === "user" ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-50"
                        : "bg-slate-900/80 border border-slate-700/50 text-slate-200"}`}>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold mb-1 tracking-wider">
                          <ShieldIcon /><span>CYBER GUARDIAN</span>
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900/80 border border-slate-700/50 px-4 py-3 rounded-2xl flex gap-1">
                      {[0,1,2].map(i => (
                        <motion.div key={i} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
                          className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 items-end rounded-2xl border border-slate-700/50 bg-slate-900/80 p-2">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask Cyber Guardian..." rows={1}
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none resize-none py-1" />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-40 transition-all active:scale-95">
                <SendIcon />
              </button>
            </div>
          </div>
        )}

        {/* INTEGRATIONS */}
        {tab === "INTEGRATIONS" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-3">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">App Integrations</div>
            {["Email", "WhatsApp", "Instagram", "Twitter/X", "Telegram", "LinkedIn"].map(app => (
              <div key={app} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
                <div>
                  <div className="text-sm font-medium text-slate-200">{app}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Summary & Reports via RARE</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  Connect
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}