import React, { useState, useEffect } from 'react';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import { Rocket, ShieldCheck, Cpu, Wifi, MapPin, Activity, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTelemetryStore } from '../../store/useTelemetryStore';

interface MissionBootScreenProps {
  onComplete: () => void;
}

export const MissionBootScreen: React.FC<MissionBootScreenProps> = ({ onComplete }) => {
  const [isBooting, setIsBooting] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [bootStep, setBootStep] = useState<number>(0);

  const bootLogs = [
    'Initializing Telemetry Packet Ingestion Engine...',
    'Establishing Ultra-High Frequency RF Link (UHF 433MHz @ 115200 Baud)...',
    'Loading GIS Spatial Vector Maps & Predicted Landing Radius Engine...',
    'Calibrating WebGL 3D CubeSat Kinematic Attitude Visualizer...',
    'MISSION CONTROL READY. ENTERING OPERATOR DASHBOARD...',
  ];

  const handleLaunch = () => {
    setIsBooting(true);
    let progress = 0;
    let step = 0;

    const interval = setInterval(() => {
      progress += 20;
      setBootProgress(progress);
      if (step < bootLogs.length - 1) {
        step += 1;
        setBootStep(step);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050811] text-slate-100 font-space flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      {/* Background Starfield & Subtle Orbital Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A1A30] via-[#050811] to-[#020308] opacity-90 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />

      {/* Top Header Branding */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-[#1F2937]/80 pb-4">
        <div className="flex items-center space-x-3">
          <OrbitOpsLogo size={36} />
          <div>
            <h1 className="font-orbitron font-bold text-lg text-slate-100 tracking-wider">
              ORBIT<span className="text-[#00D4FF]">OPS</span> <span className="text-xs text-[#00D4FF] px-2 py-0.5 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/30 font-semibold">GCS v2.0</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              INDIA SPACE LAB • CANSAT & CUBESAT GROUND CONTROL SOFTWARE
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400 bg-[#0C1220] px-3 py-1.5 rounded-lg border border-[#1F2937]">
            <Cpu className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#00FF84] bg-[#00FF84]/10 px-3 py-1.5 rounded-lg border border-[#00FF84]/30 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-ping" />
            <span>STANDBY FOR MISSION INITIALIZATION</span>
          </div>
        </div>
      </div>

      {/* Main Center Hero Section */}
      <div className="relative z-10 max-w-3xl w-full text-center space-y-6 my-auto">
        {/* Animated OrbitOps Emblemed Badge */}
        <div className="flex justify-center mb-2">
          <div className="p-4 rounded-3xl bg-[#0C1220] border border-[#00D4FF]/40 shadow-cyan-glow animate-pulse">
            <OrbitOpsLogo size={72} />
          </div>
        </div>

        <div>
          <h2 className="font-orbitron font-extrabold text-3xl md:text-4xl text-slate-100 tracking-wider leading-tight">
            MISSION OPERATIONS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-slate-100 to-[#00FF84]">
              REAL-TIME TELEMETRY. COMPLETE CONTROL.
            </span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-mono max-w-2xl mx-auto mt-3 leading-relaxed">
            Engineered for high-altitude balloon experiments, CanSat satellite launches, and CubeSat mission monitoring with high-frequency telemetry ingestion, 3D WebGL kinematics, and Leaflet GIS trajectory tracking.
          </p>
        </div>

        {/* Mission Details Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-left max-w-2xl mx-auto pt-2">
          <div className="bg-[#0C1220]/80 border border-[#1F2937] p-3 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-[#00D4FF] text-[10px] uppercase font-bold">
              <Rocket className="w-3.5 h-3.5" />
              <span>PAYLOAD MISSION</span>
            </div>
            <p className="text-slate-200 font-bold font-orbitron text-xs">CANSAT / CUBESAT</p>
            <p className="text-slate-500 text-[10px]">Dual Atmospheric Sensors</p>
          </div>

          <div className="bg-[#0C1220]/80 border border-[#1F2937] p-3 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-[#00FF84] text-[10px] uppercase font-bold">
              <Wifi className="w-3.5 h-3.5" />
              <span>RF TRANSCEIVER</span>
            </div>
            <p className="text-slate-200 font-bold font-orbitron text-xs">UHF 433 MHz / SERIAL</p>
            <p className="text-slate-500 text-[10px]">115200 Baud Packet Stream</p>
          </div>

          <div className="bg-[#0C1220]/80 border border-[#1F2937] p-3 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 text-[10px] uppercase font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>SPATIAL & KINEMATICS</span>
            </div>
            <p className="text-slate-200 font-bold font-orbitron text-xs">GIS & 3D WEBGL</p>
            <p className="text-slate-500 text-[10px]">Euler Roll/Pitch/Yaw Tracking</p>
          </div>
        </div>

        {/* Action Button & Booting Progress Container */}
        <div className="pt-4 max-w-md mx-auto">
          {!isBooting ? (
            <button
              onClick={handleLaunch}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 via-[#00FF84]/20 to-[#00D4FF]/20 hover:from-[#00D4FF]/30 hover:to-[#00FF84]/30 text-slate-100 border border-[#00FF84]/50 font-orbitron font-bold text-sm tracking-widest flex items-center justify-center space-x-3 transition-all duration-300 shadow-green-glow group hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 fill-current text-[#00FF84] group-hover:translate-x-1 transition-transform" />
              <span>LAUNCH MISSION CONTROL</span>
              <ChevronRight className="w-5 h-5 text-[#00D4FF]" />
            </button>
          ) : (
            <div className="bg-[#0C1220] border border-[#00D4FF]/40 rounded-xl p-4 space-y-3 font-mono text-xs shadow-cyan-glow animate-fadeIn">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#00D4FF] font-bold font-orbitron">SYSTEM BOOT IN PROGRESS</span>
                <span className="text-[#00FF84] font-bold">{bootProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#1F2937]">
                <div
                  className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF84] transition-all duration-300"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              {/* Boot Log Output */}
              <p className="text-[10px] text-slate-300 text-left font-mono min-h-[1.25rem] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-pulse" />
                <span>{bootLogs[bootStep]}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between border-t border-[#1F2937]/80 pt-3 text-[10px] font-mono text-slate-500">
        <div>GROUND STATION ARCHITECTURE • CANSAT GCS v2.0</div>
        <div>INDIA SPACE LAB ASSIGNMENT SPECIFICATION • ALL SYSTEMS NOMINAL</div>
      </div>
    </div>
  );
};
