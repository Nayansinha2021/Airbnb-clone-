import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, width = "md" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const widthClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }[width];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={clsx(
          "relative w-full bg-white rounded-2xl shadow-[var(--shadow-modal)] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200",
          widthClass
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-[var(--color-border-subtle)] relative">
          <button 
            onClick={onClose}
            className="absolute left-4 p-2 rounded-full hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="font-bold text-[var(--color-text-primary)] text-base">{title}</h2>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
