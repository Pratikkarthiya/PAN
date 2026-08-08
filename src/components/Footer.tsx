import React from 'react';
import { Screen } from '../types';
import { Sparkles, ShieldCheck, Cpu, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 text-white/50 py-12 px-6 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E5C38B] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#E5C38B]/10">
              <div className="w-3.5 h-3.5 bg-[#050505] rounded-sm rotate-45"></div>
            </div>
            <span className="text-lg font-semibold font-serif text-[#F5F5F5] uppercase tracking-wider">
              KP CYBER
            </span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Luxury-grade compression tools for NSDL &amp; UTIITSL PAN card applications. Optimize your media with 100% client-side privacy.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[10px] uppercase tracking-widest text-[#E5C38B] bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full w-fit">
            <Lock className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Zero Server Uploads</span>
          </div>
        </div>

        {/* Compression Tools Column */}
        <div>
          <h4 className="text-xs font-semibold text-[#E5C38B] uppercase tracking-[0.2em] mb-4 font-serif">
            Compression Suite
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60">
            <li>
              <button 
                id="footer-nav-photo"
                onClick={() => onNavigate('photo-tool')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                Photo Tool (213x213 px)
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-signature"
                onClick={() => onNavigate('signature-tool')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                Signature Tool (Auto Ink)
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-pdf"
                onClick={() => onNavigate('pdf-tool')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                PDF Tool (&lt;300KB Limit)
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-camera"
                onClick={() => onNavigate('camera')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                Live Camera Capture
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-start"
                onClick={() => onNavigate('start-compressing')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left font-semibold text-[#E5C38B]"
              >
                Start Compressing (Hub)
              </button>
            </li>
          </ul>
        </div>

        {/* Guidelines & Support */}
        <div>
          <h4 className="text-xs font-semibold text-[#E5C38B] uppercase tracking-[0.2em] mb-4 font-serif">
            Specs &amp; FAQs
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60">
            <li>
              <button 
                id="footer-nav-guidelines"
                onClick={() => onNavigate('guidelines')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                PAN Specifications Guidelines
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-faq"
                onClick={() => onNavigate('faq')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                FAQ &amp; Help Center
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-about"
                onClick={() => onNavigate('about')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-contact"
                onClick={() => onNavigate('contact')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Security */}
        <div>
          <h4 className="text-xs font-semibold text-[#E5C38B] uppercase tracking-[0.2em] mb-4 font-serif">
            Privacy &amp; Terms
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60">
            <li>
              <button 
                id="footer-nav-privacy"
                onClick={() => onNavigate('privacy')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                id="footer-nav-terms"
                onClick={() => onNavigate('terms')}
                className="hover:text-[#E5C38B] transition-colors cursor-pointer text-left"
              >
                Terms of Service
              </button>
            </li>
          </ul>

          <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 text-[11px] text-white/50 space-y-1">
            <div className="flex items-center gap-1.5 text-[#E5C38B] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline Processing</span>
            </div>
            <p>Your photos &amp; documents never leave your browser. Processing executes in-memory.</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-[10px] uppercase tracking-widest text-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} KP CYBER STUDIO. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-2 text-white/40">
          <Cpu className="w-3.5 h-3.5 text-[#E5C38B]" />
          <span>CLIENT-SIDE ENGINE</span>
        </div>
      </div>
    </footer>
  );
};
