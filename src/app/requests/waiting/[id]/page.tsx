"use client";
 
 import { useState, useEffect } from "react";
 import { useRouter, useParams } from "next/navigation";
 import { motion } from "framer-motion";
 import { Zap, Clock, AlertCircle, ArrowLeft, Users } from "lucide-react";
 import { Button } from "@/components/ui/Button";
 
 export default function WaitingRoomPage() {
   const router = useRouter();
   const params = useParams();
   const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
 
   useEffect(() => {
     if (timeLeft <= 0) {
       router.push("/requests/no-mentor");
       return;
     }
 
     const timer = setInterval(() => {
       setTimeLeft((prev) => prev - 1);
     }, 1000);
 
     // Simulation: In a real app, you'd poll an API or use Pusher here
     // to check if a mentor has accepted.
 
     return () => clearInterval(timer);
   }, [timeLeft, router]);
 
   const formatTime = (seconds: number) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins}:${secs.toString().padStart(2, "0")}`;
   };
 
   return (
     <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-[#050505]">
       <div className="w-full max-w-lg space-y-8 text-center">
         
         <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse rounded-full" />
            <div className="relative w-24 h-24 rounded-3xl premium-gradient flex items-center justify-center mx-auto shadow-2xl">
               <Zap className="w-12 h-12 text-white animate-bounce" />
            </div>
         </div>
 
         <div className="space-y-3">
           <h1 className="text-4xl font-bold tracking-tight text-white">Broadcasting...</h1>
           <p className="text-muted-foreground text-lg">We are matching your request with top mentors.</p>
         </div>
 
         <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="flex justify-center gap-8">
               <div className="text-center space-y-1">
                 <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Time Left</p>
                 <p className="text-3xl font-mono font-bold text-white tracking-widest">{formatTime(timeLeft)}</p>
               </div>
               <div className="w-[1px] bg-white/10" />
               <div className="text-center space-y-1">
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Status</p>
                 <p className="text-sm font-bold text-green-400 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> Scanning
                 </p>
               </div>
            </div>
 
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 120, ease: "linear" }}
                 className="h-full premium-gradient"
               />
            </div>
 
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mentors are reviewing your context. Stay on this page to join the session immediately once accepted.
            </p>
         </div>
 
         <div className="flex flex-col gap-4">
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4" /> Cancel & Return to Dashboard
            </Button>
         </div>
       </div>
     </div>
   );
 }
