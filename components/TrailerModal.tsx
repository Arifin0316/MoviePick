"use client";

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
  videoTitle?: string;
}

const TrailerModal = ({ isOpen, onClose, videoKey, videoTitle }: TrailerModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Close when clicking outside the modal content
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleOutsideClick}
    >
      <div className="relative bg-gray-900 rounded-xl overflow-hidden w-full max-w-5xl shadow-2xl shadow-black/40 border border-gray-800 animate-fadeIn">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black to-transparent">
          <h3 className="text-white font-medium truncate pr-8">
            {videoTitle || 'Trailer Film'}
          </h3>
          <button 
            onClick={onClose}
            className="bg-black/40 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200 flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Youtube Embed with 16:9 Aspect Ratio */}
        <div className="pt-[56.25%] relative w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={videoTitle || "Trailer Film"}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// Add animation to CSS
const injectStyle = () => {
  if (typeof document !== 'undefined' && !document.getElementById('trailer-modal-style')) {
    const style = document.createElement('style');
    style.id = 'trailer-modal-style';
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

// Call the function to inject styles
if (typeof window !== 'undefined') {
  injectStyle();
}

export default TrailerModal;