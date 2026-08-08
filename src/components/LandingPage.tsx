import React from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  Zap, FileImage, PenTool, FileText, Camera, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, Lock, Eye, Download, QrCode 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (screen: Screen) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen font-sans selection:bg-[#E5C38B] selection:text-black">
      
      {/* Immersive Main Hero Area */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 px-6 sm:px-8 lg:px-12 border-b border-white/10">
        
        {/* Atmospheric Ambient Gold Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#B8860B]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Official NSDL &amp; UTIITSL Standards</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-serif font-light leading-[0.92] tracking-tight mb-8 text-[#F5F5F5]">
            Precision <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#E5C38B]">Redefined.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-white/50 font-light leading-relaxed mb-10">
            Luxury-grade compression tools for official PAN Card applications. Crop photo to exact 213x213 px (&lt;50KB), boost signature ink contrast (&lt;50KB), and merge supporting PDFs (&lt;300KB) with 100% client-side privacy.
          </p>

          {/* Hero Buttons & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
            <button
              id="hero-cta-start"
              onClick={() => onNavigate('start-compressing')}
              className="px-10 py-4 bg-[#E5C38B] text-black font-semibold text-xs uppercase tracking-[0.15em] rounded-full hover:bg-white transition-all shadow-xl shadow-[#E5C38B]/10 cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Start Compressing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-white/40 font-medium">
              <button 
                id="hero-cta-guidelines"
                onClick={() => onNavigate('guidelines')} 
                className="hover:text-white border-b border-white/20 pb-0.5 transition-colors cursor-pointer"
              >
                Guidelines
              </button>
              <button 
                id="hero-cta-faq"
                onClick={() => onNavigate('faq')} 
                className="hover:text-white border-b border-white/20 pb-0.5 transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-white/40 tracking-wider uppercase font-mono">
            <span className="flex items-center gap-2 text-[#E5C38B]">
              <Lock className="w-3.5 h-3.5" /> Zero Server Uploads
            </span>
            <span className="flex items-center gap-2 text-[#E5C38B]">
              <Eye className="w-3.5 h-3.5" /> Pure Browser Canvas
            </span>
            <span className="flex items-center gap-2 text-[#E5C38B]">
              <Download className="w-3.5 h-3.5" /> Instant Local Export
            </span>
          </div>

          {/* Header Ad Space */}
          <AdBanner type="leaderboard" className="mt-8" />

        </div>
      </section>

      {/* Glassmorphic Feature Grid Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-serif text-[#F5F5F5] font-light">
            Select Your <span className="italic text-[#E5C38B]">Compression Tool</span>
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-3 font-mono">
            Tailored specifically for Government of India portal upload rules
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          {/* Photo Tool Card */}
          <div 
            onClick={() => onNavigate('photo-tool')}
            className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 mb-5 flex items-center justify-center text-[#E5C38B] bg-white/[0.04] rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                <FileImage className="w-5 h-5 text-[#E5C38B]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#F5F5F5] group-hover:text-[#E5C38B] transition-colors">
                Photo Compressor
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Crop &amp; compress photo to exact 213x213 pixels, 200 DPI, and strictly under 50KB limit.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-widest text-[#E5C38B] font-medium">
              <span>Launch Photo Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Signature Tool Card */}
          <div 
            onClick={() => onNavigate('signature-tool')}
            className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 mb-5 flex items-center justify-center text-[#E5C38B] bg-white/[0.04] rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                <PenTool className="w-5 h-5 text-[#E5C38B]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#F5F5F5] group-hover:text-[#E5C38B] transition-colors">
                Signature Tool
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Auto-boost ink contrast, erase paper background yellow tint, and resize to 200x600 px (&lt;50KB).
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-widest text-[#E5C38B] font-medium">
              <span>Launch Signature Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* PDF Tool Card */}
          <div 
            onClick={() => onNavigate('pdf-tool')}
            className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 mb-5 flex items-center justify-center text-[#E5C38B] bg-white/[0.04] rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-[#E5C38B]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#F5F5F5] group-hover:text-[#E5C38B] transition-colors">
                PDF Utilities
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Merge Aadhaar, PAN form, and proof documents into a single PDF under 300KB limit.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-widest text-[#E5C38B] font-medium">
              <span>Launch PDF Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Camera Capture Card */}
          <div 
            onClick={() => onNavigate('camera')}
            className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 mb-5 flex items-center justify-center text-[#E5C38B] bg-white/[0.04] rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-[#E5C38B]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#F5F5F5] group-hover:text-[#E5C38B] transition-colors">
                Live Camera
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Snap photos &amp; signatures directly with interactive crop guides and live framing overlays.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-widest text-[#E5C38B] font-medium">
              <span>Launch Live Camera</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mobile QR Transfer Card */}
          <div 
            onClick={() => onNavigate('qr-transfer')}
            className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl border-2 border-[#E5C38B]/40 p-6 rounded-2xl hover:bg-[#E5C38B]/10 transition-all flex flex-col justify-between shadow-lg shadow-[#E5C38B]/5"
          >
            <div>
              <div className="w-10 h-10 mb-5 flex items-center justify-center text-black bg-[#E5C38B] rounded-xl border border-[#E5C38B] group-hover:scale-110 transition-transform shadow-md">
                <QrCode className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#F5F5F5] group-hover:text-[#E5C38B] transition-colors flex items-center gap-1.5">
                <span>Mobile QR Transfer</span>
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Scan QR code on your smartphone to instantly send photos, signatures, or PDFs via P2P.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-widest text-[#E5C38B] font-medium">
              <span>Launch QR Transfer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Middle Ad Banner */}
          <AdBanner type="leaderboard" className="mt-12" />

        </div>
      </section>

      {/* Official Specifications Compliance Section */}
      <section className="py-20 bg-black/50 border-y border-white/10 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-serif text-[#F5F5F5]">
              NSDL &amp; UTIITSL Official Specifications
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-3 font-mono">
              Engineered for 100% portal upload acceptance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Photo Spec Box */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-serif font-bold text-[#E5C38B] text-lg">Passport Photo</span>
                <span className="text-[10px] font-mono uppercase text-[#E5C38B] bg-[#E5C38B]/10 px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Max 50 KB
                </span>
              </div>
              <ul className="space-y-3 text-xs text-white/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Dimensions: 213 x 213 pixels (3.5 x 2.5 cm)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>DPI Resolution: 200 DPI</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Format: Color JPEG / JPG</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>File Size: Between 10KB to 50KB</span>
                </li>
              </ul>
            </div>

            {/* Signature Spec Box */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-serif font-bold text-[#E5C38B] text-lg">Specimen Signature</span>
                <span className="text-[10px] font-mono uppercase text-[#E5C38B] bg-[#E5C38B]/10 px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Max 50 KB
                </span>
              </div>
              <ul className="space-y-3 text-xs text-white/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Dimensions: 200 x 600 pixels (4.5 x 2.0 cm)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>DPI Resolution: 200 DPI</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Auto Ink Boost: High contrast dark ink on white</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>File Size: Between 10KB to 50KB</span>
                </li>
              </ul>
            </div>

            {/* Document Spec Box */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-serif font-bold text-[#E5C38B] text-lg">Proof Document PDF</span>
                <span className="text-[10px] font-mono uppercase text-[#E5C38B] bg-[#E5C38B]/10 px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Max 300 KB
                </span>
              </div>
              <ul className="space-y-3 text-xs text-white/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Includes Aadhaar, Address &amp; Birth Proofs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Single merged PDF document file</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Clear text legibility at optimized file size</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E5C38B] shrink-0" />
                  <span>Strict limit: &lt; 300 KB</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Browser Privacy & Performance Feature Highlights */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Guaranteed Browser Privacy &amp; Portal Precision</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-serif text-[#F5F5F5] font-light leading-relaxed">
            Format your official NSDL &amp; UTIITSL PAN documents with speed and accuracy.
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-12 text-xs text-white/40 font-mono uppercase tracking-widest pt-4">
          <div>
            <span className="block text-3xl font-bold text-[#E5C38B] font-serif mb-1">100%</span>
            <span>Offline Client Memory</span>
          </div>
          <div>
            <span className="block text-3xl font-bold text-[#E5C38B] font-serif mb-1">213x213</span>
            <span>Exact Photo Crop</span>
          </div>
          <div>
            <span className="block text-3xl font-bold text-[#E5C38B] font-serif mb-1">0 Sec</span>
            <span>Server Lag</span>
          </div>
        </div>
      </section>

    </div>
  );
};
