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

    // Find all users linked to this guardian
    const children = await prisma.user.findMany({
      where: { linkedGuardianId: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        accounts: {
          select: {
            balance: true,
            currency: true
          }
        },
        transactions: {
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error("Fetch Linked Children Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
