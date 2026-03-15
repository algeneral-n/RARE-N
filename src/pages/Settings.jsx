import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["UI SETTINGS", "AI SETTINGS", "SECURITY"];

const THEMES = ["Cyberpunk", "Glass", "Apple Style", "Neon", "Black Gold"];
const FONTS = ["Inter", "Roboto", "Poppins", "Cairo", "Tajawal", "Noto Sans Arabic", "IBM Plex Mono", "Space Grotesk"];
const VOICES = ["Nova", "Alloy", "Echo", "Fable", "Onyx", "Shimmer"];
const LANGUAGES = ["Arabic", "English", "Hindi", "Chinese", "French", "German", "Italian", "Spanish"];
const DIALECTS = ["Egyptian", "Gulf", "Sudanese", "Iraqi", "Algerian", "Moroccan", "Libyan", "Tunisian", "Lebanese"];
const AI_PERSONALITIES = ["Assistant", "Analyst", "Creative", "Engineer", "Strategist", "Guardian"];
const MENU_SECTIONS = ["Main Header", "Rare Codec", "RareHub", "My Rare", "Connect", "Vault"];
const MENU_STYLES = ["Sidebar", "Apple Style", "Google Style", "Circle Menu", "Hamburger"];

export default function Settings() {
  const [tab, setTab] = useState("UI SETTINGS");

  // UI Settings state
  const [theme, setTheme] = useState("Cyberpunk");
  const [bgType, setBgType] = useState("color");
  const [bgColor, setBgColor] = useState("#0a0a0f");
  const [font, setFont] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("regular");
  const [fontSize, setFontSize] = useState("medium");
  const [btnShape, setBtnShape] = useState("rounded");
  const [btnColor, setBtnColor] = useState("#00d4ff");
  const [borderSize, setBorderSize] = useState("thin");
  const [borderColor, setBorderColor] = useState("#00d4ff");
  const [selectedMenuSection, setSelectedMenuSection] = useState("Main Header");
  const [menuStyles, setMenuStyles] = useState({});

  // AI Settings state
  const [aiPersonality, setAiPersonality] = useState("Assistant");
  const [aiVoice, setAiVoice] = useState("Nova");
  const [aiLanguage, setAiLanguage] = useState("Arabic");
  const [aiDialect, setAiDialect] = useState("Gulf");
  const [previewingVoice, setPreviewingVoice] = useState(null);

  // Security state
  const [apiKey, setApiKey] = useState("");
  const [supremeToken, setSupremeToken] = useState("");

  const row = "flex items-center justify-between py-3 border-b border-slate-800/40";
  const label = "text-sm text-slate-300";
  const sublabel = "text-xs text-slate-500 mt-0.5";
  const selectCls = "bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all";
  const btnCls = "px-4 py-2 rounded-xl text-xs font-bold border transition-all";
  const activeBtnCls = `${btnCls} bg-cyan-500 text-black border-cyan-500`;
  const inactiveBtnCls = `${btnCls} border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400`;

  return (
    <div className="min-h-screen pb-56 px-4 pt-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Settings</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                ${tab === t ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50"}`}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* UI SETTINGS */}
          {tab === "UI SETTINGS" && (
            <motion.div key="ui" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-1">

              {/* Background */}
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 mb-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Background</div>
                <div className="flex gap-2 mb-3">
                  {["color", "image"].map(t => (
                    <button key={t} onClick={() => setBgType(t)} className={bgType === t ? activeBtnCls : inactiveBtnCls}>
                      {t === "color" ? "Color" : "Image"}
                    </button>
                  ))}
                </div>
                {bgType === "color" && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-slate-700" style={{ background: bgColor }} />
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="flex-1 h-8 rounded-xl border border-slate-700 bg-transparent cursor-pointer" />
                    <span className="text-xs text-slate-500 font-mono">{bgColor}</span>
                  </div>
                )}
                {bgType === "image" && (
                  <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" />
                    <span className="text-sm">Upload Background Image</span>
                  </label>
                )}
              </div>

              {/* Theme */}
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 mb-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Theme</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {THEMES.map(t => (
                    <button key={t} onClick={() => setTheme(t)} className={theme === t ? activeBtnCls : inactiveBtnCls}>
                      {t}
                    </button>
                  ))}
                </div>
                <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer text-sm">
                  <input type="file" accept="image/*" className="hidden" />
                  Extract Colors from Image
                </label>
              </div>

              {/* Font */}
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 mb-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Typography</div>
                <select value={font} onChange={e => setFont(e.target.value)} className={`${selectCls} w-full mb-3`}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="flex gap-2 mb-3">
                  {["thin", "regular", "bold", "italic"].map(w => (
                    <button key={w} onClick={() => setFontWeight(w)} className={fontWeight === w ? activeBtnCls : inactiveBtnCls}>
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {["small", "medium", "large"].map(s => (
                    <button key={s} onClick={() => setFontSize(s)} className={fontSize === s ? activeBtnCls : inactiveBtnCls}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons & Icons */}
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 mb-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Buttons & Icons</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Shape</div>
                    <div className="flex gap-1">
                      {["rounded", "sharp", "pill"].map(s => (
                        <button key={s} onClick={() => setBtnShape(s)} className={`flex-1 py-1 text-xs ${btnShape === s ? activeBtnCls : inactiveBtnCls}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Color</div>
                    <input type="color" value={btnColor} onChange={e => setBtnColor(e.target.value)}
                      className="w-full h-8 rounded-xl border border-slate-700 bg-transparent cursor-pointer" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Border Size</div>
                    <div className="flex gap-1">
                      {["none", "thin", "thick"].map(s => (
                        <button key={s} onClick={() => setBorderSize(s)} className={`flex-1 py-1 text-xs ${borderSize === s ? activeBtnCls : inactiveBtnCls}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Border Color</div>
                    <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)}
                      className="w-full h-8 rounded-xl border border-slate-700 bg-transparent cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Menu Types */}
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 mb-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Menu Styles</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {MENU_SECTIONS.map(s => (
                    <button key={s} onClick={() => setSelectedMenuSection(s)}
                      className={selectedMenuSection === s ? activeBtnCls : inactiveBtnCls}>{s}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500 mb-2">Style for: {selectedMenuSection}</div>
                <div className="flex flex-wrap gap-2">
                  {MENU_STYLES.map(style => (
                    <button key={style} onClick={() => setMenuStyles(prev => ({ ...prev, [selectedMenuSection]: style }))}
                      className={menuStyles[selectedMenuSection] === style ? activeBtnCls : inactiveBtnCls}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-sm tracking-wider hover:from-cyan-400 hover:to-blue-400 transition-all active:scale-95">
                APPLY SETTINGS
              </button>
            </motion.div>
          )}

          {/* AI SETTINGS */}
          {tab === "AI SETTINGS" && (
            <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-3">

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Personality</div>
                <div className="flex flex-wrap gap-2">
                  {AI_PERSONALITIES.map(p => (
                    <button key={p} onClick={() => setAiPersonality(p)} className={aiPersonality === p ? activeBtnCls : inactiveBtnCls}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Voice</div>
                <div className="space-y-2">
                  {VOICES.map(v => (
                    <div key={v} className="flex items-center justify-between py-1">
                      <span className={`text-sm ${aiVoice === v ? "text-cyan-400" : "text-slate-300"}`}>{v}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setPreviewingVoice(v)}
                          className={`px-3 py-1 rounded-lg text-xs border ${previewingVoice === v ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" : "border-slate-700 text-slate-400 hover:border-cyan-500/50"} transition-all`}>
                          Preview
                        </button>
                        <button onClick={() => setAiVoice(v)}
                          className={`px-3 py-1 rounded-lg text-xs border ${aiVoice === v ? "bg-cyan-500 text-black border-cyan-500" : "border-slate-700 text-slate-400 hover:border-cyan-500/50"} transition-all`}>
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Language</div>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => setAiLanguage(l)} className={aiLanguage === l ? activeBtnCls : inactiveBtnCls}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Dialect</div>
                <div className="flex flex-wrap gap-2">
                  {DIALECTS.map(d => (
                    <button key={d} onClick={() => setAiDialect(d)} className={aiDialect === d ? activeBtnCls : inactiveBtnCls}>{d}</button>
                  ))}
                </div>
              </div>

              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-sm tracking-wider hover:from-cyan-400 hover:to-blue-400 transition-all active:scale-95">
                APPLY AI SETTINGS
              </button>
            </motion.div>
          )}

          {/* SECURITY */}
          {tab === "SECURITY" && (
            <motion.div key="sec" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-3">

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">API Keys & Tokens</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1.5">API Key</div>
                    <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                      placeholder="Enter API key..."
                      className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1.5">Supreme Access Token</div>
                    <input type="password" value={supremeToken} onChange={e => setSupremeToken(e.target.value)}
                      placeholder="Enter supreme token..."
                      className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 space-y-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Access Control</div>
                {["Change App Password", "Change Vault Password"].map(action => (
                  <button key={action} className="w-full py-3 rounded-xl border border-slate-700 text-slate-300 text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left px-4">
                    {action}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 space-y-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Vault Encryption</div>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-500/30 transition-all">
                    Encrypt Files
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold hover:border-cyan-500/50 transition-all">
                    Decrypt Files
                  </button>
                </div>
              </div>

              <button className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all">
                Reset All Settings
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}