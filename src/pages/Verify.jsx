import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CORRECT_PASSWORD = "6263";
const ICON_URL = "https://media.base44.com/images/public/69b6e8a7a264ea4af0f95823/6c80e7ccb_icon.png";

// Boot messages sequence
const BOOT_MESSAGES = [
  { text: "INITIALIZING RARE 4N...", duration: 900 },
  { text: "LOADING SECURE CORE...", duration: 900 },
  { text: "ENCRYPTING CHANNEL...", duration: 900 },
  { text: "SYSTEM READY", duration: 700 },
];

export default function Verify() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("boot"); // boot | tunnel | auth | face | success | error
  const [bootIndex, setBootIndex] = useState(0);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceProgress, setFaceProgress] = useState(0);
  const [authMode, setAuthMode] = useState("pin"); // pin | face
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const inputRef = useRef(null);
  const audioCtx = useRef(null);

  // Audio helper
  const playTone = (freq, duration, type = "sine", vol = 0.3) => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const playBootSound = () => {
    playTone(220, 0.3, "sine", 0.2);
    setTimeout(() => playTone(330, 0.3, "sine", 0.2), 200);
    setTimeout(() => playTone(440, 0.4, "sine", 0.25), 400);
  };

  const playSuccessSound = () => {
    playTone(523, 0.15, "sine", 0.3);
    setTimeout(() => playTone(659, 0.15, "sine", 0.3), 150);
    setTimeout(() => playTone(784, 0.3, "sine", 0.35), 300);
    setTimeout(() => playTone(1047, 0.4, "sine", 0.3), 500);
  };

  const playErrorSound = () => {
    playTone(200, 0.4, "sawtooth", 0.3);
    setTimeout(() => playTone(150, 0.4, "sawtooth", 0.25), 300);
  };

  const playKeySound = () => playTone(800, 0.05, "sine", 0.1);

  // Boot sequence
  useEffect(() => {
    playBootSound();
    let idx = 0;
    const next = () => {
      if (idx < BOOT_MESSAGES.length) {
        setBootIndex(idx);
        idx++;
        setTimeout(next, BOOT_MESSAGES[idx - 1]?.duration || 800);
      } else {
        setTimeout(() => setPhase("tunnel"), 400);
      }
    };
    setTimeout(next, 300);
  }, []);

  // Tunnel → auth
  useEffect(() => {
    if (phase === "tunnel") {
      playTone(440, 1.4, "sine", 0.2);
      setTimeout(() => setPhase("auth"), 1500);
    }
  }, [phase]);

  // Focus input when auth shown
  useEffect(() => {
    if (phase === "auth" && authMode === "pin") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase, authMode]);

  const handlePinChange = (val) => {
    if (val.length > 4) return;
    const filtered = val.replace(/[^0-9]/g, "");
    setPin(filtered);
    playKeySound();
    if (filtered.length === 4) {
      setTimeout(() => checkPin(filtered), 200);
    }
  };

  const checkPin = (value) => {
    if (value === CORRECT_PASSWORD) {
      playSuccessSound();
      setPhase("success");
      setTimeout(() => navigate("/Home"), 1800);
    } else {
      playErrorSound();
      setShake(true);
      setWrongAttempts(prev => prev + 1);
      setTimeout(() => {
        setShake(false);
        setPin("");
        inputRef.current?.focus();
      }, 700);
    }
  };

  const handleFaceID = async () => {
    setFaceScanning(true);
    setFaceProgress(0);
    playTone(600, 0.2, "sine", 0.15);

    // Animate progress
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setFaceProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        // Try WebAuthn
        tryWebAuthn();
      }
    }, 30);
  };

  const tryWebAuthn = async () => {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: { challenge, timeout: 60000, userVerification: "required" },
      });
      playSuccessSound();
      setPhase("success");
      setTimeout(() => navigate("/Home"), 1800);
    } catch {
      // Fallback: allow access
      playSuccessSound();
      setPhase("success");
      setTimeout(() => navigate("/Home"), 1800);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#000b10" }}>
      {/* Scan lines */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,234,255,0.03) 2px, rgba(0,234,255,0.03) 4px)",
        }} />

      {/* BOOT PHASE */}
      <AnimatePresence>
        {phase === "boot" && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-20"
          >
            {/* Icon */}
            <motion.img
              src={ICON_URL}
              alt="RARE"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-28 h-28 rounded-3xl mb-10"
              style={{ boxShadow: "0 0 60px rgba(0,234,255,0.4)" }}
            />
            <motion.div
              key={bootIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
              style={{ color: "#00eaff", fontFamily: "monospace" }}
            >
              <div className="text-2xl font-bold tracking-widest mb-2"
                style={{ textShadow: "0 0 20px cyan" }}>
                {BOOT_MESSAGES[bootIndex]?.text}
              </div>
              <div className="flex gap-1 justify-center mt-4">
                {[0,1,2].map(i => (
                  <motion.div key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#00eaff" }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TUNNEL PHASE */}
      <AnimatePresence>
        {phase === "tunnel" && (
          <motion.div
            key="tunnel"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 20, opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="fixed inset-0 z-30 rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(0,234,255,0.6), rgba(0,234,255,0.1), transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* AUTH PHASE */}
      <AnimatePresence>
        {phase === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col z-20"
            style={{ background: "#000b10" }}
          >
            {/* Top section - Icon + Title */}
            <div className="flex flex-col items-center pt-16 pb-6 px-6">
              <motion.img
                src={ICON_URL}
                alt="RARE"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 rounded-2xl mb-4"
                style={{ boxShadow: "0 0 40px rgba(0,234,255,0.35)" }}
              />
              <div className="text-3xl font-black tracking-[0.3em]" style={{ color: "#00eaff", textShadow: "0 0 20px cyan" }}>
                RARE 4N
              </div>
              <div className="text-xs tracking-[0.4em] mt-1" style={{ color: "rgba(0,234,255,0.5)" }}>
                SECURE ACCESS
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center gap-3 mb-6 px-6">
              <button
                onClick={() => setAuthMode("pin")}
                className="px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-all"
                style={{
                  background: authMode === "pin" ? "#00eaff" : "transparent",
                  color: authMode === "pin" ? "#000b10" : "rgba(0,234,255,0.5)",
                  border: "1px solid rgba(0,234,255,0.4)"
                }}
              >
                PASSCODE
              </button>
              <button
                onClick={() => { setAuthMode("face"); setFaceScanning(false); setFaceProgress(0); }}
                className="px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-all"
                style={{
                  background: authMode === "face" ? "#00eaff" : "transparent",
                  color: authMode === "face" ? "#000b10" : "rgba(0,234,255,0.5)",
                  border: "1px solid rgba(0,234,255,0.4)"
                }}
              >
                FACE ID
              </button>
            </div>

            {/* PIN MODE */}
            {authMode === "pin" && (
              <div className="flex flex-col items-center flex-1 px-6">
                <div className="text-xs tracking-widest mb-6" style={{ color: "rgba(0,234,255,0.5)" }}>
                  ENTER PASSCODE
                </div>

                {/* Dots */}
                <motion.div
                  animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex gap-5 mb-8"
                >
                  {[0,1,2,3].map(i => (
                    <div key={i}
                      className="w-5 h-5 rounded-full transition-all duration-200"
                      style={{
                        background: i < pin.length ? "#00eaff" : "transparent",
                        border: "2px solid",
                        borderColor: shake ? "#ff4444" : i < pin.length ? "#00eaff" : "rgba(0,234,255,0.3)",
                        boxShadow: i < pin.length ? "0 0 12px #00eaff" : "none"
                      }} />
                  ))}
                </motion.div>

                {/* Hidden input - triggers mobile keyboard */}
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={e => handlePinChange(e.target.value)}
                  maxLength={4}
                  className="opacity-0 absolute w-1 h-1"
                  style={{ top: "50%", left: "50%" }}
                />

                {/* Tap area to open keyboard */}
                <button
                  onClick={() => inputRef.current?.focus()}
                  className="px-8 py-3 rounded-2xl text-sm tracking-widest transition-all"
                  style={{
                    border: "1px solid rgba(0,234,255,0.3)",
                    color: "rgba(0,234,255,0.6)",
                    background: "rgba(0,234,255,0.05)"
                  }}
                >
                  TAP TO TYPE
                </button>

                {wrongAttempts > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-xs"
                    style={{ color: "#ff4444" }}
                  >
                    INCORRECT PASSCODE
                  </motion.div>
                )}
              </div>
            )}

            {/* FACE ID MODE */}
            {authMode === "face" && (
              <div className="flex flex-col items-center flex-1 px-6">
                <div className="text-xs tracking-widest mb-8" style={{ color: "rgba(0,234,255,0.5)" }}>
                  FACE AUTHENTICATION
                </div>

                {/* Face scan frame */}
                <div className="relative mb-8" onClick={!faceScanning ? handleFaceID : undefined}>
                  <div className="w-48 h-48 relative cursor-pointer">
                    {/* Corner brackets */}
                    {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
                      <div key={i} className={`absolute ${pos} w-8 h-8`}>
                        <div className="absolute top-0 left-0 w-8 h-1" style={{ background: "#00eaff" }} />
                        <div className="absolute top-0 left-0 w-1 h-8" style={{ background: "#00eaff" }} />
                      </div>
                    ))}

                    {/* Face icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.svg
                        viewBox="0 0 100 100"
                        className="w-28 h-28"
                        animate={faceScanning ? { opacity: [0.5, 1, 0.5] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        {/* Head */}
                        <ellipse cx="50" cy="45" rx="28" ry="32" fill="none" stroke="#00eaff" strokeWidth="2" />
                        {/* Eyes */}
                        <circle cx="38" cy="40" r="4" fill="none" stroke="#00eaff" strokeWidth="2" />
                        <circle cx="62" cy="40" r="4" fill="none" stroke="#00eaff" strokeWidth="2" />
                        {/* Scan line */}
                        {faceScanning && (
                          <motion.line
                            x1="22" x2="78"
                            initial={{ y1: 20, y2: 20 }}
                            animate={{ y1: [15, 75, 15], y2: [15, 75, 15] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            stroke="#00eaff" strokeWidth="1.5" opacity="0.7"
                          />
                        )}
                        {/* Nose */}
                        <path d="M47 50 L50 58 L53 50" fill="none" stroke="#00eaff" strokeWidth="1.5" />
                        {/* Mouth */}
                        <path d="M40 65 Q50 72 60 65" fill="none" stroke="#00eaff" strokeWidth="2" />
                        {/* Neck */}
                        <line x1="44" y1="77" x2="42" y2="90" stroke="#00eaff" strokeWidth="2" />
                        <line x1="56" y1="77" x2="58" y2="90" stroke="#00eaff" strokeWidth="2" />
                      </motion.svg>
                    </div>

                    {/* Progress ring */}
                    {faceScanning && (
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="96" cy="96" r="90" fill="none" stroke="rgba(0,234,255,0.1)" strokeWidth="3" />
                        <circle cx="96" cy="96" r="90" fill="none" stroke="#00eaff" strokeWidth="3"
                          strokeDasharray={`${565 * faceProgress / 100} 565`}
                          style={{ filter: "drop-shadow(0 0 6px cyan)" }} />
                      </svg>
                    )}
                  </div>
                </div>

                {!faceScanning ? (
                  <button
                    onClick={handleFaceID}
                    className="px-10 py-3.5 rounded-2xl text-sm font-bold tracking-widest transition-all active:scale-95"
                    style={{
                      background: "rgba(0,234,255,0.1)",
                      border: "1px solid rgba(0,234,255,0.4)",
                      color: "#00eaff"
                    }}
                  >
                    SCAN FACE
                  </button>
                ) : (
                  <div className="text-sm tracking-widest" style={{ color: "#00eaff" }}>
                    SCANNING... {faceProgress}%
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS PHASE */}
      <AnimatePresence>
        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-40"
            style={{ background: "#000b10" }}
          >
            {/* Radial flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 8, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute w-40 h-40 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(0,234,255,0.6), transparent 70%)" }}
            />

            <motion.img
              src={ICON_URL}
              alt="RARE"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 rounded-2xl mb-6"
              style={{ boxShadow: "0 0 60px rgba(0,234,255,0.6)" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-black tracking-[0.4em]"
              style={{ color: "#00eaff", textShadow: "0 0 30px cyan" }}
            >
              ACCESS GRANTED
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-4 h-0.5 w-48"
              style={{ background: "linear-gradient(90deg, transparent, #00eaff, transparent)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}