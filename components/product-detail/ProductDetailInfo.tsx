import React from 'react';
import { Product, ProductVariant } from './index.tsx';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductDetailInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedOptions: Record<string, string>;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  onOptionChange: (optionName: string, value: string) => void;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  product,
  selectedVariant,
  selectedOptions,
  quantity,
  setQuantity,
  handleAddToCart,
  onOptionChange
}) => {
  const formatPrice = (price: { amount: string; currencyCode: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div>
      <h1 
        className="text-4xl font-bold text-gray-900 mb-4"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(price)}
        </span>
        {hasDiscount && compareAtPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(compareAtPrice)}
            </span>
            <div className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded">
              {Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)}% OFF
            </div>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="text-gray-600 mb-8 text-lg leading-relaxed">
          {product.descriptionHtml ? (
            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          ) : (
            <p>{product.description}</p>
          )}
        </div>
      )}

      {/* Product Options */}
      {product.options.map(option => (
        <div key={option.id} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map(value => (
              <button
                key={value}
                onClick={() => onOptionChange(option.name, value)}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  selectedOptions[option.name] === value
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg w-32">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100 transition-colors"
            disabled={quantity <= 1}
          >
            <i className="ri-subtract-line"></i>
          </button>
          <span className="flex-1 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <i className="ri-add-line"></i>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant?.availableForSale}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          selectedVariant?.availableForSale
            ? 'bg-black text-white hover:bg-gray-800 active:scale-95'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
      </button>

      {/* Additional Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <i className="ri-truck-line"></i>
            <span>Free shipping on orders over $100</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-arrow-go-back-line"></i>
            <span>30-day return policy</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-secure-payment-line"></i>
            <span>Secure payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;