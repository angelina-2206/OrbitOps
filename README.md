<div align="center">

# OrbitOps Ground Control Software (GCS)

**A high-reliability, real-time Ground Control Station for CanSat missions, CubeSats, and aerospace payload operations.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-443E38?style=for-the-badge)](https://github.com/pmndrs/zustand)

---

</div>

## Project Background & Purpose

**OrbitOps GCS** was engineered as a core deliverable during an **Aerospace Engineering & Space Technology Internship**. The primary purpose of this project is to provide a robust, production-grade Ground Control Station (GCS) for monitoring, data processing, and command execution during high-altitude balloon flights, CanSat competitions, and small-satellite launch operations.

In satellite and atmospheric payload missions, operators require a single-pane-of-glass dashboard that delivers zero-latency situational awareness without overwhelming the mission controller. OrbitOps GCS replicates the functional design standards of modern ground control centers—such as NASA Mission Control, SpaceX Ground Systems, ISRO Satellite Tracking Network, and ESA Flight Operations—focusing on:

1. **High-Frequency Telemetry Ingestion**: Processing real-time telemetry packets covering barometric pressure, altitude, battery voltage, ambient temperature, GPS spatial coordinates, and 3-axis attitude dynamics.
2. **Spatial & Kinematic Visualization**: Integrating live 3D WebGL orientation (Roll, Pitch, Yaw) alongside GIS dark-mode flight trajectory tracking and landing radius predictions.
3. **Telecommand & Safety Protocols**: Executing critical mission commands (payload separation, emergency parachute deployment, system resets) guarded by safety confirmation workflows.
4. **Hardware Interface Abstraction**: Providing a direct hardware serial link via the Web Serial API to interface with physical RF receiver nodes (LoRa / nRF24L01) connected to ESP32 or Arduino microcontrollers.

---

## Tech Stack & Architecture

| Category | Technologies / Libraries | Description |
| :--- | :--- | :--- |
| **Frontend Core** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Modular UI architecture, strong type enforcement, and ultra-fast Vite HMR build system |
| **Styling & Design** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) `Rajdhani` `Space Grotesk` `Lucide Icons` | Aerospace dark theme aesthetics, technical typography, and icon sets |
| **State Engine** | ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square) | Centralized high-performance state store and telemetry event bus |
| **Spatial & GIS** | ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white) `react-leaflet` | Geospatial mapping, flight trajectory polyline rendering, and landing zone estimation |
| **3D Kinematics** | ![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white) `WebGL` | Live 3D CubeSat orientation visualizer (Euler angles: Roll / Pitch / Yaw) |
| **Data Analytics** | ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) `react-chartjs-2` | Multi-metric telemetry graph streaming, timeframe controls, and PNG image export |
| **Hardware & I/O** | `Web Serial API` `Web Audio API` `MediaDevices` | Microcontroller serial port connectivity, synthesized audio alerts, optical payload stream |

---

## Key Capabilities & Features

### 1. Viewport Layout (`100vh` Zero-Scroll Layout)
Engineered for dedicated mission control monitors, the dashboard utilizes a high-density `100vh` grid layout, ensuring all telemetry modules, command panels, and visual displays remain accessible without page scrolling.

### 2. Real-Time Flight Dynamics Simulator
Built-in 1Hz atmospheric physics engine simulating realistic CanSat flight profiles: barometric pressure lapse rates, thermal decay curves, battery voltage discharge profiles, GPS jitter, and multi-stage descent kinematics (ascent, apogee, freefall, parachute deployment, and touchdown).

### 3. Telemetry Analytics & Export Engine
- **Multi-Metric Streaming**: Real-time graphs for Altitude, Pressure, Temperature, Battery Voltage, and Vertical Descent Rate.
- **Timeframe & Graph Pause Controls**: Toggle between 30-second, 60-second, 5-minute, and total flight history views.
- **Data Export**: One-click download of full flight logs into structured CSV, JSON, and high-resolution PNG graph images.

### 4. GIS Tracking Map & Trajectory Visualization
Integrates Leaflet dark tile layers with automated tracking, launch pad base markers, active CanSat position indicators, historical flight paths, and calculated landing zone radii.

### 5. 3D WebGL Attitude Indicator
Uses Three.js to render an interactive 3D CubeSat model that responds dynamically to incoming Roll, Pitch, and Yaw attitude telemetry streams.

### 6. Optical Stream & Aerospace Diagnostic Matrix
- **Payload Camera Integration**: Live browser webcam feed via `navigator.mediaDevices` with device selector and optical feed simulation.
- **4-Digit Status Code Matrix**: Standardized 4-character aerospace diagnostic array (`D1 D2 D3 D4`) tracking descent rate anomalies, GPS lock validation, payload separation state, and emergency parachute readiness.
- **Web Audio Alerts**: Real-time sound synthesizer triggering audio alarms for critical system threshold breaches.

### 7. Telecommand Safety Execution System
Guarded mission control command panel (`Deploy Payload`, `Emergency Parachute`, `Activate Redundant System`, `Reset Telemetry`, `Emergency Shutdown`) featuring dual-confirmation dialogs to eliminate accidental command triggers.

---

## Directory Architecture

```
OrbitOps/
├── src/
│   ├── assets/                # Static assets, branding graphics, and icons
│   ├── components/
│   │   ├── Topbar/            # Mission header, UTC clock, status indicators, data export actions
│   │   ├── Telemetry/         # Primary telemetry metric cards (Altitude, Pressure, Battery, GPS)
│   │   ├── Graphs/            # Real-time Chart.js telemetry streaming and export controls
│   │   ├── TrackingMap/       # Leaflet GIS dark map with trajectory path and landing radius
│   │   ├── Orientation/       # Three.js 3D WebGL attitude visualizer (Roll, Pitch, Yaw)
│   │   ├── Camera/            # MediaDevices optical payload stream viewer
│   │   ├── MissionControls/   # Safety-guarded telecommand execution panel
│   │   ├── ErrorSystem/       # 4-Digit aerospace diagnostic status indicators
│   │   └── Layout/            # Single-screen 100vh grid layout container
│   ├── hooks/
│   │   ├── useWebSerial.ts    # Web Serial API manager for physical USB COM ports
│   │   ├── useCameraFeed.ts   # Media stream camera controller
│   │   └── useAudioAlerts.ts  # Web Audio API sound synthesizer
│   ├── services/
│   │   ├── telemetrySimulator.ts  # CanSat atmospheric flight physics simulator
│   │   ├── telemetryService.ts    # Central packet router and event dispatcher
│   │   ├── exportService.ts       # CSV, JSON, and PNG canvas export engine
│   │   └── audioService.ts        # Oscillator audio alert generator
│   ├── store/
│   │   └── useTelemetryStore.ts   # Central Zustand state store for packet streams and logs
│   ├── types/
│   │   └── telemetry.ts           # TypeScript interfaces for telemetry packets and diagnostics
│   ├── utils/
│   │   └── formatters.ts          # Unit conversion, UTC timestamping, and MET formatters
│   ├── App.tsx                # Root application container
│   ├── main.tsx               # Entry point script
│   └── index.css              # Custom styling, Tailwind directives, and map dark theme overrides
├── public/                    # Static public resources
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compilation setup
└── vite.config.ts             # Vite build configuration
```

---

## Hardware Serial Connectivity

OrbitOps GCS includes native Web Serial API integration for receiving telemetry directly from physical RF receiver ground station hardware over USB.

### Connecting Hardware Ground Receivers (ESP32 / Arduino / LoRa)

1. Connect your MCU ground node (e.g. ESP32 attached to a LoRa SX1276 or nRF24L01 module) via USB COM port.
2. Within OrbitOps GCS, click **Connect Hardware**.
3. Select your serial port and configure the baud rate (default: `115200`).
4. Incoming serial telemetry strings automatically map into the central Zustand store for real-time visualization.

### Standard Telemetry JSON Packet Schema

```json
{
  "timestamp": 1722000000000,
  "altitude": 450.2,
  "pressure": 960.5,
  "temperature": 18.4,
  "battery": 4.12,
  "latitude": 28.5721,
  "longitude": -80.6480,
  "roll": 2.1,
  "pitch": -0.8,
  "yaw": 145.3,
  "descentRate": 3.2,
  "systemStatus": "NOMINAL"
}
```

---

## Local Development & Setup

### Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm**: Version `9.0.0` or higher

### Installation Procedure

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/OrbitOps.git
   cd OrbitOps
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch Local Development Server**
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://localhost:3000` (or designated port).

4. **Build Production Bundle**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## Future Enhancements & Scope

- **Multi-Satellite Fleet Support**: Toggle between multiple active satellites and ground receivers.
- **Cloud Telemetry Gateway**: Native WebSockets and MQTT integration for remote cloud ground stations.
- **Orbital Pass Prediction (SGP4 / TLE)**: TLE satellite tracking and antenna azimuth/elevation auto-pointing.
- **Doppler Shift Correction**: Real-time frequency shift calculation for receiver hardware.

---

## License & Acknowledgements

Developed for research and educational engineering as part of an **Aerospace & Space Technology Internship**.

- Conceptual design inspired by telemetry systems at **NASA**, **SpaceX**, **ISRO**, and **ESA**.
- Geospatial mapping powered by © [OpenStreetMap](https://www.openstreetmap.org/) contributors and [CartoDB](https://carto.com/).
