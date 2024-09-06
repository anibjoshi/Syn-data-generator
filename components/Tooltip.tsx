import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react'; // Import the X icon from lucide-react

interface TooltipProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

export const Tooltip: React.FC<TooltipProps> = ({ content, isOpen, onClose, position }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      className="fixed bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50"
      style={{
        maxWidth: '300px',
        width: 'max-content',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">Suggestion:</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-indigo-600">$1</span>') }} />
    </div>,
    document.body
  );
};