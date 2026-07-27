# OrbitOps GCS (Ground Control Software)

> **Mission Operations. Real-Time Telemetry. Complete Control.**

OrbitOps GCS is a production-quality real-time Ground Control Software designed for CanSat missions, CubeSats, and aerospace launch systems inspired by NASA Mission Control, SpaceX Ground Systems, ISRO Satellite Operations, and ESA Flight Operations.

---

## 🚀 Key Features & Capabilities

- **Single-Screen Aerospace Viewport Layout (`100vh`)**: Zero vertical scrolling mission dashboard with high-density telemetry displays, quick action controls, and real-time visualization panels.
- **1Hz Real-Time CanSat Telemetry Simulator**: Built-in realistic flight physics engine simulating atmospheric pressure lapse rate, temperature drop, battery discharge curve, GPS drift, and descent dynamics.
- **Real-Time Chart.js Streaming**: Continuously updating graphs for Altitude, Pressure, Temperature, Battery Voltage, and Descent Rate with pause/resume, time window zoom (30s, 60s, 5m, All), and PNG image export.
- **Leaflet GIS Tracking Map**: Dark-themed map layer displaying launch pad base location, live CanSat position, predicted landing zone radius, flight trajectory path polyline, and auto-center tracking.
- **3D WebGL CubeSat Orientation Viewer**: Interactive 3D CubeSat model rendered with Three.js, animating live Roll, Pitch, and Yaw attitude telemetry in real-time.
- **Onboard Optical Camera Feed**: WebCam integration via browser `navigator.mediaDevices` API with camera device selector dropdown, recording indicator simulation, and fullscreen toggle.
- **Mission Control Action System**: Safety-controlled command buttons (`Deploy Payload`, `Emergency Parachute`, `Activate Redundant System`, `Reconnect`, `Reset Mission`, `Shutdown`) with confirmation dialogs and toast alerts.
- **4-Digit Health Diagnostics System**: Standardized 4-digit aerospace error codes (`D1 D2 D3 D4`) covering Descent Rate Anomaly, GPS Lock, Payload Separation, and Emergency Parachute status with Web Audio sound alerts.
- **Data Export Utilities**: One-click download of flight logs into CSV, JSON, and PNG graph formats.
- **Hardware Ready (Web Serial & WebSockets)**: Abstracted hardware provider interfaces for plug-and-play connection to Arduino, ESP32, MQTT gateways, or local serial RF telemetry receivers over Web Serial API.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18 + TypeScript + Vite
- **Styling & Aesthetics**: Tailwind CSS + Google Fonts (`Rajdhani`, `Outfit`, `Space Grotesk` & `Inter`) + Lucide React Icons
- **State Management**: Zustand
- **Real-Time Visualizations**: Chart.js + `react-chartjs-2`
- **GIS Tracking Map**: Leaflet + `react-leaflet`
- **3D WebGL Engine**: Three.js
- **Notification & Feedback**: Sonner + Web Audio API synthesizer

---

## 📁 Project Structure

```
src/
├── assets/                    # Static assets & icons
├── components/
│   ├── Topbar/                # Topbar header, UTC clock, status indicators, export actions
│   ├── Telemetry/             # Telemetry metrics cards (Altitude, Pressure, Battery, GPS, Euler)
│   ├── Graphs/                # Chart.js real-time graph stream with pause/resume & PNG export
│   ├── TrackingMap/           # Leaflet GIS dark map with flight path & landing zone
│   ├── Orientation/           # Three.js 3D WebGL CubeSat orientation viewer
│   ├── Camera/                # MediaDevices WebCam optical feed with device selector
│   ├── MissionControls/       # Deploy Payload, Parachute, Shutdown command buttons
│   ├── ErrorSystem/           # 4-Digit Aerospace diagnostic status indicators
│   └── Layout/                # 100vh single-screen grid container layout
├── hooks/
│   ├── useWebSerial.ts        # Web Serial API hook for Arduino/ESP32 COM port hardware
│   ├── useCameraFeed.ts       # WebCam media stream hook
│   └── useAudioAlerts.ts      # Web Audio alert synthesizer
├── services/
│   ├── telemetrySimulator.ts  # CanSat flight dynamics physics simulator
│   ├── telemetryService.ts    # Telemetry service layer & event bus
│   ├── exportService.ts       # CSV, JSON, and PNG canvas export engine
│   └── audioService.ts        # Web Audio API alert generator
├── store/
│   └── useTelemetryStore.ts   # Central Zustand store for telemetry packets & logs
├── types/
│   └── telemetry.ts           # TypeScript interfaces for telemetry packets & diagnostics
├── utils/
│   └── formatters.ts          # Unit conversion, UTC time, and mission time formatters
├── App.tsx                    # Root application component
├── main.tsx                   # React DOM render entrypoint
└── index.css                  # Custom Tailwind & Leaflet dark theme styling
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js 18+ and npm installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Ground Station Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view **OrbitOps GCS**.

### 3. Build for Production
```bash
npm run build
```

---

## 🔌 Hardware Serial & Hardware Integration

To connect OrbitOps GCS to an Arduino or ESP32 receiving NRF24L01 or LoRa telemetry over USB:
1. Connect your MCU via USB COM port.
2. In OrbitOps GCS, click **Connect Hardware** or use the `useWebSerial` hook in `src/hooks/useWebSerial.ts`.
3. Select your serial port and baud rate (default: `115200`).
4. Live packet streams will automatically map directly into the Zustand telemetry store.
