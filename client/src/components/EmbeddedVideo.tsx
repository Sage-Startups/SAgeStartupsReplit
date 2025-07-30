interface EmbeddedVideoProps {
  className?: string;
  fallbackImage: string;
}

export function EmbeddedVideo({ className = "", fallbackImage }: EmbeddedVideoProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Try YouTube embed with autoplay (works on most platforms) */}
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
        className="w-full h-auto aspect-video rounded-2xl"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ border: 'none' }}
        onError={() => {
          // Fallback to image if iframe fails
          const iframe = document.querySelector('iframe');
          if (iframe) {
            iframe.style.display = 'none';
            const img = document.createElement('img');
            img.src = fallbackImage;
            img.className = 'w-full h-auto rounded-2xl';
            img.alt = 'Platform Demo Preview';
            iframe.parentNode?.appendChild(img);
          }
        }}
      />
    </div>
  );
}