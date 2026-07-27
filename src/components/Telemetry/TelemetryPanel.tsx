import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { formatMissionTime } from '../../utils/formatters';
import { motion } from 'framer-motion';
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
  Activity
} from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const { currentPacket, connectionMode } = useTelemetryStore();

  if (!currentPacket) return null;

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#00D4FF]" />
          <h2 className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            TELEMETRY OVERVIEW
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 px-1.5 py-0.5 rounded border border-[#00D4FF]/30">
          1Hz
        </span>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="space-y-2 text-xs">
        {/* Mission Time Hero Card */}
        <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono">MISSION TIME (T+)</p>
              <p className="font-orbitron font-bold text-xl text-[#00D4FF] tracking-wider">
                {formatMissionTime(currentPacket.missionTime)}
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] space-y-0.5">
            <p className="text-slate-400">MISSION MODE</p>
            <p className="text-[#00FF84] font-bold">{connectionMode}</p>
            <p className="text-slate-400 mt-1">STATE</p>
            <p className="text-[#00FF84] font-bold">{currentPacket.missionState}</p>
          </div>
        </div>

        {/* 2-Column Metric Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Altitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-[#00D4FF]" /> ALTITUDE
              </span>
            </div>
            <p className="font-orbitron font-bold text-lg text-slate-100">
              {currentPacket.altitude} <span className="text-xs font-normal text-slate-400">m</span>
            </p>
            <p className="text-[9px] font-mono text-slate-500">MAX: {currentPacket.maxAltitude}m</p>
          </div>

          {/* Descent Rate */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5 text-[#00FF84]" /> DESCENT RATE
              </span>
            </div>
            <p className={`font-orbitron font-bold text-lg ${currentPacket.descentRate > 15 ? 'text-red-400' : 'text-[#00FF84]'}`}>
              {currentPacket.descentRate} <span className="text-xs font-normal text-slate-400">m/s</span>
            </p>
          </div>

          {/* Barometric Pressure */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Gauge className="w-3.5 h-3.5 text-amber-400" /> PRESSURE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
            </p>
          </div>

          {/* Temperature */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" /> TEMPERATURE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.temperature} <span className="text-xs font-normal text-slate-400">°C</span>
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Droplets className="w-3.5 h-3.5 text-[#00D4FF]" /> HUMIDITY
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.humidity} <span className="text-xs font-normal text-slate-400">%</span>
            </p>
          </div>

          {/* Battery Voltage */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> BATTERY VOLTAGE
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
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#00FF84]" /> GPS LATITUDE
            </div>
            <p className="font-orbitron font-bold text-sm text-[#00D4FF]">
              {currentPacket.gpsLatitude}°
            </p>
          </div>

          {/* GPS Longitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#00FF84]" /> GPS LONGITUDE
            </div>
            <p className="font-orbitron font-bold text-sm text-[#00D4FF]">
              {currentPacket.gpsLongitude}°
            </p>
          </div>

          {/* GPS Altitude */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Gauge className="w-3.5 h-3.5 text-[#00D4FF]" /> GPS ALTITUDE
            </div>
            <p className="font-orbitron font-bold text-base text-slate-100">
              {currentPacket.gpsAltitude} <span className="text-xs font-normal text-slate-400">m</span>
            </p>
          </div>

          {/* GPS Satellites */}
          <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
              <Satellite className="w-3.5 h-3.5 text-[#00FF84]" /> GPS SATS
            </div>
            <p className="font-orbitron font-bold text-base text-[#00FF84]">
              {currentPacket.satelliteCount} <span className="text-xs font-normal text-slate-400">/ 12</span>
            </p>
          </div>
        </div>

        {/* Roll, Pitch, Yaw Orientation Card */}
        <div className="bg-[#111827] border border-[#1F2937] p-2.5 rounded-lg space-y-1.5">
          <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#00D4FF]" /> ROLL / PITCH / YAW
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="bg-[#0A0F1A] py-1.5 rounded border border-[#1F2937]">
              <p className="text-[9px] text-slate-500">ROLL</p>
              <p className="font-orbitron font-bold text-sm text-slate-100">{currentPacket.roll}°</p>
            </div>
            <div className="bg-[#0A0F1A] py-1.5 rounded border border-[#1F2937]">
              <p className="text-[9px] text-slate-500">PITCH</p>
              <p className="font-orbitron font-bold text-sm text-slate-100">{currentPacket.pitch}°</p>
            </div>
            <div className="bg-[#0A0F1A] py-1.5 rounded border border-[#1F2937]">
              <p className="text-[9px] text-slate-500">YAW</p>
              <p className="font-orbitron font-bold text-sm text-slate-100">{currentPacket.yaw}°</p>
            </div>
          </div>
        </div>

        {/* Signal Strength & SNR */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-lg">
            <p className="text-[9px] text-slate-400 flex items-center gap-1">
              <Wifi className="w-3 h-3 text-[#00FF84]" /> SIGNAL STRENGTH
            </p>
            <p className="font-orbitron font-bold text-xs text-[#00FF84] mt-0.5">STRONG</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-lg">
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
