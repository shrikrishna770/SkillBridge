"use client";

import { motion } from "framer-motion";
import { Zap, Users, MessageSquare, Award, ArrowRight, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const STEPS = [
  {
    title: "1. Broadcast a Request",
    desc: "Stuck on a tricky bug or need architecture advice? Post a 140-char request in seconds. Our AI immediately starts matching you with available experts.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10"
  },
  {
    title: "2. Get an Instant Match",
    desc: "Our intelligent matching engine pairs you with a mentor who has exactly the expertise you need and is ready to jump on a call right now.",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    title: "3. Bridge the Gap",
    desc: "Join a secure, private room with integrated video and a shared notepad. Get your problem solved in 20-45 minutes and move on with your day.",
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    title: "4. Build your Reputation",
    desc: "Review your mentor and earn reputataion points. The more you help, the higher your rank in the SkillBridge community.",
    icon: Award,
    color: "text-green-400",
    bg: "bg-green-400/10"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6 mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight"
        >
          Learning, <span className="premium-text-gradient">Accelerated.</span>
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          SkillBridge is the world's first real-time peer-to-peer mentoring platform. No long courses, no wait times—just instant knowledge transfer.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
        
        <div className="space-y-24">
          {STEPS.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h2 className="text-3xl font-bold">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {step.desc}
                </p>
              </div>
              <div className="flex-1">
                 <div className="aspect-video glass rounded-[2.5rem] border border-white/5 bg-white/5 flex items-center justify-center p-8">
                    <div className="w-full h-full rounded-2xl bg-zinc-950/50 border border-white/5 flex items-center justify-center">
                       <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/30 italic">Interactive Demo Preview</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-32">
        <div className="glass p-12 rounded-[3rem] border border-white/5 text-center space-y-8">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-3xl font-bold">Safe, Secure & Professional</h2>
          <p className="text-muted-foreground">
            Every session is encrypted, and our AI monitors for quality and safety. Our reputation system ensures you only connect with vetted, helpful professionals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/requests/new">
              <Button size="lg" className="rounded-2xl h-14 px-8">Try it Now</Button>
            </Link>
            <Link href="/safety-center">
              <Button variant="ghost" size="lg" className="rounded-2xl h-14 px-8">Safety Details</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
