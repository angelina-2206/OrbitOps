import { TelemetryPacket, MissionState } from '../types/telemetry';

export class TelemetrySimulator {
  private packetCount: number = 0;
  private missionTime: number = 0;
  private missionState: MissionState = 'ASCENT';
  
  // Base coordinates (e.g. Launch Pad / Sriharikota or Spaceport base)
  private baseLat: number = 13.7199;
  private baseLng: number = 80.2304;
  private maxAltRecord: number = 0;

  // Simulation variables
  private currentAlt: number = 120; // Starts in flight simulation
  private targetApogee: number = 1050; // meters
  private ascentSpeed: number = 22; // m/s
  private descentSpeed: number = 6.2; // m/s
  
  // Custom manual error overrides
  private manualErrorCode: string = '0000';

  public resetSimulation() {
    this.packetCount = 0;
    this.missionTime = 0;
    this.missionState = 'PRE_LAUNCH';
    this.currentAlt = 0;
    this.maxAltRecord = 0;
    this.manualErrorCode = '0000';
  }

  public setErrorCode(code: string) {
    this.manualErrorCode = code;
  }

  public triggerPayloadSeparation() {
    this.setErrorCode('0010');
  }

  public triggerParachuteDeployment() {
    this.setErrorCode('0001');
  }

  public setMissionState(state: MissionState) {
    this.missionState = state;
    if (state === 'PRE_LAUNCH') {
      this.currentAlt = 0;
    }
  }

  public generateNextPacket(): TelemetryPacket {
    this.packetCount++;
    this.missionTime++;

    // Update flight dynamics state machine
    if (this.missionState === 'PRE_LAUNCH') {
      this.currentAlt = Math.max(0, (Math.random() - 0.5) * 0.4);
      if (this.missionTime > 5) {
        this.missionState = 'ASCENT';
      }
    } else if (this.missionState === 'ASCENT') {
      this.currentAlt += this.ascentSpeed + (Math.random() - 0.5) * 2;
      if (this.currentAlt >= this.targetApogee) {
        this.currentAlt = this.targetApogee;
        this.missionState = 'APOGEE';
      }
    } else if (this.missionState === 'APOGEE') {
      this.missionState = 'DESCENT';
    } else if (this.missionState === 'DESCENT') {
      this.currentAlt -= this.descentSpeed + (Math.random() - 0.5) * 0.8;
      if (this.currentAlt <= 0) {
        this.currentAlt = 0;
        this.missionState = 'LANDED';
      }
    } else if (this.missionState === 'LANDED') {
      this.currentAlt = 0;
    }

    if (this.currentAlt > this.maxAltRecord) {
      this.maxAltRecord = Math.round(this.currentAlt * 10) / 10;
    }

    // Barometric pressure calculation (ISA formula approximation)
    const basePressure = 1013.25; // hPa at sea level
    const pressure = Math.round((basePressure * Math.pow(1 - (2.25577e-5 * this.currentAlt), 5.25588)) * 10) / 10;

    // Temperature decrease with altitude
    const temperature = Math.round((28.5 - (this.currentAlt / 100) * 0.65 + (Math.random() - 0.5) * 0.3) * 10) / 10;
    const humidity = Math.round(Math.min(95, Math.max(20, 58 - (this.currentAlt / 50) + (Math.random() - 0.5) * 2)));

    // Battery voltage discharge slope (7.4V dual LiPo cell down to 7.0V)
    const batteryVoltage = Math.round((7.8 - (this.missionTime / 300) * 0.4 + (Math.random() - 0.5) * 0.02) * 100) / 100;
    const batteryPercentage = Math.round(Math.min(100, Math.max(0, ((batteryVoltage - 6.6) / (8.4 - 6.6)) * 100)));

    // GPS Drift along trajectory
    const driftFactor = this.missionTime * 0.00008;
    const gpsLat = this.baseLat + driftFactor + (Math.random() - 0.5) * 0.00002;
    const gpsLng = this.baseLng + driftFactor * 1.2 + (Math.random() - 0.5) * 0.00002;
    const gpsAlt = Math.round(this.currentAlt + 14.5);

    // Orientation angles (Roll, Pitch, Yaw)
    let roll = Math.round(Math.sin(this.missionTime * 0.5) * 15 + (Math.random() - 0.5) * 5);
    let pitch = Math.round(Math.cos(this.missionTime * 0.4) * 12 + (Math.random() - 0.5) * 4);
    let yaw = Math.round((this.missionTime * 8) % 360);

    // Descent rate (m/s)
    let descentRate = 0;
    if (this.missionState === 'ASCENT') descentRate = -this.ascentSpeed;
    else if (this.missionState === 'DESCENT') descentRate = this.descentSpeed + (Math.random() - 0.5) * 0.4;
    descentRate = Math.round(descentRate * 10) / 10;

    // Automatic Error Code Generation based on state & manual overrides
    let d1 = descentRate > 15 ? '1' : '0'; // High descent anomaly
    let d2 = this.packetCount % 37 === 0 ? '0' : '0'; // GPS
    let d3 = (this.missionState === 'DESCENT' || this.missionState === 'LANDED') ? '1' : '0'; // Payload sep
    let d4 = (this.missionState === 'DESCENT' || this.missionState === 'LANDED') ? '1' : '0'; // Parachute

    let computedErrorCode = `${d1}${d2}${d3}${d4}`;
    if (this.manualErrorCode !== '0000') {
      computedErrorCode = this.manualErrorCode;
    }

    return {
      timestamp: new Date().toISOString(),
      missionTime: this.missionTime,
      packetCount: this.packetCount,
      missionState: this.missionState,
      altitude: Math.round(this.currentAlt * 10) / 10,
      maxAltitude: this.maxAltRecord,
      pressure,
      temperature,
      humidity,
      batteryVoltage,
      batteryPercentage,
      gpsLatitude: Math.round(gpsLat * 100000) / 100000,
      gpsLongitude: Math.round(gpsLng * 100000) / 100000,
      gpsAltitude: gpsAlt,
      satelliteCount: Math.min(14, 8 + Math.floor(Math.random() * 4)),
      roll,
      pitch,
      yaw,
      descentRate,
      signalStrength: -68 - Math.floor(Math.random() * 8),
      errorCode: computedErrorCode,
    };
  }
}

export const telemetrySimulator = new TelemetrySimulator();
