import { useEffect, useRef } from 'react';

export function useVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playAttempted = false;

    const attemptPlay = async () => {
      if (playAttempted) return;
      playAttempted = true;

      try {
        // Ensure video is muted for autoplay policies
        video.muted = true;
        video.defaultMuted = true;
        
        // Wait for video to be ready
        if (video.readyState >= 3) {
          await video.play();
        } else {
          video.addEventListener('canplay', async () => {
            try {
              await video.play();
            } catch (error) {
              console.log('Autoplay failed:', error);
            }
          }, { once: true });
        }
      } catch (error) {
        console.log('Video play failed:', error);
      }
    };

    // Multiple triggers for autoplay
    const events = ['loadedmetadata', 'loadeddata', 'canplay'];
    events.forEach(event => {
      video.addEventListener(event, attemptPlay, { once: true });
    });

    // Intersection Observer for when video comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playAttempted) {
          attemptPlay();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    // User interaction fallback
    const handleUserInteraction = () => {
      if (!playAttempted) {
        attemptPlay();
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      observer.disconnect();
      events.forEach(event => {
        video.removeEventListener(event, attemptPlay);
      });
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return videoRef;
}