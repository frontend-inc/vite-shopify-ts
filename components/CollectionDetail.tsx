import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCollectionProducts } from '../services/shopify/api.js';
import ProductCard from './ProductCard';

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
}

interface Product {
  id: string;
  title: string;
  description?: string;
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
}

const CollectionDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionTitle, setCollectionTitle] = useState('Collection');

  useEffect(() => {
    if (!handle) return;
    
    const fetchCollectionProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set title based on handle before fetching products
        const formattedTitle = handle
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        setCollectionTitle(formattedTitle);
        
        const productData = await getCollectionProducts({ 
          collection: handle, 
          limit: 20,
          sortKey: 'COLLECTION_DEFAULT',
          reverse: false
        });
        
        setProducts(productData);
      } catch (err) {
        console.error('Error fetching collection products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load collection products');
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionProducts();
  }, [handle]);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-900 font-heading">
            Collection
          </h2>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 font-heading">
            Collection
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to Load Collection
            </h3>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-gray-900 font-heading">
          {collectionTitle}
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Products in Collection
              </h3>
              <p className="text-gray-500">
                This collection doesn't have any products yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;