/**
 * NOTE: These tests use the old in-memory implementation.
 * New Redis-based rate limiting requires actual Redis connection for testing.
 * TODO: Add integration tests with Redis mock or test instance.
 */
import { getClientIdentifier, RateLimitPresets } from "../rate-limit";

// Mock Request globally for Node environment
global.Request = class Request {
  headers: Map<string, string>;

  constructor(url: string, init?: { headers?: Record<string, string> }) {
    this.headers = new Map(Object.entries(init?.headers || {}));
  }

  get(name: string): string | null {
    return this.headers.get(name) || null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("Rate Limit", () => {
  // Skip old in-memory tests - new implementation uses Redis
  describe.skip("rateLimit (legacy)", () => {
    it("should allow requests within limit", () => {
      // Legacy test - skipped
    });
  });

  describe("getClientIdentifier", () => {
    it("should prioritize user ID", () => {
      const mockRequest = new Request("https://example.com", {
        headers: { "x-forwarded-for": "192.168.1.1" },
      });

      const identifier = getClientIdentifier(mockRequest, "user123");
      expect(identifier).toBe("user:user123");
    });

    it("should use IP from x-forwarded-for header", () => {
      const mockRequest = new Request("https://example.com", {
        headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
      });

      const identifier = getClientIdentifier(mockRequest);
      expect(identifier).toBe("ip:192.168.1.1");
    });

    it("should use IP from x-real-ip header if x-forwarded-for not present", () => {
      const mockRequest = new Request("https://example.com", {
        headers: { "x-real-ip": "192.168.1.2" },
      });

      const identifier = getClientIdentifier(mockRequest);
      expect(identifier).toBe("ip:192.168.1.2");
    });

    it("should return unknown if no IP headers present", () => {
      const mockRequest = new Request("https://example.com");
      const identifier = getClientIdentifier(mockRequest);
      expect(identifier).toBe("ip:unknown");
    });
  });

  describe("RateLimitPresets", () => {
    it("should have AUTH preset", () => {
      expect(RateLimitPresets.AUTH).toEqual({ limit: 5, window: 15 * 60 });
    });

    it("should have API preset", () => {
      expect(RateLimitPresets.API).toEqual({ limit: 100, window: 60 });
    });

    it("should have PUBLIC preset", () => {
      expect(RateLimitPresets.PUBLIC).toEqual({ limit: 300, window: 60 });
    });

    it("should have WRITE preset", () => {
      expect(RateLimitPresets.WRITE).toEqual({ limit: 20, window: 60 });
    });

    it("should have SENSITIVE preset", () => {
      expect(RateLimitPresets.SENSITIVE).toEqual({ limit: 3, window: 5 * 60 });
    });
  });
});
