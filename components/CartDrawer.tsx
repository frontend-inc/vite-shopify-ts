import React from 'react';
import { useCartDrawer } from '../contexts/CartContext';
import { useShopifyCart } from '../hooks/use-cart';
import { redirectToCheckout } from '../services/shopify/api.js';
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
  const { isOpen, closeCart } = useCartDrawer();
  const { items, itemCount, totalAmount, checkoutUrl, loading, removeItem, updateItemQuantity } = useShopifyCart();

  const handleCheckout = () => {
    if (checkoutUrl) {
      redirectToCheckout(checkoutUrl);
    }
  };

  const getItemImage = (item: typeof items[0]) => {
    return item.merchandise.product.images.edges[0]?.node.url;
  };

  const getSelectedOptions = (item: typeof items[0]) => {
    return item.merchandise.selectedOptions ?? [];
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()} side="right">
      <AnimatePresence>
        {isOpen && (
          <SheetContent className="w-full max-w-md" showCloseButton={false}>
            {/* Header */}
            <SheetHeader className="h-14 min-h-0 px-4 py-3 flex items-center">
              <div className="flex items-center justify-between w-full">
                <SheetTitle className="text-base">
                  Shopping Cart ({itemCount})
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
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : items.length === 0 ? (
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
                  {items.map((item) => {
                    const image = getItemImage(item);
                    const selectedOptions = getSelectedOptions(item);

                    return (
                      <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {image ? (
                            <img
                              src={image}
                              alt={item.merchandise.product.title}
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
                            {item.merchandise.product.title}
                          </h4>

                          {/* Variant Info */}
                          {selectedOptions.length > 0 && (
                            <div className="text-sm text-gray-500 mb-2">
                              {selectedOptions.map((option, index) => (
                                <span key={option.name}>
                                  {option.value}
                                  {index < selectedOptions.length - 1 ? ' / ' : ''}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center mt-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                variant="ghost"
                                size="icon-sm"
                                disabled={item.quantity <= 1 || loading}
                                className="h-7 w-7"
                              >
                                <i className="ri-subtract-line text-sm"></i>
                              </Button>
                              <span className="px-2 py-1 font-semibold min-w-[30px] text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                variant="ghost"
                                size="icon-sm"
                                disabled={loading}
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
                            ${parseFloat(item.merchandise.price.amount).toFixed(2)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <div className="flex-shrink-0">
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="icon-sm"
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <i className="ri-close-line text-lg font-bold"></i>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SheetBody>

            {/* Footer - Checkout Section */}
            {items.length > 0 && (
              <div className="border-t border-border p-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold">Subtotal</span>
                  <span className="text-lg font-bold">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Shipping and taxes calculated at checkout
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={loading || !checkoutUrl}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
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
