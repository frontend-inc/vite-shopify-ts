import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollections } from '../services/shopify/api.js';
import CollectionCard from './CollectionCard';

interface CollectionImage {
  url: string;
  altText?: string;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: CollectionImage;
}

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const collectionData = await getCollections(20);
        setCollections(collectionData);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err instanceof Error ? err.message : 'Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-900 font-heading">
            Our Collections
          </h2>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            Our Collections
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to Load Collections
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

  if (collections.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 font-heading">
            Our Collections
          </h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-folder-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Collections Found
            </h3>
            <p className="text-gray-500">
              Check back later or configure your Shopify store connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-gray-900 font-heading">
          Our Collections
        </h2>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;