import React from 'react';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import {
  Radio,
  LayoutGrid,
  Wifi,
  MapPin,
  Box,
  Camera,
  AlertTriangle,
  LineChart,
  User,
  BookOpen
} from 'lucide-react';

interface LeftSidebarProps {
  activeTab: string;
  onNavigate: (id: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeTab, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Full Dashboard Overview',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="8" height="8" rx="2" strokeWidth="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="2" strokeWidth="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="2" strokeWidth="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="2" strokeWidth="1.5" />
          <circle cx="7" cy="7" r="1.5" fill="#00D4FF" />
        </svg>
      )
    },
    {
      id: 'docs',
      label: 'Mission Brief & Documentation',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 4 4 L 14 4 L 20 10 L 20 20 L 4 20 Z" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 14 4 L 14 10 L 20 10" strokeWidth="1.5" />
          <line x1="8" y1="12" x2="14" y2="12" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="16" x2="16" y2="16" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'comms',
      label: 'Comms Transceiver Interface',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
          <circle cx="12" cy="12" r="4" strokeDasharray="1 1" />
          <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.5" />
          <circle cx="12" cy="12" r="2" fill="#00FF84" />
        </svg>
      )
    },
    {
      id: 'map',
      label: 'GIS GPS Spatial Tracking',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
          <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.6" />
          <line x1="3" y1="12" x2="21" y2="12" strokeOpacity="0.6" />
          <path d="M 6 18 L 12 12 L 18 8" stroke="#00FF84" strokeWidth="1.5" strokeDasharray="2 1" />
          <circle cx="12" cy="12" r="2" fill="#FFC857" />
        </svg>
      )
    },
    {
      id: 'attitude',
      label: '3D CubeSat Attitude Kinematics',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 12 3 L 20 7 L 20 17 L 12 21 L 4 17 L 4 7 Z" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="12" y1="3" x2="12" y2="12" />
          <line x1="4" y1="7" x2="12" y2="12" />
          <line x1="20" y1="7" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: 'camera',
      label: 'Optical Camera Feed',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 3 7 L 3 3 L 7 3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 17 3 L 21 3 L 21 7" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 3 17 L 3 21 L 7 21" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 17 21 L 21 21 L 21 17" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="5" stroke="#00D4FF" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="#00FF84" />
        </svg>
      )
    },
    {
      id: 'diagnostics',
      label: '4-Digit Error Diagnostics',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
          <path d="M 7 10 L 12 10 M 7 14 L 17 14" strokeWidth="1.8" />
          <circle cx="15" cy="10" r="1.2" fill="#FFC857" />
        </svg>
      )
    },
    {
      id: 'graphs',
      label: 'Real-Time Telemetry Graphs',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 3 3 L 3 21 L 21 21" strokeWidth="1.5" />
          <path d="M 3 17 Q 8 6 13 13 T 21 7" stroke="#00FF84" strokeWidth="1.8" fill="none" />
          <circle cx="13" cy="13" r="1.5" fill="#00FF84" />
        </svg>
      )
    },
  ];

  return (
    <aside className="w-14 bg-[#070B14] border-r border-[#1F2937] flex flex-col items-center py-3 select-none flex-shrink-0 z-30 font-space">
      {/* Brand Icon at Top */}
      <div
        onClick={() => onNavigate('dashboard')}
        title="OrbitOps GCS Home"
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#111827] border border-[#00D4FF]/40 text-[#00D4FF] shadow-cyan-glow mb-6 cursor-pointer hover:scale-105 transition-transform"
      >
        <OrbitOpsLogo size={26} />
      </div>

      {/* Navigation Icon List */}
      <div className="flex-1 flex flex-col space-y-4 w-full items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              className={`relative p-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
              }`}
            >
              {item.svg}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00D4FF] rounded-r-full shadow-cyan-glow" />
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Icon at Bottom */}
      <button
        onClick={() => onNavigate('user')}
        title="Operator Profile"
        className={`p-2.5 rounded-xl transition-all ${
          activeTab === 'user'
            ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 shadow-cyan-glow'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
          <path d="M 4 20 C 4 16 8 15 12 15 C 16 15 20 16 20 20" strokeWidth="1.5" />
        </svg>
      </button>
    </aside>
  );
};
