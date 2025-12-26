import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getProductRecommendations } from '../../services/shopify/api.js';
import { useCart } from '../../contexts/CartContext';
import ProductDetailGallery from './ProductDetailGallery';
import ProductDetailInfo from './ProductDetailInfo';
import ProductRecommendations from './ProductRecommendations';
import { Button } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ProductImage;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  options: ProductOption[];
}

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addItem, openCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!handle) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await getProduct(handle);
        
        if (!productData) {
          setError('Product not found');
          return;
        }

        setProduct(productData);
        
        // Set default variant
        const firstVariant = productData.variants.edges[0]?.node;
        if (firstVariant) {
          setSelectedVariant(firstVariant);
          
          // Initialize selected options
          const initialOptions: Record<string, string> = {};
          firstVariant.selectedOptions.forEach(option => {
            initialOptions[option.name] = option.value;
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product?.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(option =>
        newOptions[option.name] === option.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);

      // Update image if variant has an associated image
      if (matchingVariant.node.image && product) {
        const variantImageUrl = matchingVariant.node.image.url;
        const imageIndex = product.images.edges.findIndex(
          edge => edge.node.url === variantImageUrl
        );
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    
    const firstImage = product.images.edges[0]?.node;
    
    // Add to cart using context
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      price: selectedVariant.price,
      image: firstImage?.url,
      quantity,
      variant: {
        title: selectedVariant.title,
        selectedOptions: selectedVariant.selectedOptions,
      },
    });

    // Open cart drawer
    openCart();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mb-6 w-1/3 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto p-8">
          <i className="ri-error-warning-line text-4xl"></i>
          <AlertTitle className="text-lg font-semibold">
            Product Not Found
          </AlertTitle>
          <AlertDescription className="mb-4">
            {error || 'The requested product could not be found.'}
          </AlertDescription>
          <Button
            onClick={() => window.history.back()}
            variant="destructive"
          >
            Go Back
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductDetailGallery
            images={product.images.edges.map(edge => edge.node)}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />
          <ProductDetailInfo
            product={product}
            selectedVariant={selectedVariant}
            selectedOptions={selectedOptions}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            onOptionChange={handleOptionChange}
          />
        </div>
      </div>
      
      <ProductRecommendations productId={product.id} />
    </div>
  );
};

export default ProductDetail;