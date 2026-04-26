
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Video, Mic, MessageSquare,
  Hand, Monitor, LogOut,
  Users, Shield, Sparkles, Timer as TimerIcon,
  X, ArrowRight
} from "lucide-react";
import { getSessionDetails } from "@/actions/matches";
import { generateSessionBrief, requestMidSessionHelp, generateSessionSummary, updateNotepad } from "@/actions/sessions";

export default function SessionRoom() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const [aiBrief, setAiBrief] = useState<any>(null);
  const [showPrep, setShowPrep] = useState(true);
  const [midSessionPrompt, setMidSessionPrompt] = useState("");
  const [midSessionResponse, setMidSessionResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const isMentor = sessionData?.mentorId === user?.id;

  useEffect(() => {
    async function loadData() {
      const data = await getSessionDetails(sessionId);
      if (data) {
        setSessionData(data);
        if (data.endTime) {
          const end = new Date(data.endTime).getTime();
          const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
          setTimeLeft(remaining);
        }
        
        const res = await generateSessionBrief(sessionId);
        if (res.success) setAiBrief(res.brief);
      }
    }
    loadData();
  }, [sessionId]);

  const handleMidSessionHelp = async () => {
    if (!midSessionPrompt.trim()) return;
    setIsAiLoading(true);
    const res = await requestMidSessionHelp(sessionId, midSessionPrompt);
    if (res.success) {
      setMidSessionResponse(res.suggestion);
    }
    setIsAiLoading(false);
  };

  const handleEndSession = async () => {
     await generateSessionSummary(sessionId);
     router.push("/dashboard");
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleEndSession();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (jitsiLoaded && sessionId && session) {
      const domain = "meet.jit.si";
      const options = {
        roomName: `SkillBridge-Session-${sessionId}`,
        width: "100%",
        height: "100%",
        parentNode: document.querySelector("#jitsi-container"),
        configOverwrite: {
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
        },
        interfaceConfigOverwrite: {
          DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        },
        userInfo: {
          email: session?.user?.email || "user@skillbridge.com",
          displayName: session?.user?.name || "SkillBridge User"
        }
      };
      const api = new (window as any).JitsiMeetExternalAPI(domain, options);

      return () => api.dispose();
    }
  }, [jitsiLoaded, sessionId, session]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col pt-4">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between glass sticky top-0 z-50 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white font-bold">
            SB
          </div>
          <div>
            <h1 className="text-sm font-bold">Live Mentoring Session</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {sessionData?.request?.topic || "Loading Topic..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <TimerIcon className={`w-4 h-4 ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-primary"}`} />
              <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? "text-red-500" : "text-white"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold flex items-center gap-2 hidden md:flex">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Encrypted
          </div>
          <Button variant="ghost" size="sm" onClick={handleEndSession} className="text-xs gap-2 text-white hover:bg-white/5">
            <LogOut className="w-4 h-4 text-red-500" /> End
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <AnimatePresence>
           {showPrep && aiBrief && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="glass rounded-[2rem] border border-primary/20 overflow-hidden relative"
             >
                <div className="p-6 bg-primary/5 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                   <button 
                     onClick={() => setShowPrep(false)}
                     className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5"
                   >
                     <X className="w-4 h-4 text-muted-foreground" />
                   </button>

                   <div className="col-span-1 border-r border-white/5 pr-6">
                      <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-4">
                        <Sparkles className="w-3 h-3" /> AI Personalized Brief
                      </div>
                      <h3 className="text-xl font-bold mb-1">Get Ready, {user?.name?.split(' ')[0]}</h3>
                      <p className="text-xs text-muted-foreground italic line-clamp-2">Based on your role and topic context.</p>
                   </div>

                   <div className="col-span-2 grid grid-cols-3 gap-4">
                      {isMentor ? (
                        <>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Likely Gaps</p>
                             <p className="text-xs text-zinc-300 leading-relaxed">{aiBrief.mentorBrief.gaps}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Analogies</p>
                             <p className="text-xs text-zinc-300 leading-relaxed">{aiBrief.mentorBrief.analogies}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Prompts</p>
                             <ul className="text-xs text-zinc-300 space-y-1 list-disc pl-3">
                               {aiBrief.mentorBrief.prompts.map((p: string, i: number) => <li key={i}>{p}</li>)}
                             </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">To Have Ready</p>
                             <p className="text-xs text-zinc-300 leading-relaxed">{aiBrief.learnerBrief.readyItems}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Ask First</p>
                             <p className="text-xs text-zinc-300 leading-relaxed">"{aiBrief.learnerBrief.firstQuestion}"</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Success Goal</p>
                             <p className="text-xs text-zinc-300 leading-relaxed">{aiBrief.learnerBrief.successCriteria}</p>
                          </div>
                        </>
                      )}
                   </div>
                </div>
             </motion.div>
           )}
         </AnimatePresence>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
          <div className="flex-[3] bg-zinc-900/50 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
            <div id="jitsi-container" className="w-full h-full" />
            {!jitsiLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Initializing Call Environment...</p>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 hidden lg:flex flex-col">
            {isMentor && (
              <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-primary" /> Mentor Intelligence
                </h3>
                <div className="space-y-3">
                  <input 
                    type="text"
                    placeholder="Stuck? e.g. How to explain React Hooks?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                    value={midSessionPrompt}
                    onChange={(e) => setMidSessionPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMidSessionHelp()}
                  />
                  {midSessionResponse ? (
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-xs italic text-zinc-300 leading-relaxed">
                      {midSessionResponse}
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMidSessionHelp}
                      disabled={isAiLoading || !midSessionPrompt.trim()}
                      className="w-full text-[10px] uppercase font-black tracking-widest gap-2 bg-white/5"
                    >
                      {isAiLoading ? "Asking AI..." : "Get AI Suggestion"} <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 glass p-6 rounded-[2rem] border border-white/5 flex flex-col space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-primary" /> Shared Notepad
              </h3>
              <textarea
                className="flex-1 w-full bg-transparent border-none outline-none text-sm resize-none text-zinc-400 leading-relaxed font-mono"
                placeholder="Type notes here... they'll be saved to the session history."
                defaultValue={sessionData?.notepad || ""}
                onBlur={async (e) => {
                  if (sessionId) {
                    await updateNotepad(sessionId, e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
