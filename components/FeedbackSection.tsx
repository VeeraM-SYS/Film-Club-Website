import React, { useState } from 'react';
import { MessageSquare, Clapperboard, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateDirectorResponse } from '../services/geminiService';
import { apiService } from '../services/apiService';

const FeedbackSection: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setLoading(true);
        // Submit to backend
        try {
            await apiService.submitReview({
                userName: "Audience Member", // Or prompt for name
                comment: feedback,
                rating: 5
            });
        } catch (e) {
            console.error("Failed to submit review", e);
        }

        // Simulate AI interaction
        const aiResponse = await generateDirectorResponse(feedback);
        setResponse(aiResponse);
        setLoading(false);
    };

    return (
        <section id="feedback" className="py-20 bg-film-black relative overflow-hidden">
            {/* Spotlight Effect */}
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-film-red/5 blur-[120px] rounded-full pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto px-6 relative z-10 max-w-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                        Audience Review
                    </h2>
                    <p className="text-gray-400 italic">
                        Leave a message for the society. The Director might just reply.
                    </p>
                </div>

                <motion.div
                    className="bg-film-dark/50 backdrop-blur-sm border border-film-gray/30 p-8 rounded-lg shadow-2xl"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    {!response ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Type your feedback or thoughts here..."
                                    className="w-full h-32 bg-black/40 border border-film-gray text-gray-200 p-4 focus:outline-none focus:border-film-gold focus:ring-1 focus:ring-film-gold transition-all resize-none font-mono text-sm"
                                    required
                                />
                                <Clapperboard className="absolute right-4 bottom-4 text-gray-600 w-5 h-5" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-film-red text-white font-bold py-3 px-6 uppercase tracking-widest hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Processing Script...</span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Submit for Review
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 bg-film-gold rounded-full flex items-center justify-center">
                                    <Sparkles className="text-black w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-film-gold font-serif text-xl mb-4">From the Director's Chair:</h3>
                            <p className="text-xl text-gray-200 font-serif italic mb-8 leading-relaxed">
                                "{response}"
                            </p>
                            <button
                                onClick={() => { setResponse(null); setFeedback(''); }}
                                className="text-xs text-gray-500 hover:text-white underline uppercase tracking-widest"
                            >
                                Write another review
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default FeedbackSection;
