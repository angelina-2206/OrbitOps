import React from 'react';

interface OrbitOpsLogoProps {
  className?: string;
  size?: number;
}

export const OrbitOpsLogo: React.FC<OrbitOpsLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform hover:scale-105 ${className}`}
      style={{ filter: 'drop-shadow(0px 0px 8px rgba(0, 212, 255, 0.7))' }}
    >
      <defs>
        <radialGradient id="planetGradient" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="60%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0066CC" />
        </radialGradient>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FF84" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0077FF" />
        </linearGradient>
      </defs>

      {/* Secondary Orbital Ring Path */}
      <ellipse
        cx="50"
        cy="50"
        rx="39"
        ry="13"
        fill="none"
        stroke="#00D4FF"
        strokeWidth="2"
        strokeOpacity="0.45"
        transform="rotate(35 50 50)"
      />

      {/* Main Orbital Ellipse Ring */}
      <ellipse
        cx="50"
        cy="50"
        rx="41"
        ry="16"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="3.8"
        transform="rotate(-28 50 50)"
      />

      {/* Satellite Node 1 (Top Left) */}
      <circle cx="16" cy="32" r="4" fill="#00FF84" />
      <line x1="16" y1="32" x2="10" y2="26" stroke="#00FF84" strokeWidth="2.5" strokeLinecap="round" />

      {/* Satellite Node 2 (Bottom Right) */}
      <circle cx="84" cy="68" r="4" fill="#00D4FF" />
      <line x1="84" y1="68" x2="90" y2="74" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Central Core Satellite Planet */}
      <circle cx="50" cy="50" r="17" fill="url(#planetGradient)" />

      {/* Inner Planet Atmosphere Ring */}
      <circle cx="50" cy="50" r="17" fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Core Specular Light Curve */}
      <path
        d="M38 43 A13 13 0 0 1 58 39"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </svg>
  );
};
