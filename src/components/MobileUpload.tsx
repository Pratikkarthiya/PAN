import React, { useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { 
  Camera, Upload, CheckCircle2, AlertCircle, 
  Wifi, Smartphone, Lock, FileText, Loader2, RefreshCw, Sparkles 
} from 'lucide-react';

interface MobileUploadProps {
  roomId: string;
}

export const MobileUpload: React.FC<MobileUploadProps> = ({ roomId }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting to desktop...');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentFiles, setSentFiles] = useState<{ name: string; time: string; sizeKb: number }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connRef = useRef<DataConnection | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize PeerJS mobile client
    let peer: Peer | null = null;
    try {
      peer = new Peer({
        debug: 1
      });

      peer.on('open', (mobileId) => {
        console.log('Mobile Peer ID:', mobileId);
        setConnectionStatus(`Connecting to desktop session (${roomId})...`);

        const conn = peer!.connect(roomId);
        connRef.current = conn;

        conn.on('open', () => {
          setIsConnected(true);
          setConnectionStatus('Connected to Desktop Session!');
          setErrorMessage(null);
        });

        conn.on('close', () => {
          setIsConnected(false);
          setConnectionStatus('Disconnected from desktop.');
        });

        conn.on('error', (err) => {
          console.error('Mobile connection error:', err);
          setIsConnected(false);
          setErrorMessage('Failed to connect to desktop session. Please scan the QR code again.');
        });
      });

      peer.on('error', (err) => {
        console.error('PeerJS error:', err);
        setErrorMessage('Peer network error. Please ensure both devices are connected to the internet.');
      });

    } catch (err) {
      console.error('Failed to create mobile PeerJS:', err);
      setErrorMessage('Could not initialize P2P file sender.');
    }

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [roomId]);

  const processAndSendFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    if (!connRef.current || !isConnected) {
      setErrorMessage('Desktop session is not connected. Please scan the QR code again.');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    try {
      for (const file of Array.from(files)) {
        const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
        const sizeKb = Math.round(file.size / 1024);
        let payload: any;

        if (isPdf) {
          const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
          });

          payload = {
            id: `mob-${Date.now()}-${Math.random()}`,
            name: file.name,
            sizeKb,
            type: 'pdf',
            mimeType: file.type || 'application/pdf',
            dataBuffer: arrayBuffer
          };
        } else {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });

          payload = {
            id: `mob-${Date.now()}-${Math.random()}`,
            name: file.name,
            sizeKb,
            type: 'image',
            mimeType: file.type || 'image/jpeg',
            dataUrl
          };
        }

        // Send via WebRTC RTCDataChannel
        connRef.current.send(payload);

        setSentFiles((prev) => [
          {
            name: file.name,
            sizeKb,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Failed to read or send file:', err);
      setErrorMessage('Error reading selected file. Please try again.');
    } finally {
      setIsSending(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-8 px-5 font-sans selection:bg-[#E5C38B] selection:text-black flex flex-col justify-between">
      <div className="max-w-md mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E5C38B]/10 border border-[#E5C38B]/30 text-[#E5C38B] text-[10px] font-mono uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Mobile File Transmitter</span>
          </div>
          <h1 className="text-2xl font-serif text-[#F5F5F5]">
            Send to Desktop <span className="italic text-[#E5C38B]">P2P</span>
          </h1>
          <p className="text-xs text-white/50">
            Select files or capture camera snapshots to send directly to your computer screen.
          </p>
        </div>

        {/* Connection Status Card */}
        <div className={`p-4 rounded-xl border backdrop-blur-xl transition-all flex items-center justify-between text-xs font-mono ${
          isConnected 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <Wifi className={`w-4 h-4 ${isConnected ? 'animate-pulse text-emerald-400' : 'animate-ping text-amber-400'}`} />
            <span>{connectionStatus}</span>
          </div>
          {isConnected && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload Actions */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
          
          <h2 className="text-sm font-serif text-[#F5F5F5] border-b border-white/10 pb-2">
            Select Upload Method
          </h2>

          {/* Camera Capture Button */}
          <button
            id="mobile-camera-btn"
            disabled={!isConnected || isSending}
            onClick={() => cameraInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#E5C38B] text-black font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer disabled:opacity-40"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Camera className="w-4 h-4 text-black" />}
            <span>Take Photo with Camera</span>
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files && processAndSendFiles(e.target.files)}
            className="hidden"
          />

          {/* Pick File/Gallery Button */}
          <button
            id="mobile-gallery-btn"
            disabled={!isConnected || isSending}
            onClick={() => galleryInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/10 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/20 border border-white/20 transition-all cursor-pointer disabled:opacity-40"
          >
            <Upload className="w-4 h-4 text-[#E5C38B]" />
            <span>Select Photos / PDFs from Device</span>
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={(e) => e.target.files && processAndSendFiles(e.target.files)}
            className="hidden"
          />

          <p className="text-[11px] text-white/40 text-center font-mono pt-1">
            Supports passport photos, signature scans, and Aadhaar PDFs
          </p>
        </div>

        {/* Sent History List */}
        {sentFiles.length > 0 && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 border-b border-white/10 pb-2">
              <span>Transferred Files ({sentFiles.length})</span>
              <span className="text-[#E5C38B]">Sent to Desktop</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sentFiles.map((sf, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[#F5F5F5] truncate">{sf.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 shrink-0 pl-2">{sf.sizeKb} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Notice */}
      <div className="max-w-md mx-auto w-full pt-8 text-center space-y-2 text-[10px] font-mono text-white/30 border-t border-white/10 mt-8">
        <div className="flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#E5C38B]" />
          <span>100% Client-Side WebRTC Memory Transfer</span>
        </div>
        <p>No files are ever uploaded or stored on any server.</p>
      </div>
    </div>
  );
};
