import React from 'react';
import { Product, ProductVariant } from './index.tsx';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';

interface ProductDetailInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedOptions: Record<string, string>;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  onOptionChange: (optionName: string, value: string) => void;
  loading?: boolean;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  product,
  selectedVariant,
  selectedOptions,
  quantity,
  setQuantity,
  handleAddToCart,
  onOptionChange,
  loading = false,
}) => {
  const formatPrice = (price: { amount: string; currencyCode: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price.amount));
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-2xl font-bold text-gray-900">
          {formatPrice(price)}
        </span>
        {hasDiscount && compareAtPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(compareAtPrice)}
            </span>
            <Badge variant="destructive">
              {Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)}% OFF
            </Badge>
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
              <Button
                key={value}
                onClick={() => onOptionChange(option.name, value)}
                variant={selectedOptions[option.name] === value ? 'default' : 'outline'}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            variant="ghost"
            size="icon-sm"
            disabled={quantity <= 1}
          >
            <i className="ri-subtract-line"></i>
          </Button>
          <span className="w-10 text-center font-semibold">{quantity}</span>
          <Button
            onClick={() => setQuantity(quantity + 1)}
            variant="ghost"
            size="icon-sm"
          >
            <i className="ri-add-line"></i>
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!selectedVariant?.availableForSale || loading}
        size="lg"
        className="w-full text-lg font-heading"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            <span>Adding...</span>
          </span>
        ) : selectedVariant?.availableForSale ? (
          'Add to Cart'
        ) : (
          'Out of Stock'
        )}
      </Button>

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