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
    { id: 'dashboard', icon: LayoutGrid, label: 'Full Dashboard' },
    { id: 'docs', icon: BookOpen, label: 'Documentation Center' },
    { id: 'comms', icon: Wifi, label: 'Comms Transceiver' },
    { id: 'map', icon: MapPin, label: 'GIS GPS Tracking' },
    { id: 'attitude', icon: Box, label: '3D CubeSat Attitude' },
    { id: 'camera', icon: Camera, label: 'Optical Camera Feed' },
    { id: 'diagnostics', icon: AlertTriangle, label: '4-Digit Error Diagnostics' },
    { id: 'graphs', icon: LineChart, label: 'Real-Time Telemetry Graphs' },
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
          const Icon = item.icon;
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
              <Icon className="w-5 h-5" />
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
        <User className="w-5 h-5" />
      </button>
    </aside>
  );
};
