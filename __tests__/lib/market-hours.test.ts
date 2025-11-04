import {
  getJakartaTime,
  getMarketHoursInfo,
  getMarketStatus,
  getNextOpenTime,
  getTimeUntilOpen,
  isMarketOpen,
  isWeekend,
  shouldRefreshStockData,
} from "@/lib/market-hours";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Market Hours Utility", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getJakartaTime", () => {
    it("should return current time in Jakarta timezone", () => {
      const jakartaTime = getJakartaTime();
      expect(jakartaTime).toBeInstanceOf(Date);
      expect(jakartaTime.getTime()).toBeGreaterThan(0);
    });
  });

  describe("isWeekend", () => {
    it("should return true for Saturday", () => {
      const saturday = new Date("2025-11-08T03:00:00.000Z"); // 10:00 WIB Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it("should return true for Sunday", () => {
      const sunday = new Date("2025-11-09T03:00:00.000Z"); // 10:00 WIB Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it("should return false for weekdays", () => {
      const monday = new Date("2025-11-10T03:00:00.000Z"); // 10:00 WIB Monday
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe("isMarketOpen", () => {
    it("should return false during weekend", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-08T03:00:00.000Z")); // Saturday 10:00 WIB
      expect(isMarketOpen()).toBe(false);
    });

    it("should return true during Session I (09:00-12:00)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T03:30:00.000Z")); // Tuesday 10:30 WIB
      expect(isMarketOpen()).toBe(true);
    });

    it("should return false during break (12:00-13:30)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T05:30:00.000Z")); // Tuesday 12:30 WIB
      expect(isMarketOpen()).toBe(false);
    });

    it("should return true during Session II (13:30-15:50)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T07:30:00.000Z")); // Tuesday 14:30 WIB
      expect(isMarketOpen()).toBe(true);
    });

    it("should return false after market close", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T09:30:00.000Z")); // Tuesday 16:30 WIB
      expect(isMarketOpen()).toBe(false);
    });

    it("should return false before market open", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T01:00:00.000Z")); // Tuesday 08:00 WIB
      expect(isMarketOpen()).toBe(false);
    });
  });

  describe("getMarketStatus", () => {
    it("should return CLOSED for weekend", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-08T03:00:00.000Z")); // Saturday 10:00 WIB
      expect(getMarketStatus()).toBe("CLOSED");
    });

    it("should return PRE for pre-market hours (08:45-09:00)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T01:50:00.000Z")); // Tuesday 08:50 WIB
      expect(getMarketStatus()).toBe("PRE");
    });

    it("should return OPEN during Session I", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T03:00:00.000Z")); // Tuesday 10:00 WIB
      expect(getMarketStatus()).toBe("OPEN");
    });

    it("should return BREAK during trading break", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T05:30:00.000Z")); // Tuesday 12:30 WIB
      expect(getMarketStatus()).toBe("BREAK");
    });

    it("should return OPEN during Session II", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T07:00:00.000Z")); // Tuesday 14:00 WIB
      expect(getMarketStatus()).toBe("OPEN");
    });

    it("should return POST for after-hours (15:50-16:15)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T09:00:00.000Z")); // Tuesday 16:00 WIB
      expect(getMarketStatus()).toBe("POST");
    });

    it("should return CLOSED after 16:15", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T10:00:00.000Z")); // Tuesday 17:00 WIB
      expect(getMarketStatus()).toBe("CLOSED");
    });
  });

  describe("getNextOpenTime", () => {
    it("should return next Monday 09:00 when called on Saturday", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-08T03:00:00.000Z")); // Saturday 10:00 WIB
      const nextOpen = getNextOpenTime();
      expect(nextOpen.getDay()).toBe(1); // Monday
      expect(nextOpen.getHours()).toBe(9);
      expect(nextOpen.getMinutes()).toBe(0);
    });

    it("should return next Monday 09:00 when called on Sunday", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-09T03:00:00.000Z")); // Sunday 10:00 WIB
      const nextOpen = getNextOpenTime();
      expect(nextOpen.getDay()).toBe(1); // Monday
    });

    it("should return tomorrow 09:00 when market is closed on weekday", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T10:00:00.000Z")); // Tuesday 17:00 WIB
      const nextOpen = getNextOpenTime();
      expect(nextOpen.getDate()).toBe(5); // Next day
      expect(nextOpen.getHours()).toBe(9);
    });
  });

  describe("getMarketHoursInfo", () => {
    it("should return correct info when market is open", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T03:00:00.000Z")); // Tuesday 10:00 WIB
      const info = getMarketHoursInfo();
      expect(info.isOpen).toBe(true);
      expect(info.status).toBe("OPEN");
      expect(info.nextOpenTime).toBeNull();
      expect(info.message).toContain("Market Open");
    });

    it("should return correct info when market is closed", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T10:00:00.000Z")); // Tuesday 17:00 WIB
      const info = getMarketHoursInfo();
      expect(info.isOpen).toBe(false);
      expect(info.status).toBe("CLOSED");
      expect(info.nextOpenTime).toBeInstanceOf(Date);
      expect(info.message).toContain("Market Closed");
    });

    it("should return correct info during trading break", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T05:30:00.000Z")); // Tuesday 12:30 WIB
      const info = getMarketHoursInfo();
      expect(info.isOpen).toBe(false);
      expect(info.status).toBe("BREAK");
      expect(info.message).toContain("Trading Break");
    });
  });

  describe("getTimeUntilOpen", () => {
    it("should return time in hours and minutes format", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T01:00:00.000Z")); // Tuesday 08:00 WIB (1h until open)
      const timeUntil = getTimeUntilOpen();
      expect(timeUntil).toMatch(/\d+h \d+m/);
    });

    it("should return days format for weekend", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-08T03:00:00.000Z")); // Saturday 10:00 WIB
      const timeUntil = getTimeUntilOpen();
      expect(timeUntil).toMatch(/\d+ day/);
    });

    it("should return minutes only when less than 1 hour", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T01:30:00.000Z")); // Tuesday 08:30 WIB (30m until open)
      const timeUntil = getTimeUntilOpen();
      expect(timeUntil).toMatch(/^\d+m$/);
    });
  });

  describe("shouldRefreshStockData", () => {
    it("should return true when market is open", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T03:00:00.000Z")); // Tuesday 10:00 WIB
      expect(shouldRefreshStockData()).toBe(true);
    });

    it("should return true during pre-market", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T01:50:00.000Z")); // Tuesday 08:50 WIB
      expect(shouldRefreshStockData()).toBe(true);
    });

    it("should return true during post-market", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T09:00:00.000Z")); // Tuesday 16:00 WIB
      expect(shouldRefreshStockData()).toBe(true);
    });

    it("should return false when market is closed", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T10:00:00.000Z")); // Tuesday 17:00 WIB
      expect(shouldRefreshStockData()).toBe(false);
    });

    it("should return false during break", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-11-04T05:30:00.000Z")); // Tuesday 12:30 WIB
      expect(shouldRefreshStockData()).toBe(false);
    });
  });
});
