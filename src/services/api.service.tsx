/**
 * API Service for CMS operations
 * 
 * Makes HTTP requests to backend API
 * In development, requests are intercepted by MSW
 */

import type { CMSFormData, CMSContentData } from '@/types/cms.types';

const API_BASE_URL = '/api';

/**
 * API Response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Submit CMS content to the server
 * 
 * @param data - Form data to submit
 * @returns Created content data with generated ID
 * @throws Error if submission fails
 * 
 * @example
 * ```typescript
 * const result = await submitCMSContent({
 *   heading: 'My Article',
 *   description: 'Article description',
 *   content: 'Article content...',
 *   // ... other fields
 * });
 * console.log('Created:', result.id);
 * ```
 */
export async function submitCMSContent(
  data: CMSFormData
): Promise<CMSContentData> {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<CMSContentData> = await response.json();

    // Handle error responses
    if (!response.ok || !result.success) {
      throw new Error(result.error || `HTTP ${response.status}: Failed to submit content`);
    }

    // Validate response data
    if (!result.data) {
      throw new Error('No data returned from server');
    }

    return result.data;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while submitting content');
  }
}