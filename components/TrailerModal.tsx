
// components/TrailerModal.tsx
"use client";

import React from 'react';
import Modal from './Modal';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
}

const TrailerModal = ({ isOpen, onClose, videoKey }: TrailerModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative pt-[56.25%]">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  );
};

export default TrailerModal;