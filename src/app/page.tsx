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
  Users
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden -ml-64 -mt-8 w-[calc(100%+256px)] h-[calc(100%+32px)] z-[100] p-0 flex flex-col items-center justify-center p-4">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-[radial-gradient(circle_at_50%_50%,#10b98110_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_70%_70%,#8b5cf608_0%,transparent_50%)]" />
      </div>

      <div className="max-w-6xl w-full relative z-10 text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">AI-First Fintech Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight"
        >
          Master Your <br />
          <span className="bg-gradient-to-r from-emerald-400 via-primary to-cyan-400 bg-clip-text text-transparent">Financial Future</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          SmartFin uses advanced neural networks to categorize your spending, predict future trends, and help you save 2.5x faster.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
        >
          <Link 
            href="/login?signup=true"
            className="group relative px-10 py-5 bg-primary text-white font-black rounded-[30px] overflow-hidden transition-all hover:scale-105 shadow-2xl shadow-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
              Get Started
              <ArrowRight className="w-6 h-6" />
            </span>
          </Link>
          <Link 
            href="/login"
            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-[30px] hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Features Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20"
        >
          {[
            { icon: ShieldCheck, title: "Bank-Grade Security", desc: "256-bit AES encryption." },
            { icon: Zap, title: "Real-time AI Sync", desc: "Instant categorization." },
            { icon: Users, title: "GuardianLink™", desc: "Secure family oversight." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[40px] border border-white/5 glass-dark text-left space-y-4 hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Social Proof */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-20 flex items-center gap-8 grayscale opacity-30"
      >
        <span className="text-white font-black text-xl italic">Forbes</span>
        <span className="text-white font-black text-xl italic">FintechDaily</span>
        <span className="text-white font-black text-xl italic">TechCrunch</span>
      </motion.div>
    </div>
  );
}
