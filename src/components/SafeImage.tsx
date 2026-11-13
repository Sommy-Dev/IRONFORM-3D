import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'IRONFORM Athletic',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#181C21] border border-[#1F2937] text-slate-400 p-6 ${className}`}
        role="img"
        aria-label={alt || fallbackLabel}
      >
        <Dumbbell className="w-10 h-10 text-[#A3E635] mb-2 opacity-80" />
        <span className="text-xs uppercase tracking-wider text-slate-400 font-display text-center">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
