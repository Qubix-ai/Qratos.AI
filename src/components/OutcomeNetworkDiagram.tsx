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
  icon: React.ElementType;
  x: number;
  y: number;
  pathD: string;
}

const NODES: NodeData[] = [
  {
    id: "creators",
    icon: Mic,
    x: 265,
    y: 135,
    pathD: "M 382 355 C 365 265, 305 205, 265 135",
  },
  {
    id: "ai",
    icon: Sparkles,
    x: 535,
    y: 135,
    pathD: "M 418 355 C 435 265, 495 205, 535 135",
  },
  {
    id: "persuasion",
    icon: Target,
    x: 125,
    y: 285,
    pathD: "M 355 385 C 255 370, 205 300, 125 285",
  },
  {
    id: "monetization",
    icon: DollarSign,
    x: 675,
    y: 285,
    pathD: "M 445 385 C 545 370, 595 300, 675 285",
  },
  {
    id: "conversion",
    icon: TrendingUp,
    x: 125,
    y: 515,
    pathD: "M 355 415 C 255 430, 205 500, 125 515",
  },
  {
    id: "audience",
    icon: Users,
    x: 675,
    y: 515,
    pathD: "M 445 415 C 545 430, 595 500, 675 515",
  },
  {
    id: "automation",
    icon: Zap,
    x: 265,
    y: 665,
    pathD: "M 382 445 C 365 535, 305 595, 265 665",
  },
  {
    id: "scale",
    icon: Maximize2,
    x: 535,
    y: 665,
    pathD: "M 418 445 C 435 535, 495 595, 535 665",
  },
];

export const OutcomeNetworkDiagram: React.FC = () => {
  return (
    <div className="relative w-full max-w-[760px] mx-auto px-2 select-none">
      {/* SVG Canvas with Paths & Animated Bullet Train Streaks */}
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Subtle tight white center glow */}
          <radialGradient id="white-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* White / Silver Metallic Sphere Gradient */}
          <radialGradient id="silver-orb-gradient" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F1F5F9" />
            <stop offset="75%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>

          {/* Specular high-gloss sheen for sphere */}
          <linearGradient id="silver-orb-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Bullet Train Gradient Streak: transparent -> bright white core -> transparent */}
          <linearGradient id="bullet-train-streak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="90%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Tight white glow filter */}
          <filter id="tight-white-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Subtle Background Geometry / Concentric Rings */}
        <g opacity="0.12" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" fill="none">
          <line x1="100" y1="200" x2="700" y2="200" strokeDasharray="2 6" />
          <line x1="100" y1="400" x2="700" y2="400" strokeDasharray="2 6" />
          <line x1="100" y1="600" x2="700" y2="600" strokeDasharray="2 6" />
          <line x1="200" y1="100" x2="200" y2="700" strokeDasharray="2 6" />
          <line x1="400" y1="100" x2="400" y2="700" strokeDasharray="2 6" />
          <line x1="600" y1="100" x2="600" y2="700" strokeDasharray="2 6" />

          <circle cx="400" cy="400" r="140" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="260" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="350" strokeDasharray="2 10" />
        </g>

        {/* Subtle Tight Center Glow */}
        <circle cx="400" cy="400" r="130" fill="url(#white-center-glow)" />

        {/* 2. Thin, subtle curved connecting path lines */}
        {NODES.map((node) => (
          <path
            key={`path-${node.id}`}
            d={node.pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}

        {/* 3. Bullet Train Traveling Lights (Synchronized departure from center, pure SVG animateMotion) */}
        {NODES.map((node) => (
          <g key={`bullet-${node.id}`}>
            {/* Elongated streak capsule moving tangentially along path */}
            <rect
              x="-22"
              y="-1.75"
              width="44"
              height="3.5"
              rx="1.75"
              fill="url(#bullet-train-streak)"
              filter="url(#tight-white-glow)"
            >
              <animateMotion
                path={node.pathD}
                dur="2.6s"
                repeatCount="indefinite"
                begin="0s"
                rotate="auto"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.25 0.1 0.25 1"
              />
            </rect>
          </g>
        ))}

        {/* 4. Outer White Frosted Glassmorphic Badges (Enlarged by ~30%, high clarity icons) */}
        {NODES.map((node) => {
          const IconComponent = node.icon;
          const boxSize = 78;
          const halfBox = boxSize / 2;

          return (
            <g key={`badge-${node.id}`} className="cursor-pointer group">
              {/* Frosted Glassmorphic Badge */}
              <foreignObject
                x={node.x - halfBox}
                y={node.y - halfBox}
                width={boxSize}
                height={boxSize}
                className="overflow-visible"
              >
                <div 
                  className="w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white/60 shadow-[0_12px_36px_rgba(0,0,0,0.65)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(14px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(14px) saturate(1.4)",
                    border: "1.2px solid rgba(255, 255, 255, 0.28)"
                  }}
                >
                  <IconComponent 
                    size={32} 
                    strokeWidth={2.2}
                    className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" 
                  />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* 5. Central White/Silver Metallic Sphere (Proportionally sized for larger badges) */}
        <g className="cursor-pointer">
          {/* Subtle tight outer halo ring */}
          <circle
            cx="400"
            cy="400"
            r="64"
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {/* White/Silver Metallic Sphere */}
          <circle
            cx="400"
            cy="400"
            r="52"
            fill="url(#silver-orb-gradient)"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="1.5"
            style={{
              filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.35)) drop-shadow(0 14px 36px rgba(0, 0, 0, 0.85))"
            }}
          />

          {/* Specular high-gloss sheen dome */}
          <ellipse
            cx="390"
            cy="376"
            rx="32"
            ry="18"
            fill="url(#silver-orb-highlight)"
            pointerEvents="none"
          />

          {/* Centered Qreato Geometric Logo Mark in Deep Solid Black */}
          <foreignObject
            x="362"
            y="362"
            width="76"
            height="76"
            className="pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center">
              <QreatoLogo size={38} className="text-black drop-shadow-[0_1px_3px_rgba(255,255,255,0.5)]" />
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
};

