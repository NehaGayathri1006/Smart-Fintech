"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your SmartFin AI. How can I help you manage your finances today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response || data.error }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error analyzing your data." }]);
      }
    } catch (err) {
       setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[40]">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] glass-dark rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          <div className="p-4 bg-primary/20 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">SmartFin AI</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "max-w-[80%] rounded-2xl p-3 text-sm",
                msg.role === "assistant" 
                  ? "bg-slate-800 text-slate-200 self-start rounded-tl-none" 
                  : "bg-primary text-white self-end ml-auto rounded-tr-none"
              )}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI is thinking...
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-4 pr-10 text-sm focus:outline-none focus:border-primary/50"
              />
              <button 
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="absolute right-2 top-1.5 p-1 text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
