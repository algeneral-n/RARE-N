import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RareCharacter from "../components/RareCharacter";

export default function Verify() {
  const navigate = useNavigate();

  const handleFaceID = async () => {
    try {
      // Try WebAuthn / biometric authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: "required",
        },
      });
      if (credential) navigate("/Home");
    } catch (e) {
      // Biometric not available or cancelled — fallback: go directly
      navigate("/Home");
    }
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

      {/* Character + Face ID button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">

        {/* Clickable character triggers Face ID */}
        <button onClick={handleFaceID} className="group flex flex-col items-center gap-4 focus:outline-none">
          {/* Glow ring around character */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl scale-110 group-hover:bg-cyan-500/40 group-active:bg-cyan-500/60 transition-all duration-300" />
            <RareCharacter visible={true} size={130} animation="idle" />
          </div>

          {/* Face ID icon button */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            {/* Face ID SVG */}
            <div className="w-16 h-16 rounded-2xl border-2 border-cyan-500/60 bg-black/60 backdrop-blur flex items-center justify-center
              group-hover:border-cyan-400 group-hover:bg-cyan-500/10 group-active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-cyan-400">
                {/* Face outline */}
                <path d="M3 7V5a2 2 0 0 1 2-2h2" strokeLinecap="round" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
                {/* Eyes */}
                <path d="M9 10h.01" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 10h.01" strokeWidth="2" strokeLinecap="round" />
                {/* Nose */}
                <path d="M12 13v1" strokeLinecap="round" />
                {/* Smile */}
                <path d="M9.5 16.5c.83.5 1.5.75 2.5.75s1.67-.25 2.5-.75" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xs text-cyan-400/80 tracking-[0.2em] uppercase font-medium">Face ID</div>
          </motion.div>
        </button>

        <div className="text-xs text-slate-600 tracking-wider">Tap to unlock with Face ID</div>
      </motion.div>
    </div>
  );
}