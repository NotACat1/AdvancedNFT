import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@config/wagmi.config';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);

  const queryClient = new QueryClient();

  root.render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>,
  );
}
