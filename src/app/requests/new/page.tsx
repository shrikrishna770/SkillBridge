"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SKILL_TAGS } from "@/lib/constants";
import { createHelpRequest } from "@/actions/requests";
import { 
  Zap, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Search,
  Timer
} from "lucide-react";

const URGENCY_OPTIONS = [
  { id: "TODAY", label: "Today", icon: Zap, color: "text-yellow-400" },
  { id: "THIS_WEEK", label: "This Week", icon: Clock, color: "text-blue-400" },
  { id: "ANYTIME", label: "Anytime", icon: CheckCircle2, color: "text-green-400" },
];

const DURATION_OPTIONS = [
  { val: 20, label: "20 min", sub: "Quick fix" },
  { val: 30, label: "30 min", sub: "Deep dive" },
  { val: 45, label: "45 min", sub: "Intensive" },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [urgency, setUrgency] = useState("TODAY");
  const [duration, setDuration] = useState(30);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [customAvailability, setCustomAvailability] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = SKILL_TAGS.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8);

  const handleCreate = async () => {
    setIsLoading(true);
    setError("");
    
    const res = await createHelpRequest({
      topic,
      context,
      urgency,
      duration
    });

    if (res.success) {
      setIsSuccess(true);
      setIsLoading(false);
      window.location.href = "/dashboard#broadcasts";
    } else {
      setError(res.error || "Failed to post request");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl relative">
        
        {/* Step Indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 rounded-full transition-all duration-500 ${
                step >= s ? "w-12 premium-gradient" : "w-4 bg-white/10"
              }`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass p-8 rounded-3xl border border-white/10 space-y-8"
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">What do you need help with?</h1>
                <p className="text-muted-foreground">Pick a topic to find your perfect match.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search topics (e.g. React, Python...)"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setTopic(tag); setStep(2); }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        topic === tag ? "premium-gradient text-white" : "glass hover:bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 rounded-3xl border border-white/10 space-y-8"
            >
              <div className="space-y-2 text-center">
                <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
                  {topic}
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Add a quick note</h2>
                <p className="text-muted-foreground">Explain briefly where you're stuck (Max 140 chars).</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    autoFocus
                    maxLength={140}
                    placeholder="e.g. Stuck on dynamic programming — knapsack problem"
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary transition-all resize-none italic"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground tabular-nums">
                    {context.length} / 140
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-[2]" onClick={() => setStep(3)} disabled={!context.trim()}>
                    Next Step <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border border-white/10 space-y-8"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Final Details</h2>
                <p className="text-muted-foreground">Select urgency and session duration.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" /> Urgency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {URGENCY_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setUrgency(opt.id)}
                        className={`p-3 rounded-2xl border transition-all text-center space-y-2 ${
                          urgency === opt.id 
                            ? "bg-white/10 border-white/20 shadow-lg" 
                            : "bg-transparent border-transparent hover:bg-white/5"
                        }`}
                      >
                        <opt.icon className={`mx-auto w-5 h-5 ${opt.color}`} />
                        <span className="block text-xs font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Conditional Scheduling Sections */}
                  <AnimatePresence mode="wait">
                    {urgency === "THIS_WEEK" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3"
                      >
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Select Available Days</p>
                        <div className="flex flex-wrap gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = (preferredDays as string[]) || [];
                                setPreferredDays(days.includes(day) ? days.filter(d => d !== day) : [...days, day]);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                (preferredDays as string[])?.includes(day)
                                  ? "bg-primary border-primary text-white"
                                  : "bg-black/20 border-white/10 text-muted-foreground hover:border-white/30"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {urgency === "ANYTIME" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3"
                      >
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Availability Notes</p>
                        <input 
                          type="text"
                          placeholder="e.g. Free on weekends / Mornings only"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-green-400/50"
                          value={customAvailability}
                          onChange={(e) => setCustomAvailability(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Timer className="w-3 h-3 text-primary" /> Preferred Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATION_OPTIONS.map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setDuration(opt.val)}
                        className={`p-3 rounded-2xl border transition-all text-center ${
                          duration === opt.val 
                            ? "bg-primary/10 border-primary/40 text-primary" 
                            : "bg-transparent border-transparent hover:bg-white/5 text-muted-foreground"
                        }`}
                      >
                        <span className="block text-sm font-bold">{opt.val}m</span>
                        <span className="block text-[10px]">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs text-center">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                    <Button 
                      variant="premium" 
                      className="flex-[2] h-14" 
                      onClick={handleCreate}
                      disabled={isLoading || isSuccess}
                    >
                      {isSuccess ? "Confirmed" : isLoading ? "Broadcasting..." : "Broadcast Request"} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
