/**
 * MSW API Handlers
 */

import { http, HttpResponse, delay } from 'msw';
import type { CMSFormData, CMSContentData } from '@/types/cms.types';

const API_BASE_URL = '/api';
const NETWORK_DELAY = 1200;

/**
 * POST /api/cms/content - Submit CMS form
 */
const submitContent = http.post(
  `${API_BASE_URL}/cms/content`,
  async ({ request }) => {
    await delay(NETWORK_DELAY);

    try {
      const data = (await request.json()) as CMSFormData;

      // Validation
      if (!data.heading || !data.description || !data.content) {
        return HttpResponse.json(
          {
            success: false,
            error: 'Missing required fields: heading, description, or content',
          },
          { status: 400 }
        );
      }

      if (data.heading.length < 3) {
        return HttpResponse.json(
          {
            success: false,
            error: 'Heading must be at least 3 characters long',
          },
          { status: 400 }
        );
      }

      // Calculate read time
      const wordCount = data.content
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      // Apply SEO defaults if empty
      const seoTitle = data.seo_title?.trim()
        ? data.seo_title
        : data.heading.substring(0, 60);

      const seoDescription = data.seo_description?.trim()
        ? data.seo_description
        : data.description.substring(0, 160);

      // Create response
      const response: CMSContentData = {
        ...data,
        seo_title: seoTitle,
        seo_description: seoDescription,
        id: `cms-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        created_at: new Date().toISOString(),
        // ✅ updated_at is undefined on first submission
        // It will only be set when editing existing content
        read_time_minutes: readTime,
      };

      console.log('✅ CMS Content Submitted:', {
        id: response.id,
        heading: response.heading,
        wordCount,
        readTime,
        created_at: response.created_at,
        updated_at: response.updated_at, // Should be undefined
      });

      return HttpResponse.json(
        {
          success: true,
          data: response,
          message: 'Content created successfully',
        },
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': `req-${Date.now()}`,
          },
        }
      );
    } catch (error) {
      console.error('❌ Error processing request:', error);

      return HttpResponse.json(
        {
          success: false,
          error: 'Internal server error',
        },
        { status: 500 }
      );
    }
  }
);

export const handlers = [submitContent];