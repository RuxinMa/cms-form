/**
 * MSW Browser Setup
 * 
 * Configures and starts Mock Service Worker (MSW) for browser environments.
 * Works in both development and deployed environments (e.g. Vercel).
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create MSW worker
export const worker = setupWorker(...handlers);

/**
 * Starts MSW conditionally based on environment.
 * Includes extensive logging for easier debugging and deployment verification.
 */
export const startMocking = async () => {
  const host = window.location.hostname;
  const useMock =
    import.meta.env.DEV ||
    import.meta.env.VITE_USE_MOCK === 'true' ||
    host.includes('vercel.app') ||
    host.includes('cms-form'); // fallback for custom or production domains

  console.log(`[MSW] Environment check → DEV: ${import.meta.env.DEV}, VITE_USE_MOCK: ${import.meta.env.VITE_USE_MOCK}, host: ${host}`);

  if (!useMock) {
    console.log('🚫 MSW not started — mock mode disabled for this environment.');
    return;
  }

  try {
    console.log('[MSW] Attempting to start worker...');
    await worker
      .start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      })
      .then(() => {
        console.log('🎭 MSW: Mock API enabled');
        console.log('📡 Endpoint: POST /api/cms/content');
        console.log('[MSW] Worker registered ✅');
      });
  } catch (error) {
    console.error('[MSW] Worker registration failed ❌', error);
  }

  // Debug helper: confirm registration
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => {
      if (regs.length === 0) {
        console.warn('[MSW] No service worker registrations found — mock API may not intercept requests.');
      } else {
        console.log(`[MSW] Active registrations: ${regs.length}`);
        regs.forEach((r) =>
          console.log('[MSW] Registered scope →', r.scope)
        );
      }
    })
    .catch((err) => console.error('[MSW] Error checking registrations:', err));
};
