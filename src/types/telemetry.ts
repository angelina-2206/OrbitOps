export type MissionState = 'PRE_LAUNCH' | 'ASCENT' | 'APOGEE' | 'DESCENT' | 'LANDED';
export type ConnectionMode = 'SIMULATOR' | 'SERIAL' | 'WEBSOCKET' | 'DISCONNECTED';

export interface TelemetryPacket {
  timestamp: string;          // ISO or UTC time string
  missionTime: number;        // T+ seconds from launch
  packetCount: number;        // Monotonic packet sequence ID
  missionState: MissionState;
  
  // Barometric & Atmospheric
  altitude: number;           // meters
  maxAltitude: number;        // meters (apogee record)
  pressure: number;           // hPa
  temperature: number;        // °C
  humidity: number;           // %

  // Power
  batteryVoltage: number;     // Volts (e.g. 7.4V nominal)
  batteryPercentage: number;  // %

  // GPS Data
  gpsLatitude: number;        // Decimal degrees
  gpsLongitude: number;       // Decimal degrees
  gpsAltitude: number;        // meters
  satelliteCount: number;     // Number of locked GPS satellites
  
  // 3D Attitude / Orientation
  roll: number;               // degrees (-180 to 180)
  pitch: number;              // degrees (-90 to 90)
  yaw: number;                // degrees (0 to 360)

  // Flight Dynamics
  descentRate: number;        // m/s (positive downwards or negative)
  signalStrength: number;     // dBm (e.g. -75 dBm)

  // 4-Digit Diagnostic Error Code
  errorCode: string;          // 4-digit code e.g. "0000", "1000", "0100", "0010", "0001", "1111"
}

export interface ErrorDiagnostics {
  descentRateAnomaly: boolean;  // Digit 1
  gpsLoss: boolean;             // Digit 2
  payloadSeparated: boolean;    // Digit 3
  parachuteDeployed: boolean;   // Digit 4
}

export interface MissionLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
}

export interface GroundStationState {
  isConnected: boolean;
  connectionMode: ConnectionMode;
  isRecordingCamera: boolean;
  audioMuted: boolean;
  activeGraphTab: 'all' | 'altitude' | 'pressure' | 'temperature' | 'battery' | 'descent';
  graphPaused: boolean;
  timeWindowSeconds: number; // 30, 60, 300
}
