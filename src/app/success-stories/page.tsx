"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Quote, ArrowRight, TrendingUp, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const STORIES = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Fullstack Developer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    topic: "System Design",
    quote: "I was struggling with microservices architecture for weeks. One 30-minute session with a senior mentor cleared up all my doubts. It was a game-changer for my project.",
    stat: "Level 12 Mentor",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Designer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    topic: "Figma Auto-layout",
    quote: "The peer-to-peer nature of SkillBridge makes learning so much less intimidating. I learned more in one hour here than in ten hours of YouTube tutorials.",
    stat: "50+ Sessions",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Backend Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    topic: "PostgreSQL Indexing",
    quote: "Sharing my knowledge has helped me solidify my own understanding. SkillBridge isn't just about learning; it's about building a collective intelligence.",
    stat: "High Reputation",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    role: "UI Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    topic: "Framer Motion",
    quote: "I found an amazing mentor who helped me polish my portfolio animations. I landed my dream job at a top-tier design agency two weeks later!",
    stat: "Dream Job Landed",
    color: "from-green-500/20 to-emerald-500/20"
  }
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4" /> Real Stories, Real Impact
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          Bridging Dreams with <br />
          <span className="premium-text-gradient">Real Expertise</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          See how learners and mentors around the world are mastering new skills and accelerating their careers through 1-on-1 collaboration.
        </motion.p>
      </section>

      {/* Stats Quick View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Hours Learned", val: "12,400+", icon: TrendingUp },
            { label: "Active Mentors", val: "2,800+", icon: Users },
            { label: "Matches Made", val: "45,000+", icon: Heart },
            { label: "Success Rate", val: "98.4%", icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/5 text-center space-y-2"
            >
              <stat.icon className="w-5 h-5 mx-auto text-primary" />
              <div className="text-2xl font-bold">{stat.val}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${story.color} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative glass p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-8 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 p-1 bg-white/5">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-tighter">
                    {story.topic}
                  </div>
                </div>

                <div className="relative flex-1">
                  <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 -z-10" />
                  <p className="text-lg leading-relaxed text-zinc-300 italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <Star className="w-4 h-4 fill-primary" /> {story.stat}
                  </div>
                  <Button variant="ghost" size="sm" className="group/btn gap-2 text-xs">
                    Read Case Study <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 mt-32 text-center">
        <div className="premium-gradient p-[1px] rounded-[3rem]">
          <div className="bg-zinc-950 rounded-[2.9rem] py-20 px-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight relative z-10">
              Your next breakthrough is <br /> <span className="premium-text-gradient">one bridge away.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto relative z-10 text-lg">
              Join thousands of professionals already growing their skills through real human connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              <Link href="/requests/new">
                <Button size="lg" className="h-14 px-10 text-lg rounded-2xl">Start Your Journey</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="lg" className="h-14 px-10 text-lg rounded-2xl gap-2">
                  Explore Community <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
