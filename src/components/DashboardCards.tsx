"use client";

import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  CreditCard 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMetrics {
  netWorth: number;
  monthlyExpenses: number;
  totalSavings: number;
  budgetUsedPercent: number;
}

import { useLanguage } from "@/context/LanguageContext";

export default function DashboardCards({ metrics }: { metrics: DashboardMetrics }) {
  const { t } = useLanguage();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const stats = [
    { 
      label: t.trueNetWorth, 
      value: formatCurrency(metrics.netWorth || 0), 
      change: t.assetsDebts, 
      isPositive: metrics.netWorth >= 0, 
      icon: Wallet,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-500"
    },
    { 
      label: t.monthlyExpensesLabel, 
      value: formatCurrency(metrics.monthlyExpenses || 0), 
      change: t.thisMonth, 
      isPositive: false, 
      icon: ArrowDownRight,
      color: "from-rose-500/20 to-rose-500/5",
      iconColor: "text-rose-500"
    },
    { 
      label: t.totalSavings, 
      value: formatCurrency(metrics.totalSavings || 0), 
      change: t.activeGoals, 
      isPositive: true, 
      icon: TrendingUp,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500"
    },
    { 
      label: t.budgetUsed, 
      value: `${metrics.budgetUsedPercent || 0}%`, 
      change: metrics.budgetUsedPercent > 100 ? t.overBudget : t.onTrack, 
      isPositive: metrics.budgetUsedPercent <= 100, 
      icon: PieChartIcon,
      color: metrics.budgetUsedPercent > 100 ? "from-rose-500/20 to-rose-500/5" : "from-amber-500/20 to-amber-500/5",
      iconColor: metrics.budgetUsedPercent > 100 ? "text-rose-500" : "text-amber-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className={`p-6 rounded-3xl border border-white/5 bg-gradient-to-br ${stat.color} backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${stat.iconColor}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className={cn(
              "px-2 py-1 rounded-lg text-xs font-bold",
              stat.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
