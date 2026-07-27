import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { formatMissionTime } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gauge,
  Thermometer,
  Droplets,
  Zap,
  MapPin,
  Compass,
  ArrowDown,
  Clock,
  Layers,
  Satellite,
  Wifi,
  Activity,
  ShieldCheck
} from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const { currentPacket, connectionMode } = useTelemetryStore();

  if (!currentPacket) return null;

  // Threshold status styling helper
  const getDescentColor = (rate: number) => {
    if (rate > 15) return 'text-red-400 border-red-500/40 bg-red-500/10 animate-pulse';
    if (rate > 10) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-[#00FF84] border-[#1F2937] bg-[#111827]';
  };

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#00D4FF]" />
          <h2 className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            PRIMARY TELEMETRY HUB
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/30 font-bold">
          1Hz REAL-TIME
        </span>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="space-y-2 text-xs">
        {/* Mission Time Hero Card */}
        <div className="bg-[#111827] border border-[#00D4FF]/40 p-3 rounded-xl flex items-center justify-between shadow-cyan-glow relative overflow-hidden">
          <div className="flex items-center space-x-3 relative z-10">
            <div className="p-2.5 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/40">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">MISSION ELAPSED TIME</p>
              <p className="font-orbitron font-extrabold text-2xl text-[#00D4FF] tracking-wider">
                {formatMissionTime(currentPacket.missionTime)}
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] space-y-0.5 relative z-10">
            <p className="text-slate-400">STATE</p>
            <p className="text-[#00FF84] font-orbitron font-bold text-xs bg-[#00FF84]/10 px-2 py-0.5 rounded border border-[#00FF84]/30">
              {currentPacket.missionState}
            </p>
          </div>
        </div>

        {/* 2-Column Metric Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Primary Altitude Hero Metric */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1 relative overflow-hidden group hover:border-[#00D4FF]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-[#00D4FF]" /> ALTITUDE
              </span>
              <span className="text-[9px] text-slate-500">MAX: {currentPacket.maxAltitude}m</span>
            </div>
            <motion.p
              key={currentPacket.altitude}
              initial={{ scale: 0.96, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-orbitron font-extrabold text-xl text-slate-100"
            >
              {currentPacket.altitude} <span className="text-xs font-normal text-slate-400">m</span>
            </motion.p>
          </div>

          {/* Descent Rate with Threshold Status */}
          <div className={`p-2.5 rounded-xl space-y-1 border transition-all ${getDescentColor(currentPacket.descentRate)}`}>
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" /> DESCENT RATE
              </span>
            </div>
            <motion.p
              key={currentPacket.descentRate}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="font-orbitron font-bold text-xl"
            >
              {currentPacket.descentRate} <span className="text-xs font-normal text-slate-400">m/s</span>
            </motion.p>
          </div>

          {/* Barometric Pressure */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Gauge className="w-3.5 h-3.5 text-amber-400" /> PRESSURE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
            </p>
          </div>

          {/* Temperature */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" /> TEMPERATURE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.temperature} <span className="text-xs font-normal text-slate-400">°C</span>
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Droplets className="w-3.5 h-3.5 text-[#00D4FF]" /> HUMIDITY
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.humidity} <span className="text-xs font-normal text-slate-400">%</span>
            </p>
          </div>

          {/* Battery Voltage */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> BATTERY
              </span>
              <span className="text-amber-400 font-bold">{currentPacket.batteryPercentage}%</span>
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.batteryVoltage} <span className="text-xs font-normal text-slate-400">V</span>
            </p>
            <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 ${
                  currentPacket.batteryPercentage > 50
                    ? 'bg-[#00FF84]'
                    : currentPacket.batteryPercentage > 20
                    ? 'bg-amber-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${currentPacket.batteryPercentage}%` }}
              />
            </div>
          </div>

          {/* GPS Latitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#00FF84]" /> GPS LATITUDE
            </div>
            <p className="font-orbitron font-bold text-sm text-[#00D4FF]">
              {currentPacket.gpsLatitude}°
            </p>
          </div>

          {/* GPS Longitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#00FF84]" /> GPS LONGITUDE
            </div>
            <p className="font-orbitron font-bold text-sm text-[#00D4FF]">
              {currentPacket.gpsLongitude}°
            </p>
          </div>

          {/* GPS Altitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Gauge className="w-3.5 h-3.5 text-[#00D4FF]" /> GPS ALTITUDE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.gpsAltitude} <span className="text-xs font-normal text-slate-400">m</span>
            </p>
          </div>

          {/* GPS Satellites */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Satellite className="w-3.5 h-3.5 text-[#00FF84]" /> GPS SATS
            </div>
            <p className="font-orbitron font-bold text-base text-[#00FF84]">
              {currentPacket.satelliteCount} <span className="text-xs font-normal text-slate-400">/ 12</span>
            </p>
          </div>
        </div>

        {/* Roll, Pitch, Yaw Orientation Card */}
        <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1.5">
          <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#00D4FF]" /> EULER ATTITUDE (R / P / Y)
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="bg-[#0A0F1A] py-1.5 rounded-lg border border-[#1F2937]">
              <p className="text-[9px] text-slate-500">ROLL</p>
              <p className="font-orbitron font-bold text-sm text-slate-100">{currentPacket.roll}°</p>
            </div>
            <div className="bg-[#0A0F1A] py-1.5 rounded-lg border border-[#1F2937]">
              <p className="text-[9px] text-slate-500">PITCH</p>
              <p className="font-orbitron font-bold text-sm text-slate-100">{currentPacket.pitch}°</p>
            </div>
            <div className="bg-[#0A0F1A] py-1.5 rounded-lg border border-[#1F2937]">
              <p className="text-[9px] text-slate-500">YAW</p>
              <p className="font-orbitron font-bold text-sm text-slate-100">{currentPacket.yaw}°</p>
            </div>
          </div>
        </div>

        {/* Signal Strength & SNR */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-xl">
            <p className="text-[9px] text-slate-400 flex items-center gap-1">
              <Wifi className="w-3 h-3 text-[#00FF84]" /> SIGNAL STRENGTH
            </p>
            <p className="font-orbitron font-bold text-xs text-[#00FF84] mt-0.5">STRONG</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-xl">
            <p className="text-[9px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#00D4FF]" /> SNR
            </p>
            <p className="font-orbitron font-bold text-xs text-slate-100 mt-0.5">16.4 dB</p>
          </div>
        </div>
      </div>
    </div>
  );
};
