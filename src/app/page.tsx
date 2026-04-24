"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle, Trophy, Users, Zap } from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-10">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-secondary rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-semibold mb-8">
              <span className="premium-gradient w-2 h-2 rounded-full animate-pulse" />
              New course: Advanced React Architecture
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Master the Skills of the <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#ec4899]">
                Digital Frontier
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              SkillBridge is the world&apos;s leading platform for professional skill development.
              Join 2M+ students master technology, business, and design.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="premium" className="group">
                Start Learning Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <PlayCircle className="w-5 h-5" />
                Watch Intro
              </Button>
            </div>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 border-t border-white/5"
          >
            {[
              { icon: Users, label: "2M+", desc: "Active Students" },
              { icon: Trophy, label: "150+", desc: "Expert Mentors" },
              { icon: PlayCircle, label: "500+", desc: "Video Courses" },
              { icon: Zap, label: "98%", desc: "Success Rate" }
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose SkillBridge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Currated Curriculums",
                desc: "Industry-standard paths designed by top engineering teams at FAANG."
              },
              {
                title: "Premium Certification",
                desc: "Get industry-recognized certificates upon completion to boost your career."
              },
              {
                title: "Project-Based Learning",
                desc: "Learn by doing with real-world projects that you can showcase in your portfolio."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl glass text-left hover:border-primary/20 transition-colors">
                <CheckCircle2 className="w-8 h-8 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
