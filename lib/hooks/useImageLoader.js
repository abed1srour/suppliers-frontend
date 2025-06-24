import { useState, useEffect } from 'react';

export const useImageLoader = (src, fallbackSrc = null) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    src: src
  });

  useEffect(() => {
    if (!src) {
      setImageState({ loading: false, error: true, src: null });
      return;
    }

    setImageState({ loading: true, error: false, src });

    const img = new Image();
    
    const handleLoad = () => {
      setImageState({ loading: false, error: false, src });
    };

    const handleError = () => {
      if (fallbackSrc && fallbackSrc !== src) {
        // Try fallback image
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageState({ loading: false, error: false, src: fallbackSrc });
        };
        fallbackImg.onerror = () => {
          setImageState({ loading: false, error: true, src: null });
        };
        fallbackImg.src = fallbackSrc;
      } else {
        setImageState({ loading: false, error: true, src: null });
      }
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return imageState;
}; 