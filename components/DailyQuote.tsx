import React, { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentService } from '../services/contentService';
import { DirectorQuote } from '../types';

const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<DirectorQuote | null>(null);

  useEffect(() => {
    ContentService.getDailyQuote().then(setQuote);
  }, []);

  if (!quote) return null;

  return (
    <motion.div 
        className="relative w-full py-16 bg-film-dark border-y border-film-gray/30 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
    >
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 text-film-gray/10 text-[20rem] font-serif leading-none select-none -translate-y-12 translate-x-10">
            "
        </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center mb-6">
            <Quote className="w-10 h-10 text-film-gold opacity-80" />
        </div>
        <motion.blockquote 
            className="font-serif text-2xl md:text-4xl italic text-gray-200 mb-6 tracking-wide leading-relaxed"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
        >
          "{quote.text}"
        </motion.blockquote>
        <cite className="block text-film-red uppercase tracking-[0.2em] text-sm font-bold not-italic">
          — {quote.author}
        </cite>
        <div className="mt-4 text-xs text-gray-600 font-mono">
            Daily Inspiration
        </div>
      </div>
    </motion.div>
  );
};

export default DailyQuote;
