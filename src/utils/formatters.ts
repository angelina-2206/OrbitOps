/**
 * Formats seconds into aerospace mission time format (T+ HH:MM:SS)
 */
export function formatMissionTime(seconds: number): string {
  const isNegative = seconds < 0;
  const absSec = Math.abs(Math.floor(seconds));
  const hrs = Math.floor(absSec / 3600);
  const mins = Math.floor((absSec % 3600) / 60);
  const secs = absSec % 60;

  const prefix = isNegative ? 'T-' : 'T+';
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${prefix} ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

/**
 * Returns current UTC time string with millisecond precision
 */
export function getFormattedUTCTime(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

/**
 * Parses 4-digit error string into diagnostic flags
 */
export function parseErrorCode(code: string) {
  const digits = code.padStart(4, '0').slice(-4);
  return {
    descentRateAnomaly: digits[0] === '1',
    gpsLoss: digits[1] === '1',
    payloadSeparated: digits[2] === '1',
    parachuteDeployed: digits[3] === '1',
  };
}

/**
 * Converts degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
