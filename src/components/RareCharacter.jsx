import { motion, AnimatePresence } from "framer-motion";

const CHARACTER_URL = "https://media.base44.com/images/public/69b6e8a7a264ea4af0f95823/e067e740e_input.png";

export default function RareCharacter({ visible = true, size = 100, animation = "idle", className = "" }) {
  const scale = size / 100;

  const animations = {
    idle: { y: [0, -8, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    talk: { scale: [1, 1.02, 1], transition: { duration: 0.4, repeat: Infinity } },
    wave: { rotate: [0, 5, -5, 0], transition: { duration: 0.5, repeat: 3 } },
    jump: { y: [0, -30, 0], transition: { duration: 0.6, repeat: 2 } },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`relative flex items-center justify-center ${className}`}
        >
          <motion.div
            animate={animations[animation] || animations.idle}
            style={{ transform: `scale(${scale})` }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-cyan-400 scale-75 translate-y-8" />
            <img
              src={CHARACTER_URL}
              alt="RARE Character"
              className="relative z-10 drop-shadow-2xl"
              style={{ height: "320px", objectFit: "contain" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}