import React from "react";
import { 
  Users, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  Maximize2,
  Mic
} from "lucide-react";
import { QreatoLogo } from "./QreatoLogo";

interface NodeData {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  x: number;
  y: number;
  pathD: string;
  delay: string;
  accentColor: string;
}

const NODES: NodeData[] = [
  {
    id: "creators",
    name: "Creators",
    category: "Identity",
    icon: Mic,
    x: 270,
    y: 130,
    pathD: "M 385 365 C 370 270, 310 210, 270 130",
    delay: "0s",
    accentColor: "#E879F9",
  },
  {
    id: "ai",
    name: "AI Engine",
    category: "Intelligence",
    icon: Sparkles,
    x: 530,
    y: 130,
    pathD: "M 415 365 C 430 270, 490 210, 530 130",
    delay: "0.6s",
    accentColor: "#C084FC",
  },
  {
    id: "persuasion",
    name: "Persuasion",
    category: "Psychology",
    icon: Target,
    x: 130,
    y: 280,
    pathD: "M 360 385 C 260 370, 210 295, 130 280",
    delay: "1.2s",
    accentColor: "#F472B6",
  },
  {
    id: "monetization",
    name: "Monetization",
    category: "Revenue",
    icon: DollarSign,
    x: 670,
    y: 280,
    pathD: "M 440 385 C 540 370, 590 295, 670 280",
    delay: "0.3s",
    accentColor: "#38BDF8",
  },
  {
    id: "conversion",
    name: "Conversion",
    category: "Performance",
    icon: TrendingUp,
    x: 130,
    y: 520,
    pathD: "M 360 415 C 260 430, 210 505, 130 520",
    delay: "1.8s",
    accentColor: "#34D399",
  },
  {
    id: "audience",
    name: "Audience",
    category: "Reach",
    icon: Users,
    x: 670,
    y: 520,
    pathD: "M 440 415 C 540 430, 590 505, 670 520",
    delay: "0.9s",
    accentColor: "#A78BFA",
  },
  {
    id: "automation",
    name: "Automation",
    category: "Workflows",
    icon: Zap,
    x: 270,
    y: 670,
    pathD: "M 385 435 C 370 530, 310 590, 270 670",
    delay: "2.1s",
    accentColor: "#FBBF24",
  },
  {
    id: "scale",
    name: "Scale",
    category: "Growth",
    icon: Maximize2,
    x: 530,
    y: 670,
    pathD: "M 415 435 C 430 530, 490 590, 530 670",
    delay: "1.5s",
    accentColor: "#D946EF",
  },
];

export const OutcomeNetworkDiagram: React.FC = () => {
  return (
    <div className="relative w-full max-w-[760px] mx-auto px-2 select-none">
      {/* SVG Canvas with Paths & Animated Dots */}
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <defs>
          {/* Radial glow for center */}
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D946EF" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B0819" stopOpacity="0" />
          </radialGradient>

          {/* Center Orb Gradient */}
          <radialGradient id="orb-gradient" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E879F9" />
            <stop offset="35%" stopColor="#8B5CF6" />
            <stop offset="70%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#090514" />
          </radialGradient>

          {/* Specular highlight */}
          <linearGradient id="orb-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Line Gradient for Paths */}
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D946EF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Radar / Grid Background Lines */}
        <g opacity="0.18" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" fill="none">
          {/* Subtle Grid square mesh */}
          <line x1="100" y1="200" x2="700" y2="200" strokeDasharray="3 6" />
          <line x1="100" y1="400" x2="700" y2="400" strokeDasharray="3 6" />
          <line x1="100" y1="600" x2="700" y2="600" strokeDasharray="3 6" />
          <line x1="200" y1="100" x2="200" y2="700" strokeDasharray="3 6" />
          <line x1="400" y1="100" x2="400" y2="700" strokeDasharray="3 6" />
          <line x1="600" y1="100" x2="600" y2="700" strokeDasharray="3 6" />

          {/* Concentric subtle radar circles */}
          <circle cx="400" cy="400" r="150" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="260" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="350" strokeDasharray="2 10" />
        </g>

        {/* Ambient Center Glow */}
        <circle cx="400" cy="400" r="180" fill="url(#center-glow)" />

        {/* 2. Static Curved Route Lines */}
        {NODES.map((node) => (
          <g key={`path-group-${node.id}`}>
            {/* Soft background line */}
            <path
              d={node.pathD}
              fill="none"
              stroke="rgba(139, 92, 246, 0.22)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Core illuminated line */}
            <path
              d={node.pathD}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* 3. Traveling Glowing Light Spark (Single ball per path, continuous smooth flow) */}
        {NODES.map((node) => (
          <g key={`spark-${node.id}`}>
            <circle
              r="4"
              fill="#FFFFFF"
              filter="url(#dot-glow)"
              style={{
                filter: "drop-shadow(0 0 6px rgba(232, 121, 249, 0.95)) drop-shadow(0 0 10px rgba(139, 92, 246, 0.8))"
              }}
            >
              <animateMotion
                path={node.pathD}
                dur="4.2s"
                repeatCount="indefinite"
                begin={node.delay}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          </g>
        ))}

        {/* 4. Outer Glassmorphic Outcome Badges */}
        {NODES.map((node) => {
          const IconComponent = node.icon;
          const boxSize = 64;
          const halfBox = boxSize / 2;

          return (
            <g key={`badge-${node.id}`} className="cursor-pointer group">
              {/* Outer Badge Rect with dark glass/metallic fill & glow */}
              <rect
                x={node.x - halfBox}
                y={node.y - halfBox}
                width={boxSize}
                height={boxSize}
                rx="16"
                fill="#0F0C1E"
                stroke="rgba(168, 85, 247, 0.4)"
                strokeWidth="1.5"
                className="transition-all duration-300 group-hover:stroke-[#D946EF]"
                style={{
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.7)) drop-shadow(0 0 12px rgba(139,92,246,0.15))",
                }}
              />

              {/* Inner subtle specular sheen */}
              <rect
                x={node.x - halfBox + 1}
                y={node.y - halfBox + 1}
                width={boxSize - 2}
                height={(boxSize - 2) / 2}
                rx="15"
                fill="url(#orb-highlight)"
                opacity="0.15"
                pointerEvents="none"
              />

              {/* Node Icon via foreignObject for Lucide Icon rendering */}
              <foreignObject
                x={node.x - halfBox}
                y={node.y - halfBox}
                width={boxSize}
                height={boxSize}
                className="pointer-events-none"
              >
                <div className="w-full h-full flex items-center justify-center text-white/90 group-hover:text-white group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={24} style={{ color: node.accentColor }} />
                </div>
              </foreignObject>

              {/* Text Label Beneath / Above Badge */}
              <text
                x={node.x}
                y={node.y + halfBox + 18}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="13"
                fontWeight="700"
                fontFamily="'Nohemi', sans-serif"
                letterSpacing="0.04em"
                className="select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              >
                {node.name}
              </text>

              <text
                x={node.x}
                y={node.y + halfBox + 31}
                textAnchor="middle"
                fill="rgba(192, 132, 252, 0.75)"
                fontSize="9"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.12em"
                className="uppercase select-none"
              >
                {node.category}
              </text>
            </g>
          );
        })}

        {/* 5. Central Hub: Qreato Core Sphere with Violet/Purple Radial Gradient */}
        <g className="cursor-pointer" filter="url(#core-glow)">
          {/* Outer Pulsing Ring */}
          <circle
            cx="400"
            cy="400"
            r="60"
            fill="none"
            stroke="rgba(217, 70, 239, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Inner Glowing Core Sphere */}
          <circle
            cx="400"
            cy="400"
            r="48"
            fill="url(#orb-gradient)"
            stroke="rgba(232, 121, 249, 0.6)"
            strokeWidth="2"
            style={{
              filter: "drop-shadow(0 0 24px rgba(217, 70, 239, 0.6))"
            }}
          />

          {/* Glossy highlight dome */}
          <ellipse
            cx="390"
            cy="376"
            rx="32"
            ry="18"
            fill="url(#orb-highlight)"
            opacity="0.4"
            pointerEvents="none"
          />

          {/* Centered Qreato Geometric Logo Mark */}
          <foreignObject
            x="364"
            y="364"
            width="72"
            height="72"
            className="pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center">
              <QreatoLogo size={36} className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
};
