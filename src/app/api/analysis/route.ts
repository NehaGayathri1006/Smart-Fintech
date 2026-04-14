import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all transactions for this month to group by category
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: firstDayOfMonth },
        type: "EXPENSE"
      },
      include: { category: true }
    });

    const categoryMap: Record<string, { value: number, color: string }> = {};
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#f43f5e", "#ec4899", "#8b5cf6"];

    transactions.forEach((tx, i) => {
      const name = tx.category.name;
      if (!categoryMap[name]) {
        categoryMap[name] = { value: 0, color: colors[Object.keys(categoryMap).length % colors.length] };
      }
      categoryMap[name].value += tx.amount;
    });

    const categoryData = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      value: data.value,
      color: data.color
    }));

    // For the bar chart: last 6 months spend
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        
        const sum = await prisma.transaction.aggregate({
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: d, lt: nextD }
            },
            _sum: { amount: true }
        });

        last6Months.push({
            month: monthName,
            amount: sum._sum.amount || 0
        });
    }

    return NextResponse.json({
      categoryData,
      monthlyTrends: last6Months,
      totalMonthlySpend: transactions.reduce((sum, t) => sum + t.amount, 0)
    });
  } catch (error) {
    console.error("GET Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
