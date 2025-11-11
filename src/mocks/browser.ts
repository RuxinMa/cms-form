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
 * Start MSW in development or when explicitly enabled in production
 */
export const startMocking = async () => {
  const useMock =
    import.meta.env.DEV ||
    import.meta.env.VITE_USE_MOCK === 'true' ||
    window.location.hostname.includes('vercel.app'); // Enable on Vercel preview deployments

  if (useMock) {
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
  } else {
    console.log('🚫 MSW not started (VITE_USE_MOCK not set)');
  }
};
