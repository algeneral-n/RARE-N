import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "./AppSettingsContext";

// ── SVG Icons ──────────────────────────────────────────
const Ic = ({ d, size = 22, stroke = "currentColor", fill = "none", sw = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} style={{ width: size, height: size, flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((dd, i) => <path key={i} d={dd} />) : <path d={d} />}
  </svg>
);
const IcMenu = () => <Ic d={["M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"]} />;
const IcVoice = ({ on }) => <Ic d={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v4","M8 23h8"]} fill={on ? "currentColor" : "none"} />;
const IcChar = () => <Ic d={["M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z","M4 20c0-4 3.6-7 8-7s8 3 8 7"]} />;
const IcSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IcLogout = () => <Ic d={["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"]} />;
const IcClose = () => <Ic d="M18 6 6 18M6 6l12 12" size={20} />;
const IcVolumeUp = () => <Ic d={["M11 5 6 9H2v6h4l5 4V5z","M19.07 4.93a10 10 0 0 1 0 14.14","M15.54 8.46a5 5 0 0 1 0 7.07"]} />;
const IcEye = () => <Ic d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />;
const IcEyeOff = () => <Ic d={["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24","M1 1l22 22"]} />;
const IcAuto = () => <Ic d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />;
const IcZoomIn = () => <Ic d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","M21 21l-4.35-4.35","M11 8v6","M8 11h6"]} />;
const IcZoomOut = () => <Ic d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","M21 21l-4.35-4.35","M8 11h6"]} />;

// App Library items
const NAV = [
  { label: "BUILDER", path: "/RareCodec", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "HUB", path: "/RareHub", d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { label: "MY RARE", path: "/MyRare", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "VAULT", path: "/RareVault", d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" },
  { label: "CONNECT", path: "/RareConnect", d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" },
  { label: "MAP", path: "/RareMap", d: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16" },
];

// Btn style helper
const Btn = ({ children, onClick, active, danger, style = {} }) => {
  const { theme } = useAppSettings();
  return (
    <button onClick={onClick}
      style={{
        width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? theme.accentDim : danger ? "rgba(255,60,60,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? theme.accentBorder : danger ? "rgba(255,60,60,0.18)" : "rgba(255,255,255,0.07)"}`,
        color: active ? theme.accent : danger ? "rgba(255,80,80,0.7)" : theme.textDim,
        transition: "all 0.15s", ...style
      }}>
      {children}
    </button>
  );
};

export default function GlobalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, update, theme } = useAppSettings();
  const [panel, setPanel] = useState(null);

  const toggle = (p) => setPanel(prev => prev === p ? null : p);
  const close = () => setPanel(null);

  const voiceMode = settings.voiceMode;
  const charVisible = settings.charVisible;

  return (
    <>
      {/* ── Header Bar: 5 أزرار فقط ── */}
      <div className="fixed top-0 left-0 right-0" style={{ zIndex: 50, paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          background: "rgba(0,11,16,0.88)", backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${theme.accentBorder}`
        }}>
          <Btn active={panel === "menu"} onClick={() => toggle("menu")}><IcMenu /></Btn>
          <Btn active={panel === "voice" || voiceMode === "on"} onClick={() => toggle("voice")}><IcVoice on={voiceMode === "on"} /></Btn>
          <Btn active={panel === "char"} onClick={() => toggle("char")}><IcChar /></Btn>
          <Btn active={location.pathname === "/Settings"} onClick={() => { close(); navigate("/Settings"); }}><IcSettings /></Btn>
          <Btn danger onClick={() => base44.auth.logout()}><IcLogout /></Btn>
        </div>
      </div>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {panel && (
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close} className="fixed inset-0" style={{ zIndex: 48, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }} />
        )}
      </AnimatePresence>

      {/* ── APP LIBRARY ── */}
      <AnimatePresence>
        {panel === "menu" && (
          <motion.div key="menu"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed" style={{
              zIndex: 49, top: 72, left: 12, right: 12, bottom: 12,
              borderRadius: 24, overflow: "hidden",
              background: "rgba(0,10,18,0.97)", border: `1px solid ${theme.accentBorder}`,
              backdropFilter: "blur(30px)"
            }}>
            <button onClick={close} style={{
              position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: 10,
              background: theme.accentDim, border: `1px solid ${theme.accentBorder}`,
              color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center"
            }}><IcClose /></button>

            <div style={{ padding: "52px 14px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, overflowY: "auto", maxHeight: "100%" }}>
              {NAV.map((item, i) => (
                <motion.button key={item.path}
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => { close(); navigate(item.path); }}
                  style={{
                    padding: "24px 8px", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    background: location.pathname === item.path ? theme.accentDim : "rgba(255,255,255,0.03)",
                    border: `1px solid ${location.pathname === item.path ? theme.accentBorder : "rgba(255,255,255,0.06)"}`,
                    color: location.pathname === item.path ? theme.accent : theme.textDim,
                    transition: "all 0.15s", cursor: "pointer"
                  }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 28, height: 28 }}>
                    <path d={item.d} />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", fontFamily: "'IBM Plex Mono',monospace" }}>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VOICE PANEL ── */}
      <AnimatePresence>
        {panel === "voice" && (
          <motion.div key="voice"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{
              position: "fixed", zIndex: 49, top: 72, right: 12, width: 280, borderRadius: 20,
              padding: 18, background: "rgba(0,10,18,0.97)",
              border: `1px solid ${theme.accentBorder}`, backdropFilter: "blur(24px)"
            }}>
            {/* ON / OFF / SMART */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["on", "off", "smart"].map(m => (
                <button key={m} onClick={() => update({ voiceMode: m })}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 12,
                    background: voiceMode === m ? theme.accent : theme.accentDim,
                    color: voiceMode === m ? "#000b10" : theme.accent,
                    border: `1px solid ${voiceMode === m ? theme.accent : theme.accentBorder}`,
                    fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                    fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer"
                  }}>
                  {m}
                </button>
              ))}
            </div>
            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IcVolumeUp />
              <input type="range" min={0} max={100} value={settings.voiceVolume}
                onChange={e => update({ voiceVolume: +e.target.value })}
                style={{ flex: 1, accentColor: theme.accent }} />
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: theme.textDim, minWidth: 28 }}>
                {settings.voiceVolume}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CHARACTER PANEL ── */}
      <AnimatePresence>
        {panel === "char" && (
          <motion.div key="char"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{
              position: "fixed", zIndex: 49, top: 72, right: 12, width: 280, borderRadius: 20,
              padding: 18, background: "rgba(0,10,18,0.97)",
              border: `1px solid ${theme.accentBorder}`, backdropFilter: "blur(24px)"
            }}>
            {/* Show/Hide + Auto */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => update({ charVisible: !charVisible })}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: charVisible ? theme.accentDim : "rgba(255,255,255,0.04)",
                  color: charVisible ? theme.accent : theme.textDim,
                  border: `1px solid ${charVisible ? theme.accentBorder : "rgba(255,255,255,0.07)"}`, cursor: "pointer"
                }}>
                {charVisible ? <IcEye /> : <IcEyeOff />}
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'IBM Plex Mono',monospace" }}>
                  {charVisible ? "SHOW" : "HIDE"}
                </span>
              </button>
              <button onClick={() => update({ charAutoAnim: !settings.charAutoAnim })}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: settings.charAutoAnim ? theme.accentDim : "rgba(255,255,255,0.04)",
                  color: settings.charAutoAnim ? theme.accent : theme.textDim,
                  border: `1px solid ${settings.charAutoAnim ? theme.accentBorder : "rgba(255,255,255,0.07)"}`, cursor: "pointer"
                }}>
                <IcAuto />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'IBM Plex Mono',monospace" }}>AUTO</span>
              </button>
            </div>
            {/* Zoom */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IcZoomOut />
              <input type="range" min={50} max={200} value={settings.charSize}
                onChange={e => update({ charSize: +e.target.value })}
                style={{ flex: 1, accentColor: theme.accent }} />
              <IcZoomIn />
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: theme.textDim, minWidth: 32 }}>
                {settings.charSize}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}