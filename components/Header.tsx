import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartIcon: React.FC = () => {
  const { state, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-1 text-black hover:text-gray-600 transition-colors"
    >
      <i className="ri-shopping-cart-line text-xl"></i>
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  );
};

const Header: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30 h-14">
      <div className="max-w-6xl mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold text-black font-heading">
            Store
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm text-black hover:text-gray-600 font-medium transition-colors font-heading"
            >
              Products
            </Link>
            <Link
              to="/collections"
              className="text-sm text-black hover:text-gray-600 font-medium transition-colors font-heading"
            >
              Collections
            </Link>

            {/* Cart Icon */}
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
