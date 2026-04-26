"use client";
 
 import { useRouter } from "next/navigation";
 import { motion } from "framer-motion";
 import { Users, ArrowRight, MessageSquare, Clock } from "lucide-react";
 import { Button } from "@/components/ui/Button";
 
 export default function NoMentorPage() {
   const router = useRouter();
 
   return (
     <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-[#050505]">
       <div className="w-full max-w-lg space-y-10 text-center">
         
         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
            <Clock className="w-10 h-10 text-muted-foreground" />
         </div>
 
         <div className="space-y-4">
           <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
             All mentors are currently <br /> <span className="premium-text-gradient">in active sessions.</span>
           </h1>
           <p className="text-muted-foreground text-lg leading-relaxed">
             We couldn't find an available mentor right now. Your broadcast is still active on the community dashboard, and you'll receive a notification as soon as someone accepts.
           </p>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-3 text-left">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Users className="w-4 h-4 text-primary" />
               </div>
               <h3 className="font-bold text-sm">Dashboard</h3>
               <p className="text-xs text-muted-foreground">Keep an eye on your activity feed for updates.</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-3 text-left">
               <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                 <MessageSquare className="w-4 h-4 text-green-500" />
               </div>
               <h3 className="font-bold text-sm">Try Detailed</h3>
               <p className="text-xs text-muted-foreground">Try re-broadcasting with more context later.</p>
            </div>
         </div>
 
         <div className="pt-4">
            <Button size="lg" className="w-full h-14 rounded-2xl font-bold gap-2" variant="premium" onClick={() => router.push("/dashboard")}>
              Return to Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
         </div>
       </div>
     </div>
   );
 }
