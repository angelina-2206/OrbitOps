import React, { useEffect, useState } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { Topbar } from '../Topbar/Topbar';
import { TelemetryPanel } from '../Telemetry/TelemetryPanel';
import { GraphsPanel } from '../Graphs/GraphsPanel';
import { TrackingMap } from '../TrackingMap/TrackingMap';
import { MissionControls } from '../MissionControls/MissionControls';
import { OrientationViewer } from '../Orientation/OrientationViewer';
import { CameraFeed } from '../Camera/CameraFeed';
import { ErrorSystemPanel } from '../ErrorSystem/ErrorSystemPanel';
import { MissionTimeline } from '../Timeline/MissionTimeline';
import { SystemHealthPanel } from '../Health/SystemHealthPanel';
import { EventLogPanel } from '../Logs/EventLogPanel';
import { FooterBar } from './FooterBar';
import { CommsModal } from '../Modals/CommsModal';
import { ProfileModal } from '../Modals/ProfileModal';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { telemetrySimulator } from '../../services/telemetrySimulator';
import { toast } from 'sonner';

export const DashboardLayout: React.FC = () => {
  const { isStreaming, pushPacket, setShowDocCenter } = useTelemetryStore();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCommsOpen, setIsCommsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [highlightedPanel, setHighlightedPanel] = useState<string | null>(null);

  // Telemetry 1Hz update timer loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isStreaming) {
      intervalId = setInterval(() => {
        const packet = telemetrySimulator.generateNextPacket();
        pushPacket(packet);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isStreaming, pushPacket]);

  const handleNavigate = (id: string) => {
    setActiveTab(id);

    if (id === 'docs') {
      setShowDocCenter(true);
      toast.info('Opening Documentation Center');
      return;
    }

    if (id === 'comms') {
      setIsCommsOpen(true);
      toast.info('Opening Comms Transceiver Control');
      return;
    }

    if (id === 'user') {
      setIsProfileOpen(true);
      toast.info('Opening Ground Station Operator Profile');
      return;
    }

    if (id === 'settings') {
      toast.info('System Settings: Hardware serial @ 115200 baud | Audio alarm enabled');
      return;
    }

    if (id === 'dashboard') {
      const scrollArea = document.getElementById('dashboard-scroll-area');
      if (scrollArea) {
        scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
      }
      toast.success('Navigated to Top Overview');
      return;
    }

    // Smooth scroll to target panel
    const element = document.getElementById(`panel-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedPanel(id);
      setTimeout(() => setHighlightedPanel(null), 2500);
    }
  };

  const getHighlightClass = (id: string) => {
    return highlightedPanel === id
      ? 'ring-2 ring-[#00D4FF] shadow-cyan-glow transition-all duration-300 scale-[1.01]'
      : 'transition-all duration-300';
  };

  return (
    <div className="h-screen w-screen flex bg-[#070B14] text-slate-100 font-space select-none overflow-hidden">
      {/* Left Navigation Sidebar */}
      <LeftSidebar activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#070B14]">
        {/* Topbar Header */}
        <Topbar />

        {/* Dashboard Grid Container */}
        <main
          id="dashboard-scroll-area"
          className="flex-1 overflow-y-auto p-3 grid grid-cols-12 gap-3 auto-rows-min min-h-0 custom-scrollbar"
        >
          {/* Row 1 & 2 Left Column: Telemetry Overview */}
          <div
            id="panel-telemetry"
            className={`col-span-12 xl:col-span-3 xl:row-span-2 min-h-[580px] ${getHighlightClass('telemetry')}`}
          >
            <TelemetryPanel />
          </div>

          {/* Row 1 Middle: Real-Time Graphs */}
          <div
            id="panel-graphs"
            className={`col-span-12 xl:col-span-5 min-h-[360px] ${getHighlightClass('graphs')}`}
          >
            <GraphsPanel />
          </div>

          {/* Row 1 Right: CanSat GPS Tracking */}
          <div
            id="panel-map"
            className={`col-span-12 xl:col-span-4 min-h-[360px] ${getHighlightClass('map')}`}
          >
            <TrackingMap />
          </div>

          {/* Row 2 Middle-Left: Mission Control */}
          <div
            id="panel-controls"
            className={`col-span-12 md:col-span-6 xl:col-span-3 min-h-[320px] ${getHighlightClass('controls')}`}
          >
            <MissionControls />
          </div>

          {/* Row 2 Middle-Center: 3D CubeSat Attitude */}
          <div
            id="panel-attitude"
            className={`col-span-12 md:col-span-6 xl:col-span-3 min-h-[320px] ${getHighlightClass('attitude')}`}
          >
            <OrientationViewer />
          </div>

          {/* Row 2 Middle-Right: CanSat Optical Feed */}
          <div
            id="panel-camera"
            className={`col-span-12 xl:col-span-3 min-h-[320px] ${getHighlightClass('camera')}`}
          >
            <CameraFeed />
          </div>

          {/* Row 3 Bottom Grid Items */}
          {/* Item 1: Mission Timeline */}
          <div
            id="panel-timeline"
            className={`col-span-12 md:col-span-6 xl:col-span-3 min-h-[160px] ${getHighlightClass('timeline')}`}
          >
            <MissionTimeline />
          </div>

          {/* Item 2: 4-Digit Error Code */}
          <div
            id="panel-diagnostics"
            className={`col-span-12 md:col-span-6 xl:col-span-3 min-h-[160px] ${getHighlightClass('diagnostics')}`}
          >
            <ErrorSystemPanel />
          </div>

          {/* Item 3: System Health Gauges */}
          <div
            id="panel-health"
            className={`col-span-12 md:col-span-6 xl:col-span-3 min-h-[160px] ${getHighlightClass('health')}`}
          >
            <SystemHealthPanel />
          </div>

          {/* Item 4: Real-Time Event Audit Log */}
          <div
            id="panel-logs"
            className={`col-span-12 md:col-span-6 xl:col-span-3 min-h-[160px] ${getHighlightClass('logs')}`}
          >
            <EventLogPanel />
          </div>
        </main>

        {/* Footer Status Bar */}
        <FooterBar />
      </div>

      {/* Interactive Modals */}
      <CommsModal isOpen={isCommsOpen} onClose={() => setIsCommsOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};
