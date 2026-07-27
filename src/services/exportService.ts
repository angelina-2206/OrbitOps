import { TelemetryPacket } from '../types/telemetry';

export function exportTelemetryCSV(packets: TelemetryPacket[], filename = 'OrbitOps_Telemetry_Log.csv') {
  if (packets.length === 0) return;

  const headers = [
    'Timestamp',
    'MissionTime_sec',
    'PacketCount',
    'MissionState',
    'Altitude_m',
    'MaxAltitude_m',
    'Pressure_hPa',
    'Temperature_C',
    'Humidity_pct',
    'Battery_V',
    'Battery_pct',
    'GPS_Latitude',
    'GPS_Longitude',
    'GPS_Altitude_m',
    'Satellites',
    'Roll_deg',
    'Pitch_deg',
    'Yaw_deg',
    'DescentRate_ms',
    'SignalStrength_dBm',
    'ErrorCode'
  ];

  const rows = packets.map(p => [
    p.timestamp,
    p.missionTime,
    p.packetCount,
    p.missionState,
    p.altitude,
    p.maxAltitude,
    p.pressure,
    p.temperature,
    p.humidity,
    p.batteryVoltage,
    p.batteryPercentage,
    p.gpsLatitude,
    p.gpsLongitude,
    p.gpsAltitude,
    p.satelliteCount,
    p.roll,
    p.pitch,
    p.yaw,
    p.descentRate,
    p.signalStrength,
    p.errorCode
  ].join(','));

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTelemetryJSON(packets: TelemetryPacket[], filename = 'OrbitOps_Telemetry_Log.json') {
  if (packets.length === 0) return;
  const jsonStr = JSON.stringify(packets, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCanvasAsImage(canvasElement: HTMLCanvasElement | null, filename = 'OrbitOps_Graph.png') {
  if (!canvasElement) return;
  const imageURI = canvasElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imageURI;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
