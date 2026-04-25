
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  Video, Mic, MessageSquare, 
  Hand, Monitor, LogOut, 
  Users, Shield, Sparkles, Timer as TimerIcon
} from "lucide-react";
import { getSessionDetails } from "@/actions/matches";

export default function SessionRoom() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
      }
    }
    loadData();
  }, [sessionId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      router.push("/dashboard");
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
    // Load Jitsi script
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
    if (jitsiLoaded && sessionId) {
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
      };
      const api = new (window as any).JitsiMeetExternalAPI(domain, options);

      return () => api.dispose();
    }
  }, [jitsiLoaded, sessionId]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between glass sticky top-0 z-50">
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
           <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-xs gap-2 text-white hover:bg-white/5">
              <LogOut className="w-4 h-4 text-red-500" /> End
           </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
         {/* Video Section */}
         <div className="flex-[3] bg-zinc-900/50 rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
            <div id="jitsi-container" className="w-full h-full" />
            {!jitsiLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                 <p className="text-sm font-medium text-muted-foreground">Initializing Call Environment...</p>
              </div>
            )}
         </div>

         {/* Sidbar: AI Brief & Notepad (Expanding on the concept) */}
         <div className="flex-1 space-y-4 hidden lg:flex flex-col">
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
               <h3 className="font-bold flex items-center gap-2 text-sm">
                 <Sparkles className="w-4 h-4 text-primary" /> Session Intelligence
               </h3>
               <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
                  <p className="text-[10px] uppercase font-bold text-primary">Focus Point</p>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    Clarify the core concepts first, then move to practical implementation.
                  </p>
               </div>
            </div>

            <div className="flex-1 glass p-6 rounded-3xl border border-white/5 flex flex-col space-y-4">
               <h3 className="font-bold flex items-center gap-2 text-sm">
                 <MessageSquare className="w-4 h-4 text-primary" /> Shared Notepad
               </h3>
               <textarea 
                 className="flex-1 w-full bg-transparent border-none outline-none text-sm resize-none text-zinc-400 leading-relaxed"
                 placeholder="Type notes here... they'll be saved to the session history."
               />
            </div>
         </div>
      </div>
    </div>
  );
}
