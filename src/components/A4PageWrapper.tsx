import React, { useRef, useState, useEffect } from 'react';
import { ThemeStyles } from '../types';

interface A4PageWrapperProps {
  children: React.ReactNode;
  pageNum: number;
  showFooter?: boolean;
  showHeader?: boolean;
  headerText?: string;
  theme: ThemeStyles;
}

export default function A4PageWrapper({
  children,
  pageNum,
  showFooter = true,
  showHeader = true,
  headerText = "專題習作與書面報告",
  theme
}: A4PageWrapperProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Monitor content height to detect physical A4 overflow on screens
  useEffect(() => {
    const checkOverflow = () => {
      const el = pageRef.current;
      if (!el) return;
      
      // A A4 page is roughly 1123px high at 96 DPI. Height of container is 297mm (1122.5px)
      // Allow a small buffer. Let's see if content scrollHeight exceeds clientHeight
      // clientHeight of a4-page is 297mm minus padding (40mm), so approx 257mm (approx 970px)
      const isOverflowing = el.scrollHeight > el.clientHeight + 12;
      setHasOverflow(isOverflowing);
    };

    // Run initially and set a small timeout to let fonts and images load
    checkOverflow();
    const timer = setTimeout(checkOverflow, 500);
    
    // Add event listener to handle potential changes (e.g. contenteditable text)
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children]);

  return (
    <div className="relative group mx-auto mb-10 transition-transform duration-200">
      {/* Off-screen/On-screen status indicator for editor */}
      {hasOverflow && (
        <div className="no-print absolute -top-8 left-0 right-0 bg-rose-500/90 text-white text-xs py-1 px-3 rounded shadow-md z-10 flex items-center justify-between font-sans">
          <span>⚠️ <strong>內容超出 A4 紙張大小！</strong> 列印時多出字數將會被截斷或溢流，請刪減一些字句或縮小字型。</span>
          <button 
            onClick={() => setHasOverflow(false)}
            className="ml-2 underline hover:text-rose-200 text-[10px]"
          >
            忽略
          </button>
        </div>
      )}

      {/* The actual A4 page representation */}
      <div
        id={`a4-page-${pageNum}`}
        ref={pageRef}
        className={`a4-page shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm border border-neutral-200 text-neutral-800 ${theme.fontBody} relative flex flex-col justify-between`}
      >
        {/* Header (no-print/print optional) - Skip on cover (page 1) */}
        {showHeader && pageNum > 1 && (
          <div className={`w-full flex items-center justify-between pb-3 mb-6 border-b ${theme.borderColor} opacity-80 text-xs font-sans tracking-wider print:flex`}>
            <span>{headerText}</span>
            <span className="font-mono text-[10px] text-neutral-400">PAGE 0{pageNum}</span>
          </div>
        )}

        {/* Main Content Area - Expands to fill available space between header & footer */}
        <div className="flex-grow flex flex-col relative w-full overflow-hidden">
          {children}
        </div>

        {/* Footer - Skip on cover (page 1) */}
        {showFooter && pageNum > 1 && (
          <div className="w-full flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 text-[11px] text-neutral-400 font-sans tracking-wide">
            <span>CONFIDENTIAL & ACADEMIC PURPOSES ONLY</span>
            <span className="font-semibold px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-150">
              — {pageNum} —
            </span>
            <span>A4 REPORT BUILDER</span>
          </div>
        )}
      </div>
    </div>
  );
}
