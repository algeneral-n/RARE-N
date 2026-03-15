import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { motion } from "framer-motion";

const GLB_URL = "https://raw.githubusercontent.com/algeneral-n/RARE-N/main/rare%2Bhumanoid%2B3d%2Bmodel%20(1).glb";

export default function Home() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const animFrameRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0.8, 3.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0x404040, 3));
    const dl = new THREE.DirectionalLight(0x00d4ff, 4);
    dl.position.set(2, 5, 3); scene.add(dl);
    const fl = new THREE.DirectionalLight(0x0044ff, 2);
    fl.position.set(-3, 2, -2); scene.add(fl);
    const rl = new THREE.PointLight(0x00ffff, 3, 10);
    rl.position.set(0, 3, -2); scene.add(rl);

    clockRef.current = new THREE.Clock();
    const loader = new GLTFLoader();
    loader.load(GLB_URL, (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(1);
      model.position.set(0, -1.2, 0);
      scene.add(model);
      if (gltf.animations?.length) {
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        mixer.clipAction(gltf.animations[0]).play();
      }
      setLoaded(true);
    }, undefined, () => setLoaded(true));

    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta());
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      if (!el) return;
      const w2 = el.clientWidth; const h2 = el.clientHeight;
      camera.aspect = w2 / h2; camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 pt-16" style={{ zIndex: 5 }}>
      {/* Full screen character */}
      <div ref={mountRef} className="absolute inset-0 pt-16" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}