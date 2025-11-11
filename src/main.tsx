import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Enable MSW in development or when explicitly allowed in production
 */
async function enableMocking() {
  const useMock =
    import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true';

  if (useMock) {
    const { startMocking } = await import('./mocks/browser');
    return startMocking();
  }
}

// Start app after MSW is ready
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
