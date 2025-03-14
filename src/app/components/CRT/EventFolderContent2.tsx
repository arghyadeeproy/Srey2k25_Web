"use client";

import React from "react";
import Draggable from "react-draggable";

interface EventFolderContent2Props {
  title: string;
  description: string;
  onClose: () => void;
  onItemClick: (item: string) => void;
}

const EventFolderContent2: React.FC<EventFolderContent2Props> = ({ 
  title, 
  description, 
  onClose,
  onItemClick
}) => {
  return (
    <div className="w-[300px] h-[200px] border border-white bg-gray-200 relative font-mono shadow-lg overflow-hidden">
      <div className="flex justify-between items-center bg-blue-900 text-white pl-2 text-xs handle cursor-move">
        <span className="">{title}</span>
        <button onClick={onClose} className="bg-gray-600 border-l border-white text-black px-1">✖</button>
      </div>
      <div className="flex items-center bg-gray-400 text-white text-xs handle cursor-move border-t border-b border-white">
        <span className="border-r border-white px-1">🔙</span>
        <span className="border-r border-white px-1">🏠︎</span>
        <span className="px-2">{`C:\\Events\\Day1\\${title}`}</span>
      </div>
      <div className="p-4 text-xs text-gray-800 overflow-y-auto h-[160px]">
        <h2 className="text-blue-900 font-bold text-sm">{title} Event</h2>
        <p className="mt-2">{description}</p>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center cursor-pointer" onClick={() => onItemClick('rules')}>
              <img src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/pdf.png" alt="PDF" className="w-6 h-6 mr-2" />
              <span>Rules.pdf</span>
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => onItemClick('registration')}>
              <img src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/link.png" alt="Link" className="w-6 h-6 mr-2" />
              <span>Registration</span>
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => onItemClick('about')}>
              <img src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/note-pad.png" alt="Document" className="w-6 h-6 mr-2" />
              <span>AboutUs.txt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFolderContent2;