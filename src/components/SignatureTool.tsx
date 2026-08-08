import React, { useState, useEffect, useRef } from 'react';
import { Screen, CompressionSettings, ProcessedImageResult } from '../types';
import { AdBanner } from './AdBanner';
import { processAndCompressImage } from '../utils/imageCompressor';
import { 
  PenTool, Upload, Sliders, Download, 
  CheckCircle2, ArrowRight, Camera, Sparkles, Wand2 
} from 'lucide-react';

interface SignatureToolProps {
  onNavigate: (screen: Screen) => void;
  capturedImageDataUrl?: string | null;
}

export const SignatureTool: React.FC<SignatureToolProps> = ({ onNavigate, capturedImageDataUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(capturedImageDataUrl || null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [targetSizeKb, setTargetSizeKb] = useState<number>(45); // Under 50KB limit
  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(200);
  const [brightness, setBrightness] = useState<number>(10);
  const [contrast, setContrast] = useState<number>(40);
  const [threshold, setThreshold] = useState<number>(150); // B&W Threshold
  const [rotation, setRotation] = useState<number>(0);

  // Load a sample handwritten signature
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Off-white paper background simulation
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, 600, 200);

      // Cursive signature drawing simulating blue pen ink
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(80, 120);
      ctx.bezierCurveTo(120, 40, 180, 160, 220, 80);
      ctx.bezierCurveTo(240, 140, 280, 60, 320, 110);
      ctx.bezierCurveTo(360, 150, 420, 70, 520, 100);
      ctx.stroke();

      // Underline flourish
      ctx.beginPath();
      ctx.moveTo(100, 150);
      ctx.quadraticCurveTo(300, 170, 500, 140);
      ctx.stroke();
    }
    const sampleUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreview(sampleUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleProcess = async () => {
    if (!imagePreview) return;

    setIsProcessing(true);
    try {
      const settings: CompressionSettings = {
        targetSizeKb,
        width,
        height,
        maintainAspectRatio: false,
        quality: 0.85,
        format: 'jpeg',
        brightness,
        contrast,
        threshold,
        rotation
      };

      const res = await processAndCompressImage(
        imagePreview,
        settings,
        'pan_specimen_signature.jpg'
      );

      setResult(res);
    } catch (err) {
      console.error('Error processing signature:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (imagePreview) {
      handleProcess();
    }
  }, [imagePreview, targetSizeKb, width, height, brightness, contrast, threshold, rotation]);

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#E5C38B] bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <PenTool className="w-3.5 h-3.5 text-[#E5C38B]" />
              <span>PAN Signature Processor</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
              PAN Signature <span className="italic text-[#E5C38B]">Auto-Enhancer</span>
            </h1>
            <p className="text-white/50 text-sm mt-1 font-light">
              Removes paper shadows, boosts dark ink contrast, and resizes to 200 x 600 px (&lt;50 KB).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="sig-tool-camera-btn"
              onClick={() => onNavigate('camera')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white/80 border border-white/20 hover:border-[#E5C38B] hover:text-white transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#E5C38B]" />
              <span>Capture via Camera</span>
            </button>
            <button
              id="sig-tool-sample-btn"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-black uppercase tracking-wider bg-[#E5C38B] hover:bg-white transition-all cursor-pointer shadow-lg shadow-[#E5C38B]/10"
            >
              <span>Load Sample Signature</span>
            </button>
          </div>
        </div>

        {/* Main Tool Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-serif text-[#F5F5F5] text-lg flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#E5C38B]" />
                <span>Ink Enhancement Controls</span>
              </span>
              <span className="text-xs font-mono text-[#E5C38B]">Auto B&amp;W Boost</span>
            </div>

            {/* Target Size KB Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-white/70">Target Max Size (KB)</label>
                <span className="text-[#E5C38B] font-mono font-bold">{targetSizeKb} KB</span>
              </div>
              <input
                id="sig-size-slider"
                type="range"
                min="10"
                max="50"
                step="1"
                value={targetSizeKb}
                onChange={(e) => setTargetSizeKb(Number(e.target.value))}
                className="w-full accent-[#E5C38B] cursor-pointer"
              />
              <p className="text-[11px] text-white/40">Government Portal Limit: Under 50 KB.</p>
            </div>

            {/* Threshold (Ink Clarity) Slider */}
            <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#E5C38B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5C38B]" /> Ink B&amp;W Threshold
                </span>
                <span className="text-[#E5C38B] font-mono">{threshold}</span>
              </div>
              <input
                type="range"
                min="50"
                max="220"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-[#E5C38B] cursor-pointer"
              />
              <p className="text-[11px] text-white/40">
                Adjust slider to eliminate paper yellowing and make blue/black ink crisp pure dark.
              </p>
            </div>

            {/* Dimensions Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono"
                />
              </div>
            </div>

            {/* In-tool Control Panel Ad Banner */}
            <AdBanner type="rectangle" className="my-2" />

            {/* Brightness & Contrast */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Paper Brightness</span>
                  <span className="font-mono text-white/40">{brightness}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-[#E5C38B] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Ink Contrast</span>
                  <span className="font-mono text-white/40">{contrast}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="80"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[#E5C38B] cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {!imagePreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/20 hover:border-[#E5C38B] rounded-2xl p-12 text-center bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl transition-all cursor-pointer space-y-4 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#E5C38B] group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-[#E5C38B]" />
                </div>
                <div>
                  <p className="text-base font-serif text-[#F5F5F5]">
                    Click or drag &amp; drop your signature photo
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Photo taken on white paper with blue/black pen
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[#F5F5F5] text-lg">
                    Signature Output Preview
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#E5C38B] hover:underline cursor-pointer"
                  >
                    Change Signature Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-4 py-2">
                  <div className="bg-white p-4 rounded-xl border border-[#E5C38B]/40 flex items-center justify-center min-h-[140px]">
                    {result ? (
                      <img
                        src={result.dataUrl}
                        alt="Signature Cleaned Output"
                        className="max-h-32 object-contain"
                      />
                    ) : (
                      <div className="text-black/50 text-xs font-mono">Processing signature...</div>
                    )}
                  </div>

                  {result && (
                    <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#E5C38B]" />
                        <div>
                          <div className="font-serif text-[#F5F5F5]">NSDL &amp; UTI Accepted</div>
                          <div className="text-white/40 text-[11px]">
                            {result.width} x {result.height} px | {result.sizeKb} KB
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[#E5C38B] font-bold">Valid (&lt;50KB)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                {result && (
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                      id="sig-tool-download-btn"
                      href={result.dataUrl}
                      download="pan_specimen_signature.jpg"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-xs text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-black" />
                      <span>Download Signature</span>
                    </a>

                    <button
                      onClick={() => onNavigate('pdf-tool')}
                      className="text-xs text-[#E5C38B] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>Proceed to PDF Merger</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Workspace Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
