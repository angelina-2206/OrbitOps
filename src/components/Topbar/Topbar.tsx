import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { exportTelemetryCSV, exportTelemetryJSON } from '../../services/exportService';
import { formatMissionTime, getFormattedUTCTime } from '../../utils/formatters';
import {
  Radio,
  Play,
  Square,
  RotateCcw,
  FileSpreadsheet,
  FileCode,
  Settings,
  Wifi,
  Activity,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export const Topbar: React.FC = () => {
  const [utcTime, setUtcTime] = useState(getFormattedUTCTime());
  const [istTime, setIstTime] = useState('');

  const {
    isStreaming,
    connectionMode,
    currentPacket,
    packets,
    audioMuted,
    startTelemetry,
    stopTelemetry,
    resetPackets,
    toggleAudio,
    addLog
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

  const handleExportJSON = () => {
    exportTelemetryJSON(packets);
    toast.success(`Exported ${packets.length} telemetry records to JSON`);
  };

  const handleSyncTime = () => {
    setUtcTime(getFormattedUTCTime());
    const now = new Date();
    setIstTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }));
    addLog('INFO', 'PC System time synchronized with Ground Control Clock.');
    toast.success('PC System Time Synchronized');
  };

  const handleExportGraph = () => {
    // Find canvas in DOM and export as image
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
    <header className="h-14 bg-[#070B14] border-b border-[#1F2937] px-4 flex items-center justify-between shadow-lg select-none z-40 sticky top-0 flex-shrink-0">
      {/* Left Brand Title */}
      <div className="flex items-center space-x-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-orbitron font-bold text-base text-slate-100 tracking-wider flex items-center gap-2">
              ORBIT<span className="text-[#00D4FF]">OPS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-semibold">
                GCS
              </span>
            </h1>
          </div>
          <p className="text-[9px] text-slate-400 tracking-wider uppercase font-mono hidden md:block">
            GROUND CONTROL SOFTWARE
          </p>
        </div>
      </div>

      {/* Middle Status Indicators Bar */}
      <div className="hidden xl:flex items-center space-x-3">
        {/* Mission Status Chip */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#111827] border border-[#1F2937] text-xs font-mono">
          <span className="text-slate-400 text-[10px]">MISSION STATUS</span>
          <span className="text-[#00FF84] font-bold font-orbitron text-[11px] px-1.5 py-0.5 rounded bg-[#00FF84]/10 border border-[#00FF84]/30">
            {currentPacket?.missionState || 'LANDED'}
          </span>
        </div>

        {/* Comms Link Chip */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#111827] border border-[#1F2937] text-xs font-mono">
          <span className="text-slate-400 text-[10px]">COMMS LINK</span>
          <span className="text-[#00FF84] font-bold flex items-center gap-1">
            STRONG
            <Wifi className="w-3 h-3 text-[#00FF84] animate-pulse" />
          </span>
        </div>

        {/* Telemetry Live Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#111827] border border-[#1F2937] text-xs font-mono">
          <span className="text-slate-400 text-[10px]">TELEMETRY</span>
          <span className="text-[#00FF84] font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-ping" />
            LIVE
          </span>
        </div>

        {/* UTC Time & IST Time */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-[#111827] border border-[#1F2937] text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300 font-bold">{utcTime}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[10px]">IST {istTime}</span>
        </div>

        {/* Packet Count & RSSI */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#111827] border border-[#1F2937] text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span className="text-slate-400 text-[10px]">PACKETS</span>
          <span className="text-slate-100 font-bold">{(currentPacket?.packetCount || 12458).toLocaleString()}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[10px]">RSSI</span>
          <span className="text-[#00FF84] font-bold">{currentPacket?.signalStrength || -73} dBm</span>
        </div>
      </div>

      {/* Right Controls & Stream Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleSyncTime}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all"
          title="Sync PC Time with GCS Clock"
        >
          <Clock className="w-3.5 h-3.5 text-[#00FF84]" />
          <span className="hidden sm:inline">SYNC TIME</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all"
          title="Export Telemetry CSV"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span>CSV</span>
        </button>

        <button
          onClick={handleExportGraph}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs font-mono transition-all"
          title="Export Telemetry Graph Image"
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>GRAPH</span>
        </button>

        <button
          onClick={resetPackets}
          className="p-1.5 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] transition-all"
          title="Reset Telemetry Packets"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 hover:text-slate-200" />
        </button>

        <button
          onClick={() => toast.info('System Settings Dialog')}
          className="p-1.5 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] transition-all"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-slate-400 hover:text-slate-200" />
        </button>

        {isStreaming ? (
          <button
            onClick={stopTelemetry}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold font-mono transition-all shadow-red-glow"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP STREAM</span>
          </button>
        ) : (
          <button
            onClick={startTelemetry}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#00FF84]/10 hover:bg-[#00FF84]/20 text-[#00FF84] border border-[#00FF84]/40 text-xs font-bold font-mono transition-all shadow-green-glow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START STREAM</span>
          </button>
        )}
      </div>
    </header>
  );
};
