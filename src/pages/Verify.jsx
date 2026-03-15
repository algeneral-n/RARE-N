import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RareCharacter from "../components/RareCharacter";

export default function Verify() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (pin.length < 4) { setError("Enter your access PIN"); return; }
    navigate("/Home");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-between relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-black to-black" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      {/* Top logo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-16 text-center">
        <div className="text-4xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          RARE
        </div>
        <div className="text-xs text-slate-500 tracking-[0.4em] uppercase mt-1">Supreme Access</div>
      </motion.div>

      {/* Character */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="relative z-10 flex-1 flex items-center">
        <RareCharacter visible={true} size={110} animation="idle" />
      </motion.div>

      {/* Verify panel */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="relative z-10 w-full px-8 pb-12">
        <div className="rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl p-6">
          <div className="text-center mb-5">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Identity Verification</div>
            <div className="text-sm text-slate-300">Enter your access PIN to continue</div>
          </div>

          {/* PIN dots */}
          <div className="flex justify-center gap-3 mb-5">
            {[0,1,2,3,4,5].map((i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300
                ${i < pin.length ? "bg-cyan-400 shadow-lg shadow-cyan-400/50" : "bg-slate-700 border border-slate-600"}`} />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1,2,3,4,5,6,7,8,9,"",0,"DEL"].map((k) => (
              <button key={k} onClick={() => {
                if (k === "DEL") setPin(p => p.slice(0,-1));
                else if (k !== "" && pin.length < 6) setPin(p => p + k);
              }}
                className={`h-12 rounded-xl text-lg font-semibold transition-all duration-200
                  ${k === "" ? "opacity-0 pointer-events-none" : ""}
                  ${k === "DEL" ? "text-red-400 border border-red-500/30 hover:bg-red-500/10 bg-slate-900/50"
                    : "bg-slate-900/50 border border-slate-700/50 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 active:scale-95"}`}>
                {k}
              </button>
            ))}
          </div>

          {error && <div className="text-red-400 text-xs text-center mb-3">{error}</div>}

          <button onClick={handleVerify}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-sm tracking-widest uppercase
              hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-500/30">
            VERIFY
          </button>
        </div>
      </motion.div>
    </div>
  );
}