import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Main Cursor (Clapperboard) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] text-film-gold filter drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isHovering ? 1.3 : (isClicked ? 0.85 : 1),
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.1
        }}
      >
        <div className="relative">
          {/* Clapperboard Top (the moving part) */}
          <motion.svg
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            animate={{ rotate: isClicked ? 0 : -30 }}
            style={{ originX: "2px", originY: "14px" }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <path d="M20.2 6 3 11l-.9-2.4c-.3-.7.1-1.4.8-1.7l15-4.4c.7-.3 1.4.1 1.7.8z" />
          </motion.svg>

          {/* Clapperboard Bottom (the static part) */}
          <svg
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute top-0 left-0"
          >
            <rect width="18" height="12" x="3" y="8" rx="2" />
            <path d="M7 8v12M11 8v12M15 8v12M19 8v12" />
            <path d="M3 12h18" />
          </svg>
        </div>
      </motion.div>

      {/* Spotlight Effect */}
      <motion.div
        className="fixed top-0 left-0 w-48 h-48 border border-film-gold/5 rounded-full pointer-events-none z-[99]"
        animate={{
          x: position.x - 96,
          y: position.y - 96,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
    </>
  );
};

export default CustomCursor;
