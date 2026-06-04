"use client";
import React from "react";

const CITIES = [
  { x: 188, y: 148, name: "Patna", capital: true },
  { x: 188, y: 208, name: "Gaya", capital: false },
  { x: 348, y: 138, name: "Bhagalpur", capital: false },
  { x: 218, y: 80,  name: "Muzaffarpur", capital: false },
  { x: 278, y: 73,  name: "Darbhanga", capital: false },
  { x: 345, y: 73,  name: "Purnia", capital: false },
  { x: 122, y: 118, name: "Chapra", capital: false },
  { x: 288, y: 128, name: "Begusarai", capital: false },
];

const CONNECTIONS = [[0,1],[0,2],[0,3],[0,6],[3,4],[4,5],[7,2],[0,7]];

const PRODUCTS = [
  { emoji: "🎨", label: "Madhubani Art",   top: "4%",   left: "2%",  delay: "0s"   },
  { emoji: "🥻", label: "Bhagalpuri Silk", top: "6%",   right: "2%", delay: "0.9s" },
  { emoji: "🌾", label: "Makhana",         top: "44%",  right: "0%", delay: "1.7s" },
  { emoji: "🍬", label: "Khaja",           bottom:"14%",right: "3%", delay: "0.5s" },
  { emoji: "🍊", label: "Shahi Litchi",    bottom:"14%",left: "3%",  delay: "1.3s" },
  { emoji: "🪷", label: "Sujani Art",      top: "44%",  left: "0%",  delay: "2.1s" },
];

export default function BiharMap() {
  return (
    <div className="relative w-full">
      {/* Decorative soft blobs behind map */}
      <div className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-40 h-40 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] right-[20%] w-32 h-32 rounded-full bg-yellow-100/50 blur-2xl pointer-events-none" />

      {/* Floating product badges */}
      {PRODUCTS.map((p, i) => {
        const pos: React.CSSProperties = {};
        if (p.top)    pos.top    = p.top;
        if (p.bottom) pos.bottom = p.bottom;
        if (p.left)   pos.left   = p.left;
        if (p.right)  pos.right  = p.right;
        return (
          <div
            key={i}
            className="absolute z-20 flex items-center gap-1.5 bg-white rounded-2xl px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-md"
            style={{
              ...pos,
              border: "1px solid rgba(251,191,36,0.4)",
              animation: `floatBadge 4s ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          >
            <span className="text-base leading-none">{p.emoji}</span>
            <span className="hidden xl:inline whitespace-nowrap">{p.label}</span>
          </div>
        );
      })}

      {/* SVG Bihar Map */}
      <svg viewBox="30 5 445 320" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-auto">
        <defs>
          <filter id="lglow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="lcglow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Warm light fill for map */}
          <linearGradient id="lmfill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#fef3c7"/>
            <stop offset="50%"  stopColor="#fde68a" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.4"/>
          </linearGradient>
          {/* Drop shadow for map */}
          <filter id="mapshadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#f59e0b" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Outer soft halo */}
        <path
          d="M85,42 C120,18 185,12 248,16 C308,20 368,28 405,52 C428,68 424,92 418,116
             C410,140 392,155 368,164 C342,174 310,164 285,172 C260,180 248,200 228,212
             C205,225 178,226 152,220 C126,213 100,200 82,184
             C58,165 48,140 46,115 C44,88 52,62 85,42 Z"
          fill="none" stroke="#fbbf24" strokeWidth="20" strokeOpacity="0.12"
        />

        {/* Map body */}
        <path
          d="M85,42 C120,18 185,12 248,16 C308,20 368,28 405,52 C428,68 424,92 418,116
             C410,140 392,155 368,164 C342,174 310,164 285,172 C260,180 248,200 228,212
             C205,225 178,226 152,220 C126,213 100,200 82,184
             C58,165 48,140 46,115 C44,88 52,62 85,42 Z"
          fill="url(#lmfill)"
          filter="url(#mapshadow)"
        />

        {/* Map border */}
        <path
          d="M85,42 C120,18 185,12 248,16 C308,20 368,28 405,52 C428,68 424,92 418,116
             C410,140 392,155 368,164 C342,174 310,164 285,172 C260,180 248,200 228,212
             C205,225 178,226 152,220 C126,213 100,200 82,184
             C58,165 48,140 46,115 C44,88 52,62 85,42 Z"
          fill="none" stroke="#f59e0b" strokeWidth="2" filter="url(#lglow)">
          <animate attributeName="strokeOpacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
        </path>

        {/* Dotted internal texture lines */}
        <path
          d="M120,80 C160,60 220,58 270,62 C320,66 370,78 395,100"
          fill="none" stroke="#f59e0b" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="3 6"/>
        <path
          d="M100,130 C150,118 210,115 260,118 C320,122 370,130 400,145"
          fill="none" stroke="#f59e0b" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="3 6"/>
        <path
          d="M95,170 C140,165 195,162 240,164 C290,167 340,172 375,178"
          fill="none" stroke="#f59e0b" strokeWidth="0.6" strokeOpacity="0.18" strokeDasharray="3 6"/>

        {/* City connection lines */}
        {CONNECTIONS.map(([a, b], i) => (
          <line key={i}
            x1={CITIES[a].x} y1={CITIES[a].y}
            x2={CITIES[b].x} y2={CITIES[b].y}
            stroke="#d97706" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 5">
            <animate attributeName="strokeDashoffset" from="0" to="36"
              dur={`${3 + i * 0.4}s`} repeatCount="indefinite"/>
          </line>
        ))}

        {/* Cities */}
        {CITIES.map((city, i) => (
          <g key={city.name}>
            {/* Pulse ring */}
            <circle cx={city.x} cy={city.y} r="0" fill="#f59e0b" fillOpacity="0.3">
              <animate attributeName="r"
                values={city.capital ? "0;20;0" : "0;12;0"}
                dur={`${3 + i * 0.28}s`} repeatCount="indefinite"/>
              <animate attributeName="fill-opacity" values="0.3;0;0.3"
                dur={`${3 + i * 0.28}s`} repeatCount="indefinite"/>
            </circle>
            {/* Outer ring */}
            <circle cx={city.x} cy={city.y}
              r={city.capital ? 8 : 5}
              fill="white" stroke="#f59e0b"
              strokeWidth={city.capital ? 2 : 1.5}
              filter="url(#lcglow)"
              strokeOpacity="0.8"/>
            {/* Inner dot */}
            <circle cx={city.x} cy={city.y}
              r={city.capital ? 4 : 2.5}
              fill={city.capital ? "#d97706" : "#f59e0b"}/>
            {/* Label */}
            <text x={city.x} y={city.y - (city.capital ? 14 : 10)}
              textAnchor="middle"
              fontSize={city.capital ? "9" : "7.5"}
              fontWeight={city.capital ? "700" : "500"}
              fill={city.capital ? "#92400e" : "#b45309"}
              fontFamily="Inter, sans-serif">
              {city.name}
            </text>
          </g>
        ))}

        {/* Cultural icons at corners */}
        <text x="52"  y="56"  fontSize="18" opacity="0.5">🛕</text>
        <text x="400" y="50"  fontSize="16" opacity="0.45">🎋</text>
        <text x="50"  y="210" fontSize="16" opacity="0.4">🐘</text>
        <text x="398" y="198" fontSize="16" opacity="0.4">🌺</text>

        {/* BIHAR watermark */}
        <text x="238" y="248" textAnchor="middle" fontSize="10"
          fontWeight="800" fill="#d97706" opacity="0.2" letterSpacing="10"
          fontFamily="Inter, sans-serif">BIHAR</text>

        {/* Stats */}
        {[{v:"38",l:"Districts",x:108},{v:"2M+",l:"Artisans",x:243},{v:"500+",l:"Products",x:378}].map(s=>(
          <g key={s.l}>
            <rect x={s.x-38} y="270" width="76" height="42" rx="10"
              fill="white" fillOpacity="0.85"
              stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.5"/>
            <text x={s.x} y="289" textAnchor="middle" fontSize="13"
              fontWeight="800" fill="#92400e" fontFamily="Inter, sans-serif">{s.v}</text>
            <text x={s.x} y="305" textAnchor="middle" fontSize="7.5"
              fontWeight="500" fill="#b45309" fontFamily="Inter, sans-serif" opacity="0.8">{s.l}</text>
          </g>
        ))}
      </svg>

      {/* Patna capital label */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-full px-3 py-1 text-[10px] font-bold text-amber-800 shadow-sm">
        🏛️ Patna — Capital
      </div>

      <style jsx>{`
        @keyframes floatBadge {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
}
