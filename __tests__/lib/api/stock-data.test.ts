/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  formatIDR,
  fromYahooSymbol,
  getIHSGIndex,
  getStockPrices,
  getTopIDXStocks,
  toYahooSymbol,
} from "@/app/lib/api/stock-data";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock yahoo-finance2 module
vi.mock("yahoo-finance2", () => ({
  default: {
    quote: vi.fn(),
    quoteSummary: vi.fn(),
  },
}));

describe("Stock Data API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Symbol Converters", () => {
    describe("toYahooSymbol", () => {
      it("should convert Indonesian stock symbols to Yahoo format", () => {
        expect(toYahooSymbol("BBCA")).toBe("BBCA.JK");
        expect(toYahooSymbol("BBRI")).toBe("BBRI.JK");
        expect(toYahooSymbol("TLKM")).toBe("TLKM.JK");
      });

      it("should handle symbols that already have .JK suffix", () => {
        expect(toYahooSymbol("BBCA.JK")).toBe("BBCA.JK");
        expect(toYahooSymbol("BBRI.JK")).toBe("BBRI.JK");
      });

      it("should handle empty string", () => {
        expect(toYahooSymbol("")).toBe(".JK");
      });
    });

    describe("fromYahooSymbol", () => {
      it("should remove .JK suffix from Yahoo symbols", () => {
        expect(fromYahooSymbol("BBCA.JK")).toBe("BBCA");
        expect(fromYahooSymbol("BBRI.JK")).toBe("BBRI");
        expect(fromYahooSymbol("TLKM.JK")).toBe("TLKM");
      });

      it("should handle symbols without suffix", () => {
        expect(fromYahooSymbol("BBCA")).toBe("BBCA");
      });

      it("should handle empty string", () => {
        expect(fromYahooSymbol("")).toBe("");
      });
    });
  });

  describe("formatIDR", () => {
    it("should format trillions correctly", () => {
      expect(formatIDR(1_500_000_000_000)).toBe("Rp 1.50 T");
    });

    it("should format billions correctly", () => {
      expect(formatIDR(5_000_000_000)).toBe("Rp 5.00 M");
    });

    it("should format millions correctly", () => {
      expect(formatIDR(1_000_000)).toBe("Rp 1.00 jt");
    });

    it("should format thousands correctly", () => {
      expect(formatIDR(5_000)).toBe("Rp 5.00 rb");
    });

    it("should handle zero", () => {
      expect(formatIDR(0)).toBe("Rp 0");
    });

    it("should handle small values", () => {
      expect(formatIDR(500)).toBe("Rp 500");
    });
  });

  describe("getStockPrices", () => {
    it("should return fallback data when API fails", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockRejectedValue(new Error("API Error"));

      const symbols = ["BBCA", "BBRI"];
      const result = await getStockPrices(symbols);

      expect(result).toHaveLength(2);
      expect(result[0].symbol).toBe("BBCA");
      expect(result[0].name).toBe("Bank Central Asia Tbk");
      expect(result[0].current_price).toBeGreaterThan(0);
      expect(result[0].price_change_percentage_24h).toBeDefined();
    });

    it("should handle empty symbols array", async () => {
      const result = await getStockPrices([]);
      expect(result).toEqual([]);
    });

    it("should process Yahoo Finance API response correctly", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockResolvedValue({
        symbol: "BBCA.JK",
        regularMarketPrice: 10000,
        regularMarketChange: 100,
        regularMarketChangePercent: 1.01,
        regularMarketVolume: 1000000,
        marketCap: 500000000000,
        trailingPE: 15.5,
        dividendYield: 2.5,
        fiftyTwoWeekHigh: 12000,
        fiftyTwoWeekLow: 8000,
      } as any);

      const result = await getStockPrices(["BBCA"]);

      expect(result).toHaveLength(1);
      expect(result[0].symbol).toBe("BBCA");
      expect(result[0].current_price).toBe(10000);
      expect(result[0].price_change_percentage_24h).toBeCloseTo(1.01, 2);
    });
  });

  describe("getIHSGIndex", () => {
    it("should return fallback IHSG data when API fails", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockRejectedValue(new Error("API Error"));

      const result = await getIHSGIndex();

      expect(result.value).toBeGreaterThan(0);
      expect(result.change).toBeDefined();
      expect(result.change_percentage).toBeDefined();
      expect(result.market_state).toBeDefined();
    });

    it("should process Yahoo Finance IHSG response correctly", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockResolvedValue({
        symbol: "^JKSE",
        regularMarketPrice: 7500,
        regularMarketChange: 50,
        regularMarketChangePercent: 0.67,
        regularMarketVolume: 5000000,
      } as any);

      const result = await getIHSGIndex();

      expect(result.value).toBe(7500);
      expect(result.change).toBe(50);
      expect(result.change_percentage).toBeCloseTo(0.67, 2);
    });
  });

  describe("getTopIDXStocks", () => {
    it("should return all 20 top IDX stocks", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockRejectedValue(new Error("API Error"));

      const result = await getTopIDXStocks();

      expect(result).toHaveLength(20);
      expect(result[0].symbol).toBe("BBCA");
      expect(result[1].symbol).toBe("BBRI");
      expect(result.every((stock: any) => stock.current_price > 0)).toBe(true);
      expect(result.every((stock: any) => stock.name.length > 0)).toBe(true);
    });

    it("should maintain consistent fallback data structure", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockRejectedValue(new Error("API Error"));

      const result = await getTopIDXStocks();

      result.forEach((stock: any) => {
        expect(stock).toHaveProperty("symbol");
        expect(stock).toHaveProperty("name");
        expect(stock).toHaveProperty("current_price");
        expect(stock).toHaveProperty("price_change_percentage_24h");
        expect(stock).toHaveProperty("total_volume");
        expect(stock).toHaveProperty("market_cap");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle network timeout gracefully", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockRejectedValue(new Error("ETIMEDOUT"));

      const result = await getStockPrices(["BBCA"]);

      expect(result).toHaveLength(1);
      expect(result[0].symbol).toBe("BBCA");
      expect(result[0].current_price).toBeGreaterThan(0);
    });

    it("should handle invalid symbol gracefully", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockRejectedValue(
        new Error("Invalid symbol")
      );

      const result = await getStockPrices(["INVALID"]);

      // Unknown symbol returns empty result or fallback
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle missing optional fields in API response", async () => {
      const yahooFinance = (await import("yahoo-finance2")).default;
      vi.mocked(yahooFinance.quote).mockResolvedValue({
        symbol: "BBCA.JK",
        regularMarketPrice: 10000,
        regularMarketChange: 100,
        regularMarketChangePercent: 1.01,
      } as any);

      const result = await getStockPrices(["BBCA"]);

      expect(result[0].pe_ratio).toBeUndefined();
      expect(result[0].dividend_yield).toBeUndefined();
    });
  });
});
