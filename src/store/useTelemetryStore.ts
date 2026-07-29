import { create } from 'zustand';
import { TelemetryPacket, ConnectionMode, MissionLog } from '../types/telemetry';
import { telemetrySimulator } from '../services/telemetrySimulator';
import { audioService } from '../services/audioService';

interface TelemetryState {
  isStreaming: boolean;
  connectionMode: ConnectionMode;
  packets: TelemetryPacket[];
  currentPacket: TelemetryPacket | null;
  logs: MissionLog[];
  audioMuted: boolean;
  graphPaused: boolean;
  manualErrorCode: string;
  showLandingScreen: boolean;
  showDocCenter: boolean;

  // Actions
  startTelemetry: () => void;
  stopTelemetry: () => void;
  resetPackets: () => void;
  pushPacket: (packet: TelemetryPacket) => void;
  addLog: (type: MissionLog['type'], message: string) => void;
  setErrorCode: (code: string) => void;
  toggleAudio: () => void;
  toggleGraphPause: () => void;
  setConnectionMode: (mode: ConnectionMode) => void;
  setShowLandingScreen: (show: boolean) => void;
  setShowDocCenter: (show: boolean) => void;
}

const initialPacket: TelemetryPacket = {
  timestamp: new Date().toISOString(),
  missionTime: 0,
  packetCount: 0,
  missionState: 'PRE_LAUNCH',
  altitude: 0,
  maxAltitude: 0,
  pressure: 1013.25,
  temperature: 28.5,
  humidity: 55,
  batteryVoltage: 7.8,
  batteryPercentage: 100,
  gpsLatitude: 13.7199,
  gpsLongitude: 80.2304,
  gpsAltitude: 14,
  satelliteCount: 12,
  roll: 0,
  pitch: 0,
  yaw: 0,
  descentRate: 0,
  signalStrength: -68,
  errorCode: '0000',
};

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  isStreaming: true,
  connectionMode: 'SIMULATOR',
  packets: [initialPacket],
  currentPacket: initialPacket,
  logs: [
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO',
      message: 'Ground station software initialized. Simulator telemetry active.',
    },
  ],
  audioMuted: false,
  graphPaused: false,
  manualErrorCode: '0000',
  showLandingScreen: true,
  showDocCenter: false,

  startTelemetry: () => {
    set({ isStreaming: true });
    get().addLog('SUCCESS', 'Telemetry stream started.');
  },

  stopTelemetry: () => {
    set({ isStreaming: false });
    get().addLog('WARNING', 'Telemetry stream paused by operator.');
  },

  resetPackets: () => {
    telemetrySimulator.resetSimulation();
    const fresh = telemetrySimulator.generateNextPacket();
    set({
      packets: [fresh],
      currentPacket: fresh,
      manualErrorCode: '0000',
    });
    get().addLog('INFO', 'Telemetry packets reset. Sequence counter set to 0.');
  },

  pushPacket: (packet: TelemetryPacket) => {
    const { packets, graphPaused } = get();
    // Keep last 600 packets in memory (~10 mins @ 1Hz)
    const updatedPackets = graphPaused ? packets : [...packets.slice(-599), packet];
    
    set({
      currentPacket: packet,
      packets: updatedPackets,
    });
    
    audioService.playTelemetryBeep();
  },

  addLog: (type: MissionLog['type'], message: string) => {
    const newLog: MissionLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    set((state) => ({ logs: [newLog, ...state.logs.slice(0, 49)] }));
  },

  setErrorCode: (code: string) => {
    telemetrySimulator.setErrorCode(code);
    set({ manualErrorCode: code });
    get().addLog(code === '0000' ? 'SUCCESS' : 'WARNING', `Mission Error Code set to [${code}].`);
  },

  toggleAudio: () => {
    const next = !get().audioMuted;
    audioService.setMuted(next);
    set({ audioMuted: next });
  },

  toggleGraphPause: () => {
    set((state) => ({ graphPaused: !state.graphPaused }));
  },

  setConnectionMode: (mode: ConnectionMode) => {
    set({ connectionMode: mode });
    get().addLog('INFO', `Telemetry source mode changed to ${mode}.`);
  },

  setShowLandingScreen: (show: boolean) => {
    set({ showLandingScreen: show });
  },

  setShowDocCenter: (show: boolean) => {
    set({ showDocCenter: show });
  },
}));
