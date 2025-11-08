import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  submitCMSContent,
  fetchCMSContent,
  updateCMSContent,
  deleteCMSContent,
} from './api.service';
import type { CMSFormData } from '../types/cms.types';

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

describe('API Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('submitCMSContent', () => {
    it('should successfully submit valid form data and return complete content', async () => {
      const submitPromise = submitCMSContent(mockFormData);
      await vi.advanceTimersByTimeAsync(1000);
      const response = await submitPromise;

      // Verify user data is preserved
      expect(response.heading).toBe(mockFormData.heading);
      expect(response.description).toBe(mockFormData.description);
      expect(response.author).toBe(mockFormData.author);
      
      // Verify server-generated fields exist
      expect(response.id).toMatch(/^cms-\d+$/);
      expect(response.created_at).toBeDefined();
      expect(response.read_time_minutes).toBeGreaterThan(0);
      expect(response.updated_at).toBeUndefined();
    });

    it('should calculate read time based on content length', async () => {
      const longContent = 'word '.repeat(500); // 500 words
      const dataWithLongContent = { ...mockFormData, content: longContent };
      
      const submitPromise = submitCMSContent(dataWithLongContent);
      await vi.advanceTimersByTimeAsync(1000);
      const response = await submitPromise;

      // 500 words / 200 words per minute = 2.5, rounded up to 3
      expect(response.read_time_minutes).toBe(3);
    });

    it('should return unique IDs for multiple submissions', async () => {
      const promise1 = submitCMSContent(mockFormData);
      await vi.advanceTimersByTimeAsync(1000);
      const response1 = await promise1;

      const promise2 = submitCMSContent(mockFormData);
      await vi.advanceTimersByTimeAsync(1000);
      const response2 = await promise2;

      expect(response1.id).not.toBe(response2.id);
    });

    it('should use heading as SEO title when seo_title is empty', async () => {
      const dataWithoutSEO = {
        ...mockFormData,
        seo_title: '',
        heading: 'My Great Article',
      };
      
      const submitPromise = submitCMSContent(dataWithoutSEO);
      await vi.advanceTimersByTimeAsync(1000);
      const response = await submitPromise;

      expect(response.seo_title).toBe('My Great Article');
    });

    it('should use description as SEO description when seo_description is empty', async () => {
      const dataWithoutSEO = {
        ...mockFormData,
        seo_description: '',
        description: 'This is a very long description that should be truncated to 160 characters for SEO purposes. It contains a lot of text that goes beyond the recommended length.',
      };
      
      const submitPromise = submitCMSContent(dataWithoutSEO);
      await vi.advanceTimersByTimeAsync(1000);
      const response = await submitPromise;

      expect(response.seo_description).toBe(dataWithoutSEO.description.substring(0, 160));
      expect(response.seo_description.length).toBeLessThanOrEqual(160);
    });

    it('should keep user-provided SEO fields when not empty', async () => {
      const dataWithSEO = {
        ...mockFormData,
        seo_title: 'Custom SEO Title',
        seo_description: 'Custom SEO Description',
      };
      
      const submitPromise = submitCMSContent(dataWithSEO);
      await vi.advanceTimersByTimeAsync(1000);
      const response = await submitPromise;

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
      
      const submitPromise = submitCMSContent(dataWithWhitespace);
      await vi.advanceTimersByTimeAsync(1000);
      const response = await submitPromise;

      expect(response.seo_title).toBe('Fallback Heading');
      expect(response.seo_description).toBe('Fallback Description');
    });
  });

  describe('fetchCMSContent', () => {
    it('should successfully fetch complete content data by ID', async () => {
      const fetchPromise = fetchCMSContent('test-id-123');
      await vi.advanceTimersByTimeAsync(1000);
      const response = await fetchPromise;

      // Verify all fields including server-generated ones
      expect(response.id).toBe('test-id-123');
      expect(response.heading).toBe('Sample Article');
      expect(response.author).toBe('John Doe');
      expect(response.created_at).toBeDefined();
      expect(response.updated_at).toBeDefined();
      expect(response.read_time_minutes).toBe(5);
    });

    it('should return complete content structure', async () => {
      const fetchPromise = fetchCMSContent('test-id');
      await vi.advanceTimersByTimeAsync(1000);
      const response = await fetchPromise;

      // User fields
      expect(response).toHaveProperty('heading');
      expect(response).toHaveProperty('description');
      expect(response).toHaveProperty('content');
      expect(response).toHaveProperty('author');
      expect(response).toHaveProperty('keywords');
      expect(response).toHaveProperty('tags');
      
      // Server-generated fields
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('created_at');
      expect(response).toHaveProperty('read_time_minutes');
    });
  });

  describe('updateCMSContent', () => {
    it('should successfully update content and set updated_at', async () => {
      const updateData = { heading: 'Updated Title' };
      const updatePromise = updateCMSContent('test-id-123', updateData);
      await vi.advanceTimersByTimeAsync(2000);
      const response = await updatePromise;

      expect(response.id).toBe('test-id-123');
      expect(response.heading).toBe('Updated Title');
      expect(response.updated_at).toBeDefined();
    });

    it('should recalculate read time when content is updated', async () => {
      const newContent = 'word '.repeat(400); // 400 words
      const updatePromise = updateCMSContent('test-id', { content: newContent });
      await vi.advanceTimersByTimeAsync(2000);
      const response = await updatePromise;

      // 400 words / 200 = 2 minutes
      expect(response.read_time_minutes).toBe(2);
    });

    it('should accept partial form data', async () => {
      const partialUpdate = { heading: 'New Heading', author: 'New Author' };
      const updatePromise = updateCMSContent('test-id', partialUpdate);
      await vi.advanceTimersByTimeAsync(2000);
      const response = await updatePromise;

      expect(response.heading).toBe('New Heading');
      expect(response.author).toBe('New Author');
    });
  });

  describe('deleteCMSContent', () => {
    it('should successfully delete content', async () => {
      const deletePromise = deleteCMSContent('test-id-123');
      await vi.advanceTimersByTimeAsync(1000);
      const response = await deletePromise;

      expect(response.message).toBe('Content deleted successfully');
    });
  });

  describe('API Timing', () => {
    it('should simulate network delay', async () => {
      const submitPromise = submitCMSContent(mockFormData);
      expect(submitPromise).toBeInstanceOf(Promise);

      await vi.advanceTimersByTimeAsync(1000);
      await submitPromise;

      expect(vi.getTimerCount()).toBe(0);
    });
  });
});