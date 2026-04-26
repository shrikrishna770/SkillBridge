"use client";
 
 import { useSession } from "next-auth/react";
 import Link from "next/link";
 import { Sparkles, Users, Award, Zap, Clock, Tag, ChevronRight, GraduationCap, BookOpen, Radio, X } from "lucide-react";
 import { useRouter } from "next/navigation";
 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/Button";
 import { getMyOpenRequests, cancelHelpRequest } from "@/actions/requests";
 import { MatchNotification } from "@/components/matches/MatchNotification";
 import { getIncomingMatches, getActiveSessions, respondToMatch, getMentorPendingOffers } from "@/actions/matches";
 import { SessionCard } from "@/components/session/SessionCard";
 
 export default function DashboardPage() {
   const router = useRouter();
   const { data: session } = useSession();
   const [activeRequests, setActiveRequests] = useState<any[]>([]);
   const [incomingMatches, setIncomingMatches] = useState<any[]>([]);
   const [activeSessions, setActiveSessions] = useState<any[]>([]);
   const [mentorOffers, setMentorOffers] = useState<any[]>([]);
   
   const user = session?.user as any;
 
   useEffect(() => {
     if (session?.user) {
       getMyOpenRequests().then(setActiveRequests);
       getIncomingMatches().then(setIncomingMatches);
       getActiveSessions().then(setActiveSessions);
       getMentorPendingOffers().then(setMentorOffers);
     }
   }, [session]);
 
   const stats = [
     { name: "Sessions Given", value: user?.sessionsGiven || 0, icon: GraduationCap },
     { name: "Sessions Received", value: user?.sessionsReceived || 0, icon: BookOpen },
     { name: "Reputation", value: user?.reputation || 0, icon: Award },
   ];
 
   return (
     <div className="min-h-screen pt-24 pb-12 px-4 space-y-12">
       
       <div className="max-w-4xl mx-auto space-y-12">
         {/* Welcome Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="space-y-1">
             <h1 className="text-4xl font-black tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
             <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Bridging skill gaps today</p>
           </div>
           <div className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2">
             <Zap className="w-5 h-5" /> SkillBridge Pro
           </div>
         </div>
 
         {/* Quick Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {stats.map((stat) => (
             <div key={stat.name} className="glass p-6 rounded-2xl border border-white/5 space-y-2 group hover:border-primary/20 transition-all">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.name}</p>
               <div className="flex items-center justify-between">
                 <span className="text-3xl font-black">{stat.value}</span>
                 <stat.icon className="w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
               </div>
             </div>
           ))}
         </div>
 
         {/* 1. Active Sessions Section */}
         {activeSessions.length > 0 && (
           <div className="space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-widest">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> In-Progress Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSessions.map(session => (
                  <SessionCard key={session.id} session={session} userId={user.id} />
                ))}
              </div>
           </div>
         )}
 
         {/* 2. Mentor Sent Offers Section */}
         {mentorOffers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="w-5 h-5 text-yellow-400" /> Offers Sent
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentorOffers.map(offer => (
                  <div key={offer.id} className="glass p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs uppercase">
                          {offer.request.user.name[0]}
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Waiting for Learner</p>
                          <p className="text-xs font-bold">{offer.request.user.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">{offer.request.topic}</p>
                      <p className="text-[10px] text-muted-foreground italic line-clamp-1">"{offer.request.context}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
 
         {/* 3. Mentoring Opportunities Section */}
         {incomingMatches.length > 0 && (
           <div className="space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-widest">
                <GraduationCap className="w-5 h-5 text-purple-400" /> Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingMatches.map(match => (
                  <div key={match.id} className="premium-gradient p-[1px] rounded-2xl overflow-hidden">
                    <div className="bg-zinc-950 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold">
                              {match.request.user.name[0]}
                            </div>
                            <div>
                               <p className="text-sm font-bold">{match.request.user.name}</p>
                               <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{match.request.topic}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-primary uppercase">Match</p>
                            <p className="text-lg font-black">{(match.score).toFixed(0)}%</p>
                         </div>
                      </div>
                      <p className="text-[11px] italic text-muted-foreground line-clamp-2 leading-relaxed">
                        "{match.request.context}"
                      </p>
                      <div className="flex gap-2">
                         <Button 
                           className="flex-1 h-10 text-xs font-black uppercase tracking-widest" 
                           variant="premium"
                           onClick={() => respondToMatch(match.id, "ACCEPTED").then(() => router.refresh())}
                         >
                           Accept
                         </Button>
                         <Button 
                           className="flex-1 h-10 text-xs font-black uppercase tracking-widest" 
                           variant="ghost"
                           onClick={async (e) => {
                             const btn = e.currentTarget;
                             const originalText = btn.innerText;
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
 
         {/* 4. Pending Broadcasts Section */}
         <div className="space-y-4">
           <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-widest">
             <Radio className="w-5 h-5 text-primary animate-pulse" /> My Broadcasts
           </h2>
           
           {activeRequests.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {activeRequests.map(req => (
                 <div key={req.id} className="glass p-6 rounded-2xl border border-primary/10 space-y-4 relative overflow-hidden group shadow-lg shadow-primary/5">
                   <div className="absolute top-0 right-0 p-3">
                     <div className="flex items-center gap-2 text-[8px] font-black uppercase text-primary tracking-widest px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
                       <span className="w-1 h-1 rounded-full bg-primary animate-ping" /> Scanning
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                       <Tag className="w-3 h-3 text-primary" /> {req.topic}
                     </div>
                     <p className="text-xs font-medium leading-relaxed italic line-clamp-2 text-zinc-300">
                       "{req.context}"
                     </p>
                     
                     <MatchNotification requestId={req.id} />
                   </div>
                   
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                       <Clock className="w-3 h-3" /> {req.duration}m
                     </div>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-8 text-[10px] uppercase font-black tracking-widest text-red-400 hover:text-red-500 hover:bg-red-500/10"
                       onClick={async (e) => {
                         const btn = e.currentTarget;
                         const originalText = btn.innerText;
                         btn.disabled = true;
                         btn.innerText = "Closing...";
                         
                         const res = await cancelHelpRequest(req.id);
                         if (res.success) {
                           setActiveRequests(prev => prev.filter(r => r.id !== req.id));
                           router.refresh();
                         } else {
                           btn.disabled = false;
                           btn.innerText = originalText;
                           alert("Failed to cancel.");
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
             <div className="glass p-12 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 min-h-[250px]">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/20">
                 <Radio className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-lg font-bold">No live broadcasts</h3>
                 <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                   Need help? Start a new session broadcast to find experts.
                 </p>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }

 
