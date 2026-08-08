import React, { useState, useRef } from 'react';
import { Screen, PdfPageItem } from '../types';
import { AdBanner } from './AdBanner';
import { createCompressedPdf, renderPdfFileToPages } from '../utils/pdfGenerator';
import { 
  FileText, Upload, Trash2, RotateCw, Download, 
  CheckCircle2, Plus, ShieldCheck, FileCheck, Loader2, AlertCircle 
} from 'lucide-react';

interface PdfToolProps {
  onNavigate: (screen: Screen) => void;
  initialDataUrl?: string | null;
  initialFileName?: string | null;
}

export const PdfTool: React.FC<PdfToolProps> = ({ 
  onNavigate, 
  initialDataUrl, 
  initialFileName 
}) => {
  const [pages, setPages] = useState<PdfPageItem[]>([]);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(280); // Under 300KB limit
  const [dpiQuality, setDpiQuality] = useState<number>(0.75);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfResult, setPdfResult] = useState<{ pdfDataUrl: string; sizeKb: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial file from QR transfer if passed
  React.useEffect(() => {
    if (initialDataUrl) {
      fetch(initialDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = initialFileName || 'mobile_transferred.pdf';
          const file = new File([blob], fileName, { type: blob.type || 'application/pdf' });
          processFileList([file]);
        })
        .catch((err) => console.error('Failed to load initial dataUrl in PdfTool:', err));
    }
  }, [initialDataUrl, initialFileName]);

  const processFileList = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsLoadingFiles(true);
    setErrorMessage(null);
    const newPages: PdfPageItem[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          // Render PDF pages into preview canvas URLs
          const renderedPages = await renderPdfFileToPages(file);
          renderedPages.forEach((p, idx) => {
            newPages.push({
              id: `${Date.now()}-${idx}-${file.name}`,
              file,
              previewUrl: p.previewUrl,
              width: p.width,
              height: p.height,
              rotation: 0
            });
          });
        } else if (file.type.startsWith('image/')) {
          // Render image files
          const previewUrl = URL.createObjectURL(file);
          const img = new Image();
          img.src = previewUrl;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });

          newPages.push({
            id: `${Date.now()}-${Math.random()}-${file.name}`,
            file,
            previewUrl,
            width: img.width || 1240,
            height: img.height || 1754,
            rotation: 0
          });
        }
      }

      setPages((prev) => [...prev, ...newPages]);
      setPdfResult(null);
    } catch (err: unknown) {
      console.error('Error processing file list:', err);
      const message = err instanceof Error ? err.message : 'Failed to process selected file. Please ensure it is a valid PDF or image.';
      setErrorMessage(message);
    } finally {
      setIsLoadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFileList(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFileList(e.dataTransfer.files);
    }
  };

  // Add sample Aadhaar & PAN form pages if empty
  const handleAddSamplePages = () => {
    setErrorMessage(null);
    const createSamplePage = (title: string, subtitle: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1131; // A4 aspect ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 800, 1131);

        // Header border
        ctx.fillStyle = '#050505';
        ctx.fillRect(40, 40, 720, 120);

        ctx.fillStyle = '#E5C38B';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('GOVERNMENT OF INDIA / NSDL PROOF', 70, 100);

        ctx.fillStyle = '#F5F5F5';
        ctx.font = '18px sans-serif';
        ctx.fillText(title, 70, 130);

        // Content box
        ctx.strokeStyle = '#E5C38B';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 190, 720, 880);

        ctx.fillStyle = '#111111';
        ctx.font = '22px sans-serif';
        ctx.fillText(`DOCUMENT TYPE: ${subtitle}`, 70, 240);
        ctx.fillText(`APPLICANT NAME: DEMO USER`, 70, 280);
        ctx.fillText(`DATE OF ISSUE: ${new Date().toLocaleDateString()}`, 70, 320);

        // Simulated text lines
        for (let i = 0; i < 12; i++) {
          ctx.fillStyle = '#CBD5E1';
          ctx.fillRect(70, 380 + i * 40, 660, 14);
        }
      }
      return canvas.toDataURL('image/jpeg', 0.85);
    };

    const p1Url = createSamplePage('PAN Application Form 49A', 'Form Page 1');
    const p2Url = createSamplePage('Aadhaar Card Copy', 'Identity & Address Proof');

    fetch(p1Url).then(res => res.blob()).then(blob => {
      const file1 = new File([blob], "PAN_Form_Page1.jpg", { type: "image/jpeg" });
      const item1: PdfPageItem = {
        id: `sample-1-${Date.now()}`,
        file: file1,
        previewUrl: p1Url,
        width: 800,
        height: 1131,
        rotation: 0
      };

      fetch(p2Url).then(res => res.blob()).then(blob2 => {
        const file2 = new File([blob2], "Aadhaar_Proof.jpg", { type: "image/jpeg" });
        const item2: PdfPageItem = {
          id: `sample-2-${Date.now()}`,
          file: file2,
          previewUrl: p2Url,
          width: 800,
          height: 1131,
          rotation: 0
        };

        setPages([item1, item2]);
        setPdfResult(null);
      });
    });
  };

  const handleRemovePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setPdfResult(null);
  };

  const handleRotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
    setPdfResult(null);
  };

  const handleGeneratePdf = async () => {
    if (pages.length === 0) return;
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const res = await createCompressedPdf(pages, targetSizeKb, dpiQuality);
      setPdfResult({ pdfDataUrl: res.pdfDataUrl, sizeKb: res.sizeKb });
    } catch (err: unknown) {
      console.error('Error compiling PDF:', err);
      const message = err instanceof Error ? err.message : 'Error compressing PDF. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#E5C38B] bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-[#E5C38B]" />
              <span>PAN PDF Merger &amp; Shrinker</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
              PAN Document <span className="italic text-[#E5C38B]">PDF Merger (&lt; 300 KB)</span>
            </h1>
            <p className="text-white/50 text-sm mt-1 font-light">
              Combine Aadhaar, PAN Form 49A, and proof documents or compress existing PDF files into a single optimized PDF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="pdf-tool-sample-btn"
              onClick={handleAddSamplePages}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white/80 border border-white/20 hover:border-[#E5C38B] hover:text-white transition-all cursor-pointer"
            >
              <span>Load Sample Documents</span>
            </button>
            <button
              id="pdf-add-more-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoadingFiles}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-black uppercase tracking-wider bg-[#E5C38B] hover:bg-white transition-all cursor-pointer shadow-lg shadow-[#E5C38B]/10 disabled:opacity-50"
            >
              {isLoadingFiles ? (
                <Loader2 className="w-4 h-4 text-black animate-spin" />
              ) : (
                <Plus className="w-4 h-4 text-black" />
              )}
              <span>{isLoadingFiles ? 'Processing...' : 'Add Pages / PDFs'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.pdf"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3 font-mono">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="font-serif text-[#F5F5F5] text-lg border-b border-white/10 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E5C38B]" />
              <span>PDF Target Settings</span>
            </div>

            {/* Target Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-white/70">Target Max PDF Size</span>
                <span className="text-[#E5C38B] font-mono font-bold">{targetSizeKb} KB</span>
              </div>
              <input
                id="pdf-size-slider"
                type="range"
                min="100"
                max="300"
                step="10"
                value={targetSizeKb}
                onChange={(e) => {
                  setTargetSizeKb(Number(e.target.value));
                  setPdfResult(null);
                }}
                className="w-full accent-[#E5C38B] cursor-pointer"
              />
              <p className="text-[11px] text-white/40">Strict Government limit: Under 300 KB.</p>
            </div>

            {/* Document Quality Selector */}
            <div className="space-y-2">
              <label className="block text-xs text-white/70">Image Compression Quality</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDpiQuality(0.65);
                    setPdfResult(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    dpiQuality === 0.65 
                      ? 'bg-[#E5C38B]/10 text-[#E5C38B] border-[#E5C38B]/50' 
                      : 'bg-black/30 text-white/50 border-white/10'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDpiQuality(0.85);
                    setPdfResult(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    dpiQuality === 0.85 
                      ? 'bg-[#E5C38B]/10 text-[#E5C38B] border-[#E5C38B]/50' 
                      : 'bg-black/30 text-white/50 border-white/10'
                  }`}
                >
                  High Clarity
                </button>
              </div>
            </div>

            {/* Ad Banner in control panel */}
            <AdBanner type="rectangle" className="my-2" />

            {/* Generate Action Button */}
            <button
              id="pdf-generate-btn"
              disabled={pages.length === 0 || isGenerating || isLoadingFiles}
              onClick={handleGeneratePdf}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] transition-all cursor-pointer ${
                pages.length > 0 && !isGenerating && !isLoadingFiles
                  ? 'bg-[#E5C38B] text-black hover:bg-white shadow-lg shadow-[#E5C38B]/10'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <FileCheck className="w-4 h-4" />}
              <span>{isGenerating ? 'Compressing PDF...' : 'Compile & Compress PDF'}</span>
            </button>

            {/* Generated PDF Download Card */}
            {pdfResult && (
              <div className="bg-black/50 p-4 rounded-xl border border-[#E5C38B]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#E5C38B]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#E5C38B]" /> Ready for NSDL
                  </span>
                  <span className="font-bold text-[#E5C38B]">{pdfResult.sizeKb} KB</span>
                </div>

                <a
                  id="pdf-download-link"
                  href={pdfResult.pdfDataUrl}
                  download="pan_application_documents.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-[#E5C38B] hover:bg-white transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>
            )}

          </div>

          {/* Pages Drag/Drop & List Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {pages.length === 0 ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/20 hover:border-[#E5C38B] rounded-2xl p-12 text-center bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl transition-all cursor-pointer space-y-4 group"
              >
                {isLoadingFiles ? (
                  <div className="py-8 space-y-3 text-center">
                    <Loader2 className="w-10 h-10 text-[#E5C38B] animate-spin mx-auto" />
                    <p className="text-sm font-mono text-[#E5C38B]">Extracting PDF / Image pages...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#E5C38B] group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7 text-[#E5C38B]" />
                    </div>
                    <div>
                      <p className="text-base font-serif text-[#F5F5F5]">
                        Click or Drag &amp; Drop PDF / Image files here
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Upload Aadhaar PDF, PAN Form 49A, or image scans (JPG, PNG, PDF)
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                
                <div className="flex items-center justify-between text-xs font-mono text-white/40 pb-2 border-b border-white/10">
                  <span>Selected Document Pages ({pages.length})</span>
                  <span>Rotate or remove individual pages</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {pages.map((page, idx) => (
                    <div
                      key={page.id}
                      className="group relative bg-black/40 rounded-xl p-3 border border-white/10 space-y-2"
                    >
                      <div className="relative aspect-[3/4] bg-black/60 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={page.previewUrl}
                          alt={`Page ${idx + 1}`}
                          style={{ transform: `rotate(${page.rotation}deg)` }}
                          className="object-contain max-h-full transition-transform"
                        />
                        <span className="absolute top-2 left-2 bg-black/80 text-[#E5C38B] font-mono text-[10px] px-2 py-0.5 rounded border border-white/10">
                          Page {idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => handleRotatePage(page.id)}
                          className="p-1.5 rounded-lg text-white/50 hover:text-[#E5C38B] hover:bg-white/10 cursor-pointer"
                          title="Rotate Page 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePage(page.id)}
                          className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 cursor-pointer"
                          title="Remove Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Workspace Bottom Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
