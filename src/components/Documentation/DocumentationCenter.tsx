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
      className="fixed inset-0 z-50 bg-[#050811] text-slate-100 font-space flex flex-col overflow-hidden select-none"
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
                    <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30">
                      <Activity className="w-5 h-5" />
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
                    <div className="p-2.5 rounded-xl bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30">
                      <LineChart className="w-5 h-5" />
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
                    <div className="p-2.5 rounded-xl bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30">
                      <MapPin className="w-5 h-5" />
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
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      <Box className="w-5 h-5" />
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
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                      <Sliders className="w-5 h-5" />
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
                    <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30">
                      <Camera className="w-5 h-5" />
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
                    <div className="p-2.5 rounded-xl bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30">
                      <Terminal className="w-5 h-5" />
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
                    { title: 'Telemetry Simulator', icon: Radio, desc: 'Generates 18 telemetry fields @ 1 Hz physics clock', color: '#00D4FF' },
                    { title: 'Data Processing Engine', icon: Cpu, desc: 'Validates bounds, computes lapse rates, & evaluates hex fault codes', color: '#00FF84' },
                    { title: 'Dashboard Modules', icon: Layers, desc: 'Ingests validated telemetry packet into Zustand global state store', color: '#FFC857' },
                    { title: 'Graphs', icon: LineChart, desc: 'Plots continuous time-series curves (Altitude, Temp, Volt)', color: '#00D4FF' },
                    { title: 'GIS Tracking', icon: MapPin, desc: 'Updates Leaflet map position marker & predicted landing ellipse', color: '#00FF84' },
                    { title: '3D Visualization', icon: Box, desc: 'Renders Euler roll/pitch/yaw orientation in Three.js WebGL canvas', color: 'rgb(192, 132, 252)' },
                    { title: 'Diagnostics', icon: Terminal, desc: 'Evaluates subsystem health metrics & triggers alarm audio beeps', color: '#FFC857' },
                    { title: 'Data Export', icon: Download, desc: 'Exports timestamped telemetry records as CSV, JSON, or PNG graph', color: '#00FF84' },
                  ].map((step, idx, arr) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-full bg-[#070B14] border border-[#1F2937] hover:border-[#00D4FF]/50 p-4 rounded-xl flex items-center justify-between transition-all group shadow-md">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="p-2 rounded-lg bg-[#111827] border border-[#1F2937] flex-shrink-0" style={{ color: step.color }}>
                              <StepIcon className="w-4 h-4" />
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
                {/* Tech Stack Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category 1: Frontend */}
                  <div className="bg-[#070B14] p-4 rounded-xl border border-[#1F2937] space-y-3">
                    <p className="text-[#00D4FF] font-orbitron font-bold text-xs border-b border-[#1F2937] pb-2">
                      FRONTEND CORE
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#00D4FF]/30 text-[#00D4FF] font-bold">
                        React 18
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
                        TypeScript
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
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
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#00FF84]/30 text-[#00FF84] font-bold">
                        Chart.js
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
                        Three.js (WebGL)
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
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
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#FFC857]/30 text-[#FFC857] font-bold">
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
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-purple-500/30 text-purple-400 font-bold">
                        Framer Motion
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
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
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#00D4FF]/30 text-[#00D4FF] font-bold">
                        Web Serial API
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
                        ESP32
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
                        Arduino
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
                        MQTT Protocol
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] text-slate-200">
                        WebSockets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7: SIMULATION ENGINE */}
            <section id="sec-7" className="space-y-6 pt-4 border-t border-[#1F2937]/80">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-orbitron font-bold text-sm">
                  07
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-xl md:text-2xl text-slate-100 tracking-wider">
                    SIMULATION ENGINE
                  </h2>
                  <p className="text-xs text-[#00D4FF] font-mono">Physics Telemetry Generator</p>
                </div>
              </div>

              <div className="bg-[#0C1220]/90 border border-[#1F2937] p-6 rounded-2xl space-y-4 font-mono text-xs text-slate-300 leading-relaxed hover:border-[#00D4FF]/40 transition-colors">
                <p>
                  The OrbitOps Simulation Engine generates realistic telemetry parameters within safe aerospace operating ranges to emulate an actual CanSat / CubeSat mission and drive every dashboard component in real time.
                </p>
                <div className="p-4 rounded-xl bg-[#070B14] border border-[#00FF84]/30 space-y-2">
                  <div className="flex items-center space-x-2 text-[#00FF84] font-bold font-orbitron text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HARDWARE DROP-IN REPLACEMENT ARCHITECTURE</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    The platform architecture is designed such that replacing the simulator with live telemetry from physical hardware (ESP32 via Web Serial API or MQTT) requires <strong>zero changes</strong> to the dashboard user interface or visualization layers.
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
