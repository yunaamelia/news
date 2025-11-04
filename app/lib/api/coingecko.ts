/**
 * CoinGecko API Client
 * Free tier: 10-30 calls/minute
 * Docs: https://www.coingecko.com/en/api/documentation
 */

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  last_updated: string;
}

export interface CoinGeckoError {
  error: string;
  status?: number;
}

/**
 * Fetch multiple crypto prices in one call
 */
export async function getCryptoPrices(
  ids: string[] = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "solana",
    "ripple",
    "cardano",
  ]
): Promise<CryptoPrice[]> {
  try {
    const idsParam = ids.join(",");
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=idr&ids=${idsParam}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url, {
      next: { revalidate: 30 }, // Cache for 30 seconds
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    // Return fallback data
    return getFallbackCryptoData(ids);
  }
}

/**
 * Fetch single crypto price
 */
export async function getSingleCryptoPrice(
  id: string
): Promise<CryptoPrice | null> {
  try {
    const prices = await getCryptoPrices([id]);
    return prices[0] || null;
  } catch (error) {
    console.error(`Error fetching ${id} price:`, error);
    return null;
  }
}

/**
 * Get trending cryptocurrencies
 */
export async function getTrendingCrypto() {
  try {
    const url = `${COINGECKO_BASE_URL}/search/trending`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching trending crypto:", error);
    return { coins: [] };
  }
}

/**
 * Fallback data when API fails
 */
function getFallbackCryptoData(ids: string[]): CryptoPrice[] {
  const fallbackData: Record<string, CryptoPrice> = {
    bitcoin: {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      current_price: 1088000000, // ~$72k in IDR
      price_change_percentage_24h: 2.5,
      market_cap: 21000000000000,
      total_volume: 450000000000,
      image: "/images/crypto/btc.svg",
      last_updated: new Date().toISOString(),
    },
    ethereum: {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      current_price: 47500000, // ~$3.1k in IDR
      price_change_percentage_24h: 1.8,
      market_cap: 5700000000000,
      total_volume: 180000000000,
      image: "/images/crypto/eth.svg",
      last_updated: new Date().toISOString(),
    },
    binancecoin: {
      id: "binancecoin",
      symbol: "BNB",
      name: "Binance Coin",
      current_price: 9250000,
      price_change_percentage_24h: -0.5,
      market_cap: 1400000000000,
      total_volume: 28000000000,
      image: "/images/crypto/bnb.svg",
      last_updated: new Date().toISOString(),
    },
    solana: {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      current_price: 3450000,
      price_change_percentage_24h: 4.2,
      market_cap: 1450000000000,
      total_volume: 65000000000,
      image: "/images/crypto/sol.svg",
      last_updated: new Date().toISOString(),
    },
    ripple: {
      id: "ripple",
      symbol: "XRP",
      name: "Ripple",
      current_price: 8800,
      price_change_percentage_24h: -1.2,
      market_cap: 470000000000,
      total_volume: 19000000000,
      image: "/images/crypto/xrp.svg",
      last_updated: new Date().toISOString(),
    },
    cardano: {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      current_price: 5900,
      price_change_percentage_24h: 0.8,
      market_cap: 210000000000,
      total_volume: 8000000000,
      image: "/images/crypto/ada.svg",
      last_updated: new Date().toISOString(),
    },
  };

  return ids.map((id) => fallbackData[id]).filter(Boolean);
}

/**
 * Format price to IDR
 */
export function formatIDR(price: number): string {
  if (price >= 1000000000) {
    return `Rp ${(price / 1000000000).toFixed(2)}M`;
  } else if (price >= 1000000) {
    return `Rp ${(price / 1000000).toFixed(2)}jt`;
  } else if (price >= 1000) {
    return `Rp ${(price / 1000).toFixed(0)}rb`;
  }
  return `Rp ${price.toLocaleString("id-ID")}`;
}
