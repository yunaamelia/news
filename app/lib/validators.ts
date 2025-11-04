/**
 * Validation schemas and utility functions for API route input validation
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate and sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength);
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: string, limit?: string) {
  const pageNum = parseInt(page || "1");
  const limitNum = parseInt(limit || "10");

  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error("Invalid page parameter");
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new Error("Invalid limit parameter (must be between 1-100)");
  }

  return { page: pageNum, limit: limitNum };
}

/**
 * Validate article creation data
 */
export function validateArticleData(data: Record<string, unknown>) {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!data.slug || typeof data.slug !== "string" || data.slug.trim().length === 0) {
    errors.push("Slug is required");
  }

  if (!data.excerpt || typeof data.excerpt !== "string") {
    errors.push("Excerpt is required");
  }

  if (!data.content || typeof data.content !== "string") {
    errors.push("Content is required");
  }

  if (!data.category || typeof data.category !== "string") {
    errors.push("Category is required");
  }

  if (!data.author || typeof data.author !== "string") {
    errors.push("Author is required");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    title: sanitizeString(data.title as string, 200),
    slug: sanitizeString(data.slug as string, 200),
    excerpt: sanitizeString(data.excerpt as string, 500),
    content: sanitizeString(data.content as string, 50000),
    coverImage: data.coverImage ? sanitizeString(data.coverImage as string, 500) : null,
    category: data.category as "SAHAM" | "KRIPTO" | "ANALISIS" | "EDUKASI" | "REGULASI" | "TEKNOLOGI",
    tags: Array.isArray(data.tags) ? data.tags.slice(0, 10) : [],
    author: sanitizeString(data.author as string, 100),
    authorImage: data.authorImage ? sanitizeString(data.authorImage as string, 500) : null,
    status: (data.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
    isPremium: Boolean(data.isPremium),
  };
}

/**
 * Validate watchlist/portfolio data
 */
export function validateAssetData(data: Record<string, unknown>) {
  const errors: string[] = [];

  if (!data.symbol || typeof data.symbol !== "string" || data.symbol.trim().length === 0) {
    errors.push("Symbol is required");
  }

  if (!data.assetType || !["SAHAM", "KRIPTO"].includes(data.assetType as string)) {
    errors.push("Valid asset type is required (SAHAM or KRIPTO)");
  }

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    symbol: sanitizeString((data.symbol as string).toUpperCase(), 20),
    assetType: data.assetType as "SAHAM" | "KRIPTO",
    name: sanitizeString(data.name as string, 100),
  };
}

/**
 * Validate portfolio entry data
 */
export function validatePortfolioData(data: Record<string, unknown>) {
  const assetData = validateAssetData(data);
  const errors: string[] = [];

  if (typeof data.quantity !== "number" || data.quantity <= 0) {
    errors.push("Valid quantity is required");
  }

  if (typeof data.buyPrice !== "number" || data.buyPrice <= 0) {
    errors.push("Valid buy price is required");
  }

  if (!data.purchaseDate) {
    errors.push("Purchase date is required");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    ...assetData,
    quantity: parseFloat((data.quantity as number).toString()),
    buyPrice: parseFloat((data.buyPrice as number).toString()),
    purchaseDate: new Date(data.purchaseDate as string),
    notes: data.notes ? sanitizeString(data.notes as string, 500) : null,
  };
}

/**
 * Validate ID parameter
 */
export function validateId(id: string | null): string {
  if (!id || id.trim().length === 0) {
    throw new Error("Valid ID is required");
  }
  return id.trim();
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string | null): string | null {
  if (!query) return null;
  const sanitized = sanitizeString(query, 200);
  if (sanitized.length < 2) {
    throw new Error("Search query must be at least 2 characters");
  }
  return sanitized;
}
