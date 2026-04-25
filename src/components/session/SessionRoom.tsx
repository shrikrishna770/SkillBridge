"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Send, Hash, FileText, SendHorizontal, Info, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function SessionRoom({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState([
    { id: "1", sender: "AI Assistant", content: "👋 Welcome! Here's your session brief:\n\n1. Focus on traversing nodes.\n2. Visualize the left and right children.\n3. Implement the base case.", isAI: true },
  ]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Shared Notepad */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Shared Implementation Space</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border border-border text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Shared
            </div>
            <Button size="sm" variant="outline">Save Draft</Button>
          </div>
        </div>
        <textarea
          className="flex-1 w-full bg-transparent p-6 font-mono text-sm resize-none outline-none focus:ring-0"
          placeholder="Start collaborting here..."
        />
      </div>

      {/* Chat & AI Brief */}
      <div className="flex flex-col gap-6">
        <div className="bg-card rounded-2xl border border-border flex flex-col flex-1 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <span className="font-semibold text-sm flex items-center gap-2">
              <Hash className="w-4 h-4" /> Session Chat
            </span>
            <div className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isAI ? "justify-center" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.isAI 
                    ? "bg-primary/10 border border-primary/20 text-foreground italic"
                    : "bg-muted border border-border text-foreground"
                }`}>
                  {m.isAI && (
                    <div className="flex items-center gap-1 mb-2 font-bold text-[10px] uppercase tracking-wider text-primary">
                      <Info className="w-3 h-3" /> AI Study Brief
                    </div>
                  )}
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex gap-2 bg-muted/30">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-background border border-input rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="icon" variant="premium">
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-green-500/5 hover:bg-green-500/10 border-green-500/20 text-green-600">
          <CheckCircle className="mr-2 w-4 h-4" /> Complete Session
        </Button>
      </div>
    </div>
  );
}
