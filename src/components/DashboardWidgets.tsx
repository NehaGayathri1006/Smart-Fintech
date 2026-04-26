"use client";

import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardWidgets({ 
  recentActivity, 
  budgets 
}: { 
  recentActivity: any[]; 
  budgets: any[]; 
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 rounded-3xl border border-white/5 glass-dark flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{t.recentTransactions}</h3>
          <button className="text-sm text-primary hover:underline">{t.viewAll}</button>
        </div>
        <div className="space-y-4 flex-1">
          {recentActivity.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                <CreditCard className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">{t.noRecentTransactions}</p>
              <p className="text-xs text-slate-500 mt-1">{t.addFirstTransaction}</p>
            </div>
          ) : (
            recentActivity.map(tx => (
              <div key={tx.id} className="flex flex-row items-center justify-between py-3 px-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex flex-row gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{tx.description}</p>
                    <p className="text-xs text-slate-400">{tx.category?.name || "General"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-bold", tx.type === "EXPENSE" ? "text-rose-500" : "text-emerald-500")}>
                    {tx.type === "EXPENSE" ? "-" : "+"}₹{tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-white/5 glass-dark flex flex-col h-full">
        <h3 className="text-lg font-bold mb-6 text-white">{t.budgetAnalysis}</h3>
        <div className="space-y-6 flex-1">
          {budgets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-8 px-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <p className="text-slate-400 font-medium">{t.noActiveBudgets}</p>
              <p className="text-xs text-slate-500 mt-1">{t.createBudgetTracking}</p>
            </div>
          ) : (
            budgets.slice(0, 4).map(b => {
              // Ensure we don't divide by 0 and handle NaN
              const spent = Number(b.spent) || 0;
              const limit = Number(b.limit) || 1; 
              const percentage = Math.min((spent / limit) * 100, 100);

              return (
                <div key={b.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    {/* Render the category name dynamically instead of hardcoded 'Budget limits' */}
                    <span className="text-slate-300 font-medium">
                      {b.category?.name || t.categoryLabel}
                    </span>
                    <span className="text-white">₹{spent} <span className="text-slate-500">/ ₹{limit}</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", percentage > 90 ? "bg-rose-500" : "bg-primary")} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
