import React from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { Lock, ShieldCheck, EyeOff } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (screen: Screen) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-16 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] mb-3">
            <Lock className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>100% Client-Side Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
            Privacy <span className="italic text-[#E5C38B]">Policy</span>
          </h1>
          <p className="text-white/40 text-xs mt-1 font-mono">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <AdBanner type="leaderboard" className="mt-4" />
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 text-xs text-white/70 leading-relaxed font-sans">
          
          <div className="p-4 rounded-xl bg-[#E5C38B]/10 border border-[#E5C38B]/30 text-[#E5C38B] space-y-2">
            <div className="font-serif flex items-center gap-2 text-base text-[#F5F5F5]">
              <EyeOff className="w-4 h-4 text-[#E5C38B]" />
              <span>Zero-Data Retention Guarantee</span>
            </div>
            <p className="text-xs text-white/70 font-light">
              PN Compressor is architected as a pure client-side web application. We do not operate server storage for uploaded identity files. All image manipulations, crop algorithms, and PDF merges execute entirely within your web browser&apos;s isolated runtime environment.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">1. Information Collection &amp; Non-Storage</h2>
            <p className="font-light">
              We do not collect, request, log, or store personal identity information (such as Aadhaar details, PAN numbers, full names, photos, or specimen signatures). Your files are loaded into browser memory (`HTMLCanvasElement`) and discarded as soon as you close or reload the page tab.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">2. Cookies &amp; Local Tracking</h2>
            <p className="font-light">
              We do not use tracking cookies, persistent identifiers, or cross-site analytics scripts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">3. Camera Access</h2>
            <p className="font-light">
              When using the Camera Capture tool, web browser permissions (`getUserMedia`) are requested solely to render a live camera stream on screen for snapshot creation. No video feed or camera frames are recorded, saved, or uploaded anywhere.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">4. Third-Party Services</h2>
            <p className="font-light">
              This application operates independently and does not pass user inputs to external AI services or cloud file storage APIs.
            </p>
          </section>

        </div>

        {/* Bottom Page Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
