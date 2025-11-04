import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { withRateLimit } from "@/app/lib/with-rate-limit";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PATCH /api/alerts/[id] - Update alert (toggle active/inactive)
export const PATCH = withRateLimit(
  async (
    req: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    if (!context?.params) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id } = await context.params;
      const body = await req.json();

      // Verify ownership
      const alert = await prisma.priceAlert.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!alert) {
        return NextResponse.json(
          { error: "Alert tidak ditemukan" },
          { status: 404 }
        );
      }

      if (alert.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Forbidden: Anda tidak memiliki akses" },
          { status: 403 }
        );
      }

      // Only allow updating isActive field
      const updated = await prisma.priceAlert.update({
        where: { id },
        data: {
          isActive: body.isActive ?? undefined,
        },
      });

      return NextResponse.json(updated);
    } catch (error) {
      console.error("Error updating alert:", error);
      return NextResponse.json(
        { error: "Gagal mengupdate alert" },
        { status: 500 }
      );
    }
  },
  { type: "write" }
);

// DELETE /api/alerts/[id] - Delete alert
export const DELETE = withRateLimit(
  async (
    _req: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    if (!context?.params) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id } = await context.params;

      // Verify ownership
      const alert = await prisma.priceAlert.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!alert) {
        return NextResponse.json(
          { error: "Alert tidak ditemukan" },
          { status: 404 }
        );
      }

      if (alert.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Forbidden: Anda tidak memiliki akses" },
          { status: 403 }
        );
      }

      await prisma.priceAlert.delete({
        where: { id },
      });

      return NextResponse.json({ message: "Alert berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting alert:", error);
      return NextResponse.json(
        { error: "Gagal menghapus alert" },
        { status: 500 }
      );
    }
  },
  { type: "write" }
);
