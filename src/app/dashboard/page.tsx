import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardCards from "@/components/DashboardCards";
import DashboardCharts from "@/components/DashboardCharts";
import DashboardHeader from "@/components/DashboardHeader";
import { Plus, Download, Filter, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Fetch Accounts for True Net Worth
  const accounts = await prisma.account.findMany({ where: { userId } });
  const assets = accounts.filter(a => a.balance > 0).reduce((sum, acc) => sum + acc.balance, 0);
  const debts = accounts.filter(a => a.balance < 0).reduce((sum, acc) => sum + Math.abs(acc.balance), 0);
  const netWorth = assets - debts;

  // 2. Fetch Transactions for this month (Expenses vs Income)
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: firstDayOfMonth }
    },
    include: { category: true }
  });

  const monthlyExpenses = monthTransactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  // 3. Fetch Budgets
  const budgets = await prisma.budget.findMany({
    where: { userId, month: now.getMonth() + 1, year: now.getFullYear() }
  });
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetUsedPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  // 4. Fetch Savings
  const savings = await prisma.savingGoal.findMany({ where: { userId } });
  const totalSavings = savings.reduce((sum, s) => sum + s.currentAmount, 0);

  const metrics = {
    netWorth,
    monthlyExpenses,
    totalSavings,
    budgetUsedPercent
  };

  // 5. Chart Data (Area Data: current week)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Group month transactions by day of week
  const areaDataMap: Record<string, { income: number, expenses: number }> = {};
  days.forEach(d => areaDataMap[d] = { income: 0, expenses: 0 });

  monthTransactions.forEach(t => {
    const dName = days[new Date(t.date).getDay()];
    if (t.type === "EXPENSE") {
      areaDataMap[dName].expenses += t.amount;
    } else {
      areaDataMap[dName].income += t.amount;
    }
  });
  const areaData = days.map(d => ({ name: d, ...areaDataMap[d] }));

  // 6. Chart Data (Pie Data: category breakdown of expenses)
  const categoryMap: Record<string, number> = {};
  monthTransactions.filter(t => t.type === "EXPENSE").forEach(t => {
    const cName = t.category.name;
    categoryMap[cName] = (categoryMap[cName] || 0) + t.amount;
  });

  // Assign colors deterministically based on string
  const colors = ["#f43f5e", "#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#8b5cf6"];
  const pieData = Object.entries(categoryMap).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length]
  }));

  // 7. Recent Activity (last 5 all-time)
  const recentActivity = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 5,
    include: { category: true }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <DashboardHeader userName={session.user.name || "User"} />

      {/* Stats Cards */}
      <DashboardCards metrics={metrics} />

      {/* Main Charts Section */}
      <DashboardCharts areaData={areaData} pieData={pieData} />

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-white/5 glass-dark flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4 flex-1">
            {recentActivity.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">No recent transactions</p>
                <p className="text-xs text-slate-500 mt-1">Add your first transaction to see it here.</p>
              </div>
            ) : (
              recentActivity.map(t => (
                <div key={t.id} className="flex flex-row items-center justify-between py-3 px-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex flex-row gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.description}</p>
                      <p className="text-xs text-slate-400">{t.category?.name || "General"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", t.type === "EXPENSE" ? "text-rose-500" : "text-emerald-500")}>
                      {t.type === "EXPENSE" ? "-" : "+"}${t.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-white/5 glass-dark flex flex-col h-full">
          <h3 className="text-lg font-bold mb-6 text-white">Budget Analysis</h3>
          <div className="space-y-6 flex-1">
            {budgets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-8 px-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-slate-400 font-medium">No active budgets</p>
                <p className="text-xs text-slate-500 mt-1">Create a budget to start tracking.</p>
              </div>
            ) : (
              budgets.slice(0, 4).map(b => (
                <div key={b.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">Budget limits</span>
                    <span className="text-white">${b.spent} <span className="text-slate-500">/ ${b.limit}</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", (b.spent / b.limit) > 0.9 ? "bg-rose-500" : "bg-primary")} 
                      style={{ width: `${Math.min((b.spent / b.limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
