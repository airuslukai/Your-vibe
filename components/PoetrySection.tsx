import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Quote, Feather } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const fallbackPoems = [
  "In the silence of the stars, I found the echo of your soul, a masterpiece written in stardust.",
  "Eternity is but a single breath shared between our hearts.",
  "Your presence is the only gravity my soul has ever known.",
  "If every thought of you was a star, the night would be blinded by brilliance.",
  "Our love is an ancient language that the world has long forgotten, but our hearts speak fluently."
];

const PoetrySection: React.FC = () => {
  const [poetry, setPoetry] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const generatePoem = async () => {
    if (clickCount < 3) {
      setPoetry(fallbackPoems[clickCount]);
      setClickCount(prev => prev + 1);
      return;
    }

    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Write one single, extremely powerful, poetic, and soul-crushing romantic line about eternal love. Maximum 20 words. No emojis. The tone should be high-end, classic literature style.",
        config: { 
          temperature: 1,
          thinkingConfig: { thinkingBudget: 0 } 
        }
      });
      setPoetry(response.text?.trim() || fallbackPoems[Math.floor(Math.random() * fallbackPoems.length)]);
    } catch (e) {
      setPoetry(fallbackPoems[Math.floor(Math.random() * fallbackPoems.length)]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative">
      <div className="absolute inset-0 bg-pink-500/5 blur-[150px] rounded-full -z-10" />
      
      <AnimatePresence mode="wait">
        {poetry ? (
          <motion.div
            key={poetry}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl space-y-16"
          >
            <div className="relative inline-block">
              <Quote className="w-20 h-20 text-gold/5 mx-auto -mb-10" />
              <Feather className="w-8 h-8 text-gold/20 absolute -top-4 -right-8 animate-bounce-slow" />
            </div>
            
            <h2 className="text-5xl md:text-[7rem] font-romantic text-white leading-[1.2] italic text-glow px-4 drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              {poetry}
            </h2>
            
            <div className="flex flex-col items-center gap-6 pt-10">
              <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <p className="text-[10px] font-black uppercase tracking-[1em] text-gold/40">The Verse of the Infinite</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-pink-200/20 font-serif text-4xl italic tracking-[0.3em] flex flex-col items-center gap-8"
          >
            <Sparkles className="w-12 h-12 mb-4 animate-pulse" />
            Beckon the Muse to speak...
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={generatePoem}
        disabled={loading}
        whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212,175,55,0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="mt-32 px-20 py-10 bg-white/5 border border-white/10 rounded-full flex items-center gap-10 text-[12px] font-black uppercase tracking-[0.8em] hover:bg-white/10 transition-all backdrop-blur-3xl shadow-2xl group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {loading ? <Loader2 className="w-6 h-6 animate-spin text-gold" /> : <Sparkles className="w-6 h-6 text-gold group-hover:rotate-45 transition-transform" />}
        {loading ? "Aligning Constellations..." : "Manifest Divine Verse"}
      </motion.button>
      
      <div className="mt-20 opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">Each line is generated from the deep currents of the cosmic muse.</p>
      </div>
    </div>
  );
};

export default PoetrySection;