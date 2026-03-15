import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const TABS = ["CODEC", "TERMINAL", "PREVIEW", "TEMPLATES"];
const ROLES = ["Builder", "Debugger", "Planner", "Solver", "Designer"];

const TERMINAL_GROUPS = {
  "GitHub": ["git init", "git add .", "git commit -m 'update'", "git push origin main", "git pull", "git clone", "git branch", "git checkout -b"],
  "Expo": ["expo start", "expo build:ios", "expo build:android", "expo publish", "expo install", "eas build", "eas submit"],
  "Supabase": ["supabase init", "supabase start", "supabase db push", "supabase db pull", "supabase gen types"],
  "Render": ["render deploy", "render logs", "render env", "render scale"],
  "NPM": ["npm install", "npm run build", "npm run dev", "npm run start", "npm audit fix", "npm update"],
  "PM2": ["pm2 start", "pm2 stop all", "pm2 restart all", "pm2 logs", "pm2 status", "pm2 delete all"],
  "Cloudflare": ["wrangler publish", "wrangler dev", "wrangler login", "wrangler whoami"],
  "Microsoft": ["az login", "az webapp deploy", "az group create", "az resource list"],
};

const TEMPLATES = [
  { name: "E-Commerce App", desc: "Full store with cart, payments & admin" },
  { name: "Social Platform", desc: "Posts, follows, messaging & notifications" },
  { name: "Dashboard Analytics", desc: "Charts, KPIs & real-time data" },
  { name: "AI Chat Bot", desc: "Multi-modal AI assistant interface" },
  { name: "Task Manager", desc: "Kanban, sprints & team collaboration" },
  { name: "Mobile Banking", desc: "Transactions, cards & investments UI" },
  { name: "Real Estate App", desc: "Listings, maps & virtual tours" },
  { name: "Health Tracker", desc: "Vitals, workouts & nutrition logging" },
];

const SendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const TerminalIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;

export default function RareCodec() {
  const [tab, setTab] = useState("CODEC");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "RARE CODEC ready. I am your AI developer. Describe what you want to build and I will architect, code, and deploy it." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Builder");
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState(["RARE Terminal v1.0 - Cloud Terminal Ready", "Type commands or use quick commands panel"]);
  const [showCmdPanel, setShowCmdPanel] = useState(false);
  const [activeGroup, setActiveGroup] = useState("GitHub");
  const [previewUrl, setPreviewUrl] = useState("");
  const messagesEndRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [terminalHistory]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are RARE CODEC, an expert AI developer acting as a ${role}. 
      Provide detailed technical assistance. Use markdown for code blocks.
      User request: ${input}`,
      model: "claude_sonnet_4_6",
    });
    setMessages(prev => [...prev, { role: "assistant", content: typeof res === "string" ? res : "Processing..." }]);
    setLoading(false);
  };

  const runTerminalCommand = async () => {
    if (!terminalInput.trim()) return;
    const cmd = terminalInput;
    setTerminalHistory(prev => [...prev, `$ ${cmd}`]);
    setTerminalInput("");
    setTerminalHistory(prev => [...prev, "Executing..."]);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Simulate a terminal response for this command: ${cmd}. Return realistic terminal output only, no explanation.`,
    });
    setTerminalHistory(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = typeof res === "string" ? res : "Command executed";
      return updated;
    });
  };

  const applyQuickCmd = (cmd) => {
    setTerminalInput(cmd);
    setShowCmdPanel(false);
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

      {/* CODEC */}
      {tab === "CODEC" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/30 overflow-x-auto">
            <div className="text-xs text-slate-500 uppercase tracking-wider whitespace-nowrap">Role:</div>
            {ROLES.map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all
                  ${role === r ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}>
                {r}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === "user" ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-50"
                      : "bg-slate-900/80 border border-slate-700/50 text-slate-200"}`}>
                    {msg.role === "assistant" && (
                      <div className="text-xs text-cyan-400 font-bold mb-1 tracking-wider flex items-center gap-1">
                        <TerminalIcon /><span>CODEC - {role}</span>
                      </div>
                    )}
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/80 border border-slate-700/50 px-4 py-3 rounded-2xl flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.div key={i} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 pb-2">
            <div className="flex gap-2 items-end rounded-2xl border border-slate-700/50 bg-slate-900/80 p-2">
              <label className="p-2 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">
                <input type="file" className="hidden" accept="*/*" /><UploadIcon />
              </label>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Describe what you want to build..." rows={2}
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none resize-none py-1" />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-40 transition-all active:scale-95">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERMINAL */}
      {tab === "TERMINAL" && (
        <div className="flex flex-col flex-1 overflow-hidden relative">
          {/* Quick Commands Panel */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/30">
            <button onClick={() => setShowCmdPanel(!showCmdPanel)}
              className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center gap-1.5">
              <TerminalIcon /> Quick Commands
            </button>
          </div>

          <AnimatePresence>
            {showCmdPanel && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="border-b border-slate-800/30 overflow-hidden">
                <div className="flex overflow-x-auto gap-2 px-4 py-2">
                  {Object.keys(TERMINAL_GROUPS).map(g => (
                    <button key={g} onClick={() => setActiveGroup(g)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all
                        ${activeGroup === g ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50"}`}>
                      {g}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                  {TERMINAL_GROUPS[activeGroup].map(cmd => (
                    <button key={cmd} onClick={() => applyQuickCmd(cmd)}
                      className="px-3 py-1 rounded-lg text-xs bg-slate-900 border border-slate-700/50 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all font-mono">
                      {cmd}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto bg-black/60 p-4 font-mono text-xs">
            {terminalHistory.map((line, i) => (
              <div key={i} className={`mb-1 leading-relaxed ${line.startsWith("$") ? "text-cyan-400" : "text-green-400"}`}>
                {line}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <div className="px-4 pb-2 pt-2 border-t border-slate-800/30">
            <div className="flex gap-2 items-center font-mono rounded-xl border border-slate-700/50 bg-black/60 px-3 py-2">
              <span className="text-cyan-400 text-sm">$</span>
              <input value={terminalInput} onChange={e => setTerminalInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") runTerminalCommand(); }}
                placeholder="Enter command..."
                className="flex-1 bg-transparent text-sm text-green-400 placeholder-slate-600 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {tab === "PREVIEW" && (
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/30">
            <input value={previewUrl} onChange={e => setPreviewUrl(e.target.value)}
              placeholder="Enter URL to preview..."
              className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50" />
            <button onClick={() => {}}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-all">
              Load
            </button>
          </div>
          {previewUrl ? (
            <iframe src={previewUrl} className="flex-1 w-full border-0" />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-600">
                <div className="text-4xl mb-3 opacity-30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mx-auto">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
                <div className="text-sm">Enter a URL above to preview</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TEMPLATES */}
      {tab === "TEMPLATES" && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
            {TEMPLATES.map(t => (
              <div key={t.name} className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 flex items-center justify-between hover:border-cyan-500/20 transition-all">
                <div>
                  <div className="text-sm font-medium text-slate-200">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                    Preview
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all">
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}