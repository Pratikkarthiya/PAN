import React from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  FileImage, PenTool, FileText, Camera, Shield, 
  ArrowRight, Sparkles, CheckCircle2, Lock, QrCode, Smartphone 
} from 'lucide-react';

interface StartCompressingProps {
  onNavigate: (screen: Screen) => void;
}

export const StartCompressing: React.FC<StartCompressingProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-16 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Select Your Utility</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#F5F5F5]">
            Start Compressing <span className="italic text-[#E5C38B]">PAN Documents</span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed font-light">
            Choose the dedicated compression engine tailored for your official NSDL or UTIITSL PAN card upload requirements.
          </p>
          <AdBanner type="leaderboard" className="pt-2" />
        </div>

        {/* Tools Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Photo Tool Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <FileImage className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  Passport Photo
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#E5C38B]/10 text-[#E5C38B] px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Max 50 KB
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Crop to 213x213 pixels, set 200 DPI resolution, adjust light/contrast, and compress under 50KB.
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>213 x 213 Pixel Crop Box</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>200 DPI Resolution Scaling</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-photo"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('photo-tool');
                }}
                href="#photo-tool"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <span>Launch Photo Tool</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Signature Tool Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  Specimen Signature
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#E5C38B]/10 text-[#E5C38B] px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Max 50 KB
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Remove yellow paper grain background, auto-boost blue/black pen ink, and resize to 200x600 px (&lt;50KB).
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>200 x 600 Pixel Dimensions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Auto B&amp;W Thresholding</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-signature"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('signature-tool');
                }}
                href="#signature-tool"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <span>Launch Signature Tool</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* PDF Tool Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  PDF Documents
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#E5C38B]/10 text-[#E5C38B] px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Max 300 KB
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Merge Aadhaar card scans, PAN Form 49A, and proof documents into a single PDF under 300KB limit.
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Multi-Page Merging &amp; Reordering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>DPI Optimization (&lt;300 KB)</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-pdf"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('pdf-tool');
                }}
                href="#pdf-tool"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <span>Launch PDF Tool</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Aadhaar Two-Sided Upload Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  Aadhaar Front + Back
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#E5C38B]/10 text-[#E5C38B] px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Single PDF Page
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Upload both Aadhaar sides and convert them into one merged PDF page for PAN or document upload.
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Upload front + back together</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Merge into one PDF page</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-aadhaar"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('aadhaar-upload');
                }}
                href="#aadhaar-upload"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <span>Launch Aadhaar Upload</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Camera Capture Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  Camera Capture
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#E5C38B]/10 text-[#E5C38B] px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Live Stream
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Capture live photos and signatures using phone or web camera with interactive framing overlays.
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Real-time Framing Overlays</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Direct Export to Tools</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-camera"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('camera');
                }}
                href="#camera"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <span>Launch Live Camera</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Direct Mobile QR Transfer Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group border-l-2 border-l-[#E5C38B]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E5C38B]/10 border border-[#E5C38B]/30 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  Mobile QR Transfer
                </h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                  P2P WebRTC
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Scan QR code with smartphone camera to wirelessly transfer photos, signatures, or PDFs directly to desktop.
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Instant Mobile Camera &amp; Storage Transfer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Zero Server Storage (100% Client Memory)</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-qr-transfer"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('qr-transfer');
                }}
                href="#qr-transfer"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <span>Open Mobile QR Transfer</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Guidelines Reference Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:bg-white/[0.08] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#E5C38B] group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-[#E5C38B]" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#F5F5F5]">
                  Guidelines &amp; Specs
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#E5C38B]/10 text-[#E5C38B] px-2.5 py-1 rounded-full border border-[#E5C38B]/30">
                  Reference
                </span>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Review complete NSDL and UTIITSL official document upload rules, Do&apos;s and Don&apos;ts, and submission checklist.
              </p>

              <ul className="space-y-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Visual Valid vs Invalid Examples</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C38B] shrink-0" />
                  <span>Technical Dimension Breakdown</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                id="start-link-guidelines"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('guidelines');
                }}
                href="#guidelines"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-full text-xs font-semibold text-white/80 uppercase tracking-[0.15em] border border-white/20 hover:border-[#E5C38B] hover:text-white transition-all cursor-pointer"
              >
                <span>Read Guidelines</span>
                <ArrowRight className="w-4 h-4 text-[#E5C38B]" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Hub Ad Space */}
        <AdBanner type="leaderboard" className="pt-4" />

        {/* Client-side Privacy Notice */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#E5C38B] shrink-0" />
            <span>All operations run locally inside your browser memory. Your sensitive identity files are never transmitted to any external server.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
