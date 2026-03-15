import { createContext, useContext, useState, useEffect } from "react";
import { THEMES, DEFAULT_SETTINGS } from "./theme";

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("rare4n_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch { return { ...DEFAULT_SETTINGS }; }
  });

  const theme = THEMES[settings.theme] || THEMES.cyberpunk;

  useEffect(() => {
    try { localStorage.setItem("rare4n_settings", JSON.stringify(settings)); } catch {}
    const t = THEMES[settings.theme] || THEMES.cyberpunk;
    const root = document.documentElement;
    root.style.setProperty("--ra", t.accent);
    root.style.setProperty("--ra-dim", t.accentDim);
    root.style.setProperty("--ra-border", t.accentBorder);
    root.style.setProperty("--rt", t.text);
    root.style.setProperty("--rt-dim", t.textDim);
    root.style.setProperty("--rc", t.card);
    root.style.setProperty("--rb", settings.bgImage ? `url(${settings.bgImage}) center/cover` : t.bg);
    root.style.setProperty("--rf", settings.font || "'Cairo',sans-serif");
    root.style.setProperty("--rfs", settings.fontSize || "15px");
    root.style.setProperty("--rfw", settings.fontWeight || "400");
    root.style.setProperty("--rfc", settings.fontColor || t.text);
    root.style.setProperty("--rbtn-r", settings.btnShape === "pill" ? "999px" : settings.btnShape === "sharp" ? "4px" : "12px");
    root.style.setProperty("--rbtn-c", settings.btnColor || t.accent);
    root.style.setProperty("--rborder-s", (settings.borderSize || "1") + "px");
    root.style.setProperty("--rborder-c", settings.borderColor || t.accentBorder);
    document.body.style.background = settings.bgImage ? `url(${settings.bgImage}) center/cover no-repeat fixed` : t.bg;
    document.body.style.color = settings.fontColor || t.text;
    document.body.style.fontFamily = settings.font || "'Cairo',sans-serif";
  }, [settings]);

  const update = (patch) => setSettings(prev => ({ ...prev, ...patch }));

  return (
    <AppSettingsContext.Provider value={{ settings, update, theme }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export const useAppSettings = () => useContext(AppSettingsContext);