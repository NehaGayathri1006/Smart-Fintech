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
    
    // 1. Calculate Monthly Spendings for last 3 months
    const last3Months = [];
    for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const sum = await prisma.transaction.aggregate({
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: d, lt: nextD }
            },
            _sum: { amount: true }
        });
        last3Months.push(sum._sum.amount || 0);
    }

    // 2. Simple Linear Forecasting
    const avgSpend = last3Months.reduce((a, b) => a + b, 0) / 3;
    const projectedSpend = avgSpend * 1.05; // 5% allowance

    // 3. Safety Score (Budget Adherence)
    const activeBudgets = await prisma.budget.findMany({
        where: { userId, month: now.getMonth() + 1, year: now.getFullYear() }
    });
    const budgetAdherence = activeBudgets.length > 0 
        ? activeBudgets.filter(b => b.spent <= b.limit).length / activeBudgets.length
        : 1;
    const safetyScore = Math.round(70 + (budgetAdherence * 30)); // Base 70, up to 100

    // 4. Generate Insights
    const insights = [
      {
        title: "Monthly Forecast",
        description: `Based on your last 3 months, we project a spend of $${projectedSpend.toLocaleString()} for ${now.toLocaleString('default', { month: 'long' })}.`,
        type: "info"
      },
      {
        title: "Budget Health",
        description: budgetAdherence === 1 
            ? "Excellent! You are currently within all your set budget limits."
            : `Warning: You have exceeded ${activeBudgets.filter(b => b.spent > b.limit).length} budget limits this month.`,
        type: budgetAdherence === 1 ? "success" : "warning"
      }
    ];

    return NextResponse.json({
      projectedSpend,
      safetyScore,
      insights,
      lastMonthSpend: last3Months[1] || 0,
      trendPercent: last3Months[1] > 0 ? ((last3Months[2] - last3Months[1]) / last3Months[1] * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error("GET Predictions Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
