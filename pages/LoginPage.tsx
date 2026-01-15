import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Film } from 'lucide-react';
import { apiService } from '../services/apiService';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await apiService.login(username, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/leads');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Film Strips */}
            <div className="absolute top-0 left-10 h-full w-20 border-x border-white/5 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 right-10 h-full w-20 border-x border-white/5 opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-film-dark/80 backdrop-blur-2xl border border-white/10 p-10 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-film-red/20 flex items-center justify-center mb-4 mx-auto border border-film-red/50">
                        <Lock className="w-8 h-8 text-film-red" />
                    </div>
                    <h1 className="text-3xl font-cinzel text-white italic">Stage Entrance</h1>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-2 px-12">Authorized Personnel Only</p>
                    {error && (
                        <div className="mt-4 p-3 bg-film-red/10 border border-film-red/50 text-film-red text-xs font-mono uppercase tracking-wider animate-shake">
                            {error}
                        </div>
                    )}
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Access ID (Username)</label>
                        <input
                            required
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-gold outline-none transition-all font-mono text-sm"
                            placeholder="director"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Secure Token (Password)</label>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-gold outline-none transition-all font-mono text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-film-gold transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-film-red hover:bg-red-800 text-white font-bold py-4 uppercase tracking-[0.3em] text-xs transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Film className="w-4 h-4" /> Initiate Session
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] text-gray-600 hover:text-film-gold uppercase tracking-widest transition-colors font-mono"
                    >
                        ← Back to Production Lobby
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
