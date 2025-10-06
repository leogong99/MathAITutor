import { useEffect, useState } from 'react';
import './MobileOptimizations.css';

const MobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Add mobile-specific optimizations
      document.body.classList.add('mobile-optimized');
      
      // Prevent zoom on input focus
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      // Add touch-friendly styles
      document.documentElement.style.setProperty('--touch-target-size', '44px');
    } else {
      document.body.classList.remove('mobile-optimized');
      document.documentElement.style.setProperty('--touch-target-size', '40px');
    }
  }, [isMobile]);

  // Add swipe gesture support for mobile
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            // Swipe right - could be used for navigation
            console.log('Swipe right detected');
          } else {
            // Swipe left - could be used for navigation
            console.log('Swipe left detected');
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            // Swipe down - could be used to close modals
            console.log('Swipe down detected');
          } else {
            // Swipe up - could be used to open tools
            console.log('Swipe up detected');
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  return null; // This component doesn't render anything visible
};

export default MobileOptimizations;
