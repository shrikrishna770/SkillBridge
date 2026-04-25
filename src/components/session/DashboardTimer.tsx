
"use client";

import { useEffect, useState } from "react";
import { Timer as TimerIcon } from "lucide-react";

interface DashboardTimerProps {
  endTime: string | Date;
  onExpire?: () => void;
}

export function DashboardTimer({ endTime, onExpire }: DashboardTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(endTime).getTime();
    const calculateRemaining = () => {
      const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
      if (remaining === 0 && onExpire) {
        onExpire();
      }
      setTimeLeft(remaining);
    };

    calculateRemaining();
    const timer = setInterval(calculateRemaining, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft === null || timeLeft <= 0) {
    return (
      <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest">
        Expired
      </span>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full font-bold uppercase tracking-widest text-[10px] ${
      timeLeft < 60 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-green-500/10 text-green-500"
    }`}>
      <TimerIcon className="w-3 h-3" />
      <span>{formatTime(timeLeft)} Left</span>
    </div>
  );
}
