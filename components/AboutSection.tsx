import React, { useState, useEffect } from 'react';
import { ChevronDown, Film, Award, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CLUB_DETAILS, INITIAL_HIERARCHY } from '../constants';
import { ClubDetails, ClubHierarchy } from '../types';

const AboutSection: React.FC = () => {
    const [details, setDetails] = useState<ClubDetails>(CLUB_DETAILS);
    const [hierarchy, setHierarchy] = useState<ClubHierarchy>(INITIAL_HIERARCHY);

    useEffect(() => {
        const savedDetails = localStorage.getItem('club_details');
        if (savedDetails) setDetails(JSON.parse(savedDetails));

        const savedHierarchy = localStorage.getItem('club_hierarchy');
        if (savedHierarchy) setHierarchy(JSON.parse(savedHierarchy));
    }, []);

    return (
        <section id="about" className="py-24 bg-film-black relative overflow-hidden">
            {/* Cinematic Background Lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                <div className="absolute top-0 left-1/4 w-px h-full bg-white transform -skew-x-12"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-white transform -skew-x-12"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left side: Dramatic Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-film-red"></div>
                            <span className="text-film-red text-xs uppercase tracking-[0.5em] font-mono font-bold">The Narrative</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-cinzel text-white mb-8 italic">
                            Establishing <br />
                            <span className="text-film-gold">Perspective.</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-serif leading-relaxed mb-10 italic">
                            "{details.description}"
                        </p>

                        <Link
                            to="/about"
                            className="group flex items-center gap-4 text-white hover:text-film-gold transition-all duration-300"
                        >
                            <span className="text-sm uppercase tracking-[0.4em] font-mono border-b border-white/20 pb-1 group-hover:border-film-gold">
                                Enter the Archive
                            </span>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-film-gold group-hover:border-film-gold transition-all">
                                <ChevronRight className="w-5 h-5 group-hover:text-black transition-colors" />
                            </div>
                        </Link>
                    </motion.div>

                    {/* Right side: Modern Profile Cards (Primary 3) */}
                    <div className="grid gap-6">
                        {[
                            ...hierarchy.facultyCoordinators.map(m => ({ role: 'FACULTY', data: m, color: 'film-gold' })),
                            ...hierarchy.chairpersons.map(m => ({ role: 'CHAIRPERSON', data: m, color: 'film-red' })),
                            ...hierarchy.viceChairpersons.map(m => ({ role: 'VICE CHAIR', data: m, color: 'white' }))
                        ].map((member: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-film-dark/80 backdrop-blur-xl border border-white/5 p-6 flex gap-6 items-center group hover:border-white/20 transition-all rounded-sm"
                            >
                                <img
                                    src={member.data.imageUrl}
                                    className={`w-20 h-20 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all ring-1 ring-white/10`}
                                    alt={member.role}
                                />
                                <div>
                                    <span className={`text-${member.color} text-[10px] font-mono tracking-widest font-bold uppercase`}>{member.role}</span>
                                    <h4 className="text-xl font-cinzel text-white mt-1">{member.data.name}</h4>
                                    <p className="text-xs text-gray-500 italic mt-1 font-serif">"{member.data.favoriteFilm}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
