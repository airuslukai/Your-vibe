
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, Sparkles, Camera } from 'lucide-react';
import { Memory } from '../types';

interface GalleryProps {
  memories: Memory[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Gallery: React.FC<GalleryProps> = ({ memories, onUpload }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % (memories.length || 1));
  const prev = () => setIndex((prev) => (prev - 1 + memories.length) % (memories.length || 1));

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 md:p-24 border-2 border-dashed border-white/10 rounded-[5rem] bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <Camera className="w-24 h-24 text-pink-500/20 mb-12 animate-pulse" />
        <p className="text-pink-100/40 font-classic text-2xl md:text-4xl mb-14 text-center italic leading-relaxed">
          The sanctuary of memories <br className="hidden md:block"/> awaits your divine presence.
        </p>
        <label className="cursor-pointer bg-white text-black px-14 py-7 rounded-full font-black uppercase tracking-[0.5em] text-[11px] hover:scale-110 active:scale-95 transition-all shadow-2xl relative z-10">
          Illuminate The Vault
          <input type="file" multiple accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-20">
      <div className="relative group perspective-2000">
        {/* Extreme Romantic Filigree Accents */}
        <div className="absolute -top-10 -left-10 w-32 h-32 border-t-4 border-l-4 border-gold/30 rounded-tl-[4rem] z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        <div className="absolute -top-10 -right-10 w-32 h-32 border-t-4 border-r-4 border-gold/30 rounded-tr-[4rem] z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-4 border-l-4 border-gold/30 rounded-bl-[4rem] z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 border-b-4 border-r-4 border-gold/30 rounded-br-[4rem] z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        
        {/* Luxury Gold Leaf Inner Border */}
        <div className="relative aspect-square md:aspect-video overflow-hidden rounded-[4rem] shadow-[0_100px_200px_rgba(0,0,0,1)] border-[10px] border-white/5 bg-[#0a0104] backdrop-blur-3xl ring-2 ring-gold/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={memories[index].id}
              initial={{ opacity: 0, filter: 'blur(50px)', scale: 1.25, rotate: 2 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, rotate: 0 }}
              exit={{ opacity: 0, filter: 'blur(50px)', scale: 0.8, rotate: -2 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={memories[index].url} 
                alt="Memory" 
                className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
              />
              
              {/* Atmospheric Gradient Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.6)_100%)]" />
              
              {/* Contained Caption Container to prevent overflow */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.5 }}
                className="absolute inset-x-0 bottom-0 p-8 md:p-16 text-center z-10 flex flex-col items-center justify-end"
              >
                <div className="bg-black/40 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/10 max-w-[90%] md:max-w-[80%] shadow-2xl">
                  <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
                  <h3 className="font-romantic text-3xl md:text-6xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] italic text-glow leading-tight break-words">
                    {memories[index].caption}
                  </h3>
                  <div className="flex items-center justify-center gap-6 pt-6">
                    <div className="h-px w-12 bg-white/20" />
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] text-gold/60 italic">
                      {memories[index].date || "Eternity"}
                    </p>
                    <div className="h-px w-12 bg-white/20" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Buttons */}
          <button 
            onClick={prev} 
            className="absolute left-10 top-1/2 -translate-y-1/2 p-7 rounded-full glass-morphism text-white/40 hover:text-pink-500 hover:scale-110 active:scale-90 transition-all z-30 shadow-2xl group/btn border border-white/5"
          >
            <ChevronLeft className="w-10 h-10 group-hover/btn:-translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-10 top-1/2 -translate-y-1/2 p-7 rounded-full glass-morphism text-white/40 hover:text-pink-500 hover:scale-110 active:scale-90 transition-all z-30 shadow-2xl group/btn border border-white/5"
          >
            <ChevronRight className="w-10 h-10 group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Pagination dots with luxury glow */}
      <div className="flex flex-wrap justify-center gap-5">
        {memories.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group py-6 px-1 focus:outline-none"
          >
            <div className={`h-[3px] rounded-full transition-all duration-1000 ${i === index ? 'w-24 bg-gold shadow-[0_0_40px_rgba(212,175,55,1)] opacity-100' : 'w-5 bg-white/10 opacity-40 group-hover:opacity-80 group-hover:bg-white/20'}`} />
          </button>
        ))}
      </div>

      <motion.label 
        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255,77,109,0.3)' }}
        className="flex items-center justify-center gap-8 text-white/40 hover:text-gold transition-all cursor-pointer p-10 border border-white/5 rounded-full glass-morphism w-fit mx-auto shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="relative">
          <Sparkles className="w-8 h-8 animate-spin-slow text-gold" />
          <div className="absolute inset-0 bg-gold blur-2xl opacity-30" />
        </div>
        <span className="text-[14px] font-black uppercase tracking-[0.8em]">Populate the Firmament</span>
        <input type="file" multiple accept="image/*" onChange={onUpload} className="hidden" />
      </motion.label>
    </div>
  );
};

export default Gallery;
