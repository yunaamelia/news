import {
  isValidEmail,
  sanitizeString,
  validatePagination,
  validateArticleData,
  validateAssetData,
  validatePortfolioData,
  validateId,
  validateSearchQuery,
} from '../validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.id')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(200);
      expect(sanitizeString(longString, 10)).toHaveLength(10);
    });

    it('should not modify strings within limit', () => {
      expect(sanitizeString('test', 100)).toBe('test');
    });
  });

  describe('validatePagination', () => {
    it('should return valid pagination', () => {
      const result = validatePagination('2', '20');
      expect(result).toEqual({ page: 2, limit: 20 });
    });

    it('should use defaults', () => {
      const result = validatePagination();
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should throw error for invalid page', () => {
      expect(() => validatePagination('0', '10')).toThrow('Invalid page parameter');
      expect(() => validatePagination('-1', '10')).toThrow('Invalid page parameter');
      expect(() => validatePagination('abc', '10')).toThrow('Invalid page parameter');
    });

    it('should throw error for invalid limit', () => {
      expect(() => validatePagination('1', '0')).toThrow('Invalid limit parameter');
      expect(() => validatePagination('1', '101')).toThrow('Invalid limit parameter');
      expect(() => validatePagination('1', 'abc')).toThrow('Invalid limit parameter');
    });
  });

  describe('validateArticleData', () => {
    const validData = {
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'This is a test',
      content: 'Full content here',
      category: 'SAHAM',
      author: 'John Doe',
    };

    it('should validate correct data', () => {
      const result = validateArticleData(validData);
      expect(result.title).toBe('Test Article');
      expect(result.slug).toBe('test-article');
    });

    it('should sanitize and limit lengths', () => {
      const data = {
        ...validData,
        title: '  Test  ',
      };
      const result = validateArticleData(data);
      expect(result.title).toBe('Test');
    });

    it('should throw error for missing title', () => {
      const data: Record<string, unknown> = { ...validData };
      delete data.title;
      expect(() => validateArticleData(data)).toThrow('Title is required');
    });

    it('should throw error for empty title', () => {
      const data = { ...validData, title: '   ' };
      expect(() => validateArticleData(data)).toThrow('Title is required');
    });

    it('should throw error for missing slug', () => {
      const data: Record<string, unknown> = { ...validData };
      delete data.slug;
      expect(() => validateArticleData(data)).toThrow('Slug is required');
    });

    it('should set default values', () => {
      const result = validateArticleData(validData);
      expect(result.status).toBe('DRAFT');
      expect(result.isPremium).toBe(false);
      expect(result.tags).toEqual([]);
    });

    it('should handle tags', () => {
      const data = { ...validData, tags: ['tag1', 'tag2'] };
      const result = validateArticleData(data);
      expect(result.tags).toEqual(['tag1', 'tag2']);
    });
  });

  describe('validateAssetData', () => {
    const validData = {
      symbol: 'BBCA',
      assetType: 'SAHAM',
      name: 'Bank Central Asia',
    };

    it('should validate correct data', () => {
      const result = validateAssetData(validData);
      expect(result.symbol).toBe('BBCA');
      expect(result.assetType).toBe('SAHAM');
      expect(result.name).toBe('Bank Central Asia');
    });

    it('should convert symbol to uppercase', () => {
      const data = { ...validData, symbol: 'bbca' };
      const result = validateAssetData(data);
      expect(result.symbol).toBe('BBCA');
    });

    it('should throw error for invalid asset type', () => {
      const data = { ...validData, assetType: 'INVALID' };
      expect(() => validateAssetData(data)).toThrow('Valid asset type is required');
    });

    it('should throw error for missing symbol', () => {
      const data: Record<string, unknown> = { ...validData };
      delete data.symbol;
      expect(() => validateAssetData(data)).toThrow('Symbol is required');
    });

    it('should throw error for missing name', () => {
      const data: Record<string, unknown> = { ...validData };
      delete data.name;
      expect(() => validateAssetData(data)).toThrow('Name is required');
    });
  });

  describe('validatePortfolioData', () => {
    const validData = {
      symbol: 'BBCA',
      assetType: 'SAHAM',
      name: 'Bank Central Asia',
      quantity: 100,
      buyPrice: 9000,
      purchaseDate: '2024-01-15',
    };

    it('should validate correct data', () => {
      const result = validatePortfolioData(validData);
      expect(result.quantity).toBe(100);
      expect(result.buyPrice).toBe(9000);
      expect(result.purchaseDate).toBeInstanceOf(Date);
    });

    it('should throw error for invalid quantity', () => {
      const data = { ...validData, quantity: 0 };
      expect(() => validatePortfolioData(data)).toThrow('Valid quantity is required');
    });

    it('should throw error for negative quantity', () => {
      const data = { ...validData, quantity: -10 };
      expect(() => validatePortfolioData(data)).toThrow('Valid quantity is required');
    });

    it('should throw error for invalid buy price', () => {
      const data = { ...validData, buyPrice: 0 };
      expect(() => validatePortfolioData(data)).toThrow('Valid buy price is required');
    });

    it('should throw error for missing purchase date', () => {
      const data: Record<string, unknown> = { ...validData };
      delete data.purchaseDate;
      expect(() => validatePortfolioData(data)).toThrow('Purchase date is required');
    });

    it('should handle notes', () => {
      const data = { ...validData, notes: 'Test notes' };
      const result = validatePortfolioData(data);
      expect(result.notes).toBe('Test notes');
    });

    it('should handle null notes', () => {
      const result = validatePortfolioData(validData);
      expect(result.notes).toBeNull();
    });
  });

  describe('validateId', () => {
    it('should validate correct ID', () => {
      expect(validateId('abc123')).toBe('abc123');
    });

    it('should trim whitespace', () => {
      expect(validateId('  abc123  ')).toBe('abc123');
    });

    it('should throw error for empty string', () => {
      expect(() => validateId('')).toThrow('Valid ID is required');
      expect(() => validateId('   ')).toThrow('Valid ID is required');
    });

    it('should throw error for null', () => {
      expect(() => validateId(null)).toThrow('Valid ID is required');
    });
  });

  describe('validateSearchQuery', () => {
    it('should validate correct query', () => {
      expect(validateSearchQuery('test')).toBe('test');
    });

    it('should return null for empty query', () => {
      expect(validateSearchQuery(null)).toBeNull();
    });

    it('should throw error for too short query', () => {
      expect(() => validateSearchQuery('a')).toThrow('Search query must be at least 2 characters');
    });

    it('should sanitize query', () => {
      expect(validateSearchQuery('  test query  ')).toBe('test query');
    });
  });
});
