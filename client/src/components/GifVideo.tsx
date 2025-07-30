interface GifVideoProps {
  src: string;
  className?: string;
  fallbackImage: string;
}

export function GifVideo({ src, className = "", fallbackImage }: GifVideoProps) {
  return (
    <div className={`relative ${className}`}>
      {/* GIF automatically loops and doesn't require autoplay permissions */}
      <img 
        src={src}
        alt="Platform Demo"
        className="w-full h-auto rounded-2xl"
        onError={(e) => {
          // Fallback to static image
          const img = e.target as HTMLImageElement;
          img.src = fallbackImage;
        }}
      />
    </div>
  );
}