import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { createCart, addCartLines, redirectToCheckout } from '../services/shopify/api.js';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  AnimatePresence,
} from './ui/sheet';

const CartDrawer: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      // Create a new cart
      const cart = await createCart();

      // Add items to the cart
      const lines = state.items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));

      if (lines.length > 0) {
        const updatedCart = await addCartLines(cart.id, lines);
        // Redirect to Shopify checkout
        redirectToCheckout(updatedCart.checkoutUrl);
      } else {
        // If cart is empty, just create an empty cart and redirect
        redirectToCheckout(cart.checkoutUrl);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to proceed to checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()} side="right">
      <AnimatePresence>
        {state.isOpen && (
          <SheetContent className="w-full max-w-md" showCloseButton={false}>
            {/* Header */}
            <SheetHeader className="h-14 min-h-0 px-4 py-3 flex items-center">
              <div className="flex items-center justify-between w-full">
                <SheetTitle className="text-base font-heading">
                  Shopping Cart ({state.itemCount})
                </SheetTitle>
                <Button
                  onClick={closeCart}
                  variant="ghost"
                  size="icon-sm"
                >
                  <i className="ri-close-line text-xl"></i>
                </Button>
              </div>
            </SheetHeader>

            {/* Cart Items */}
            <SheetBody>
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4 block"></i>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started!</p>
                  <Button
                    onClick={closeCart}
                    className="font-heading"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.variantId} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="ri-image-line text-2xl"></i>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h4>

                        {/* Variant Info */}
                        {item.variant.selectedOptions.length > 0 && (
                          <div className="text-sm text-gray-500 mb-2">
                            {item.variant.selectedOptions.map((option, index) => (
                              <span key={option.name}>
                                {option.value}
                                {index < item.variant.selectedOptions.length - 1 ? ' / ' : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              variant="ghost"
                              size="icon-sm"
                              disabled={item.quantity <= 1}
                              className="h-7 w-7"
                            >
                              <i className="ri-subtract-line text-sm"></i>
                            </Button>
                            <span className="px-2 py-1 font-semibold min-w-[30px] text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              variant="ghost"
                              size="icon-sm"
                              className="h-7 w-7"
                            >
                              <i className="ri-add-line text-sm"></i>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-900">
                          ${parseFloat(item.price.amount).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="flex-shrink-0">
                        <Button
                          onClick={() => removeItem(item.variantId)}
                          variant="ghost"
                          size="icon-sm"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <i className="ri-close-line text-lg font-bold"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SheetBody>

            {/* Footer - Checkout Section */}
            {state.items.length > 0 && (
              <div className="border-t border-border p-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold">Subtotal</span>
                  <span className="text-lg font-bold">
                    ${state.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Shipping and taxes calculated at checkout
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full font-heading"
                    size="lg"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Spinner size="sm" />
                        <span>Processing...</span>
                      </span>
                    ) : (
                      'Checkout'
                    )}
                  </Button>

                  <Button
                    onClick={closeCart}
                    variant="link"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
};

export default CartDrawer;
