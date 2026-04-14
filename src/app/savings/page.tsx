"use client";

import { useState, useEffect } from "react";
import { Plus, Target, TrendingUp, Calendar, CreditCard, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AddGoalModal from "@/components/AddGoalModal";

export default function SavingsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/savings")
      .then(res => res.json())
      .then(data => {
        setGoals(Array.isArray(data) ? data : []);
        setIsLoading(false);
      });
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Savings Goals</h1>
          <p className="text-slate-400 mt-1">Plan and track your long-term financial goals.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Goal</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-primary/20 to-transparent glass-dark relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Total Savings</h3>
            <p className="text-4xl font-black text-white">${totalSaved.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-4 text-emerald-400 font-bold bg-emerald-500/10 w-fit px-3 py-1 rounded-full text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>+12% this year</span>
            </div>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-40 h-40 text-primary/10 opacity-50" />
        </div>

        <div className="p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-violet-500/20 to-transparent glass-dark">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Allocation</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 text-sm">Target Saving</span>
              <span className="text-white font-bold">$1,500.00</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-slate-400 text-sm">Auto-Draft</span>
              <span className="text-emerald-500 font-bold">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {goals.map((goal, i) => {
          const progress = (goal.current / goal.target) * 100;

          return (
            <div key={i} className="p-8 rounded-[40px] border border-white/5 glass-dark group hover:border-white/10 transition-all relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> Target: {goal.deadline}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="space-y-1">
                    <p className="text-slate-400 font-medium">Saved</p>
                    <p className="text-2xl font-black text-white">${goal.current.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-slate-400 font-medium">Target</p>
                    <p className="text-2xl font-black text-slate-700">${goal.target.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative h-6 w-full bg-slate-900 rounded-2xl border border-white/5 p-1">
                  <div 
                    className={cn("h-full rounded-xl transition-all duration-1000 shadow-lg shadow-white/5", goal.color)}
                    style={{ width: `${progress}%` }}
                  />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-white mix-blend-difference">
                    {Math.round(progress)}% COMPLETE
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && !isLoading && (
          <div className="p-12 rounded-[40px] border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center">
            <Target className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">No savings goals set.</p>
            <p className="text-xs text-slate-500 mt-1">Start planning for your future today.</p>
          </div>
        )}

        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-8 rounded-[40px] border-2 border-dashed border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all group flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold">Add Another Goal</span>
        </button>
      </div>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
