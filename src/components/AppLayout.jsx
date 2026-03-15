import { Outlet } from "react-router-dom";
import GlobalHeader from "./GlobalHeader";
import { AppSettingsProvider, useAppSettings } from "./AppSettingsContext";

function LayoutInner() {
  const { theme, settings } = useAppSettings();

  return (
    <div style={{ minHeight: "100vh", background: settings.bgImage ? `url(${settings.bgImage}) center/cover no-repeat fixed` : theme.bg, color: theme.text, position: "relative", overflowX: "hidden" }}>
      {/* Grid overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${theme.accent}08 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}08 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse at 50% 100%, ${theme.accentDim} 0%, transparent 65%)` }} />

      <GlobalHeader />

      <div style={{ position: "relative", zIndex: 10, paddingTop: 64 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <AppSettingsProvider>
      <LayoutInner />
    </AppSettingsProvider>
  );
}