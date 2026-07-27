import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { Wifi, X, Cpu, Radio, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface CommsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommsModal: React.FC<CommsModalProps> = ({ isOpen, onClose }) => {
  const { connectionMode, setConnectionMode, currentPacket, addLog } = useTelemetryStore();
  const [selectedPort, setSelectedPort] = useState<string>('COM3 - ESP32 Transceiver');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [wsUrl, setWsUrl] = useState<string>('ws://localhost:8080/telemetry');

  if (!isOpen) return null;

  const handleConnectHardware = () => {
    setConnectionMode('SERIAL');
    toast.success(`Connected to hardware on ${selectedPort} @ ${baudRate} baud`);
    addLog('SUCCESS', `Web Serial connection opened on ${selectedPort}.`);
    onClose();
  };

  const handleConnectWebSocket = () => {
    setConnectionMode('WEBSOCKET');
    toast.success(`WebSocket Gateway connected to ${wsUrl}`);
    addLog('SUCCESS', `WebSocket connection established with ${wsUrl}.`);
    onClose();
  };

  const handleSwitchSimulator = () => {
    setConnectionMode('SIMULATOR');
    toast.info('Switched telemetry source to Flight Dynamics Simulator');
    addLog('INFO', 'Telemetry source set to built-in simulator.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none animate-fadeIn">
      <div className="bg-[#0C1220] border border-[#00D4FF]/40 rounded-xl max-w-lg w-full p-5 shadow-2xl shadow-cyan-glow space-y-4 font-space">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
          <div className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-[#00D4FF]" />
            <h2 className="font-orbitron font-bold text-sm text-slate-100 tracking-wider">
              COMMS & TELEMETRY TRANSCEIVER
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#111827]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Badge */}
        <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-lg flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px]">CURRENT TRANSCEIVER MODE</span>
            <p className="font-orbitron font-bold text-sm text-[#00FF84] mt-0.5">
              {connectionMode}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px]">RSSI / SIGNAL</p>
            <p className="font-bold text-[#00D4FF] mt-0.5">
              {currentPacket?.signalStrength || -73} dBm (STRONG)
            </p>
          </div>
        </div>

        {/* Mode 1: Web Serial COM Hardware */}
        <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-lg space-y-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#00D4FF]" />
            <h3 className="font-orbitron font-bold text-xs text-slate-200">WEB SERIAL USB / HARDWARE COM</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-slate-400 text-[10px]">SERIAL PORT</label>
              <select
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                className="w-full bg-[#070B14] border border-[#1F2937] text-slate-200 rounded p-1.5 outline-none mt-1"
              >
                <option value="COM3 - ESP32 Transceiver">COM3 - ESP32 (NRF24L01)</option>
                <option value="COM4 - Arduino Uno RF">COM4 - Arduino Uno (LoRa)</option>
                <option value="COM7 - STM32 Ground Node">COM7 - STM32 Ground Node</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[10px]">BAUD RATE</label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                className="w-full bg-[#070B14] border border-[#1F2937] text-slate-200 rounded p-1.5 outline-none mt-1"
              >
                <option value={115200}>115200 bps</option>
                <option value={57600}>57600 bps</option>
                <option value={9600}>9600 bps</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleConnectHardware}
            className="w-full py-2 rounded bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border border-[#00D4FF]/40 font-orbitron font-bold text-xs transition-all shadow-cyan-glow"
          >
            CONNECT SERIAL HARDWARE
          </button>
        </div>

        {/* Mode 2: WebSocket Network Gateway */}
        <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-lg space-y-2">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <h3 className="font-orbitron font-bold text-xs text-slate-200">WEBSOCKET NETWORK GATEWAY</h3>
          </div>
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="w-full bg-[#070B14] border border-[#1F2937] text-slate-200 font-mono text-xs rounded p-1.5 outline-none"
          />
          <button
            onClick={handleConnectWebSocket}
            className="w-full py-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-orbitron font-bold text-xs transition-all"
          >
            CONNECT WEBSOCKET GATEWAY
          </button>
        </div>

        {/* Simulator Option */}
        <button
          onClick={handleSwitchSimulator}
          className="w-full py-2 rounded bg-[#00FF84]/10 hover:bg-[#00FF84]/20 text-[#00FF84] border border-[#00FF84]/30 font-orbitron font-bold text-xs transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>SWITCH TO FLIGHT SIMULATOR</span>
        </button>
      </div>
    </div>
  );
};
