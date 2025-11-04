import { rateLimit, getClientIdentifier, RateLimitPresets } from '../rate-limit';

// Mock Request globally for Node environment
global.Request = class Request {
  headers: Map<string, string>;
  
  constructor(url: string, init?: { headers?: Record<string, string> }) {
    this.headers = new Map(Object.entries(init?.headers || {}));
  }
  
  get(name: string): string | null {
    return this.headers.get(name) || null;
  }
} as any;

describe('Rate Limit', () => {
  describe('rateLimit', () => {
    it('should allow requests within limit', () => {
      const result1 = rateLimit('test-user-1', { limit: 5, window: 60 });
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(4);

      const result2 = rateLimit('test-user-1', { limit: 5, window: 60 });
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    it('should block requests exceeding limit', () => {
      const identifier = 'test-user-2';
      const config = { limit: 3, window: 60 };

      // Make 3 requests (all should pass)
      for (let i = 0; i < 3; i++) {
        const result = rateLimit(identifier, config);
        expect(result.allowed).toBe(true);
      }

      // 4th request should be blocked
      const result = rateLimit(identifier, config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should return correct remaining count', () => {
      const identifier = 'test-user-3';
      const config = { limit: 10, window: 60 };

      const result1 = rateLimit(identifier, config);
      expect(result1.remaining).toBe(9);

      const result2 = rateLimit(identifier, config);
      expect(result2.remaining).toBe(8);
    });

    it('should return resetIn time', () => {
      const result = rateLimit('test-user-4', { limit: 5, window: 60 });
      expect(result.resetIn).toBeGreaterThan(0);
      expect(result.resetIn).toBeLessThanOrEqual(60);
    });

    it('should handle different identifiers separately', () => {
      const config = { limit: 3, window: 60 };

      const result1 = rateLimit('user-a', config);
      const result2 = rateLimit('user-b', config);

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result1.remaining).toBe(2);
      expect(result2.remaining).toBe(2);
    });

    it('should use default config when not provided', () => {
      const result = rateLimit('test-user-5');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeLessThanOrEqual(10);
    });
  });

  describe('getClientIdentifier', () => {
    it('should prioritize user ID', () => {
      const mockRequest = new Request('https://example.com', {
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });

      const identifier = getClientIdentifier(mockRequest, 'user123');
      expect(identifier).toBe('user:user123');
    });

    it('should use IP from x-forwarded-for header', () => {
      const mockRequest = new Request('https://example.com', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      });

      const identifier = getClientIdentifier(mockRequest);
      expect(identifier).toBe('ip:192.168.1.1');
    });

    it('should use IP from x-real-ip header if x-forwarded-for not present', () => {
      const mockRequest = new Request('https://example.com', {
        headers: { 'x-real-ip': '192.168.1.2' },
      });

      const identifier = getClientIdentifier(mockRequest);
      expect(identifier).toBe('ip:192.168.1.2');
    });

    it('should return unknown if no IP headers present', () => {
      const mockRequest = new Request('https://example.com');
      const identifier = getClientIdentifier(mockRequest);
      expect(identifier).toBe('ip:unknown');
    });
  });

  describe('RateLimitPresets', () => {
    it('should have AUTH preset', () => {
      expect(RateLimitPresets.AUTH).toEqual({ limit: 5, window: 15 * 60 });
    });

    it('should have API preset', () => {
      expect(RateLimitPresets.API).toEqual({ limit: 100, window: 60 });
    });

    it('should have PUBLIC preset', () => {
      expect(RateLimitPresets.PUBLIC).toEqual({ limit: 300, window: 60 });
    });

    it('should have WRITE preset', () => {
      expect(RateLimitPresets.WRITE).toEqual({ limit: 20, window: 60 });
    });

    it('should have SENSITIVE preset', () => {
      expect(RateLimitPresets.SENSITIVE).toEqual({ limit: 3, window: 5 * 60 });
    });
  });
});
