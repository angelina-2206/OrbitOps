import React from 'react';
import { Activity } from 'lucide-react';

interface HealthGaugeProps {
  label: string;
  value: number;
  color: string;
}

const CircularGauge: React.FC<HealthGaugeProps> = ({ label, value, color }) => {
  const radius = 24;
  const strokeWidth = 5;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background track circle */}
          <circle
            stroke="#1F2937"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated value circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute font-orbitron font-bold text-xs text-slate-100">
          {value}%
        </span>
      </div>
      <span className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export const SystemHealthPanel: React.FC = () => {
  const healthData = [
    { label: 'COMMS', value: 98, color: '#00FF84' },
    { label: 'AVIONICS', value: 97, color: '#00FF84' },
    { label: 'SENSORS', value: 95, color: '#FACC15' },
    { label: 'POWER', value: 80, color: '#F97316' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#1F2937] mb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">SYSTEM HEALTH</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 items-center justify-items-center gap-1">
        {healthData.map((item) => (
          <CircularGauge
            key={item.label}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};
