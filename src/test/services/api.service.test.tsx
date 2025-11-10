import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { submitCMSContent } from '@/services/api.service';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import type { CMSFormData } from '@/types/cms.types';

describe('API Service with MSW', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  const mockFormData: CMSFormData = {
    heading: 'Test Article',
    description: 'Test description',
    slug: 'test-article',
    content: 'Test content with some words here',
    keywords: ['test'],
    author: 'Test Author',
    status: 'draft',
    category: 'blog',
    featured_image: '',
    is_featured: false,
    tags: ['test'],
    seo_title: '',
    seo_description: '',
  };

  describe('submitCMSContent', () => {
    it('should successfully submit valid form data and return complete content', async () => {
      const response = await submitCMSContent(mockFormData);

      // Verify user data is preserved
      expect(response.heading).toBe(mockFormData.heading);
      expect(response.description).toBe(mockFormData.description);
      expect(response.author).toBe(mockFormData.author);

      // Verify server-generated fields
      expect(response.id).toMatch(/^cms-\d+-[a-z0-9]+$/);
      expect(response.created_at).toBeDefined();
      expect(response.read_time_minutes).toBeGreaterThan(0);
      expect(response.updated_at).toBeUndefined();

      // Verify created_at is valid ISO string
      expect(() => new Date(response.created_at)).not.toThrow();
      const createdDate = new Date(response.created_at);
      expect(createdDate.toISOString()).toBe(response.created_at);
    });

    it('should not include updated_at field on first submission', async () => {
      const response = await submitCMSContent(mockFormData);

      // updated_at should not exist
      expect(response.updated_at).toBeUndefined();
      expect(response).not.toHaveProperty('updated_at');
    });

    it('should include created_at timestamp', async () => {
      const beforeSubmit = new Date();
      const response = await submitCMSContent(mockFormData);
      const afterSubmit = new Date();

      expect(response.created_at).toBeDefined();

      const createdAt = new Date(response.created_at);
      
      // Created time should be between before and after
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeSubmit.getTime() - 2000);
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterSubmit.getTime() + 2000);
    });

    it('should calculate read time based on content length', async () => {
      const longContent = 'word '.repeat(500); // 500 words
      const dataWithLongContent = {
        ...mockFormData,
        content: longContent,
      };

      const response = await submitCMSContent(dataWithLongContent);

      // 500 words / 200 words per minute = 2.5, rounded up to 3
      expect(response.read_time_minutes).toBe(3);
      expect(response.updated_at).toBeUndefined();
    });

    it('should handle minimum read time of 1 minute', async () => {
      const shortContent = 'Short';
      const dataWithShortContent = {
        ...mockFormData,
        content: shortContent,
      };

      const response = await submitCMSContent(dataWithShortContent);

      expect(response.read_time_minutes).toBe(1);
      expect(response.updated_at).toBeUndefined();
    });

    it('should return unique IDs for multiple submissions', async () => {
      const response1 = await submitCMSContent(mockFormData);
      const response2 = await submitCMSContent(mockFormData);

      expect(response1.id).not.toBe(response2.id);
      expect(response1.updated_at).toBeUndefined();
      expect(response2.updated_at).toBeUndefined();
    });

    it('should use heading as SEO title when seo_title is empty', async () => {
      const dataWithoutSEO = {
        ...mockFormData,
        seo_title: '',
        heading: 'My Great Article',
      };

      const response = await submitCMSContent(dataWithoutSEO);

      expect(response.seo_title).toBe('My Great Article');
      expect(response.updated_at).toBeUndefined();
    });

    it('should truncate heading for SEO title if longer than 60 chars', async () => {
      const longHeading = 'A'.repeat(100);
      const dataWithLongHeading = {
        ...mockFormData,
        seo_title: '',
        heading: longHeading,
      };

      const response = await submitCMSContent(dataWithLongHeading);

      expect(response.seo_title).toBe(longHeading.substring(0, 60));
      expect(response.seo_title.length).toBe(60);
    });

    it('should use description as SEO description when seo_description is empty', async () => {
      const longDescription = 'a'.repeat(160);
      const dataWithoutSEO = {
        ...mockFormData,
        seo_description: '',
        description: longDescription,
      };

      const response = await submitCMSContent(dataWithoutSEO);

      expect(response.seo_description).toBe(longDescription.substring(0, 160));
      expect(response.seo_description.length).toBe(160);
    });

    it('should keep user-provided SEO fields when not empty', async () => {
      const dataWithSEO = {
        ...mockFormData,
        seo_title: 'Custom SEO Title',
        seo_description: 'Custom SEO Description',
      };

      const response = await submitCMSContent(dataWithSEO);

      expect(response.seo_title).toBe('Custom SEO Title');
      expect(response.seo_description).toBe('Custom SEO Description');
    });

    it('should handle whitespace-only SEO fields as empty', async () => {
      const dataWithWhitespace = {
        ...mockFormData,
        seo_title: '   ',
        seo_description: '  ',
        heading: 'Fallback Heading',
        description: 'Fallback Description',
      };

      const response = await submitCMSContent(dataWithWhitespace);

      expect(response.seo_title).toBe('Fallback Heading');
      expect(response.seo_description).toBe('Fallback Description');
    });

    it('should preserve all form fields in response', async () => {
      const completeData: CMSFormData = {
        heading: 'Complete Test',
        description: 'Complete description',
        slug: 'complete-test',
        content: 'Complete content here',
        keywords: ['keyword1', 'keyword2'],
        author: 'Complete Author',
        status: 'published',
        category: 'news',
        featured_image: 'https://example.com/image.jpg',
        is_featured: true,
        tags: ['tag1', 'tag2'],
        seo_title: 'SEO Title',
        seo_description: 'SEO Description',
      };

      const response = await submitCMSContent(completeData);

      expect(response.keywords).toEqual(completeData.keywords);
      expect(response.tags).toEqual(completeData.tags);
      expect(response.status).toBe(completeData.status);
      expect(response.category).toBe(completeData.category);
      expect(response.featured_image).toBe(completeData.featured_image);
      expect(response.is_featured).toBe(completeData.is_featured);
      expect(response.updated_at).toBeUndefined();
    });

    it('should throw error when heading is missing', async () => {
      const invalidData = {
        ...mockFormData,
        heading: '',
      };

      await expect(submitCMSContent(invalidData)).rejects.toThrow(
        /Missing required fields/i
      );
    });

    it('should throw error when description is missing', async () => {
      const invalidData = {
        ...mockFormData,
        description: '',
      };

      await expect(submitCMSContent(invalidData)).rejects.toThrow(
        /Missing required fields/i
      );
    });

    it('should throw error when content is missing', async () => {
      const invalidData = {
        ...mockFormData,
        content: '',
      };

      await expect(submitCMSContent(invalidData)).rejects.toThrow(
        /Missing required fields/i
      );
    });

    it('should throw error when heading is too short', async () => {
      const invalidData = {
        ...mockFormData,
        heading: 'AB',
      };

      await expect(submitCMSContent(invalidData)).rejects.toThrow(
        /at least 3 characters/i
      );
    });

    it('should handle server errors gracefully', async () => {
      server.use(
        http.post('/api/cms/content', () => {
          return HttpResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
          );
        })
      );

      await expect(submitCMSContent(mockFormData)).rejects.toThrow(
        /Internal server error/i
      );
    });

    it('should handle network errors', async () => {
      server.use(
        http.post('/api/cms/content', () => {
          return HttpResponse.error();
        })
      );

      await expect(submitCMSContent(mockFormData)).rejects.toThrow();
    });

    it('should handle special characters in content', async () => {
      const dataWithSpecialChars = {
        ...mockFormData,
        heading: 'Test with "quotes" & <symbols>',
        content: 'Content with émojis 🎉 and spëcial çhars',
      };

      const response = await submitCMSContent(dataWithSpecialChars);

      expect(response.heading).toBe(dataWithSpecialChars.heading);
      expect(response.content).toBe(dataWithSpecialChars.content);
      expect(response.updated_at).toBeUndefined();
    });
  });

  describe('API Response Structure', () => {
    it('should return all expected fields in response', async () => {
      const response = await submitCMSContent(mockFormData);

      // User input fields
      expect(response).toHaveProperty('heading');
      expect(response).toHaveProperty('description');
      expect(response).toHaveProperty('slug');
      expect(response).toHaveProperty('content');
      expect(response).toHaveProperty('keywords');
      expect(response).toHaveProperty('author');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('category');
      expect(response).toHaveProperty('is_featured');
      expect(response).toHaveProperty('tags');
      expect(response).toHaveProperty('seo_title');
      expect(response).toHaveProperty('seo_description');

      // Server-generated fields
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('created_at');
      expect(response).toHaveProperty('read_time_minutes');

      // updated_at should not exist on first submission
      expect(response).not.toHaveProperty('updated_at');
    });

    it('should have correct data types for all fields', async () => {
      const response = await submitCMSContent(mockFormData);

      expect(typeof response.heading).toBe('string');
      expect(typeof response.id).toBe('string');
      expect(typeof response.created_at).toBe('string');
      expect(typeof response.read_time_minutes).toBe('number');
      
      // updated_at should be undefined, not a string
      expect(response.updated_at).toBeUndefined();
    });
  });

  describe('Timestamp Behavior', () => {
    it('should only set created_at on first submission', async () => {
      const response = await submitCMSContent(mockFormData);

      expect(response.created_at).toBeDefined();
      expect(response.updated_at).toBeUndefined();
    });

    it('should generate valid ISO 8601 timestamp for created_at', async () => {
      const response = await submitCMSContent(mockFormData);

      // Should match ISO 8601 format
      expect(response.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // Should be parseable
      const date = new Date(response.created_at);
      expect(date.toISOString()).toBe(response.created_at);
    });
  });
});