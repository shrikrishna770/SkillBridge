"use client";
 
 import { useState } from "react";
 import Link from "next/link";
 import { ChevronRight, Sparkles, X, FileText } from "lucide-react";
 import { Button } from "@/components/ui/Button";
 import { DashboardTimer } from "./DashboardTimer";
 import { motion, AnimatePresence } from "framer-motion";
 
 interface SessionCardProps {
   session: any;
   userId: string;
 }
 
 export function SessionCard({ session, userId }: SessionCardProps) {
   const [isExpired, setIsExpired] = useState(new Date(session.endTime).getTime() <= Date.now());
   const [showSummary, setShowSummary] = useState(false);
   const isMentor = session.mentorId === userId;
   const partner = isMentor ? session.learner : session.mentor;
 
   return (
     <>
       {/* Detailed Report Modal */}
       <AnimatePresence>
         {showSummary && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowSummary(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-500" />
               <button 
                 onClick={() => setShowSummary(false)}
                 className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
               >
                 <X className="w-6 h-6 text-muted-foreground" />
               </button>
               
               <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                 <div className="space-y-2">
                   <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-2">
                     <Sparkles className="w-3 h-3 inline mr-1" /> AI Session Analysis
                   </div>
                   <h3 className="text-3xl font-bold">{session.request.topic}</h3>
                 </div>
                 
                 <div className="prose prose-invert max-w-none">
                   <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed font-medium">
                     {session.summary || "Generating summary insights..."}
                   </div>
                 </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 justify-end">
                 <Button variant="ghost" onClick={() => setShowSummary(false)}>Close</Button>
                 <Button variant="premium" onClick={() => setShowSummary(false)}>Great, Thanks!</Button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
 
       <div className={`glass p-6 rounded-2xl border transition-all duration-500 space-y-4 relative overflow-hidden group ${
         isExpired ? "opacity-100 border-white/5" : "border-primary/20 shadow-lg shadow-primary/5"
       }`}>
         <div className="absolute top-0 right-0 p-2">
           <DashboardTimer 
             endTime={session.endTime} 
             onExpire={() => setIsExpired(true)} 
           />
         </div>
         
         <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-all ${
             isExpired ? "bg-zinc-800" : "premium-gradient"
           }`}>
             {partner?.name?.[0] || "?"}
           </div>
           <div>
             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
               {isMentor ? "Mentoring" : "Learning from"}
             </p>
             <p className="font-bold text-sm tracking-tight">{partner?.name || "Unknown User"}</p>
           </div>
         </div>
 
         <div className="space-y-1">
           <p className={`text-xs font-bold transition-colors ${isExpired ? "text-zinc-400" : "text-primary"}`}>
             {session.request.topic}
           </p>
           <p className="text-[11px] italic line-clamp-1 text-muted-foreground">"{session.request.context}"</p>
         </div>
 
         {/* Summary Preview (Only if session is completed/summary exists) */}
         {session.summary && (
           <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest">
                 <Sparkles className="w-3 h-3" /> AI Summary Preview
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                {session.summary}
              </p>
           </div>
         )}
 
         {/* Action Buttons */}
         {!isExpired ? (
           <Link href={`/session/${session.id}`} className="w-full block">
             <Button className="w-full h-11 font-bold gap-2 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/20" variant="premium">
               Enter Room <ChevronRight className="w-4 h-4" />
             </Button>
           </Link>
         ) : (
           <div className="pt-2">
             {session.summary ? (
                <Button 
                  className="w-full h-11 font-black text-[11px] uppercase gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl shadow-sm"
                  onClick={() => setShowSummary(true)}
                >
                  <FileText className="w-4 h-4 text-primary" /> View Session Insights
                </Button>
             ) : (
                <div className="w-full h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-muted-foreground uppercase tracking-widest gap-2">
                  Session Concluded
                </div>
             )}
           </div>
         )}
       </div>
     </>
   );
 }
