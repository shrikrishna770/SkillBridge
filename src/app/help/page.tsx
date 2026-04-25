"use client";

import { motion } from "framer-motion";
import { Search, HelpCircle, MessageSquare, Book, LifeBuoy, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FAQS = [
  {
    q: "How do I become a mentor?",
    a: "Simply complete your profile and add skills you're proficient in under the 'Teaching' section. You'll automatically start receiving match requests."
  },
  {
    q: "Is there a cost for sessions?",
    a: "SkillBridge is currently free during our beta phase. We use a reputation system rather than a payment system to reward helpfulness."
  },
  {
    q: "What if I can't find a mentor for my rare skill?",
    a: "Our AI 'broadcasts' your request to users with related skills. Often, someone with adjacent knowledge can still help bridge the gap."
  },
  {
    q: "How long are the sessions?",
    a: "Sessions are typically 20, 30, or 45 minutes long, depending on what you select when creating your request."
  }
];

export default function HelpPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 text-center space-y-8 mb-20">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          How can we <span className="premium-text-gradient">help?</span>
        </motion.h1>
        
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative glass p-2 rounded-3xl border border-white/10 flex items-center gap-4">
             <Search className="ml-4 w-6 h-6 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search for articles, guides, or troubleshooting..." 
               className="flex-1 bg-transparent border-none outline-none py-4 text-lg"
             />
             <Button className="rounded-2xl px-8 h-14">Search</Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          { title: "Getting Started", icon: LifeBuoy, desc: "New to SkillBridge? Learn the basics here." },
          { title: "Mentoring Guide", icon: Book, desc: "Best practices for being a great mentor." },
          { title: "Troubleshooting", icon: FileText, desc: "Fixing technical issues with video or audio." }
        ].map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-4 cursor-pointer hover:bg-white/5 transition-all text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <cat.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{cat.title}</h3>
            <p className="text-sm text-muted-foreground">{cat.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 space-y-12">
        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-primary" /> Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              className="glass p-6 rounded-2xl border border-white/5 space-y-2"
            >
              <h4 className="font-bold text-lg">{faq.q}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 text-center space-y-6">
          <h3 className="text-2xl font-bold">Still have questions?</h3>
          <p className="text-muted-foreground">Our support team is available 24/7 to help you bridge the gap.</p>
          <Button variant="premium" size="lg" className="rounded-2xl h-14 px-10 gap-2">
            <MessageSquare className="w-5 h-5" /> Chat with Support
          </Button>
        </div>
      </section>
    </div>
  );
}
