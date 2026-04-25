"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Send, Clock, AlertCircle } from "lucide-react";

export function HelpRequestForm() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API logic will go here
    console.log({ topic, description });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 p-8 bg-card rounded-2xl border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">New Help Request</h2>
          <p className="text-sm text-muted-foreground">Sessions are capped at 20 minutes.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic</label>
          <input
            type="text"
            required
            placeholder="e.g. Stuck on Binary Search Trees"
            className="w-full bg-background border border-input rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Context</label>
          <textarea
            required
            placeholder="What specifically is confusing you? (Keep it short)"
            rows={3}
            className="w-full bg-background border border-input rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border flex gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            Our AI will match you with a peer who excels in this topic and is currently available for a quick micro-mentorship session.
          </p>
        </div>
      </div>

      <Button type="submit" variant="premium" className="w-full" size="lg">
        Find a Peer Mentor <Send className="ml-2 w-4 h-4" />
      </Button>
    </form>
  );
}
