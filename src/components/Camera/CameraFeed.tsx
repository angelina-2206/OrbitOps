import React, { useState } from 'react';
import { Camera, VideoOff, Circle, Camera as SnapIcon, Crosshair, Zap, Eye, ShieldCheck } from 'lucide-react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { toast } from 'sonner';

export const CameraFeed: React.FC = () => {
  const { currentPacket } = useTelemetryStore();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [selectedCamera, setSelectedCamera] = useState<string>('Camera 1');

  const handleCaptureSnapshot = () => {
    toast.success('Optical Frame Captured & Saved to Flight Log');
  };

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            OPTICAL PAYLOAD STREAM
          </span>
        </div>

        {/* Camera Selector Dropdown */}
        <select
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="bg-[#111827] border border-[#1F2937] text-slate-300 text-[10px] rounded-md px-2 py-0.5 font-mono outline-none"
        >
          <option value="Camera 1">Cam 1 (Wide FOV)</option>
          <option value="Camera 2">Cam 2 (Narrow FOV)</option>
        </select>
      </div>

      {/* Camera Feed Viewport */}
      <div className="flex-1 w-full rounded-lg overflow-hidden border border-[#1F2937] relative bg-[#000000] min-h-[180px] flex items-center justify-center">
        {isCameraActive ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Simulated Space Earth Optical Image Feed */}
            <img
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop"
              alt="CanSat Optical Space Feed"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Aerospace Corner HUD Reticles */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00D4FF]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00D4FF]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00D4FF]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00D4FF]" />

            {/* Center Crosshairs */}
            <div className="absolute pointer-events-none opacity-40 flex items-center justify-center">
              <Crosshair className="w-12 h-12 text-[#00D4FF]" />
            </div>

            {/* Target Tracking Box Simulation */}
            <div className="absolute top-1/3 left-1/3 w-24 h-24 border border-dashed border-[#00FF84] pointer-events-none rounded flex flex-col justify-between p-1 bg-[#00FF84]/5">
              <span className="text-[8px] font-mono text-[#00FF84] font-bold">TARGET LOCK</span>
              <span className="text-[8px] font-mono text-right text-[#00FF84]">{currentPacket?.altitude || 450}m</span>
            </div>

            {/* Top-Left Telemetry Overlay */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-[#1F2937] font-mono text-[9px] text-slate-300 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#00D4FF]">
                <Eye className="w-3 h-3 text-[#00D4FF]" />
                <span className="font-bold">OPTICAL STREAM 1080p</span>
              </div>
              <div className="flex gap-2 text-slate-400 text-[8px]">
                <span>30.0 FPS</span>
                <span>•</span>
                <span>BAT: {currentPacket?.batteryVoltage || 7.8}V</span>
              </div>
            </div>

            {/* Top-Right Live Recording Indicator */}
            <div className="absolute top-3 right-3 flex items-center space-x-1 font-mono text-[10px] text-red-500 font-bold bg-black/70 px-2 py-0.5 rounded border border-red-500/40">
              <Circle className="w-2 h-2 fill-current animate-ping" />
              <span>REC</span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <button
                onClick={handleCaptureSnapshot}
                className="p-1.5 rounded-md bg-black/75 hover:bg-black text-slate-200 border border-[#1F2937] transition-all flex items-center gap-1 font-mono text-[10px]"
                title="Snapshot Frame"
              >
                <SnapIcon className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>SNAP</span>
              </button>

              <div className="font-mono text-[9px] text-slate-300 bg-black/70 px-2 py-1 rounded border border-[#1F2937] hidden sm:block">
                ALT: {currentPacket?.altitude || 0}m | DIS: {currentPacket?.descentRate || 0}m/s
              </div>

              <button
                onClick={() => setIsCameraActive(false)}
                className="p-1.5 rounded-md bg-black/75 hover:bg-black text-slate-200 border border-[#1F2937] transition-all"
                title="Disable Camera"
              >
                <VideoOff className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 font-mono text-xs text-slate-400">
            <VideoOff className="w-8 h-8 text-slate-600" />
            <p>OPTICAL FEED OFFLINE</p>
            <button
              onClick={() => setIsCameraActive(true)}
              className="px-3 py-1 rounded-md bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-[10px] font-bold"
            >
              ENABLE CAMERA STREAM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
