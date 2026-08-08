import React, { useEffect, useRef, useState } from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { createAadhaarTwoSidedPdf, renderPdfFileToPages } from '../utils/pdfGenerator';
import { ArrowLeft, Upload, Download, Trash2, Loader2, AlertCircle, FileText } from 'lucide-react';

interface AadhaarUploadProps {
  onNavigate: (screen: Screen) => void;
}

interface SidePreview {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export const AadhaarUpload: React.FC<AadhaarUploadProps> = ({ onNavigate }) => {
  const [front, setFront] = useState<SidePreview | null>(null);
  const [back, setBack] = useState<SidePreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfResult, setPdfResult] = useState<{ pdfDataUrl: string; sizeKb: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (front?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(front.previewUrl);
      }
      if (back?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(back.previewUrl);
      }
    };
  }, [front, back]);

  const clearSide = (side: 'front' | 'back') => {
    if (side === 'front') {
      if (front?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(front.previewUrl);
      setFront(null);
    } else {
      if (back?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(back.previewUrl);
      setBack(null);
    }
    setPdfResult(null);
    setErrorMessage(null);
  };

  const loadFilePreview = async (file: File): Promise<SidePreview> => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      const renderedPages = await renderPdfFileToPages(file);
      if (renderedPages.length === 0) {
        throw new Error('PDF did not contain any previewable pages.');
      }
      return {
        file,
        previewUrl: renderedPages[0].previewUrl,
        width: renderedPages[0].width,
        height: renderedPages[0].height,
      };
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = previewUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image preview.'));
    });

    return {
      file,
      previewUrl,
      width: img.width,
      height: img.height,
    };
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setPdfResult(null);
    setIsProcessing(true);

    try {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 2) {
        throw new Error('Please upload only two files: Aadhaar front and back.');
      }

      for (const file of selectedFiles) {
        const preview = await loadFilePreview(file);

        if (!front) {
          setFront(preview);
        } else if (!back) {
          setBack(preview);
        } else {
          throw new Error('Both Aadhaar sides are already uploaded.');
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to process uploads.');
    } finally {
      setIsProcessing(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      void handleFiles(e.dataTransfer.files);
    }
  };

  const handleGenerate = async () => {
    if (!front || !back) {
      setErrorMessage('Upload both Aadhaar front and back before generating the merged PDF.');
      return;
    }

    setErrorMessage(null);
    setPdfResult(null);
    setIsProcessing(true);

    try {
      const result = await createAadhaarTwoSidedPdf(front, back, 300, 0.75);
      setPdfResult({ pdfDataUrl: result.pdfDataUrl, sizeKb: result.sizeKb });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate Aadhaar PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <button
            onClick={() => onNavigate('start-compressing')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C38B] bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full hover:bg-white/[0.05]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to tools
          </button>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#E5C38B] bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-[#E5C38B]" />
              <span>Aadhaar Front + Back</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
              Convert both Aadhaar sides into a single PDF page
            </h1>
            <p className="text-white/50 text-sm mt-1 font-light">
              Upload front and back Aadhaar scans and create one merged page suitable for PAN/NSDL submissions.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3 font-mono">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-[#F5F5F5] border-b border-white/10 pb-3">
              <Upload className="w-5 h-5 text-[#E5C38B]" />
              <span>Upload Instructions</span>
            </div>
            <div className="space-y-4 text-sm text-white/60">
              <p>Upload the Aadhaar front and back scans as image files or a PDF containing both pages.</p>
              <p>Drag & drop both files, then press Generate to produce a single combined page PDF.</p>
              <p>The final PDF is created locally in your browser and is not uploaded anywhere.</p>
            </div>

            <button
              onClick={() => inputRef.current?.click()}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] bg-[#E5C38B] text-black hover:bg-white transition-colors shadow-lg shadow-[#E5C38B]/10 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Upload className="w-4 h-4 text-black" />}
              <span>{isProcessing ? 'Processing...' : 'Select Aadhaar Front + Back'}</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf,.pdf"
              multiple
              onChange={handleUpload}
              className="hidden"
            />

            <div className="space-y-3 text-xs text-white/50">
              <p><strong>Tip:</strong> If you have a single PDF with two pages, upload it directly and the first two pages will be extracted.</p>
              <p><strong>Tip:</strong> Front and back images should be clear, straight, and cropped close to the card edges for best results.</p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !front || !back}
              className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold uppercase tracking-[0.15em] transition-all ${
                front && back && !isProcessing
                  ? 'bg-[#E5C38B] text-black hover:bg-white shadow-lg shadow-[#E5C38B]/10'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span>{isProcessing ? 'Generating PDF...' : 'Generate Merged Aadhaar PDF'}</span>
            </button>

            {pdfResult && (
              <div className="bg-black/50 p-4 rounded-xl border border-[#E5C38B]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#E5C38B]">
                  <span>Merged PDF Ready</span>
                  <span className="font-bold">{pdfResult.sizeKb} KB</span>
                </div>
                <a
                  href={pdfResult.pdfDataUrl}
                  download="aadhaar_front_back_single_page.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-[#E5C38B] hover:bg-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Aadhaar PDF</span>
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border border-dashed border-white/20 rounded-2xl p-8 text-center bg-white/[0.02] hover:border-[#E5C38B] hover:bg-white/[0.05] backdrop-blur-xl transition-all cursor-pointer"
            >
              <p className="text-sm text-[#F5F5F5] font-medium">Drag and drop Aadhaar front/back files here</p>
              <p className="text-xs text-white/40 mt-2">Or click the button to select your files. Upload up to 2 files.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['front', 'back'].map((side) => {
                const data = side === 'front' ? front : back;
                const label = side === 'front' ? 'Aadhaar Front' : 'Aadhaar Back';
                return (
                  <div key={side} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-semibold text-[#F5F5F5]">{label}</h2>
                        <p className="text-[11px] text-white/40">{data ? data.file.name : 'Awaiting upload'}</p>
                      </div>
                      {data && (
                        <button
                          onClick={() => clearSide(side as 'front' | 'back')}
                          className="text-white/50 hover:text-red-400"
                          title="Remove uploaded side"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-black/50 border border-white/10 min-h-[220px] flex items-center justify-center">
                      {data ? (
                        <img src={data.previewUrl} alt={label} className="object-contain max-h-[220px]" />
                      ) : (
                        <div className="text-xs text-white/40">No file uploaded yet.</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <AdBanner type="rectangle" className="mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
