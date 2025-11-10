import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Enable MSW in development
 */
async function enableMocking() {
  if (import.meta.env.DEV) {
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