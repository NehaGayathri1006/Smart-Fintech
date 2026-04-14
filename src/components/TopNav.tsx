"use client";

import { Bell, Globe, Search, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TopNav() {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lang, setLang] = useState("EN");

  const languages = ["EN", "ES", "FR", "DE", "HI"];

  return (
    <div className="w-full h-20 mb-8 border-b border-white/5 glass-dark rounded-3xl sticky top-4 z-40 flex items-center justify-between px-6 shadow-xl shadow-slate-900/50">
      
      {/* Search Bar Stub */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search transactions, budgets..."
            className="w-full bg-slate-900/50 border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative isolate">
          <button 
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold">{lang}</span>
          </button>
          
          {showLangDropdown && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
              {languages.map(code => (
                <button 
                  key={code}
                  onClick={() => { setLang(code); setShowLangDropdown(false); }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-800",
                    lang === code ? "text-primary bg-primary/5" : "text-slate-400"
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative isolate z-50">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowLangDropdown(false);
            }}
            className="relative p-2.5 rounded-xl bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-800"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h4 className="font-bold text-white">Notifications</h4>
                <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-white/5">
                <div className="p-4 hover:bg-white/5 cursor-pointer transition-colors block text-left">
                  <p className="text-sm text-white font-medium mb-1">Budget Alert ⚠️</p>
                  <p className="text-xs text-slate-400">You've reached 90% of your Food budget.</p>
                  <p className="text-[10px] text-slate-500 mt-2">Just now</p>
                </div>
                <div className="p-4 hover:bg-white/5 cursor-pointer transition-colors block text-left">
                  <p className="text-sm text-white font-medium mb-1">Guardian Link Active 🔗</p>
                  <p className="text-xs text-slate-400">Child's account has been successfully linked.</p>
                  <p className="text-[10px] text-slate-500 mt-2">2h ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 cursor-pointer">
          <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
