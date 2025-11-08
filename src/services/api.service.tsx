import type { CMSFormData, CMSContentData } from '../types/cms.types';

/**
 * API Service for CMS operations
 * 
 * This service mocks API calls for development and testing.
 * In production, replace these with actual HTTP requests.
 */

const API_DELAY = 1000;
const FAILURE_RATE = 0;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Submit CMS content to the server (mocked)
 */
export async function submitCMSContent(
  data: CMSFormData
): Promise<CMSContentData> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  if (Math.random() < FAILURE_RATE) {
    throw new Error('Failed to submit content. Please try again.');
  }

  if (!data.heading || !data.description || !data.content) {
    throw new Error('Missing required fields');
  }

  const wordCount = data.content.split(/\s+/).filter(word => word.length > 0).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Apply SEO defaults if fields are empty
  const seoTitle = data.seo_title.trim() 
    ? data.seo_title 
    : data.heading.substring(0, 60);
  
  const seoDescription = data.seo_description.trim()
    ? data.seo_description
    : data.description.substring(0, 160);

  const response: CMSContentData = {
    ...data,
    seo_title: seoTitle,
    seo_description: seoDescription,
    id: `cms-${Date.now()}`,
    created_at: new Date().toISOString(),
    read_time_minutes: readTime,
  };

  return response;
}

/**
 * Fetch CMS content by ID (mocked)
 */
export async function fetchCMSContent(
  id: string
): Promise<CMSContentData> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  if (!id) {
    throw new Error('Content ID is required');
  }

  const mockData: CMSContentData = {
    heading: 'Sample Article',
    description: 'This is a sample article description',
    slug: 'sample-article',
    content: 'This is the main content of the article. '.repeat(50),
    keywords: ['sample', 'article'],
    author: 'John Doe',
    status: 'published',
    category: 'blog',
    featured_image: 'https://example.com/image.jpg',
    is_featured: true,
    tags: ['technology', 'development'],
    seo_title: 'Sample Article - SEO Title',
    seo_description: 'This is the SEO description for the sample article',
    id,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-15T14:30:00Z',
    read_time_minutes: 5,
  };

  return mockData;
}

/**
 * Update existing CMS content (mocked)
 */
export async function updateCMSContent(
  id: string,
  data: Partial<CMSFormData>
): Promise<CMSContentData> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  if (!id) {
    throw new Error('Content ID is required');
  }

  const existingData = await fetchCMSContent(id);

  const updatedData: CMSContentData = {
    ...existingData,
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (data.content) {
    const wordCount = data.content.split(/\s+/).filter(word => word.length > 0).length;
    updatedData.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
  }

  return updatedData;
}

/**
 * Delete CMS content (mocked)
 */
export async function deleteCMSContent(
  id: string
): Promise<{ message: string }> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  if (!id) {
    throw new Error('Content ID is required');
  }

  return {
    message: 'Content deleted successfully',
  };
}