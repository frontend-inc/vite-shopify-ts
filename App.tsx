import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/cart-context';
import Home from '@/components/Home';
import ProductDetail from './components/product-detail';
import Collections from './components/Collections';
import CollectionDetail from './components/collection-detail';
import CartDrawer from './components/cart-drawer';
import Header from './components/shop-header';
import Footer from './components/shop-footer';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:handle" element={<CollectionDetail />} />
          <Route path="/products/:handle" element={<ProductDetail />} />
        </Routes>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;