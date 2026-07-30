import React from 'react';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { MissionBootScreen } from './components/Landing/MissionBootScreen';
import { DocumentationCenter } from './components/Documentation/DocumentationCenter';
import { CommandConsoleModal } from './components/Console/CommandConsoleModal';
import { useTelemetryStore } from './store/useTelemetryStore';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Terminal } from 'lucide-react';

export const App: React.FC = () => {
  const {
    showLandingScreen,
    setShowLandingScreen,
    showDocCenter,
    setShowDocCenter,
    toggleCommandConsole
  } = useTelemetryStore();

  return (
    <>
      {showLandingScreen ? (
        <MissionBootScreen onComplete={() => setShowLandingScreen(false)} />
      ) : (
        <DashboardLayout />
      )}

      {/* Realistic Aerospace Floating Console Trigger Module */}
      {!showLandingScreen && (
        <button
          onClick={toggleCommandConsole}
          className="fixed bottom-9 right-5 z-40 h-10 px-3.5 rounded-xl bg-[#080E1A]/95 hover:bg-[#0D1525] text-slate-100 border border-[#00D4FF]/50 hover:border-[#00D4FF] text-xs font-mono font-bold shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_30px_rgba(0,212,255,0.45)] flex items-center space-x-2.5 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group select-none"
          title="Open Mission Operations Console (` or Ctrl+Shift+C)"
        >
          <div className="relative flex items-center justify-center p-1.5 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30 group-hover:bg-[#00D4FF]/20 group-hover:border-[#00D4FF]/60 transition-all">
            <Terminal className="w-4 h-4 text-[#00D4FF] group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00FF84] animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-orbitron font-extrabold tracking-wider text-slate-100 leading-none">
              MOC CONSOLE
            </span>
            <span className="text-[8px] font-mono text-[#00D4FF] tracking-tight leading-none mt-0.5">
              SYS.CMD // READY
            </span>
          </div>
          <div className="ml-1 px-1.5 py-0.5 rounded bg-[#1E293B] border border-[#334155] text-[10px] font-mono text-[#00D4FF] shadow-inner">
            `
          </div>
        </button>
      )}

      <AnimatePresence>
        {showDocCenter && (
          <DocumentationCenter onClose={() => setShowDocCenter(false)} />
        )}
      </AnimatePresence>

      {/* Command Console Modal */}
      <CommandConsoleModal />

      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F8FAFC',
            border: '1px solid #1F2937',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </>
  );
};

export default App;

