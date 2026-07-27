import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { User, ShieldCheck, MapPin, Activity, Clock, X, Cpu } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { packets, currentPacket } = useTelemetryStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none animate-fadeIn">
      <div className="bg-[#0C1220] border border-[#00D4FF]/40 rounded-xl max-w-md w-full p-5 shadow-2xl shadow-cyan-glow space-y-4 font-space">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#00D4FF]" />
            <h2 className="font-orbitron font-bold text-sm text-slate-100 tracking-wider">
              OPERATOR PROFILE & GROUND STATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#111827]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operator Badge Card */}
        <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-lg flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/40 flex items-center justify-center text-[#00D4FF] font-orbitron font-bold text-lg shadow-cyan-glow">
            TO
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-base text-slate-100">Team OrbitOps</h3>
            <p className="text-xs font-mono text-[#00FF84] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> LEAD FLIGHT CONTROLLER
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">ID: GCS-INDIA-01 | CLEARANCE: LEVEL 5</p>
          </div>
        </div>

        {/* Station Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00D4FF]" /> BASE LOCATION
            </span>
            <p className="font-bold text-slate-200 mt-1">SHAR Spaceport</p>
            <p className="text-[9px] text-slate-500">13.7199°N, 80.2304°E</p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#00FF84]" /> RECORDED PACKETS
            </span>
            <p className="font-bold text-[#00FF84] mt-1">{packets.length} Packets</p>
            <p className="text-[9px] text-slate-500">1Hz Telemetry Loop</p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> MAX ALTITUDE
            </span>
            <p className="font-bold text-slate-100 mt-1">{currentPacket?.maxAltitude || 1050} m</p>
            <p className="text-[9px] text-slate-500">Apogee Record</p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" /> SOFTWARE BUILD
            </span>
            <p className="font-bold text-purple-400 mt-1">OrbitOps v2.0.0</p>
            <p className="text-[9px] text-slate-500">React + Three.js + Leaflet</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] font-orbitron font-bold text-xs transition-all"
        >
          CLOSE OPERATOR PROFILE
        </button>
      </div>
    </div>
  );
};
