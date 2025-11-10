import { describe, it, expect } from 'vitest';
import { generateSlug } from '../../utils/generateSlug';

describe('generateSlug', () => {
  describe('Basic Transformations', () => {
    it('should convert uppercase to lowercase', () => {
      expect(generateSlug('HELLO WORLD')).toBe('hello-world');
    });

    it('should convert mixed case to lowercase', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('my first article')).toBe('my-first-article');
    });

    it('should replace multiple spaces with single hyphen', () => {
      expect(generateSlug('multiple   spaces   here')).toBe('multiple-spaces-here');
    });
  });

  describe('Special Characters', () => {
    it('should remove special characters', () => {
      expect(generateSlug('Hello@World!')).toBe('helloworld');
    });

    it('should remove punctuation', () => {
      expect(generateSlug('Hello, World!')).toBe('hello-world');
    });

    it('should handle parentheses and brackets', () => {
      expect(generateSlug('Article (Part 1) [Draft]')).toBe('article-part-1-draft');
    });

    it('should handle quotes', () => {
      expect(generateSlug(`Article's "Title"`)).toBe('articles-title');
    });

    it('should handle ampersands', () => {
      expect(generateSlug('React & TypeScript')).toBe('react-typescript');
    });
  });

  describe('Whitespace Handling', () => {
    it('should trim leading whitespace', () => {
      expect(generateSlug('  hello world')).toBe('hello-world');
    });

    it('should trim trailing whitespace', () => {
      expect(generateSlug('hello world  ')).toBe('hello-world');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(generateSlug('  hello world  ')).toBe('hello-world');
    });

    it('should handle tabs and newlines', () => {
      expect(generateSlug('hello\tworld\nnew')).toBe('hello-world-new');
    });
  });

  describe('Hyphen Handling', () => {
    it('should preserve existing hyphens', () => {
      expect(generateSlug('pre-existing-hyphens')).toBe('pre-existing-hyphens');
    });

    it('should replace multiple consecutive hyphens with single hyphen', () => {
      expect(generateSlug('hello---world')).toBe('hello-world');
    });

    it('should remove leading hyphens', () => {
      expect(generateSlug('---hello-world')).toBe('hello-world');
    });

    it('should remove trailing hyphens', () => {
      expect(generateSlug('hello-world---')).toBe('hello-world');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(generateSlug('---hello-world---')).toBe('hello-world');
    });
  });

  describe('Numbers', () => {
    it('should preserve numbers', () => {
      expect(generateSlug('Article 123')).toBe('article-123');
    });

    it('should handle numbers at start', () => {
      expect(generateSlug('2024 Review')).toBe('2024-review');
    });

    it('should handle numbers at end', () => {
      expect(generateSlug('Version 2')).toBe('version-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle null', () => {
      expect(generateSlug(null)).toBe('');
    });

    it('should handle undefined', () => {
      expect(generateSlug(undefined)).toBe('');
    });

    it('should handle string with only special characters', () => {
      expect(generateSlug('!@#$%^&*()')).toBe('');
    });

    it('should handle string with only spaces', () => {
      expect(generateSlug('     ')).toBe('');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(200) + ' ' + 'b'.repeat(200);
      const result = generateSlug(longString);
      expect(result).toContain('-');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Real-world Examples', () => {
    it('should handle typical article title', () => {
      expect(generateSlug('How to Learn React in 2024')).toBe('how-to-learn-react-in-2024');
    });

    it('should handle title with colon', () => {
      expect(generateSlug('Tutorial: Getting Started')).toBe('tutorial-getting-started');
    });

    it('should handle title with question mark', () => {
      expect(generateSlug('What is TypeScript?')).toBe('what-is-typescript');
    });

    it('should handle title with slashes', () => {
      expect(generateSlug('React/Vue Comparison')).toBe('reactvue-comparison');
    });

    it('should handle CMS-style title', () => {
      expect(generateSlug('My Awesome Blog Post!')).toBe('my-awesome-blog-post');
    });
  });
});