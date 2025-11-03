import { NextRequest, NextResponse } from "next/server";
import { getMarketData, getCryptoData } from "@/app/lib/market-data";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    symbol: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "SAHAM";

    let data;
    if (type === "KRIPTO") {
      data = await getCryptoData(symbol);
    } else {
      data = await getMarketData(symbol, "SAHAM");
    }

    if (!data) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching market detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pasar" },
      { status: 500 }
    );
  }
}
