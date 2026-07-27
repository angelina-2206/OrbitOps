import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { MissionState } from '../../types/telemetry';
import { Compass, CheckCircle2, Circle } from 'lucide-react';

interface Stage {
  id: MissionState;
  label: string;
  time: string;
}

export const MissionTimeline: React.FC = () => {
  const { currentPacket } = useTelemetryStore();
  const currentState = currentPacket?.missionState || 'PRE_LAUNCH';

  const stages: Stage[] = [
    { id: 'PRE_LAUNCH', label: 'LAUNCH', time: 'T+00:00:00' },
    { id: 'ASCENT', label: 'ASCENT', time: 'T+00:01:20' },
    { id: 'APOGEE', label: 'APOGEE', time: 'T+00:02:15' },
    { id: 'DESCENT', label: 'DESCENT', time: 'T+00:02:45' },
    { id: 'LANDED', label: 'PAYLOAD', time: 'T+00:03:20' },
    { id: 'LANDED', label: 'LANDED', time: 'T+00:03:44' },
  ];

  const getStageIndex = (state: MissionState) => {
    switch (state) {
      case 'PRE_LAUNCH': return 0;
      case 'ASCENT': return 1;
      case 'APOGEE': return 2;
      case 'DESCENT': return 3;
      case 'LANDED': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentState);

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">MISSION TIMELINE</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between px-2 relative">
        {/* Progress Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-4 h-0.5 bg-[#1F2937] z-0">
          <div
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00FF84] transition-all duration-500 shadow-cyan-glow"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {/* Milestone Steps */}
        {stages.map((stage, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#00FF84] border-[#00FF84] text-[#070B14] shadow-green-glow scale-110'
                    : isPassed
                    ? 'bg-[#00D4FF] border-[#00D4FF] text-[#070B14]'
                    : 'bg-[#111827] border-[#1F2937] text-slate-600'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-3 h-3 fill-current" />
                )}
              </div>

              <div className="text-center mt-2 font-mono">
                <p
                  className={`text-[10px] font-bold tracking-tight ${
                    isCurrent
                      ? 'text-[#00FF84]'
                      : isPassed
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-[9px] text-slate-500">{stage.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
