"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { SKILL_TAGS, DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { saveOnboardingData } from "@/actions/onboarding";
import { 
  Check, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [college, setCollege] = useState("");
  const [year, setYear] = useState(1);
  const [canTeach, setCanTeach] = useState<string[]>([]);
  const [needHelp, setNeedHelp] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  
  const { update } = useSession();
  const router = useRouter();

  const handleToggleTag = (tag: string, type: 'teach' | 'learn') => {
    if (type === 'teach') {
      if (canTeach.includes(tag)) setCanTeach(canTeach.filter(t => t !== tag));
      else if (canTeach.length < 10) setCanTeach([...canTeach, tag]);
    } else {
      if (needHelp.includes(tag)) setNeedHelp(needHelp.filter(t => t !== tag));
      else if (needHelp.length < 10) setNeedHelp([...needHelp, tag]);
    }
  };

  const handleToggleTime = (day: string, slot: string) => {
    const current = availability[day] || [];
    if (current.includes(slot)) {
      setAvailability({ ...availability, [day]: current.filter(s => s !== slot) });
    } else {
      setAvailability({ ...availability, [day]: [...current, slot] });
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    const res = await saveOnboardingData({
      college,
      year: Number(year),
      canTeach,
      needHelp,
      availability,
      language
    });
    
    if (res.success) {
      await update({ isOnboarded: true });
      router.push("/");
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-4xl relative">
        {/* Progress Bar */}
        <div className="absolute -top-12 left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full premium-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-3xl border border-white/5 space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Tell us about yourself</h1>
                <p className="text-muted-foreground">Start by sharing your academic home.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" /> College / University
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="E.g. Stanford University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Academic Year
                  </label>
                  <select
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none appearance-none"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(y => (
                      <option key={y} value={y} className="bg-zinc-900">Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Button size="lg" className="flex-1" onClick={nextStep} disabled={!college}>
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="ghost" onClick={handleFinish}>
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-3xl border border-white/5 space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Your Expertise</h1>
                <p className="text-muted-foreground">Select up to 10 topics you can teach confidently.</p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-2xl border border-white/5">
                {SKILL_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag, 'teach')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      canTeach.includes(tag) 
                        ? 'premium-gradient text-white shadow-lg' 
                        : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={prevStep}>
                    <ChevronLeft className="mr-2 w-5 h-5" /> Back
                  </Button>
                  <Button variant="ghost" onClick={nextStep}>
                    Skip
                  </Button>
                </div>
                <Button size="lg" onClick={nextStep} disabled={canTeach.length === 0}>
                   Next Step <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-3xl border border-white/5 space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">What you want to learn</h1>
                <p className="text-muted-foreground">Select up to 10 topics you're struggling with.</p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-2xl border border-white/5">
                {SKILL_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag, 'learn')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      needHelp.includes(tag) 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={prevStep}>
                    <ChevronLeft className="mr-2 w-5 h-5" /> Back
                  </Button>
                  <Button variant="ghost" onClick={nextStep}>
                    Skip
                  </Button>
                </div>
                <Button size="lg" onClick={nextStep} disabled={needHelp.length === 0}>
                  Next Step <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-3xl border border-white/5 space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Availability & Language</h1>
                <p className="text-muted-foreground">When are you available for sessions?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Weekly Schedule
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto p-2">
                    {DAYS_OF_WEEK.map(day => (
                      <div key={day} className="space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{day}</span>
                        <div className="flex flex-wrap gap-1">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              onClick={() => handleToggleTime(day, slot)}
                              className={`px-2 py-1 rounded-md text-[10px] transition-all ${
                                (availability[day] || []).includes(slot)
                                  ? 'bg-primary/20 text-primary border border-primary/30'
                                  : 'bg-white/5 text-muted-foreground border border-transparent'
                              }`}
                            >
                              {slot.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Preferred Language
                  </label>
                  <select
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {["English", "Hindi", "Spanish", "French", "German"].map(l => (
                      <option key={l} value={l} className="bg-zinc-900">{l}</option>
                    ))}
                  </select>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" /> Ready to Launch?
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your profile will be used to match you with peers. You can always update these settings from your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={prevStep}>
                    <ChevronLeft className="mr-2 w-5 h-5" /> Back
                  </Button>
                  <Button variant="ghost" onClick={handleFinish}>
                    Skip
                  </Button>
                </div>
                <Button size="lg" variant="premium" onClick={handleFinish} disabled={isLoading}>
                  {isLoading ? "Saving Profile..." : "Complete Setup"} <Check className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
