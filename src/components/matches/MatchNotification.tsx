
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Check, X, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getMatchesForRequest, respondToMatch } from "@/actions/matches";

interface MatchNotificationProps {
  requestId: string;
}

export function MatchNotification({ requestId }: MatchNotificationProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [requestId]);

  const loadMatches = async () => {
    setIsLoading(true);
    const res = await getMatchesForRequest(requestId);
    setMatches(res.filter((m: any) => m.status === "PENDING"));
    setIsLoading(false);
  };

  const handleResponse = async (matchId: string, response: "ACCEPTED" | "DECLINED") => {
    const res = await respondToMatch(matchId, response);
    if (res.success) {
      loadMatches();
    }
  };

  if (isLoading || matches.length === 0) return null;

  const currentMatch = matches[0]; // Show the best one first

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="premium-gradient p-[1px] rounded-2xl shadow-xl shadow-primary/20 overflow-hidden"
    >
      <div className="bg-black/90 p-5 rounded-[15px] space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                Peak Match Found!
              </h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                AI Match Score: {(currentMatch.score).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="glass p-3 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-lg">
            {currentMatch.mentor.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{currentMatch.mentor.name}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
               <GraduationCap className="w-3 h-3" /> {currentMatch.mentor.college}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
              <Star className="w-3 h-3 fill-yellow-500" /> {currentMatch.mentor.reputation > 50 ? "4.9" : "5.0"}
            </div>
            <p className="text-[9px] text-muted-foreground uppercase">Mentor Rating</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 h-10 text-xs font-bold gap-2" 
            variant="premium"
            onClick={() => handleResponse(currentMatch.id, "ACCEPTED")}
          >
            <Check className="w-4 h-4" /> Accept Match
          </Button>
          <Button 
            className="h-10 px-4 text-xs font-bold" 
            variant="ghost"
            onClick={() => handleResponse(currentMatch.id, "DECLINED")}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
