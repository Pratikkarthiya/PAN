import React from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  Sparkles, Lock, ShieldCheck, Cpu, ArrowRight, CheckCircle2 
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (screen: Screen) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-16 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Mission &amp; Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
            About <span className="italic text-[#E5C38B]">PN Compressor</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed font-light">
            Built to provide 100% private, browser-based document preparation for millions of PAN card applicants.
          </p>

          <AdBanner type="leaderboard" className="pt-2" />
        </div>

        {/* Mission Statement Box */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-serif text-[#F5F5F5]">
            Why We Built PN Compressor
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-light">
            Every year, millions of citizens, students, and businesses in India apply for or update their Permanent Account Number (PAN) via NSDL or UTIITSL portals. A common pain point is the strict automated image upload validation: passport photos must be exactly 213x213 pixels (&lt;50KB), signatures must be clear (&lt;50KB), and proof PDFs must stay strictly under 300KB.
          </p>
          <p className="text-sm text-white/70 leading-relaxed font-light">
            Traditional online image converters upload sensitive identity documents (Aadhaar cards, photos, signatures) to third-party cloud servers. We created PN Compressor to run 100% locally inside the user&apos;s browser using modern HTML5 Canvas &amp; WebAssembly, ensuring complete data privacy and instant processing.
          </p>
        </div>

        {/* Core Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5C38B]/10 border border-[#E5C38B]/30 flex items-center justify-center text-[#E5C38B]">
              <Lock className="w-5 h-5 text-[#E5C38B]" />
            </div>
            <h3 className="font-serif text-[#F5F5F5] text-lg">
              Zero Server Transmission
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Your files never leave your device. All calculations occur inside client-side browser memory.
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5C38B]/10 border border-[#E5C38B]/30 flex items-center justify-center text-[#E5C38B]">
              <Cpu className="w-5 h-5 text-[#E5C38B]" />
            </div>
            <h3 className="font-serif text-[#F5F5F5] text-lg">
              Byte-Exact Compression
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Binary search algorithms dynamically tune JPEG stream quality to hit exact KB limits.
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E5C38B]/10 border border-[#E5C38B]/30 flex items-center justify-center text-[#E5C38B]">
              <ShieldCheck className="w-5 h-5 text-[#E5C38B]" />
            </div>
            <h3 className="font-serif text-[#F5F5F5] text-lg">
              Government Compliance
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Pre-configured presets matching NSDL and UTIITSL official specifications.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('start-compressing')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-black font-semibold text-xs uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
          >
            <span>Start Compressing Documents</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Bottom Page Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
