/**
 * Market Hours Utility for Jakarta Stock Exchange (JATS)
 * Trading Hours:
 * - Pre-open: 08:45-09:00 WIB
 * - Session I: 09:00-12:00 WIB
 * - Break: 12:00-13:30 WIB
 * - Session II: 13:30-15:50 WIB
 * - Post-close: 15:50-16:15 WIB
 * - Weekend: Closed
 */

export type MarketStatus = "OPEN" | "CLOSED" | "PRE" | "POST" | "BREAK";

export interface MarketHoursInfo {
  isOpen: boolean;
  status: MarketStatus;
  nextOpenTime: Date | null;
  message: string;
}

/**
 * Get current time in Jakarta timezone
 */
export function getJakartaTime(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
}

/**
 * Check if current day is weekend
 */
export function isWeekend(date: Date = getJakartaTime()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Check if market is open for trading
 */
export function isMarketOpen(): boolean {
  const now = getJakartaTime();

  if (isWeekend(now)) return false;

  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;

  // Session 1: 09:00-12:00 (540-720 min)
  // Session 2: 13:30-15:50 (810-950 min)
  return (time >= 540 && time < 720) || (time >= 810 && time < 950);
}

/**
 * Get detailed market status
 */
export function getMarketStatus(): MarketStatus {
  const now = getJakartaTime();

  if (isWeekend(now)) return "CLOSED";

  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;

  // Pre-market: 08:45-09:00 (525-540)
  if (time >= 525 && time < 540) return "PRE";

  // Session I: 09:00-12:00 (540-720)
  if (time >= 540 && time < 720) return "OPEN";

  // Break: 12:00-13:30 (720-810)
  if (time >= 720 && time < 810) return "BREAK";

  // Session II: 13:30-15:50 (810-950)
  if (time >= 810 && time < 950) return "OPEN";

  // After-hours: 15:50-16:15 (950-975)
  if (time >= 950 && time < 975) return "POST";

  return "CLOSED";
}

/**
 * Get next market open time
 */
export function getNextOpenTime(): Date {
  const now = getJakartaTime();
  const nextOpen = new Date(now);

  // Reset to start of current day
  nextOpen.setHours(9, 0, 0, 0);

  // If weekend or past 09:00, move to next weekday
  if (isWeekend(nextOpen) || now >= nextOpen) {
    // Move to next day
    nextOpen.setDate(nextOpen.getDate() + 1);

    // Skip weekends
    while (isWeekend(nextOpen)) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
  }

  return nextOpen;
}

/**
 * Get comprehensive market hours information
 */
export function getMarketHoursInfo(): MarketHoursInfo {
  const status = getMarketStatus();
  const isOpen = isMarketOpen();
  const nextOpen = getNextOpenTime();

  let message = "";

  switch (status) {
    case "OPEN":
      message = "🟢 Market Open - Trading Session Active";
      break;
    case "PRE":
      message = "🟡 Pre-Market - Opening Soon";
      break;
    case "BREAK":
      message = "🔵 Trading Break - Resumes at 13:30 WIB";
      break;
    case "POST":
      message = "🟠 After Hours - Post-Trading Session";
      break;
    case "CLOSED":
      if (isWeekend()) {
        message = `🔴 Market Closed - Opens ${nextOpen.toLocaleDateString("id-ID", { weekday: "long" })} at 09:00 WIB`;
      } else {
        message = "🔴 Market Closed - Opens Tomorrow at 09:00 WIB";
      }
      break;
  }

  return {
    isOpen,
    status,
    nextOpenTime: isOpen ? null : nextOpen,
    message,
  };
}

/**
 * Format time remaining until market opens
 */
export function getTimeUntilOpen(): string {
  const nextOpen = getNextOpenTime();
  const now = getJakartaTime();
  const diff = nextOpen.getTime() - now.getTime();

  if (diff <= 0) return "Opening now";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Check if should refresh stock data
 * Only refresh during market hours or within 5 minutes of close
 */
export function shouldRefreshStockData(): boolean {
  const status = getMarketStatus();
  return status === "OPEN" || status === "PRE" || status === "POST";
}
