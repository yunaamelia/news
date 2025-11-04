import {
  cn,
  formatDate,
  formatRelativeTime,
  slugify,
  truncate,
  formatCurrency,
  formatPercentage,
  getColorClass,
} from '../utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('15');
      expect(formatted).toContain('Januari');
      expect(formatted).toContain('2024');
    });

    it('should handle string input', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('15');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "Baru saja" for recent times', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('Baru saja');
    });

    it('should return minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 menit lalu');
    });

    it('should return hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 jam lalu');
    });

    it('should return days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 hari lalu');
    });

    it('should return formatted date for old dates', () => {
      const oldDate = new Date('2020-01-15');
      const result = formatRelativeTime(oldDate);
      expect(result).toContain('15');
      expect(result).toContain('2020');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello, World! 123')).toBe('hello-world-123');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should trim whitespace', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('Short text', 20)).toBe('Short text');
    });

    it('should truncate long text', () => {
      expect(truncate('This is a very long text', 10)).toBe('This is a ...');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('formatCurrency', () => {
    it('should format IDR currency', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('1.000.000');
      expect(formatted).toContain('Rp');
    });

    it('should handle zero', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('Rp');
    });

    it('should handle negative numbers', () => {
      const formatted = formatCurrency(-500);
      expect(formatted).toContain('-');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentage', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%');
    });

    it('should format negative percentage', () => {
      expect(formatPercentage(-3.2)).toBe('-3.20%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('+0.00%');
    });

    it('should handle custom decimals', () => {
      expect(formatPercentage(5.555, 1)).toBe('+5.6%');
    });
  });

  describe('getColorClass', () => {
    it('should return green for positive values', () => {
      expect(getColorClass(5)).toBe('text-green-600');
    });

    it('should return red for negative values', () => {
      expect(getColorClass(-5)).toBe('text-red-600');
    });

    it('should return gray for zero', () => {
      expect(getColorClass(0)).toBe('text-gray-600');
    });
  });
});
