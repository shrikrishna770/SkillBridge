"use client";

import { useSession } from "next-auth/react";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { Sparkles, Users, Award, Zap, Clock, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { getMyOpenRequests } from "@/actions/requests";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const user = session?.user as any;

  useEffect(() => {
    if (session?.user) {
      getMyOpenRequests().then(setActiveRequests);
    }
  }, [session]);

  const stats = [
    { name: "Sessions Given", value: user?.sessionsGiven || 0, icon: GraduationCap },
    { name: "Sessions Received", value: user?.sessionsReceived || 0, icon: BookOpen },
    { name: "Reputation", value: user?.reputation || 0, icon: Award },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 space-y-8">
      <DashboardNav />
      
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

        {/* Active Requests Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> My Active Broadcasts
          </h2>
          
          {activeRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRequests.map(req => (
                <div key={req.id} className="glass p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {req.urgency}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <Tag className="w-3 h-3 text-primary" /> {req.topic}
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic line-clamp-2 transition-all">
                      "{req.context}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                      <Clock className="w-3 h-3" /> {req.duration} mins
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                      Expires: {new Date(req.expiresAt).toLocaleDateString()}
                    </span>
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

import { GraduationCap, BookOpen } from "lucide-react";
