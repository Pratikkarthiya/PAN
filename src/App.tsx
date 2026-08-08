import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FunMascot } from './components/FunMascot';

// Screen Components
import { LandingPage } from './components/LandingPage';
import { StartCompressing } from './components/StartCompressing';
import { PhotoTool } from './components/PhotoTool';
import { SignatureTool } from './components/SignatureTool';
import { PdfTool } from './components/PdfTool';
import { AadhaarUpload } from './components/AadhaarUpload';
import { CameraCapture } from './components/CameraCapture';
import { QrTransferModal } from './components/QrTransferModal';
import { MobileUpload } from './components/MobileUpload';
import { GuidelinesPage } from './components/GuidelinesPage';
import { FaqPage } from './components/FaqPage';
import { AboutUsPage } from './components/AboutUsPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { ContactUsPage } from './components/ContactUsPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [capturedImageDataUrl, setCapturedImageDataUrl] = useState<string | null>(null);
  const [transferredFileName, setTransferredFileName] = useState<string | null>(null);
  const [mobileRoomId, setMobileRoomId] = useState<string | null>(null);

  // Check URL query params on mount for room parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setMobileRoomId(roomParam);
      setCurrentScreen('mobile-upload');
    }
  }, []);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendFromCamera = (dataUrl: string, targetTool: 'photo' | 'signature') => {
    setCapturedImageDataUrl(dataUrl);
    if (targetTool === 'photo') {
      handleNavigate('photo-tool');
    } else {
      handleNavigate('signature-tool');
    }
  };

  const handleSendFromQr = (dataUrl: string, targetTool: 'photo' | 'signature' | 'pdf', fileName?: string) => {
    setCapturedImageDataUrl(dataUrl);
    setTransferredFileName(fileName || null);
    if (targetTool === 'photo') {
      handleNavigate('photo-tool');
    } else if (targetTool === 'signature') {
      handleNavigate('signature-tool');
    } else if (targetTool === 'pdf') {
      handleNavigate('pdf-tool');
    }
  };

  // Dedicated full-screen layout for mobile upload
  if (currentScreen === 'mobile-upload') {
    return <MobileUpload roomId={mobileRoomId || 'pn-room-demo'} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#E5C38B]/30 selection:text-[#E5C38B]">
      
      {/* Shared Header Navigation */}
      <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Screen Content Viewport */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'start-compressing' && (
          <StartCompressing onNavigate={handleNavigate} />
        )}

        {currentScreen === 'photo-tool' && (
          <PhotoTool onNavigate={handleNavigate} capturedImageDataUrl={capturedImageDataUrl} />
        )}

        {currentScreen === 'signature-tool' && (
          <SignatureTool onNavigate={handleNavigate} capturedImageDataUrl={capturedImageDataUrl} />
        )}

        {currentScreen === 'pdf-tool' && (
          <PdfTool 
            onNavigate={handleNavigate} 
            initialDataUrl={capturedImageDataUrl} 
            initialFileName={transferredFileName} 
          />
        )}

        {currentScreen === 'aadhaar-upload' && (
          <AadhaarUpload onNavigate={handleNavigate} />
        )}

        {currentScreen === 'camera' && (
          <CameraCapture onNavigate={handleNavigate} onSendToTool={handleSendFromCamera} />
        )}

        {currentScreen === 'qr-transfer' && (
          <QrTransferModal onNavigate={handleNavigate} onSendToTool={handleSendFromQr} />
        )}

        {currentScreen === 'guidelines' && (
          <GuidelinesPage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'faq' && (
          <FaqPage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'about' && (
          <AboutUsPage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'terms' && (
          <TermsOfServicePage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'contact' && (
          <ContactUsPage onNavigate={handleNavigate} />
        )}

        {currentScreen === 'privacy' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Shared Footer Navigation */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Interactive Companion Character */}
      <FunMascot onNavigate={handleNavigate} />

    </div>
  );
}
