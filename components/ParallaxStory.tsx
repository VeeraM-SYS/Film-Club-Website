import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParallaxStory: React.FC = () => {
    const { scrollY } = useScroll();

    // Parallax transforms
    const y1 = useTransform(scrollY, [0, 5000], [0, 1000]); // Moves slow
    const y2 = useTransform(scrollY, [0, 5000], [0, -500]); // Moves up
    const reelY = useTransform(scrollY, [0, 4000], [0, -2000]); // Film reel movement

    const smoothReelY = useSpring(reelY, { stiffness: 40, damping: 30 });

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Layer 1: Deep textured fog/noise moving slowly */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black opacity-50"
            />

            {/* Layer 2: Floating cinematic dust particles */}
            <motion.div
                style={{ y: y2 }}
                className="absolute inset-0 opacity-20"
            >
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-film-gold rounded-full blur-[2px]" />
                <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-white rounded-full blur-[1px]" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-film-red rounded-full blur-[4px]" />
                {/* Randomly placed stars/dust */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </motion.div>

            {/* The Film Reel - Left Side */}
            <div className="absolute left-0 md:left-4 top-0 h-[200vh] w-12 md:w-16 flex flex-col opacity-10 md:opacity-15 border-x border-white/5 bg-black/20 backdrop-blur-[1px]">
                <motion.div style={{ y: smoothReelY }} className="w-full">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="w-full aspect-[3/4] border-b border-white/10 relative flex items-center justify-center">
                            {/* Sprocket Holes Left */}
                            <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-1">
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                            </div>

                            {/* Sprocket Holes Right */}
                            <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-1">
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                                <div className="w-1 h-1.5 bg-white/30 rounded-[1px]"></div>
                            </div>

                            {/* Frame Content placeholder */}
                            <div className="w-3/5 h-4/5 border border-white/5 bg-white/5 flex items-center justify-center">
                                <span className="text-[8px] font-mono text-white/20">{i + 1}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Side Counterbalance Line */}
            <div className="absolute right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-film-gold/20 to-transparent"></div>
        </div>
    );
};

export default ParallaxStory;
