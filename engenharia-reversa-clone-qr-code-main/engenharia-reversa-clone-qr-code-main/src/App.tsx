/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MainLayout } from './components/Layout/MainLayout';

export default function App() {
  return (
    <MainLayout
      sidebar={
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#9CA3AF] mb-4">Main Options</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-[#4B5563] ml-1">Data / URL</label>
                <input 
                  type="text" 
                  placeholder="https://google.com"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/5 focus:border-[#1A1A1A] transition-all"
                />
              </div>
            </div>
          </section>
          
          <div className="pt-4 border-t border-[#F3F4F6] text-[11px] text-[#9CA3AF] italic">
            More options coming soon...
          </div>
        </div>
      }
      preview={
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/50 backdrop-blur-sm">
             <div className="w-[300px] h-[300px] bg-[#F9FAFB] border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center">
               <span className="text-sm font-medium text-[#9CA3AF] uppercase tracking-widest">QR Preview Area</span>
             </div>
          </div>
          
          <div className="flex gap-3">
             <button className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#374151] transition-all active:scale-95">
               Download PNG
             </button>
             <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-lg text-sm font-bold shadow-sm hover:bg-[#F9FAFB] transition-all active:scale-95">
               Export SVG
             </button>
          </div>
        </div>
      }
    />
  );
}

