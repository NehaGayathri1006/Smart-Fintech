import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardCards from "@/components/DashboardCards";
import DashboardCharts from "@/components/DashboardCharts";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardWidgets from "@/components/DashboardWidgets";
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
    where: { userId, month: now.getMonth() + 1, year: now.getFullYear() },
    include: { category: true }
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
    const cName = t.category?.name || "General";
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

      {/* Recent Activity / Quick Actions (Localized) */}
      <DashboardWidgets recentActivity={recentActivity} budgets={budgets} />
    </div>
  );
}
