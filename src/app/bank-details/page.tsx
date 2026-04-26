"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  Lock, 
  ChevronRight, 
  MoreVertical,
  ArrowRight,
  PlusCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BankDetailsPage() {
  const [showNumbers, setShowNumbers] = useState<{[key: string]: boolean}>({});
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/accounts")
      .then(res => res.json())
      .then(data => {
        setAccounts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      });
  }, []);

  const toggleVisibility = (id: string) => {
    setShowNumbers(prev => ({...prev, [id]: !prev[id]}));
  };

  const cardColors = [
    "from-blue-600 to-indigo-600",
    "from-emerald-500 to-teal-500",
    "from-slate-700 to-slate-900",
    "from-rose-500 to-pink-600",
    "from-violet-600 to-purple-600"
  ];


  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-white">Bank Accounts</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Securely encrypted and read-only bank data.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-primary text-white hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-primary/20">
          <PlusCircle className="w-5 h-5" />
          <span className="font-bold">Link New Bank</span>
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {accounts.map((acc, index) => (
          <div key={acc.id} className={cn(
            "p-8 rounded-[40px] border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer shadow-2xl bg-gradient-to-br",
            cardColors[index % cardColors.length]
          )}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <button className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-12 space-y-4">
                <div>
                  <h3 className="text-white/60 text-sm font-bold uppercase tracking-widest">{acc.currency}</h3>
                  <p className="text-2xl font-black text-white">{acc.name}</p>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <span className="text-white/80 font-mono text-lg">**** **** **** {acc.id.slice(-4)}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleVisibility(acc.id); }}
                      className="p-1 hover:text-white text-white/40 transition-colors"
                    >
                      {showNumbers[acc.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                   </div>
                   <div className="w-10 h-6 bg-white/10 rounded-md border border-white/10" />
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-white/40 text-xs font-bold uppercase mb-1">Available Balance</p>
                  <p className="text-3xl font-black text-white">₹{acc.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="p-8 rounded-[40px] border-4 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-4 group">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all text-slate-600">
            <Plus className="w-8 h-8" />
          </div>
          <p className="text-slate-500 font-bold group-hover:text-white transition-all">Add Manual Account</p>
        </button>
      </div>

      {/* Security Section */}
      <div className="px-4">
        <div className="p-10 rounded-[50px] border border-white/5 glass-dark flex flex-col md:flex-row items-center gap-12">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shrink-0">
            <Lock className="w-14 h-14 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-white">Bank-Grade Security</h3>
            <p className="text-slate-500 leading-relaxed max-w-2xl">
              We use 256-bit AES encryption to protect your data. All bank links are read-only, meaning neither we nor your AI assistant can ever move or withdraw funds from your accounts.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                SOC-2 Compliant
              </div>
              <div className="flex items-center gap-2 text-xs text-primary font-bold px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Lock className="w-4 h-4" />
                SSL Encrypted
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all font-bold">
            Learn More <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
