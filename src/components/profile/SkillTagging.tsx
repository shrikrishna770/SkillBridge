"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, X, BookOpen, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Skill = {
  id: string;
  name: string;
  type: "TEACH" | "LEARN";
};

export function SkillTagging({ initialSkills = [] }: { initialSkills?: Skill[] }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [inputValue, setInputValue] = useState("");
  const [activeType, setActiveType] = useState<"TEACH" | "LEARN">("LEARN");

  const addSkill = () => {
    if (!inputValue.trim()) return;
    const newSkill: Skill = {
      id: Math.random().toString(36).substr(2, 9),
      name: inputValue.trim(),
      type: activeType,
    };
    setSkills([...skills, newSkill]);
    setInputValue("");
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-6 bg-card rounded-2xl border border-border shadow-xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Build your Skill Profile</h2>
        <p className="text-muted-foreground italic text-sm">
          "The best way to learn is to teach."
        </p>
      </div>

      <div className="flex p-1 bg-muted rounded-lg">
        <button
          onClick={() => setActiveType("LEARN")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
            activeType === "LEARN" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          I need help with
        </button>
        <button
          onClick={() => setActiveType("TEACH")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
            activeType === "TEACH" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          I can teach
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={activeType === "LEARN" ? "e.g. Data Structures, React..." : "e.g. Python, Calculus..."}
          className="flex-1 bg-background border border-input rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
          onKeyPress={(e) => e.key === "Enter" && addSkill()}
        />
        <Button onClick={addSkill} variant="premium" className="h-auto">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> LEARNING PATH
          </h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.filter(s => s.type === "LEARN").map((skill) => (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium"
                >
                  {skill.name}
                  <button onClick={() => removeSkill(skill.id)} className="hover:text-primary-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> MENTORING SKILLS
          </h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.filter(s => s.type === "TEACH").map((skill) => (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary-foreground rounded-full text-sm font-medium"
                >
                  {skill.name}
                  <button onClick={() => removeSkill(skill.id)} className="hover:text-secondary-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Button className="w-full mt-6" size="lg">Save Profile</Button>
    </div>
  );
}
