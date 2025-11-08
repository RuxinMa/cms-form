/* eslint-disable no-useless-escape */
/**
 * Generates a URL-friendly slug from a given text string
 * 
 * Rules:
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters (keeps alphanumeric and hyphens)
 * - Removes consecutive hyphens
 * - Trims hyphens from start and end
 * 
 * @param text - The input text to convert to a slug
 * @returns A URL-friendly slug string
 * 
 * @example
 * generateSlug("My First Article") // returns "my-first-article"
 * generateSlug("Hello World!") // returns "hello-world"
 * generateSlug("  Multiple   Spaces  ") // returns "multiple-spaces"
 */
export function generateSlug(text: string | null | undefined): string {
  // Handle null, undefined, or empty string
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()                      // Convert to lowercase
    .trim()                             // Remove leading/trailing whitespace
    .replace(/\s+/g, '-')               // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')           // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-')             // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')                 // Trim hyphens from start
    .replace(/-+$/, '');                // Trim hyphens from end
}