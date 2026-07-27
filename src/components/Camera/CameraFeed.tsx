import React, { useState } from 'react';
import { Camera, Video, VideoOff, Maximize2, Circle, Camera as SnapIcon } from 'lucide-react';
import { toast } from 'sonner';

export const CameraFeed: React.FC = () => {
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
            CANSAT OPTICAL FEED
          </span>
        </div>

        {/* Camera Selector Dropdown */}
        <select
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="bg-[#111827] border border-[#1F2937] text-slate-300 text-[10px] rounded-md px-2 py-0.5 font-mono outline-none"
        >
          <option value="Camera 1">Camera 1 (WFOV)</option>
          <option value="Camera 2">Camera 2 (NFOV)</option>
        </select>
      </div>

      {/* Camera Feed Viewport */}
      <div className="flex-1 w-full rounded-lg overflow-hidden border border-[#1F2937] relative bg-[#000000] min-h-[160px] flex items-center justify-center">
        {isCameraActive ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Simulated Space Earth Optical Image Feed */}
            <img
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop"
              alt="CanSat Optical Space Feed"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Aerospace Corner HUD Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00D4FF]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00D4FF]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00D4FF]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00D4FF]" />

            {/* Live Recording Indicator Dot */}
            <div className="absolute top-3 right-3 flex items-center space-x-1 font-mono text-[10px] text-red-500 font-bold bg-black/60 px-2 py-0.5 rounded border border-red-500/40">
              <Circle className="w-2.5 h-2.5 fill-current animate-ping" />
              <span>REC</span>
            </div>

            {/* Bottom Floating Control Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <button
                onClick={handleCaptureSnapshot}
                className="p-1.5 rounded-md bg-black/70 hover:bg-black text-slate-200 border border-[#1F2937] transition-all"
                title="Snapshot Frame"
              >
                <SnapIcon className="w-3.5 h-3.5 text-[#00D4FF]" />
              </button>

              <button
                onClick={() => setIsCameraActive(false)}
                className="p-1.5 rounded-md bg-black/70 hover:bg-black text-slate-200 border border-[#1F2937] transition-all"
                title="Disable Camera"
              >
                <VideoOff className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 font-mono text-xs text-slate-400">
            <VideoOff className="w-8 h-8 text-slate-600" />
            <p>CAMERA FEED OFFLINE</p>
            <button
              onClick={() => setIsCameraActive(true)}
              className="px-3 py-1 rounded-md bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-[10px] font-bold"
            >
              ENABLE CAMERA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
