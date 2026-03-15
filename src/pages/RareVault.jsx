import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FOLDERS = ["Personal", "Projects", "Documents", "Media", "Secure"];

const FolderIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;

export default function RareVault() {
  const [activeFolder, setActiveFolder] = useState("Personal");
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data: files = [] } = useQuery({
    queryKey: ["vault", activeFolder],
    queryFn: () => base44.entities.VaultFile.filter({ folder: activeFolder }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.VaultFile.delete(id),
    onSuccess: () => qc.invalidateQueries(["vault"]),
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.VaultFile.create({
      name: file.name,
      file_url,
      file_type: file.type,
      folder: activeFolder,
      size: file.size,
    });
    qc.invalidateQueries(["vault"]);
    setUploading(false);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen pb-56 px-4 pt-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="text-sm font-bold tracking-widest text-cyan-400 uppercase">RARE VAULT</div>
          <div className="text-xs text-slate-500 mt-1">Encrypted File Storage</div>
        </div>

        {/* Folders */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {FOLDERS.map(f => (
            <button key={f} onClick={() => setActiveFolder(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                ${activeFolder === f ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Upload */}
        <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed
          border-cyan-500/30 text-slate-400 hover:border-cyan-500/60 hover:text-cyan-400 transition-all cursor-pointer mb-4
          ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          <input type="file" className="hidden" onChange={handleUpload} />
          <UploadIcon />
          <span className="text-sm">{uploading ? "Uploading..." : "Upload File"}</span>
        </label>

        {/* Files grid */}
        <div className="space-y-2">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div key={file.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/50 bg-slate-900/50 hover:border-cyan-500/20 transition-all">
                <div className="text-slate-500"><FolderIcon /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200 truncate">{file.name}</div>
                  <div className="text-xs text-slate-500 flex gap-3 mt-0.5">
                    <span>{formatSize(file.size)}</span>
                    {file.encrypted && <span className="text-cyan-400 flex items-center gap-1"><LockIcon /> Encrypted</span>}
                    {file.expiry_date && <span className="text-amber-400">Exp: {file.expiry_date}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={file.file_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded border border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                    Open
                  </a>
                  <button onClick={() => deleteMutation.mutate(file.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/20 hover:bg-red-500/10 transition-all">
                    Del
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {files.length === 0 && (
            <div className="text-center py-12 text-slate-600 text-sm">No files in {activeFolder}</div>
          )}
        </div>
      </div>
    </div>
  );
}