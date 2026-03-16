import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GLB_URL } from "@/components/theme";
import { useAppSettings } from "@/components/AppSettingsContext";

// Guardian AI states: idle | listening | confirmed
export default function Home() {
  const { theme } = useAppSettings();
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [guardianState, setGuardianState] = useState("idle"); // idle | listening | confirmed
  const [showTunnel, setShowTunnel] = useState(false);

  // ── 3D scene ──────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    let renderer;
    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const el = mountRef.current;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      cam.position.set(0, 0.8, 3.0);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      scene.add(new THREE.AmbientLight(0x446688, 3));
      const dl = new THREE.DirectionalLight(0x00eaff, 4); dl.position.set(2, 5, 3); scene.add(dl);
      const fl = new THREE.DirectionalLight(0x0033aa, 2); fl.position.set(-3, 2, -2); scene.add(fl);
      const rl = new THREE.PointLight(0x00ffff, 3, 10); rl.position.set(0, 3, -2); scene.add(rl);
      clockRef.current = new THREE.Clock();
      new GLTFLoader().load(GLB_URL, (gltf) => {
        const m = gltf.scene; m.scale.setScalar(1); m.position.set(0, -1.15, 0); scene.add(m);
        if (gltf.animations?.length) {
          const mx = new THREE.AnimationMixer(m); mixerRef.current = mx;
          mx.clipAction(gltf.animations[0]).play();
        }
        setReady(true);
      }, undefined, () => setReady(true));
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        mixerRef.current?.update(clockRef.current.getDelta());
        renderer.render(scene, cam);
      };
      loop();
      const onResize = () => {
        if (!el) return;
        cam.aspect = el.clientWidth / el.clientHeight;
        cam.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    })();
    return () => { cancelAnimationFrame(rafRef.current); rendererRef.current?.dispose(); };
  }, []);

  // ── Handle guardian activation ──────────────────────
  const handleActivate = () => {
    if (guardianState !== "idle") return;
    setGuardianState("listening");
    setTimeout(() => {
      setGuardianState("confirmed");
      setShowTunnel(true);
      setTimeout(() => setShowTunnel(false), 1300);
      setTimeout(() => setGuardianState("idle"), 3000);
    }, 2200);
  };

  // ── derive accent from theme ─────────────────────────
  const accent = theme.accent || "#00eaff";
  const accentDim = theme.accentDim || "rgba(0,234,255,0.12)";
  const accentBorder = theme.accentBorder || "rgba(0,234,255,0.22)";

  // guardian glow styles per state
  const glowMap = {
    idle: `drop-shadow(0 0 55px ${accent}88)`,
    listening: `drop-shadow(0 0 90px ${accent}) drop-shadow(0 0 30px ${accent})`,
    confirmed: `drop-shadow(0 0 130px ${accent}) drop-shadow(0 0 60px ${accent}cc)`,
  };
  const scaleMap = { idle: 1, listening: 1.03, confirmed: 1.06 };

  return (
    <div className="fixed inset-0" style={{ paddingTop: 64, zIndex: 5 }}>

      {/* ── Tunnel flash overlay ── */}
      <AnimatePresence>
        {showTunnel && (
          <motion.div
            key="tunnel"
            className="fixed inset-0"
            style={{
              zIndex: 60,
              background: `radial-gradient(circle at 50% 50%, ${accent}ee, rgba(0,40,100,0.5), transparent 70%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 3], opacity: [0, 1, 0] }}
            transition={{ duration: 1.3, times: [0, 0.35, 1], ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── 3D canvas ── */}
      <div
        ref={mountRef}
        style={{
          position: "absolute", inset: 0, top: 0,
          filter: glowMap[guardianState],
          transform: `scale(${scaleMap[guardianState]})`,
          transition: "filter 0.6s ease, transform 0.6s ease",
        }}
      />

      {/* ── Loading spinner ── */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-800 animate-spin"
            style={{ borderTopColor: accent }} />
        </div>
      )}

      {/* ── Waveform (listening state) ── */}
      <AnimatePresence>
        {guardianState === "listening" && (
          <motion.div
            key="wave"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", top: "44%", left: "50%",
              transform: "translateX(-50%)",
              display: "flex", gap: 6, alignItems: "flex-end", zIndex: 20,
            }}
          >
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                style={{ width: 5, borderRadius: 4, background: accent }}
                animate={{ height: ["10px", "40px", "10px"] }}
                transition={{ repeat: Infinity, duration: 1, delay, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status label ── */}
      <AnimatePresence>
        {guardianState !== "idle" && (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", top: "51%", left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: "0.35em",
              color: accent, zIndex: 20,
            }}
          >
            {guardianState === "listening" ? "SCANNING" : "CONFIRMED"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Activate button (idle only) ── */}
      <AnimatePresence>
        {guardianState === "idle" && ready && (
          <motion.div
            key="btn"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.3 }}
            style={{
              position: "absolute", bottom: "max(env(safe-area-inset-bottom,0px), 48px)",
              left: "50%", transform: "translateX(-50%)", zIndex: 20,
            }}
          >
            <motion.button
              onClick={handleActivate}
              whileTap={{ scale: 0.96 }}
              style={{
                width: 260, padding: "18px 0", borderRadius: 18,
                background: "rgba(0,15,25,0.75)", backdropFilter: "blur(16px)",
                border: `1.5px solid ${accentBorder}`, color: accent,
                fontFamily: "'Orbitron','IBM Plex Mono',monospace",
                fontWeight: 700, fontSize: 18, letterSpacing: "0.35em",
                boxShadow: `0 0 40px ${accentDim}, inset 0 0 30px ${accentDim}`,
                cursor: "pointer", overflow: "hidden", position: "relative",
              }}
            >
              {/* sweep shimmer */}
              <motion.div
                style={{
                  position: "absolute", inset: 0, width: "60%",
                  background: `linear-gradient(90deg,transparent,${accentDim},transparent)`,
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
              />
              GUARDIAN
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirmed ring burst ── */}
      <AnimatePresence>
        {guardianState === "confirmed" && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: "50%", left: "50%",
                  border: `1px solid ${accent}`,
                  zIndex: 15,
                }}
                initial={{ width: 80, height: 80, x: "-50%", y: "-50%", opacity: 0.8 }}
                animate={{ width: 300 + i * 100, height: 300 + i * 100, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}