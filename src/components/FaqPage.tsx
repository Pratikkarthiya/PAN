import React, { useState } from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  HelpCircle, ChevronDown, Lock, ShieldCheck, 
  Search, Sparkles, FileImage, PenTool, FileText 
} from 'lucide-react';

interface FaqPageProps {
  onNavigate: (screen: Screen) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "Is my personal document data safe? Are my photos uploaded to any server?",
      answer: "No, 100% of the image processing, canvas cropping, ink thresholding, and PDF compilation occurs strictly inside your web browser's local memory using HTML5 Canvas & WebAssembly APIs. Your photos, signatures, and Aadhaar documents are NEVER transmitted to any external server or backend database."
    },
    {
      question: "Why does the NSDL / UTIITSL portal reject my passport photo or signature?",
      answer: "The government portals enforce strict automated validation checks. Common rejection reasons include: file size exceeding 50 KB (even 50.1 KB will be rejected), dimensions not matching exact 213x213 pixels for photos or 200x600 pixels for signatures, or blurry ink with yellow paper background shadows. KP CYBER guarantees exact byte-level compliance."
    },
    {
      question: "How does the Signature Auto-Enhancer tool work?",
      answer: "When you upload a signature photo taken on paper with a smartphone, paper tint and ambient shadows often create dark background artifacts. Our Signature Tool uses a smart contrast thresholding algorithm that isolates blue or black pen ink lines and transforms paper grain into stark white, ensuring clean black ink on white background."
    },
    {
      question: "How do I compress multiple document pages into a PDF under 300 KB?",
      answer: "Use our PDF Tool. You can select your Aadhaar card scan, PAN Form 49A pages, and address proof. The tool automatically scales the document resolution and applies JPEG stream compression to fit the entire merged PDF strictly under the 300 KB limit required by NSDL."
    },
    {
      question: "Can I take photos directly using my mobile camera?",
      answer: "Yes! Use our 'WebRTC Camera Capture' tool. It activates your phone or webcam with interactive overlay guides (passport oval for photos and rectangular framing for signatures), allowing you to capture high-clarity photos that are immediately sent to the compression engines."
    },
    {
      question: "Is KP CYBER completely free to use?",
      answer: "Yes, KP CYBER is 100% free with no registration, no login requirements, no ads, and no watermarks."
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-16 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>FAQ &amp; Troubleshooting</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
            Frequently Asked <span className="italic text-[#E5C38B]">Questions</span>
          </h1>

          <p className="text-white/50 text-sm max-w-xl mx-auto font-light">
            Everything you need to know about browser-based PAN document compression &amp; privacy protection.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-white/40 absolute left-4 top-3.5" />
            <input
              id="faq-search-input"
              type="text"
              placeholder="Search questions (e.g., privacy, PDF 300KB, 50KB photo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] placeholder-white/30 font-mono"
            />
          </div>

          <AdBanner type="leaderboard" className="pt-4" />
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-serif text-lg text-[#F5F5F5] leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#E5C38B] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-white/70 leading-relaxed font-sans border-t border-white/10 pt-4 bg-black/20">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Client-Side Offline Guarantee Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-[#F5F5F5] font-serif text-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#E5C38B]" />
              <span>Need help with document specifications?</span>
            </div>
            <p className="text-white/50 text-xs font-light">
              Check out our complete specification guidelines or launch our tool suite directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('guidelines')}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white/80 border border-white/20 hover:border-[#E5C38B] hover:text-white text-xs font-semibold cursor-pointer transition-all"
            >
              View Guidelines
            </button>
            <button
              onClick={() => onNavigate('start-compressing')}
              className="px-5 py-2.5 rounded-full bg-[#E5C38B] text-black text-xs font-semibold uppercase tracking-wider hover:bg-white cursor-pointer transition-all shadow-lg shadow-[#E5C38B]/10"
            >
              Start Compressing
            </button>
          </div>
        </div>

        {/* Bottom Page Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
