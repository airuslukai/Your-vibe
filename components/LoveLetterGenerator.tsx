import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Loader2, Sparkles, PenTool, Star, Scroll } from 'lucide-react';
import { generateLoveLetter } from '../services/geminiService';
import { LoveLetterConfig } from '../types';

const LoveLetterGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState('');
  const [config, setConfig] = useState<LoveLetterConfig>({
    name: '',
    relationship: 'Soulmate',
    favoriteTrait: '',
    vibe: 'poetic'
  });

  const handleGenerate = async () => {
    if (!config.name) return;
    setLoading(true);
    const result = await generateLoveLetter(config);
    setLetter(result);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16 pb-20">
      {!letter ? (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-morphism p-12 md:p-20 rounded-[5rem] border border-white/10 relative overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 blur-[150px] -z-10 rounded-full" />
          
          <div className="flex flex-col items-center gap-6 mb-20 text-center">
            <div className="p-6 rounded-full bg-pink-500/10 border border-pink-500/20 shadow-[0_0_30px_rgba(255,77,109,0.2)]">
              <PenTool className="w-10 h-10 text-pink-400" />
            </div>
            <h2 className="text-5xl font-serif text-white tracking-tight italic">The Script of the Soul</h2>
            <div className="flex items-center gap-4 text-white/30 text-xs uppercase font-black tracking-[0.5em]">
              <div className="h-px w-8 bg-current" />
              Sacred Instructions
              <div className="h-px w-8 bg-current" />
            </div>
            <p className="text-white/40 text-lg italic max-w-lg">Inform the Muse of the context, and watch as your devotion is woven into literature.</p>
          </div>

          <div className="space-y-14">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Star className="w-3 h-3 text-gold" />
                <label className="block text-pink-300 font-black uppercase tracking-[0.4em] text-[10px]">Her Divine Name</label>
              </div>
              <input 
                type="text" 
                placeholder="The keeper of my heart..."
                className="w-full bg-white/[0.02] border-b-2 border-white/10 px-4 py-8 text-3xl text-white placeholder:text-white/5 focus:outline-none focus:border-pink-500 transition-all font-serif italic rounded-t-2xl"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Star className="w-3 h-3 text-gold" />
                <label className="block text-pink-300 font-black uppercase tracking-[0.4em] text-[10px]">Her Greatest Radiance</label>
              </div>
              <input 
                type="text" 
                placeholder="The universe in her eyes, the grace in her step..."
                className="w-full bg-white/[0.02] border-b-2 border-white/10 px-4 py-8 text-xl text-white placeholder:text-white/5 focus:outline-none focus:border-pink-500 transition-all font-classic rounded-t-2xl"
                value={config.favoriteTrait}
                onChange={(e) => setConfig({ ...config, favoriteTrait: e.target.value })}
              />
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Star className="w-3 h-3 text-gold" />
                <label className="block text-pink-300 font-black uppercase tracking-[0.4em] text-[10px]">The Atmospheric Vibe</label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(['poetic', 'deep', 'playful', 'short'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setConfig({ ...config, vibe: v })}
                    className={`py-5 rounded-3xl border-2 text-[12px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${config.vibe === v ? 'bg-pink-500 border-pink-500 text-white shadow-[0_10px_30px_rgba(255,77,109,0.5)]' : 'bg-transparent border-white/5 text-white/30 hover:border-white/20'}`}
                  >
                    {v}
                    {config.vibe === v && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !config.name}
              className="group w-full py-10 bg-white text-black text-xs rounded-full font-black uppercase tracking-[0.8em] flex items-center justify-center gap-6 shadow-[0_30px_80px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-pink-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Scroll className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
              <span className="relative z-10">{loading ? "Aligning the Stars..." : "Emanate Sentiment"}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 1.5, type: "spring", damping: 15 }}
          className="relative bg-[#fcfaf5] text-stone-900 p-12 md:p-28 rounded-lg shadow-[0_60px_150px_rgba(0,0,0,0.8)] border border-stone-200/50 perspective-2000"
          style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(200,180,150,0.05) 100%)' }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-l-2 border-stone-200" />
          <div className="absolute top-12 right-12 w-20 h-20 border-t-2 border-r-2 border-stone-200" />
          <div className="absolute bottom-12 left-12 w-20 h-20 border-b-2 border-l-2 border-stone-200" />
          <div className="absolute bottom-12 right-12 w-20 h-20 border-b-2 border-r-2 border-stone-200" />

          <div className="font-romantic text-6xl md:text-8xl mb-16 text-rose-900 border-b-2 border-stone-100 pb-12 italic tracking-tight">My Eternal {config.name},</div>
          
          <div className="font-classic leading-[2.4] text-xl md:text-3xl space-y-12 whitespace-pre-line italic text-stone-800/90 first-letter:text-8xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-rose-900 drop-shadow-sm">
            {letter}
          </div>

          <div className="mt-24 pt-16 border-t-2 border-stone-100 flex flex-col items-end gap-3">
            <div className="font-romantic text-6xl text-rose-900">Your Devoted Muse</div>
            <div className="text-[11px] tracking-[0.8em] uppercase font-black text-stone-300">Written in the firmament</div>
          </div>

          {/* Wax Seal */}
          <motion.div 
            initial={{ scale: 3, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full flex items-center justify-center text-white font-serif font-black text-5xl bg-[#8b0000] border-8 border-rose-900 shadow-2xl z-50 hover:scale-110 transition-transform cursor-pointer"
          >
            M
            <div className="absolute inset-2 border-2 border-white/20 rounded-full" />
          </motion.div>
          
          <button 
            onClick={() => setLetter('')}
            className="mt-40 w-full text-[11px] font-black uppercase tracking-[0.6em] text-stone-400 hover:text-rose-700 transition-all flex items-center justify-center gap-6 group"
          >
            <div className="h-[1px] w-20 bg-stone-100 group-hover:bg-rose-200 group-hover:w-32 transition-all" />
            Recraft this prayer
            <div className="h-[1px] w-20 bg-stone-100 group-hover:bg-rose-200 group-hover:w-32 transition-all" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default LoveLetterGenerator;