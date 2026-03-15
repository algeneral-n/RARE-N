import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import GlobalHeader from "./GlobalHeader";

export default function AppLayout() {
  const [characterVisible, setCharacterVisible] = useState(true);
  const [characterSize, setCharacterSize] = useState(100);
  const [autoAnim, setAutoAnim] = useState(true);
  const [voiceMode, setVoiceMode] = useState("smart");
  const [theme, setTheme] = useState("cyberpunk");

  useEffect(() => {
    const themes = ["cyberpunk", "neumorphism", "glass", "neon", "black-gold", "apple"];
    themes.forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[#000b10] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-black to-black" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#00eaff 1px, transparent 1px), linear-gradient(90deg, #00eaff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <GlobalHeader
        characterVisible={characterVisible}
        onCharacterToggle={() => setCharacterVisible(v => !v)}
        onCharacterSizeChange={setCharacterSize}
        characterSize={characterSize}
        autoAnim={autoAnim}
        onAutoAnimToggle={() => setAutoAnim(v => !v)}
        voiceMode={voiceMode}
        onVoiceMode={setVoiceMode}
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      {/* Page content */}
      <div className="relative z-10 pt-16">
        <Outlet />
      </div>
    </div>
  );
}