"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  PieChart,
  Edit2,
  Trash2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateBudgetModal from "@/components/CreateBudgetModal";
export default function BudgetsPage() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/budgets")
      .then(res => res.json())
      .then(data => {
        setBudgets(Array.isArray(data) ? data : []);
        setIsLoading(false);
      });
  }, []);

  const totalUnder = budgets.filter(b => b.spent < b.limit).length;
  const totalOver = budgets.filter(b => b.spent >= b.limit).length;


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Budgets</h1>
          <p className="text-slate-400 mt-1">Set limits and optimize your spending habits.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Create New Budget</span>
        </button>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent glass-dark">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Under Budget</h3>
          <p className="text-2xl font-bold text-white mt-1">{totalUnder} Categories</p>
        </div>
        <div className="p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-rose-500/10 to-transparent glass-dark">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Over Budget</h3>
          <p className="text-2xl font-bold text-white mt-1">{totalOver} {totalOver === 1 ? 'Category' : 'Categories'}</p>
        </div>
        <div className="p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/10 to-transparent glass-dark">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Average Savings</h3>
          <p className="text-2xl font-bold text-white mt-1">18.5%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900 border border-white/5 rounded-2xl w-fit">
        {["Monthly", "Yearly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-semibold transition-all",
              activeTab === tab ? "bg-white/10 text-white shadow-xl" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 gap-6">
        {budgets.map((budget: { spent: number; limit: number; category: { name: string } | string; bgColor?: string; color?: string }, i: number) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOver = percentage > 100;

          return (
            <div key={i} className="p-6 rounded-3xl border border-white/5 glass-dark group hover:border-white/20 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-xl",
                    isOver ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"
                  )}>
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                    {typeof budget.category === 'string' ? budget.category : (budget.category?.name || "General")}
                  </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-400">Total Limit:</span>
                      <span className="text-sm font-bold text-slate-200">${budget.limit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={cn("font-bold", isOver ? "text-rose-500" : "text-emerald-400")}>
                      ${budget.spent} Spent
                    </span>
                    <span className="text-slate-500">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", budget.bgColor)}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {isOver && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" />
                      Budget Limit Exceeded
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CreateBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
