"use client";

import { Bell, Globe, Search, User, X, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Language, translations } from "@/lib/translations";

export default function TopNav() {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lang, setLang] = useState<Language>("EN");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const t = translations[lang];
  const languages: Language[] = ["EN", "HI", "TE", "ES", "FR"];

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true })
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div className="w-full h-20 mb-8 border-b border-white/5 glass-dark rounded-3xl sticky top-4 z-40 flex items-center justify-between px-6 shadow-xl shadow-slate-900/50">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
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
                  onClick={() => { 
                    setLang(code); 
                    setShowLangDropdown(false); 
                    // Store preferred language in local storage if needed
                    localStorage.setItem("preferred_lang", code);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-800",
                    lang === code ? "text-primary bg-primary/5" : "text-slate-400"
                  )}
                >
                  {code === "EN" ? "English" : code === "HI" ? "हिन्दी" : code === "TE" ? "తెలుగు" : code === "ES" ? "Español" : "Français"}
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-slate-800 animate-pulse-slow">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h4 className="font-bold text-white">{t.notifications}</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    {t.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500">{t.noNotifications}</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => !n.isRead && markAsRead(n.id)}
                      className={cn(
                        "p-4 hover:bg-white/5 cursor-pointer transition-colors block text-left group relative",
                        !n.isRead ? "bg-primary/5" : "opacity-60"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={cn("text-sm font-medium", !n.isRead ? "text-white" : "text-slate-400")}>
                          {n.message.includes("⚠️") ? t.budgetAlert + " ⚠️" : n.message.includes("🔔") ? t.budgetAlert : "System Notification"}
                        </p>
                        {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
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
