import { NextRequest, NextResponse } from "next/server";
import { getMarketData, getCryptoData } from "@/app/lib/market-data";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all"; // 'stock', 'crypto', or 'all'
    const symbols = searchParams.get("symbols")?.split(",") || [];

    let result: any = {};

    if (type === "stock" || type === "all") {
      // Get Indonesian stock data
      const stockSymbols = symbols.filter(
        (s) => !s.includes("USDT") && !s.includes("BTC")
      );
      if (stockSymbols.length > 0) {
        result.stocks = await Promise.all(
          stockSymbols.map((symbol) => getMarketData(symbol, "SAHAM"))
        );
      } else {
        // Default Indonesian stocks
        const defaultStocks = ["BBCA", "BBRI", "BMRI", "TLKM", "ASII"];
        result.stocks = await Promise.all(
          defaultStocks.map((symbol) => getMarketData(symbol, "SAHAM"))
        );
      }
    }

    if (type === "crypto" || type === "all") {
      // Get cryptocurrency data
      const cryptoSymbols = symbols.filter(
        (s) => s.includes("USDT") || s.includes("BTC") || s.includes("ETH")
      );
      if (cryptoSymbols.length > 0) {
        result.cryptos = await Promise.all(
          cryptoSymbols.map((symbol) => getCryptoData(symbol))
        );
      } else {
        // Default cryptocurrencies
        const defaultCryptos = [
          "bitcoin",
          "ethereum",
          "binancecoin",
          "ripple",
          "cardano",
        ];
        result.cryptos = await Promise.all(
          defaultCryptos.map((id) => getCryptoData(id))
        );
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pasar" },
      { status: 500 }
    );
  }
}
