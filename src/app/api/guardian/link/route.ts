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

    const { code } = await req.json();

    if (!code || code.trim() === "") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Find the guardian by the code
    const guardian = await prisma.user.findUnique({
      where: { guardianCode: code.toUpperCase() }
    });

    if (!guardian) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
    }

    // Link child to guardian
    await prisma.user.update({
      where: { id: session.user.id },
      data: { linkedGuardianId: guardian.id }
    });

    // Also send a notification to the child
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        message: "Your account has been successfully linked to a Guardian.",
        type: "SUCCESS"
      }
    });

    return NextResponse.json({ message: "Successfully linked accounts!" }, { status: 200 });
  } catch (error) {
    console.error("Link Guardian Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
