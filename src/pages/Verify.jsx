import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ICON_URL = "https://media.base44.com/images/public/69b6e8a7a264ea4af0f95823/6c80e7ccb_icon.png";
const GLB_URL = "https://raw.githubusercontent.com/algeneral-n/RARE-N/main/rare%2Bhumanoid%2B3d%2Bmodel%20(1).glb";

export default function Verify() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("splash"); // splash | auth | face | flash | done
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtx = useRef(null);
  const [charLoaded, setCharLoaded] = useState(false);

  // Audio
  const playTone = (freq, dur, type = "sine", vol = 0.25) => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(); osc.stop(ctx.currentTime + dur);
    } catch {}
  };

  const playBootSound = () => {
    [220, 330, 440, 660, 880].forEach((f, i) => setTimeout(() => playTone(f, 0.3, "sine", 0.18), i * 160));
  };

  const playFlashSound = () => {
    playTone(880, 0.1, "sine", 0.3);
    setTimeout(() => playTone(1100, 0.1, "sine", 0.3), 100);
    setTimeout(() => playTone(1320, 0.2, "sine", 0.35), 200);
    setTimeout(() => playTone(1760, 0.4, "sine", 0.3), 350);
  };

  const playFaceSound = () => {
    playTone(600, 0.15, "sine", 0.2);
    setTimeout(() => playTone(800, 0.15, "sine", 0.2), 150);
    setTimeout(() => playTone(1000, 0.2, "sine", 0.25), 300);
  };

  // Boot 3D character on mount
  useEffect(() => {
    if (!mountRef.current) return;
    import("three").then(async (THREE) => {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const w = mountRef.current.clientWidth || 280;
      const h = mountRef.current.clientHeight || 380;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 1.0, 3.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      scene.add(new THREE.AmbientLight(0x404040, 3));
      const dl = new THREE.DirectionalLight(0x00eaff, 5);
      dl.position.set(2, 5, 3); scene.add(dl);
      const fl = new THREE.DirectionalLight(0x0044ff, 2);
      fl.position.set(-3, 2, -2); scene.add(fl);
      const rl = new THREE.PointLight(0x00ffff, 4, 10);
      rl.position.set(0, 3, -2); scene.add(rl);

      clockRef.current = new THREE.Clock();
      const loader = new GLTFLoader();
      loader.load(GLB_URL, (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(1); model.position.set(0, -1.2, 0);
        scene.add(model);
        if (gltf.animations?.length) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          mixer.clipAction(gltf.animations[0]).play();
        }
        setCharLoaded(true);
      }, undefined, () => setCharLoaded(true));

      const loop = () => {
        animFrameRef.current = requestAnimationFrame(loop);
        if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta());
        renderer.render(scene, camera);
      };
      loop();
    });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      rendererRef.current?.dispose();
    };
  }, []);

  // Splash → auth after 3s
  useEffect(() => {
    playBootSound();
    const t = setTimeout(() => setPhase("auth"), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleVerify = async () => {
    playFaceSound();
    setPhase("face");
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: { challenge, timeout: 60000, userVerification: "required" },
      });
    } catch {}
    // Always proceed
    setTimeout(() => {
      playFlashSound();
      setPhase("flash");
      setTimeout(() => navigate("/Home"), 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-between"
      style={{ background: "#000b10" }}>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,234,255,0.04) 3px,rgba(0,234,255,0.04) 4px)" }} />

      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(0,234,255,0.08) 0%, transparent 70%)" }} />

      {/* FLASH */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div key="flash" className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 1.4, times: [0, 0.1, 0.3, 1] }}
            style={{ background: "radial-gradient(circle at center, rgba(0,234,255,0.9), rgba(0,100,255,0.5), transparent 70%)" }} />
        )}
      </AnimatePresence>

      {/* SPLASH phase – icon + glowing text */}
      <AnimatePresence>
        {phase === "splash" && (
          <motion.div key="splash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            transition={{ exit: { duration: 0.5 } }}
            className="fixed inset-0 flex flex-col items-center justify-center z-20">

            {/* Pulsing ring */}
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute rounded-full"
              style={{ width: 180, height: 180, border: "1px solid rgba(0,234,255,0.3)" }} />
            <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.4 }}
              className="absolute rounded-full"
              style={{ width: 240, height: 240, border: "1px solid rgba(0,234,255,0.15)" }} />

            <motion.img src={ICON_URL} alt=""
              initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-28 h-28 rounded-[2rem] relative z-10"
              style={{ boxShadow: "0 0 60px rgba(0,234,255,0.5), 0 0 120px rgba(0,234,255,0.2)" }} />

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center relative z-10">
              <div className="text-4xl font-black tracking-[0.5em]"
                style={{ color: "#00eaff", textShadow: "0 0 30px rgba(0,234,255,0.8), 0 0 60px rgba(0,234,255,0.4)" }}>
                RARE
              </div>
              <div className="text-xs tracking-[0.6em] mt-2" style={{ color: "rgba(0,234,255,0.45)" }}>
                4 N
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="mt-10 flex gap-2">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.35 }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: "#00eaff" }} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTH phase – character + VERIFY button */}
      <AnimatePresence>
        {(phase === "auth" || phase === "face") && (
          <motion.div key="auth"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-end justify-end z-20 pb-safe">

            {/* Character – takes up most of screen */}
            <div ref={mountRef} className="absolute inset-0"
              style={{ bottom: 140 }} />

            {/* Loading spinner if char not ready */}
            {!charLoaded && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ bottom: 140 }}>
                <div className="w-8 h-8 border-2 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            )}

            {/* Bottom action area */}
            <div className="relative z-30 w-full px-8 pb-16 flex flex-col items-center"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 40px)" }}>

              {phase === "auth" && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }} className="w-full flex flex-col items-center gap-4">

                  {/* VERIFY button */}
                  <motion.button onTap={handleVerify} onClick={handleVerify}
                    whileActive={{ scale: 0.96 }}
                    className="w-full max-w-xs py-4 rounded-2xl font-black text-lg tracking-[0.3em] relative overflow-hidden"
                    style={{
                      background: "rgba(0,20,30,0.8)",
                      border: "1.5px solid rgba(0,234,255,0.5)",
                      color: "#00eaff",
                      boxShadow: "0 0 30px rgba(0,234,255,0.2), inset 0 0 20px rgba(0,234,255,0.05)"
                    }}>
                    <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(0,234,255,0.08), transparent)" }} />
                    <span className="relative z-10">VERIFY</span>
                  </motion.button>
                </motion.div>
              )}

              {phase === "face" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3">
                  {/* Face scan animation */}
                  <div className="relative w-28 h-28">
                    {/* Corner brackets */}
                    {[
                      "top-0 left-0",
                      "top-0 right-0 rotate-90",
                      "bottom-0 right-0 rotate-180",
                      "bottom-0 left-0 -rotate-90"
                    ].map((cls, i) => (
                      <div key={i} className={`absolute ${cls} w-7 h-7`}>
                        <div className="absolute top-0 left-0 h-0.5 w-7" style={{ background: "#00eaff" }} />
                        <div className="absolute top-0 left-0 w-0.5 h-7" style={{ background: "#00eaff" }} />
                      </div>
                    ))}
                    {/* Face SVG */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.svg viewBox="0 0 80 90" className="w-20 h-24"
                        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                        <ellipse cx="40" cy="38" rx="22" ry="26" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <circle cx="30" cy="33" r="3" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <circle cx="50" cy="33" r="3" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <path d="M33 47 Q40 53 47 47" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <path d="M37 60 L35 72 M43 60 L45 72" stroke="#00eaff" strokeWidth="1.5"/>
                        <motion.line x1="18" x2="62"
                          animate={{ y1: [14, 62, 14], y2: [14, 62, 14] }}
                          transition={{ repeat: Infinity, duration: 1.6 }}
                          stroke="rgba(0,234,255,0.7)" strokeWidth="1.5"/>
                      </motion.svg>
                    </div>
                  </div>
                  <div className="text-xs tracking-[0.3em]" style={{ color: "rgba(0,234,255,0.7)" }}>
                    SCANNING
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}