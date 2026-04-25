"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SKILL_TAGS, DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { saveOnboardingData } from "@/actions/onboarding";
import { 
  Sparkles, Plus, X, BookOpen, GraduationCap, 
  Clock, Globe, Save, Award, Zap, Star, ShieldCheck, 
  ChevronRight, Calendar
} from "lucide-react";
import { DashboardNav } from "@/components/layout/DashboardNav";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<'learn' | 'teach'>('learn');
  
  // Profile Fields
  const [college, setCollege] = useState("");
  const [year, setYear] = useState(1);
  const [language, setLanguage] = useState("English");
  const [canTeach, setCanTeach] = useState<string[]>([]);
  const [needHelp, setNeedHelp] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setCollege(user.college || "");
      setYear(user.year || 1);
      setLanguage(user.language || "English");
      setCanTeach(user.canTeach || []);
      setNeedHelp(user.needHelp || []);
      setAvailability(user.availability || {});
    }
  }, [session]);

  const handleAddTag = (tag: string) => {
    if (activeTab === 'teach') {
      if (!canTeach.includes(tag) && canTeach.length < 10) setCanTeach([...canTeach, tag]);
    } else {
      if (!needHelp.includes(tag) && needHelp.length < 10) setNeedHelp([...needHelp, tag]);
    }
    setSearch("");
  };

  const handleToggleTime = (day: string, slot: string) => {
    const current = availability[day] || [];
    if (current.includes(slot)) {
      setAvailability({ ...availability, [day]: current.filter(s => s !== slot) });
    } else {
      setAvailability({ ...availability, [day]: [...current, slot] });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus("");
    
    const res = await saveOnboardingData({
      college,
      year: Number(year),
      canTeach,
      needHelp,
      availability,
      language
    });

    if (res.success) {
      await update({ 
        college, 
        year, 
        canTeach, 
        needHelp, 
        availability, 
        language 
      });
      setSaveStatus("Profile saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Error saving profile");
    }
    setIsLoading(false);
  };

  const user = session?.user as any;
  const filteredTags = SKILL_TAGS.filter(tag => 
    tag.toLowerCase().includes(search.toLowerCase()) && 
    !(activeTab === 'teach' ? canTeach : needHelp).includes(tag)
  ).slice(0, 5);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 space-y-8">
      <DashboardNav />
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Brief & Stats */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldCheck className="w-20 h-20" />
             </div>
             
             <div className="space-y-2">
               <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                 {user?.name?.[0]}
               </div>
               <h2 className="text-2xl font-bold pt-2">{user?.name}</h2>
               <p className="text-sm text-muted-foreground">{college || "No College Set"}</p>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Rating</p>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-yellow-500" /> {user?.rating || "5.0"}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Reputation</p>
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <Award className="w-4 h-4" /> {user?.reputation || "0"}
                  </div>
                </div>
             </div>

             <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Sessions Given</span>
                  <span className="font-bold">{user?.sessionsGiven || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Sessions Received</span>
                  <span className="font-bold">{user?.sessionsReceived || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Badges Earned</span>
                  <div className="flex gap-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
             <h3 className="font-bold flex items-center gap-2">
               <Globe className="w-4 h-4 text-primary" /> Preferences
             </h3>
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">College / University</label>
                  <input 
                    type="text"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                    placeholder="e.g. Stanford University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Session Language</label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {["English", "Hindi", "Spanish", "French", "German"].map(l => (
                      <option key={l} value={l} className="bg-zinc-900">{l}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Academic Year</label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(y => (
                      <option key={y} value={y} className="bg-zinc-900">Year {y}</option>
                    ))}
                  </select>
                </div>
             </div>
          </div>
        </div>

        {/* Middle/Right Column: Skills & Availability */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tag Editor (Existing Feature Expanded) */}
          <div className="glass p-10 rounded-3xl border border-white/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />
            
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Skill Matrix</h1>
              <p className="text-muted-foreground">Precisely define your knowledge tags.</p>
            </div>

            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab('learn')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  activeTab === 'learn' ? 'bg-white/10 text-white shadow-inner' : 'text-muted-foreground hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" /> I need help with
              </button>
              <button
                onClick={() => setActiveTab('teach')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  activeTab === 'teach' ? 'bg-white/10 text-white shadow-inner' : 'text-muted-foreground hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> I can teach
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Data Structures, React..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button disabled={!search} variant="premium" className="px-5">
                  <Plus className="w-5 h-5" />
                </Button>

                {search && filteredTags.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 glass rounded-xl border border-white/10 z-50 overflow-hidden shadow-2xl">
                    {filteredTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="w-full px-5 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2 tracking-[0.2em]">
                    <BookOpen className="w-3 h-3 text-primary" /> Learning Path (Max 10)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {needHelp.map(tag => (
                      <motion.span layout key={tag} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm">
                        {tag} <X onClick={() => handleRemoveTag(tag, 'learn')} className="w-3 h-3 cursor-pointer hover:text-white" />
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2 tracking-[0.2em]">
                    <GraduationCap className="w-3 h-3 text-white" /> Mentoring Skills (Max 10)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {canTeach.map(tag => (
                      <motion.span layout key={tag} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm">
                        {tag} <X onClick={() => handleRemoveTag(tag, 'teach')} className="w-3 h-3 cursor-pointer hover:text-red-400" />
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Grid */}
          <div className="glass p-10 rounded-3xl border border-white/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Weekly Availability
              </h3>
              <p className="text-sm text-muted-foreground">Select the windows when you are ready to help others.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{day.slice(0,3)}</span>
                  <div className="flex flex-col gap-2">
                    {TIME_SLOTS.map(slot => {
                      const isSelected = (availability[day] || []).includes(slot);
                      return (
                        <button
                          key={slot}
                          onClick={() => handleToggleTime(day, slot)}
                          className={`px-3 py-2 text-[10px] rounded-lg border transition-all ${
                            isSelected 
                              ? 'bg-primary/20 border-primary/40 text-primary' 
                              : 'bg-white/5 border-transparent text-muted-foreground hover:border-white/10'
                          }`}
                        >
                          {slot.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4">
              <Button size="xl" className="flex-1 font-bold h-16" variant="premium" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving Settings..." : "Save All Changes"} <Save className="ml-2 w-5 h-5" />
              </Button>
              {saveStatus && (
                <div className="flex items-center justify-center px-6 text-sm font-medium text-green-400">
                  {saveStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
