import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSettings } from "@/components/AppSettingsContext";
import { THEMES, FONTS_AR, FONTS_EN, ELEVENLABS_VOICES, AI_DIALECTS, AI_PERSONALITIES, BTN_SHAPES, MENU_STYLES } from "@/components/theme";
import { base44 } from "@/api/base44Client";

const TABS = [
  { id: "ui", label: "UI" },
  { id: "ai", label: "AI" },
  { id: "char", label: "CHAR" },
  { id: "security", label: "SECURE" },
];

const PALETTE = [
  "#00eaff","#3b82f6","#a78bfa","#f472b6","#f5c842","#10b981",
  "#ef4444","#ff7700","#ffffff","#c0c0c0","#666666","#000000",
];

const LANG_OPTIONS = [
  { id: "ar", label: "العربية" },
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
  { id: "ur", label: "اردو" },
  { id: "es", label: "Español" },
];

// ── Bottom Sheet picker ──────────────────────────────────
function Sheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 80 }} />
          <motion.div key="sh"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 81,
              borderRadius: "24px 24px 0 0",
              background: "rgba(0,10,18,0.98)", border: "1px solid var(--ra-border)",
              backdropFilter: "blur(30px)", maxHeight: "75vh", overflowY: "auto",
              paddingBottom: "env(safe-area-inset-bottom,20px)"
            }}>
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 18px 14px" }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "var(--ra)", fontFamily: "'IBM Plex Mono',monospace" }}>{title}</span>
              <button onClick={onClose} style={{ background: "var(--ra-dim)", border: "1px solid var(--ra-border)", borderRadius: 10, width: 30, height: 30, color: "var(--ra)", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: "0 16px 20px" }}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Setting Row ── زر يفتح Sheet ─────────────────────────
function SettingRow({ label, value, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", borderRadius: 14, marginBottom: 8, cursor: "pointer",
      background: "var(--rc)", border: "1px solid var(--ra-border)", textAlign: "left"
    }}>
      <span style={{ fontSize: 13, color: "var(--rt)", fontWeight: 500 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "var(--ra)", fontWeight: 600, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
        <span style={{ color: "var(--rt-dim)", fontSize: 18, lineHeight: 1 }}>›</span>
      </div>
    </button>
  );
}

// ── Color Grid ───────────────────────────────────────────
function ColorGrid({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "8px 0" }}>
      {PALETTE.map(c => (
        <button key={c} onClick={() => onChange(c)}
          style={{ width: 44, height: 44, borderRadius: 12, background: c, border: `3px solid ${value === c ? "white" : "transparent"}`, cursor: "pointer", flexShrink: 0 }} />
      ))}
      <label style={{ width: 44, height: 44, borderRadius: 12, background: "var(--ra-dim)", border: "1px dashed var(--ra-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, color: "var(--ra)" }}>
        +<input type="color" style={{ display: "none" }} onChange={e => onChange(e.target.value)} />
      </label>
    </div>
  );
}

// ── Font List ────────────────────────────────────────────
function FontList({ items, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map(f => (
        <button key={f.value} onClick={() => onChange(f.value)}
          style={{
            padding: "12px 16px", borderRadius: 12, textAlign: "left", cursor: "pointer",
            background: value === f.value ? "var(--ra-dim)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${value === f.value ? "var(--ra)" : "rgba(255,255,255,0.06)"}`,
            color: value === f.value ? "var(--ra)" : "var(--rt)",
            fontFamily: f.value, fontSize: 15
          }}>
          {f.name}
        </button>
      ))}
    </div>
  );
}

// ── Option List ──────────────────────────────────────────
function OptionList({ items, value, onChange, getLabel = x => x, getValue = x => x }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map(item => {
        const v = getValue(item); const l = getLabel(item);
        return (
          <button key={v} onClick={() => onChange(v)}
            style={{
              padding: "12px 16px", borderRadius: 12, textAlign: "left", cursor: "pointer",
              background: value === v ? "var(--ra-dim)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${value === v ? "var(--ra)" : "rgba(255,255,255,0.06)"}`,
              color: value === v ? "var(--ra)" : "var(--rt)", fontSize: 14
            }}>
            {l}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const { settings, update, theme } = useAppSettings();
  const [tab, setTab] = useState("ui");
  const [sheet, setSheet] = useState(null); // which sheet is open
  const [previewVoice, setPreviewVoice] = useState(null);
  const bgInputRef = useRef(null);
  const themeImgRef = useRef(null);

  const openSheet = (id) => setSheet(id);
  const closeSheet = () => setSheet(null);

  const uploadBg = (e) => {
    const f = e.target.files[0]; if (!f) return;
    update({ bgImage: URL.createObjectURL(f) });
    closeSheet();
  };

  const uploadThemeImg = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file: f });
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: "Extract the dominant accent color as a hex code from this image for a dark mobile UI.",
      file_urls: [file_url],
      response_json_schema: { type: "object", properties: { accent: { type: "string" } } }
    });
    if (res?.accent) update({ btnColor: res.accent, borderColor: res.accent + "55" });
    closeSheet();
  };

  const previewElevenLabs = (voiceId) => {
    // Use Web Speech API for free preview — no API key needed
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPreviewVoice(voiceId);
    const utter = new SpeechSynthesisUtterance("مرحبا، أنا مساعدك الذكي RARE");
    utter.lang = "ar-SA";
    utter.rate = 0.9;
    utter.onend = () => setPreviewVoice(null);
    utter.onerror = () => setPreviewVoice(null);
    window.speechSynthesis.speak(utter);
  };

  // readable labels
  const themeLabel = THEMES[settings.theme]?.name || settings.theme;
  const fontName = [...FONTS_AR, ...FONTS_EN].find(f => f.value === settings.font)?.name || "Default";
  const btnShapeLabel = BTN_SHAPES.find(b => b.id === settings.btnShape)?.label || "Rounded";
  const menuLabel = MENU_STYLES.find(m => m.id === settings.menuStyle)?.label || "App Library";
  const voiceName = ELEVENLABS_VOICES.find(v => v.id === settings.aiVoiceId)?.name || "Default";
  const personalityLabel = AI_PERSONALITIES.find(p => p.id === settings.aiPersonality)?.name || "Assistant";
  const dialectLabel = settings.aiDialect || "خليجي";
  const langLabel = LANG_OPTIONS.find(l => l.id === settings.aiLang)?.label || "عربي";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      {/* ── Tab bar ── */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 14px 10px",
        position: "sticky", top: 64, zIndex: 30,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--ra-border)"
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer",
              background: tab === t.id ? "var(--ra)" : "var(--ra-dim)",
              color: tab === t.id ? "#000b10" : "var(--ra)",
              border: `1px solid ${tab === t.id ? "var(--ra)" : "var(--ra-border)"}`,
              transition: "all 0.15s"
            }}>{t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "12px 14px 0" }}>
        <AnimatePresence mode="wait">

          {/* ══ UI ══ */}
          {tab === "ui" && (
            <motion.div key="ui" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <SettingRow label="Background" value={settings.bgImage ? "Custom Image" : "Default"} onOpen={() => openSheet("bg")} />
              <SettingRow label="Theme" value={themeLabel} onOpen={() => openSheet("theme")} />
              <SettingRow label="Menu Style" value={menuLabel} onOpen={() => openSheet("menu")} />
              <SettingRow label="Font" value={fontName} onOpen={() => openSheet("font")} />
              <SettingRow label="Font Color" value={settings.fontColor || "#e2f5ff"} onOpen={() => openSheet("fontColor")} />
              <SettingRow label="Font Size" value={settings.fontSize || "15px"} onOpen={() => openSheet("fontSize")} />
              <SettingRow label="Font Weight" value={settings.fontWeight || "400"} onOpen={() => openSheet("fontWeight")} />
              <SettingRow label="Button Shape" value={btnShapeLabel} onOpen={() => openSheet("btnShape")} />
              <SettingRow label="Button Color" value={settings.btnColor || "#00eaff"} onOpen={() => openSheet("btnColor")} />
              <SettingRow label="Border Size" value={(settings.borderSize || "1") + "px"} onOpen={() => openSheet("borderSize")} />
              <SettingRow label="Border Color" value={settings.borderColor || "Default"} onOpen={() => openSheet("borderColor")} />
            </motion.div>
          )}

          {/* ══ AI ══ */}
          {tab === "ai" && (
            <motion.div key="ai" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <SettingRow label="Personality" value={personalityLabel} onOpen={() => openSheet("personality")} />
              <SettingRow label="Voice" value={voiceName} onOpen={() => openSheet("voice")} />
              <SettingRow label="Language" value={langLabel} onOpen={() => openSheet("lang")} />
              <SettingRow label="Dialect" value={dialectLabel} onOpen={() => openSheet("dialect")} />
              <SettingRow label="ElevenLabs Key" value={settings.elevenLabsKey ? "••••••••" : "Not set"} onOpen={() => openSheet("elevenKey")} />
            </motion.div>
          )}

          {/* ══ CHAR ══ */}
          {tab === "char" && (
            <motion.div key="char" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <SettingRow label="Visibility" value={settings.charVisible ? "Shown" : "Hidden"} onOpen={() => openSheet("charVisible")} />
              <SettingRow label="Size" value={`${settings.charSize || 100}%`} onOpen={() => openSheet("charSize")} />
              <SettingRow label="Auto Animation" value={settings.charAutoAnim ? "On" : "Off"} onOpen={() => openSheet("charAnim")} />
              <SettingRow label="Accent Color" value={settings.charAccent || "#00eaff"} onOpen={() => openSheet("charColor")} />
            </motion.div>
          )}

          {/* ══ SECURITY ══ */}
          {tab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <SettingRow label="App Lock" value={settings.appLock || "PIN"} onOpen={() => openSheet("appLock")} />
              <SettingRow label="App PIN" value={settings.appPin ? "••••" : "Not set"} onOpen={() => openSheet("appPin")} />
              <SettingRow label="Vault Lock" value={settings.vaultLock || "Face ID"} onOpen={() => openSheet("vaultLock")} />
              <SettingRow label="Supreme Key" value={settings.supremeKey ? "••••••••" : "Not set"} onOpen={() => openSheet("supremeKey")} />
              <SettingRow label="Ad Tokens" value="Manage" onOpen={() => openSheet("adTokens")} />
              <SettingRow label="Notification Sound" value={settings.notifSound ? `On — ${settings.notifVolume || 70}%` : "Off"} onOpen={() => openSheet("notif")} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ════════════════ SHEETS ════════════════ */}

      {/* Background */}
      <Sheet open={sheet === "bg"} onClose={closeSheet} title="BACKGROUND">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {settings.bgImage && <div style={{ width: "100%", height: 100, borderRadius: 14, background: `url(${settings.bgImage}) center/cover`, marginBottom: 4 }} />}
          <button onClick={() => bgInputRef.current?.click()}
            style={{ padding: "13px 0", borderRadius: 14, background: "var(--ra-dim)", color: "var(--ra)", border: "1px solid var(--ra-border)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Upload Image
          </button>
          <button onClick={() => themeImgRef.current?.click()}
            style={{ padding: "13px 0", borderRadius: 14, background: "rgba(255,255,255,0.04)", color: "var(--rt)", border: "1px dashed var(--ra-border)", fontSize: 13, cursor: "pointer" }}>
            Extract Colors from Image
          </button>
          {settings.bgImage && (
            <button onClick={() => { update({ bgImage: null }); closeSheet(); }}
              style={{ padding: "13px 0", borderRadius: 14, background: "rgba(255,60,60,0.1)", color: "#ff6060", border: "1px solid rgba(255,60,60,0.2)", fontSize: 13, cursor: "pointer" }}>
              Remove Image
            </button>
          )}
          <input ref={bgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadBg} />
          <input ref={themeImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadThemeImg} />
        </div>
      </Sheet>

      {/* Theme */}
      <Sheet open={sheet === "theme"} onClose={closeSheet} title="THEME">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {Object.entries(THEMES).map(([key, t]) => (
            <button key={key} onClick={() => { update({ theme: key }); closeSheet(); }}
              style={{
                padding: "16px 0", borderRadius: 14, cursor: "pointer",
                background: settings.theme === key ? t.accent + "22" : "rgba(255,255,255,0.03)",
                border: `2px solid ${settings.theme === key ? t.accent : "rgba(255,255,255,0.06)"}`,
                color: settings.theme === key ? t.accent : "var(--rt-dim)", fontSize: 10, fontWeight: 700
              }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: t.accent, margin: "0 auto 6px" }} />
              {t.name}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Menu Style */}
      <Sheet open={sheet === "menu"} onClose={closeSheet} title="MENU STYLE">
        <OptionList items={MENU_STYLES} value={settings.menuStyle} getLabel={x => x.label} getValue={x => x.id}
          onChange={v => { update({ menuStyle: v }); closeSheet(); }} />
      </Sheet>

      {/* Font */}
      <Sheet open={sheet === "font"} onClose={closeSheet} title="FONT">
        <div style={{ marginBottom: 14, fontSize: 11, color: "var(--rt-dim)", letterSpacing: "0.1em" }}>ARABIC</div>
        <FontList items={FONTS_AR} value={settings.font} onChange={v => { update({ font: v }); closeSheet(); }} />
        <div style={{ margin: "16px 0 10px", fontSize: 11, color: "var(--rt-dim)", letterSpacing: "0.1em" }}>ENGLISH</div>
        <FontList items={FONTS_EN} value={settings.font} onChange={v => { update({ font: v }); closeSheet(); }} />
      </Sheet>

      {/* Font Color */}
      <Sheet open={sheet === "fontColor"} onClose={closeSheet} title="FONT COLOR">
        <ColorGrid value={settings.fontColor} onChange={v => { update({ fontColor: v }); closeSheet(); }} />
      </Sheet>

      {/* Font Size */}
      <Sheet open={sheet === "fontSize"} onClose={closeSheet} title="FONT SIZE">
        <OptionList items={["12px","13px","14px","15px","16px","17px","18px","20px"]} value={settings.fontSize}
          onChange={v => { update({ fontSize: v }); closeSheet(); }} />
      </Sheet>

      {/* Font Weight */}
      <Sheet open={sheet === "fontWeight"} onClose={closeSheet} title="FONT WEIGHT">
        <OptionList items={[{l:"Thin — 300",v:"300"},{l:"Regular — 400",v:"400"},{l:"Medium — 500",v:"500"},{l:"Bold — 700",v:"700"},{l:"Black — 900",v:"900"}]}
          value={settings.fontWeight} getLabel={x=>x.l} getValue={x=>x.v}
          onChange={v => { update({ fontWeight: v }); closeSheet(); }} />
      </Sheet>

      {/* Button Shape */}
      <Sheet open={sheet === "btnShape"} onClose={closeSheet} title="BUTTON SHAPE">
        <OptionList items={BTN_SHAPES} value={settings.btnShape} getLabel={x=>x.label} getValue={x=>x.id}
          onChange={v => { update({ btnShape: v }); closeSheet(); }} />
      </Sheet>

      {/* Button Color */}
      <Sheet open={sheet === "btnColor"} onClose={closeSheet} title="BUTTON COLOR">
        <ColorGrid value={settings.btnColor} onChange={v => { update({ btnColor: v }); closeSheet(); }} />
      </Sheet>

      {/* Border Size */}
      <Sheet open={sheet === "borderSize"} onClose={closeSheet} title="BORDER SIZE">
        <OptionList items={["0","1","2","3","4"]} value={settings.borderSize}
          onChange={v => { update({ borderSize: v }); closeSheet(); }} />
      </Sheet>

      {/* Border Color */}
      <Sheet open={sheet === "borderColor"} onClose={closeSheet} title="BORDER COLOR">
        <ColorGrid value={settings.borderColor} onChange={v => { update({ borderColor: v + "66" }); closeSheet(); }} />
      </Sheet>

      {/* AI Personality */}
      <Sheet open={sheet === "personality"} onClose={closeSheet} title="PERSONALITY">
        <OptionList items={AI_PERSONALITIES} value={settings.aiPersonality} getLabel={x=>x.name} getValue={x=>x.id}
          onChange={v => { update({ aiPersonality: v }); closeSheet(); }} />
      </Sheet>

      {/* Voice */}
      <Sheet open={sheet === "voice"} onClose={closeSheet} title="VOICE">
        {ELEVENLABS_VOICES.map(v => (
          <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--ra-border)" }}>
            <span style={{ fontSize: 14, color: settings.aiVoiceId === v.id ? "var(--ra)" : "var(--rt)", fontWeight: settings.aiVoiceId === v.id ? 700 : 400 }}>{v.name}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => previewElevenLabs(v.id)}
                style={{ padding: "5px 12px", borderRadius: 10, fontSize: 11, cursor: "pointer", background: previewVoice === v.id ? "var(--ra-dim)" : "rgba(255,255,255,0.04)", color: previewVoice === v.id ? "var(--ra)" : "var(--rt-dim)", border: "1px solid var(--ra-border)" }}>
                {previewVoice === v.id ? "▶" : "Preview"}
              </button>
              <button onClick={() => { update({ aiVoiceId: v.id }); closeSheet(); }}
                style={{ padding: "5px 14px", borderRadius: 10, fontSize: 11, cursor: "pointer", background: settings.aiVoiceId === v.id ? "var(--ra)" : "var(--ra-dim)", color: settings.aiVoiceId === v.id ? "#000b10" : "var(--ra)", border: `1px solid var(--ra-border)` }}>
                {settings.aiVoiceId === v.id ? "✓" : "Apply"}
              </button>
            </div>
          </div>
        ))}
      </Sheet>

      {/* Language */}
      <Sheet open={sheet === "lang"} onClose={closeSheet} title="LANGUAGE">
        <OptionList items={LANG_OPTIONS} value={settings.aiLang} getLabel={x=>x.label} getValue={x=>x.id}
          onChange={v => { update({ aiLang: v }); closeSheet(); }} />
      </Sheet>

      {/* Dialect */}
      <Sheet open={sheet === "dialect"} onClose={closeSheet} title="DIALECT">
        {AI_DIALECTS.map(group => (
          <div key={group.group} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "var(--rt-dim)", letterSpacing: "0.1em", marginBottom: 6 }}>{group.group}</div>
            <OptionList items={group.items} value={settings.aiDialect}
              onChange={v => { update({ aiDialect: v }); closeSheet(); }} />
          </div>
        ))}
      </Sheet>

      {/* ElevenLabs Key */}
      <Sheet open={sheet === "elevenKey"} onClose={closeSheet} title="ELEVENLABS API KEY">
        <input type="password" value={settings.elevenLabsKey || ""} onChange={e => update({ elevenLabsKey: e.target.value })}
          placeholder="sk-..."
          style={{ width: "100%", padding: "13px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 14, outline: "none" }} />
        <button onClick={closeSheet} style={{ marginTop: 12, width: "100%", padding: "13px 0", borderRadius: 12, background: "var(--ra)", color: "#000b10", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Save</button>
      </Sheet>

      {/* Char Visible */}
      <Sheet open={sheet === "charVisible"} onClose={closeSheet} title="CHARACTER VISIBILITY">
        <OptionList items={[{l:"Show",v:true},{l:"Hide",v:false}]} value={settings.charVisible} getLabel={x=>x.l} getValue={x=>x.v}
          onChange={v => { update({ charVisible: v }); closeSheet(); }} />
      </Sheet>

      {/* Char Size */}
      <Sheet open={sheet === "charSize"} onClose={closeSheet} title="CHARACTER SIZE">
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ra)", textAlign: "center", margin: "8px 0 16px", fontFamily: "'IBM Plex Mono',monospace" }}>
          {settings.charSize || 100}%
        </div>
        <input type="range" min={40} max={200} value={settings.charSize || 100} onChange={e => update({ charSize: +e.target.value })}
          style={{ width: "100%", accentColor: "var(--ra)" }} />
      </Sheet>

      {/* Char Anim */}
      <Sheet open={sheet === "charAnim"} onClose={closeSheet} title="AUTO ANIMATION">
        <OptionList items={[{l:"On",v:true},{l:"Off",v:false}]} value={settings.charAutoAnim} getLabel={x=>x.l} getValue={x=>x.v}
          onChange={v => { update({ charAutoAnim: v }); closeSheet(); }} />
      </Sheet>

      {/* Char Color */}
      <Sheet open={sheet === "charColor"} onClose={closeSheet} title="CHARACTER ACCENT">
        <ColorGrid value={settings.charAccent} onChange={v => { update({ charAccent: v }); closeSheet(); }} />
      </Sheet>

      {/* App Lock */}
      <Sheet open={sheet === "appLock"} onClose={closeSheet} title="APP LOCK TYPE">
        <OptionList items={[{l:"PIN",v:"pin"},{l:"Pattern",v:"pattern"},{l:"Voice",v:"voice"}]} value={settings.appLock} getLabel={x=>x.l} getValue={x=>x.v}
          onChange={v => { update({ appLock: v }); closeSheet(); }} />
      </Sheet>

      {/* App PIN */}
      <Sheet open={sheet === "appPin"} onClose={closeSheet} title="APP PIN">
        <input type="password" maxLength={8} value={settings.appPin || ""} onChange={e => update({ appPin: e.target.value })}
          placeholder="Enter PIN"
          style={{ width: "100%", padding: "13px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid var(--ra-border)", color: "var(--ra)", fontSize: 28, letterSpacing: "0.5em", outline: "none", textAlign: "center" }} />
        <button onClick={closeSheet} style={{ marginTop: 12, width: "100%", padding: "13px 0", borderRadius: 12, background: "var(--ra)", color: "#000b10", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Save</button>
      </Sheet>

      {/* Vault Lock */}
      <Sheet open={sheet === "vaultLock"} onClose={closeSheet} title="VAULT LOCK">
        <OptionList items={[{l:"Face ID",v:"face"},{l:"PIN",v:"pin"}]} value={settings.vaultLock || "face"} getLabel={x=>x.l} getValue={x=>x.v}
          onChange={v => { update({ vaultLock: v }); closeSheet(); }} />
      </Sheet>

      {/* Supreme Key */}
      <Sheet open={sheet === "supremeKey"} onClose={closeSheet} title="SUPREME ACCESS KEY">
        <input type="password" value={settings.supremeKey || ""} onChange={e => update({ supremeKey: e.target.value })}
          placeholder="Supreme Key"
          style={{ width: "100%", padding: "13px 16px", borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 14, outline: "none" }} />
        <button onClick={closeSheet} style={{ marginTop: 12, width: "100%", padding: "13px 0", borderRadius: 12, background: "var(--ra)", color: "#000b10", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Save</button>
      </Sheet>

      {/* Ad Tokens */}
      <Sheet open={sheet === "adTokens"} onClose={closeSheet} title="AD TOKENS">
        {[{l:"Meta",k:"metaToken"},{l:"Google Ads",k:"googleAdsToken"},{l:"YouTube",k:"youtubeToken"},{l:"Snapchat",k:"snapToken"},{l:"TikTok",k:"tiktokToken"}].map(t => (
          <div key={t.k} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--rt-dim)", marginBottom: 4, letterSpacing: "0.08em" }}>{t.l}</div>
            <input type="password" value={settings[t.k] || ""} onChange={e => update({ [t.k]: e.target.value })}
              placeholder={`${t.l} Token`}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 13, outline: "none" }} />
          </div>
        ))}
        <button onClick={closeSheet} style={{ marginTop: 8, width: "100%", padding: "13px 0", borderRadius: 12, background: "var(--ra)", color: "#000b10", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Save</button>
      </Sheet>

      {/* Notification */}
      <Sheet open={sheet === "notif"} onClose={closeSheet} title="NOTIFICATION SOUND">
        <OptionList items={[{l:"On",v:true},{l:"Off",v:false}]} value={settings.notifSound} getLabel={x=>x.l} getValue={x=>x.v}
          onChange={v => update({ notifSound: v })} />
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "var(--rt-dim)" }}>Volume</span>
          <input type="range" min={0} max={100} value={settings.notifVolume || 70} onChange={e => update({ notifVolume: +e.target.value })}
            style={{ flex: 1, accentColor: "var(--ra)" }} />
          <span style={{ fontSize: 12, color: "var(--ra)", minWidth: 36, fontFamily: "'IBM Plex Mono',monospace" }}>{settings.notifVolume || 70}%</span>
        </div>
      </Sheet>
    </div>
  );
}