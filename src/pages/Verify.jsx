import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ICON_URL, GLB_URL } from "@/components/theme";

const BOOT_SEQ = ["INITIALIZING...", "SECURE CORE LOADING...", "ENCRYPTION ACTIVE...", "SYSTEM READY"];

export default function Verify() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("splash"); // splash | auth | face | flash
  const [bootIdx, setBootIdx] = useState(0);
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const rafRef = useRef(null);
  const audioRef = useRef(null);

  const tone = (f, d, t = "sine", v = 0.22) => {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = t; o.frequency.value = f;
      g.gain.setValueAtTime(v, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
      o.start(); o.stop(ctx.currentTime + d);
    } catch {}
  };

  const bootSound = () => [220, 330, 440, 660, 880].forEach((f, i) => setTimeout(() => tone(f, 0.25, "sine", 0.16), i * 140));
  const flashSound = () => { tone(880, 0.1, "sine", 0.3); setTimeout(() => tone(1320, 0.15, "sine", 0.3), 120); setTimeout(() => tone(1760, 0.35, "sine", 0.28), 260); };
  const faceSound = () => { tone(600, 0.12, "sine", 0.18); setTimeout(() => tone(900, 0.12, "sine", 0.18), 140); setTimeout(() => tone(1100, 0.18, "sine", 0.22), 280); };

  // Boot text ticker
  useEffect(() => {
    bootSound();
    let i = 0;
    const tick = setInterval(() => {
      i++;
      if (i < BOOT_SEQ.length) { setBootIdx(i); }
      else { clearInterval(tick); setTimeout(() => setPhase("auth"), 600); }
    }, 700);
    return () => clearInterval(tick);
  }, []);

  // 3D Character
  useEffect(() => {
    if (!mountRef.current) return;
    let renderer, animId;
    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const el = mountRef.current;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
      cam.position.set(0, 0.9, 3.0);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      scene.add(new THREE.AmbientLight(0x446688, 4));
      const dl = new THREE.DirectionalLight(0x00eaff, 5); dl.position.set(2, 5, 3); scene.add(dl);
      scene.add(Object.assign(new THREE.DirectionalLight(0x0033aa, 2), { position: { x: -3, y: 2, z: -2, set() {} } }));
      const fl = new THREE.DirectionalLight(0x0033aa, 2); fl.position.set(-3, 2, -2); scene.add(fl);
      const rl = new THREE.PointLight(0x00ffff, 4, 10); rl.position.set(0, 3, -2); scene.add(rl);
      clockRef.current = new THREE.Clock();
      new GLTFLoader().load(GLB_URL, (gltf) => {
        const m = gltf.scene; m.scale.setScalar(1); m.position.set(0, -1.15, 0); scene.add(m);
        if (gltf.animations?.length) {
          const mx = new THREE.AnimationMixer(m); mixerRef.current = mx;
          mx.clipAction(gltf.animations[0]).play();
        }
      });
      const loop = () => {
        animId = requestAnimationFrame(loop);
        mixerRef.current?.update(clockRef.current.getDelta());
        renderer.render(scene, cam);
      };
      loop(); rafRef.current = { cancel: () => cancelAnimationFrame(animId) };
      const onResize = () => {
        if (!el) return;
        cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);
    })();
    return () => { rafRef.current?.cancel(); rendererRef.current?.dispose(); };
  }, []);

  const handleVerify = async () => {
    faceSound();
    setPhase("face");
    try {
      const ch = new Uint8Array(32); crypto.getRandomValues(ch);
      await navigator.credentials.get({ publicKey: { challenge: ch, timeout: 60000, userVerification: "required" } });
    } catch {}
    setTimeout(() => { flashSound(); setPhase("flash"); setTimeout(() => navigate("/Home"), 1300); }, 1400);
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#000b10" }}>
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,234,255,0.03) 3px,rgba(0,234,255,0.03) 4px)", zIndex: 1 }} />
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(0,234,255,0.07) 0%, transparent 65%)", zIndex: 1 }} />

      {/* FLASH */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div key="fl" className="fixed inset-0" style={{ zIndex: 60 }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 0] }} transition={{ duration: 1.3, times: [0, 0.08, 0.3, 1] }}
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,234,255,0.95), rgba(0,80,200,0.5), transparent 70%)", zIndex: 60 }} />
        )}
      </AnimatePresence>

      {/* SPLASH */}
      <AnimatePresence>
        {phase === "splash" && (
          <motion.div key="splash" className="fixed inset-0 flex flex-col items-center justify-center" style={{ zIndex: 20 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08 }} transition={{ exit: { duration: 0.4 } }}>
            {/* Rings */}
            {[160, 220, 290].map((s, i) => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                style={{ width: s, height: s, border: `1px solid rgba(0,234,255,${0.25 - i * 0.07})` }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.5, delay: i * 0.3 }} />
            ))}
            {/* Icon */}
            <motion.img src={ICON_URL} alt=""
              initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
              className="w-32 h-32 relative" style={{ borderRadius: 32, boxShadow: "0 0 70px rgba(0,234,255,0.55), 0 0 140px rgba(0,234,255,0.18)", zIndex: 2 }} />
            {/* Boot text */}
            <motion.div key={bootIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center" style={{ fontFamily: "'IBM Plex Mono',monospace", zIndex: 2 }}>
              <div className="text-sm tracking-[0.2em]" style={{ color: "rgba(0,234,255,0.7)" }}>{BOOT_SEQ[bootIdx]}</div>
            </motion.div>
            <div className="flex gap-2 mt-6" style={{ zIndex: 2 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#00eaff" }}
                  animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.35 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTH / FACE */}
      <AnimatePresence>
        {(phase === "auth" || phase === "face") && (
          <motion.div key="auth" className="fixed inset-0" style={{ zIndex: 20 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Character canvas */}
            <div ref={mountRef} className="absolute inset-0" />

            {/* Bottom area */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 40px)", zIndex: 10 }}>

              {phase === "auth" && (
                <motion.button onClick={handleVerify}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative overflow-hidden"
                  style={{
                    width: 260, padding: "18px 0", borderRadius: 18,
                    background: "rgba(0,15,25,0.75)", backdropFilter: "blur(16px)",
                    border: "1.5px solid rgba(0,234,255,0.45)", color: "#00eaff",
                    fontFamily: "'Orbitron','IBM Plex Mono',monospace", fontWeight: 700,
                    fontSize: 18, letterSpacing: "0.35em",
                    boxShadow: "0 0 40px rgba(0,234,255,0.18), inset 0 0 30px rgba(0,234,255,0.04)"
                  }}>
                  <motion.div className="absolute inset-0" animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
                    style={{ background: "linear-gradient(90deg,transparent,rgba(0,234,255,0.1),transparent)", width: "60%" }} />
                  VERIFY
                </motion.button>
              )}

              {phase === "face" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3">
                  <div className="relative" style={{ width: 120, height: 120 }}>
                    {/* Corner brackets */}
                    {[["top-0 left-0", ""], ["top-0 right-0", "rotate-90"], ["bottom-0 right-0", "rotate-180"], ["bottom-0 left-0", "-rotate-90"]].map(([pos, rot], i) => (
                      <div key={i} className={`absolute ${pos} ${rot}`} style={{ width: 28, height: 28 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 2, background: "#00eaff", boxShadow: "0 0 8px #00eaff" }} />
                        <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 28, background: "#00eaff", boxShadow: "0 0 8px #00eaff" }} />
                      </div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.svg viewBox="0 0 80 90" style={{ width: 76, height: 86 }}
                        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.1 }}>
                        <ellipse cx="40" cy="37" rx="22" ry="25" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <circle cx="30" cy="33" r="3" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <circle cx="50" cy="33" r="3" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <path d="M33 47 Q40 53 47 47" fill="none" stroke="#00eaff" strokeWidth="1.5"/>
                        <motion.line x1="18" x2="62" animate={{ y1: [14, 60, 14], y2: [14, 60, 14] }}
                          transition={{ repeat: Infinity, duration: 1.5 }} stroke="rgba(0,234,255,0.65)" strokeWidth="1.5"/>
                      </motion.svg>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "0.35em", color: "rgba(0,234,255,0.65)" }}>
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