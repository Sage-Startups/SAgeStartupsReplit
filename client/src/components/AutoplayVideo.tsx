import { useEffect, useRef, useState } from 'react';

interface AutoplayVideoProps {
  src: string;
  poster: string;
  className?: string;
  fallbackImage?: string;
}

export function AutoplayVideo({ src, poster, className = "", fallbackImage }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer to start video when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          // Force play when video comes into view
          video.play().catch((error) => {
            console.log('Autoplay failed:', error);
            setVideoError(true);
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    // Additional event listeners
    const handleCanPlay = () => {
      if (isIntersecting) {
        video.play().catch((error) => {
          console.log('Play failed:', error);
          setVideoError(true);
        });
      }
    };

    const handleError = () => {
      console.log('Video error occurred');
      setVideoError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Cleanup
    return () => {
      observer.disconnect();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isIntersecting]);

  if (videoError) {
    return (
      <img 
        src={fallbackImage || poster} 
        alt="Platform Demo Preview" 
        className={className}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      webkit-playsinline="true"
      preload="metadata"
      poster={poster}
      onError={() => setVideoError(true)}
    >
      <source src={src} type="video/mp4" />
      <img src={fallbackImage || poster} alt="Platform Demo Preview" className={className} />
    </video>
  );
}