import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const VoiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const RareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M8 17l4 4 4-4"/>
  </svg>
);
const SettingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MENU_ITEMS = [
  { label: "RARE CODEC", path: "/RareCodec" },
  { label: "RAREHUB", path: "/RareHub" },
  { label: "MY RARE", path: "/MyRare" },
  { label: "RARE VAULT", path: "/RareVault" },
  { label: "RARE CONNECT", path: "/RareConnect" },
  { label: "RARE MAP", path: "/RareMap" },
];

const THEMES = [
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "neumorphism", label: "Neumorphic" },
  { id: "glass", label: "Glass" },
  { id: "neon", label: "Neon" },
  { id: "black-gold", label: "Black Gold" },
  { id: "apple", label: "Apple" },
];

export default function GlobalHeader({ onCharacterToggle, characterVisible, onCharacterSizeChange, onAnimation, currentTheme, onThemeChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [rareOpen, setRareOpen] = useState(false);
  const [voiceMode, setVoiceMode] = useState("smart");
  const [volume, setVolume] = useState([80]);
  const [characterSize, setCharacterSize] = useState([100]);
  const location = useLocation();
  const voiceRef = useRef(null);
  const rareRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (voiceRef.current && !voiceRef.current.contains(e.target)) setVoiceOpen(false);
      if (rareRef.current && !rareRef.current.contains(e.target)) setRareOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btnBase = "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium";
  const btnActive = "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40";
  const btnInactive = "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10";

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-2 mt-2 rounded-2xl border border-cyan-500/20 bg-black/80 backdrop-blur-xl px-2 py-2">
        <div className="flex items-center justify-around">

          {/* MENU */}
          <div ref={menuRef} className="relative">
            <button onClick={() => { setMenuOpen(!menuOpen); setVoiceOpen(false); setRareOpen(false); }}
              className={`${btnBase} ${menuOpen ? btnActive : btnInactive}`}>
              <MenuIcon /><span>MENU</span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-cyan-500/30 bg-black/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
                  {MENU_ITEMS.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-b border-slate-800/50 last:border-0
                        ${location.pathname === item.path ? "text-cyan-400 bg-cyan-500/10" : "text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10"}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* VOICE */}
          <div ref={voiceRef} className="relative">
            <button onClick={() => { setVoiceOpen(!voiceOpen); setMenuOpen(false); setRareOpen(false); }}
              className={`${btnBase} ${voiceOpen ? btnActive : btnInactive}`}>
              <VoiceIcon /><span>VOICE</span>
            </button>
            <AnimatePresence>
              {voiceOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border border-cyan-500/30 bg-black/95 backdrop-blur-xl p-4 shadow-2xl shadow-cyan-500/10">
                  <div className="flex gap-2 mb-4">
                    {["on", "off", "smart"].map((mode) => (
                      <button key={mode} onClick={() => setVoiceMode(mode)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-200
                          ${voiceMode === mode ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50"}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Volume</div>
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1}
                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400" />
                  <div className="text-right text-xs text-cyan-400 mt-1">{volume[0]}%</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RARE */}
          <div ref={rareRef} className="relative">
            <button onClick={() => { setRareOpen(!rareOpen); setMenuOpen(false); setVoiceOpen(false); }}
              className={`${btnBase} ${rareOpen ? btnActive : btnInactive}`}>
              <RareIcon /><span>RARE</span>
            </button>
            <AnimatePresence>
              {rareOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 rounded-xl border border-cyan-500/30 bg-black/95 backdrop-blur-xl p-4 shadow-2xl shadow-cyan-500/10">
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => onCharacterToggle && onCharacterToggle()}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all
                        ${characterVisible ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50"}`}>
                      {characterVisible ? "VISIBLE" : "HIDDEN"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Size</div>
                  <Slider value={characterSize} onValueChange={(v) => { setCharacterSize(v); onCharacterSizeChange && onCharacterSizeChange(v[0]); }}
                    min={50} max={150} step={5}
                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400" />
                  <div className="text-right text-xs text-cyan-400 mt-1">{characterSize[0]}%</div>
                  <div className="text-xs text-slate-500 mb-2 mt-3 uppercase tracking-wider">Theme</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {THEMES.map((t) => (
                      <button key={t.id} onClick={() => onThemeChange && onThemeChange(t.id)}
                        className={`py-1 rounded-lg text-xs border uppercase transition-all
                          ${currentTheme === t.id ? "bg-cyan-500 text-black border-cyan-500" : "border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SETTINGS */}
          <Link to="/Settings" className={`${btnBase} ${location.pathname === "/Settings" ? btnActive : btnInactive}`}>
            <SettingIcon /><span>SETTING</span>
          </Link>

          {/* LOGOUT */}
          <button className={`${btnBase} ${btnInactive} hover:text-red-400 hover:bg-red-500/10`}>
            <LogoutIcon /><span>LOG OUT</span>
          </button>

        </div>
      </div>
    </div>
  );
}