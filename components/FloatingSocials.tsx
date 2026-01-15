import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import { CLUB_DETAILS } from '../constants';

const FloatingSocials: React.FC = () => {
    const [socials, setSocials] = React.useState({
        instagram: CLUB_DETAILS.instagram,
        youtube: CLUB_DETAILS.youtube
    });

    React.useEffect(() => {
        const saved = localStorage.getItem('club_details');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSocials({
                    instagram: parsed.instagram || CLUB_DETAILS.instagram,
                    youtube: parsed.youtube || CLUB_DETAILS.youtube
                });
            } catch (e) {
                console.error("Failed to parse social links", e);
            }
        }
    }, []);

    // Only render if we have at least one link
    if (!socials.instagram && !socials.youtube) return null;

    return (
        <div className="fixed right-6 top-32 flex flex-col gap-4 z-50">
            {socials.youtube && (
                <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black/50 hover:bg-[#FF0000] text-white flex items-center justify-center rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg group"
                >
                    <Youtube className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
            )}
            {socials.instagram && (
                <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black/50 hover:bg-pink-600 text-white flex items-center justify-center rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg group"
                >
                    <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
            )}
        </div>
    );
};

export default FloatingSocials;
