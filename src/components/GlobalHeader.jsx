import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

// Icons
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const VoiceIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={active ? "currentColor" : "none"}/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const CharIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <circle cx="12" cy="7" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/>
    <line x1="18" y1="9" x2="22" y2="9"/><line x1="18" y1="12" x2="22" y2="12"/>
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Nav items for App Library
const NAV_ITEMS = [
  { label: "RARE BUILDER", path: "/RareCodec", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "RARE HUB", path: "/RareHub", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { label: "MY RARE", path: "/MyRare", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "RARE VAULT", path: "/RareVault", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "RARE CONNECT", path: "/RareConnect", icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" },
  { label: "RARE MAP", path: "/RareMap", icon: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16" },
];

export default function GlobalHeader({ characterVisible, onCharacterToggle, onCharacterSizeChange, characterSize, autoAnim, onAutoAnimToggle, voiceMode, onVoiceMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showChar, setShowChar] = useState(false);
  const [volume, setVolume] = useState(80);
  const currentVoiceMode = voiceMode || "smart";

  const handleNav = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <>
      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(0,11,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,234,255,0.1)" }}>

          {/* Left: Menu */}
          <button onClick={() => { setShowMenu(true); setShowVoice(false); setShowChar(false); }}
            className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90"
            style={{ color: "#00eaff", background: "rgba(0,234,255,0.08)", border: "1px solid rgba(0,234,255,0.15)" }}>
            <MenuIcon />
          </button>

          {/* Center: Logo */}
          <button onClick={() => navigate("/Home")}
            className="text-base font-black tracking-[0.4em]"
            style={{ color: "#00eaff", textShadow: "0 0 15px rgba(0,234,255,0.5)" }}>
            RARE
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Voice */}
            <button onClick={() => { setShowVoice(v => !v); setShowMenu(false); setShowChar(false); }}
              className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90"
              style={{
                color: showVoice || currentVoiceMode === "on" ? "#00eaff" : "rgba(0,234,255,0.4)",
                background: showVoice ? "rgba(0,234,255,0.15)" : "rgba(0,234,255,0.05)",
                border: `1px solid ${showVoice ? "rgba(0,234,255,0.4)" : "rgba(0,234,255,0.1)"}`
              }}>
              <VoiceIcon active={currentVoiceMode === "on"} />
            </button>

            {/* Char */}
            <button onClick={() => { setShowChar(c => !c); setShowMenu(false); setShowVoice(false); }}
              className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90"
              style={{
                color: showChar ? "#00eaff" : "rgba(0,234,255,0.4)",
                background: showChar ? "rgba(0,234,255,0.15)" : "rgba(0,234,255,0.05)",
                border: `1px solid ${showChar ? "rgba(0,234,255,0.4)" : "rgba(0,234,255,0.1)"}`
              }}>
              <CharIcon />
            </button>

            {/* Settings */}
            <button onClick={() => navigate("/Settings")}
              className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90"
              style={{ color: location.pathname === "/Settings" ? "#00eaff" : "rgba(0,234,255,0.4)", background: "rgba(0,234,255,0.05)", border: "1px solid rgba(0,234,255,0.1)" }}>
              <SettingsIcon />
            </button>

            {/* Logout */}
            <button onClick={handleLogout}
              className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90"
              style={{ color: "rgba(255,80,80,0.6)", background: "rgba(255,50,50,0.05)", border: "1px solid rgba(255,50,50,0.1)" }}>
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>

      {/* APP LIBRARY MENU */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

            <motion.div key="menu"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed z-50 inset-4 top-20 rounded-3xl overflow-hidden"
              style={{ background: "rgba(0,11,20,0.97)", border: "1px solid rgba(0,234,255,0.15)", backdropFilter: "blur(30px)" }}>

              {/* Close */}
              <button onClick={() => setShowMenu(false)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: "rgba(0,234,255,0.08)", color: "rgba(0,234,255,0.6)" }}>
                <CloseIcon />
              </button>

              {/* Grid */}
              <div className="p-6 pt-8 grid grid-cols-2 gap-3 overflow-y-auto h-full pb-10">
                {NAV_ITEMS.map((item, i) => (
                  <motion.button key={item.path}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleNav(item.path)}
                    className="flex flex-col items-center justify-center py-6 rounded-2xl transition-all active:scale-95"
                    style={{
                      background: location.pathname === item.path ? "rgba(0,234,255,0.12)" : "rgba(0,234,255,0.04)",
                      border: `1px solid ${location.pathname === item.path ? "rgba(0,234,255,0.4)" : "rgba(0,234,255,0.1)"}`,
                    }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={location.pathname === item.path ? "#00eaff" : "rgba(0,234,255,0.5)"}
                      strokeWidth="1.5" className="w-7 h-7 mb-3">
                      <path d={item.icon} />
                    </svg>
                    <span className="text-xs font-bold tracking-wider"
                      style={{ color: location.pathname === item.path ? "#00eaff" : "rgba(0,234,255,0.6)" }}>
                      {item.label.replace("RARE ", "")}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* VOICE PANEL */}
      <AnimatePresence>
        {showVoice && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowVoice(false)}
              className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="fixed z-50 right-4 rounded-2xl p-4 w-72"
              style={{ top: 76, background: "rgba(0,11,20,0.97)", border: "1px solid rgba(0,234,255,0.2)", backdropFilter: "blur(20px)" }}>

              {/* 3 mode buttons */}
              <div className="flex gap-2 mb-4">
                {["on", "off", "smart"].map(mode => (
                  <button key={mode} onClick={() => onVoiceMode?.(mode)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                    style={{
                      background: currentVoiceMode === mode ? "#00eaff" : "rgba(0,234,255,0.06)",
                      color: currentVoiceMode === mode ? "#000b10" : "rgba(0,234,255,0.5)",
                      border: `1px solid ${currentVoiceMode === mode ? "#00eaff" : "rgba(0,234,255,0.15)"}`
                    }}>
                    {mode}
                  </button>
                ))}
              </div>

              {/* Volume slider */}
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,234,255,0.5)" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#00eaff", background: `linear-gradient(to right, #00eaff ${volume}%, rgba(0,234,255,0.15) ${volume}%)` }} />
                <span className="text-xs font-mono" style={{ color: "rgba(0,234,255,0.5)", minWidth: 28 }}>{volume}%</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CHARACTER PANEL */}
      <AnimatePresence>
        {showChar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowChar(false)}
              className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="fixed z-50 right-4 rounded-2xl p-4 w-72"
              style={{ top: 76, background: "rgba(0,11,20,0.97)", border: "1px solid rgba(0,234,255,0.2)", backdropFilter: "blur(20px)" }}>

              {/* Show/Hide */}
              <div className="flex gap-2 mb-4">
                <button onClick={onCharacterToggle}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                  style={{
                    background: characterVisible ? "#00eaff" : "rgba(0,234,255,0.06)",
                    color: characterVisible ? "#000b10" : "rgba(0,234,255,0.5)",
                    border: `1px solid ${characterVisible ? "#00eaff" : "rgba(0,234,255,0.15)"}`
                  }}>
                  {characterVisible ? "VISIBLE" : "HIDDEN"}
                </button>
                <button onClick={onAutoAnimToggle}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                  style={{
                    background: autoAnim ? "rgba(0,234,255,0.15)" : "rgba(0,234,255,0.06)",
                    color: autoAnim ? "#00eaff" : "rgba(0,234,255,0.4)",
                    border: `1px solid ${autoAnim ? "rgba(0,234,255,0.4)" : "rgba(0,234,255,0.15)"}`
                  }}>
                  AUTO
                </button>
              </div>

              {/* Size slider */}
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,234,255,0.5)" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
                <input type="range" min="50" max="200" value={characterSize || 100}
                  onChange={e => onCharacterSizeChange?.(+e.target.value)}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#00eaff" }} />
                <span className="text-xs font-mono" style={{ color: "rgba(0,234,255,0.5)", minWidth: 32 }}>{characterSize || 100}%</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}