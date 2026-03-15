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

// Color palette (Apple-style)
const PALETTE = [
  "#00eaff","#3b82f6","#a78bfa","#f472b6","#f5c842","#10b981",
  "#ef4444","#ff7700","#ffffff","#94a3b8","#1d1d1f","#000000",
];

const LANG_OPTIONS = [
  { id: "ar", label: "العربية" },
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
  { id: "ur", label: "اردو" },
  { id: "es", label: "Español" },
];

// ── Small helper components ──
const SectionBox = ({ children, style = {} }) => (
  <div style={{ borderRadius: 18, border: "1px solid var(--ra-border)", background: "var(--rc)", padding: "14px 16px", marginBottom: 12, ...style }}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "var(--rt-dim)", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>
    {children}
  </div>
);

const ChipRow = ({ items, value, onSelect, getLabel = x => x, getValue = x => x }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map(item => {
      const v = getValue(item); const l = getLabel(item);
      const active = value === v;
      return (
        <button key={v} onClick={() => onSelect(v)}
          style={{
            padding: "7px 14px", borderRadius: "var(--rbtn-r, 12px)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: active ? "var(--ra)" : "var(--ra-dim)",
            color: active ? "#000b10" : "var(--ra)",
            border: `1px solid ${active ? "var(--ra)" : "var(--ra-border)"}`,
            transition: "all 0.15s"
          }}>
          {l}
        </button>
      );
    })}
  </div>
);

export default function Settings() {
  const { settings, update, theme } = useAppSettings();
  const [tab, setTab] = useState("ui");
  const [previewVoice, setPreviewVoice] = useState(null);
  const bgInputRef = useRef(null);
  const themeImgRef = useRef(null);

  const uploadBg = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    update({ bgImage: url });
  };

  const uploadThemeImg = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file: f });
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Extract the dominant color and 2-3 accent colors from this image as hex codes for a dark mobile UI theme.`,
      file_urls: [file_url],
      response_json_schema: { type: "object", properties: { accent: { type: "string" }, bg: { type: "string" } } }
    });
    if (res?.accent) update({ btnColor: res.accent, borderColor: res.accent + "55" });
  };

  const previewElevenLabs = async (voiceId) => {
    setPreviewVoice(voiceId);
    try {
      const key = settings.elevenLabsKey || "";
      if (!key) { setPreviewVoice(null); return; }
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ text: "مرحبا، أنا مساعدك الذكي", voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
      });
      const blob = await r.blob();
      new Audio(URL.createObjectURL(blob)).play();
    } catch {}
    setTimeout(() => setPreviewVoice(null), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 8, padding: "12px 14px 0", position: "sticky", top: 64, zIndex: 30, background: "var(--rb)", backdropFilter: "blur(20px)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer",
              background: tab === t.id ? "var(--ra)" : "var(--ra-dim)",
              color: tab === t.id ? "#000b10" : "var(--ra)",
              border: `1px solid ${tab === t.id ? "var(--ra)" : "var(--ra-border)"}`,
              transition: "all 0.15s"
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        <AnimatePresence mode="wait">

          {/* ══════════ UI TAB ══════════ */}
          {tab === "ui" && (
            <motion.div key="ui" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* Background */}
              <SectionBox>
                <Label>Background</Label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, border: "1px solid var(--ra-border)", overflow: "hidden", flexShrink: 0,
                    background: settings.bgImage ? `url(${settings.bgImage}) center/cover` : theme.bg }} />
                  <button onClick={() => bgInputRef.current?.click()}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 12, background: "var(--ra-dim)", color: "var(--ra)", border: "1px solid var(--ra-border)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Upload Image
                  </button>
                  {settings.bgImage && (
                    <button onClick={() => update({ bgImage: null })}
                      style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(255,60,60,0.1)", color: "#ff6060", border: "1px solid rgba(255,60,60,0.2)", fontSize: 12, cursor: "pointer" }}>
                      Clear
                    </button>
                  )}
                  <input ref={bgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadBg} />
                </div>
              </SectionBox>

              {/* Theme */}
              <SectionBox>
                <Label>Theme</Label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button key={key} onClick={() => update({ theme: key })}
                      style={{
                        padding: "12px 0", borderRadius: 14, fontSize: 10, fontWeight: 700, cursor: "pointer",
                        background: settings.theme === key ? t.accent + "22" : "rgba(255,255,255,0.03)",
                        color: settings.theme === key ? t.accent : "var(--rt-dim)",
                        border: `2px solid ${settings.theme === key ? t.accent : "rgba(255,255,255,0.06)"}`,
                        letterSpacing: "0.08em"
                      }}>
                      <div style={{ width: 18, height: 18, borderRadius: 6, background: t.accent, margin: "0 auto 6px" }} />
                      {t.name}
                    </button>
                  ))}
                </div>
                <button onClick={() => themeImgRef.current?.click()}
                  style={{ width: "100%", padding: "10px 0", borderRadius: 12, background: "var(--ra-dim)", color: "var(--ra)", border: "1px dashed var(--ra-border)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Extract Colors from Image
                </button>
                <input ref={themeImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadThemeImg} />
              </SectionBox>

              {/* Menu Style */}
              <SectionBox>
                <Label>Menu Style</Label>
                <ChipRow items={MENU_STYLES} value={settings.menuStyle} onSelect={v => update({ menuStyle: v })} getLabel={x => x.label} getValue={x => x.id} />
              </SectionBox>

              {/* Typography */}
              <SectionBox>
                <Label>Font — Arabic</Label>
                <ChipRow items={FONTS_AR} value={settings.font} onSelect={v => update({ font: v })} getLabel={x => x.name} getValue={x => x.value} />
                <div style={{ marginTop: 12 }}><Label>Font — English</Label>
                  <ChipRow items={FONTS_EN} value={settings.font} onSelect={v => update({ font: v })} getLabel={x => x.name} getValue={x => x.value} />
                </div>
                <div style={{ marginTop: 12 }}><Label>Font Color</Label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PALETTE.map(c => (
                      <button key={c} onClick={() => update({ fontColor: c })}
                        style={{ width: 32, height: 32, borderRadius: 8, background: c, border: `2px solid ${settings.fontColor === c ? "white" : "transparent"}`, cursor: "pointer" }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}><Label>Size</Label>
                  {["13px","15px","17px","20px"].map(s => (
                    <button key={s} onClick={() => update({ fontSize: s })}
                      style={{ padding: "6px 12px", borderRadius: 10, fontSize: 12, cursor: "pointer", background: settings.fontSize === s ? "var(--ra)" : "var(--ra-dim)", color: settings.fontSize === s ? "#000b10" : "var(--ra)", border: `1px solid ${settings.fontSize === s ? "var(--ra)" : "var(--ra-border)"}` }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}><Label>Weight</Label>
                  <ChipRow items={[{l:"Thin",v:"300"},{l:"Regular",v:"400"},{l:"Bold",v:"700"},{l:"Black",v:"900"},{l:"Italic",v:"italic"}]} value={settings.fontWeight} onSelect={v => update({ fontWeight: v })} getLabel={x=>x.l} getValue={x=>x.v} />
                </div>
              </SectionBox>

              {/* Buttons */}
              <SectionBox>
                <Label>Button Shape</Label>
                <ChipRow items={BTN_SHAPES} value={settings.btnShape} onSelect={v => update({ btnShape: v })} getLabel={x=>x.label} getValue={x=>x.id} />
                <div style={{ marginTop: 12 }}><Label>Button Color</Label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PALETTE.map(c => (
                      <button key={c} onClick={() => update({ btnColor: c })}
                        style={{ width: 32, height: 32, borderRadius: 8, background: c, border: `2px solid ${settings.btnColor === c ? "white" : "transparent"}`, cursor: "pointer" }} />
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Label>Border Size</Label>
                    <ChipRow items={["0","1","2","3"]} value={settings.borderSize} onSelect={v => update({ borderSize: v })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>Border Color</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {PALETTE.slice(0, 6).map(c => (
                        <button key={c} onClick={() => update({ borderColor: c + "66" })}
                          style={{ width: 26, height: 26, borderRadius: 6, background: c, border: `2px solid ${settings.borderColor?.startsWith(c) ? "white" : "transparent"}`, cursor: "pointer" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </SectionBox>
            </motion.div>
          )}

          {/* ══════════ AI TAB ══════════ */}
          {tab === "ai" && (
            <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              <SectionBox>
                <Label>Personality</Label>
                <ChipRow items={AI_PERSONALITIES} value={settings.aiPersonality} onSelect={v => update({ aiPersonality: v })} getLabel={x=>x.name} getValue={x=>x.id} />
              </SectionBox>

              <SectionBox>
                <Label>Voice</Label>
                {ELEVENLABS_VOICES.map(v => (
                  <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--ra-border)" }}>
                    <span style={{ fontSize: 14, color: settings.aiVoiceId === v.id ? "var(--ra)" : "var(--rt)" }}>{v.name}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => previewElevenLabs(v.id)}
                        style={{ padding: "5px 12px", borderRadius: 10, fontSize: 11, cursor: "pointer",
                          background: previewVoice === v.id ? "var(--ra-dim)" : "rgba(255,255,255,0.04)",
                          color: previewVoice === v.id ? "var(--ra)" : "var(--rt-dim)",
                          border: "1px solid var(--ra-border)" }}>
                        {previewVoice === v.id ? "▶ Playing" : "Preview"}
                      </button>
                      <button onClick={() => update({ aiVoiceId: v.id })}
                        style={{ padding: "5px 14px", borderRadius: 10, fontSize: 11, cursor: "pointer",
                          background: settings.aiVoiceId === v.id ? "var(--ra)" : "var(--ra-dim)",
                          color: settings.aiVoiceId === v.id ? "#000b10" : "var(--ra)",
                          border: `1px solid ${settings.aiVoiceId === v.id ? "var(--ra)" : "var(--ra-border)"}` }}>
                        {settings.aiVoiceId === v.id ? "Active" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 12 }}>
                  <Label>ElevenLabs API Key</Label>
                  <input type="password" value={settings.elevenLabsKey || ""} onChange={e => update({ elevenLabsKey: e.target.value })}
                    placeholder="sk-..."
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 13, outline: "none" }} />
                </div>
              </SectionBox>

              <SectionBox>
                <Label>Language</Label>
                <ChipRow items={LANG_OPTIONS} value={settings.aiLang} onSelect={v => update({ aiLang: v })} getLabel={x=>x.label} getValue={x=>x.id} />
              </SectionBox>

              <SectionBox>
                <Label>Dialect</Label>
                {AI_DIALECTS.map(group => (
                  <div key={group.group} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--rt-dim)", marginBottom: 6, letterSpacing: "0.1em" }}>{group.group}</div>
                    <ChipRow items={group.items} value={settings.aiDialect} onSelect={v => update({ aiDialect: v })} />
                  </div>
                ))}
              </SectionBox>
            </motion.div>
          )}

          {/* ══════════ CHARACTER TAB ══════════ */}
          {tab === "char" && (
            <motion.div key="char" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SectionBox>
                <Label>Visibility</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{l:"Show",v:true},{l:"Hide",v:false}].map(o => (
                    <button key={String(o.v)} onClick={() => update({ charVisible: o.v })}
                      style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        background: settings.charVisible === o.v ? "var(--ra)" : "var(--ra-dim)",
                        color: settings.charVisible === o.v ? "#000b10" : "var(--ra)",
                        border: `1px solid ${settings.charVisible === o.v ? "var(--ra)" : "var(--ra-border)"}` }}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </SectionBox>
              <SectionBox>
                <Label>Size — {settings.charSize}%</Label>
                <input type="range" min={40} max={200} value={settings.charSize} onChange={e => update({ charSize: +e.target.value })}
                  style={{ width: "100%", accentColor: "var(--ra)" }} />
              </SectionBox>
              <SectionBox>
                <Label>Auto Animation</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{l:"On",v:true},{l:"Off",v:false}].map(o => (
                    <button key={String(o.v)} onClick={() => update({ charAutoAnim: o.v })}
                      style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        background: settings.charAutoAnim === o.v ? "var(--ra)" : "var(--ra-dim)",
                        color: settings.charAutoAnim === o.v ? "#000b10" : "var(--ra)",
                        border: `1px solid ${settings.charAutoAnim === o.v ? "var(--ra)" : "var(--ra-border)"}` }}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </SectionBox>
              <SectionBox>
                <Label>Accent Color</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PALETTE.map(c => (
                    <button key={c} onClick={() => update({ charAccent: c })}
                      style={{ width: 34, height: 34, borderRadius: 8, background: c, border: `2px solid ${(settings.charAccent||"#00eaff") === c ? "white" : "transparent"}`, cursor: "pointer" }} />
                  ))}
                </div>
              </SectionBox>
            </motion.div>
          )}

          {/* ══════════ SECURITY TAB ══════════ */}
          {tab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              <SectionBox>
                <Label>Ad Tokens</Label>
                {[{l:"Meta",k:"metaToken"},{l:"Google Ads",k:"googleAdsToken"},{l:"YouTube",k:"youtubeToken"},{l:"Snapchat",k:"snapToken"},{l:"TikTok",k:"tiktokToken"}].map(t => (
                  <div key={t.k} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--rt-dim)", marginBottom: 4 }}>{t.l}</div>
                    <input type="password" value={settings[t.k] || ""} onChange={e => update({ [t.k]: e.target.value })}
                      placeholder={`${t.l} Token`}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 13, outline: "none" }} />
                  </div>
                ))}
              </SectionBox>

              <SectionBox>
                <Label>Supreme Access</Label>
                <input type="password" value={settings.supremeKey || ""} onChange={e => update({ supremeKey: e.target.value })}
                  placeholder="Supreme Access Key"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 13, outline: "none" }} />
              </SectionBox>

              <SectionBox>
                <Label>App Lock Type</Label>
                <ChipRow items={[{l:"PIN",v:"pin"},{l:"Pattern",v:"pattern"},{l:"Voice",v:"voice"}]} value={settings.appLock} onSelect={v => update({ appLock: v })} getLabel={x=>x.l} getValue={x=>x.v} />
                {settings.appLock === "pin" && (
                  <div style={{ marginTop: 12 }}>
                    <Label>PIN Code</Label>
                    <input type="password" maxLength={8} value={settings.appPin || ""} onChange={e => update({ appPin: e.target.value })}
                      placeholder="New PIN"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid var(--ra-border)", color: "var(--rt)", fontSize: 20, letterSpacing: "0.3em", outline: "none" }} />
                  </div>
                )}
              </SectionBox>

              <SectionBox>
                <Label>Vault Lock</Label>
                <ChipRow items={[{l:"Face ID",v:"face"},{l:"PIN",v:"pin"}]} value={settings.vaultLock || "face"} onSelect={v => update({ vaultLock: v })} getLabel={x=>x.l} getValue={x=>x.v} />
              </SectionBox>

              <SectionBox>
                <Label>Entry Notification Sound</Label>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {[{l:"On",v:true},{l:"Off",v:false}].map(o => (
                    <button key={String(o.v)} onClick={() => update({ notifSound: o.v })}
                      style={{ flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        background: settings.notifSound === o.v ? "var(--ra)" : "var(--ra-dim)",
                        color: settings.notifSound === o.v ? "#000b10" : "var(--ra)",
                        border: `1px solid ${settings.notifSound === o.v ? "var(--ra)" : "var(--ra-border)"}` }}>
                      {o.l}
                    </button>
                  ))}
                </div>
                <input type="range" min={0} max={100} value={settings.notifVolume || 70}
                  onChange={e => update({ notifVolume: +e.target.value })}
                  style={{ width: "100%", accentColor: "var(--ra)" }} />
              </SectionBox>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}