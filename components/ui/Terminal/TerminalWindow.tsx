import React from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  showScanline?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = React.memo(({ 
  children, 
  title = "terminal.sh",
  className = "",
  showScanline = true
}) => {
  return (
    <div className={`terminal-window flex flex-col group ${className}`}>
      {/* Header */}
      <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/60 shadow-[0_0_8px_rgba(255,95,86,0.2)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60 shadow-[0_0_8px_rgba(255,189,46,0.2)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/60 shadow-[0_0_8px_rgba(39,201,63,0.2)]"></div>
          </div>
          <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase font-bold">{title}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/5"></div>
          <div className="w-4 h-1.5 rounded-full bg-white/5"></div>
        </div>
      </div>
      
      {/* Content Area - FIXED: Better overflow handling and text visibility */}
      <div className="relative p-4 md:p-8 font-mono text-sm min-h-[250px] md:min-h-[300px] max-h-[80dvh] overflow-y-auto overflow-x-hidden bg-black/70 custom-scrollbar">
        {/* Interactive Scanline */}
        {showScanline && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="w-full h-[2px] bg-cyan-500/10 absolute top-0 animate-scanline"></div>
            <div className="absolute inset-0 bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%]"></div>
          </div>
        )}
        
        {/* FIXED: Increased text contrast from text-white/70 to text-white/90 */}
        <div className="relative z-20 flex flex-col gap-1.5 text-white/90">
          {children}
        </div>
      </div>
    </div>
  );
});
