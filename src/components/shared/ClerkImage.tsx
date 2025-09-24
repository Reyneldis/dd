// components/ClerkImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface ClerkImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}

export default function ClerkImage({
  src,
  alt,
  width = 48,
  height = 48,
  className = '',
  fallback = '/img/user-placeholder.svg',
}: ClerkImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={hasError}
    />
  );
}
