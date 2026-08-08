import React, { useState } from 'react';
import { Screen } from '../types';
import { FileImage, PenTool, FileText, Camera, HelpCircle, Zap, Shield, Menu, X, Sparkles, QrCode } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Screen; label: string; icon?: React.ReactNode }[] = [
    { id: 'start-compressing', label: 'Compressor' },
    { id: 'photo-tool', label: 'Photo' },
    { id: 'signature-tool', label: 'Signature' },
    { id: 'pdf-tool', label: 'PDF Tool' },
    { id: 'camera', label: 'Camera' },
    { id: 'qr-transfer', label: 'QR Transfer' },
    { id: 'guidelines', label: 'Guidelines' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo / Home */}
          <button 
            id="nav-logo"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-[#E5C38B] to-[#B8860B] rounded-full flex items-center justify-center shadow-lg shadow-[#E5C38B]/10 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-[#050505] rounded-sm rotate-45"></div>
            </div>
            <div>
              <span className="text-2xl font-semibold tracking-tighter uppercase font-serif text-[#F5F5F5] group-hover:text-[#E5C38B] transition-colors">
                KP CYBER
              </span>
              <span className="block text-[9px] tracking-[0.25em] text-[#E5C38B]/70 font-mono uppercase">
                PAN CARD STUDIO
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`transition-colors cursor-pointer py-1 ${
                    isActive 
                      ? 'text-[#E5C38B] border-b-2 border-[#E5C38B] font-semibold' 
                      : 'hover:text-[#E5C38B]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="header-cta-start"
              onClick={() => onNavigate('start-compressing')}
              className="px-6 py-2.5 bg-[#E5C38B] text-black font-semibold text-xs uppercase tracking-[0.15em] rounded-full hover:bg-white transition-all cursor-pointer shadow-lg shadow-[#E5C38B]/10 active:scale-95"
            >
              Start Compressing
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full text-white/80 hover:text-white border border-white/10 hover:border-[#E5C38B]/40 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E5C38B]" /> : <Menu className="w-5 h-5 text-[#E5C38B]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050505]/98 border-b border-white/10 px-6 pt-4 pb-8 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                currentScreen === item.id
                  ? 'bg-white/[0.08] text-[#E5C38B] border border-[#E5C38B]/30'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E5C38B]" />
            </button>
          ))}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                onNavigate('start-compressing');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 rounded-full text-black font-semibold text-xs uppercase tracking-[0.15em] bg-[#E5C38B] hover:bg-white transition-all text-center"
            >
              Start Compressing
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
