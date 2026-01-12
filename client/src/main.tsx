import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CartProvider } from './context/CartContext'; // <--- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider> {/* <--- ENVOLVER LA APP */}
      <App />
    </CartProvider>
  </React.StrictMode>,
)