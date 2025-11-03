import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true },
        });
        return NextResponse.json({
          message: "Langganan berhasil diaktifkan kembali",
        });
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json(
      { message: "Berhasil berlangganan newsletter" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Gagal berlangganan newsletter" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Berhasil berhenti berlangganan" });
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return NextResponse.json(
      { error: "Gagal berhenti berlangganan" },
      { status: 500 }
    );
  }
}
