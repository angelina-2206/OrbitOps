import React, { useState } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { telemetrySimulator } from '../../services/telemetrySimulator';
import {
  Rocket,
  ShieldAlert,
  Cpu,
  RefreshCw,
  RotateCcw,
  Power,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
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
          <SlidersHorizontal className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            MISSION CONTROL
          </span>
        </div>
      </div>

      {/* 2x3 Grid Command Buttons */}
      <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
        {/* Deploy Payload */}
        <button
          onClick={() => handleAction('DEPLOY PAYLOAD', handleDeployPayload, false)}
          className="bg-[#111827] hover:bg-[#00D4FF]/10 border border-[#00D4FF]/30 hover:border-[#00D4FF] rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-[#00D4FF] group"
        >
          <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
          <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            {confirmAction === 'EMERGENCY CHUTE' ? 'CONFIRM CHUTE' : 'EMERGENCY CHUTE'}
          </span>
        </button>

        {/* Redundant Sys */}
        <button
          onClick={() => handleAction('REDUNDANT SYS', handleRedundantSystem, false)}
          className="bg-[#111827] hover:bg-purple-500/10 border border-purple-500/30 hover:border-purple-500 rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-purple-400 group"
        >
          <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            REDUNDANT SYS
          </span>
        </button>

        {/* Reconnect */}
        <button
          onClick={() => handleAction('RECONNECT', handleReconnect, false)}
          className="bg-[#111827] hover:bg-[#00FF84]/10 border border-[#00FF84]/30 hover:border-[#00FF84] rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-[#00FF84] group"
        >
          <RefreshCw className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            RECONNECT
          </span>
        </button>

        {/* Reset Mission */}
        <button
          onClick={() => handleAction('RESET MISSION', handleResetMission, false)}
          className="bg-[#111827] hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500 rounded-lg p-2.5 flex flex-col items-center justify-center space-y-1.5 transition-all text-cyan-400 group"
        >
          <RotateCcw className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
          <Power className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-orbitron font-bold text-[10px] text-center tracking-wider">
            {confirmAction === 'SHUTDOWN' ? 'CONFIRM SHUTDOWN' : 'SHUTDOWN'}
          </span>
        </button>
      </div>
    </div>
  );
};
