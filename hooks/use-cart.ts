import { useCart } from '../contexts/CartContext';

// Re-export cart functionality from context for backwards compatibility
// This ensures all components share the same cart state
export function useShopifyCart() {
  const {
    cart,
    cartId,
    loading,
    error,
    items,
    itemCount,
    totalAmount,
    checkoutUrl,
    addItem,
    removeItem,
    updateItemQuantity,
    refreshCart,
  } = useCart();

  const clearCartId = () => {
    // This is now managed by the context
    console.warn('clearCartId is deprecated, cart state is managed by CartContext');
  };

  const createCart = async () => {
    // Cart is created automatically by the context
    console.warn('createCart is deprecated, cart is created automatically by CartContext');
    return cart;
  };

  return {
    cart,
    cartId,
    loading,
    error,
    items,
    itemCount,
    totalAmount,
    checkoutUrl,
    createCart,
    addItem,
    removeItem,
    updateItemQuantity,
    refreshCart,
    clearCartId,
  };
}

export default useShopifyCart;
