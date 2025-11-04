import { sendPriceAlertEmail } from "@/app/lib/email";
import { getCryptoData, getMarketData } from "@/app/lib/market-data";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for Vercel Pro

// Cron job handler - should be called via Vercel Cron or external service
// Add to vercel.json: { "crons": [{ "path": "/api/cron/check-alerts", "schedule": "*/5 * * * *" }] }
export async function GET(req: Request) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON] Starting alert check...");

    // Get all active, non-triggered alerts
    const alerts = await prisma.priceAlert.findMany({
      where: {
        isActive: true,
        triggered: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`[CRON] Found ${alerts.length} active alerts to check`);

    let triggeredCount = 0;
    let errorCount = 0;

    // Process alerts in batches to avoid rate limits
    for (const alert of alerts) {
      try {
        // Fetch current price based on asset type
        let currentPrice: number | null = null;

        if (alert.assetType === "KRIPTO") {
          const cryptoData = await getCryptoData(alert.symbol.toLowerCase());
          currentPrice = cryptoData?.price ?? null;
        } else if (alert.assetType === "SAHAM") {
          const stockData = await getMarketData(alert.symbol, "SAHAM");
          currentPrice = stockData?.price ?? null;
        }

        if (currentPrice === null) {
          console.warn(`[CRON] Could not fetch price for ${alert.symbol}`);
          continue;
        }

        // Check if condition is met
        let conditionMet = false;

        switch (alert.condition) {
          case "ABOVE":
            conditionMet = currentPrice > alert.targetPrice;
            break;
          case "BELOW":
            conditionMet = currentPrice < alert.targetPrice;
            break;
          case "EQUALS":
            // Allow 0.5% tolerance for EQUALS
            const tolerance = alert.targetPrice * 0.005;
            conditionMet =
              Math.abs(currentPrice - alert.targetPrice) <= tolerance;
            break;
        }

        if (conditionMet) {
          console.log(
            `[CRON] Alert triggered: ${alert.symbol} ${alert.condition} ${alert.targetPrice} (current: ${currentPrice})`
          );

          // Send email notification
          if (alert.user.email) {
            const emailResult = await sendPriceAlertEmail({
              to: alert.user.email,
              userName: alert.user.name || "User",
              symbol: alert.symbol,
              assetType: alert.assetType,
              condition: alert.condition,
              targetPrice: alert.targetPrice,
              currentPrice,
            });

            if (!emailResult.success) {
              console.error(
                `[CRON] Failed to send email for alert ${alert.id}:`,
                emailResult.error
              );
            }
          }

          // Mark alert as triggered and deactivate
          await prisma.priceAlert.update({
            where: { id: alert.id },
            data: {
              triggered: true,
              isActive: false,
              triggeredAt: new Date(),
              notifiedAt: new Date(),
            },
          });

          triggeredCount++;
        }
      } catch (error) {
        console.error(`[CRON] Error processing alert ${alert.id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `[CRON] Alert check complete. Triggered: ${triggeredCount}, Errors: ${errorCount}`
    );

    return NextResponse.json({
      success: true,
      checked: alerts.length,
      triggered: triggeredCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error("[CRON] Fatal error in alert check:", error);
    return NextResponse.json(
      { error: "Failed to check alerts" },
      { status: 500 }
    );
  }
}
