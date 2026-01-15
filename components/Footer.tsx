import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Youtube, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CLUB_DETAILS } from '../constants';

const Footer: React.FC = () => {
    const [details, setDetails] = React.useState(CLUB_DETAILS);
    const navigate = useNavigate();

    React.useEffect(() => {
        const saved = localStorage.getItem('club_details');
        if (saved) {
            try {
                setDetails({ ...CLUB_DETAILS, ...JSON.parse(saved) });
            } catch (e) {
                console.error("Failed to parse club details", e);
            }
        }
    }, []);

    return (
        <footer className="bg-black border-t-4 border-film-red pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12 mb-12">

                    {/* Brand */}
                    <div>
                        <h2 className="text-3xl font-cinzel text-white mb-6">
                            {details.name}
                        </h2>
                        <div className="space-y-2 text-gray-400 font-serif text-lg leading-relaxed border-l-2 border-film-red pl-4">
                            <p className="italic">" Lights . Lens . Legacy "</p>
                            <p className="font-bold text-film-gold">FFCS Club</p>
                            <p className="text-sm">@ VIT Chennai</p>
                        </div>
                    </div>

                    {/* Quick Actions / Recruitment */}
                    {details.recruitment && (
                        <div className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-white font-serif text-lg mb-6">Join the Cast</h3>
                            <a href={details.recruitment} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-film-gold transition duration-300 ease-out border-2 border-film-gold rounded-full shadow-md">
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-black duration-300 -translate-x-full bg-film-gold group-hover:translate-x-0 ease">
                                    <UserPlus className="w-5 h-5" />
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-film-gold transition-all duration-300 transform group-hover:translate-x-full ease">Accept Role</span>
                                <span className="relative invisible">Accept Role</span>
                            </a>
                            <p className="mt-4 text-xs text-gray-600">Auditions Open Spring 2024</p>
                        </div>
                    )}

                    {/* Socials - Aligned */}
                    <div className="flex flex-col items-center md:items-end">
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-white font-serif text-2xl text-center">Follow Us</h3>
                            <div className="flex gap-6 justify-center">
                                {details.youtube ? (
                                    <a href={details.youtube} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-film-dark hover:bg-[#FF0000] text-white flex items-center justify-center rounded-lg transition-all duration-300 group shadow-lg border border-white/5 hover:border-[#FF0000]/50">
                                        <Youtube className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    </a>
                                ) : (
                                    <span className="text-gray-600 text-xs">Youtube unavailable</span>
                                )}
                                {details.instagram ? (
                                    <a href={details.instagram} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-film-dark hover:bg-pink-600 text-white flex items-center justify-center rounded-lg transition-all duration-300 group shadow-lg border border-white/5 hover:border-pink-600/50">
                                        <Instagram className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    </a>
                                ) : (
                                    <span className="text-gray-600 text-xs">Instagram unavailable</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls & Copyright */}
                <div className="border-t border-white/5 pt-8 flex flex-col items-center gap-6">
                    {/* Arrows Only Navigation */}
                    <div className="flex justify-center items-center gap-12">
                        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-film-gold transition-all hover:scale-125 p-3 rounded-full hover:bg-white/5" aria-label="Previous">
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <div className="h-6 w-px bg-white/10"></div>
                        <button onClick={() => navigate(1)} className="text-gray-500 hover:text-film-red transition-all hover:scale-125 p-3 rounded-full hover:bg-white/5" aria-label="Next">
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Bottom Credit */}
                    <p className="text-[10px] text-gray-700 font-mono tracking-widest text-center">
                        @ 2024 Film Society - Made by Veera M
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
