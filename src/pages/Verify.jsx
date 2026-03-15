import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Verify() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBiometric = async () => {
    setLoading(true);
    setError(null);
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
        },
      });

      navigate("/Home");
    } catch (err) {
      // If biometrics not available or cancelled, allow bypass
      if (err.name === "NotSupportedError" || err.name === "NotAllowedError") {
        navigate("/Home");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: "linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-8 px-8"
      >
        {/* Logo */}
        <div className="text-center">
          <div className="text-4xl font-black tracking-[0.3em] text-white mb-1">RARE</div>
          <div className="text-xs tracking-[0.5em] text-cyan-400 uppercase">Secure Access</div>
        </div>

        {/* Biometric Button */}
        <motion.button
          onClick={handleBiometric}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="relative w-32 h-32 rounded-full border-2 border-cyan-500/50 bg-cyan-500/10 flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 disabled:opacity-50"
        >
          {/* Pulse ring */}
          {!loading && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border border-cyan-400"
            />
          )}

          {loading ? (
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-cyan-400">
                <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 9a2 2 0 110 4 2 2 0 010-4z"/>
              </svg>
              <span className="text-xs text-cyan-400 font-medium tracking-wider">TOUCH</span>
            </>
          )}
        </motion.button>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-400 text-xs text-center">
            {error}
          </motion.div>
        )}

        <div className="text-xs text-slate-600 text-center">
          Use biometric authentication to access RARE
        </div>
      </motion.div>
    </div>
  );
}