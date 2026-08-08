import React from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { ShieldCheck, FileText } from 'lucide-react';

interface TermsOfServicePageProps {
  onNavigate: (screen: Screen) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-16 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] mb-3">
            <FileText className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
            Terms of <span className="italic text-[#E5C38B]">Service</span>
          </h1>
          <p className="text-white/40 text-xs mt-1 font-mono">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <AdBanner type="leaderboard" className="mt-4" />
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 text-xs text-white/70 leading-relaxed font-sans">
          
          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">1. Acceptance of Terms</h2>
            <p className="font-light">
              By accessing and using PN Compressor (&ldquo;the Application&rdquo;), you agree to be bound by these Terms of Service. The Application is provided as a client-side utility for document resizing, cropping, and compression.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">2. Client-Side Processing &amp; User Responsibility</h2>
            <p className="font-light">
              PN Compressor performs all document processing strictly on your local browser device. We do not store, view, or retain any uploaded photos, signatures, or proof documents. You retain full ownership and responsibility for all content processed using the Application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">3. Portal Compliance &amp; Disclaimer</h2>
            <p className="font-light">
              While PN Compressor is designed to align with NSDL and UTIITSL official image dimensions and file size limits, final acceptance of any document rests solely with the respective government portals or processing authorities. We provide no guarantee against portal rejection due to unreadable source scans, incorrect identity details, or portal server changes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">4. Prohibited Uses</h2>
            <p className="font-light">
              You agree not to use the Application to create fraudulent identity documents, forge signatures, or engage in any unlawful activity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-serif text-[#F5F5F5]">5. Limitation of Liability</h2>
            <p className="font-light">
              In no event shall PN Compressor or its developers be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Application.
            </p>
          </section>

        </div>

        {/* Bottom Page Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
