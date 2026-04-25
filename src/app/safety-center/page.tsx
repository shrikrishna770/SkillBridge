"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Flag, UserCheck, PhoneCall } from "lucide-react";

const FEATURES = [
  {
    title: "Secure Communication",
    desc: "All video calls and chats are peer-to-peer encrypted. We never store personal communication data on our servers.",
    icon: Lock
  },
  {
    title: "Anonymous Matching",
    desc: "Choose how much you share. You can learn or teach without revealing your full identity until you feel comfortable.",
    icon: Eye
  },
  {
    title: "Report & Block",
    desc: "Our one-click reporting tool immediately flags suspicious behavior for our safety team to review.",
    icon: Flag
  },
  {
    title: "Identity Verification",
    desc: "Mentors can opt-in to identity verification to earn a 'Verified' badge, building higher trust in the community.",
    icon: UserCheck
  }
];

export default function SafetyCenterPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6 mb-20">
        <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
          <ShieldCheck className="w-8 h-8 text-green-500" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight"
        >
          Safety & <span className="text-green-500">Security</span>
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your safety is our top priority. We've built robust systems to protect your data and your digital experience.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2rem] border border-white/5 space-y-4"
            >
              <f.icon className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 glass p-10 rounded-[3rem] border border-white/5 bg-zinc-950/50 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">Emergency Support</h2>
            <p className="text-muted-foreground">
              If you encounter an immediate safety issue during a live session, use the 'Emergency End' button. This ends the session and automatically opens a report ticket with high priority.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center justify-center gap-2">
              <PhoneCall className="w-5 h-5" /> Contact Safety Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
