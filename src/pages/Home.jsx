import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GLB_URL } from "@/components/theme";

export default function Home() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);

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
      renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      scene.add(new THREE.AmbientLight(0x446688, 3));
      const dl = new THREE.DirectionalLight(0x00d4ff, 4); dl.position.set(2, 5, 3); scene.add(dl);
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
      let id;
      const loop = () => { id = requestAnimationFrame(loop); mixerRef.current?.update(clockRef.current.getDelta()); renderer.render(scene, cam); };
      loop(); rafRef.current = id;
      const onResize = () => { if (!el) return; cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix(); renderer.setSize(el.clientWidth, el.clientHeight); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    })();
    return () => { cancelAnimationFrame(rafRef.current); rendererRef.current?.dispose(); };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0" style={{ paddingTop: 64, zIndex: 5 }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0, top: 64 }} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-cyan-400 border-slate-800 animate-spin" />
        </div>
      )}
    </motion.div>
  );
}