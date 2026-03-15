import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import GlobalHeader from "./GlobalHeader";
import RareCharacter3D from "./RareCharacter3D";

export default function AppLayout() {
  const [characterVisible, setCharacterVisible] = useState(true);
  const [characterSize, setCharacterSize] = useState(100);
  const [theme, setTheme] = useState("cyberpunk");

  useEffect(() => {
    const themes = ["cyberpunk","neumorphism","glass","neon","black-gold","apple"];
    themes.forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-black to-black" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <GlobalHeader
        characterVisible={characterVisible}
        onCharacterToggle={() => setCharacterVisible(!characterVisible)}
        onCharacterSizeChange={setCharacterSize}
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      {/* Character 3D - fixed bottom center */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30">
        <RareCharacter3D visible={characterVisible} size={characterSize} />
      </div>

      {/* Page content */}
      <div className="relative z-10 pt-20">
        <Outlet />
      </div>
    </div>
  );
}