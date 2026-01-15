import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Film, ChevronRight, Settings, Users } from 'lucide-react';
import Scene3D from '../components/Scene3D';

const LandingPage: React.FC = () => {
    const [showIntro, setShowIntro] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col md:flex-row">
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <Scene3D />
            </div>

            {/* Cinematic Intro Overlay */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: showIntro ? 1 : 0, pointerEvents: showIntro ? 'auto' : 'none' }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black"
            >
                <div className="text-center">
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-6xl md:text-9xl font-cinzel text-film-gold tracking-widest uppercase"
                    >
                        Film Society
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-film-red font-mono tracking-[1em] uppercase text-xs mt-6"
                    >
                        Presents
                    </motion.p>
                </div>
            </motion.div>

            {/* Split Screen Content */}
            <motion.div
                className="flex-1 flex flex-col md:flex-row w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: showIntro ? 0 : 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                {/* Visitor Side - Main Entrance */}
                <Link
                    to="/home"
                    className="relative flex-1 group flex flex-col items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden hover:bg-film-red/5 transition-all duration-700"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:border-film-gold/50 group-hover:bg-film-gold/10 transition-all duration-500 mx-auto">
                            <Film className="w-10 h-10 text-white group-hover:text-film-gold" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-4 italic group-hover:text-film-gold transition-colors">Viewing Room</h2>
                        <p className="text-gray-500 font-mono tracking-widest text-sm uppercase mb-6">Enter The Narrative</p>
                        <div className="flex items-center gap-2 text-film-red font-bold text-xs uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            Begin Session <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>

                    {/* Animated Background Text */}
                    <div className="absolute -bottom-10 -left-10 text-[10rem] font-cinzel text-white/5 pointer-events-none select-none italic group-hover:text-film-gold/10 transition-colors">
                        CINEMA
                    </div>
                </Link>

                {/* Club Leads / Faculty Side */}
                <Link
                    to="/login"
                    className="relative flex-1 group flex flex-col items-center justify-center p-12 overflow-hidden hover:bg-film-gold/5 transition-all duration-700"
                >
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:border-film-red/50 group-hover:bg-film-red/10 transition-all duration-500 mx-auto">
                            <Users className="w-10 h-10 text-white group-hover:text-film-red" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-cinzel text-white mb-4 italic group-hover:text-film-red transition-colors">The Cast</h2>
                        <p className="text-gray-500 font-mono tracking-widest text-sm uppercase mb-6">Club Leads & Faculty</p>
                        <div className="flex items-center gap-2 text-film-gold font-bold text-xs uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            Director's Access <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>

                    {/* Animated Background Text */}
                    <div className="absolute -bottom-10 -right-10 text-[10rem] font-cinzel text-white/5 pointer-events-none select-none italic group-hover:text-film-red/10 transition-colors">
                        ACCESS
                    </div>
                </Link>
            </motion.div>

            {!showIntro && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-20">
                    <div className="h-px w-24 bg-film-red mx-auto mb-4"></div>
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.5em]">The Film Society Production</p>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
