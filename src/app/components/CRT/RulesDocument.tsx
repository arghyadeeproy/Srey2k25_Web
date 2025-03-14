"use client";

import React from "react";

interface RulesDocumentProps {
  title: string;
  content: string;
  onClose: () => void;
}

const RulesDocument: React.FC<RulesDocumentProps> = ({ title, content, onClose }) => (
  <div className="w-[300px] h-[200px] border border-white bg-gray-200 relative font-mono shadow-lg overflow-hidden">
    <div className="flex justify-between items-center bg-blue-900 text-white pl-2 text-xs handle cursor-move">
      <span className="">{title}</span>
      <button onClick={onClose} className="bg-gray-600 border-l border-white text-black px-1">✖</button>
    </div>
    <div className="flex items-center bg-gray-400 text-white text-xs handle cursor-move border-t border-b border-white">
      <span className="border-r border-white px-1">🔙</span>
      <span className="border-r border-white px-1">🏠︎</span>
      <span className="px-2">{`C:\\Documents\\${title}.pdf`}</span>
    </div>
    <div className="p-4 text-xs text-gray-800 overflow-y-auto h-[160px] bg-white">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <div className="flex items-center">
          <img src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/pdf.png" alt="PDF" className="w-5 h-5 mr-2" />
          <span className="font-bold">{title}</span>
        </div>
        <div className="text-[10px] text-gray-500">PDF Document</div>
      </div>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

export default RulesDocument;