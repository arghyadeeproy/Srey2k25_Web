'use client';

import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import DesktopIcons from './CRT/DesktopIcons';
import Window from './CRT/Window';
import GlitchEffect from './Effects/GlitchEffect';
import InterlaceEffect from './Effects/InterlaceEffect';
import RGBShiftEffect from './Effects/RGBShiftEffect';
import { icons } from './constants/icons';
import './styles/animations.css';
import Day1Window from './CRT/Day1';
import Day2Window from './CRT/Day2';
import EventFolderContent1 from './CRT/EventFolderContent1';
import EventFolderContent2 from './CRT/EventFolderContent2';
import TextDocument from './CRT/TextDocument';
import Gallery from './CRT/Gallery';
import RulesDocument from './CRT/RulesDocument';
import eventContentData from './constants/EventContentData';
import useCRTDimensions from '../hooks/useCRTDimensions';

const CRTScreen = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [booting, setBooting] = useState(true);
  const [bootText, setBootText] = useState('');
  const clickAudioRef = useRef(null);
  const containerRef = useRef(null);
  
  // Use our custom hook for responsive dimensions
  const { screenDimensions, iconSize } = useCRTDimensions(containerRef);

  // Boot sequence text
  const bootSequence = [
    'BIOS Version 1.0.4',
    'Memory Test: OK',
    'Detecting Drives...',
    'Drive C: 512MB',
    'Drive D: 128MB',
    'Initializing System...',
    'Loading OS...',
    'Welcome to StCETOS v1.1'
  ];

  useEffect(() => {
    // Create audio element for click sound
    clickAudioRef.current = new Audio('/38591482404afcee7e21.mp3');
    
    // Boot sequence animation
    let currentLine = 0;
    let currentChar = 0;
    let bootInterval;
    
    if (booting) {
      bootInterval = setInterval(() => {
        if (currentLine < bootSequence.length) {
          const line = bootSequence[currentLine];
          
          if (currentChar <= line.length) {
            setBootText(prev => {
              // Full previous lines
              const prevLines = bootSequence.slice(0, currentLine).join('\n');
              // Current line being typed
              const currentTyping = line.substring(0, currentChar);
              
              return prevLines ? `${prevLines}\n${currentTyping}` : currentTyping;
            });
            
            currentChar++;
          } else {
            currentLine++;
            currentChar = 0;
            // Add a slight pause between lines
            clearInterval(bootInterval);
            setTimeout(() => {
              bootInterval = setInterval(() => {
                if (currentLine < bootSequence.length) {
                  const line = bootSequence[currentLine];
                  
                  if (currentChar <= line.length) {
                    setBootText(prev => {
                      // Full previous lines
                      const prevLines = bootSequence.slice(0, currentLine).join('\n');
                      // Current line being typed
                      const currentTyping = line.substring(0, currentChar);
                      
                      return prevLines ? `${prevLines}\n${currentTyping}` : currentTyping;
                    });
                    
                    currentChar++;
                  } else {
                    currentLine++;
                    currentChar = 0;
                  }
                } else {
                  clearInterval(bootInterval);
                  setTimeout(() => setBooting(false), 1000); // Show desktop after boot sequence completes
                }
              }, 50);
            }, 300);
          }
        } else {
          clearInterval(bootInterval);
          setTimeout(() => setBooting(false), 1000); // Show desktop after boot sequence completes
        }
      }, 50);
    }

    return () => {
      clearInterval(bootInterval);
    };
  }, [booting]);

  // Handle external links (registration)
  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  const toggleWindow = (id) => {
    // Play click sound
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }

    setOpenWindows((prev) =>
      prev.includes(id) ? prev.filter((win) => win !== id) : [...prev, id]
    );
  };

  // Function to determine window position to avoid stacking directly on top of each other
  const getWindowPosition = (windowId) => {
    const basePosition = { x: 10, y: 10 };
    
    // For event folders, position them with slight offset
    if (windowId.includes('-')) {
      return { 
        x: basePosition.x + (Math.random() * 40), 
        y: basePosition.y + (Math.random() * 40)
      };
    }
    
    if (windowId === 'day2') {
      return { x: 30, y: 30 };
    }
    
    return basePosition;
  };

  // Function to determine which event folder content type to use
  const getEventFolderType = (eventId) => {
    // Technical events use content type 1 (with Gallery folder)
    const technicalEvents = ['hackathon', 'film-making', 'pixcellence', 'mini-games', 
      'sketchify', 'playtopia', 'mystic-map', 'quiz', 'robotics', 'coding'];
    // Sports events use content type 2 (without Gallery folder)
    const sportsEvents = ['table-tennis', 'chess', 'carrom', 'badminton'];
    
    if (technicalEvents.some(event => eventId.startsWith(event))) {
      return 1;
    } else if (sportsEvents.some(event => eventId.startsWith(event))) {
      return 2;
    }
    return 1;
  };
  
  // Get base event ID from any window ID (e.g. "table-tennis-rules" -> "table-tennis")
  const getBaseEventId = (windowId) => {
    const parts = windowId.split('-');
    // Handle special cases like "film-making"
    if (parts[0] === 'film' && parts[1] === 'making') {
      return 'film-making';
    } else if (parts[0] === 'ipl' && parts[1] === 'mock' && parts[2] === 'auction') {
      return 'ipl-mock-auction';
    } else if (parts[0] === 'mini' && parts[1] === 'games') {
      return 'mini-games';
    } else if (parts[0] === 'mystic' && parts[1] === 'map') {
      return 'mystic-map';
    }
    
    // For regular events like "chess-rules", "table-tennis-gallery"
    const specialSuffixes = ['rules', 'gallery', 'about'];
    for (const suffix of specialSuffixes) {
      if (parts.includes(suffix)) {
        const suffixIndex = parts.indexOf(suffix);
        return parts.slice(0, suffixIndex).join('-');
      }
    }
    
    // If no special suffix, return the original ID
    return windowId;
  };

  // Render appropriate component based on window ID
  const renderWindow = (windowId) => {
    // Handle specific document types (rules, about us, gallery)
    if (windowId.endsWith('-rules')) {
      const baseEventId = getBaseEventId(windowId);
      const eventData = eventContentData[baseEventId];
      
      if (eventData) {
        return (
          <RulesDocument 
            title={`${eventData.title} - Rules`}
            content={eventData.rules}
            onClose={() => toggleWindow(windowId)}
          />
        );
      }
    } else if (windowId.endsWith('-about')) {
      const baseEventId = getBaseEventId(windowId);
      const eventData = eventContentData[baseEventId];
      
      if (eventData) {
        return (
          <TextDocument 
            title={`${eventData.title} - About Us`}
            content={eventData.aboutUs}
            onClose={() => toggleWindow(windowId)}
          />
        );
      }
    } else if (windowId.endsWith('-gallery')) {
      const baseEventId = getBaseEventId(windowId);
      const eventData = eventContentData[baseEventId];
      
      if (eventData && eventData.galleryImages) {
        return (
          <Gallery 
            title={`${eventData.title} - Gallery`}
            images={eventData.galleryImages}
            onClose={() => toggleWindow(windowId)}
          />
        );
      }
    }
    
    // Handle day1 sub-folders
    const baseEventId = getBaseEventId(windowId);
    if (eventContentData[baseEventId]) {
      const eventData = eventContentData[baseEventId];
      const folderType = getEventFolderType(baseEventId);
      
      const handleFolderItemClick = (item) => {
        if (item === 'rules') {
          toggleWindow(`${baseEventId}-rules`);
        } else if (item === 'about') {
          toggleWindow(`${baseEventId}-about`);
        } else if (item === 'gallery') {
          toggleWindow(`${baseEventId}-gallery`);
        } else if (item === 'registration') {
          handleExternalLink(eventData.registrationLink);
        }
      };
      
      const eventFolderProps = {
        title: eventData.title,
        description: eventData.description,
        onClose: () => toggleWindow(windowId),
        onItemClick: handleFolderItemClick
      };
      
      return folderType === 1 ? 
        <EventFolderContent1 {...eventFolderProps} /> :
        <EventFolderContent2 {...eventFolderProps} />;
    }
    
    // Handle main windows
    if (windowId === 'day1') {
      return <Day1Window onClose={() => toggleWindow(windowId)} onFolderClick={toggleWindow} />;
    } else if (windowId === 'day2') {
      return <Day2Window 
        onClose={() => toggleWindow(windowId)} 
        onFolderClick={(folderId) => toggleWindow(folderId)} 
      />;
    } else {
      return (
        <Window 
          title={windowId} 
          onClose={() => toggleWindow(windowId)}
          onFolderClick={toggleWindow}
        />
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative border-[0px] border-gray-700 shadow-lg overflow-hidden flex flex-col items-center justify-center crt-screen rounded-lg"
      style={{
        width: `${screenDimensions.width}px`,
        height: `${screenDimensions.height}px`,
        backgroundImage: booting ? 'none' : 'url(https://de34i7k6qwgwc.cloudfront.net/uploads/img/background-computer-d0f45e.jpg)',
        backgroundColor: booting ? '#000' : 'transparent',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        zIndex: 10,
        margin: '0 auto',  // Center horizontally
      }}
    >
      <GlitchEffect />
      <InterlaceEffect />
      <RGBShiftEffect />

      {booting ? (
        <div className="absolute inset-0 flex items-start justify-start p-4">
          <pre className="text-green-500 font-mono text-xs whitespace-pre-wrap">{bootText}</pre>
        </div>
      ) : (
        <>
          {/* Render Windows */}
          {openWindows.map((windowId) => {
            const position = getWindowPosition(windowId);
            
            return (
              <Draggable key={windowId} handle=".handle" defaultPosition={position}>
                <div className="absolute z-20">
                  {renderWindow(windowId)}
                </div>
              </Draggable>
            );
          })}

          <DesktopIcons icons={icons} onIconClick={toggleWindow} iconSize={iconSize} />
        </>
      )}
      
      {/* Audio element for icon click sound */}
      <audio ref={clickAudioRef} preload="auto" />
    </div>
  );
};

export default CRTScreen;