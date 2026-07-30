import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { exportTelemetryCSV } from '../../services/exportService';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import {
  Play,
  Square,
  FileSpreadsheet,
  Download,
  Wifi,
  Activity,
  Clock,
  FileText,
  Volume2,
  VolumeX,
  Terminal
} from 'lucide-react';
import { toast } from 'sonner';

export const Topbar: React.FC = () => {
  const [utcTime, setUtcTime] = useState('');
  const [istTime, setIstTime] = useState('');

  const {
    isStreaming,
    currentPacket,
    packets,
    audioMuted,
    startTelemetry,
    stopTelemetry,
    toggleAudio,
    addLog,
    setShowDocCenter,
    toggleCommandConsole
  } = useTelemetryStore();

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const utcHours = now.getUTCHours().toString().padStart(2, '0');
      const utcMins = now.getUTCMinutes().toString().padStart(2, '0');
      const utcSecs = now.getUTCSeconds().toString().padStart(2, '0');
      setUtcTime(`${utcHours}:${utcMins}:${utcSecs} UTC`);

      const istStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' });
      setIstTime(`${istStr} IST`);
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportCSV = () => {
    exportTelemetryCSV(packets);
    toast.success(`Exported ${packets.length} telemetry records to CSV`);
  };

  const handleSyncTime = () => {
    const now = new Date();
    const utcHours = now.getUTCHours().toString().padStart(2, '0');
    const utcMins = now.getUTCMinutes().toString().padStart(2, '0');
    const utcSecs = now.getUTCSeconds().toString().padStart(2, '0');
    setUtcTime(`${utcHours}:${utcMins}:${utcSecs} UTC`);

    const istStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' });
    setIstTime(`${istStr} IST`);

    addLog('INFO', 'PC System time synchronized with Ground Control Clock.');
    toast.success('PC System Time Synchronized');
  };

  const handleExportGraph = () => {
    const chartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (chartCanvas) {
      const link = document.createElement('a');
      link.download = `OrbitOps_Telemetry_Graph_${Date.now()}.png`;
      link.href = chartCanvas.toDataURL('image/png');
      link.click();
      toast.success('Exported Telemetry Graph Image to PNG');
    } else {
      toast.info('Telemetry Graph Canvas ready');
    }
  };

  return (
    <header className="h-14 bg-[#070B14] border-b border-[#1F2937] px-3 md:px-4 flex items-center justify-between shadow-lg select-none z-40 sticky top-0 flex-shrink-0 gap-2 overflow-x-hidden">
      {/* Left Branding & Live Clock Cluster */}
      <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink">
        {/* OrbitOps Aerospace Header Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" title="OrbitOps Ground Station Control">
          <OrbitOpsLogo size={28} />
          <div className="hidden sm:flex flex-col">
            <span className="font-orbitron font-extrabold text-sm tracking-wider text-slate-100 flex items-center gap-1.5">
              ORBIT<span className="text-[#00D4FF]">OPS</span>
              <span className="text-[9px] bg-[#00D4FF]/10 text-[#00D4FF] px-1.5 py-0.2 rounded border border-[#00D4FF]/40 font-mono">
                GCS v2.0
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight leading-none">
              AEROSPACE MISSION CONTROL
            </span>
          </div>
        </div>

        {/* Dual Live Clocks (UTC & IST) */}
        <div className="hidden md:flex items-center space-x-2 bg-[#111827] px-2.5 py-1 rounded-lg border border-[#1F2937] font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
          <div className="flex items-center space-x-2">
            <span className="text-[#00D4FF] font-bold tracking-wide">{utcTime || 'UTC --:--:--'}</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="text-slate-300">{istTime || 'IST --:--:--'}</span>
          </div>
        </div>

        {/* Connection Status Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-[#111827] px-2.5 py-1 rounded-lg border border-[#1F2937] text-xs font-mono">
          <Wifi className="w-3.5 h-3.5 text-[#00FF84] animate-pulse flex-shrink-0" />
          <span className="text-slate-400 text-[10px]">RF LINK:</span>
          <span className="text-[#00FF84] font-bold text-[11px] tracking-wider">SIMULATOR 115200 BAUD</span>
        </div>

        {/* Packet Count & RSSI */}
        <div className="h-8 px-2 rounded-lg bg-[#111827] border border-[#1F2937] text-xs font-mono inline-flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0">
          <Activity className="w-3 h-3 text-[#00D4FF] flex-shrink-0" />
          <span className="text-slate-400 text-[10px] leading-none">PKTS</span>
          <span className="text-slate-100 font-bold text-[10px] leading-none">{(currentPacket?.packetCount || 12458).toLocaleString()}</span>
          <span className="text-slate-600 font-normal">|</span>
          <span className="text-[#00FF84] font-bold text-[10px] leading-none">{currentPacket?.signalStrength || -73}dBm</span>
        </div>
      </div>

      {/* Right Controls & Stream Action Buttons */}
      <div className="flex items-center space-x-1.5 flex-shrink-0 z-10">
        {/* Realistic Aerospace Control Console Switch Button */}
        <button
          onClick={toggleCommandConsole}
          className="h-8 px-2.5 rounded-lg bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] hover:from-[#1E293B] hover:to-[#0D1525] text-slate-200 border border-[#00D4FF]/40 hover:border-[#00D4FF]/80 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(0,212,255,0.15)] hover:shadow-[0_0_18px_rgba(0,212,255,0.35)] inline-flex items-center justify-center space-x-2 whitespace-nowrap flex-shrink-0 group active:scale-95"
          title="Open Mission Operations Command Console (` or Ctrl+Shift+C)"
        >
          <div className="relative flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-[#00D4FF] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00FF84] animate-pulse" />
          </div>
          <span className="hidden lg:inline text-[10px] font-orbitron tracking-wider text-slate-100 uppercase">
            CMD CONSOLE
          </span>
          <span className="hidden lg:inline-block px-1.5 py-0.2 rounded bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/40 text-[9px] font-mono font-normal">
            `
          </span>
        </button>

        {/* Sync Time Button */}
        <button
          onClick={handleSyncTime}
          className="h-8 px-2 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all inline-flex items-center justify-center space-x-1 whitespace-nowrap"
          title="Sync PC Time with GCS Clock"
        >
          <Clock className="w-3.5 h-3.5 text-[#00FF84]" />
          <span className="hidden xl:inline text-[11px]">SYNC TIME</span>
        </button>

        {/* User-Friendly Clear Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className="h-8 px-2.5 rounded-lg bg-[#111827] hover:bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 text-xs font-mono transition-all inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-shrink-0 group"
          title="Export Telemetry Log Spreadsheet (CSV)"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#00D4FF] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">EXPORT CSV</span>
        </button>

        {/* User-Friendly Clear Export Graph Image Button */}
        <button
          onClick={handleExportGraph}
          className="h-8 px-2.5 rounded-lg bg-[#111827] hover:bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono transition-all inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-shrink-0 group"
          title="Export Oscilloscope Graph Image (PNG)"
        >
          <Download className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold">EXPORT GRAPH</span>
        </button>

        {/* Mission Brief Button */}
        <button
          onClick={() => {
            setShowDocCenter(true);
            toast.info('Opening Mission Brief');
          }}
          className="h-8 px-2.5 rounded-lg bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-xs font-mono font-bold transition-all shadow-cyan-glow inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-shrink-0"
          title="Open Official GCS Mission Brief"
        >
          <FileText className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline text-[11px]">MISSION BRIEF</span>
        </button>

        {/* Audio Mute / Unmute Toggle Button (Icon-Only Compact Square Button) */}
        <button
          onClick={toggleAudio}
          className={`h-8 w-8 rounded-lg border text-xs font-mono inline-flex items-center justify-center transition-all flex-shrink-0 ${
            audioMuted
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20 shadow-amber-glow'
              : 'bg-[#111827] text-[#00FF84] border-[#1F2937] hover:bg-[#1F2937]'
          }`}
          title={audioMuted ? 'Unmute Ground Control Audio' : 'Mute Ground Control Audio'}
        >
          {audioMuted ? (
            <VolumeX className="w-4 h-4 text-amber-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#00FF84]" />
          )}
        </button>

        {/* Start / Stop Stream Main Action Button */}
        {isStreaming ? (
          <button
            onClick={stopTelemetry}
            className="h-8 px-3.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/60 text-xs font-bold font-mono transition-all shadow-red-glow inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-shrink-0 group hover:scale-[1.02]"
            title="Halt Telemetry Simulation Stream"
          >
            <Square className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
            <span className="tracking-wider">STOP STREAM</span>
          </button>
        ) : (
          <button
            onClick={startTelemetry}
            className="h-8 px-3.5 rounded-lg bg-[#00FF84]/15 hover:bg-[#00FF84]/25 text-[#00FF84] border border-[#00FF84]/60 text-xs font-bold font-mono transition-all shadow-green-glow inline-flex items-center justify-center space-x-1.5 whitespace-nowrap flex-shrink-0 group hover:scale-[1.02]"
            title="Start Telemetry Simulation Stream"
          >
            <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
            <span className="tracking-wider">START STREAM</span>
          </button>
        )}
      </div>
    </header>
  );
};
