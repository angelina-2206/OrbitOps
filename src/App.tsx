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

      {/* Floating Command Console Trigger Button (Bottom Right) */}
      {!showLandingScreen && (
        <button
          onClick={toggleCommandConsole}
          className="fixed bottom-10 right-4 z-40 h-9 px-3 rounded-full bg-[#0D1525]/90 hover:bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-xs font-mono font-bold shadow-cyan-glow flex items-center space-x-2 backdrop-blur-md transition-all hover:scale-105"
          title="Open Command Console (` or Ctrl+Shift+C)"
        >
          <Terminal className="w-4 h-4 text-[#00D4FF]" />
          <span className="hidden sm:inline">CMD CONSOLE [`]</span>
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

