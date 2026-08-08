import React from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  ShieldCheck, Check, X, ArrowRight, Zap, FileImage, PenTool, FileText 
} from 'lucide-react';

interface GuidelinesPageProps {
  onNavigate: (screen: Screen) => void;
}

export const GuidelinesPage: React.FC<GuidelinesPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Official PAN Specifications</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
            PAN Card Upload <span className="italic text-[#E5C38B]">Guidelines &amp; Specs</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed font-light">
            Comprehensive reference guide for NSDL &amp; UTIITSL portal compliance to prevent rejection during online PAN card registration.
          </p>
        </div>

        {/* Technical Specs Comparison Table */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-serif text-[#F5F5F5]">
              Technical File Requirement Summary
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-[#E5C38B] border-b border-white/10">
                <tr>
                  <th className="p-4 uppercase tracking-wider">Document Type</th>
                  <th className="p-4 uppercase tracking-wider">Dimensions</th>
                  <th className="p-4 uppercase tracking-wider">DPI Resolution</th>
                  <th className="p-4 uppercase tracking-wider">Allowed File Size</th>
                  <th className="p-4 uppercase tracking-wider">Format</th>
                  <th className="p-4 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/70">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#F5F5F5] flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-[#E5C38B]" />
                    Passport Photo
                  </td>
                  <td className="p-4">213 x 213 pixels (3.5 x 2.5 cm)</td>
                  <td className="p-4">200 DPI</td>
                  <td className="p-4 font-bold text-[#E5C38B]">&lt; 50 KB (10 - 50 KB)</td>
                  <td className="p-4">JPEG / JPG</td>
                  <td className="p-4">
                    <button
                      onClick={() => onNavigate('photo-tool')}
                      className="text-[#E5C38B] hover:underline flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Compress Photo <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#F5F5F5] flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-[#E5C38B]" />
                    Specimen Signature
                  </td>
                  <td className="p-4">200 x 600 pixels (4.5 x 2.0 cm)</td>
                  <td className="p-4">200 DPI</td>
                  <td className="p-4 font-bold text-[#E5C38B]">&lt; 50 KB (10 - 50 KB)</td>
                  <td className="p-4">JPEG / JPG / PNG</td>
                  <td className="p-4">
                    <button
                      onClick={() => onNavigate('signature-tool')}
                      className="text-[#E5C38B] hover:underline flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Process Signature <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#F5F5F5] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E5C38B]" />
                    Proof Document PDF
                  </td>
                  <td className="p-4">Standard A4 Page Size</td>
                  <td className="p-4">150 - 200 DPI</td>
                  <td className="p-4 font-bold text-[#E5C38B]">&lt; 300 KB</td>
                  <td className="p-4">PDF (Single file)</td>
                  <td className="p-4">
                    <button
                      onClick={() => onNavigate('pdf-tool')}
                      className="text-[#E5C38B] hover:underline flex items-center gap-1 cursor-pointer hover:text-white"
                    >
                      Merge PDF <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Midway Guidelines Ad Banner */}
        <AdBanner type="leaderboard" className="my-6" />

        {/* Visual Do's & Don'ts Examples */}
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F5F5] text-center">
            Visual Do&apos;s and Don&apos;ts for Photo &amp; Signature
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Valid Passport Photo Example */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-serif text-lg">
                <Check className="w-5 h-5 bg-emerald-500/20 rounded-full p-0.5" />
                <span>ACCEPTABLE PASSPORT PHOTO</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Clear front-facing passport photo, white or light gray background, neutral expression, and cropped to 213x213 px (&lt;50KB).
              </p>
              <ul className="space-y-1.5 text-xs text-white/50 font-mono">
                <li>• Uniform lighting across face</li>
                <li>• Both ears clearly visible</li>
                <li>• File size strictly under 50KB</li>
              </ul>
            </div>

            {/* Invalid Passport Photo Example */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-serif text-lg">
                <X className="w-5 h-5 bg-red-500/20 rounded-full p-0.5" />
                <span>REJECTED PASSPORT PHOTO</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Selfies, dark shadowy backgrounds, wearing sunglasses/hats, skewed aspect ratios, or file sizes exceeding 50KB.
              </p>
              <ul className="space-y-1.5 text-xs text-white/50 font-mono">
                <li>• Stretched image width/height</li>
                <li>• Blur or pixelated compression</li>
                <li>• File size &gt; 50KB</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Step-by-Step Submission Checklist */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-serif text-[#F5F5F5] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#E5C38B]" />
            <span>Pre-Upload Checklist for NSDL / UTI Portal</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-[#E5C38B] font-bold">Step 1</span>
              <p className="text-white/70">Run Photo Tool to generate 213x213 px photo under 50KB.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-[#E5C38B] font-bold">Step 2</span>
              <p className="text-white/70">Run Signature Tool to auto-clean ink contrast under 50KB.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-[#E5C38B] font-bold">Step 3</span>
              <p className="text-white/70">Run PDF Tool to combine Aadhaar &amp; Form 49A under 300KB.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-[#E5C38B] font-bold">Step 4</span>
              <p className="text-white/70">Upload generated files directly on NSDL / UTIITSL portal.</p>
            </div>
          </div>
        </div>

        {/* Bottom Page Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
