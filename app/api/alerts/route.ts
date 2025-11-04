import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { withRateLimit } from "@/app/lib/with-rate-limit";
import { AlertCondition, AssetType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Validation helper
function validateAlertData(data: unknown) {
  if (!data || typeof data !== "object") {
    throw new Error("Data tidak valid");
  }

  const d = data as Record<string, unknown>;

  if (!d.symbol || typeof d.symbol !== "string") {
    throw new Error("Symbol wajib diisi");
  }

  if (!d.assetType || !["SAHAM", "KRIPTO"].includes(String(d.assetType))) {
    throw new Error("Asset type harus SAHAM atau KRIPTO");
  }

  if (
    !d.targetPrice ||
    typeof d.targetPrice !== "number" ||
    d.targetPrice <= 0
  ) {
    throw new Error("Target price harus berupa angka positif");
  }

  if (
    !d.condition ||
    !["ABOVE", "BELOW", "EQUALS"].includes(String(d.condition))
  ) {
    throw new Error("Condition harus ABOVE, BELOW, atau EQUALS");
  }

  return {
    symbol: d.symbol.toUpperCase(),
    assetType: d.assetType as AssetType,
    targetPrice: d.targetPrice,
    condition: d.condition as AlertCondition,
  };
}

// GET /api/alerts - List user's alerts
export const GET = withRateLimit(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("isActive");
    const symbol = searchParams.get("symbol");

    const alerts = await prisma.priceAlert.findMany({
      where: {
        userId: session.user.id,
        ...(isActive !== null && { isActive: isActive === "true" }),
        ...(symbol && { symbol: symbol.toUpperCase() }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Gagal mengambil alerts" },
      { status: 500 }
    );
  }
});

// POST /api/alerts - Create new alert
export const POST = withRateLimit(
  async (req: NextRequest) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const rawData = await req.json();
      const validatedData = validateAlertData(rawData);

      // Check alert limits (10 for free users, unlimited for premium)
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPremium: true },
      });

      if (!user?.isPremium) {
        const activeAlertCount = await prisma.priceAlert.count({
          where: {
            userId: session.user.id,
            isActive: true,
          },
        });

        if (activeAlertCount >= 10) {
          return NextResponse.json(
            {
              error:
                "Maksimal 10 alert untuk pengguna gratis. Upgrade ke Premium untuk unlimited alerts.",
            },
            { status: 403 }
          );
        }
      }

      // Check if identical alert already exists
      const existing = await prisma.priceAlert.findFirst({
        where: {
          userId: session.user.id,
          symbol: validatedData.symbol,
          assetType: validatedData.assetType,
          targetPrice: validatedData.targetPrice,
          condition: validatedData.condition,
          isActive: true,
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Alert identik sudah ada" },
          { status: 400 }
        );
      }

      const alert = await prisma.priceAlert.create({
        data: {
          userId: session.user.id,
          ...validatedData,
        },
      });

      return NextResponse.json(alert, { status: 201 });
    } catch (error) {
      console.error("Error creating alert:", error);

      if (error instanceof Error && error.message.includes("wajib")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Gagal membuat alert" },
        { status: 500 }
      );
    }
  },
  { type: "write" }
);
