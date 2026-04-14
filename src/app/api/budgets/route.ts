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

    const budgets = await prisma.budget.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { month: 'desc' }
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET Budgets Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { categoryName, limit, month, year } = body;

    if (!categoryName || !limit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Resolve category
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName, type: "EXPENSE" }
      });
    }

    const parsedLimit = parseFloat(limit.toString());
    const parsedMonth = parseInt(month.toString());
    const parsedYear = parseInt(year.toString());

    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: session.user.id,
          categoryId: category.id,
          month: parsedMonth,
          year: parsedYear
        }
      },
      update: { limit: parsedLimit },
      create: {
        userId: session.user.id,
        categoryId: category.id,
        limit: parsedLimit,
        month: parsedMonth,
        year: parsedYear
      }
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("POST Budget Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
