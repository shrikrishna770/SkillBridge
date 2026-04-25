"use client";

import { motion } from "framer-motion";
import { Scale, Heart, ShieldAlert, Sparkles, MessageSquare, BookOpen } from "lucide-react";

const RULES = [
  {
    title: "Respect the Bridge",
    desc: "Every interaction should be professional and kind. We have zero tolerance for harassment, discrimination, or hate speech.",
    icon: Heart,
    color: "text-red-400"
  },
  {
    title: "Knowledge Integrity",
    desc: "Only offer expertise in areas you truly understand. If you don't know the answer, be honest—don't mislead your peers.",
    icon: BookOpen,
    color: "text-blue-400"
  },
  {
    title: "Professional Conduct",
    desc: "Stay on topic during sessions. SkillBridge is for learning and problem-solving, not for social networking or solicitation.",
    icon: MessageSquare,
    color: "text-purple-400"
  },
  {
    title: "Data Privacy",
    desc: "Never record sessions without explicit consent. Do not share personal contact information; keep communication on the platform.",
    icon: ShieldAlert,
    color: "text-orange-400"
  }
];

export default function CommunityRulesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6 mb-20">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight"
        >
          Community <span className="premium-text-gradient">Guidelines</span>
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our rules are designed to ensure SkillBridge remains a safe, productive, and respectful environment for everyone.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RULES.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center`}>
                <rule.icon className={`w-6 h-6 ${rule.color}`} />
              </div>
              <h3 className="text-2xl font-bold">{rule.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {rule.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 glass rounded-[2.5rem] border border-white/5 bg-primary/5 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-primary">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Enforcement</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Violating these rules may result in temporary suspension or permanent removal from the platform. We use AI and human moderation to keep the community safe.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
