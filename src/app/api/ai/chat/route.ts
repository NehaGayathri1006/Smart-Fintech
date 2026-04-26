import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    const userId = session.user.id;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "") {
      return NextResponse.json({ 
        response: "I need a GEMINI_API_KEY to function properly. Please generate an API key from Google AI Studio and add it to your .env file." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 1. Fetch comprehensive user data
    const [transactions, budgets, accounts, savings] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 100, // Increased for better analysis
        include: { category: true }
      }),
      prisma.budget.findMany({
        where: { userId, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        include: { category: true }
      }),
      prisma.account.findMany({ where: { userId } }),
      prisma.savingGoal.findMany({ where: { userId } })
    ]);

    const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalMonthlySpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    const context = `
      Current Net Worth: ₹${netWorth.toLocaleString()}
      Accounts: ${accounts.map(a => `${a.name}: ₹${a.balance}`).join(', ')}
      
      Monthly Budget Status (${new Date().toLocaleString('default', { month: 'long' })}):
      Total Limit: ₹${totalMonthlyBudget}
      Total Spent: ₹${totalMonthlySpent}
      Budget Details: ${budgets.map(b => `${b.category?.name}: ₹${b.spent}/₹${b.limit}`).join(', ')}

      Active Savings Goals:
      ${savings.map(s => `${s.name}: ₹${s.currentAmount}/₹${s.targetAmount} (Target: ${s.deadline ? s.deadline.toISOString().split('T')[0] : 'No deadline'})`).join('\n')}

      Recent Transactions (Last 100):
      ${transactions.map(t => `${t.date.toISOString().split('T')[0]}: ₹${t.amount} for ${t.category?.name || "General"} (${t.type})`).join('\n')}
    `;

    const prompt = `
      You are SmartFin AI, a powerful and insightful personal finance advisor.
      
      RULES:
      1. Use the provided user context to give SPECIFIC advice.
      2. If the user is over budget, warn them politely and suggest where to cut back.
      3. If they are close to a savings goal, encourage them.
      4. Always be concise, helpful, and professional.
      5. Use ₹ for all currency.
      6. If asked about "changes" or "updates", refer to the transactions and budgets provided in the context.

      USER CONTEXT:
      ${context}

      USER QUESTION: ${message}

      SmartFin AI Response:
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
