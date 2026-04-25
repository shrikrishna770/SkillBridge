
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DashboardTimer } from "./DashboardTimer";

interface SessionCardProps {
  session: any;
  userId: string;
}

export function SessionCard({ session, userId }: SessionCardProps) {
  const [isExpired, setIsExpired] = useState(new Date(session.endTime).getTime() <= Date.now());
  const isMentor = session.mentorId === userId;
  const partner = isMentor ? session.learner : session.mentor;

  return (
    <div className={`glass p-6 rounded-2xl border transition-all duration-500 space-y-4 relative overflow-hidden ${
      isExpired ? "opacity-60 grayscale-[0.5] border-white/5" : "border-primary/20 shadow-lg shadow-primary/5"
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
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
            {isMentor ? "Mentoring" : "Learning from"}
          </p>
          <p className="font-bold">{partner?.name || "Unknown User"}</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className={`text-xs font-bold transition-colors ${isExpired ? "text-zinc-500" : "text-primary"}`}>
          {session.request.topic}
        </p>
        <p className="text-sm italic line-clamp-1 text-muted-foreground">"{session.request.context}"</p>
      </div>

      {!isExpired ? (
        <Link href={`/session/${session.id}`} className="w-full block">
          <Button className="w-full h-11 font-bold gap-2" variant="premium">
            Enter Session Space <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <div className="w-full h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-muted-foreground uppercase tracking-widest gap-2">
          Session Concluded
        </div>
      )}
    </div>
  );
}
