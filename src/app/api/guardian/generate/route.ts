import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a secure 8-character uppercase alphanumeric code
    const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Save to user (acting as guardian)
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { guardianCode: generatedCode }
    });

    return NextResponse.json({ code: generatedCode }, { status: 200 });
  } catch (error) {
    console.error("Generate Guardian Code Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
