"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles, Users, Award, Zap, Clock, Tag, ChevronRight, GraduationCap, BookOpen, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { getMyOpenRequests, cancelHelpRequest } from "@/actions/requests";
import { MatchNotification } from "@/components/matches/MatchNotification";
import { getIncomingMatches, respondToMatch, getActiveSessions } from "@/actions/matches";
import { SessionCard } from "@/components/session/SessionCard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [incomingMatches, setIncomingMatches] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const user = session?.user as any;

  useEffect(() => {
    if (session?.user) {
      getMyOpenRequests().then(setActiveRequests);
      getIncomingMatches().then(setIncomingMatches);
      getActiveSessions().then(setActiveSessions);
    }
  }, [session]);

  const stats = [
    { name: "Sessions Given", value: user?.sessionsGiven || 0, icon: GraduationCap },
    { name: "Sessions Received", value: user?.sessionsReceived || 0, icon: BookOpen },
    { name: "Reputation", value: user?.reputation || 0, icon: Award },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 space-y-8">
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Ready to Bridge some Skills today?</p>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center gap-2">
            <Zap className="w-5 h-5" /> Active Mentor
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="glass p-6 rounded-2xl border border-white/5 space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{stat.value}</span>
                <stat.icon className="w-8 h-8 text-primary/40" />
              </div>
            </div>
          ))}
        </div>

        {/* Active Sessions Section */}
        {activeSessions.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> In-Progress Sessions
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {activeSessions.map(session => (
                 <SessionCard key={session.id} session={session} userId={user.id} />
               ))}
             </div>
          </div>
        )}

        {/* Incoming Matches Section */}
        {incomingMatches.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-purple-400" /> Mentoring Opportunities
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {incomingMatches.map(match => (
                 <div key={match.id} className="premium-gradient p-[1px] rounded-2xl overflow-hidden">
                   <div className="bg-zinc-950 p-6 space-y-4">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold">
                             {match.request.user.name[0]}
                           </div>
                           <div>
                              <p className="text-sm font-bold">{match.request.user.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{match.request.topic}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-purple-400">Match Score</p>
                           <p className="text-lg font-bold">{(match.score).toFixed(0)}%</p>
                        </div>
                     </div>
                     <p className="text-sm italic text-muted-foreground line-clamp-2">
                       "{match.request.context}"
                     </p>
                     <div className="flex gap-2">
                        <Button 
                          className="flex-1 h-9 text-xs font-bold" 
                          variant="premium"
                          onClick={() => respondToMatch(match.id, "ACCEPTED").then(() => window.location.reload())}
                        >
                          Accept
                        </Button>
                        <Button 
                          className="flex-1 h-9 text-xs font-bold" 
                          variant="ghost"
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.disabled = true;
                            btn.innerText = "Declining...";
                            await respondToMatch(match.id, "DECLINED");
                            setIncomingMatches(prev => prev.filter(m => m.id !== match.id));
                          }}
                        >
                          Decline
                        </Button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Pending Broadcasts Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary animate-pulse" /> Pending Broadcasts
          </h2>
          
          {activeRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRequests.map(req => (
                <div key={req.id} className="glass p-6 rounded-2xl border border-primary/10 space-y-4 relative overflow-hidden group shadow-lg shadow-primary/5">
                  <div className="absolute top-0 right-0 p-3">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase text-primary tracking-widest px-2 py-1 bg-primary/10 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-primary animate-ping" /> Scanning
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <Tag className="w-3 h-3 text-primary" /> {req.topic}
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic line-clamp-2 transition-all">
                      "{req.context}"
                    </p>
                    <MatchNotification requestId={req.id} />
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                      <Clock className="w-3 h-3" /> {req.duration} mins
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-[10px] uppercase font-black tracking-widest text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      onClick={async (e) => {
                        const btn = e.currentTarget;
                        const originalText = btn.innerText;
                        btn.disabled = true;
                        btn.innerText = "Cancelling...";
                        
                        const res = await cancelHelpRequest(req.id);
                        if (res.success) {
                          setActiveRequests(prev => prev.filter(r => r.id !== req.id));
                          router.refresh();
                        } else {
                          btn.disabled = false;
                          btn.innerText = originalText;
                          alert("Failed to cancel. Please restart your server to apply the new database rules.");
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-10 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/30">
                <Users className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">No active sessions</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Start by creating a new help request or checking available mentors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
