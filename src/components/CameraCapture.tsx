import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { AdBanner } from './AdBanner';
import { 
  Camera, RefreshCw, CheckCircle2, ArrowRight, 
  SwitchCamera, Sparkles, AlertCircle, FileImage, PenTool 
} from 'lucide-react';

interface CameraCaptureProps {
  onNavigate: (screen: Screen) => void;
  onSendToTool: (dataUrl: string, targetTool: 'photo' | 'signature') => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onNavigate, onSendToTool }) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mode, setMode] = useState<'photo' | 'signature'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Request camera permissions and start stream ONLY when user clicks
  const startCamera = async (targetFacingMode = facingMode) => {
    setIsRequesting(true);
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: targetFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
      setCameraError('Camera access denied or unavailable. Please grant permission in your browser or select an image file directly.');
    } finally {
      setIsRequesting(false);
    }
  };

  // Stop camera feed
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Re-run camera when facing mode flips ONLY if camera is already active
  useEffect(() => {
    if (isCameraActive) {
      startCamera(facingMode);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Clean up tracks when unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture image frame from video feed
  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedUrl(url);
    }
  };

  // Toggle Camera Front / Back
  const handleFlipCamera = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-12 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#E5C38B] bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <Camera className="w-3.5 h-3.5 text-[#E5C38B]" />
              <span>WebRTC Scanner</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
              Live Camera Capture <span className="italic text-[#E5C38B]">&amp; Alignment Guide</span>
            </h1>
            <p className="text-white/50 text-sm mt-1 font-light">
              Snap high-resolution passport photos or specimen signatures with live viewport overlays.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => {
                setMode('photo');
                setCapturedUrl(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'photo'
                  ? 'bg-[#E5C38B] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <FileImage className="w-4 h-4" />
              <span>Photo Mode</span>
            </button>

            <button
              onClick={() => {
                setMode('signature');
                setCapturedUrl(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signature'
                  ? 'bg-[#E5C38B] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Signature Mode</span>
            </button>
          </div>
        </div>

        {/* Top Ad Space */}
        <AdBanner type="leaderboard" className="pt-2" />

        {/* Live Camera Viewport */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center space-y-6">
          
          {cameraError ? (
            <div className="py-16 space-y-4 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-[#E5C38B] mx-auto" />
              <p className="text-white/70 text-sm">{cameraError}</p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  id="camera-retry-btn"
                  onClick={() => startCamera()}
                  className="px-6 py-2.5 rounded-full bg-[#E5C38B] text-black text-xs font-semibold hover:bg-white transition-all cursor-pointer"
                >
                  Retry Camera
                </button>
                <button
                  onClick={() => onNavigate('photo-tool')}
                  className="px-6 py-2.5 rounded-full bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Go to File Upload
                </button>
              </div>
            </div>
          ) : !isCameraActive ? (
            /* Initial State Before User Clicks Turn On Camera */
            <div className="py-16 px-6 max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#E5C38B]/10 border border-[#E5C38B]/30 flex items-center justify-center mx-auto text-[#E5C38B]">
                <Camera className="w-10 h-10 text-[#E5C38B]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-[#F5F5F5]">
                  Camera Access Required
                </h3>
                <p className="text-white/50 text-xs font-light leading-relaxed">
                  Click the button below to grant camera access and activate the live document alignment guide for your {mode === 'photo' ? 'passport photo' : 'signature'}.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="start-camera-permission-btn"
                  disabled={isRequesting}
                  onClick={() => startCamera()}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#E5C38B] text-black font-semibold text-xs uppercase tracking-[0.15em] shadow-lg shadow-[#E5C38B]/10 hover:bg-white transition-all cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 text-black" />
                  <span>{isRequesting ? 'Requesting Permission...' : 'Turn On Camera'}</span>
                </button>
              </div>

              <p className="text-[11px] font-mono text-white/30">
                100% Client-Side • No camera data is stored or uploaded to any server
              </p>
            </div>
          ) : !capturedUrl ? (
            <div className="relative aspect-video max-w-2xl mx-auto bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl">
              
              {/* Live Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewport Framing Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {mode === 'photo' ? (
                  <div className="w-56 h-56 border-2 border-dashed border-[#E5C38B] rounded-xl bg-[#E5C38B]/5 flex items-center justify-center">
                    <div className="w-36 h-44 border border-[#E5C38B]/40 rounded-full" />
                  </div>
                ) : (
                  <div className="w-80 h-28 border-2 border-dashed border-[#E5C38B] rounded-lg bg-[#E5C38B]/5 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#E5C38B]/80 uppercase">Align Signature Box Here</span>
                  </div>
                )}
              </div>

              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs font-mono">
                <span className="bg-black/80 text-[#E5C38B] px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5C38B]" />
                  {mode === 'photo' ? 'Photo Oval Overlay Active' : 'Signature Box Frame Active'}
                </span>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={handleFlipCamera}
                    className="p-2.5 rounded-full bg-black/80 text-[#E5C38B] hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
                    title="Flip Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 rounded-full bg-black/80 text-white/70 hover:text-white hover:bg-red-500/20 border border-white/10 transition-all cursor-pointer text-[11px]"
                    title="Turn Off Camera"
                  >
                    Turn Off
                  </button>
                </div>
              </div>

              {/* Snap Action Button */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  id="camera-snap-btn"
                  onClick={handleSnap}
                  className="w-16 h-16 rounded-full bg-[#E5C38B] text-black flex items-center justify-center shadow-xl shadow-[#E5C38B]/20 hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto hover:bg-white"
                >
                  <Camera className="w-7 h-7 text-black" />
                </button>
              </div>

            </div>
          ) : (
            /* Captured Snapshot Review Box */
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#E5C38B]/40 p-2">
                <img
                  src={capturedUrl}
                  alt="Captured Snapshot"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCapturedUrl(null)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold hover:border-[#E5C38B] hover:text-white cursor-pointer transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-[#E5C38B]" />
                  <span>Retake Photo</span>
                </button>

                <button
                  id="camera-send-tool-btn"
                  onClick={() => onSendToTool(capturedUrl, mode)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E5C38B] text-black font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#E5C38B]/10 hover:bg-white cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Use Photo in {mode === 'photo' ? 'Photo Tool' : 'Signature Tool'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Page Ad Space */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
