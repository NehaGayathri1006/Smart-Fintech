import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import z from "zod";
import { authOptions } from "@/lib/auth";

const TransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  categoryName: z.string(),
  type: z.enum(["EXPENSE", "INCOME"]).optional(),
  accountId: z.string().optional(),
  date: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const validatedData = TransactionSchema.parse(body);

    const txDate = validatedData.date ? new Date(validatedData.date) : new Date();

    // Map the user's specific categories correctly using title case to match standard
    const catName = validatedData.categoryName;
    const isSavings = catName.toLowerCase().includes("saving") || catName.toLowerCase().includes("investment");
    const txType = validatedData.type || (isSavings ? "EXPENSE" : "EXPENSE"); // Default to expense unless explicitly INCOME

    // Find category by name
    let category = await prisma.category.findFirst({
      where: { name: { equals: catName, mode: 'insensitive' } }
    });
    
    if (!category) {
       category = await prisma.category.create({
         data: { name: catName, type: txType }
       });
    }

    // Default to first account or create one for the user
    let userAccount = null;
    if (validatedData.accountId) {
      userAccount = await prisma.account.findUnique({ where: { id: validatedData.accountId } });
    }
    if (!userAccount) {
      userAccount = await prisma.account.findFirst({ where: { userId: session.user.id } });
      if (!userAccount) {
         userAccount = await prisma.account.create({
           data: { name: "Main Bank", balance: 0, currency: "INR", userId: session.user.id }
         });
      }
    }

    const parsedAmount = parseFloat(validatedData.amount.toString());

    if (isNaN(parsedAmount)) {
      return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
    }

    // START PRISMA TRANSACTION FOR DATA CONSISTENCY
    const result = await prisma.$transaction(async (prismaTx) => {
      // 1. Create Transaction
      const transaction = await prismaTx.transaction.create({
        data: {
          amount: parsedAmount,
          description: validatedData.description,
          type: txType,
          categoryId: category.id,
          accountId: userAccount.id,
          userId: session.user.id,
          date: txDate,
        },
        include: {
          category: true,
        }
      });

      // 2. Update Account Balance
      if (txType === "EXPENSE") {
        await prismaTx.account.update({
          where: { id: userAccount.id },
          data: { balance: { decrement: parsedAmount } }
        });
      } else if (txType === "INCOME") {
        await prismaTx.account.update({
          where: { id: userAccount.id },
          data: { balance: { increment: parsedAmount } }
        });
      }

      // 3. Update Budget (if EXPENSE)
      if (txType === "EXPENSE" && !isSavings) {
        const month = txDate.getMonth() + 1; // 1-12
        const year = txDate.getFullYear();
        
        const budget = await prismaTx.budget.findUnique({
          where: {
            userId_categoryId_month_year: {
              userId: session.user.id,
              categoryId: category.id,
              month,
              year
            }
          }
        });

        if (budget) {
          const updatedBudget = await prismaTx.budget.update({
            where: { id: budget.id },
            data: { spent: { increment: parsedAmount } }
          });

          // Check for budget alerts
          const percentSpent = (updatedBudget.spent / updatedBudget.limit) * 100;
          
          if (percentSpent >= 100) {
            await prismaTx.notification.create({
              data: {
                userId: session.user.id,
                message: `⚠️ Budget Exceeded! You have spent ${updatedBudget.spent} which is over your ${updatedBudget.limit} limit for ${category.name}.`,
                type: "WARNING"
              }
            });
          } else if (percentSpent >= 80) {
            // Check if we already sent a warning for this budget recently? 
            // For simplicity, we'll just send it if they are between 80-100% and it was just crossed
            const oldPercent = (budget.spent / budget.limit) * 100;
            if (oldPercent < 80) {
              await prismaTx.notification.create({
                data: {
                  userId: session.user.id,
                  message: `🔔 Budget Warning: You have reached ${Math.floor(percentSpent)}% of your ${category.name} budget.`,
                  type: "INFO"
                }
              });
            }
          }
        }
      }

      // 4. Update Savings (if Savings)
      if (txType === "EXPENSE" && isSavings) {
        const activeSavingGoal = await prismaTx.savingGoal.findFirst({
          where: { userId: session.user.id },
          orderBy: { deadline: 'asc' } // Earliest deadline first
        });
        
        if (activeSavingGoal) {
          await prismaTx.savingGoal.update({
            where: { id: activeSavingGoal.id },
            data: { currentAmount: { increment: parsedAmount } }
          });
        } else {
          // Create a default saving goal if none exists
          await prismaTx.savingGoal.create({
            data: {
              name: "General Savings",
              targetAmount: parsedAmount * 10,
              currentAmount: parsedAmount,
              userId: session.user.id
            }
          });
        }
      }

      return transaction;
    });

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const transactions = await prisma.transaction.findMany({
      where: { 
        OR: [
          { userId: session.user.id },
          { user: { linkedGuardianId: session.user.id } }
        ]
      },
      orderBy: { date: "desc" },
      take: limit,
      include: { category: true },
    });

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
