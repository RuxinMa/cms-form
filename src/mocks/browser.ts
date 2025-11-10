/**
 * MSW Browser Setup
 * 
 * Configures Mock Service Worker for browser environment
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create MSW worker
export const worker = setupWorker(...handlers);

/**
 * Start MSW in development mode
 */
export const startMocking = async () => {
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      console.log('🎭 MSW: Mock API enabled');
      console.log('📡 Endpoint: POST /api/cms/content');
    } catch (error) {
      console.error('Failed to start MSW:', error);
    }
  }
};