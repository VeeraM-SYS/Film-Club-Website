import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { CLUB_DETAILS } from '../constants';
import Scene3D from './Scene3D';
import { ClubDetails } from '../types';

const Hero: React.FC = () => {
  const [details, setDetails] = useState<ClubDetails>(CLUB_DETAILS);

  useEffect(() => {
    const savedDetails = localStorage.getItem('club_details');
    if (savedDetails) setDetails(JSON.parse(savedDetails));
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">

      {/* 3D Background */}
      <Scene3D />

      {/* Overlay Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none z-0"></div>

      {/* Film Grain Texture */}
      <div className="film-grain"></div>

      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="mb-4 flex justify-center"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="h-1 w-24 bg-film-red shadow-[0_0_15px_#8a1c1c]"></div>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-cinzel text-white mb-6 tracking-widest uppercase drop-shadow-2xl mix-blend-difference">
          {details.name}
        </h1>

        <p className="text-xl md:text-2xl font-serif text-gray-300 italic mb-10 tracking-wide opacity-90">
          "Where life meets the lens."
        </p>

        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <a href="#events" className="px-8 py-3 bg-film-red text-white font-bold uppercase tracking-widest hover:bg-red-800 transition-colors shadow-[0_0_20px_rgba(138,28,28,0.5)] border border-transparent hover:border-white">
            Now Showing
          </a>
          <a href="#about" className="group flex items-center gap-2 text-white hover:text-film-gold transition-colors font-mono uppercase text-sm tracking-widest backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10 hover:border-film-gold/50">
            <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:border-film-gold transition-colors group-hover:bg-film-gold group-hover:text-black">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </span>
            View Trailer
          </a>
        </motion.div>
      </motion.div>

      {/* Scrolling Text at Bottom */}
      <div className="absolute bottom-0 w-full bg-film-red/10 backdrop-blur-md border-t border-film-red/30 py-3 overflow-hidden whitespace-nowrap z-20">
        <div className="animate-scroll inline-block text-film-gold font-mono text-xs uppercase tracking-[0.3em] opacity-80">
          +++ RECRUITMENT OPENING SOON +++ EXCLUSIVE SCREENING FRIDAY 18:00 +++ WORKSHOP REGISTRATION LIVE +++ JOIN THE FILM SOCIETY +++
        </div>
        <div className="animate-scroll inline-block text-film-gold font-mono text-xs uppercase tracking-[0.3em] opacity-80" aria-hidden="true">
          +++ RECRUITMENT OPENING SOON +++ EXCLUSIVE SCREENING FRIDAY 18:00 +++ WORKSHOP REGISTRATION LIVE +++ JOIN THE FILM SOCIETY +++
        </div>
      </div>
    </div>
  );
};

export default Hero;
