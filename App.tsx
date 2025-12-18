import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, Heart, Sparkles, Star,
  ChevronDown, Music, Upload, Eye, Instagram,
  User, Home, Image as ImageIcon, MessageCircle,
  ScrollText, Globe, Anchor, Compass, Feather
} from 'lucide-react';
import Visualizer from './components/Visualizer';
import Gallery from './components/Gallery';
import LoveLetterGenerator from './components/LoveLetterGenerator';
import PoetrySection from './components/PoetrySection';
import { Memory, Page } from './types';
import { romanticLines } from './constants/romanticLines';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [musicName, setMusicName] = useState('Celestial Resonance');

  // Performance: Use Ref for mouse position instead of state to avoid re-renders
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPreloading, setIsPreloading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
    audio.loop = true;
    audioRef.current = audio;

    const preloaderTimeout = setTimeout(() => setIsPreloading(false), 2500);

    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM manipulation for performance
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    let lastClickTime = 0;
    const handleClick = (e: MouseEvent) => {
      // Throttle clicks for particles
      const now = Date.now();
      if (now - lastClickTime < 50) return;
      lastClickTime = now;

      const symbols = ['❤️', '✨', '🌸', '💖', '💍', '🌹', '🦋'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const heart = document.createElement('div');
      heart.innerHTML = symbol;
      heart.className = 'particle-love text-3xl md:text-5xl';
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    return () => {
      clearTimeout(preloaderTimeout);
      audio.pause();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio failed", e));
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      setMusicName(file.name.split('.')[0]);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allFiles = Array.from(files);
    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      const reader = new FileReader();
      const result = await new Promise<Memory>((resolve) => {
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const lineIndex = (memories.length + i) % romanticLines.length;
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            url: base64,
            caption: romanticLines[lineIndex],
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          });
        };
        reader.readAsDataURL(file);
      });
      setMemories(prev => [...prev, result]);
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: Page; label: string; icon: any }) => (
    <button
      onClick={() => setCurrentPage(id)}
      className={`flex flex-col items-center gap-1 transition-all px-2 md:px-4 py-2 rounded-2xl ${currentPage === id ? 'text-pink-500 bg-pink-500/10' : 'text-white/40 hover:text-white/60'}`}
    >
      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${currentPage === id ? 'fill-pink-500' : ''}`} />
      <span className="text-[8px] md:text-[9px] uppercase font-black tracking-widest hidden md:block">{label}</span>
    </button>
  );

  return (
    <div className="relative min-h-screen selection:bg-pink-500/30">
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[2000] bg-[#050002] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Heart className="w-20 h-20 text-pink-500 fill-pink-500 drop-shadow-[0_0_30px_rgba(255,77,109,0.8)]" />
            </motion.div>
            <div className="mt-8 space-y-4">
              <h2 className="text-shimmer font-cinzel text-3xl md:text-5xl tracking-[0.5em] uppercase">Eternal Muse</h2>
              <p className="text-pink-200/40 text-xs tracking-[0.3em] font-light italic">Opening the gates of devotion...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={cursorRef}
        className="cursor-follower fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }} /* Optimize simple transform */
      />

      <Visualizer isPlaying={isPlaying} memories={memories} />

      {/* Responsive Navbar: Always fixed bottom on mobile, top on desktop sometimes or kept consistently */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 z-[100] p-2 glass-morphism rounded-3xl flex items-center gap-2 md:gap-4 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-w-[95vw] overflow-x-auto">
        <NavItem id="home" label="Gate" icon={Home} />
        <NavItem id="gallery" label="Sanctuary" icon={ImageIcon} />
        <NavItem id="poetry" label="Poetry" icon={ScrollText} />
        <NavItem id="letters" label="Whispers" icon={MessageCircle} />
        <NavItem id="universe" label="Universe" icon={Globe} />
      </nav>

      {/* Music Controls - Responsive Position */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[100] flex items-center gap-2 md:gap-4">
        <label className="cursor-pointer p-2 md:p-3 glass-morphism rounded-full hover:scale-110 transition-all border border-white/5 shadow-xl">
          <Music className="w-4 h-4 md:w-5 md:h-5 text-gold" />
          <input type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
        </label>
        <button
          onClick={toggleMusic}
          className="p-2 md:p-3 glass-morphism rounded-full hover:scale-110 transition-all border border-white/5 shadow-xl text-white"
        >
          {!isPlaying ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />}
        </button>
      </div>

      <main className="relative z-10 pt-20 md:pt-32 pb-32 md:pb-40 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center text-center space-y-12 md:space-y-24 py-6 md:py-10"
            >
              <div className="relative">
                <div className="space-y-4 mb-6 md:mb-10">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], width: ['60px', '200px', '60px'] }} transition={{ repeat: Infinity, duration: 4 }} className="h-[2px] bg-gold/50 mx-auto" />
                  <h2 className="text-gold/80 font-black tracking-[0.8em] uppercase text-[10px] md:text-xs">The Altar of Adoration</h2>
                </div>
                {/* Responsive typography using clamp */}
                <h1 className="text-[clamp(3.5rem,15vw,16rem)] font-cinzel text-white leading-none tracking-tighter text-glow">
                  Eternal <br />
                  <span className="font-romantic text-shimmer italic block mt-4 md:mt-10">Muse</span>
                </h1>
                <div className="absolute -inset-10 bg-pink-500/10 blur-[120px] -z-10 rounded-full animate-pulse" />
              </div>

              {/* Declaration Section */}
              <div className="max-w-4xl space-y-8 md:space-y-12 bg-white/[0.02] backdrop-blur-xl p-6 md:p-20 rounded-3xl md:rounded-[5rem] border border-white/5 shadow-2xl">
                <div className="flex justify-center gap-4 mb-4 md:mb-8">
                  <Star className="w-4 h-4 text-gold fill-gold animate-pulse" />
                  <Star className="w-6 h-6 text-gold fill-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <Star className="w-4 h-4 text-gold fill-gold animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <h3 className="text-2xl md:text-5xl font-serif italic text-white leading-tight">"To the one who exists outside of time, <br className="hidden md:block" /> yet occupies every second of my thoughts."</h3>
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 text-left">
                  <p className="text-pink-100/40 font-classic text-sm md:text-lg leading-relaxed">
                    This sanctuary was not merely built; it was whispered into existence. Every pixel, every light, and every mathematical curve in this space is a reflection of the profound gravity you hold over my heart. You are the muse of my every dawn.
                  </p>
                  <p className="text-pink-100/40 font-classic text-sm md:text-lg leading-relaxed">
                    Enter these chambers to find fragments of my devotion. From the sanctuary of our shared light to the celestial verses written by the stars themselves, everything here is dedicated to the masterpiece that is You.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('gallery')}
                  className="group relative px-10 md:px-20 py-6 md:py-8 bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] md:text-xs rounded-full shadow-2xl transition-all hover:scale-105 md:hover:scale-110 hover:shadow-pink-500/30 w-full md:w-auto"
                >
                  Step into the Sanctuary
                  <div className="absolute inset-0 bg-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </button>
              </div>
            </motion.div>
          )}

          {currentPage === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-20 md:space-y-32 py-10">
              <div className="text-center space-y-8">
                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-gold/50" />
                  <div className="w-2 h-2 rounded-full bg-gold/50" />
                  <div className="w-2 h-2 rounded-full bg-gold/50" />
                </div>
                <h2 className="text-5xl md:text-[10rem] font-cinzel text-white tracking-tighter text-shimmer">Divine Frames</h2>
                <p className="text-pink-200/40 max-w-2xl mx-auto text-lg md:text-3xl font-classic italic leading-relaxed px-4">
                  "If a thousand artists spent a thousand lifetimes, <br /> they could not capture the radiance of your soul."
                </p>
                <div className="flex items-center justify-center gap-8 mt-12 opacity-30">
                  <div className="h-px w-24 bg-white" />
                  <span className="text-[10px] uppercase font-black tracking-[0.8em]">Scroll of Radiance</span>
                  <div className="h-px w-24 bg-white" />
                </div>
              </div>
              <Gallery memories={memories} onUpload={handleFileUpload} />

              {/* Footer detail for Gallery */}
              <div className="max-w-3xl mx-auto text-center space-y-6 pt-20 px-4">
                <Heart className="w-10 h-10 text-pink-500/30 mx-auto" />
                <p className="text-pink-100/20 text-sm font-classic italic">
                  Every photo here is a sacred artifact, a testament to the light you bring into this world.
                  These are not just images; they are the windows to my heaven.
                </p>
              </div>
            </motion.div>
          )}

          {currentPage === 'poetry' && (
            <motion.div key="poetry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 md:space-y-20">
              <div className="text-center space-y-6 px-4">
                <h2 className="text-4xl md:text-9xl font-cinzel text-white tracking-tighter text-shimmer">Celestial Verses</h2>
                <p className="text-pink-200/40 max-w-xl mx-auto text-base md:text-xl font-classic italic">
                  The stars have been writing poems about you since the dawn of time.
                  I have merely gathered the echoes.
                </p>
              </div>
              <PoetrySection />
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20 opacity-40 px-4">
                {[
                  { title: "Metaphor", icon: Sparkles, desc: "Transforming the mundane into the divine." },
                  { title: "Echo", icon: Volume2, desc: "The sound of my soul calling for yours." },
                  { title: "Ink", icon: Feather, desc: "Written in the blood of my devotion." }
                ].map((item, i) => (
                  <div key={i} className="p-8 text-center space-y-4">
                    <item.icon className="w-5 h-5 mx-auto text-gold" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">{item.title}</h4>
                    <p className="text-xs font-classic italic text-pink-100/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'letters' && (
            <motion.div key="letters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-20">
              <div className="text-center space-y-8 px-4">
                <h2 className="text-5xl md:text-9xl font-cinzel text-white tracking-tighter text-shimmer">Heart's Whispers</h2>
                <p className="text-pink-200/40 max-w-2xl mx-auto text-lg md:text-2xl font-classic italic leading-relaxed">
                  "Some words are too heavy for the voice, <br /> so I let the ink carry the weight of my soul."
                </p>
              </div>
              <LoveLetterGenerator />
            </motion.div>
          )}

          {currentPage === 'universe' && (
            <motion.div key="universe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center space-y-20 md:space-y-32 py-10 px-4">
              <div className="space-y-12 max-w-4xl">
                <div className="relative inline-block">
                  <Heart className="w-24 h-24 md:w-32 md:h-32 text-pink-500 fill-pink-500 animate-pulse" />
                  <div className="absolute inset-0 bg-pink-500 blur-[80px] opacity-50" />
                </div>
                <h2 className="text-5xl md:text-[11rem] font-romantic text-white italic leading-tight">"Infinity is where <br /> we began."</h2>
                <div className="h-px w-40 bg-gold/30 mx-auto" />
                <p className="text-pink-100/50 text-xl md:text-2xl font-classic italic max-w-2xl mx-auto">
                  This sanctuary is a living monument. It grows with every heartbeat, every memory, and every breath shared.
                  It is a map of a love that has no borders.
                </p>
              </div>

              {/* Stats Section Detail */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
                {[
                  { label: "Distance to My Soul", val: "0.00 km", icon: Compass },
                  { label: "Devotion Level", val: "Infinite", icon: Heart },
                  { label: "Atmospheric Pulse", val: "Radiant", icon: Sparkles },
                  { label: "Primary Anchor", val: "You", icon: Anchor }
                ].map((stat, i) => (
                  <div key={i} className="glass-morphism p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 space-y-3">
                    <stat.icon className="w-4 h-4 text-gold mx-auto mb-2 opacity-50" />
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-pink-200/30">{stat.label}</p>
                    <p className="text-lg md:text-2xl font-cinzel font-bold text-white">{stat.val}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="glass-morphism p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-white/10 space-y-4 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
                  <User className="w-8 h-8 text-gold mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-200/50">Master Architect</p>
                  <h3 className="text-2xl md:text-3xl font-cinzel font-bold">@Kushagra-Tiwari</h3>
                  <p className="text-xs font-classic italic text-pink-100/30 pt-4">Curating the geometry of affection.</p>
                </div>
                <a
                  href="https://instagram.com/airuslukai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-morphism p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-white/10 space-y-4 hover:border-pink-500/50 transition-all hover:scale-105 shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />
                  <Instagram className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-200/50">The Muse's Channel</p>
                  <h3 className="text-2xl md:text-3xl font-cinzel font-bold">@airuslukai</h3>
                  <p className="text-xs font-classic italic text-pink-100/30 pt-4">Where beauty meets its digital echo.</p>
                </a>
              </div>

              <div className="pt-20 opacity-20">
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[1em]">Built in the Heavens • For the Miracle</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;