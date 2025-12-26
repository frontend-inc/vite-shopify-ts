import React from 'react';
import { Button } from '../ui/button';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductDetailGalleryProps {
  images: ProductImage[];
  selectedImageIndex?: number;
  onImageSelect?: (index: number) => void;
}

const ProductDetailGallery: React.FC<ProductDetailGalleryProps> = ({
  images,
  selectedImageIndex = 0,
  onImageSelect
}) => {
  const selectedImage = selectedImageIndex;
  const setSelectedImage = onImageSelect || (() => {});

  return (
    <div>
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        {images.length > 0 ? (
          <img
            src={images[selectedImage].url}
            alt={images[selectedImage].altText || 'Product image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <i className="ri-image-line text-6xl"></i>
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index 
                  ? 'border-black' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.altText || 'Product thumbnail'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailGallery;