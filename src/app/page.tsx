"use client";

import { motion } from "framer-motion";
import { HelpRequestForm } from "@/components/requests/HelpRequestForm";
import { SkillTagging } from "@/components/profile/SkillTagging";
import { SessionRoom } from "@/components/session/SessionRoom";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { User, MessageSquare, Zap, LayoutDashboard, Settings } from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"dashboard" | "profile" | "request" | "session">("dashboard");

  const views = {
    dashboard: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-8 glass rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, Alex!</h2>
              <p className="text-muted-foreground mb-6">You have 1 active help request and 2 upcoming sessions.</p>
              <Button onClick={() => setView("request")} variant="premium">Request New Help</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Recent Activity
              </h3>
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-card rounded-xl border border-border flex justify-between items-center hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center text-white font-bold">
                      {i === 1 ? "JS" : "DS"}
                    </div>
                    <div>
                      <h4 className="font-medium">{i === 1 ? "JavaScript Promises" : "Data Structures - Trees"}</h4>
                      <p className="text-xs text-muted-foreground">{i === 1 ? "Hepler: Sarah Miller" : "Learner: John Doe"}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setView("session")}>View Room</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> My Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-xl font-bold">12</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Taught</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-xl font-bold">5</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Learned</div>
                </div>
              </div>
              <div className="mt-4 p-3 premium-gradient rounded-lg text-center text-white">
                <div className="text-xl font-bold">4.9/5</div>
                <div className="text-[10px] uppercase opacity-80">Reputation</div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="ghost" onClick={() => setView("profile")} className="w-full justify-start text-sm">
                  <User className="w-4 h-4 mr-2" /> Update Skills
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Settings className="w-4 h-4 mr-2" /> Preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    profile: <SkillTagging />,
    request: <HelpRequestForm />,
    session: <SessionRoom sessionId="mock-session" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-4 mb-12 overflow-x-auto pb-2">
        <button 
          onClick={() => setView("dashboard")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            view === "dashboard" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setView("profile")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            view === "profile" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Profile
        </button>
        <button 
          onClick={() => setView("request")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            view === "request" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          New Request
        </button>
      </nav>

      <motion.div
        key={view}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {views[view]}
      </motion.div>
    </div>
  );
}
