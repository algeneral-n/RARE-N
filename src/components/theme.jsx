// RARE 4N - Global Design System

export const ICON_URL = "https://media.base44.com/images/public/69b6e8a7a264ea4af0f95823/6c80e7ccb_icon.png";
export const GLB_URL = "https://raw.githubusercontent.com/algeneral-n/RARE-N/main/rare%2Bhumanoid%2B3d%2Bmodel%20(1).glb";

export const THEMES = {
  cyberpunk: { bg: "#000b10", card: "rgba(0,20,32,0.85)", accent: "#00eaff", accentDim: "rgba(0,234,255,0.12)", accentBorder: "rgba(0,234,255,0.22)", text: "#e2f5ff", textDim: "rgba(226,245,255,0.4)", name: "Cyberpunk" },
  gold: { bg: "#08060a", card: "rgba(20,15,5,0.9)", accent: "#f5c842", accentDim: "rgba(245,200,66,0.12)", accentBorder: "rgba(245,200,66,0.22)", text: "#fff8e1", textDim: "rgba(255,248,225,0.4)", name: "Black Gold" },
  glass: { bg: "rgba(10,10,20,0.98)", card: "rgba(255,255,255,0.05)", accent: "#a78bfa", accentDim: "rgba(167,139,250,0.12)", accentBorder: "rgba(167,139,250,0.22)", text: "#f0ecff", textDim: "rgba(240,236,255,0.4)", name: "Glass" },
  neon: { bg: "#000000", card: "rgba(5,0,5,0.95)", accent: "#ff00ff", accentDim: "rgba(255,0,255,0.1)", accentBorder: "rgba(255,0,255,0.22)", text: "#ffe0ff", textDim: "rgba(255,224,255,0.4)", name: "Neon" },
  midnight: { bg: "#04060f", card: "rgba(10,14,30,0.9)", accent: "#3b82f6", accentDim: "rgba(59,130,246,0.12)", accentBorder: "rgba(59,130,246,0.22)", text: "#dbeafe", textDim: "rgba(219,234,254,0.4)", name: "Midnight" },
  apple: { bg: "#f5f5f7", card: "rgba(255,255,255,0.9)", accent: "#0071e3", accentDim: "rgba(0,113,227,0.1)", accentBorder: "rgba(0,113,227,0.2)", text: "#1d1d1f", textDim: "rgba(29,29,31,0.45)", name: "Apple" },
};

export const FONTS_AR = [
  { name: "Cairo", value: "'Cairo', sans-serif" },
  { name: "Tajawal", value: "'Tajawal', sans-serif" },
  { name: "Noto Arabic", value: "'Noto Sans Arabic', sans-serif" },
  { name: "Amiri", value: "'Amiri', serif" },
  { name: "Scheherazade", value: "'Scheherazade New', serif" },
];

export const FONTS_EN = [
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { name: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
  { name: "Orbitron", value: "'Orbitron', sans-serif" },
  { name: "Rajdhani", value: "'Rajdhani', sans-serif" },
  { name: "Exo 2", value: "'Exo 2', sans-serif" },
];

export const ELEVENLABS_VOICES = [
  { id: "6ZVgc4q9LWAloWbuwjuu", name: "Zara" },
  { id: "4wf10lgibMnboGJGCLrP", name: "Layla" },
  { id: "IES4nrmZdUBHByLBde0P", name: "Khalid" },
  { id: "LjKPkQHpXCsWoy7Pjq4U", name: "Omar" },
  { id: "WkVhWA2EqSfUAWAZG7La", name: "Nour" },
];

export const AI_DIALECTS = [
  { group: "عربي", items: ["مصري", "خليجي", "شامي", "عراقي", "جزائري", "تونسي", "مغربي", "سوداني"] },
  { group: "English", items: ["American", "British", "Canadian", "Irish", "Liverpool"] },
  { group: "Hindi", items: ["Hindi", "Kerala", "Tamil", "Mumbai", "Goa"] },
  { group: "Urdu", items: ["Urdu", "Pashto"] },
];

export const AI_PERSONALITIES = [
  { id: "assistant", name: "Assistant" },
  { id: "analyst", name: "Analyst" },
  { id: "guardian", name: "Guardian" },
  { id: "engineer", name: "Engineer" },
  { id: "creative", name: "Creative" },
  { id: "strategist", name: "Strategist" },
];

export const BTN_SHAPES = [
  { id: "rounded", label: "Rounded", radius: "12px" },
  { id: "sharp", label: "Sharp", radius: "4px" },
  { id: "pill", label: "Pill", radius: "999px" },
];

export const MENU_STYLES = [
  { id: "app-library", label: "App Library" },
  { id: "sidebar", label: "Sidebar" },
  { id: "google", label: "Google Style" },
  { id: "circle", label: "Circle Menu" },
  { id: "microsoft", label: "Microsoft" },
];

export const DEFAULT_SETTINGS = {
  theme: "cyberpunk",
  font: "'Cairo', sans-serif",
  fontWeight: "400",
  fontSize: "15px",
  fontColor: "#e2f5ff",
  bg: "#000b10",
  bgImage: null,
  btnShape: "rounded",
  btnColor: "#00eaff",
  borderSize: "1",
  borderColor: "rgba(0,234,255,0.3)",
  menuStyle: "app-library",
  aiPersonality: "assistant",
  aiVoiceId: "6ZVgc4q9LWAloWbuwjuu",
  aiLang: "ar",
  aiDialect: "خليجي",
  voiceMode: "smart",
  voiceVolume: 80,
  charVisible: true,
  charSize: 100,
  charAutoAnim: true,
  appLock: "pin",
  appPin: "6263",
  notifSound: true,
  notifVolume: 70,
};