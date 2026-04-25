"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { 
  User, MessageSquare, Zap, LayoutDashboard, 
  Settings, Clock, Tag, Sparkles, ArrowRight,
  TrendingUp, Star, ShieldCheck, Heart
} from "lucide-react";
import { getMyOpenRequests } from "@/actions/requests";
import { getActiveSessions } from "@/actions/matches";
import { getUserMetrics } from "@/actions/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const user = session?.user as any;

  useEffect(() => {
    if (session?.user) {
      getMyOpenRequests().then(setActiveRequests);
      getActiveSessions().then(setActiveSessions);
      getUserMetrics().then(setMetrics);
    }
  }, [session]);

  const stats = [
    { name: "Taught", value: metrics?.sessionsGiven || 0 },
    { name: "Learned", value: metrics?.sessionsReceived || 0 },
  ];

  if (status === "loading") return null;

  // LOGGED OUT LANDING PAGE
  if (!session) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <Sparkles className="w-4 h-4" /> The Future of Learning is Here
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            Bridge Your <br />
            <span className="premium-text-gradient">Skill Gap Instanty.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Connect with industry experts for live 1-on-1 mentoring sessions. No courses, no fluff—just real-time problem solving.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="h-16 px-10 text-lg rounded-2xl" onClick={() => router.push("/login")}>Get Started for Free</Button>
            <Button variant="ghost" size="lg" className="h-16 px-10 text-lg rounded-2xl gap-2" onClick={() => router.push("/how-it-works")}>
              How it Works <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto opacity-50"
          >
            {['Expert Mentors', 'Real-time Video', 'Secure Sessions', 'Peer Powered'].map((text) => (
              <div key={text} className="px-6 py-4 glass rounded-2xl border border-white/5 text-xs font-extrabold uppercase tracking-widest">
                {text}
              </div>
            ))}
          </motion.div>
        </section>

        {/* Success Stories Teaser */}
        <section className="py-32 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Success Stories</h2>
              <p className="text-muted-foreground text-lg max-w-md">See how others are accelerating their career through SkillBridge.</p>
            </div>
            <Link href="/success-stories">
              <Button variant="ghost" className="gap-2">View All Stories <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20" />
                  <div>
                    <div className="h-4 w-24 bg-white/10 rounded-full mb-1" />
                    <div className="h-3 w-16 bg-white/5 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded-full" />
                  <div className="h-4 w-[80%] bg-white/10 rounded-full" />
                  <div className="h-4 w-[90%] bg-white/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-8 glass rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-primary" />
              </div>
              <h2 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0] || "Friend"}!
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                You have {activeRequests.length} active help request{activeRequests.length !== 1 && 's'} and {activeSessions.length} upcoming session{activeSessions.length !== 1 && 's'}.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => router.push("/requests/new")} size="lg" variant="premium" className="px-8 rounded-2xl">Start New Bridge</Button>
                <Button onClick={() => router.push("/dashboard")} size="lg" variant="ghost" className="px-8 rounded-2xl border border-white/5">My Dashboard</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Current Activity
              </h3>
              
              {activeSessions.length > 0 ? (
                activeSessions.map((s) => (
                  <div key={s.id} className="p-6 glass rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white font-bold">
                        {s.request.topic.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{s.request.topic}</h4>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                          {s.mentorId === user.id ? `Learner: ${s.learner.name}` : `Mentor: ${s.mentor.name}`}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => router.push(`/session/${s.id}`)}>Enter Room</Button>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center glass rounded-[2.5rem] border border-white/5 text-muted-foreground flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-white/5">
                    <Zap className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-lg">No active sessions. <br /> Need help with something?</p>
                  <Button variant="link" onClick={() => router.push("/requests/new")} className="text-primary font-bold">Broadcast a Request</Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 glass rounded-[2.5rem] border border-white/5 space-y-8">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-primary" /> Personal Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.name} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{stat.name}</div>
                  </div>
                ))}
              </div>
              <div className="p-6 premium-gradient rounded-2xl text-center text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl font-bold relative z-10">{metrics?.reputation?.toFixed(1) || "5.0"}</div>
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 relative z-10">Skill Reputation</div>
              </div>
            </div>

            <div className="p-8 glass rounded-[2.5rem] border border-white/5">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Resources
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Success Stories", href: "/success-stories", icon: Heart },
                  { name: "How it Works", href: "/how-it-works", icon: TrendingUp },
                  { name: "Safety Center", href: "/safety-center", icon: ShieldCheck },
                  { name: "Community Rules", href: "/community-rules", icon: Star },
                ].map((item) => (
                  <Button 
                    key={item.name}
                    variant="ghost" 
                    onClick={() => router.push(item.href)} 
                    className="w-full justify-start h-14 px-4 rounded-xl hover:bg-white/5 group gap-4 border border-transparent hover:border-white/5 transition-all text-sm font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
