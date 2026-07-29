import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Layers,
  Cpu,
  Activity,
  LineChart,
  MapPin,
  Box,
  Terminal,
  Radio,
  Download,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Zap,
  Globe,
  Sliders,
  FileCode,
  HardDrive,
  Sparkles,
  Server,
  Wifi,
  Database,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

interface DocumentationCenterProps {
  onClose: () => void;
}

export const DocumentationCenter: React.FC<DocumentationCenterProps> = ({ onClose }) => {
  const { showLandingScreen, setShowLandingScreen } = useTelemetryStore();
  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('acc-1');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [techStackFilter, setTechStackFilter] = useState<'ALL' | 'FRONTEND' | 'VIS' | 'STATE' | 'HARDWARE'>('ALL');

  const contentRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'sec-1', num: '01', title: 'Mission Brief', icon: BookOpen },
    { id: 'sec-2', num: '02', title: 'System Overview', icon: Layers },
    { id: 'sec-3', num: '03', title: 'Dashboard Modules', icon: Cpu },
    { id: 'sec-4', num: '04', title: 'Telemetry Flow', icon: Activity },
    { id: 'sec-5', num: '05', title: 'System Architecture', icon: Server },
    { id: 'sec-6', num: '06', title: 'Technology Stack', icon: Code },
    { id: 'sec-7', num: '07', title: 'Simulation Engine', icon: Zap },
    { id: 'sec-8', num: '08', title: 'Future Roadmap', icon: Sparkles },
    { id: 'sec-9', num: '09', title: 'About OrbitOps', icon: Globe },
    { id: 'sec-10', num: '10', title: 'Version Information', icon: ShieldCheck },
  ];

  // Scroll tracking to update active section sidebar link
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const scrollPos = contentRef.current.scrollTop + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sections[i].id);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordion((prev) => (prev === id ? null : id));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const sampleTelemetryJson = `{
  "timestamp": "2026-07-29T11:15:00.000Z",
  "missionTime": 142,
  "packetCount": 142,
  "missionState": "DESCENT",
  "altitude": 1485.4,
  "maxAltitude": 2840.0,
  "pressure": 845.2,
  "temperature": 18.3,
  "batteryVoltage": 7.92,
  "gpsLatitude": 13.7199,
  "gpsLongitude": 80.2304,
  "gpsAltitude": 1490,
  "satelliteCount": 12,
  "roll": 3.4,
  "pitch": -2.1,
  "yaw": 48.6,
  "descentRate": -7.8,
  "signalStrength": -68,
  "errorCode": "0000"
}`;

  const serialConfigCode = `// ESP32 / Arduino Serial Telemetry Packet Frame
void sendTelemetryPacket() {
  String packet = String(millis()/1000) + "," +
                 String(altitude) + "," +
                 String(pressure) + "," +
                 String(temperature) + "," +
                 String(voltage) + "," +
                 String(lat, 6) + "," +
                 String(lng, 6) + "," +
                 String(roll) + "," +
                 String(pitch) + "," +
                 String(yaw) + "," +
                 String(errorCode);
  Serial.println(packet); // 115200 Baud
}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] bg-[#050811] text-slate-100 font-space flex flex-col overflow-hidden select-none"
    >
      {/* Background Starfield Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0B1E3B] via-[#050811] to-[#020307] opacity-90 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <header className="relative z-20 h-16 bg-[#070B14]/95 border-b border-[#1F2937] px-4 md:px-6 flex items-center justify-between shadow-2xl flex-shrink-0 backdrop-blur-md">
        {/* Left: Back Button & Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0C1220] hover:bg-[#1E293B] text-slate-300 hover:text-[#00D4FF] border border-[#1F2937] hover:border-[#00D4FF]/40 text-xs font-mono font-semibold transition-all duration-200 shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#00D4FF] group-hover:-translate-x-0.5 transition-transform" />
            <span>BACK TO {showLandingScreen ? 'LANDING PAGE' : 'DASHBOARD'}</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400 border-l border-[#1F2937] pl-4">
            <OrbitOpsLogo size={22} />
            <span className="font-orbitron font-bold text-slate-200">ORBIT<span className="text-[#00D4FF]">OPS</span></span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF]">DOCUMENTATION CENTER</span>
            {activeSection && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-300 font-semibold uppercase">
                  {sections.find((s) => s.id === activeSection)?.title}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Middle: Search Filter Input */}
        <div className="relative hidden lg:block w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation specs..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0C1220] border border-[#1F2937] focus:border-[#00D4FF] text-xs font-mono text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-slate-200"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Right: Badge & Action */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-bold text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" /> OFFICIAL GCS SPEC v2.0
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0C1220] hover:bg-[#1F2937] text-slate-400 hover:text-slate-100 border border-[#1F2937]"
            title="Close Documentation"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main Body Grid: Left Sidebar Table of Contents + Right Content */}
      <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
        {/* Left TOC Navigation Sidebar (Desktop) */}
        <aside className="w-64 bg-[#070B14]/80 border-r border-[#1F2937] hidden lg:flex flex-col p-4 space-y-1 overflow-y-auto custom-scrollbar flex-shrink-0">
          <div className="px-3 pb-3 border-b border-[#1F2937]/80 mb-2">
            <p className="text-[10px] font-mono font-bold tracking-widest text-[#00D4FF] uppercase">
              DOCUMENTATION INDEX
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">OrbitOps Architecture Spec</p>
          </div>

          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/40 shadow-cyan-glow font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0C1220]'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`text-[10px] font-bold ${isActive ? 'text-[#00D4FF]' : 'text-slate-500'}`}>
                    {sec.num}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />}
              </button>
            );
          })}

          <div className="mt-auto pt-4 border-t border-[#1F2937]/80 text-[10px] font-mono text-slate-500 space-y-1.5 px-3">
            <div className="flex items-center justify-between">
              <span>HARDWARE BUS:</span>
              <span className="text-[#00FF84] font-bold">READY</span>
            </div>
            <div className="flex items-center justify-between">
              <span>BAUD RATE:</span>
              <span className="text-[#00D4FF] font-bold">115200 N-8-1</span>
            </div>
            <div className="flex items-center justify-between">
              <span>TELEMETRY:</span>
              <span className="text-[#FFC857] font-bold">1Hz STREAM</span>
            </div>
          </div>
        </aside>

        {/* Right Scrollable Main Documentation Content */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-16 custom-scrollbar scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-16 pb-16">

            {/* Top Banner Hero inside Doc Center */}
            <div className="bg-[#0C1220]/90 border border-[#00D4FF]/30 p-6 rounded-2xl relative overflow-hidden shadow-cyan-glow">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <OrbitOpsLogo size={180} />
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                    TECHNICAL REFERENCE DOCUMENTATION
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">|</span>
                  <span className="text-slate-400 font-mono text-[11px]">India Space Lab Internship</span>
                </div>
                <h1 className="font-orbitron font-extrabold text-2xl md:text-3xl text-slate-100 tracking-wider">
                  ORBIT<span className="text-[#00D4FF]">OPS</span> GCS MISSION CONTROL
                </h1>
                <p className="text-slate-300 font-mono text-xs leading-relaxed max-w-2xl">
                  Comprehensive system documentation, architectural overview, module breakdowns, data schemas, and hardware integration specifications for the OrbitOps Ground Control Software platform.
                </p>
              </div>
            </div>

            {/* SECTION 1: MISSION BRIEF */}
            <section id="sec-1" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-orbitron font-bold text-sm">
                  01
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    MISSION BRIEF
                  </h2>
                  <p className="text-xs text-[#00D4FF] font-mono">Platform Purpose & Scope</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-4 font-mono text-xs text-slate-300 leading-relaxed hover:border-[#00D4FF]/40 transition-colors">
                <p>
                  <strong className="text-slate-100 font-orbitron text-sm">OrbitOps GCS</strong> is a simulation-first Ground Control Software developed specifically for <strong className="text-[#00D4FF]">CanSat</strong> and <strong className="text-[#00FF84]">CubeSat</strong> aerospace missions. Built to replicate modern space mission control workflows, it gives operators full situational awareness during all flight phases: launch, ascent, apogee release, descent, and landing touchdown.
                </p>
                <div className="p-4 rounded-xl bg-[#070B14] border border-[#00D4FF]/30 space-y-2">
                  <div className="flex items-center space-x-2 text-[#00D4FF] font-bold font-orbitron text-xs">
                    <Radio className="w-4 h-4" />
                    <span>SIMULATION MODE & FUTURE HARDWARE ARCHITECTURE</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    The current release operates on realistic physics-based simulated telemetry while being architected from the ground up for seamless drop-in physical hardware integration using <strong className="text-slate-200">Web Serial APIs</strong>, <strong className="text-slate-200">ESP32</strong>, <strong className="text-slate-200">Arduino</strong>, and <strong className="text-slate-200">LoRa RF transceivers</strong>.
                  </p>
                </div>

                {/* Collapsible Accordion inside Section 1 */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleAccordion('acc-1')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#00D4FF]/40 transition-all text-xs font-mono text-slate-200"
                  >
                    <span className="flex items-center gap-2 font-bold font-orbitron">
                      <Zap className="w-3.5 h-3.5 text-[#00FF84]" />
                      SPECIFICATION: HARDWARE SERIAL BUS PROTOCOL
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#00D4FF] transition-transform ${expandedAccordion === 'acc-1' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedAccordion === 'acc-1' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#070B14] border border-t-0 border-[#1F2937] rounded-b-xl p-4 space-y-3"
                      >
                        <p className="text-[11px] text-slate-400">
                          The Web Serial API enables direct bi-directional USB COM port telemetry streaming from ESP32/Arduino receivers without requiring external server daemons:
                        </p>
                        <div className="relative">
                          <pre className="p-3 rounded-lg bg-[#050811] text-[11px] text-[#00FF84] overflow-x-auto border border-[#1F2937] font-mono">
                            {serialConfigCode}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(serialConfigCode, 'Arduino Serial Code')}
                            className="absolute right-2 top-2 px-2 py-1 rounded bg-[#111827] border border-[#1F2937] text-[10px] text-slate-300 hover:text-[#00D4FF] flex items-center gap-1"
                          >
                            {copiedSnippet === 'Arduino Serial Code' ? <Check className="w-3 h-3 text-[#00FF84]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSnippet === 'Arduino Serial Code' ? 'COPIED' : 'COPY'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* SECTION 2: SYSTEM OVERVIEW */}
            <section id="sec-2" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30 font-orbitron font-bold text-sm">
                  02
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    SYSTEM OVERVIEW
                  </h2>
                  <p className="text-xs text-[#00FF84] font-mono">End-to-End Operational Pipeline</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-6 font-mono text-xs text-slate-300 leading-relaxed hover:border-[#00FF84]/40 transition-colors">
                <p>
                  OrbitOps operates as a synchronized real-time ground station engine. Incoming sensor data (or generated telemetry packets) are parsed, validated against physical bounds, saved into global store state, and dispatched to visual render modules at 60 FPS.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-2">
                    <div className="flex items-center space-x-2 text-[#00D4FF] font-bold font-orbitron text-xs">
                      <Database className="w-4 h-4" />
                      <span>1. TELEMETRY ACQUISITION</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Acquires 18 sensor fields @ 1 Hz frequency including barometric pressure, lapse temperature, battery voltage, 12-sat GPS, and 3-axis Euler roll/pitch/yaw.
                    </p>
                  </div>

                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-2">
                    <div className="flex items-center space-x-2 text-[#00FF84] font-bold font-orbitron text-xs">
                      <Terminal className="w-4 h-4" />
                      <span>2. DATA PROCESSING & FAULT</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Calculates descent rate (m/s), max altitude peak, lapse rates, RSSI signal strength, and generates 4-digit hexadecimal diagnostic status codes.
                    </p>
                  </div>

                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-2">
                    <div className="flex items-center space-x-2 text-[#FFC857] font-bold font-orbitron text-xs">
                      <Layers className="w-4 h-4" />
                      <span>3. STATE MANAGEMENT</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Zustand state store holds up to 600 packets (~10 mins history), handles mission log streams, audio alerts, and telecommand state overrides.
                    </p>
                  </div>

                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-2">
                    <div className="flex items-center space-x-2 text-purple-400 font-bold font-orbitron text-xs">
                      <Activity className="w-4 h-4" />
                      <span>4. INTERACTIVE DASHBOARD</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Feeds Leaflet map trajectory, WebGL 3D orientation model, Chart.js trend lines, and telecommand panels with sub-millisecond reactivity.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: DASHBOARD MODULES */}
            <section id="sec-3" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30 font-orbitron font-bold text-sm">
                  03
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    DASHBOARD MODULES
                  </h2>
                  <p className="text-xs text-[#FFC857] font-mono">Detailed Subsystem Functionality Grid</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Module 1 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-[#00D4FF]/50 transition-all group">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00D4FF]/40 p-1.5 flex items-center justify-center shadow-cyan-glow flex-shrink-0 relative overflow-hidden group-hover:border-[#00D4FF] transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="1 1" />
                        <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="1 1" />
                        <path d="M 2 16 L 7 16 L 10 7 L 14 25 L 18 11 L 21 19 L 24 16 L 30 16" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="18" cy="11" r="1.8" fill="#00FF84" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">Telemetry Dashboard</h3>
                      <p className="text-[10px] text-slate-400">Live Parameter Monitor</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Displays live mission parameters including altitude, pressure, temperature, GPS, battery voltage, roll, pitch, yaw, and mission flight state.
                  </p>
                </div>

                {/* Module 2 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-[#00FF84]/50 transition-all group">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00FF84]/40 p-1.5 flex items-center justify-center shadow-green-glow flex-shrink-0 relative overflow-hidden group-hover:border-[#00FF84] transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M 4 4 L 4 28 L 28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 4 24 Q 10 6 16 16 T 28 8" stroke="#00FF84" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                        <path d="M 4 20 Q 12 26 18 12 T 28 18" stroke="#00D4FF" strokeWidth="1.2" strokeDasharray="2 2" strokeLinecap="round" fill="none" />
                        <circle cx="16" cy="16" r="1.8" fill="#00FF84" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">Real-Time Graphs</h3>
                      <p className="text-[10px] text-slate-400">Trend & Profile Charts</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Visualizes telemetry trends over time with continuously updating charts powered by Chart.js with pause and image export controls.
                  </p>
                </div>

                {/* Module 3 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-[#FFC857]/50 transition-all group">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#FFC857]/40 p-1.5 flex items-center justify-center shadow-amber-glow flex-shrink-0 relative overflow-hidden group-hover:border-[#FFC857] transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#FFC857]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
                        <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
                        <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
                        <path d="M 8 22 L 16 16 L 24 10" stroke="#00FF84" strokeWidth="1.5" strokeDasharray="2 1" />
                        <circle cx="16" cy="16" r="2.5" fill="#FFC857" stroke="#070B14" strokeWidth="1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">GIS Tracking</h3>
                      <p className="text-[10px] text-slate-400">Spatial Map Engine</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Shows the simulated flight path, launch location, current position, and predicted landing area using an interactive Leaflet vector map.
                  </p>
                </div>

                {/* Module 4 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-purple-500/50 transition-all group">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-purple-500/40 p-1.5 flex items-center justify-center shadow-purple-glow flex-shrink-0 relative overflow-hidden group-hover:border-purple-400 transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M 16 4 L 27 10 L 27 22 L 16 28 L 5 22 L 5 10 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <line x1="16" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="5" y1="10" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="27" y1="10" x2="16" y2="16" stroke="currentColor" strokeWidth="1.2" />
                        <ellipse cx="16" cy="16" rx="11" ry="5" stroke="#00D4FF" strokeWidth="1" strokeDasharray="2 1" transform="rotate(-20 16 16)" />
                        <circle cx="24" cy="14" r="1.5" fill="#00FF84" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">3D CubeSat Attitude</h3>
                      <p className="text-[10px] text-slate-400">WebGL Spatial Kinematics</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Displays the simulated orientation of the CubeSat using roll, pitch, and yaw Euler angle values rendered with WebGL & Three.js.
                  </p>
                </div>

                {/* Module 5 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-red-500/50 transition-all group">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-red-500/40 p-1.5 flex items-center justify-center shadow-red-glow flex-shrink-0 relative overflow-hidden group-hover:border-red-400 transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="#070B14" />
                        <line x1="4" y1="14" x2="28" y2="14" stroke="currentColor" strokeOpacity="0.4" />
                        <circle cx="10" cy="10" r="2" fill="#00FF84" />
                        <circle cx="16" cy="10" r="2" fill="#00D4FF" />
                        <circle cx="22" cy="10" r="2" fill="#EF4444" />
                        <line x1="8" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <rect x="15" y="17" width="5" height="6" rx="1" fill="#EF4444" stroke="#ffffff" strokeWidth="0.8" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">Mission Control</h3>
                      <p className="text-[10px] text-slate-400">Telecommand & Override</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Provides simulated commands such as Deploy Payload, Emergency Chute, Reconnect, Reset Mission, and Shutdown.
                  </p>
                </div>

                {/* Module 6 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-[#00D4FF]/50 transition-all group">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00D4FF]/40 p-1.5 flex items-center justify-center shadow-cyan-glow flex-shrink-0 relative overflow-hidden group-hover:border-[#00D4FF] transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M 4 9 L 4 4 L 9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 23 4 L 28 4 L 28 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 4 23 L 4 28 L 9 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 23 28 L 28 28 L 28 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="16" cy="16" r="7" stroke="#00D4FF" strokeWidth="1.5" />
                        <circle cx="16" cy="16" r="3" fill="#00D4FF" fillOpacity="0.3" stroke="#00FF84" strokeWidth="1" />
                        <circle cx="23" cy="9" r="1.5" fill="#EF4444" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">Optical Feed</h3>
                      <p className="text-[10px] text-slate-400">Payload Camera Interface</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Represents a simulated onboard camera interface with future support for real video camera streams and frame capture.
                  </p>
                </div>

                {/* Module 7 */}
                <div className="bg-[#0C1220]/90 border border-[#1F2937] p-5 rounded-2xl space-y-3 hover:border-[#00FF84]/50 transition-all group md:col-span-2">
                  <div className="flex items-center space-x-3 border-b border-[#1F2937]/80 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#070B14] border border-[#00FF84]/40 p-1.5 flex items-center justify-center shadow-green-glow flex-shrink-0 relative overflow-hidden group-hover:border-[#00FF84] transition-colors">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="4" y="5" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="#070B14" />
                        <path d="M 8 12 L 14 12 M 8 16 L 20 16 M 8 20 L 16 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="20" cy="12" r="1.5" fill="#00FF84" />
                        <circle cx="23" cy="16" r="1.5" fill="#00FF84" />
                        <circle cx="21" cy="20" r="1.5" fill="#00D4FF" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-slate-100">Diagnostics System</h3>
                      <p className="text-[10px] text-slate-400">4-Digit Hexadecimal Fault Monitor</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Displays health monitoring, subsystem status, communication quality (RSSI/SNR), and standardized 4-digit hexadecimal diagnostic error codes (e.g. D1=Sensors, D2=Comms, D3=Payload, D4=Power).
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 4: TELEMETRY FLOW */}
            <section id="sec-4" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-orbitron font-bold text-sm">
                  04
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    TELEMETRY FLOW
                  </h2>
                  <p className="text-xs text-[#00D4FF] font-mono">Modern Sequential Data Pipeline</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-6 font-mono text-xs">
                {/* Modern Visual Flow Diagram */}
                <div className="flex flex-col space-y-3">
                  {[
                    {
                      title: 'Telemetry Simulator',
                      desc: 'Generates 18 telemetry fields @ 1 Hz physics clock',
                      color: '#00D4FF',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
                          <circle cx="12" cy="12" r="4" strokeDasharray="1 1" />
                          <path d="M 12 2 L 12 22 M 2 12 L 22 12" strokeOpacity="0.5" />
                          <circle cx="12" cy="12" r="2" fill="#00D4FF" />
                        </svg>
                      )
                    },
                    {
                      title: 'Data Processing Engine',
                      desc: 'Validates bounds, computes lapse rates, & evaluates hex fault codes',
                      color: '#00FF84',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5" />
                          <path d="M 9 2 L 9 5 M 15 2 L 15 5 M 9 19 L 9 22 M 15 19 L 15 22 M 2 9 L 5 9 M 2 15 L 5 15 M 19 9 L 22 9 M 19 15 L 22 15" strokeWidth="1.5" />
                          <rect x="9" y="9" width="6" height="6" fill="#00FF84" fillOpacity="0.4" />
                        </svg>
                      )
                    },
                    {
                      title: 'Dashboard Modules',
                      desc: 'Ingests validated telemetry packet into Zustand global state store',
                      color: '#FFC857',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="4" width="18" height="4" rx="1" />
                          <rect x="3" y="10" width="18" height="4" rx="1" />
                          <rect x="3" y="16" width="18" height="4" rx="1" />
                          <circle cx="6" cy="6" r="1" fill="#FFC857" />
                          <circle cx="6" cy="12" r="1" fill="#00FF84" />
                          <circle cx="6" cy="18" r="1" fill="#00D4FF" />
                        </svg>
                      )
                    },
                    {
                      title: 'Graphs',
                      desc: 'Plots continuous time-series curves (Altitude, Temp, Volt)',
                      color: '#00D4FF',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 3 3 L 3 21 L 21 21" strokeWidth="1.5" />
                          <path d="M 3 18 Q 8 6 13 14 T 21 8" stroke="#00D4FF" strokeWidth="1.8" fill="none" />
                          <circle cx="13" cy="14" r="1.5" fill="#00FF84" />
                        </svg>
                      )
                    },
                    {
                      title: 'GIS Tracking',
                      desc: 'Updates Leaflet map position marker & predicted landing ellipse',
                      color: '#00FF84',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
                          <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.5" />
                          <line x1="3" y1="12" x2="21" y2="12" strokeOpacity="0.5" />
                          <circle cx="12" cy="12" r="2.5" fill="#00FF84" />
                        </svg>
                      )
                    },
                    {
                      title: '3D Visualization',
                      desc: 'Renders Euler roll/pitch/yaw orientation in Three.js WebGL canvas',
                      color: 'rgb(192, 132, 252)',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 12 3 L 20 7 L 20 17 L 12 21 L 4 17 L 4 7 Z" strokeWidth="1.5" />
                          <line x1="12" y1="3" x2="12" y2="12" />
                          <line x1="4" y1="7" x2="12" y2="12" />
                          <line x1="20" y1="7" x2="12" y2="12" />
                        </svg>
                      )
                    },
                    {
                      title: 'Diagnostics',
                      desc: 'Evaluates subsystem health metrics & triggers alarm audio beeps',
                      color: '#FFC857',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
                          <path d="M 7 10 L 11 10 M 7 14 L 17 14" strokeWidth="1.8" />
                          <circle cx="15" cy="10" r="1.2" fill="#FFC857" />
                        </svg>
                      )
                    },
                    {
                      title: 'Data Export',
                      desc: 'Exports timestamped telemetry records as CSV, JSON, or PNG graph',
                      color: '#00FF84',
                      svg: (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 12 3 L 12 15 M 12 15 L 7 10 M 12 15 L 17 10" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M 4 17 L 4 20 L 20 20 L 20 17" strokeWidth="1.5" />
                        </svg>
                      )
                    },
                  ].map((step, idx, arr) => {
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-full bg-[#070B14] border border-[#1F2937] hover:border-[#00D4FF]/50 p-4 rounded-xl flex items-center justify-between transition-all group shadow-md">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1F2937] flex items-center justify-center flex-shrink-0" style={{ color: step.color }}>
                              {step.svg}
                            </div>
                            <div className="min-w-0">
                              <p className="font-orbitron font-bold text-xs text-slate-100 group-hover:text-[#00D4FF] transition-colors truncate">
                                {step.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111827] border border-[#1F2937] text-slate-400">
                            STEP 0{idx + 1}
                          </span>
                        </div>

                        {idx < arr.length - 1 && (
                          <div className="my-1 flex flex-col items-center">
                            <div className="w-0.5 h-4 bg-gradient-to-b from-[#00D4FF] to-[#00FF84] animate-pulse" />
                            <ChevronDown className="w-3.5 h-3.5 text-[#00FF84] -mt-1" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Packet Structure Inspector Accordion */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleAccordion('acc-json')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#00D4FF]/40 transition-all text-xs font-mono text-slate-200"
                  >
                    <span className="flex items-center gap-2 font-bold font-orbitron text-[#00D4FF]">
                      <FileCode className="w-3.5 h-3.5" />
                      INSPECT LIVE TELEMETRY PACKET JSON SCHEMA
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#00D4FF] transition-transform ${expandedAccordion === 'acc-json' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedAccordion === 'acc-json' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#070B14] border border-t-0 border-[#1F2937] rounded-b-xl p-4 space-y-3"
                      >
                        <div className="relative">
                          <pre className="p-3 rounded-lg bg-[#050811] text-[11px] text-[#00D4FF] overflow-x-auto border border-[#1F2937] font-mono">
                            {sampleTelemetryJson}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(sampleTelemetryJson, 'JSON Packet Schema')}
                            className="absolute right-2 top-2 px-2 py-1 rounded bg-[#111827] border border-[#1F2937] text-[10px] text-slate-300 hover:text-[#00D4FF] flex items-center gap-1"
                          >
                            {copiedSnippet === 'JSON Packet Schema' ? <Check className="w-3 h-3 text-[#00FF84]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSnippet === 'JSON Packet Schema' ? 'COPIED' : 'COPY'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* SECTION 5: SYSTEM ARCHITECTURE */}
            <section id="sec-5" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 font-orbitron font-bold text-sm">
                  05
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    SYSTEM ARCHITECTURE
                  </h2>
                  <p className="text-xs text-purple-400 font-mono">Layered Software Schematic</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-6 font-mono text-xs">
                {/* Elegant Schematic Stack Diagram */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#070B14] border border-[#00D4FF]/30 space-y-2 relative">
                    <span className="text-[10px] text-[#00D4FF] font-bold font-orbitron uppercase tracking-widest">
                      LAYER 1: TELEMETRY GENERATOR
                    </span>
                    <p className="text-slate-100 font-orbitron font-bold text-xs">
                      1Hz Physics Simulator / Web Serial API Driver
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Generates or receives raw telemetry packet frames from hardware or physics engine.
                    </p>
                  </div>

                  <div className="w-full flex justify-center">
                    <ChevronDown className="w-4 h-4 text-[#00D4FF]" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-[#00FF84]/30 space-y-2 relative">
                    <span className="text-[10px] text-[#00FF84] font-bold font-orbitron uppercase tracking-widest">
                      LAYER 2: TELEMETRY PROCESSING LAYER
                    </span>
                    <p className="text-slate-100 font-orbitron font-bold text-xs">
                      Validation & Hex Fault Evaluator
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Parses sensor data, evaluates physical range limits, and computes diagnostic status codes.
                    </p>
                  </div>

                  <div className="w-full flex justify-center">
                    <ChevronDown className="w-4 h-4 text-[#00FF84]" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-[#FFC857]/30 space-y-2 relative">
                    <span className="text-[10px] text-[#FFC857] font-bold font-orbitron uppercase tracking-widest">
                      LAYER 3: STATE MANAGEMENT
                    </span>
                    <p className="text-slate-100 font-orbitron font-bold text-xs">
                      Zustand Global State Store
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Stores packet history (600 frames max), command logs, audio alerts, and UI flags.
                    </p>
                  </div>

                  <div className="w-full flex justify-center">
                    <ChevronDown className="w-4 h-4 text-[#FFC857]" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-purple-500/30 space-y-2 relative">
                    <span className="text-[10px] text-purple-400 font-bold font-orbitron uppercase tracking-widest">
                      LAYER 4: VISUALIZATION COMPONENTS
                    </span>
                    <p className="text-slate-100 font-orbitron font-bold text-xs">
                      React UI + Three.js WebGL + Leaflet GIS + Chart.js
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Renders real-time telemetry panels, 3D attitude, interactive GIS map, and live trend curves.
                    </p>
                  </div>

                  <div className="w-full flex justify-center">
                    <ChevronDown className="w-4 h-4 text-purple-400" />
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-slate-700 space-y-2 relative">
                    <span className="text-[10px] text-slate-400 font-bold font-orbitron uppercase tracking-widest">
                      LAYER 5: EXPORT SERVICES
                    </span>
                    <p className="text-slate-100 font-orbitron font-bold text-xs">
                      CSV Exporter + JSON Logger + PNG Chart Renderer
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Allows operators to download full mission telemetry logs and high-resolution chart images.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: TECHNOLOGY STACK */}
            <section id="sec-6" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30 font-orbitron font-bold text-sm">
                  06
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    TECHNOLOGY STACK
                  </h2>
                  <p className="text-xs text-[#00FF84] font-mono">Modern Aerospace Web Ecosystem</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-6 font-mono text-xs">
                {/* Tech Stack Cards Grid with Actual Brand Vector SVGs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category 1: Frontend Core */}
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-3">
                    <p className="text-[#00D4FF] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      FRONTEND CORE
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#00D4FF]/40 text-[#00D4FF] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#61DAFB]" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(0 12 12)" />
                          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
                          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
                          <circle cx="12" cy="12" r="1.5" fill="#61DAFB" />
                        </svg>
                        React 18
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#3178C6]/40 text-[#3178C6] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#3178C6">
                          <rect width="24" height="24" rx="4" />
                          <text x="5" y="17" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">TS</text>
                        </svg>
                        TypeScript
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#06B6D4]/40 text-[#06B6D4] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#06B6D4]">
                          <path d="M 12 4.5 C 7 4.5 3.5 8 5 12 C 3.5 12 2 13.5 2 16 C 2 18.5 4 20 6.5 20 C 11.5 20 15 16.5 13.5 12.5 C 15 12.5 16.5 11 16.5 8.5 C 16.5 6 14.5 4.5 12 4.5 Z" />
                        </svg>
                        Tailwind CSS
                      </span>
                    </div>
                  </div>

                  {/* Category 2: Visualization */}
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-3">
                    <p className="text-[#00FF84] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      VISUALIZATION
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#FF6384]/40 text-[#FF6384] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF6384]" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M 3 3 v 18 h 18" strokeWidth="2" strokeLinecap="round" />
                          <path d="M 7 14 l 4 -5 l 4 3 l 5 -7" stroke="#FF6384" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="20" cy="5" r="2" fill="#FF6384" />
                        </svg>
                        Chart.js
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#00FF84]/40 text-[#00FF84] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 12 2 L 22 20 L 2 20 Z" strokeWidth="1.5" />
                          <path d="M 12 2 L 12 20" strokeWidth="1" strokeDasharray="2 1" />
                          <circle cx="12" cy="12" r="2" fill="#00FF84" />
                        </svg>
                        Three.js (WebGL)
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#19B900]/40 text-[#19B900] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#19B900]" fill="currentColor">
                          <path d="M 12 2 C 7 2 3 7 3 13 C 3 19 8 22 12 22 C 16 22 21 19 21 13 C 21 7 17 2 12 2 Z M 12 18 C 10 18 8.5 16.5 8.5 14.5 C 8.5 12.5 10 11 12 11 C 14 11 15.5 12.5 15.5 14.5 C 15.5 16.5 14 18 12 18 Z" />
                        </svg>
                        Leaflet GIS
                      </span>
                    </div>
                  </div>

                  {/* Category 3: State Management */}
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-3">
                    <p className="text-[#FFC857] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      STATE MANAGEMENT
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#FFC857]/40 text-[#FFC857] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FFC857]" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill="#FFC857" />
                        </svg>
                        Zustand 5
                      </span>
                    </div>
                  </div>

                  {/* Category 4: Animations */}
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-3">
                    <p className="text-purple-400 font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      ANIMATIONS & UI
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-purple-500/40 text-purple-400 font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-purple-400">
                          <path d="M 4 0 H 20 V 8 H 12 L 4 0 Z M 4 8 H 12 L 20 16 H 4 V 8 Z M 4 16 L 12 24 V 16 H 4 Z" />
                        </svg>
                        Framer Motion
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#00D4FF]/40 text-[#00D4FF] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 12 2 L 15 9 L 22 12 L 15 15 L 12 22 L 9 15 L 2 12 L 9 9 Z" fill="#00D4FF20" />
                        </svg>
                        Lucide Icons
                      </span>
                    </div>
                  </div>

                  {/* Category 5: Future Integration */}
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-3 md:col-span-2">
                    <p className="text-[#00D4FF] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      FUTURE HARDWARE & PROTOCOLS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#00D4FF]/40 text-[#00D4FF] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00D4FF]" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5" />
                          <line x1="9" y1="2" x2="9" y2="5" strokeWidth="1.8" />
                          <line x1="15" y1="2" x2="15" y2="5" strokeWidth="1.8" />
                          <circle cx="12" cy="12" r="2" fill="#00D4FF" />
                        </svg>
                        Web Serial API
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-amber-500/40 text-amber-400 font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
                          <rect x="8" y="8" width="8" height="8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
                        </svg>
                        ESP32 MCU
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#00979D]/40 text-[#00979D] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00979D]" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="8" cy="12" r="5" strokeWidth="1.8" />
                          <circle cx="16" cy="12" r="5" strokeWidth="1.8" />
                          <line x1="6" y1="12" x2="10" y2="12" />
                          <line x1="14" y1="12" x2="18" y2="12" />
                          <line x1="16" y1="10" x2="16" y2="14" />
                        </svg>
                        Arduino
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-purple-500/40 text-purple-400 font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="8" strokeDasharray="2 2" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                        </svg>
                        MQTT Protocol
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#00FF84]/40 text-[#00FF84] font-bold inline-flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00FF84]" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 7 8 L 3 12 L 7 16" strokeWidth="2" strokeLinecap="round" />
                          <path d="M 17 8 L 21 12 L 17 16" strokeWidth="2" strokeLinecap="round" />
                          <line x1="14" y1="4" x2="10" y2="20" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        WebSockets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7: SIMULATION ENGINE & TELEMETRY REFERENCE DATA */}
            <section id="sec-7" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-orbitron font-bold text-sm">
                  07
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    SIMULATION ENGINE & DATA REFERENCE
                  </h2>
                  <p className="text-xs text-[#00D4FF] font-mono">Reference Mission Launch Specs & Atmospheric Physics Model</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-4 font-mono text-xs text-slate-300 leading-relaxed hover:border-[#00D4FF]/40 transition-colors">
                <p>
                  The OrbitOps Simulation Engine is modeled on official <strong className="text-[#00D4FF]">IN-SPACe Cansat India</strong> and <strong className="text-[#00FF84]">NASA / AAS CanSat Competition</strong> suborbital rocket flight profiles.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#070B14] border border-[#00D4FF]/30 space-y-2">
                    <p className="text-[#00D4FF] font-bold font-orbitron text-xs">REFERENCE LAUNCH PROFILE</p>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      <li>• <strong>Target Apogee:</strong> 1,050 meters (3,445 ft) MSL</li>
                      <li>• <strong>Launch Pad:</strong> Sriharikota / Chennai Range (13.7759° N, 80.2975° E)</li>
                      <li>• <strong>Max Ascent Velocity:</strong> +28.5 m/s High-G Boost</li>
                      <li>• <strong>Dual Descent:</strong> Freefall (14 m/s) → Parachute (4.5 m/s)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-[#00FF84]/30 space-y-2">
                    <p className="text-[#00FF84] font-bold font-orbitron text-xs">ATMOSPHERIC PHYSICS MODEL</p>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      <li>• <strong>Baro Lapse Rate:</strong> P = 1013.25 * (1 - 2.25577e-5 * h)^5.25588 hPa</li>
                      <li>• <strong>Temp Gradient:</strong> T = T0 - 0.0065 * h °C (-6.5°C / 1000m)</li>
                      <li>• <strong>LiPo Cell Curve:</strong> 8.4V (100%) → 6.8V Nominal Cutoff</li>
                      <li>• <strong>GPS Constellation:</strong> 12 Satellite Lock (NMEA GPGGA/GPRMC)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-[#FFC857]/30 space-y-2">
                  <div className="flex items-center space-x-2 text-[#FFC857] font-bold font-orbitron text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HARDWARE DROP-IN REPLACEMENT ARCHITECTURE</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    The telemetry pipeline uses identical packet schemas for both simulated flight data and physical hardware receivers (ESP32 via Web Serial API or MQTT). Replacing the simulator with a live LoRa / RF transceiver link requires zero frontend code modifications.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 8: FUTURE ROADMAP */}
            <section id="sec-8" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30 font-orbitron font-bold text-sm">
                  08
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    FUTURE ROADMAP
                  </h2>
                  <p className="text-xs text-[#FFC857] font-mono">Completed Milestones & Planned Features</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Completed Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#00FF84] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>COMPLETED FEATURES</span>
                    </div>
                    <ul className="space-y-2 text-slate-300">
                      {[
                        'Real-Time Telemetry Simulation',
                        'Live Telemetry Graphs',
                        'GIS Map Spatial Tracking',
                        '3D CubeSat Attitude Kinematics',
                        'Interactive Mission Controls',
                        'Data Export (CSV & JSON)',
                        '4-Digit Health Diagnostics'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-[11px]">
                          <span className="text-[#00FF84] font-bold">✔</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Planned Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#00D4FF] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      <Clock className="w-4 h-4" />
                      <span>PLANNED ROADMAP</span>
                    </div>
                    <ul className="space-y-2 text-slate-400">
                      {[
                        'Web Serial Hardware Integration',
                        'ESP32 Telemetry Receiver',
                        'MQTT Telemetry Support',
                        'Mission Flight Replay Engine',
                        'AI Anomaly Detection System',
                        'Cloud Telemetry Storage',
                        'Multi-Satellite Monitoring'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-[11px]">
                          <span className="text-[#00D4FF]">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 9: ABOUT ORBITOPS */}
            <section id="sec-9" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 font-orbitron font-bold text-sm">
                  09
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    ABOUT ORBITOPS
                  </h2>
                  <p className="text-xs text-purple-400 font-mono">Platform Identity & Description</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#00D4FF]/40 p-6 rounded-2xl space-y-4 font-mono text-xs text-slate-200 leading-relaxed shadow-cyan-glow relative">
                <blockquote className="text-sm md:text-base font-space text-slate-100 italic border-l-2 border-[#00D4FF] pl-4 py-1">
                  "OrbitOps GCS is a modern simulation-first Ground Control Software platform built to emulate professional aerospace mission operations through realistic telemetry visualization, GIS tracking, diagnostics, and interactive 3D mission monitoring."
                </blockquote>
                <p className="text-slate-400 text-[11px]">
                  Developed as part of the India Space Lab Internship Program to bridge the gap between simulation-driven aerospace education and real hardware satellite mission ground operations.
                </p>
              </div>
            </section>

            {/* SECTION 10: VERSION INFORMATION */}
            <section id="sec-10" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30 font-orbitron font-bold text-sm">
                  10
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    VERSION INFORMATION
                  </h2>
                  <p className="text-xs text-[#00FF84] font-mono">Software Build Metadata</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-4 font-mono text-xs text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#070B14] p-3 rounded-xl border border-[#1F2937]">
                    <span className="text-[9px] text-slate-500 block">SOFTWARE</span>
                    <span className="font-orbitron font-bold text-sm text-[#00D4FF]">OrbitOps GCS v2.0</span>
                  </div>
                  <div className="bg-[#070B14] p-3 rounded-xl border border-[#1F2937]">
                    <span className="text-[9px] text-slate-500 block">MODE</span>
                    <span className="font-orbitron font-bold text-sm text-[#00FF84]">Simulation Mode</span>
                  </div>
                  <div className="bg-[#070B14] p-3 rounded-xl border border-[#1F2937]">
                    <span className="text-[9px] text-slate-500 block">PROJECT</span>
                    <span className="font-orbitron font-bold text-xs text-[#FFC857]">India Space Lab</span>
                  </div>
                  <div className="bg-[#070B14] p-3 rounded-xl border border-[#1F2937]">
                    <span className="text-[9px] text-slate-500 block">DEVELOPER</span>
                    <span className="font-orbitron font-bold text-xs text-purple-400">Angelina Chatterjee</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1F2937]/80 text-[11px] text-slate-400">
                  Built with <strong>React</strong>, <strong>TypeScript</strong>, <strong>Three.js</strong>, <strong>Leaflet</strong>, and <strong>Chart.js</strong>.
                </div>
              </div>
            </section>

            {/* Bottom Return CTA */}
            <div className="pt-8 text-center space-y-4">
              <button
                onClick={onClose}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 via-[#00FF84]/20 to-[#00D4FF]/20 hover:from-[#00D4FF]/30 hover:to-[#00FF84]/30 text-slate-100 border border-[#00FF84]/50 font-orbitron font-bold text-xs tracking-widest inline-flex items-center space-x-2 transition-all duration-300 shadow-green-glow hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 text-[#00FF84]" />
                <span>RETURN TO {showLandingScreen ? 'LANDING PAGE' : 'MISSION CONTROL'}</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </motion.div>
  );
};
