import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1000); // Wait a bit after 1 before finishing
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Film Scratch Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] mix-blend-overlay"></div>
        
        {/* Central Countdown Circle */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 border-4 border-film-gray/50 rounded-full flex items-center justify-center">
            {/* Radar Sweep Animation */}
            <motion.div 
                className="absolute inset-0 rounded-full border-t-4 border-film-white/80"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: '#e5e5e5', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
            />
            
            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-film-gray/30"></div>
                <div className="h-full w-[1px] bg-film-gray/30 absolute"></div>
            </div>

            {/* Countdown Number */}
            <AnimatePresence mode="wait">
                <motion.span 
                    key={count}
                    className="text-8xl md:text-9xl font-mono font-bold text-white z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                >
                    {count > 0 ? count : ''}
                </motion.span>
            </AnimatePresence>
        </div>

        {/* Text */}
        <div className="absolute bottom-20 text-film-gray font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
            Loading 35mm Print...
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;
