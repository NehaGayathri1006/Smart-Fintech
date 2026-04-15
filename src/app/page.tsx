"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  TrendingUp,
  PieChart,
  Users,
  Globe,
  Lock,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="relative min-h-[calc(100vh-40px)] overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      {/* Abstract Background / Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl w-full relative z-10 text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2 shadow-inner"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Financial Intelligence</span>
        </motion.div>

        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight"
          >
            Master Your <br />
            <span className="bg-gradient-to-r from-emerald-400 via-primary to-cyan-400 bg-clip-text text-transparent">Financial Future</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Experience the future of personal banking. SmartFin uses real-time AI to categorize spending, 
            optimize budgets, and secure family interests with GuardianLink™.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
        >
          <Link 
            href="/login?signup=true"
            className="group relative px-10 py-5 bg-primary text-white font-black rounded-[30px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            <span className="relative flex items-center justify-center gap-3">
              {lang === "HI" ? "अभी शुरू करें" : lang === "TE" ? "ఇప్పుడే ప్రారంభించండి" : "Get Started"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link 
            href="/login"
            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-[30px] hover:bg-white/10 hover:border-white/20 transition-all w-full sm:w-auto text-center"
          >
            {lang === "HI" ? "साइन इन करें" : lang === "TE" ? "సైన్ ఇన్ చేయండి" : "Sign In"}
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { 
              icon: Lock, 
              title: lang === "HI" ? "सुरक्षा" : lang === "TE" ? "భద్రత" : "Secure", 
              desc: "Bank-grade encryption for all your data." 
            },
            { 
              icon: BarChart3, 
              title: lang === "HI" ? "एआई विश्लेषण" : lang === "TE" ? "AI విశ్లేషణ" : "AI Driven", 
              desc: "Deep insights into your spending habits." 
            },
            { 
              icon: Globe, 
              title: lang === "HI" ? "बहु-भाषी" : lang === "TE" ? "బహుభాషా" : "Multilingual", 
              desc: "Available in your preferred language." 
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="p-8 rounded-[40px] border border-white/5 glass-dark text-left space-y-4 hover:border-primary/30 transition-all group cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
