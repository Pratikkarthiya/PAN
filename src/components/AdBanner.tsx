import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  type?: 'leaderboard' | 'rectangle' | 'native' | 'inline';
  className?: string;
  label?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  type = 'leaderboard', 
  className = '',
  label = 'ADVERTISEMENT' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous contents
    containerRef.current.innerHTML = '';

    let width: string | number = '100%';
    let height: string | number = 250;

    if (type === 'rectangle') {
      width = 300;
      height = 250;
    }

    const iframe = document.createElement('iframe');
    iframe.width = width.toString();
    iframe.height = height.toString();
    iframe.style.border = '0';
    iframe.style.margin = '0 auto';
    iframe.style.padding = '0';
    iframe.style.display = 'block';
    iframe.style.width = typeof width === 'number' ? `${width}px` : width;
    iframe.style.maxWidth = '100%';
    iframe.style.backgroundColor = 'transparent';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameBorder', '0');
    
    // Enable media & video ad capabilities (autoplay, fullscreen, audio, picture-in-picture)
    iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('webkitallowfullscreen', 'true');
    iframe.setAttribute('mozallowfullscreen', 'true');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    const placeholderHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: transparent;
              color: rgba(255, 255, 255, 0.35);
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 11px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <div>Advertisement Space</div>
        </body>
      </html>
    `;

    const htmlContent = placeholderHtml;

    containerRef.current.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    } catch (e) {
      console.warn("Could not write ad iframe content:", e);
    }
  }, [type]);

  const isSquareOrNative = type === 'rectangle' || type === 'native' || type === 'inline';

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-1">
        {label}
      </span>
      
      <div className={`w-full ${type === 'rectangle' ? 'max-w-md min-h-[260px]' : type === 'native' || type === 'inline' ? 'max-w-2xl min-h-[260px]' : 'max-w-4xl min-h-[106px]'} bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-x-auto hover:border-white/20 transition-all shadow-inner`}>
        <div ref={containerRef} className="flex justify-center items-center w-full min-w-[280px] overflow-hidden" />
      </div>
    </div>
  );
};



