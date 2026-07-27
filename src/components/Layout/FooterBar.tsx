import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import { ShieldCheck, User, Radio, Cpu } from 'lucide-react';

export const FooterBar: React.FC = () => {
  const { isStreaming, currentPacket, connectionMode } = useTelemetryStore();

  return (
    <footer className="h-7 bg-[#070B14] border-t border-[#1F2937] px-4 flex items-center justify-between font-mono text-[11px] text-slate-400 select-none flex-shrink-0 z-30 w-full">
      {/* Left: Version & Build Info */}
      <div className="flex items-center space-x-3">
        <span className="font-orbitron font-bold text-slate-200 tracking-wider flex items-center gap-1.5 text-xs">
          <OrbitOpsLogo size={18} />
          ORBIT<span className="text-[#00D4FF]">OPS</span> GCS
          <span className="text-[10px] text-[#00D4FF] bg-[#00D4FF]/10 px-1.5 py-0.2 rounded border border-[#00D4FF]/30 font-mono font-normal">
            v2.0.0
          </span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline flex items-center gap-1">
          <Cpu className="w-3 h-3 text-[#00D4FF]" /> MODE: <span className="text-slate-200 font-bold">{connectionMode}</span>
        </span>
      </div>

      {/* Right: Operator & Operational Status */}
      <div className="flex items-center space-x-4">
        {/* Operator Badge */}
        <div className="flex items-center space-x-1.5 bg-[#111827] px-2.5 py-0.5 rounded border border-[#1F2937]">
          <User className="w-3 h-3 text-[#00D4FF]" />
          <span className="text-slate-400 text-[10px]">Operator:</span>
          <span className="text-slate-100 font-semibold font-orbitron text-[10px] tracking-wide">
            Team OrbitOps
          </span>
        </div>

        {/* Streaming Status */}
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#00FF84] animate-pulse' : 'bg-amber-400'}`} />
          <span className={`font-bold text-[10px] tracking-wide ${isStreaming ? 'text-[#00FF84]' : 'text-amber-400'}`}>
            {isStreaming ? 'SYSTEM NOMINAL' : 'STREAM PAUSED'}
          </span>
        </div>

        {/* All Systems Operational */}
        <div className="hidden lg:flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00FF84]" />
          <span className="text-slate-300 text-[10px]">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};

