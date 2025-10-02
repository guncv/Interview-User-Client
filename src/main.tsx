import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { suppressLottieWarnings } from './utils/suppressLottieWarnings';

// Suppress Lottie buffer size mismatch warnings globally
suppressLottieWarnings();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
