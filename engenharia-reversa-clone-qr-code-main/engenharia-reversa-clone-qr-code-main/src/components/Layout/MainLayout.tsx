import React from 'react';
import { cn } from '../../lib/utils';
import { QrCode, Monitor, Share2, Info } from 'lucide-react';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  preview: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, preview }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1A1A1A] rounded-lg">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">QR Code Styling</h1>
            <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Professional Generator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#4B5563] hover:text-[#1A1A1A] transition-colors">
            <Info className="w-4 h-4" />
            <span>Docs</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-md text-sm font-semibold hover:bg-[#374151] transition-all shadow-sm">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Scrollable controls */}
        <aside className="w-[420px] bg-white border-r border-[#E5E7EB] flex flex-col h-full shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
            {sidebar}
          </div>
          <div className="p-4 border-t border-[#E5E7EB] bg-white text-[10px] text-[#9CA3AF] uppercase tracking-widest text-center font-bold">
            Released under MIT License • Open Source
          </div>
        </aside>

        {/* Right Preview - Centered content */}
        <section className="flex-1 bg-[#F3F4F6] relative overflow-hidden flex flex-col items-center justify-center p-12">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">
            {preview}
          </div>
          
          {/* Bottom Bar info */}
          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-xs font-mono text-[#6B7280] shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Real-time Sync Active</span>
            </div>
            <div className="flex gap-4">
               <button className="p-2 bg-white border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:text-[#1A1A1A] shadow-sm transition-all hover:scale-110">
                 <Monitor className="w-4 h-4" />
               </button>
            </div>
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}} />
    </div>
  );
};
