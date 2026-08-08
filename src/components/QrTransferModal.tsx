import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import { ReceivedMobileFile, Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  QrCode, Smartphone, Download, CheckCircle2, 
  ArrowRight, Copy, Check, RefreshCw, Lock, 
  FileImage, PenTool, FileText, AlertCircle, X, Wifi
} from 'lucide-react';

interface QrTransferModalProps {
  onNavigate: (screen: Screen) => void;
  onSendToTool: (dataUrl: string, targetTool: 'photo' | 'signature' | 'pdf', fileName?: string) => void;
  onClose?: () => void;
}

export const QrTransferModal: React.FC<QrTransferModalProps> = ({ 
  onNavigate, 
  onSendToTool,
  onClose 
}) => {
  const [roomId] = useState(() => 'pn-room-' + Math.random().toString(36).substring(2, 9));
  const [isPeerReady, setIsPeerReady] = useState<boolean>(false);
  const [isMobileConnected, setIsMobileConnected] = useState<boolean>(false);
  const [peerError, setPeerError] = useState<string | null>(null);
  const [receivedFiles, setReceivedFiles] = useState<ReceivedMobileFile[]>([]);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const peerRef = useRef<Peer | null>(null);

  const mobileUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

  useEffect(() => {
    // Initialize Desktop PeerJS Connection
    try {
      const peer = new Peer(roomId, {
        debug: 1
      });

      peerRef.current = peer;

      peer.on('open', () => {
        setIsPeerReady(true);
        setPeerError(null);
      });

      peer.on('connection', (conn) => {
        setIsMobileConnected(true);

        conn.on('data', (data: any) => {
          if (!data) return;

          let dataUrl: string;
          let mimeType = data.mimeType || 'application/octet-stream';
          let type = data.type;

          if (data.dataBuffer) {
            const blob = new Blob([data.dataBuffer], { type: mimeType });
            dataUrl = URL.createObjectURL(blob);
          } else if (data.dataUrl) {
            dataUrl = data.dataUrl;
          } else {
            return;
          }

          const newFile: ReceivedMobileFile = {
            id: data.id || `rec-${Date.now()}-${Math.random()}`,
            name: data.name || 'mobile_file',
            sizeKb: data.sizeKb || 0,
            type: type || (mimeType.includes('pdf') || data.name?.endsWith('.pdf') ? 'pdf' : 'image'),
            mimeType,
            dataUrl,
            timestamp: Date.now()
          };

          setReceivedFiles((prev) => [newFile, ...prev]);
        });

        conn.on('close', () => {
          setIsMobileConnected(false);
        });

        conn.on('error', (err) => {
          console.error('Peer connection error:', err);
        });
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        setPeerError('Network signalling issue. You can copy the direct URL or try refreshing.');
      });

    } catch (err) {
      console.error('Failed to create PeerJS:', err);
      setPeerError('Could not initialize WebRTC session.');
    }

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [roomId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadFile = (file: ReceivedMobileFile) => {
    const a = document.createElement('a');
    a.href = file.dataUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5C38B]/10 border border-[#E5C38B]/30 flex items-center justify-center text-[#E5C38B]">
              <QrCode className="w-5 h-5 text-[#E5C38B]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5C38B]">
                <span>WebRTC Peer-to-Peer</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#F5F5F5]">
                Direct Mobile <span className="italic text-[#E5C38B]">QR Transfer</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              id="qr-transfer-back-btn"
              onClick={() => onNavigate('start-compressing')}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white/80 border border-white/20 hover:border-[#E5C38B] hover:text-white transition-all cursor-pointer"
            >
              Back to Tools
            </button>
          </div>
        </div>

        {peerError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3 font-mono">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{peerError}</span>
          </div>
        )}

        <AdBanner type="leaderboard" className="py-2" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: QR Code Box */}
          <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 text-center">
            
            {/* Live Connection Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-mono">
              <Wifi className={`w-3.5 h-3.5 ${isMobileConnected ? 'text-emerald-400 animate-pulse' : 'text-[#E5C38B] animate-ping'}`} />
              <span className={isMobileConnected ? 'text-emerald-400 font-bold' : 'text-[#E5C38B]'}>
                {isMobileConnected ? 'Mobile Phone Connected!' : 'Waiting for scan...'}
              </span>
            </div>

            {/* High-Contrast QR Code Container for Universal Mobile Camera Scanning */}
            <div className="relative p-6 bg-[#0c0c0c] rounded-2xl border border-white/15 shadow-2xl flex flex-col items-center justify-center max-w-[280px] mx-auto group">
              {/* High Contrast White Canvas to ensure 100% Mobile Camera Recognition */}
              <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 flex flex-col items-center justify-center transition-transform group-hover:scale-102 duration-300">
                <QRCodeSVG
                  value={mobileUrl}
                  size={210}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                  marginSize={2}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-[#E5C38B] tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ROOM ID: {roomId}</span>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-2 text-left bg-black/40 p-4 rounded-xl border border-white/10 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E5C38B]/20 text-[#E5C38B] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p>Open your smartphone camera and scan the QR code above.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E5C38B]/20 text-[#E5C38B] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p>Snap a live photo or pick document/signature files from your gallery.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E5C38B]/20 text-[#E5C38B] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p>Files arrive right here on your desktop screen instantly!</p>
              </div>
            </div>

            {/* Mobile Link Options & Copy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mobileUrl}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-mono text-white/70 focus:outline-none select-all"
                />
                <button
                  id="qr-copy-link-btn"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#E5C38B] bg-[#E5C38B]/10 hover:bg-[#E5C38B]/20 border border-[#E5C38B]/30 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={mobileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white/90 border border-white/20 hover:border-[#E5C38B] hover:text-white bg-white/[0.02] transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#E5C38B]" />
                <span>Open Mobile Mode in New Tab</span>
              </a>
            </div>

            {/* Privacy Guarantee Footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-white/40 pt-2 border-t border-white/10">
              <Lock className="w-3.5 h-3.5 text-[#E5C38B]" />
              <span>100% P2P Memory-to-Memory WebRTC</span>
            </div>

          </div>

          {/* Right Column: Received Files Inbox */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif text-[#F5F5F5]">
                    Received Mobile Files
                  </h2>
                  <p className="text-xs text-white/50">
                    Files sent from your connected phone appear here in real time.
                  </p>
                </div>
                <span className="bg-[#E5C38B]/10 text-[#E5C38B] border border-[#E5C38B]/30 font-mono text-xs px-3 py-1 rounded-full font-bold">
                  {receivedFiles.length} {receivedFiles.length === 1 ? 'file' : 'files'}
                </span>
              </div>

              {receivedFiles.length === 0 ? (
                /* Empty Waiting State */
                <div className="border border-dashed border-white/20 rounded-2xl p-12 text-center space-y-4 bg-black/30">
                  <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-[#E5C38B] animate-bounce">
                    <Smartphone className="w-8 h-8 text-[#E5C38B]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-serif text-[#F5F5F5]">
                      No files received yet
                    </p>
                    <p className="text-xs text-white/40 max-w-sm mx-auto">
                      Scan the QR code on your phone to send passport photos, signatures, or Aadhaar PDF documents.
                    </p>
                  </div>
                </div>
              ) : (
                /* Received Files List */
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {receivedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-black/50 border border-white/10 hover:border-[#E5C38B]/50 rounded-xl p-4 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {file.type === 'image' ? (
                            <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center">
                              <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#E5C38B]/10 border border-[#E5C38B]/30 shrink-0 flex items-center justify-center text-[#E5C38B]">
                              <FileText className="w-6 h-6 text-[#E5C38B]" />
                            </div>
                          )}

                          <div className="truncate">
                            <h3 className="text-xs font-semibold text-[#F5F5F5] truncate">
                              {file.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mt-0.5">
                              <span>{file.sizeKb} KB</span>
                              <span>•</span>
                              <span className="uppercase text-[#E5C38B]">{file.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Direct Download Button */}
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                          title="Download Original File to Desktop"
                        >
                          <Download className="w-3.5 h-3.5 text-[#E5C38B]" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>

                      {/* Compress in App Action Bar */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-white/50">
                          Compress in App:
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          {file.type === 'image' ? (
                            <>
                              <button
                                onClick={() => onSendToTool(file.dataUrl, 'photo', file.name)}
                                className="px-3 py-1.5 rounded-full bg-[#E5C38B] hover:bg-white text-black text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <FileImage className="w-3.5 h-3.5" />
                                <span>Photo Tool (213x213)</span>
                              </button>
                              <button
                                onClick={() => onSendToTool(file.dataUrl, 'signature', file.name)}
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#E5C38B] hover:text-black text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <PenTool className="w-3.5 h-3.5" />
                                <span>Signature Tool (200x600)</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onSendToTool(file.dataUrl, 'pdf', file.name)}
                              className="px-3.5 py-1.5 rounded-full bg-[#E5C38B] hover:bg-white text-black text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Send to PDF Tool (&lt;300KB)</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Bottom Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
