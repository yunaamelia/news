import { getIHSGIndex, getStockPrices } from "@/app/lib/api/stock-data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get("symbols");
    const includeIHSG = searchParams.get("includeIHSG") === "true";

    if (!symbolsParam) {
      return NextResponse.json(
        { error: "Missing symbols parameter" },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(",").map((s) => s.trim());

    // Fetch stock data
    const stocks = await getStockPrices(symbols);

    // Optionally fetch IHSG index
    let ihsg = null;
    if (includeIHSG) {
      ihsg = await getIHSGIndex();
    }

    return NextResponse.json({
      stocks,
      ihsg,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stock API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
