import { useState } from "react";
import { motion } from "framer-motion";

const TABS = ["DIALER", "MEETINGS"];

const PhoneIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MessageIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const VideoIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const WhatsAppIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>;
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

export default function RareConnect() {
  const [tab, setTab] = useState("DIALER");
  const [dialNumber, setDialNumber] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [calling, setCalling] = useState(false);

  const dialKeys = [1,2,3,4,5,6,7,8,9,"*",0,"#"];

  const generateMeeting = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setMeetingLink(`https://rare.connect/meet/${id}`);
  };

  return (
    <div className="min-h-screen pb-56 px-4 pt-4">
      <div className="max-w-sm mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                ${tab === t ? "bg-cyan-500 text-black" : "border border-slate-700 text-slate-400 hover:border-cyan-500/50"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "DIALER" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Display */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 mb-4 text-center min-h-[60px] flex items-center justify-center">
              <span className="text-2xl font-light text-slate-200 tracking-widest">
                {dialNumber || <span className="text-slate-600">Enter number</span>}
              </span>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {dialKeys.map((k) => (
                <button key={k} onClick={() => setDialNumber(n => n + k)}
                  className="h-14 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-200 text-xl font-medium
                    hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 active:scale-95 transition-all">
                  {k}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => setCalling(true)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all active:scale-95">
                <PhoneIcon /><span className="text-xs">Call</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all active:scale-95">
                <MessageIcon /><span className="text-xs">SMS</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-600/20 border border-green-600/30 text-green-300 hover:bg-green-600/30 transition-all active:scale-95">
                <WhatsAppIcon /><span className="text-xs">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all active:scale-95">
                <VideoIcon /><span className="text-xs">Video</span>
              </button>
            </div>

            {dialNumber && (
              <button onClick={() => setDialNumber(n => n.slice(0,-1))}
                className="mt-3 w-full py-2 text-xs text-slate-500 hover:text-red-400 transition-colors">
                Delete last digit
              </button>
            )}
          </motion.div>
        )}

        {tab === "MEETINGS" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <button onClick={generateMeeting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-sm tracking-wider flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-400 transition-all active:scale-95">
              <PlusIcon /> Create Meeting Link
            </button>

            {meetingLink && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-cyan-500/20 bg-slate-900/50 p-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Meeting Link</div>
                <div className="text-sm text-cyan-400 break-all mb-3">{meetingLink}</div>
                <button onClick={() => navigator.clipboard.writeText(meetingLink)}
                  className="text-xs px-4 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                  Copy Link
                </button>
              </motion.div>
            )}

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-4">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Powered by</div>
              <div className="text-sm text-slate-300 font-medium">Vonage Video API</div>
              <div className="text-xs text-slate-500 mt-1">Enterprise-grade video conferencing</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}