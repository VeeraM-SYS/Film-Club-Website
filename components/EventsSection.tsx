import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, PlayCircle } from 'lucide-react';
import { UPCOMING_EVENTS } from '../constants';
import { Event } from '../types';

const EventsSection: React.FC = () => {
    const [events, setEvents] = useState<Event[]>(UPCOMING_EVENTS);

    useEffect(() => {
        const savedEvents = localStorage.getItem('club_events');
        if (savedEvents) setEvents(JSON.parse(savedEvents));
    }, []);

    return (
        <section id="events" className="py-24 bg-black relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-film-red to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-film-red text-xs uppercase tracking-[0.5em] font-mono mb-4">Programming</h2>
                        <h3 className="text-5xl font-cinzel text-white italic">Now <span className="text-film-gold">Showing</span></h3>
                    </motion.div>

                    <motion.p
                        className="text-gray-500 max-w-md text-right font-serif italic"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        "A curator's selection of upcoming experiences from workshops to midnight screenings."
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {events.map((event: any, index: number) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-film-dark border border-white/5 overflow-hidden rounded-sm hover:border-film-gold/30 transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    <span className="px-3 py-1 bg-film-red text-white text-[10px] uppercase font-bold tracking-widest">
                                        {event.type}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center gap-2 text-film-gold text-xs font-mono mb-4">
                                    <Calendar className="w-3 h-3" />
                                    <span>{event.date}</span>
                                </div>
                                <h4 className="text-2xl font-cinzel text-white mb-4 group-hover:text-film-gold transition-colors">{event.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-serif">
                                    {event.description}
                                </p>

                                <a
                                    href={event.registrationLink}
                                    className="inline-flex items-center gap-2 text-white hover:text-film-red transition-colors text-xs font-bold uppercase tracking-[0.2em] border-b border-white/10 pb-1"
                                >
                                    Secure Ticket <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            {/* Ticket Hole Aesthetic */}
                            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-black rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-black rounded-full transform -translate-y-1/2"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
