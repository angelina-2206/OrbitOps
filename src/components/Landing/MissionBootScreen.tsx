import React, { useState, useEffect } from 'react';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import {
  Rocket,
  ShieldCheck,
  Cpu,
  Wifi,
  Activity,
  Play,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Layers,
  Box,
  MapPin,
  LineChart,
  Terminal,
  Database,
  Radio,
  Sliders,
  FileSpreadsheet,
  Download,
  BookOpen,
  FileText
} from 'lucide-react';

interface MissionBootScreenProps {
  onComplete: () => void;
}

export const MissionBootScreen: React.FC<MissionBootScreenProps> = ({ onComplete }) => {
  const { setShowDocCenter } = useTelemetryStore();
  const [bootSequenceComplete, setBootSequenceComplete] = useState<boolean>(false);
  const [bootStep, setBootStep] = useState<number>(0);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [launchProgress, setLaunchProgress] = useState<number>(0);
  const [launchStep, setLaunchStep] = useState<number>(0);
  const [utcTime, setUtcTime] = useState<string>('');

  const preBootLogs = [
    'Initializing OrbitOps Core Engine...',
    'Loading Telemetry Ingestion Bus...',
    'Loading Navigation & GIS Subsystems...',
    'Initializing WebGL 3D Kinematics Renderer...',
    'Mission Control Platform Ready.'
  ];

  const launchLogs = [
    'Initializing OrbitOps Flight Modules...',
    'Checking Sensor Array & Telemetry Bus...',
    'Calibrating Leaflet GIS Spatial Mapping Engine...',
    'Synchronizing WebGL 3D Attitude Model...',
    'MISSION CONTROL READY - ENTERING DASHBOARD...'
  ];

  // Pre-boot sequence timer (2s splash loading on first mount)
  useEffect(() => {
    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev < preBootLogs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => setBootSequenceComplete(true), 350);
          return prev;
        }
      });
    }, 350);

    const clockTimer = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(clockTimer);
    };
  }, []);

  const handleLaunch = () => {
    setIsLaunching(true);
    let progress = 0;
    let step = 0;

    const interval = setInterval(() => {
      progress += 20;
      setLaunchProgress(progress);
      if (step < launchLogs.length - 1) {
        step += 1;
        setLaunchStep(step);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 350);
  };

  // Keyboard 'Enter' key shortcut to launch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && bootSequenceComplete && !isLaunching) {
        handleLaunch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootSequenceComplete, isLaunching]);

  const scrollToFeatures = () => {
    document.getElementById('landing-features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050811] text-slate-100 font-space overflow-y-auto custom-scrollbar select-none">
      {/* Background Starfield & Subtle Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0B1E3B] via-[#050811] to-[#020307] opacity-90 z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] z-0 pointer-events-none" />

      {/* Rotating Background Orbital Rings */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#00D4FF]/10 pointer-events-none z-0 animate-spin-slow opacity-25 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border border-dashed border-[#00FF84]/15" />
        <div className="w-[400px] h-[400px] rounded-full border border-[#FFC857]/10" />
      </div>

      {/* Pre-Boot Initializing Screen */}
      <AnimatePresence>
        {!bootSequenceComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050811] flex flex-col items-center justify-center space-y-6 font-mono p-6 text-center"
          >
            <div className="p-4 rounded-3xl bg-[#0C1220] border border-[#00D4FF]/40 shadow-cyan-glow animate-pulse">
              <OrbitOpsLogo size={80} />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-xl text-slate-100 tracking-wider">
                ORBIT<span className="text-[#00D4FF]">OPS</span> GCS
              </h2>
              <p className="text-xs text-slate-400 mt-1">INITIALIZING MISSION CONTROL SYSTEMS...</p>
            </div>

            {/* Pre-boot Status Box */}
            <div className="bg-[#0C1220] border border-[#1F2937] px-4 py-3 rounded-xl max-w-sm w-full space-y-2 text-xs shadow-2xl">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#00D4FF] font-bold font-orbitron">BOOT SEQUENCE</span>
                <span className="text-[#00FF84] font-bold">{Math.min(100, (bootStep + 1) * 20)}%</span>
              </div>
              <div className="w-full bg-[#111827] h-1.5 rounded-full overflow-hidden border border-[#1F2937]">
                <div
                  className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF84] transition-all duration-300"
                  style={{ width: `${(bootStep + 1) * 20}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-300 text-left font-mono min-h-[1.25rem] flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-pulse" />
                <span>{preBootLogs[bootStep]}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Layout Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 md:p-6 max-w-6xl mx-auto space-y-12">
        {/* Header System Badges */}
        <header className="w-full flex items-center justify-between border-b border-[#1F2937]/80 pb-3">
          <div className="flex items-center space-x-3">
            <OrbitOpsLogo size={34} />
            <div>
              <h1 className="font-orbitron font-bold text-base md:text-lg text-slate-100 tracking-wider flex items-center gap-2">
                ORBIT<span className="text-[#00D4FF]">OPS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-semibold font-mono">
                  GCS v2.0
                </span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase hidden sm:block">
                MISSION OPERATIONS PLATFORM
              </p>
            </div>
          </div>

          {/* System Badges & Navigation Buttons Strip */}
          <div className="flex items-center space-x-2 font-mono text-[10px]">
            <button
              onClick={() => setShowDocCenter(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 font-orbitron font-bold flex items-center gap-1.5 transition-all shadow-cyan-glow hover:scale-105 group"
            >
              <FileText className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>MISSION BRIEF</span>
            </button>
            <span className="px-2 py-1 rounded bg-[#0C1220] border border-[#1F2937] text-slate-300 hidden md:flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF84]" /> SIMULATION MODE
            </span>
            <span className="px-2 py-1 rounded bg-[#0C1220] border border-[#1F2937] text-slate-300 hidden lg:flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#00D4FF]" /> WEB SERIAL READY
            </span>
            <span className="px-2 py-1 rounded bg-[#0C1220] border border-[#1F2937] text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {utcTime || '12:00:00 UTC'}
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-6 py-4 my-auto">
          {/* Prominent OrbitOps Focal Emblem */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-1"
          >
            <div className="p-5 rounded-3xl bg-[#0C1220]/90 border border-[#00D4FF]/40 shadow-cyan-glow relative group">
              <OrbitOpsLogo size={84} />
            </div>
          </motion.div>

          <div>
            <h2 className="font-orbitron font-extrabold text-3xl md:text-5xl text-slate-100 tracking-wider leading-tight">
              MISSION CONTROL SOFTWARE
            </h2>
            <p className="text-[#00D4FF] font-orbitron font-semibold text-xs md:text-sm tracking-widest mt-1 uppercase">
              Designed for Modern CanSat & CubeSat Operations
            </p>
            <p className="text-slate-400 text-xs md:text-sm font-mono max-w-3xl mx-auto mt-3 leading-relaxed px-4">
              OrbitOps GCS is a simulation-first Ground Control Software platform developed to emulate the operational workflow of CanSat and CubeSat missions. It provides real-time telemetry visualization, mission diagnostics, GIS-based tracking, interactive 3D attitude monitoring, and a scalable architecture for future hardware integration through Web Serial APIs.
            </p>
          </div>

          {/* Feature Capability Checkmark Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 font-mono text-[11px] text-slate-300 py-2 border-y border-[#1F2937]/80 max-w-3xl mx-auto">
            <span className="flex items-center gap-1 text-[#00FF84]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Telemetry Simulation
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-[#00D4FF]">
              <CheckCircle2 className="w-3.5 h-3.5" /> GIS Mission Tracking
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-[#FFC857]">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3D CubeSat Attitude
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-[#00FF84]">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4-Digit Error Diagnostics
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-[#00D4FF]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Web Serial Ready
            </span>
          </div>

          {/* Animated Feature Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-left max-w-4xl mx-auto pt-2">
            {/* Card 1 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-4 rounded-2xl space-y-3 hover:border-[#00D4FF]/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-start justify-between gap-2 border-b border-[#1F2937]/80 pb-2.5">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#070B14] border border-[#00D4FF]/40 p-1 flex items-center justify-center shadow-cyan-glow flex-shrink-0 text-[#00D4FF]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M 12 3 L 20 7 L 20 17 L 12 21 L 4 17 L 4 7 Z" strokeWidth="1.5" />
                      <line x1="12" y1="3" x2="12" y2="12" />
                      <line x1="4" y1="7" x2="12" y2="12" />
                      <line x1="20" y1="7" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider font-mono">PAYLOAD ARCHITECTURE</p>
                    <p className="text-slate-100 font-orbitron font-bold text-xs truncate mt-0.5">CANSAT & CUBESAT</p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30 font-bold flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF84] animate-pulse" /> Initialized
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">TM/TC Telecommand Bus Processing</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-4 rounded-2xl space-y-3 hover:border-[#00D4FF]/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-start justify-between gap-2 border-b border-[#1F2937]/80 pb-2.5">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#070B14] border border-[#00D4FF]/40 p-1 flex items-center justify-center shadow-cyan-glow flex-shrink-0 text-[#00D4FF]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M 3 3 L 3 21 L 21 21" strokeWidth="1.5" />
                      <path d="M 3 17 Q 8 7 13 13 T 21 7" stroke="#00D4FF" strokeWidth="1.8" fill="none" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider font-mono">VISUALIZATION ENGINE</p>
                    <p className="text-slate-100 font-orbitron font-bold text-xs truncate mt-0.5">GIS & 3D WEBGL</p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-bold flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" /> Rendering Active
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">Real-Time Trajectory & Euler Attitude</p>
            </div>

            {/* Card 3 (Amber Accent) */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-4 rounded-2xl space-y-3 hover:border-[#FFC857]/50 transition-all duration-300 shadow-lg group">
              <div className="flex items-start justify-between gap-2 border-b border-[#1F2937]/80 pb-2.5">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#070B14] border border-[#FFC857]/40 p-1 flex items-center justify-center shadow-amber-glow flex-shrink-0 text-[#FFC857]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5" />
                      <path d="M 9 2 L 9 5 M 15 2 L 15 5 M 9 19 L 9 22 M 15 19 L 15 22 M 2 9 L 5 9 M 2 15 L 5 15 M 19 9 L 22 9 M 19 15 L 22 15" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="2" fill="#FFC857" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider font-mono">HARDWARE INTERFACE</p>
                    <p className="text-slate-100 font-orbitron font-bold text-xs truncate mt-0.5">WEB SERIAL API</p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30 font-bold flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC857] animate-pulse" /> Standby
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">ESP32 / Arduino / LoRa RF Receivers</p>
            </div>
          </div>

          {/* Small System Stats Strip */}
          <div className="grid grid-cols-5 gap-2 max-w-3xl mx-auto font-mono text-center">
            <div className="bg-[#0C1220]/60 border border-[#1F2937] py-2 px-2 rounded-xl">
              <p className="text-[9px] text-slate-500">TELEMETRY PARAMS</p>
              <p className="font-orbitron font-bold text-sm text-[#00D4FF]">18</p>
            </div>
            <div className="bg-[#0C1220]/60 border border-[#1F2937] py-2 px-2 rounded-xl">
              <p className="text-[9px] text-slate-500">SUPPORTED SENSORS</p>
              <p className="font-orbitron font-bold text-sm text-[#00FF84]">12</p>
            </div>
            <div className="bg-[#0C1220]/60 border border-[#1F2937] py-2 px-2 rounded-xl">
              <p className="text-[9px] text-slate-500">VIS MODULES</p>
              <p className="font-orbitron font-bold text-sm text-[#FFC857]">7</p>
            </div>
            <div className="bg-[#0C1220]/60 border border-[#1F2937] py-2 px-2 rounded-xl">
              <p className="text-[9px] text-slate-500">COMMANDS</p>
              <p className="font-orbitron font-bold text-sm text-purple-400">6</p>
            </div>
            <div className="bg-[#0C1220]/60 border border-[#1F2937] py-2 px-2 rounded-xl">
              <p className="text-[9px] text-slate-500">FRAME RATE</p>
              <p className="font-orbitron font-bold text-sm text-[#00FF84]">60 FPS</p>
            </div>
          </div>

          {/* Launch & Mission Brief CTA Buttons */}
          <div className="pt-2 max-w-xl mx-auto space-y-3">
            {!isLaunching ? (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button
                  onClick={handleLaunch}
                  className="flex-1 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#00FF84]/15 via-[#00FF84]/25 to-[#00D4FF]/15 hover:from-[#00FF84]/25 hover:to-[#00D4FF]/25 text-slate-100 border border-[#00FF84]/60 font-orbitron font-bold text-xs md:text-sm tracking-widest flex items-center justify-center space-x-2.5 transition-all duration-300 shadow-green-glow group hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-current text-[#00FF84] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  <span className="whitespace-nowrap">LAUNCH MISSION CONTROL</span>
                  <ChevronRight className="w-4 h-4 text-[#00FF84] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </button>
                <button
                  onClick={() => setShowDocCenter(true)}
                  className="flex-1 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#00D4FF]/15 via-[#00D4FF]/25 to-[#3B82F6]/15 hover:from-[#00D4FF]/25 hover:to-[#3B82F6]/25 text-slate-100 border border-[#00D4FF]/60 font-orbitron font-bold text-xs md:text-sm tracking-widest flex items-center justify-center space-x-2.5 transition-all duration-300 shadow-cyan-glow group hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4 text-[#00D4FF] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  <span className="whitespace-nowrap">MISSION BRIEF</span>
                  <ChevronRight className="w-4 h-4 text-[#00D4FF] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </button>
              </div>
            ) : (
              <div className="bg-[#0C1220] border border-[#00D4FF]/40 rounded-xl p-4 space-y-3 font-mono text-xs shadow-cyan-glow animate-fadeIn">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#00D4FF] font-bold font-orbitron">INITIALIZING ORBITOPS...</span>
                  <span className="text-[#00FF84] font-bold">{launchProgress}%</span>
                </div>

                <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#1F2937]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF84] transition-all duration-300"
                    style={{ width: `${launchProgress}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-300 text-left font-mono min-h-[1.25rem] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-pulse" />
                  <span>{launchLogs[launchStep]}</span>
                </p>
              </div>
            )}

            {/* Scroll Down Indicator */}
            {!isLaunching && (
              <button
                onClick={scrollToFeatures}
                className="flex flex-col items-center space-y-1 mx-auto text-slate-500 hover:text-[#00D4FF] transition-colors pt-2 group cursor-pointer"
              >
                <span className="text-[10px] font-mono tracking-wider">SCROLL DOWN TO EXPLORE PLATFORM ARCHITECTURE</span>
                <ChevronDown className="w-4 h-4 text-[#00D4FF] animate-bounce" />
              </button>
            )}
          </div>
        </section>

        {/* Scrollable Section 2: Detailed Platform Capabilities Grid */}
        <section id="landing-features-section" className="pt-12 pb-6 space-y-6 border-t border-[#1F2937]/80">
          <div className="text-center space-y-2">
            <h3 className="font-orbitron font-bold text-2xl text-slate-100 tracking-wider">
              SYSTEM ARCHITECTURE & CAPABILITIES
            </h3>
            <p className="text-slate-400 font-mono text-xs max-w-xl mx-auto">
              Modular Ground Station software components built for real-time aerospace telemetry ingestion, spatial tracking, and flight diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs text-left">
            {/* Capability 1 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-2.5 hover:border-[#00D4FF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00D4FF]/40 p-1.5 flex items-center justify-center shadow-cyan-glow text-[#00D4FF]">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="1 1" />
                  <path d="M 2 16 L 7 16 L 10 7 L 14 25 L 18 11 L 21 19 L 24 16 L 30 16" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="18" cy="11" r="1.8" fill="#00FF84" />
                </svg>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">1Hz Telemetry Ingestion</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Processes altitude, lapse rate, barometric pressure, ambient temperature, humidity, battery voltage, and 12-sat GPS coordinate feeds.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-2.5 hover:border-[#00D4FF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00FF84]/40 p-1.5 flex items-center justify-center shadow-green-glow text-[#00FF84]">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
                  <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
                  <circle cx="16" cy="16" r="2.5" fill="#00FF84" />
                </svg>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">Leaflet GIS Spatial Map</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Interactive Leaflet map with dark vector layers, active flight trajectory polyline, real-time CanSat marker, and predicted landing ellipse.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-2.5 hover:border-[#00D4FF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#FFC857]/40 p-1.5 flex items-center justify-center shadow-amber-glow text-[#FFC857]">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M 16 4 L 27 10 L 27 22 L 16 28 L 5 22 L 5 10 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="16" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="5" y1="10" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="27" y1="10" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">Three.js 3D Kinematics</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Real-time WebGL 3D orientation viewer rendering Roll, Pitch, and Yaw Euler angles inside a space starfield environment.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-2.5 hover:border-[#00D4FF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-purple-500/40 p-1.5 flex items-center justify-center shadow-purple-glow text-purple-400">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="5" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="#070B14" />
                  <path d="M 8 12 L 14 12 M 8 16 L 20 16 M 8 20 L 16 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="20" cy="12" r="1.5" fill="#00FF84" />
                </svg>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">4-Digit Diagnostic Codes</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Standardized D1 D2 D3 D4 hexadecimal diagnostic code generator monitoring descent rate, GPS fix, payload separation, and battery status.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-2.5 hover:border-[#00D4FF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00D4FF]/40 p-1.5 flex items-center justify-center shadow-cyan-glow text-[#00D4FF]">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
                  <circle cx="16" cy="16" r="4" strokeDasharray="1 1" />
                  <circle cx="16" cy="16" r="2" fill="#00D4FF" />
                </svg>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">Web Serial API Interface</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Native USB COM port interface for hardware receivers (Arduino, ESP32, LoRa) streaming telemetry @ 115200 baud.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-2.5 hover:border-[#00D4FF]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00FF84]/40 p-1.5 flex items-center justify-center shadow-green-glow text-[#00FF84]">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M 16 4 L 16 20 M 16 20 L 10 14 M 16 20 L 22 14" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 6 24 L 26 24" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">Audit Logs & Data Export</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Real-time timestamped event audit log feed with CSV telemetry log export and PNG canvas chart export functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Scrollable Section 3: Flight Profile Stages */}
        <section className="py-8 space-y-6 border-t border-[#1F2937]/80">
          <div className="text-center space-y-2">
            <h3 className="font-orbitron font-bold text-2xl text-slate-100 tracking-wider">
              MISSION FLIGHT PROFILE STAGES
            </h3>
            <p className="text-slate-400 font-mono text-xs max-w-xl mx-auto">
              Automated stage tracking across high-altitude balloon release, ascent, payload separation, descent, and touchdown.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-[#00D4FF] font-bold">STAGE 01</span>
              <p className="font-orbitron font-bold text-slate-100">LAUNCH</p>
              <p className="text-slate-500 text-[10px]">T+ 00:00:00</p>
            </div>
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-[#00FF84] font-bold">STAGE 02</span>
              <p className="font-orbitron font-bold text-slate-100">ASCENT</p>
              <p className="text-slate-500 text-[10px]">Lapse Rate Active</p>
            </div>
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-[#FFC857] font-bold">STAGE 03</span>
              <p className="font-orbitron font-bold text-slate-100">APOGEE</p>
              <p className="text-slate-500 text-[10px]">Max Altitude Peak</p>
            </div>
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-purple-400 font-bold">STAGE 04</span>
              <p className="font-orbitron font-bold text-slate-100">DESCENT</p>
              <p className="text-slate-500 text-[10px]">Parachute Ejected</p>
            </div>
            <div className="bg-[#0C1220]/90 border border-[#1F2937] p-3 rounded-xl space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] text-[#00FF84] font-bold">STAGE 05</span>
              <p className="font-orbitron font-bold text-slate-100">TOUCHDOWN</p>
              <p className="text-slate-500 text-[10px]">Beacon Active</p>
            </div>
          </div>
        </section>

        {/* Scrollable Section 4: Secondary Launch CTA */}
        <section className="py-8 text-center space-y-4 bg-[#0C1220]/60 border border-[#00D4FF]/30 rounded-2xl p-6 shadow-cyan-glow">
          <OrbitOpsLogo size={48} />
          <h3 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
            READY TO OPERATE MISSION CONTROL?
          </h3>
          <p className="text-slate-400 font-mono text-xs max-w-md mx-auto">
            Click launch to enter the full-featured GCS operator dashboard with real-time telemetry streaming and map tracking.
          </p>

          <div className="max-w-xs mx-auto pt-2">
            <button
              onClick={handleLaunch}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 via-[#00FF84]/20 to-[#00D4FF]/20 hover:from-[#00D4FF]/30 hover:to-[#00FF84]/30 text-slate-100 border border-[#00FF84]/50 font-orbitron font-bold text-xs tracking-widest flex items-center justify-center space-x-2 transition-all duration-300 shadow-green-glow group hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current text-[#00FF84]" />
              <span>ENTER OPERATOR DASHBOARD</span>
              <ChevronRight className="w-4 h-4 text-[#00D4FF]" />
            </button>
          </div>
        </section>

        {/* Commercial Aerospace Footer Attribution */}
        <footer className="w-full flex flex-col md:flex-row items-center justify-between border-t border-[#1F2937]/80 pt-4 text-[10px] font-mono text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-orbitron font-bold text-slate-300">OrbitOps GCS v2.0</span>
            <span>•</span>
            <span className="text-slate-400">Simulation Framework</span>
            <span>•</span>
            <span className="text-slate-500 hidden sm:inline">Built with React • TypeScript • Three.js • Leaflet • Chart.js</span>
          </div>
          <div className="text-slate-400">
            © 2026 Angelina Chatterjee • India Space Lab Internship
          </div>
        </footer>
      </div>
    </div>
  );
};
