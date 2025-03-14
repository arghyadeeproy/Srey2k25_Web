import { useState, useEffect, RefObject } from 'react';

const useCRTDimensions = (containerRef: RefObject<HTMLDivElement>) => {
  // Set a minimum size threshold to ensure visibility
  const MINIMUM_WIDTH = 200;
  const MINIMUM_HEIGHT = 150;
  // Maximum width for mobile to avoid oversized screens
  const MAXIMUM_MOBILE_WIDTH = 380;
  
  const [screenDimensions, setScreenDimensions] = useState({ width: 550, height: 437.5 });
  const [iconSize, setIconSize] = useState({ width: 45, height: 45 });

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;
      const aspectRatio = 4/3;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      let newWidth: number, newHeight: number;
      
      // Pixel 7 specific dimensions (approximately 412×915)
      if ((windowWidth >= 410 && windowWidth <= 414) && 
          (windowHeight >= 910 && windowHeight <= 920)) {
        newWidth = 390; // Larger CRT for Pixel 7
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 34, height: 34 });
      }
      // Custom ratio handling (for small screens)
      else if (containerWidth <= 320) {
        newWidth = Math.max(containerWidth * 0.98, MINIMUM_WIDTH);
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 24, height: 24 });
      }
      // iPhone SE specific dimensions (375x667)
      else if ((window.innerWidth >= 370 && window.innerWidth <= 380 && 
          window.innerHeight >= 660 && window.innerHeight <= 670) ||
          (window.innerWidth === 375 && window.innerHeight === 667)) {
        newWidth = 280; // Smaller CRT for iPhone SE
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 26, height: 26 });
      }
      // Galaxy S24 dimensions (360x780)
      else if (window.innerWidth >= 355 && window.innerWidth <= 365 && 
          window.innerHeight >= 775 && window.innerHeight <= 785) {
        newWidth = 330; 
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 28, height: 28 });
      }
      // MODIFIED: MacBook Air dimensions (around 1440x900) - DECREASED
      else if (window.innerWidth >= 1430 && window.innerWidth <= 1450 && 
          window.innerHeight >= 890 && window.innerHeight <= 910) {
        newWidth = 350; // Decreased from 380
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 38, height: 38 }); // Slightly smaller icons
      }
      // MODIFIED: MacBook Retina dimensions (around 2304x1440) - DECREASED
      else if (window.innerWidth >= 2250 && window.innerWidth <= 2350 && 
          window.innerHeight >= 1400 && window.innerHeight <= 1480) {
        newWidth = 500; // Decreased from 550
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 45, height: 45 }); // Slightly smaller icons
      }
      // MODIFIED: Laptop-M dimensions - DECREASED
      else if (window.innerWidth >= 1350 && window.innerWidth <= 1380 && 
          window.innerHeight >= 750 && window.innerHeight <= 780) {
        newWidth = 290; // Decreased from 320
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 28, height: 28 });
      }
      // MODIFIED: Laptop-S dimensions - DECREASED
      else if (window.innerWidth >= 1200 && window.innerWidth <= 1300 && 
          window.innerHeight >= 780 && window.innerHeight <= 820) {
        newWidth = 300; // Decreased from 330
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 32, height: 32 });
      }
      // Check for 4K monitors - DECREASED
      else if (window.innerWidth >= 3200 && window.innerWidth <= 3300 && 
          window.innerHeight >= 2100 && window.innerHeight <= 2200) {
        newWidth = 650; // Decreased from 700
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 55, height: 55 }); 
      }
      // Small mobile devices (under 480px width)
      else if (windowWidth < 480) {
        const screenPercentage = windowWidth < 360 ? 0.95 : 0.9;
        newWidth = Math.min(windowWidth * screenPercentage, MAXIMUM_MOBILE_WIDTH);
        newHeight = newWidth / aspectRatio;
        setIconSize({ 
          width: windowWidth < 360 ? 26 : 30,
          height: windowWidth < 360 ? 26 : 30 
        });
      }
      // Medium mobile devices (480px - 640px)
      else if (windowWidth < 640) {
        newWidth = Math.min(windowWidth * 0.85, 400);
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 32, height: 32 });
      }
      // Large mobile devices and small tablets (640px - 768px)
      else if (windowWidth < 768) {
        newWidth = Math.min(windowWidth * 0.8, 420);
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 34, height: 34 });
      }
      // MODIFIED: General laptop/desktop size ranges - DECREASED
      else if (containerWidth < 700) { // Mobile devices
        newWidth = Math.max(Math.min(containerWidth * 0.95, 380), MINIMUM_WIDTH);
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 32, height: 32 });
      } else if (containerWidth < 1024) { // Small laptops
        newWidth = Math.max(Math.min(containerWidth * 0.8, 380), MINIMUM_WIDTH); // Decreased from 0.85/420
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 35, height: 35 }); // Decreased from 38
      } else if (containerWidth < 1440) { // Medium laptops
        newWidth = Math.max(Math.min(containerWidth * 0.65, 400), MINIMUM_WIDTH); // Decreased from 0.7/450
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 40, height: 40 }); // Decreased from 45
      } else { // Large screens
        newWidth = Math.max(Math.min(containerWidth * 0.6, 420), MINIMUM_WIDTH); // Decreased from 0.7/450
        newHeight = newWidth / aspectRatio;
        setIconSize({ width: 42, height: 42 }); // Decreased from 45
      }
      
      // Portrait orientation adjustment for mobile devices
      if (windowHeight > windowWidth && windowWidth < 768) {
        newWidth = newWidth * 0.95;
        newHeight = newWidth / aspectRatio;
      }
      
      // Device pixel ratio (DPR) adjustment for high-density screens
      if (window.devicePixelRatio > 2 && windowWidth < 768) {
        newWidth = newWidth * 0.95;
        newHeight = newWidth / aspectRatio;
      }
      
      // Final check to ensure dimensions are never below minimum
      newWidth = Math.max(newWidth, MINIMUM_WIDTH);
      newHeight = Math.max(newHeight, MINIMUM_HEIGHT);
      
      setScreenDimensions({ 
        width: newWidth, 
        height: newHeight 
      });
      
      // Debug output to help troubleshoot
      console.log(`Screen dimensions set to: ${newWidth}x${newHeight}, window size: ${windowWidth}x${windowHeight}, DPR: ${window.devicePixelRatio}`);
    };
  
    // Initial call
    handleResize();
  
    // Add event listener
    window.addEventListener('resize', handleResize);
  
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  return { screenDimensions, iconSize };
};

export default useCRTDimensions;