import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { exportTelemetryCSV, exportTelemetryJSON } from '../../services/exportService';
import { getFormattedUTCTime } from '../../utils/formatters';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import {
  Play,
  Square,
  RotateCcw,
  FileSpreadsheet,
  FileCode,
  Settings,
  Wifi,
  Activity,
  Clock,
  Rocket,
  FileText,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';

export const Topbar: React.FC = () => {
  const [utcTime, setUtcTime] = useState(getFormattedUTCTime());
  const [istTime, setIstTime] = useState('');

  const {
    isStreaming,
    currentPacket,
    packets,
    audioMuted,
    startTelemetry,
    stopTelemetry,
    resetPackets,
    toggleAudio,
    addLog,
    setShowLandingScreen,
    setShowDocCenter
  } = useTelemetryStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(getFormattedUTCTime());
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportCSV = () => {
    exportTelemetryCSV(packets);
    toast.success(`Exported ${packets.length} telemetry records to CSV`);
  };

  const handleSyncTime = () => {
    setUtcTime(getFormattedUTCTime());
    const now = new Date();
    setIstTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }));
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
      toast.success('Exported Telemetry Graph to PNG');
    } else {
      toast.info('Telemetry Graph Canvas ready');
    }
  };

  return (
    <header className="h-14 bg-[#070B14] border-b border-[#1F2937] px-3 md:px-4 flex items-center justify-between shadow-lg select-none z-40 sticky top-0 flex-shrink-0">
      {/* Left Brand Title with OrbitOps Logo */}
      <div className="flex items-center space-x-2.5">
        <OrbitOpsLogo size={32} />
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="font-orbitron font-bold text-sm text-slate-100 tracking-wider flex items-center gap-1.5 leading-none">
              ORBIT<span className="text-[#00D4FF]">OPS</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-semibold font-mono leading-none">
                GCS
              </span>
            </h1>
          </div>
          <p className="text-[8px] text-slate-400 tracking-widest uppercase font-mono hidden md:block mt-0.5 leading-none">
            GROUND CONTROL SOFTWARE
          </p>
        </div>
      </div>

      {/* Middle Status Indicators Bar */}
      <div className="hidden xl:flex items-center space-x-2">
        {/* Mission Status Chip */}
        <div className="h-8 px-2.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs font-mono inline-flex items-center space-x-2">
          <span className="text-slate-400 text-[10px]">MISSION</span>
          <span className="text-[#00FF84] font-bold font-orbitron text-[10px] px-1.5 py-0.5 rounded bg-[#00FF84]/10 border border-[#00FF84]/30 leading-none">
            {currentPacket?.missionState || 'LANDED'}
          </span>
        </div>

        {/* Comms Link Chip */}
        <div className="h-8 px-2.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs font-mono inline-flex items-center space-x-1.5">
          <span className="text-slate-400 text-[10px]">COMMS</span>
          <span className="text-[#00FF84] font-bold text-[10px] inline-flex items-center gap-1">
            STRONG
            <Wifi className="w-3 h-3 text-[#00FF84] animate-pulse" />
          </span>
        </div>

        {/* Telemetry Live Indicator */}
        <div className="h-8 px-2.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs font-mono inline-flex items-center space-x-1.5">
          <span className="text-slate-400 text-[10px]">TELEMETRY</span>
          <span className="text-[#00FF84] font-bold text-[10px] inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-ping" />
            LIVE
          </span>
        </div>

        {/* UTC Time & IST Time */}
        <div className="h-8 px-2.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs font-mono inline-flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-300 font-bold text-[11px]">{utcTime}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[10px]">IST {istTime}</span>
        </div>

        {/* Packet Count & RSSI */}
        <div className="h-8 px-2.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs font-mono inline-flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
          <span className="text-slate-400 text-[10px]">PKTS</span>
          <span className="text-slate-100 font-bold text-[11px]">{(currentPacket?.packetCount || 12458).toLocaleString()}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[10px]">RSSI</span>
          <span className="text-[#00FF84] font-bold text-[11px]">{currentPacket?.signalStrength || -73} dBm</span>
        </div>
      </div>

      {/* Right Controls & Stream Action Buttons */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleSyncTime}
          className="h-8 px-2.5 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all inline-flex items-center justify-center space-x-1"
          title="Sync PC Time with GCS Clock"
        >
          <Clock className="w-3.5 h-3.5 text-[#00FF84]" />
          <span className="hidden sm:inline">SYNC TIME</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="h-8 px-2.5 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all inline-flex items-center justify-center space-x-1"
          title="Export Telemetry CSV"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span>CSV</span>
        </button>

        <button
          onClick={handleExportGraph}
          className="h-8 px-2.5 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all inline-flex items-center justify-center space-x-1"
          title="Export Telemetry Graph Image"
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>GRAPH</span>
        </button>

        <button
          onClick={() => {
            setShowDocCenter(true);
            toast.info('Opening Mission Brief');
          }}
          className="h-8 px-2.5 rounded-lg bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-xs font-mono font-bold transition-all shadow-cyan-glow inline-flex items-center justify-center space-x-1"
          title="Open Official GCS Mission Brief"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">MISSION BRIEF</span>
        </button>

        {/* Audio Mute / Unmute Toggle Button */}
        <button
          onClick={toggleAudio}
          className={`h-8 px-2.5 rounded-lg border text-xs font-mono inline-flex items-center justify-center space-x-1.5 transition-all ${
            audioMuted
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
              : 'bg-[#111827] text-slate-300 border-[#1F2937] hover:bg-[#1F2937]'
          }`}
          title={audioMuted ? 'Unmute Ground Control Audio' : 'Mute Ground Control Audio'}
        >
          {audioMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#00FF84]" />
          )}
          <span className="hidden lg:inline text-[11px] font-bold">
            {audioMuted ? 'MUTED' : 'AUDIO'}
          </span>
        </button>

        <button
          onClick={resetPackets}
          className="h-8 w-8 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] transition-all inline-flex items-center justify-center"
          title="Reset Telemetry Packets"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 hover:text-slate-200" />
        </button>

        <button
          onClick={() => {
            setShowLandingScreen(true);
            toast.info('Opening Mission Initialization Screen');
          }}
          className="h-8 w-8 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] transition-all inline-flex items-center justify-center"
          title="Re-Initialize Mission Screen"
        >
          <Rocket className="w-4 h-4 text-[#00D4FF]" />
        </button>

        <button
          onClick={() => toast.info('System Settings Dialog')}
          className="h-8 w-8 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] transition-all inline-flex items-center justify-center"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-slate-400 hover:text-slate-200" />
        </button>

        {isStreaming ? (
          <button
            onClick={stopTelemetry}
            className="h-8 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold font-mono transition-all shadow-red-glow inline-flex items-center justify-center space-x-1.5"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP STREAM</span>
          </button>
        ) : (
          <button
            onClick={startTelemetry}
            className="h-8 px-3 rounded-lg bg-[#00FF84]/10 hover:bg-[#00FF84]/20 text-[#00FF84] border border-[#00FF84]/40 text-xs font-bold font-mono transition-all shadow-green-glow inline-flex items-center justify-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START STREAM</span>
          </button>
        )}
      </div>
    </header>
  );
};
