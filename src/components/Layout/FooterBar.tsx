import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const FooterBar: React.FC = () => {
  const { isStreaming, currentPacket } = useTelemetryStore();

  return (
    <footer className="h-7 bg-[#070B14] border-t border-[#1F2937] px-4 flex items-center justify-between font-mono text-[11px] text-slate-400 select-none flex-shrink-0 z-30">
      <div className="flex items-center space-x-4">
        <span className="font-orbitron font-semibold text-slate-300">OrbitOps GCS v2.0.0</span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Operator:</span>
          <span className="text-slate-200 font-semibold">Team OrbitOps</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#00FF84] animate-pulse' : 'bg-amber-400'}`} />
          <span className={isStreaming ? 'text-[#00FF84]' : 'text-amber-400'}>
            {isStreaming ? 'System Nominal' : 'Stream Paused'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 hidden md:flex">
          <span className="w-2 h-2 rounded-full bg-[#00FF84]" />
          <span className="text-slate-300">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};
