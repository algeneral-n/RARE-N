import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TABS = ["GOOGLE MAPS", "APPLE MAPS", "SURVEILLANCE"];

const RADAR_CAMERAS = [
  { id: 1, lat: 24.7136, lng: 46.6753, type: "radar", label: "Speed Radar - King Fahd Road" },
  { id: 2, lat: 24.6877, lng: 46.7219, type: "camera", label: "Traffic Camera - Airport Road" },
  { id: 3, lat: 24.7535, lng: 46.6290, type: "radar", label: "Speed Radar - Western Ring" },
];

export default function RareMap() {
  const [tab, setTab] = useState("GOOGLE MAPS");

  return (
    <div className="min-h-screen pb-56 flex flex-col">
      {/* Tabs */}
      <div className="flex overflow-x-auto px-4 gap-2 py-3 border-b border-slate-800/50">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
              ${tab === t ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        {tab === "GOOGLE MAPS" && (
          <iframe
            src="https://maps.google.com/maps?q=Riyadh&output=embed"
            className="w-full h-[calc(100vh-220px)]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        )}

        {tab === "APPLE MAPS" && (
          <div className="h-[calc(100vh-220px)] flex items-center justify-center bg-slate-900/50">
            <div className="text-center px-8">
              <div className="text-4xl mb-4 text-slate-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 mx-auto opacity-30">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="text-slate-400 text-sm">Apple Maps is available on iOS devices</div>
              <a href="maps://" className="mt-4 inline-block px-6 py-2 rounded-xl border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/10 transition-all">
                Open in Maps App
              </a>
            </div>
          </div>
        )}

        {tab === "SURVEILLANCE" && (
          <div className="h-[calc(100vh-220px)] relative">
            <MapContainer center={[24.7136, 46.6753]} zoom={12} className="w-full h-full"
              style={{ background: "#0a0a0f" }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {RADAR_CAMERAS.map(item => (
                <Marker key={item.id} position={[item.lat, item.lng]}>
                  <Popup>
                    <div className="text-xs">
                      <div className="font-bold">{item.type === "radar" ? "Speed Radar" : "Traffic Camera"}</div>
                      <div>{item.label}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-cyan-500/20 bg-black/80 backdrop-blur p-3">
              <div className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">Legend</div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500" /> Speed Radar
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-3 h-3 rounded-full bg-amber-500" /> Traffic Camera
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}