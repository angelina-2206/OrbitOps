import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { formatMissionTime } from '../../utils/formatters';
import { motion } from 'framer-motion';

export const TelemetryPanel: React.FC = () => {
  const { currentPacket } = useTelemetryStore();

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
          <div className="w-5 h-5 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/30 p-0.5 flex items-center justify-center text-[#00D4FF]">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="4" rx="1" />
              <rect x="3" y="10" width="18" height="4" rx="1" />
              <rect x="3" y="16" width="18" height="4" rx="1" />
              <circle cx="6" cy="6" r="1" fill="#00D4FF" />
              <circle cx="6" cy="12" r="1" fill="#00FF84" />
              <circle cx="6" cy="18" r="1" fill="#FFC857" />
            </svg>
          </div>
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
            <div className="p-2 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/40 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeDasharray="1 1" />
                <path d="M 12 7 L 12 12 L 16 14" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="#00D4FF" />
              </svg>
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
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M 3 20 L 12 4 L 21 20 Z" strokeWidth="1.5" />
                  <line x1="8" y1="12" x2="16" y2="12" strokeWidth="1.5" />
                </svg>
                ALTITUDE
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
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M 12 3 L 12 21 M 12 21 L 6 15 M 12 21 L 18 15" strokeWidth="2" strokeLinecap="round" />
                </svg>
                DESCENT RATE
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
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                <path d="M 12 12 L 16 8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              PRESSURE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
            </p>
          </div>

          {/* Temperature */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 14 14.74 V 5 a 2 2 0 1 0 -4 0 v 9.74 a 4 4 0 1 0 4 0 Z" strokeWidth="1.5" />
              </svg>
              TEMPERATURE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.temperature} <span className="text-xs font-normal text-slate-400">°C</span>
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 12 2 C 12 2 5 10 5 15 C 5 18.8 8.1 22 12 22 C 15.9 22 19 18.8 19 15 C 19 10 12 2 12 2 Z" strokeWidth="1.5" />
              </svg>
              HUMIDITY
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.humidity} <span className="text-xs font-normal text-slate-400">%</span>
            </p>
          </div>

          {/* Battery Voltage */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M 13 2 L 4 14 L 11 14 L 10 22 L 20 10 L 13 10 Z" strokeWidth="1.5" />
                </svg>
                BATTERY
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
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeOpacity="0.4" />
                <circle cx="12" cy="12" r="2.5" fill="#00FF84" />
              </svg>
              GPS LATITUDE
            </div>
            <p className="font-orbitron font-bold text-sm text-[#00D4FF]">
              {currentPacket.gpsLatitude}°
            </p>
          </div>

          {/* GPS Longitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeOpacity="0.4" />
                <circle cx="12" cy="12" r="2.5" fill="#00FF84" />
              </svg>
              GPS LONGITUDE
            </div>
            <p className="font-orbitron font-bold text-sm text-[#00D4FF]">
              {currentPacket.gpsLongitude}°
            </p>
          </div>

          {/* GPS Altitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 3 20 L 12 4 L 21 20 Z" strokeWidth="1.5" />
              </svg>
              GPS ALTITUDE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.gpsAltitude} <span className="text-xs font-normal text-slate-400">m</span>
            </p>
          </div>

          {/* GPS Satellites */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 12 3 L 20 7 L 20 17 L 12 21 L 4 17 L 4 7 Z" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="2" fill="#00FF84" />
              </svg>
              GPS SATS
            </div>
            <p className="font-orbitron font-bold text-base text-[#00FF84]">
              {currentPacket.satelliteCount} <span className="text-xs font-normal text-slate-400">/ 12</span>
            </p>
          </div>
        </div>

        {/* Roll, Pitch, Yaw Orientation Card */}
        <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-xl space-y-1.5">
          <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" strokeWidth="1.2" />
              <path d="M 12 3 L 12 12 L 17 12" strokeWidth="1.5" />
            </svg>
            EULER ATTITUDE (R / P / Y)
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
            <p className="text-[9px] text-slate-400 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
                <circle cx="12" cy="12" r="4" strokeDasharray="1 1" />
                <circle cx="12" cy="12" r="2" fill="#00FF84" />
              </svg>
              SIGNAL STRENGTH
            </p>
            <p className="font-orbitron font-bold text-xs text-[#00FF84] mt-0.5">STRONG</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-xl">
            <p className="text-[9px] text-slate-400 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 3 17 Q 8 6 13 13 T 21 7" stroke="#00D4FF" strokeWidth="1.8" fill="none" />
              </svg>
              SNR
            </p>
            <p className="font-orbitron font-bold text-xs text-slate-100 mt-0.5">16.4 dB</p>
          </div>
        </div>
      </div>
    </div>
  );
};
