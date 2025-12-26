import React from 'react';
import { Link } from 'react-router-dom';

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

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link 
      to={`/collections/${collection.handle}`} 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group block"
    >
      {/* Collection Image */}
      <div className="aspect-video overflow-hidden bg-gray-100">
        {collection.image ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <i className="ri-folder-line text-6xl"></i>
          </div>
        )}
      </div>

      {/* Collection Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors font-heading">
          {collection.title}
        </h3>

        {collection.description && (
          <p className="text-gray-600">
            {collection.description.substring(0, 100)}
            {collection.description.length > 100 ? '...' : ''}
          </p>
        )}

        <div className="mt-4 text-black font-semibold group-hover:text-gray-600 transition-colors flex items-center">
          <span>View Collection</span>
          <i className="ri-arrow-right-s-line ml-2"></i>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;