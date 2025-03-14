'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CRTScreen from './components/CRTScren';

export default function Home() {
  const [showCRT, setShowCRT] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const zoomDuration = 1000; // Animation duration in ms
  
  // Create refs for audio elements
  const powerOnAudioRef = useRef(null);
  const powerOffAudioRef = useRef(null);

  // Check if device is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleShowCRT = () => {
    // Play power on sound
    if (powerOnAudioRef.current) {
      powerOnAudioRef.current.currentTime = 0; // Reset audio to start
      powerOnAudioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
    
    // First turn on CRT
    setTimeout(() => {
      setShowCRT(true);
      
      // Then show the power off button after zoom animation completes
      setTimeout(() => {
        setShowButton(true);
      }, zoomDuration);
    }, 1000);
  };

  const handleHideCRT = () => {
    // Play power off sound
    if (powerOffAudioRef.current) {
      powerOffAudioRef.current.currentTime = 0; // Reset audio to start
      powerOffAudioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
    
    // Hide button immediately when clicked
    setShowButton(false);
    
    // Then turn off CRT after a delay
    setTimeout(() => {
      setShowCRT(false);
    }, 1000);
  };

  // Determine the zoom scale based on device type
  const getZoomScale = () => {
    if (!showCRT) return 'scale(1)';
    return isMobile ? 'scale(1)' : 'scale(1.8)';
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Audio elements */}
      <audio 
        ref={powerOnAudioRef} 
        src="/a481cda28881acd13d6e.mp3" 
        preload="auto"
      ></audio>
      <audio 
        ref={powerOffAudioRef} 
        src="/a481cda28881acd13d6e.mp3" 
        preload="auto"
      ></audio>
      
      {/* Main content with background */}
      <main
        className="flex min-h-screen w-full flex-col items-center justify-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: 'url(/IMG_3988.PNG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          transformOrigin: 'center center',
          position: 'relative',
          transform: getZoomScale(), // Using dynamic zoom scale
        }}
      >
        {/* CRT Screen - Only visible when CRT is on */}
        {showCRT && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="crt-monitor-wrapper">
              <CRTScreen />
            </div>
          </div>
        )}

        {/* Power On Button - Only visible when CRT is off */}
        {!showCRT && (
          <div
            className="absolute cursor-pointer power-on-button"
            onClick={handleShowCRT}
          >
            <Image
              src="/crop-off-d1fca7.jpg"
              alt="Power On CRT"
              width={52}
              height={22}
              className="w-auto h-auto"
              priority
            />
          </div>
        )}
      </main>

      {/* Power Off Button - Only visible when CRT is on AND button visibility is set to true */}
      {showCRT && showButton && (
        <div
          onClick={handleHideCRT}
          className="fixed cursor-pointer power-off-button z-20"
          style={{
            position: 'fixed',
            zIndex: 30
          }}
        >
          <Image
            src="/crop-on-e8511a.jpg"
            alt="Power Off CRT"
            width={100}
            height={150}
            className="transparent-button"
            priority
          />
        </div>
      )}

      {/* Updated styles for responsive positioning */}
      <style jsx global>{`
        /* CRT monitor wrapper - positions the screen in the monitor */
        .crt-monitor-wrapper {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          z-index: 10;
          max-width: 800px;
        }

        /* Power on button positioning - centered and then adjusted by transform */
        .power-on-button {
          position: absolute;
          z-index: 10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 170px); /* Move down from center */
        }

        /* Power off button positioned relative to screen center */
        .power-off-button {
          position: fixed;
          z-index: 20;
          top: 50%;
          left: 50%;
          transform: translate(180px, 290px); /* Position relative to center */
          animation: fadeIn 0.5s ease-in-out;
        }

        /* Make the button transparent */
        .transparent-button {
          opacity: 0;
          transition: opacity 0s ease;
        }
        
        .transparent-button:hover {
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0; }
        }

        /* Responsive adjustments using screen width-based approach */
        @media (max-width: 1024px) {
          .power-on-button {
            transform: translate(-50%, 140px);
          }

          .power-off-button {
            transform: translate(140px, 220px);
          }
        }

        @media (max-width: 768px) {
          .power-on-button {
            transform: translate(-50%, 120px);
          }

          .power-off-button {
            transform: translate(120px, 180px);
          }
        }

        @media (max-width: 640px) {
          .power-on-button {
            transform: translate(-50%, 100px);
          }

          .power-off-button {
            transform: translate(90px, 140px);
          }
        }
      `}</style>
    </div>
  );
}