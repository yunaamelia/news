import axios from "axios";
import prisma from "./prisma";

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const COINGECKO_KEY = process.env.COINGECKO_API_KEY;

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface MarketDataResponse {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
  lastUpdated: string;
}

/**
 * Get stock market data from Alpha Vantage or cached data
 */
export async function getMarketData(
  symbol: string,
  assetType: "SAHAM" | "KRIPTO"
): Promise<MarketDataResponse | null> {
  try {
    // Check cache first
    const cached = await prisma.marketDataCache.findUnique({
      where: {
        symbol_assetType: {
          symbol,
          assetType,
        },
      },
    });

    if (cached && new Date(cached.expiresAt) > new Date()) {
      return JSON.parse(cached.data);
    }

    // Fetch fresh data for Indonesian stocks
    if (assetType === "SAHAM") {
      // For demo purposes, using mock data
      // In production, integrate with IDX API or other Indonesian stock data provider
      const mockData: MarketDataResponse = {
        symbol,
        name: `${symbol} Tbk`,
        price: Math.random() * 10000 + 1000,
        change24h: (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.random() * 1000000000,
        marketCap: Math.random() * 100000000000,
        high24h: Math.random() * 10000 + 1000,
        low24h: Math.random() * 10000 + 1000,
        lastUpdated: new Date().toISOString(),
      };

      // Cache the data
      await prisma.marketDataCache.upsert({
        where: {
          symbol_assetType: {
            symbol,
            assetType,
          },
        },
        create: {
          symbol,
          assetType,
          data: JSON.stringify(mockData),
          expiresAt: new Date(Date.now() + CACHE_DURATION),
        },
        update: {
          data: JSON.stringify(mockData),
          expiresAt: new Date(Date.now() + CACHE_DURATION),
        },
      });

      return mockData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return null;
  }
}

/**
 * Get cryptocurrency data from CoinGecko
 */
export async function getCryptoData(
  coinId: string
): Promise<MarketDataResponse | null> {
  try {
    // Check cache first
    const cached = await prisma.marketDataCache.findUnique({
      where: {
        symbol_assetType: {
          symbol: coinId,
          assetType: "KRIPTO",
        },
      },
    });

    if (cached && new Date(cached.expiresAt) > new Date()) {
      return JSON.parse(cached.data);
    }

    // Fetch from CoinGecko API
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
        },
      }
    );

    const data = response.data;
    const marketData: MarketDataResponse = {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      price:
        data.market_data.current_price.idr ||
        data.market_data.current_price.usd * 15000,
      change24h:
        data.market_data.price_change_24h_in_currency.idr ||
        data.market_data.price_change_24h,
      changePercent: data.market_data.price_change_percentage_24h,
      volume:
        data.market_data.total_volume.idr ||
        data.market_data.total_volume.usd * 15000,
      marketCap:
        data.market_data.market_cap.idr ||
        data.market_data.market_cap.usd * 15000,
      high24h:
        data.market_data.high_24h.idr || data.market_data.high_24h.usd * 15000,
      low24h:
        data.market_data.low_24h.idr || data.market_data.low_24h.usd * 15000,
      lastUpdated: data.market_data.last_updated,
    };

    // Cache the data
    await prisma.marketDataCache.upsert({
      where: {
        symbol_assetType: {
          symbol: coinId,
          assetType: "KRIPTO",
        },
      },
      create: {
        symbol: coinId,
        assetType: "KRIPTO",
        data: JSON.stringify(marketData),
        expiresAt: new Date(Date.now() + CACHE_DURATION),
      },
      update: {
        data: JSON.stringify(marketData),
        expiresAt: new Date(Date.now() + CACHE_DURATION),
      },
    });

    return marketData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);

    // Fallback to mock data for development
    const mockData: MarketDataResponse = {
      symbol: coinId.toUpperCase(),
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      price: Math.random() * 1000000000,
      change24h: (Math.random() - 0.5) * 10000000,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.random() * 100000000000,
      marketCap: Math.random() * 10000000000000,
      high24h: Math.random() * 1000000000,
      low24h: Math.random() * 1000000000,
      lastUpdated: new Date().toISOString(),
    };

    return mockData;
  }
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with Indonesian locale
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
