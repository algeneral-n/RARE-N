import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const GLB_URL = "https://raw.githubusercontent.com/algeneral-n/RARE-N/main/rare%2Bhumanoid%2B3d%2Bmodel%20(1).glb";

const ANIMATIONS = [
  "idle", "walk", "run", "jump", "wave", "talk",
  "dance", "attack", "defend", "death", "victory",
  "sit", "stand", "crouch", "fly", "swim",
  "climb", "push", "pull", "throw", "kick"
];

// Voice commands mapping
const VOICE_COMMANDS = {
  "idle": "idle",
  "stand": "idle",
  "وقف": "idle",
  "ساكن": "idle",
  "walk": "walk",
  "امشي": "walk",
  "مشي": "walk",
  "run": "run",
  "اركض": "run",
  "jump": "jump",
  "اقفز": "jump",
  "wave": "wave",
  "سلم": "wave",
  "هاي": "wave",
  "talk": "talk",
  "كلم": "talk",
  "dance": "dance",
  "العب": "dance",
  "رقص": "dance",
  "attack": "attack",
  "اضرب": "attack",
  "victory": "victory",
  "انتصر": "victory",
};

export default function RareCharacter3D({ visible = true, size = 100 }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const actionsRef = useRef({});
  const currentActionRef = useRef(null);
  const animFrameRef = useRef(null);
  const [currentAnim, setCurrentAnim] = useState("idle");
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || !visible) return;

    const w = mountRef.current.clientWidth || 300;
    const h = mountRef.current.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 3.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x00d4ff, 4);
    dirLight.position.set(2, 5, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x0044ff, 2);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x00ffff, 3, 10);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // Load GLB
    const loader = new GLTFLoader();
    loader.load(
      GLB_URL,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(1);
        model.position.set(0, -1, 0);
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          gltf.animations.forEach((clip, i) => {
            const name = clip.name.toLowerCase() || ANIMATIONS[i] || `anim_${i}`;
            const action = mixer.clipAction(clip);
            actionsRef.current[name] = action;
            actionsRef.current[i] = action; // also index
          });

          // Play first animation
          const firstKey = Object.keys(actionsRef.current)[0];
          if (firstKey) {
            actionsRef.current[firstKey].play();
            currentActionRef.current = actionsRef.current[firstKey];
          }
        }

        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error("GLB load error:", err);
        setLoadError(true);
      }
    );

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) mixerRef.current.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [visible]);

  const playAnimation = (name) => {
    const actions = actionsRef.current;
    // Find matching action by name or index
    let targetAction = null;
    
    // Try exact match
    if (actions[name]) {
      targetAction = actions[name];
    } else {
      // Try partial match
      const key = Object.keys(actions).find(k => 
        typeof k === 'string' && k.toLowerCase().includes(name.toLowerCase())
      );
      if (key) targetAction = actions[key];
    }

    if (!targetAction) return;

    if (currentActionRef.current && currentActionRef.current !== targetAction) {
      currentActionRef.current.fadeOut(0.3);
    }
    targetAction.reset().fadeIn(0.3).play();
    currentActionRef.current = targetAction;
    setCurrentAnim(name);
  };

  const playByIndex = (index) => {
    const action = actionsRef.current[index];
    if (!action) return;
    if (currentActionRef.current && currentActionRef.current !== action) {
      currentActionRef.current.fadeOut(0.3);
    }
    action.reset().fadeIn(0.3).play();
    currentActionRef.current = action;
    setCurrentAnim(`anim_${index}`);
  };

  // Voice control
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("المتصفح لا يدعم التعرف على الصوت");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ar-SA";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join(" ")
        .toLowerCase()
        .trim();
      setVoiceText(transcript);

      // Check voice commands
      for (const [cmd, anim] of Object.entries(VOICE_COMMANDS)) {
        if (transcript.includes(cmd)) {
          playAnimation(anim);
          break;
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  if (!visible) return null;

  const numAnimations = Object.keys(actionsRef.current).filter(k => isNaN(k)).length || 21;

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Viewport */}
      <div
        ref={mountRef}
        style={{ width: `${size * 2.5}px`, height: `${size * 3}px`, maxWidth: "100%" }}
        className="relative rounded-2xl overflow-hidden"
      >
        {!loaded && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin mb-2" />
            <div className="text-xs text-slate-400">Loading 3D Character...</div>
          </div>
        )}
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-xs text-red-400 text-center px-4">
              Failed to load GLB.<br/>Check if the file is accessible.
            </div>
          </div>
        )}
      </div>

      {/* Voice Control */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={toggleVoice}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          {isListening ? "جاري الاستماع..." : "تحكم صوتي"}
        </button>
        {voiceText && (
          <span className="text-xs text-cyan-400 max-w-[150px] truncate">{voiceText}</span>
        )}
      </div>

      {/* Manual Controls - Animation Buttons */}
      {loaded && (
        <div className="mt-3 w-full max-w-sm">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 text-center">تحكم يدوي</div>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.keys(actionsRef.current)
              .filter(k => isNaN(k))
              .slice(0, 20)
              .map((anim) => (
                <button
                  key={anim}
                  onClick={() => playAnimation(anim)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    currentAnim === anim
                      ? "bg-cyan-500 text-black"
                      : "bg-slate-900 border border-slate-700/50 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
                  }`}
                >
                  {anim.slice(0, 8)}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Voice Commands Help */}
      {isListening && (
        <div className="mt-3 rounded-xl border border-cyan-500/20 bg-slate-900/80 p-3 text-xs text-slate-400 max-w-sm w-full">
          <div className="text-cyan-400 font-bold mb-1">أوامر صوتية:</div>
          <div className="grid grid-cols-2 gap-1">
            <span>"امشي" → walk</span>
            <span>"اركض" → run</span>
            <span>"اقفز" → jump</span>
            <span>"سلم" → wave</span>
            <span>"رقص" → dance</span>
            <span>"وقف" → idle</span>
          </div>
        </div>
      )}
    </div>
  );
}