/**
 * Calculate estimated reading time for an article
 * Based on average reading speed of 200 words per minute
 * @param content - The article content (HTML or plain text)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;

  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, "");

  // Count words (split by whitespace and filter empty strings)
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;

  // Calculate reading time in minutes (minimum 1 minute)
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);

  return Math.max(1, minutes);
}

/**
 * Format reading time into Indonesian text
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 menit" or "1 menit"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} menit`;
}

/**
 * Calculate reading time and return formatted string
 * @param content - The article content
 * @returns Formatted reading time string
 */
export function getReadingTime(content: string): string {
  const minutes = calculateReadingTime(content);
  return formatReadingTime(minutes);
}
