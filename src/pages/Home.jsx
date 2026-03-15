import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SERVICES = [
  { label: "RARE CODEC", path: "/RareCodec", desc: "AI Builder & Terminal" },
  { label: "RAREHUB", path: "/RareHub", desc: "AI Chat Assistant" },
  { label: "MY RARE", path: "/MyRare", desc: "Family & Security" },
  { label: "RARE VAULT", path: "/RareVault", desc: "Encrypted Storage" },
  { label: "RARE CONNECT", path: "/RareConnect", desc: "Calls & Meetings" },
  { label: "RARE MAP", path: "/RareMap", desc: "Maps & Surveillance" },
];

export default function Home() {
  return (
    <div className="min-h-screen pb-80 px-4 pt-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="text-2xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            RARE
          </div>
          <div className="text-xs text-slate-500 tracking-widest uppercase mt-1">Supreme Access</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((s, i) => (
            <motion.div key={s.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <Link to={s.path}
                className="block rounded-xl border border-cyan-500/20 bg-black/50 backdrop-blur p-4
                  hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-200 group">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mb-3 group-hover:shadow-lg group-hover:shadow-cyan-400/50 transition-all" />
                <div className="text-xs font-bold text-slate-200 tracking-wider group-hover:text-cyan-400 transition-colors">
                  {s.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}