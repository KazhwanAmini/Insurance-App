// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './i18n'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
