import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { ToastProvider } from './context/ToastContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </ToastProvider>
  </StrictMode>,
);
