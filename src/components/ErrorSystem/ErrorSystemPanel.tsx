import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { parseErrorCode } from '../../utils/formatters';
import { ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ErrorSystemPanel: React.FC = () => {
  const { currentPacket, manualErrorCode, setErrorCode } = useTelemetryStore();
  const errorCode = currentPacket?.errorCode || manualErrorCode || '0000';
  const diagnostics = parseErrorCode(errorCode);

  const digits = errorCode.padStart(4, '0').split('');

  const presetCodes = [
    { code: '0000', label: 'NOMINAL' },
    { code: '1000', label: 'DESCENT' },
    { code: '0100', label: 'GPS' },
    { code: '0010', label: 'PAYLOAD' },
    { code: '0001', label: 'PARACHUTE' },
    { code: '1111', label: 'CRITICAL' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      {/* Header & Preset Error Selector */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            4-DIGIT ERROR DIAGNOSTICS
          </span>
        </div>

        {/* Quick Test Preset Selector Dropdown */}
        <select
          value={errorCode}
          onChange={(e) => setErrorCode(e.target.value)}
          className="bg-[#111827] border border-[#1F2937] text-slate-300 text-[10px] rounded px-2 py-0.5 font-mono outline-none"
        >
          {presetCodes.map((p) => (
            <option key={p.code} value={p.code}>
              {p.code} ({p.label})
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col justify-between space-y-2 font-mono">
        {/* Large 4-Digit Display & Main Status Banner */}
        <div className="flex items-center justify-between bg-[#0A0F1A] p-2 rounded-xl border border-[#1F2937]">
          {/* 4 Digit Boxes */}
          <div className="flex items-center space-x-2">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className={`w-9 h-11 rounded-lg border flex flex-col items-center justify-center font-orbitron font-extrabold text-xl shadow-inner ${
                  digit === '0'
                    ? 'bg-[#111827] text-[#00FF84] border-[#00FF84]/40 shadow-green-glow'
                    : 'bg-red-500/20 text-red-400 border-red-500/50 shadow-red-glow animate-pulse'
                }`}
              >
                <span>{digit}</span>
                <span className="text-[7px] font-mono text-slate-500 font-normal">D{idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Master Status Text Badge */}
          <div className="text-right pl-2">
            <span className="text-[9px] text-slate-500 font-mono block">DIAGNOSTIC STATUS</span>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-orbitron border mt-0.5 ${
                errorCode === '0000'
                  ? 'bg-[#00FF84]/10 text-[#00FF84] border-[#00FF84]/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
              }`}
            >
              {errorCode === '0000' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-[#00FF84]" />
                  <span>NOMINAL</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>ANOMALY</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 4 Subsystem Status Breakdown Grid (2x2 Layout) */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {/* Digit 1: Descent Rate */}
          <div
            className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
              diagnostics.descentRateAnomaly
                ? 'bg-red-500/10 text-red-400 border-red-500/40'
                : 'bg-[#111827] text-slate-300 border-[#1F2937]'
            }`}
          >
            <span className="text-slate-400 text-[9px]">D1 DESCENT</span>
            <span
              className={`font-orbitron font-bold text-[10px] px-1.5 py-0.5 rounded ${
                diagnostics.descentRateAnomaly
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30'
              }`}
            >
              {diagnostics.descentRateAnomaly ? 'FAIL' : 'OK'}
            </span>
          </div>

          {/* Digit 2: GPS Lock */}
          <div
            className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
              diagnostics.gpsLoss
                ? 'bg-red-500/10 text-red-400 border-red-500/40'
                : 'bg-[#111827] text-slate-300 border-[#1F2937]'
            }`}
          >
            <span className="text-slate-400 text-[9px]">D2 GPS LOCK</span>
            <span
              className={`font-orbitron font-bold text-[10px] px-1.5 py-0.5 rounded ${
                diagnostics.gpsLoss
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30'
              }`}
            >
              {diagnostics.gpsLoss ? 'LOSS' : 'OK'}
            </span>
          </div>

          {/* Digit 3: Payload Bus */}
          <div
            className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
              diagnostics.payloadSeparated
                ? 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/40'
                : 'bg-[#111827] text-slate-300 border-[#1F2937]'
            }`}
          >
            <span className="text-slate-400 text-[9px]">D3 PAYLOAD</span>
            <span
              className={`font-orbitron font-bold text-[10px] px-1.5 py-0.5 rounded ${
                diagnostics.payloadSeparated
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                  : 'bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30'
              }`}
            >
              {diagnostics.payloadSeparated ? 'SEP' : 'OK'}
            </span>
          </div>

          {/* Digit 4: Parachute */}
          <div
            className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between ${
              diagnostics.parachuteDeployed
                ? 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/40'
                : 'bg-[#111827] text-slate-300 border-[#1F2937]'
            }`}
          >
            <span className="text-slate-400 text-[9px]">D4 PARACHUTE</span>
            <span
              className={`font-orbitron font-bold text-[10px] px-1.5 py-0.5 rounded ${
                diagnostics.parachuteDeployed
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                  : 'bg-[#00FF84]/10 text-[#00FF84] border border-[#00FF84]/30'
              }`}
            >
              {diagnostics.parachuteDeployed ? 'DEP' : 'OK'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
