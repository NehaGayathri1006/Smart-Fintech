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

    const savings = await prisma.savingGoal.findMany({
      where: { userId: session.user.id },
      orderBy: { deadline: 'asc' }
    });

    return NextResponse.json(savings);
  } catch (error) {
    console.error("GET Savings Error:", error);
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
    const { name, targetAmount, deadline } = body;

    const goal = await prisma.savingGoal.create({
      data: {
        userId: session.user.id,
        name,
        targetAmount,
        deadline: deadline ? new Date(deadline) : null,
      }
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("POST Savings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
