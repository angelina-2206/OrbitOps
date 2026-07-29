import React, { useState } from 'react';
import { OrbitOpsLogo } from '../Branding/OrbitOpsLogo';
import { ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface LeftSidebarProps {
  activeTab: string;
  onNavigate: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onNavigate,
  isCollapsed: externalCollapsed,
  onToggleCollapse: externalToggle
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = externalToggle || (() => setInternalCollapsed(!internalCollapsed));

  const navItems = [
    {
      id: 'dashboard',
      label: 'Full Dashboard',
      subtitle: 'System Overview',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      label: 'Documentation Center',
      subtitle: 'Mission Brief & Spec',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 4 4 L 14 4 L 20 10 L 20 20 L 4 20 Z" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 14 4 L 14 10 L 20 10" strokeWidth="1.5" />
          <line x1="8" y1="12" x2="14" y2="12" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="16" x2="16" y2="16" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'comms',
      label: 'Comms Transceiver',
      subtitle: 'Web Serial / RF Bus',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
          <circle cx="12" cy="12" r="4" strokeDasharray="1 1" />
          <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.5" />
          <circle cx="12" cy="12" r="2" fill="#00FF84" />
        </svg>
      )
    },
    {
      id: 'map',
      label: 'GIS GPS Tracking',
      subtitle: 'Leaflet Flight Map',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      label: '3D CubeSat Attitude',
      subtitle: 'WebGL Kinematics',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      subtitle: 'Payload Optics HUD',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      label: 'Error Diagnostics',
      subtitle: '4-Digit Hex Codes',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
          <path d="M 7 10 L 12 10 M 7 14 L 17 14" strokeWidth="1.8" />
          <circle cx="15" cy="10" r="1.2" fill="#FFC857" />
        </svg>
      )
    },
    {
      id: 'graphs',
      label: 'Telemetry Graphs',
      subtitle: 'Oscilloscope Curves',
      svg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 3 3 L 3 21 L 21 21" strokeWidth="1.5" />
          <path d="M 3 17 Q 8 6 13 13 T 21 7" stroke="#00FF84" strokeWidth="1.8" fill="none" />
          <circle cx="13" cy="13" r="1.5" fill="#00FF84" />
        </svg>
      )
    },
  ];

  return (
    <aside
      className={`relative bg-[#070B14] border-r border-[#1F2937] flex flex-col py-3 select-none flex-shrink-0 z-50 font-space transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-14 items-center px-1.5' : 'w-56 items-stretch px-3'
      }`}
    >
      {/* Top Header & Collapse Toggle Area */}
      <div className={`flex items-center mb-5 ${isCollapsed ? 'flex-col space-y-2.5 items-center' : 'justify-between'}`}>
        <div
          onClick={() => onNavigate('dashboard')}
          title="OrbitOps GCS Home"
          className={`flex items-center rounded-xl bg-[#111827] border border-[#00D4FF]/40 text-[#00D4FF] shadow-cyan-glow cursor-pointer hover:scale-[1.02] transition-all ${
            isCollapsed ? 'w-10 h-10 justify-center' : 'p-2 space-x-2.5 min-w-0'
          }`}
        >
          <OrbitOpsLogo size={24} />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-orbitron font-bold text-xs text-slate-100 tracking-wider flex items-center gap-1 leading-none">
                ORBIT<span className="text-[#00D4FF]">OPS</span>
              </h1>
              <p className="text-[8px] text-[#00FF84] font-mono mt-0.5 font-semibold">NAVIGATION BUS</p>
            </div>
          )}
        </div>

        {/* High-Visibility Collapse/Expand Arrow Toggle Button */}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Navigation Sidebar (Seek)' : 'Collapse Navigation Sidebar (Hide)'}
          className={`rounded-lg bg-[#111827] border border-[#00D4FF]/50 text-[#00D4FF] flex items-center justify-center shadow-cyan-glow hover:bg-[#00D4FF]/20 hover:scale-105 transition-all ${
            isCollapsed ? 'w-9 h-7' : 'w-8 h-8'
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-[#00D4FF]" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-[#00D4FF]" />
          )}
        </button>
      </div>

      {/* Navigation Item List */}
      <div className="flex-1 flex flex-col space-y-1.5 w-full overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`relative rounded-xl transition-all duration-200 flex items-center ${
                isCollapsed
                  ? 'p-2.5 justify-center'
                  : 'px-3 py-2 space-x-3 justify-start w-full'
              } ${
                isActive
                  ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827] border border-transparent'
              }`}
            >
              {item.svg}

              {!isCollapsed && (
                <div className="min-w-0 text-left">
                  <p className="font-orbitron font-bold text-xs truncate leading-none">{item.label}</p>
                  <p className="text-[9px] text-slate-500 font-mono truncate mt-0.5">{item.subtitle}</p>
                </div>
              )}

              {isActive && (
                <span
                  className={`absolute bg-[#00D4FF] rounded-r-full shadow-cyan-glow ${
                    isCollapsed
                      ? 'left-0 top-1/2 -translate-y-1/2 w-1 h-5'
                      : 'left-0 top-1/2 -translate-y-1/2 w-1 h-5'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Operator Profile Icon at Bottom */}
      <button
        onClick={() => onNavigate('user')}
        title="Operator Profile"
        className={`relative rounded-xl transition-all mt-2 flex items-center ${
          isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 space-x-3 justify-start w-full'
        } ${
          activeTab === 'user'
            ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 shadow-cyan-glow'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827] border border-transparent'
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
          <path d="M 4 20 C 4 16 8 15 12 15 C 16 15 20 16 20 20" strokeWidth="1.5" />
        </svg>

        {!isCollapsed && (
          <div className="min-w-0 text-left">
            <p className="font-orbitron font-bold text-xs truncate leading-none">Operator Profile</p>
            <p className="text-[9px] text-slate-500 font-mono truncate mt-0.5">Ground Station Commander</p>
          </div>
        )}
      </button>
    </aside>
  );
};
