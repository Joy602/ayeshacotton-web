import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string;
  isHero?: boolean;
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-[3/4]',
  isHero = false,
  className = '',
  imgClassName = '',
  objectPosition = 'object-top',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#f2eeeb] ${aspectRatio} ${className}`}
      itemScope
      itemType="https://schema.org/ImageObject"
    >
      {/* Subtle skeleton shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#f2eeeb] via-[#ede7e4] to-[#f2eeeb] animate-pulse"
          aria-hidden="true"
        />
      )}

      <img
        src={hasError ? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' : src}
        alt={alt}
        loading={isHero ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={isHero ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        itemProp="contentUrl"
        className={`w-full h-full object-cover transition-all duration-700 ${objectPosition} ${imgClassName} ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-xs'
        }`}
        {...props}
      />
      <meta itemProp="caption" content={alt} />
    </div>
  );
};
