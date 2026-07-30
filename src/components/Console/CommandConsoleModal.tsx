import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { telemetrySimulator } from '../../services/telemetrySimulator';
import { exportTelemetryCSV } from '../../services/exportService';
import {
  Terminal as TerminalIcon,
  X,
  Radio,
  Cpu,
  Clock,
  Shield,
  Activity,
  CornerDownLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  isError?: boolean;
  isSystem?: boolean;
}

const COMMAND_LIST = [
  'help', 'clear', 'version', 'status', 'uptime', 'time', 'date',
  'mission start', 'mission stop', 'mission pause', 'mission resume', 'mission reset', 'mission summary', 'mission export',
  'telemetry', 'telemetry altitude', 'telemetry battery', 'telemetry gps', 'telemetry pressure', 'telemetry temperature', 'telemetry orientation', 'telemetry packets', 'telemetry signal',
  'map center', 'map home', 'map follow', 'map reset',
  'camera start', 'camera stop', 'camera capture', 'camera status',
  'diag', 'health', 'errors', 'logs', 'connections',
  'simulate gps-loss', 'simulate battery-low', 'simulate sensor-failure', 'simulate payload', 'simulate parachute', 'simulate landing', 'simulate packet-loss',
  'serial connect', 'serial disconnect', 'esp32 connect', 'mqtt connect',
  'about', 'credits', 'stack', 'architecture', 'roadmap', 'modules', 'theme', 'license'
];

export const CommandConsoleModal: React.FC = () => {
  const {
    showCommandConsole,
    setShowCommandConsole,
    isStreaming,
    startTelemetry,
    stopTelemetry,
    resetPackets,
    currentPacket,
    packets,
    logs,
    connectionMode,
    addLog,
    setErrorCode,
  } = useTelemetryStore();

  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [outputHistory, setOutputHistory] = useState<HistoryItem[]>([
    {
      id: 'welcome',
      command: '',
      output: `================================================================================
  ORBITOPS GROUND CONTROL SOFTWARE // MISSION OPERATIONS CONSOLE [v2.0.0]
  Simulation Mode Active | System Nominal | Security Level: OPERATOR
================================================================================
  Type "help" to view available aerospace ground station commands.`,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: true,
    },
  ]);

  const [utcTime, setUtcTime] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // UTC Live Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts (` key & Ctrl+Shift+C & ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Backtick (`) shortcut toggle
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShowCommandConsole(!showCommandConsole);
        return;
      }

      // Ctrl + Shift + C shortcut toggle
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        setShowCommandConsole(!showCommandConsole);
        return;
      }

      // ESC key to close
      if (e.key === 'Escape' && showCommandConsole) {
        e.preventDefault();
        setShowCommandConsole(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandConsole, setShowCommandConsole]);

  // Auto-focus input when console is opened
  useEffect(() => {
    if (showCommandConsole) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showCommandConsole]);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputHistory]);

  // Tab completion helper
  const handleTabCompletion = () => {
    if (!inputVal.trim()) return;
    const matches = COMMAND_LIST.filter((cmd) => cmd.startsWith(inputVal.trim().toLowerCase()));
    if (matches.length === 1) {
      setInputVal(matches[0]);
      setSuggestions([]);
    } else if (matches.length > 1) {
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // Command Execution Processor
  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add to input history
    setCmdHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);
    setSuggestions([]);

    const lower = trimmed.toLowerCase();
    let outputText = '';
    let isError = false;

    // Command Logic Handlers
    switch (lower) {
      case 'help':
        outputText = `ORBITOPS GROUND CONTROL SYSTEM COMMAND MATRIX
================================================================================

SYSTEM COMMANDS:
  help                        - Display Linux-style command menu
  clear                       - Clear console terminal history
  version                     - Display software version & build metadata
  status                      - Display comprehensive mission & telemetry status
  uptime                      - Display mission elapsed time (MET)
  time                        - Display real-time UTC & IST timestamps
  date                        - Display current mission epoch date

MISSION COMMANDS:
  mission start               - Start telemetry stream simulation
  mission stop                - Pause/stop telemetry stream simulation
  mission pause               - Pause live graph rendering
  mission resume              - Resume live graph rendering
  mission reset               - Reset packet counter & simulation trajectory
  mission summary             - Display mission flight statistics & peaks
  mission export              - Export telemetry history to CSV file

TELEMETRY COMMANDS:
  telemetry                   - Display full telemetry packet snapshot
  telemetry altitude          - Display altitude, apogee, & descent rate
  telemetry battery           - Display battery voltage & power gauge
  telemetry gps               - Display GPS latitude, longitude, & sat count
  telemetry pressure          - Display barometric pressure (hPa/kPa)
  telemetry temperature       - Display ambient & sensor temperatures (°C/°F)
  telemetry orientation       - Display 3D Euler angles (Roll, Pitch, Yaw)
  telemetry packets           - Display total packet count & transmission rate
  telemetry signal            - Display RSSI signal strength & noise floor

MAP COMMANDS:
  map center                  - Recenter tracking map on active payload
  map home                    - Focus map on Sriharikota/KSC ground launch site
  map follow                  - Toggle automated satellite trajectory tracking
  map reset                   - Reset map zoom and tilt controls

CAMERA COMMANDS:
  camera start                - Activate optical payload camera feed
  camera stop                 - Deactivate optical payload camera feed
  camera capture              - Capture instant optical payload snapshot
  camera status               - Display camera resolution, FPS, & sensor health

DIAGNOSTICS COMMANDS:
  diag                        - Run full diagnostic check across subsystems
  health                      - Display subsystem health scores
  errors                      - Display current error code & fault matrix
  logs                        - Display recent mission audit log entries
  connections                 - Display RF ground transceiver connection details

SIMULATION FAULT INJECTION:
  simulate gps-loss           - Trigger GPS satellite signal drop anomaly
  simulate battery-low        - Trigger critical low battery voltage fault
  simulate sensor-failure     - Inject sensor telemetry anomaly (Code E202)
  simulate payload            - Trigger payload separation sequence
  simulate parachute          - Trigger parachute deployment event
  simulate landing            - Trigger touchdown & mission landing state
  simulate packet-loss        - Trigger RF signal attenuation & packet loss

FUTURE HARDWARE INTEGRATION:
  serial connect              - Connect to Web Serial UART hardware interface
  serial disconnect           - Disconnect Web Serial UART device
  esp32 connect               - Connect to ESP32 Wi-Fi / Bluetooth transceiver
  mqtt connect                - Connect to MQTT Telemetry Broker

SYSTEM EXTRAS:
  about                       - Display OrbitOps Ground Control Station overview
  credits                     - Display engineering team & credits
  stack                       - Display technology stack & frameworks
  architecture                - Display system architecture design
  roadmap                     - Display future software & hardware roadmap
  modules                     - Display status of all dashboard UI modules
  theme                       - Display design system color tokens & fonts
  license                     - Display software license information`;
        break;

      case 'clear':
        setOutputHistory([]);
        setInputVal('');
        return;

      case 'version':
        outputText = `OrbitOps Ground Control System
Software Version:   v2.0.0 (Aerospace Production Build)
Build Epoch:        2026.07.30
Architecture:       React 18 / TypeScript 5.6 / Vite 5 / TailwindCSS
Engine:             3D WebGL Euler Engine & Canvas GIS Render
Telemetry Protocol: OrbitOps Binary Packet v1.4 (1Hz Sync)`;
        break;

      case 'status':
        outputText = `Mission:     ${currentPacket?.missionState ?? 'ACTIVE'} [CANSAT-LEO-1]
Mode:        ${connectionMode}
Streaming:   ${isStreaming ? 'ACTIVE [1Hz]' : 'PAUSED'}
Altitude:    ${currentPacket?.altitude ?? 0} m (Peak Apogee: ${currentPacket?.maxAltitude ?? 0} m)
Battery:     ${currentPacket?.batteryVoltage ?? 0} V (${currentPacket?.batteryPercentage ?? 0}%)
GPS Fix:     ${currentPacket?.gpsLatitude ?? 0}°, ${currentPacket?.gpsLongitude ?? 0}° (Sats: ${currentPacket?.satelliteCount ?? 0})
Packets:     ${packets.length} rec.
Health:      98.4% NOMINAL
ErrorCode:   [${currentPacket?.errorCode ?? '0000'}]`;
        break;

      case 'uptime':
        outputText = `Mission Elapsed Time (MET): T+${currentPacket?.missionTime ?? 0} seconds
Active Session Duration:    ${Math.floor((currentPacket?.missionTime ?? 0) / 60)}m ${(currentPacket?.missionTime ?? 0) % 60}s
Transceiver Clock Sync:     0.04 ms delta`;
        break;

      case 'time':
        outputText = `UTC Clock:  ${utcTime}
IST Clock:  ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })} IST
System Epoch: ${Date.now()} ms`;
        break;

      case 'date':
        outputText = `Mission Date: ${new Date().toUTCString()}
Julian Day:   ${Math.floor(Date.now() / 86400000 + 2440587.5)}`;
        break;

      // MISSION COMMANDS
      case 'mission start':
        startTelemetry();
        outputText = `[EXEC] Telemetry stream started. 1Hz simulator packet broadcast active.`;
        break;

      case 'mission stop':
        stopTelemetry();
        outputText = `[EXEC] Telemetry stream paused by operator. Standing by.`;
        break;

      case 'mission pause':
        stopTelemetry();
        outputText = `[EXEC] Telemetry stream & graph updates paused.`;
        break;

      case 'mission resume':
        startTelemetry();
        outputText = `[EXEC] Telemetry stream resumed. Streaming at 1Hz.`;
        break;

      case 'mission reset':
        resetPackets();
        outputText = `[EXEC] Telemetry packets reset. Sequence counter set to 0. Altitude zeroed.`;
        break;

      case 'mission summary':
        outputText = `ORBITOPS MISSION FLIGHT SUMMARY
--------------------------------------------------------------------------------
Total Packets Received: ${packets.length}
Apogee Altitude:        ${currentPacket?.maxAltitude ?? 0} meters
Current Altitude:       ${currentPacket?.altitude ?? 0} meters
Max Temperature:        ${Math.max(...packets.map((p) => p.temperature), 0)} °C
Min Battery Voltage:    ${Math.min(...packets.map((p) => p.batteryVoltage), 0)} V
Mean Signal Strength:   -68 dBm`;
        break;

      case 'mission export':
        exportTelemetryCSV(packets);
        outputText = `[EXPORT] Successfully generated and downloaded CSV telemetry report (${packets.length} packets).`;
        break;

      // TELEMETRY COMMANDS
      case 'telemetry':
        outputText = JSON.stringify(currentPacket, null, 2);
        break;

      case 'telemetry altitude':
        outputText = `Current Altitude:  ${currentPacket?.altitude ?? 0} m
Max Apogee Record: ${currentPacket?.maxAltitude ?? 0} m
Descent Rate:      ${currentPacket?.descentRate ?? 0} m/s`;
        break;

      case 'telemetry battery':
        outputText = `Battery Voltage:    ${currentPacket?.batteryVoltage ?? 0} V
Battery Level:      ${currentPacket?.batteryPercentage ?? 0}%
Power Bus Status:   STABLE (Dual LiPo Cell)`;
        break;

      case 'telemetry gps':
        outputText = `GPS Latitude:   ${currentPacket?.gpsLatitude ?? 0}° N
GPS Longitude:  ${currentPacket?.gpsLongitude ?? 0}° E
GPS Altitude:   ${currentPacket?.gpsAltitude ?? 0} m
Satellites:     ${currentPacket?.satelliteCount ?? 0} Locked`;
        break;

      case 'telemetry pressure':
        outputText = `Barometric Pressure: ${currentPacket?.pressure ?? 1013.25} hPa
Pressure (kPa):      ${((currentPacket?.pressure ?? 1013.25) / 10).toFixed(2)} kPa`;
        break;

      case 'telemetry temperature':
        outputText = `Internal Sensor Temp: ${currentPacket?.temperature ?? 25} °C (${(((currentPacket?.temperature ?? 25) * 9) / 5 + 32).toFixed(1)} °F)
Relative Humidity:    ${currentPacket?.humidity ?? 50}%`;
        break;

      case 'telemetry orientation':
        outputText = `3D Euler Angles (Attitude Matrix):
  Roll:  ${currentPacket?.roll ?? 0}°
  Pitch: ${currentPacket?.pitch ?? 0}°
  Yaw:   ${currentPacket?.yaw ?? 0}°`;
        break;

      case 'telemetry packets':
        outputText = `Packets Received: ${packets.length}
Packet Loss:      0.0%
Broadcast Rate:   1.0 Hz (1000 ms interval)`;
        break;

      case 'telemetry signal':
        outputText = `Signal RSSI:     ${currentPacket?.signalStrength ?? -68} dBm
Noise Floor:     -104 dBm
Signal Quality:  94% EXCELLENT`;
        break;

      // MAP COMMANDS
      case 'map center':
      case 'map home':
      case 'map follow':
      case 'map reset':
        outputText = `[MAP] Executed command "${lower}". GPS viewport updated to CanSat payload coordinates (${currentPacket?.gpsLatitude}°, ${currentPacket?.gpsLongitude}°).`;
        break;

      // CAMERA COMMANDS
      case 'camera start':
      case 'camera stop':
      case 'camera capture':
      case 'camera status':
        outputText = `[CAMERA] Command "${lower}" executed. Optical payload sensor nominal (1080p @ 30 FPS).`;
        break;

      // DIAGNOSTICS COMMANDS
      case 'diag':
        outputText = `ORBITOPS GROUND CONTROL DIAGNOSTIC SUITE
================================================================================
[OK] POWER BUS SYSTEM     (7.82 V | LiPo 2S Nominal)
[OK] RF TRANSCEIVER LINK  (RSSI -68 dBm | S-Band 2.4GHz)
[OK] AVIONICS CONTROLLER  (MCU 48 MHz | 0 Latency)
[OK] SENSOR ARRAY         (BMP280 / MPU6050 OK)
[OK] OPTICAL FEED         (1080p Optical Stream OK)
--------------------------------------------------------------------------------
Result: ALL 6 SUBSYSTEMS NOMINAL (100% HEALTH SCORE)`;
        break;

      case 'health':
        outputText = `SUBSYSTEM HEALTH METRICS
  Avionics MCU:     100%
  Power / Battery:  95%
  S-Band Radio:     98%
  GPS Recv:         100%
  Sensors Array:    96%`;
        break;

      case 'errors':
        outputText = `Current Error Code: [${currentPacket?.errorCode ?? '0000'}]
Fault Status: NO ACTIVE CRITICAL HARDWARE FAULTS DETECTED.`;
        break;

      case 'logs':
        outputText = logs
          .slice(0, 8)
          .map((l) => `[${l.timestamp}] [${l.type}] ${l.message}`)
          .join('\n');
        break;

      case 'connections':
        outputText = `Connection Mode:  ${connectionMode}
Baud Rate:        115200 bps
Parity/Stop:      8-N-1
Buffer State:     CLEAR`;
        break;

      // SIMULATION FAULT INJECTION
      case 'simulate gps-loss':
        setErrorCode('0100');
        addLog('WARNING', 'Simulated Fault: GPS Satellite Lock Lost.');
        outputText = `[FAULT INJECTED] GPS Satellite Lock Lost. Satellite count set to 0. Error Code: [0100].`;
        break;

      case 'simulate battery-low':
        setErrorCode('1000');
        addLog('ERROR', 'Simulated Fault: Low Battery Voltage Warning (6.4V).');
        outputText = `[FAULT INJECTED] Low Battery Voltage Anomaly (6.4V). Error Code: [1000]. Audio alarm triggered.`;
        break;

      case 'simulate sensor-failure':
        setErrorCode('E202');
        addLog('ERROR', 'Simulated Fault: Sensor Array Telemetry Anomaly.');
        outputText = `[FAULT INJECTED] Barometric Pressure & Temp Sensor Anomaly. Error Code: [E202].`;
        break;

      case 'simulate payload':
        telemetrySimulator.triggerPayloadSeparation();
        addLog('SUCCESS', 'Simulated Event: Payload Separation Fired.');
        outputText = `[SIMULATION EVENT] Payload Separation Command Executed. Error Code: [0010].`;
        break;

      case 'simulate parachute':
        telemetrySimulator.triggerParachuteDeployment();
        addLog('SUCCESS', 'Simulated Event: Parachute Deployed.');
        outputText = `[SIMULATION EVENT] Main Parachute Deployed. Descent rate stabilized at 6.2 m/s. Error Code: [0001].`;
        break;

      case 'simulate landing':
        telemetrySimulator.setMissionState('LANDED');
        addLog('SUCCESS', 'Simulated Event: CanSat Touchdown Confirmed.');
        outputText = `[SIMULATION EVENT] Touchdown Confirmed. CanSat landed. Mission Completed.`;
        break;

      case 'simulate packet-loss':
        addLog('WARNING', 'Simulated Fault: RF Signal Attenuation.');
        outputText = `[FAULT INJECTED] RF Signal Attenuation. RSSI dropped to -95 dBm. Simulated packet loss active.`;
        break;

      // FUTURE HARDWARE COMMANDS
      case 'serial connect':
      case 'serial disconnect':
      case 'esp32 connect':
      case 'mqtt connect':
        outputText = `Feature reserved for future hardware integration.

Web Serial API / ESP32 Hardware Integration Specs:
- Web Serial API Baud Rate: 115200
- Protocol: NMEA 0183 / OrbitOps Custom Binary Frame
- MQTT Broker Endpoint: wss://telemetry.orbitops.aerospace/mqtt`;
        break;

      // EXTRAS COMMANDS
      case 'about':
        outputText = `ABOUT ORBITOPS GCS
--------------------------------------------------------------------------------
OrbitOps GCS is a state-of-the-art aerospace Ground Control Station designed for
CanSat, CubeSat, and high-altitude rocket telemetry monitoring. Built with modern
web tech for sub-millisecond data rendering and 3D flight navigation.`;
        break;

      case 'credits':
        outputText = `ORBITOPS CREDITS
--------------------------------------------------------------------------------
Lead Aerospace & Software Architecture: Team OrbitOps
Frameworks: React 18, TypeScript, Vite, TailwindCSS, Three.js, Chart.js, Leaflet
Inspiration: NASA Mission Control, ISRO Ground Stations, SpaceX Flight Operations`;
        break;

      case 'stack':
        outputText = `TECHNOLOGY STACK
--------------------------------------------------------------------------------
• UI Engine: React 18, TypeScript, TailwindCSS
• State Management: Zustand 5.0
• 3D Euler Orientation: Three.js WebGL Renderer
• Real-time GIS Mapping: Leaflet & OpenStreetMap
• Real-time Telemetry Graphs: Chart.js & react-chartjs-2
• Audio Alarm Engine: Web Audio API Synthesizer`;
        break;

      case 'architecture':
        outputText = `SYSTEM ARCHITECTURE SUMMARY
--------------------------------------------------------------------------------
[Hardware / Simulator HAL] --> [Zustand Telemetry Store] --> [React Panels]
                                                           --> [3D Attitude Renderer]
                                                           --> [GIS Satellite Tracker]
                                                           --> [Event Audit Logger]`;
        break;

      case 'roadmap':
        outputText = `ENGINEERING ROADMAP
--------------------------------------------------------------------------------
[v2.0] Active: React + WebGL + Simulator + Command Console
[v2.1] Upcoming: Direct Web Serial API integration for ESP32 / LoRa RF
[v2.2] Upcoming: Multi-CubeSat Constellation Telemetry Tracking
[v2.3] Upcoming: Machine Learning Altitude & Trajectory Anomaly Predictor`;
        break;

      case 'modules':
        outputText = `DASHBOARD MODULE STATUS
--------------------------------------------------------------------------------
1. Telemetry Overview Panel:    [ONLINE]
2. Real-Time Telemetry Graphs:  [ONLINE]
3. CanSat GPS Satellite Map:    [ONLINE]
4. Mission Control & Simulator: [ONLINE]
5. 3D CubeSat Attitude Viewer:  [ONLINE]
6. CanSat Optical Feed:         [ONLINE]
7. Mission Timeline:            [ONLINE]
8. 4-Digit Error System:        [ONLINE]
9. System Health Gauges:        [ONLINE]
10. Event Audit Logger:         [ONLINE]`;
        break;

      case 'theme':
        outputText = `ORBITOPS AEROSPACE DESIGN SYSTEM TOKENS
--------------------------------------------------------------------------------
Background Base:  #05070C (Deep Space Matte)
Panel Container:  #0D1525 (Aerospace Navy)
Border Color:     #1F2937 (Slate Border)
Primary Accent:   #00D4FF (OrbitOps Cyan)
Success Indicator:#22C55E (Nominal Green)
Warning Status:   #FACC15 (Telemetry Yellow)
Danger Fault:     #EF4444 (Critical Red)
Fonts:            Orbitron (Headings), JetBrains Mono (Console)`;
        break;

      case 'license':
        outputText = `LICENSE
--------------------------------------------------------------------------------
MIT License - Open Source Aerospace Ground Control Software Project.
Copyright (c) 2026 Team OrbitOps.`;
        break;

      default:
        isError = true;
        outputText = `Command not recognized: "${trimmed}"
Type "help" for available commands.`;
        break;
    }

    setOutputHistory((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        command: trimmed,
        output: outputText,
        timestamp: new Date().toLocaleTimeString(),
        isError,
      },
    ]);

    setInputVal('');
  };

  // Keyboard navigation for command history & Tab completion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInputVal(cmdHistory[prevIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputVal);
    }
  };

  if (!showCommandConsole) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-5xl h-[80vh] bg-[#05070C] border border-[#1F2937] rounded-xl shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden text-[#E5E7EB] font-mono select-none"
        >
          {/* CONSOLE HEADER BAR */}
          <div className="h-12 bg-[#0D1525] border-b border-[#1F2937] px-4 flex items-center justify-between flex-shrink-0">
            {/* Left Title & Version */}
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-md bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30">
                <TerminalIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs md:text-sm font-bold font-orbitron text-slate-100 tracking-wider flex items-center gap-2">
                  OrbitOps Command Console
                  <span className="text-[10px] text-[#00D4FF] font-mono font-normal bg-[#00D4FF]/10 px-1.5 py-0.5 rounded border border-[#00D4FF]/30">
                    v2.0.0
                  </span>
                </h2>
              </div>
            </div>

            {/* Middle Status Chips */}
            <div className="hidden lg:flex items-center space-x-3 text-[10px] font-mono">
              <div className="flex items-center space-x-1.5 bg-[#05070C] px-2.5 py-1 rounded border border-[#1F2937]">
                <Cpu className="w-3 h-3 text-[#00D4FF]" />
                <span className="text-slate-400">MODE:</span>
                <span className="text-[#00D4FF] font-bold">{connectionMode}</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#05070C] px-2.5 py-1 rounded border border-[#1F2937]">
                <Radio className="w-3 h-3 text-[#22C55E]" />
                <span className="text-slate-400">STATUS:</span>
                <span className="text-[#22C55E] font-bold">{isStreaming ? 'CONNECTED' : 'IDLE'}</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#05070C] px-2.5 py-1 rounded border border-[#1F2937]">
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="text-slate-400">SESSION:</span>
                <span className="text-slate-200">SES-2026-8841</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#05070C] px-2.5 py-1 rounded border border-[#1F2937]">
                <Clock className="w-3 h-3 text-[#00D4FF]" />
                <span className="text-[#00D4FF] font-mono">{utcTime || 'UTC --:--:--'}</span>
              </div>
            </div>

            {/* Right Close Actions */}
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-[#05070C] px-2 py-0.5 rounded border border-[#1F2937]">
                ESC to close
              </span>
              <button
                onClick={() => setShowCommandConsole(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1F2937] transition-all"
                title="Close Command Console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONSOLE TERMINAL OUTPUT BODY */}
          <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-mono custom-scrollbar bg-[#05070C]/95 cursor-text"
          >
            {outputHistory.map((item) => (
              <div key={item.id} className="space-y-1">
                {/* Command Line Input Record */}
                {item.command && (
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="text-[#00D4FF] font-bold">orbitops@gcs:~#</span>
                    <span className="text-slate-100 font-semibold">{item.command}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
                  </div>
                )}

                {/* Output Content Block */}
                <pre
                  className={`whitespace-pre-wrap leading-relaxed ${
                    item.isError
                      ? 'text-[#EF4444]'
                      : item.isSystem
                      ? 'text-[#00D4FF]'
                      : 'text-slate-200'
                  }`}
                >
                  {item.output}
                </pre>
              </div>
            ))}

            {/* Inline Suggestions (Tab completion popup) */}
            {suggestions.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#0D1525] border border-[#00D4FF]/30 text-[11px] text-[#00D4FF]">
                <div className="text-slate-400 text-[10px] mb-1 uppercase tracking-wider font-bold">
                  Suggested Commands ({suggestions.length}):
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 font-mono">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => {
                        setInputVal(sug);
                        setSuggestions([]);
                        inputRef.current?.focus();
                      }}
                      className="text-left hover:underline text-[#00D4FF]"
                    >
                      • {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* INPUT BAR AREA */}
          <div className="p-3 bg-[#0D1525] border-t border-[#1F2937] flex items-center space-x-2 flex-shrink-0">
            <span className="text-[#00D4FF] font-bold font-mono text-xs md:text-sm flex items-center gap-1">
              orbitops@gcs:~#
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSuggestions([]);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type command ('help' for menu, TAB for autocomplete)..."
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 text-xs md:text-sm font-mono outline-none border-none"
            />
            <button
              onClick={() => executeCommand(inputVal)}
              className="px-3 py-1.5 rounded bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 border border-[#00D4FF]/40 text-[#00D4FF] text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
            >
              <span>RUN</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandConsoleModal;
