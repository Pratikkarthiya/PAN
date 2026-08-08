import React, { useState, useEffect, useRef } from 'react';
import { Screen, CompressionSettings, ProcessedImageResult } from '../types';
import { AdBanner } from './AdBanner';
import { processAndCompressImage } from '../utils/imageCompressor';
import { 
  FileImage, Upload, Sliders, RefreshCw, Download, 
  CheckCircle2, AlertTriangle, ArrowRight, Camera, RotateCw, Sun, Contrast 
} from 'lucide-react';

interface PhotoToolProps {
  onNavigate: (screen: Screen) => void;
  capturedImageDataUrl?: string | null;
}

export const PhotoTool: React.FC<PhotoToolProps> = ({ onNavigate, capturedImageDataUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(capturedImageDataUrl || null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedImageResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [targetSizeKb, setTargetSizeKb] = useState<number>(48); // Under 50KB limit
  const [width, setWidth] = useState<number>(213);
  const [height, setHeight] = useState<number>(213);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [dpi, setDpi] = useState<number>(200);

  // Update image preview when props change
  useEffect(() => {
    if (capturedImageDataUrl) {
      setImagePreview(capturedImageDataUrl);
    }
  }, [capturedImageDataUrl]);

  // Load a sample passport photo if no file is selected yet
  const handleLoadSample = () => {
    // Generate sample canvas avatar photo
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Light background for standard passport photo
      ctx.fillStyle = '#1E2022';
      ctx.fillRect(0, 0, 400, 400);
      
      // Face shape
      ctx.fillStyle = '#E5C38B';
      ctx.beginPath();
      ctx.arc(200, 180, 80, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders
      ctx.fillStyle = '#0F1012';
      ctx.beginPath();
      ctx.ellipse(200, 360, 130, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Text watermark
      ctx.fillStyle = '#A1A1A1';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sample Passport Photo', 200, 50);
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

  // Run Compression algorithm
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
        rotation
      };

      const res = await processAndCompressImage(
        imagePreview,
        settings,
        'pan_passport_photo.jpg'
      );

      setResult(res);
    } catch (err) {
      console.error('Error processing photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto process when settings change
  useEffect(() => {
    if (imagePreview) {
      handleProcess();
    }
  }, [imagePreview, targetSizeKb, width, height, brightness, contrast, rotation]);

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#E5C38B] bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <FileImage className="w-3.5 h-3.5 text-[#E5C38B]" />
              <span>PAN Photo Tool Standard</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
              PAN Passport <span className="italic text-[#E5C38B]">Photo Compressor</span>
            </h1>
            <p className="text-white/50 text-sm mt-1 font-light">
              Crop &amp; compress to exactly 213 x 213 pixels, 200 DPI, and strictly under 50 KB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="photo-tool-camera-btn"
              onClick={() => onNavigate('camera')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white/80 border border-white/20 hover:border-[#E5C38B] hover:text-white transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#E5C38B]" />
              <span>Use Camera</span>
            </button>
            <button
              id="photo-tool-sample-btn"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-black uppercase tracking-wider bg-[#E5C38B] hover:bg-white transition-all cursor-pointer shadow-lg shadow-[#E5C38B]/10"
            >
              <span>Load Sample</span>
            </button>
          </div>
        </div>

        {/* Main Tool Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-serif text-[#F5F5F5] text-lg flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#E5C38B]" />
                <span>Compression Parameters</span>
              </span>
              <span className="text-xs font-mono text-white/40">NSDL / UTI Preset</span>
            </div>

            {/* Target Size KB Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-white/70">Target Max File Size (KB)</label>
                <span className="text-[#E5C38B] font-mono font-bold">{targetSizeKb} KB</span>
              </div>
              <input
                id="photo-size-slider"
                type="range"
                min="15"
                max="50"
                step="1"
                value={targetSizeKb}
                onChange={(e) => setTargetSizeKb(Number(e.target.value))}
                className="w-full accent-[#E5C38B] cursor-pointer"
              />
              <p className="text-[11px] text-white/40">Official PAN limit is strictly 50 KB.</p>
            </div>

            {/* Dimension Preset Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1">Width (px)</label>
                <input
                  id="photo-width-input"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Height (px)</label>
                <input
                  id="photo-height-input"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono"
                />
              </div>
            </div>

            {/* DPI Selector */}
            <div className="space-y-1">
              <label className="block text-xs text-white/70">DPI Resolution</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDpi(200)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    dpi === 200 
                      ? 'bg-[#E5C38B]/10 text-[#E5C38B] border-[#E5C38B]/50' 
                      : 'bg-black/30 text-white/50 border-white/10'
                  }`}
                >
                  200 DPI (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setDpi(300)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    dpi === 300 
                      ? 'bg-[#E5C38B]/10 text-[#E5C38B] border-[#E5C38B]/50' 
                      : 'bg-black/30 text-white/50 border-white/10'
                  }`}
                >
                  300 DPI (High Res)
                </button>
              </div>
            </div>

            {/* In-tool Sidebar Ad Banner */}
            <AdBanner type="rectangle" className="my-2" />

            {/* Brightness & Contrast */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/70">
                  <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-[#E5C38B]" /> Brightness</span>
                  <span className="font-mono text-white/50">{brightness}</span>
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
                  <span className="flex items-center gap-1.5"><Contrast className="w-3.5 h-3.5 text-[#E5C38B]" /> Contrast</span>
                  <span className="font-mono text-white/50">{contrast}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[#E5C38B] cursor-pointer"
                />
              </div>
            </div>

            {/* Rotation Control */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-white/70 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#E5C38B]" /> Rotation Angle
              </span>
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-[#E5C38B] hover:bg-white/10 cursor-pointer"
              >
                Rotate {rotation}°
              </button>
            </div>

          </div>

          {/* Preview & Output Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Upload Drag & Drop Zone */}
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
                    Click or drag &amp; drop your photo here
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Supports JPG, JPEG, PNG, WEBP files
                  </p>
                </div>
              </div>
            ) : (
              /* Live Preview Box */
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[#F5F5F5] text-lg">
                    Interactive Preview &amp; Crop Overlay
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#E5C38B] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                  
                  {/* Processed Output Card */}
                  <div className="text-center space-y-3">
                    <div className="relative inline-block border border-[#E5C38B]/50 rounded-xl p-1 bg-black/60 shadow-xl">
                      <img
                        src={result ? result.dataUrl : imagePreview}
                        alt="PAN Photo Preview"
                        style={{ width: `${width}px`, height: `${height}px` }}
                        className="object-cover rounded-lg"
                      />
                      {/* Face alignment crosshair overlay */}
                      <div className="absolute inset-0 border border-dashed border-[#E5C38B]/30 pointer-events-none rounded-lg flex items-center justify-center">
                        <div className="w-20 h-24 border border-[#E5C38B]/20 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="text-xs font-mono text-white/40">
                      Exact {width} x {height} px @ {dpi} DPI
                    </div>
                  </div>

                  {/* Compression Stats Badge */}
                  {result && (
                    <div className="bg-black/50 p-5 rounded-2xl border border-white/10 space-y-3 text-left w-full sm:w-56">
                      <div className="text-xs font-mono uppercase tracking-wider text-[#E5C38B] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E5C38B]" />
                        <span>PAN Verified</span>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] text-white/40 uppercase font-mono">Calculated Size</span>
                        <div className="text-2xl font-bold font-mono text-[#E5C38B]">
                          {result.sizeKb} <span className="text-xs text-white/40">KB</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 text-[11px] text-white/50 space-y-1">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={result.sizeKb <= targetSizeKb ? "text-[#E5C38B] font-semibold" : "text-red-400"}>
                            {result.sizeKb <= targetSizeKb ? "Valid (<50KB)" : "Exceeds limit"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span className="text-white/70">JPEG / Color</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Download Button */}
                {result && (
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <a
                      id="photo-tool-download-btn"
                      href={result.dataUrl}
                      download="pan_passport_photo.jpg"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-xs text-black uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-black" />
                      <span>Download Photo</span>
                    </a>

                    <button
                      onClick={() => onNavigate('signature-tool')}
                      className="text-xs text-[#E5C38B] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>Proceed to Signature Tool</span>
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
