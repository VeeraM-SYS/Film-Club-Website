import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CLUB_DETAILS, INITIAL_HIERARCHY } from '../constants';
import { Film, Users, Award, BookOpen, Camera, PenTool, Sparkles, Mic2, Tv, Calendar } from 'lucide-react';
import Scene3D from '../components/Scene3D';
import { ClubHierarchy, ClubDetails } from '../types';

const AboutPage: React.FC = () => {
    const [details, setDetails] = useState<ClubDetails>(CLUB_DETAILS);
    const [hierarchy, setHierarchy] = useState<ClubHierarchy>(INITIAL_HIERARCHY);

    useEffect(() => {
        const savedDetails = localStorage.getItem('club_details');
        if (savedDetails) setDetails(JSON.parse(savedDetails));

        const savedHierarchy = localStorage.getItem('club_hierarchy');
        if (savedHierarchy) setHierarchy(JSON.parse(savedHierarchy));

        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 min-h-screen bg-black text-white relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <Scene3D />
            </div>

            <div className="container mx-auto px-6 relative z-10 pb-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-7xl font-cinzel text-film-gold mb-6 italic tracking-tighter shadow-film-gold">{details.name}</h1>
                    <div className="h-px w-40 bg-film-red mx-auto mb-6"></div>
                    <p className="text-gray-400 font-serif max-w-3xl mx-auto text-lg leading-relaxed italic px-4">
                        "{details.description}"
                    </p>
                </motion.div>

                {/* Top Tier: Faculty Coordinator - Centered & Elevated */}
                <div className="mb-16 flex justify-center">
                    {hierarchy.facultyCoordinators[0] && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-film-dark/60 backdrop-blur-xl border border-film-gold/30 p-10 text-center rounded-sm relative overflow-hidden group max-w-md transform -translate-y-4 shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-film-gold text-black text-[10px] font-bold uppercase tracking-widest">
                                Faculty Mentor
                            </div>
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                <Award className="w-16 h-16 text-film-gold" />
                            </div>
                            <img src={hierarchy.facultyCoordinators[0].imageUrl} className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-film-gold/50 grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-transparent hover:ring-film-gold/20" alt="Faculty" />
                            <h3 className="text-3xl font-cinzel text-white mb-2">{hierarchy.facultyCoordinators[0].name}</h3>
                            <p className="text-film-gold text-xs uppercase tracking-[0.3em] font-bold mb-4">{hierarchy.facultyCoordinators[0].role}</p>
                            <div className="text-xs text-gray-500 font-mono italic">"Inspiring cinematic excellence through mentorship."</div>
                        </motion.div>
                    )}
                </div>

                {/* Second Tier: Chairperson & Vice Chairperson */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
                    {/* Chairperson */}
                    {hierarchy.chairpersons[0] && (
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-film-red/5 backdrop-blur-xl border border-film-red/40 p-8 text-center rounded-sm relative shadow-[0_10px_30px_rgba(229,9,20,0.1)] group"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-film-red text-white text-[9px] font-bold uppercase tracking-widest">
                                Chairperson
                            </div>
                            <img src={hierarchy.chairpersons[0].imageUrl} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-3 border-film-red/30 grayscale group-hover:grayscale-0 transition-all duration-700 ring-2 ring-transparent hover:ring-film-red/20" alt="Chairperson" />
                            <h3 className="text-2xl font-cinzel text-white mb-2">{hierarchy.chairpersons[0].name}</h3>
                            <p className="text-film-red text-xs uppercase tracking-[0.3em] font-bold mb-3">{hierarchy.chairpersons[0].role}</p>
                            <div className="text-xs text-gray-400 font-mono italic">Favorite: {hierarchy.chairpersons[0].favoriteFilm}</div>
                        </motion.div>
                    )}

                    {/* Vice Chairperson */}
                    {hierarchy.viceChairpersons[0] && (
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-film-dark/60 backdrop-blur-xl border border-white/10 p-8 text-center rounded-sm group"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                                Vice Chairperson
                            </div>
                            <img src={hierarchy.viceChairpersons[0].imageUrl} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-2 border-white/20 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Vice Chair" />
                            <h3 className="text-2xl font-cinzel text-white mb-2">{hierarchy.viceChairpersons[0].name}</h3>
                            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] font-bold mb-3">{hierarchy.viceChairpersons[0].role}</p>
                            <div className="text-xs text-gray-500 font-mono italic">Favorite: {hierarchy.viceChairpersons[0].favoriteFilm}</div>
                        </motion.div>
                    )}
                </div>

                {/* 8 Departments Grid */}
                <div className="mb-20">
                    <h2 className="text-4xl font-cinzel text-center text-white mb-16 italic underline decoration-film-red decoration-2 underline-offset-8">The Eight Pillars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hierarchy.departments.map((dept: any, index: number) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-film-dark/40 border border-white/5 p-6 group hover:border-film-gold/30 transition-all duration-500 hover:bg-white/5"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <img src={dept.lead.imageUrl} className="w-20 h-20 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all ring-1 ring-white/10 group-hover:ring-film-gold/50" alt={dept.lead.name} />
                                        <div className="absolute -bottom-2 -right-2 bg-film-gold text-black w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                                            0{index + 1}
                                        </div>
                                    </div>
                                    <h4 className="text-film-gold font-cinzel text-lg mb-1">{dept.name}</h4>
                                    <p className="text-white font-serif text-sm border-t border-white/10 pt-2 w-full text-center mt-2">{dept.lead.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Lead Architect</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Branding/Footer Mini */}
                <div className="text-center pt-20 border-t border-white/5">
                    <div className="flex justify-center gap-12 text-gray-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                        <span>EST 2024</span>
                        <span className="text-film-red">●</span>
                        <span>PRODUCTION HOUSE</span>
                        <span className="text-film-red">●</span>
                        <span>CINEMATIC ARCHIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
