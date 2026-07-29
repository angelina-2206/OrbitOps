import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { telemetrySimulator } from '../../services/telemetrySimulator';
import { toast } from 'sonner';

export const MissionControls: React.FC = () => {
  const { addLog, resetPackets, setErrorCode } = useTelemetryStore();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const handleAction = (actionName: string, executeFn: () => void, requiresConfirm = true) => {
    if (requiresConfirm && confirmAction !== actionName) {
      setConfirmAction(actionName);
      toast.warning(`Confirm ${actionName}? Click again to execute safe command.`);
      setTimeout(() => setConfirmAction(null), 4000);
      return;
    }

    executeFn();
    setConfirmAction(null);
  };

  const handleDeployPayload = () => {
    telemetrySimulator.triggerPayloadSeparation();
    toast.success('Command Sent: PAYLOAD DEPLOYED');
    addLog('SUCCESS', 'Safety switch triggered: Payload deployed.');
  };

  const handleEmergencyParachute = () => {
    telemetrySimulator.triggerParachuteDeployment();
    toast.error('EMERGENCY COMMAND: PARACHUTE DEPLOYED');
    addLog('ERROR', 'Emergency manual override: Parachute ejection executed.');
  };

  const handleRedundantSystem = () => {
    toast.info('Command Sent: REDUNDANT FLIGHT COMPUTER ENGAGED');
    addLog('INFO', 'Switched primary telemetry bus to redundant backup MCU.');
  };

  const handleReconnect = () => {
    toast.success('Comms Link Reconnected');
    addLog('SUCCESS', 'Comms bus re-synchronized with ground transceiver.');
  };

  const handleResetMission = () => {
    resetPackets();
    toast.info('Mission Simulation Reset');
  };

  const handleShutdown = () => {
    setErrorCode('1111');
    toast.error('SHUTDOWN SEQUENCE INITIATED');
    addLog('ERROR', 'Emergency Ground System Shutdown Command Executed.');
  };

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/30 p-0.5 flex items-center justify-center text-[#00D4FF]">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
              <line x1="8" y1="9" x2="16" y2="9" strokeWidth="1.8" />
              <line x1="8" y1="13" x2="12" y2="13" strokeWidth="1.8" />
              <circle cx="16" cy="15" r="1.5" fill="#00FF84" />
            </svg>
          </div>
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            MISSION CONTROL
          </span>
        </div>
      </div>

      {/* 2x3 Grid Command Buttons with Realistic Micro-Schematics */}
      <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
        {/* Deploy Payload */}
        <button
          onClick={() => handleAction('DEPLOY PAYLOAD', handleDeployPayload, false)}
          className="bg-[#111827] hover:bg-[#00D4FF]/10 border border-[#00D4FF]/30 hover:border-[#00D4FF] rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-[#00D4FF] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#070B14] border border-[#00D4FF]/40 p-1 flex items-center justify-center shadow-cyan-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 12 2 L 17 8 L 17 18 L 7 18 L 7 8 Z" strokeWidth="1.5" />
              <line x1="12" y1="2" x2="12" y2="12" />
              <circle cx="12" cy="15" r="1.5" fill="#00D4FF" />
            </svg>
          </div>
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            DEPLOY PAYLOAD
          </span>
        </button>

        {/* Emergency Parachute */}
        <button
          onClick={() => handleAction('EMERGENCY CHUTE', handleEmergencyParachute, true)}
          className={`border rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-amber-400 group ${
            confirmAction === 'EMERGENCY CHUTE'
              ? 'bg-amber-500/30 border-amber-500 animate-pulse'
              : 'bg-[#111827] hover:bg-amber-500/10 border-amber-500/30 hover:border-amber-500'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-[#070B14] border border-amber-500/40 p-1 flex items-center justify-center shadow-amber-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 4 12 C 4 6 20 6 20 12 C 20 12 16 12 12 12 C 8 12 4 12 4 12 Z" fill="currentColor" fillOpacity="0.2" strokeWidth="1.5" />
              <line x1="4" y1="12" x2="12" y2="21" strokeWidth="1.2" />
              <line x1="20" y1="12" x2="12" y2="21" strokeWidth="1.2" />
              <circle cx="12" cy="21" r="1.5" fill="#FFC857" />
            </svg>
          </div>
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            {confirmAction === 'EMERGENCY CHUTE' ? 'CONFIRM CHUTE' : 'EMERGENCY CHUTE'}
          </span>
        </button>

        {/* Redundant Sys */}
        <button
          onClick={() => handleAction('REDUNDANT SYS', handleRedundantSystem, false)}
          className="bg-[#111827] hover:bg-purple-500/10 border border-purple-500/30 hover:border-purple-500 rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-purple-400 group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#070B14] border border-purple-500/40 p-1 flex items-center justify-center shadow-purple-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5" />
              <line x1="9" y1="2" x2="9" y2="5" strokeWidth="1.5" />
              <line x1="15" y1="2" x2="15" y2="5" strokeWidth="1.5" />
              <rect x="9" y="9" width="6" height="6" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            REDUNDANT SYS
          </span>
        </button>

        {/* Reconnect */}
        <button
          onClick={() => handleAction('RECONNECT', handleReconnect, false)}
          className="bg-[#111827] hover:bg-[#00FF84]/10 border border-[#00FF84]/30 hover:border-[#00FF84] rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-[#00FF84] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#070B14] border border-[#00FF84]/40 p-1 flex items-center justify-center shadow-green-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
              <circle cx="12" cy="12" r="4" strokeDasharray="1 1" />
              <circle cx="12" cy="12" r="2" fill="#00FF84" />
            </svg>
          </div>
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            RECONNECT
          </span>
        </button>

        {/* Reset Mission */}
        <button
          onClick={() => handleAction('RESET MISSION', handleResetMission, false)}
          className="bg-[#111827] hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500 rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-cyan-400 group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#070B14] border border-cyan-500/40 p-1 flex items-center justify-center shadow-cyan-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 12 3 A 9 9 0 1 1 3 12" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 12 3 L 8 7 M 12 3 L 8 -1" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            RESET MISSION
          </span>
        </button>

        {/* Shutdown */}
        <button
          onClick={() => handleAction('SHUTDOWN', handleShutdown, true)}
          className={`border rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-red-400 group ${
            confirmAction === 'SHUTDOWN'
              ? 'bg-red-500/30 border-red-500 animate-pulse'
              : 'bg-[#111827] hover:bg-red-500/10 border-red-500/30 hover:border-red-500'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-[#070B14] border border-red-500/40 p-1 flex items-center justify-center shadow-red-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 18.36 6.64 A 9 9 0 1 1 5.64 6.64" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="12" y1="2" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            {confirmAction === 'SHUTDOWN' ? 'CONFIRM SHUTDOWN' : 'SHUTDOWN'}
          </span>
        </button>
      </div>
    </div>
  );
};
