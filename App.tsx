/// <reference path="./global.d.ts" />
/// <reference path="./vite-env.d.ts" />
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import DailyQuote from './components/DailyQuote';
import AboutSection from './components/AboutSection';
import EventsSection from './components/EventsSection';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import LeadsDashboard from './pages/LeadsDashboard';

import ParallaxStory from './components/ParallaxStory';

function HomePage() {
  return (
    <>
      <ParallaxStory />
      <main className="relative z-10">
        <Hero />
        <DailyQuote />
        <AboutSection />
        <EventsSection />
        <FeedbackSection />
        <FloatingSocials />
      </main>
      <Footer />
    </>
  );
}

const Navigation = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isLogin = location.pathname === '/login';

  if (isLanding || isLogin) return null;

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 pointer-events-none">
      <div className="flex justify-between items-center max-w-7xl mx-auto pointer-events-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Film Society Logo" className="h-16 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
        </Link>
        <div className="hidden md:flex gap-8 bg-black/80 backdrop-blur-md px-8 py-2 rounded-full border border-gray-800">
          <Link to="/home" className="text-xs uppercase tracking-widest hover:text-film-gold transition-colors">Home</Link>
          <a href="/home#about" className="text-xs uppercase tracking-widest hover:text-film-gold transition-colors">About</a>
          <a href="/home#events" className="text-xs uppercase tracking-widest hover:text-film-gold transition-colors">Events</a>
          <a href="/home#feedback" className="text-xs uppercase tracking-widest hover:text-film-gold transition-colors">Contact</a>
          <a href="https://forms.gle/recruitment_placeholder" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-film-red font-bold hover:brightness-125 transition-all border border-film-red px-4 py-1 rounded-full hover:bg-film-red hover:text-white">Join Us</a>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white selection:bg-film-red selection:text-white">
        <CustomCursor />

        <AnimatePresence mode="wait">
          {loading && <Loader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {!loading && (
          <>
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leads" element={<LeadsDashboard />} />
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
