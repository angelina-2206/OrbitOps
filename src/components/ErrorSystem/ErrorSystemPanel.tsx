import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { parseErrorCode } from '../../utils/formatters';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ErrorSystemPanel: React.FC = () => {
  const { currentPacket, manualErrorCode, setErrorCode } = useTelemetryStore();
  const errorCode = currentPacket?.errorCode || manualErrorCode || '0000';
  const diagnostics = parseErrorCode(errorCode);

  const digits = errorCode.padStart(4, '0').split('');

  const presetCodes = ['0000', '1000', '0100', '0010', '0001', '1111'];

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      {/* Header & Quick Code Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            4-DIGIT ERROR CODE
          </span>
        </div>

        {/* Test Code Selector Buttons */}
        <div className="flex items-center space-x-1 font-mono text-[9px]">
          {presetCodes.map((code) => (
            <button
              key={code}
              onClick={() => setErrorCode(code)}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                errorCode === code
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/50 font-bold'
                  : 'bg-[#111827] text-slate-400 border-[#1F2937] hover:text-slate-200'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Digits & Subsystem Status */}
      <div className="flex-1 flex items-center justify-between gap-3">
        {/* Large 4 Digit Display */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-1.5">
          <div className="flex items-center space-x-2">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className={`w-10 h-12 rounded-lg border flex items-center justify-center font-orbitron font-bold text-2xl shadow-inner ${
                  digit === '0'
                    ? 'bg-[#111827] text-[#00FF84] border-[#00FF84]/40 shadow-green-glow'
                    : 'bg-red-500/20 text-red-400 border-red-500/50 shadow-red-glow animate-pulse'
                }`}
              >
                {digit}
              </div>
            ))}
          </div>
          <p
            className={`font-mono text-[10px] font-bold tracking-wider ${
              errorCode === '0000' ? 'text-[#00FF84]' : 'text-red-400'
            }`}
          >
            {errorCode === '0000' ? 'ALL SYSTEMS NOMINAL' : 'ANOMALY DETECTED'}
          </p>
        </div>

        {/* 4 Subsystem Status Badges */}
        <div className="grid grid-cols-4 gap-1.5 font-mono text-[9px]">
          {/* Digit 1: Descent */}
          <div
            className={`p-1.5 rounded-lg border text-center ${
              diagnostics.descentRateAnomaly
                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                : 'bg-[#111827] text-[#00FF84] border-[#1F2937]'
            }`}
          >
            <p className="text-slate-400 text-[8px]">1 DESCENT</p>
            <p className="font-orbitron font-bold text-xs mt-0.5">
              {diagnostics.descentRateAnomaly ? 'FAIL' : 'OK'}
            </p>
          </div>

          {/* Digit 2: GPS */}
          <div
            className={`p-1.5 rounded-lg border text-center ${
              diagnostics.gpsLoss
                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                : 'bg-[#111827] text-[#00FF84] border-[#1F2937]'
            }`}
          >
            <p className="text-slate-400 text-[8px]">2 GPS</p>
            <p className="font-orbitron font-bold text-xs mt-0.5">
              {diagnostics.gpsLoss ? 'FAIL' : 'OK'}
            </p>
          </div>

          {/* Digit 3: Payload */}
          <div
            className={`p-1.5 rounded-lg border text-center ${
              diagnostics.payloadSeparated
                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                : 'bg-[#111827] text-[#00FF84] border-[#1F2937]'
            }`}
          >
            <p className="text-slate-400 text-[8px]">3 PAYLOAD</p>
            <p className="font-orbitron font-bold text-xs mt-0.5">
              {diagnostics.payloadSeparated ? 'SEP' : 'OK'}
            </p>
          </div>

          {/* Digit 4: Parachute */}
          <div
            className={`p-1.5 rounded-lg border text-center ${
              diagnostics.parachuteDeployed
                ? 'bg-red-500/20 text-red-400 border-red-500/50'
                : 'bg-[#111827] text-[#00FF84] border-[#1F2937]'
            }`}
          >
            <p className="text-slate-400 text-[8px]">4 PARACHUTE</p>
            <p className="font-orbitron font-bold text-xs mt-0.5">
              {diagnostics.parachuteDeployed ? 'DEP' : 'OK'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
