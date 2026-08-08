import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Volume2, VolumeX } from 'lucide-react';

export interface FunMascotProps {
  onNavigate?: (screen: any) => void;
}

type Expression = 'happy' | 'excited' | 'love' | 'cool' | 'wink' | 'shocked';

const TIPS_AND_QUOTES = [
  "Boop! 🤖 Need a 213x213 px photo? I'm ready!",
  "100% Private! Your files stay safe in your browser 🔒",
  "Tee-hee! That tickles! 😜",
  "Pro Tip: NSDL & UTI require PDFs under 300 KB!",
  "I compress photos & PDFs at lightning speed! ⚡",
  "Signatures must be 200x600 px and under 50 KB!",
  "High five! ✋ PAN card documents formatted easily!",
  "You can capture live camera snapshots directly! 📸"
];

export const FunMascot: React.FC<FunMascotProps> = () => {
  const [expression, setExpression] = useState<Expression>('happy');
  const [speech, setSpeech] = useState<string>("Hi! I'm Panny, your PAN helper bot! Click me! ✨");
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  
  // Eye tracking offset
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / 80;
      const deltaY = (e.clientY - centerY) / 80;
      
      const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
      setMousePos({
        x: clamp(deltaX, -4, 4),
        y: clamp(deltaY, -4, 4)
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const playSound = (type: 'boop' | 'excited' | 'love') => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'boop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(940, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'excited') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.08);
        osc.frequency.setValueAtTime(800, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'love') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio fallback
    }
  };

  const addParticle = (text: string) => {
    const newId = Date.now() + Math.random();
    const x = (Math.random() - 0.5) * 40;
    const y = -20 - Math.random() * 25;
    setFloatingParticles(prev => [...prev, { id: newId, text, x, y }]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== newId));
    }, 1000);
  };

  const handlePoke = () => {
    const nextExpression: Expression[] = ['happy', 'excited', 'wink', 'cool', 'love', 'shocked'];
    const randomExp = nextExpression[Math.floor(Math.random() * nextExpression.length)];
    setExpression(randomExp);

    if (randomExp === 'love') {
      playSound('love');
      addParticle('💖');
      addParticle('✨');
    } else if (randomExp === 'excited' || randomExp === 'wink') {
      playSound('excited');
      addParticle('⚡');
      addParticle('✨');
    } else {
      playSound('boop');
      addParticle('🤖');
      addParticle('+10 Joy');
    }

    const randomTip = TIPS_AND_QUOTES[Math.floor(Math.random() * TIPS_AND_QUOTES.length)];
    setSpeech(randomTip);
    setShowSpeech(true);
  };

  return (
    <div 
      ref={mascotRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none select-none font-sans"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        
        {/* Floating Speech Bubble */}
        <AnimatePresence>
          {showSpeech && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              className="relative bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#E5C38B]/40 text-[#F5F5F5] px-3.5 py-2.5 rounded-2xl shadow-2xl text-[11px] leading-snug max-w-[210px] space-y-1"
            >
              <div className="flex items-center justify-between gap-1 text-[9px] font-mono text-[#E5C38B]">
                <span className="flex items-center gap-1 font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-[#E5C38B]" /> Panny Bot
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                    className="text-white/40 hover:text-white p-0.5 cursor-pointer"
                    title={isSoundEnabled ? "Mute sound" : "Enable sound"}
                  >
                    {isSoundEnabled ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5 text-white/30" />}
                  </button>
                  <button
                    onClick={() => setShowSpeech(false)}
                    className="text-white/40 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              <p className="font-light text-white/90">
                {speech}
              </p>

              {/* Arrow down to round orb */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0A0A0A] border-r border-b border-[#E5C38B]/40 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Particles */}
        <div className="relative w-full h-0 pointer-events-none">
          {floatingParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, x: p.x, scale: 0.8 }}
              animate={{ opacity: 0, y: p.y - 30, scale: 1.1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute right-6 bottom-8 font-mono text-[10px] font-bold text-[#E5C38B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {p.text}
            </motion.div>
          ))}
        </div>

        {/* Sleek Round Floating Bot Orb */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handlePoke}
          className="relative cursor-pointer group"
          title="Click Panny for tips & fun expressions!"
        >
          {/* Subtle Outer Glow Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#E5C38B] to-amber-200 blur-sm opacity-40 group-hover:opacity-80 transition-opacity" />

          {/* Round Spherical Bot Head */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0A0A0A] border-2 border-[#E5C38B] shadow-xl shadow-black/80 flex flex-col items-center justify-center p-2 overflow-hidden backdrop-blur-xl"
          >
            {/* Top Antenna Light */}
            <div className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#E5C38B] shadow-[0_0_8px_#E5C38B] animate-pulse" />

            {/* Inner Face Screen */}
            <div className="w-full h-full rounded-full bg-black/90 border border-white/10 flex flex-col items-center justify-center pt-1.5 relative">
              
              {/* Eyes Expression Rendering */}
              <div className="flex items-center justify-center gap-1.5">
                {expression === 'cool' ? (
                  <span className="text-xs">🕶️</span>
                ) : expression === 'love' ? (
                  <div className="flex gap-1 text-pink-400 text-xs">
                    <span className="animate-bounce">❤️</span>
                    <span className="animate-bounce">❤️</span>
                  </div>
                ) : expression === 'wink' ? (
                  <div className="flex items-center gap-1.5 text-[#E5C38B] text-xs font-bold font-mono">
                    <span>^</span>
                    <span>-</span>
                  </div>
                ) : (
                  /* Dynamic Pupil Eyes */
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E5C38B]/20 border border-[#E5C38B] flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ x: mousePos.x, y: mousePos.y }}
                        className="w-1.5 h-1.5 rounded-full bg-[#E5C38B] shadow-[0_0_4px_#E5C38B]"
                      />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#E5C38B]/20 border border-[#E5C38B] flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ x: mousePos.x, y: mousePos.y }}
                        className="w-1.5 h-1.5 rounded-full bg-[#E5C38B] shadow-[0_0_4px_#E5C38B]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mouth Expression */}
              <div className="pt-0.5">
                {expression === 'excited' || expression === 'shocked' ? (
                  <div className="w-2 h-2 rounded-full bg-[#E5C38B] animate-ping" />
                ) : expression === 'love' ? (
                  <div className="w-2.5 h-0.5 bg-pink-400 rounded-full" />
                ) : (
                  <div className="w-2.5 h-0.5 border-b-2 border-[#E5C38B] rounded-full" />
                )}
              </div>

            </div>

          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};
