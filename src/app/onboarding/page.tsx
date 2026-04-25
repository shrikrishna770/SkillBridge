"use client";

import { SkillTagging } from "@/components/profile/SkillTagging";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    // In a real app, save skills to DB first
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-16"
      >
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold mb-2">
            <Sparkles className="text-primary w-3 h-3" /> Step 2: Set your Skills
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Tell us what you <span className="text-primary italic">master</span> and what you <span className="text-primary underline decoration-2 underline-offset-4">need.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            SkillBridge uses AI to match you with peers in seconds. The more accurate your skills, the better the matches.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-2xl font-bold">20m</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Time Cap</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Free</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">No Cost</div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <SkillTagging />
          <p className="text-center text-xs text-muted-foreground mt-6">
            Press &quot;Save Profile&quot; to enter your dashboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
