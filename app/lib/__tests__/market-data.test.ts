import {
  formatIDR,
  formatNumber,
  calculatePercentageChange,
} from '../market-data';

describe('Market Data Utils', () => {
  describe('formatIDR', () => {
    it('should format positive numbers correctly', () => {
      const result = formatIDR(1000000);
      expect(result).toContain('1.000.000');
      expect(result).toContain('Rp');
    });

    it('should handle zero', () => {
      const result = formatIDR(0);
      expect(result).toContain('Rp');
      expect(result).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatIDR(-500);
      expect(result).toContain('-');
      expect(result).toContain('500');
    });

    it('should not show decimal places', () => {
      const result = formatIDR(1000.99);
      expect(result).not.toContain(',99');
    });

    it('should format large numbers', () => {
      const result = formatIDR(1000000000);
      expect(result).toContain('1.000.000.000');
    });
  });

  describe('formatNumber', () => {
    it('should format with default 2 decimals', () => {
      expect(formatNumber(1234.56)).toContain('1.234,56');
    });

    it('should format with custom decimals', () => {
      expect(formatNumber(1234.5678, 3)).toContain('1.234,568');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(-1234.56);
      expect(result).toContain('-');
      expect(result).toContain('1.234');
    });

    it('should format with 0 decimals', () => {
      expect(formatNumber(1234.56, 0)).toContain('1.235');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive change', () => {
      expect(calculatePercentageChange(110, 100)).toBe(10);
    });

    it('should calculate negative change', () => {
      expect(calculatePercentageChange(90, 100)).toBe(-10);
    });

    it('should handle zero current value', () => {
      expect(calculatePercentageChange(0, 100)).toBe(-100);
    });

    it('should handle zero previous value', () => {
      expect(calculatePercentageChange(100, 0)).toBe(0);
    });

    it('should handle same values', () => {
      expect(calculatePercentageChange(100, 100)).toBe(0);
    });

    it('should calculate decimal changes', () => {
      expect(calculatePercentageChange(105, 100)).toBe(5);
      expect(calculatePercentageChange(102.5, 100)).toBe(2.5);
    });

    it('should handle large percentage changes', () => {
      expect(calculatePercentageChange(200, 100)).toBe(100);
      expect(calculatePercentageChange(300, 100)).toBe(200);
    });

    it('should handle negative values', () => {
      // (-50 - (-100)) / -100 * 100 = 50 / -100 * 100 = -50
      expect(calculatePercentageChange(-50, -100)).toBe(-50);
    });
  });
});
