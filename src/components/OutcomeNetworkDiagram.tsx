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
  icon: React.ElementType;
  x: number; // badge center x
  y: number; // badge center y
  contactX: number; // exact boundary touch point x
  contactY: number; // exact boundary touch point y
  pathD: string; // smooth path from center orb (400,400) to boundary contact point
  color: string; // signature hex
  colorGlow: string; // rgba glow
}

const NODES: NodeData[] = [
  {
    id: "creators",
    name: "Creators",
    icon: Mic,
    x: 265,
    y: 135,
    contactX: 288,
    contactY: 174,
    pathD: "M 400 400 C 370 300, 315 220, 288 174",
    color: "#F43F5E", // Rose / Coral
    colorGlow: "rgba(244, 63, 94, 0.95)",
  },
  {
    id: "ai",
    name: "AI Systems",
    icon: Sparkles,
    x: 535,
    y: 135,
    contactX: 512,
    contactY: 174,
    pathD: "M 400 400 C 430 300, 485 220, 512 174",
    color: "#A855F7", // Electric Violet
    colorGlow: "rgba(168, 85, 247, 0.95)",
  },
  {
    id: "persuasion",
    name: "Persuasion",
    icon: Target,
    x: 125,
    y: 285,
    contactX: 164,
    contactY: 285,
    pathD: "M 400 400 C 300 375, 220 300, 164 285",
    color: "#EF4444", // Crimson Red
    colorGlow: "rgba(239, 68, 68, 0.95)",
  },
  {
    id: "monetization",
    name: "Monetization",
    icon: DollarSign,
    x: 675,
    y: 285,
    contactX: 636,
    contactY: 285,
    pathD: "M 400 400 C 500 375, 580 300, 636 285",
    color: "#10B981", // Emerald Green
    colorGlow: "rgba(16, 185, 129, 0.95)",
  },
  {
    id: "conversion",
    name: "Conversion",
    icon: TrendingUp,
    x: 125,
    y: 515,
    contactX: 164,
    contactY: 515,
    pathD: "M 400 400 C 300 425, 220 500, 164 515",
    color: "#F59E0B", // Electric Amber / Gold
    colorGlow: "rgba(245, 158, 11, 0.95)",
  },
  {
    id: "audience",
    name: "Audience",
    icon: Users,
    x: 675,
    y: 515,
    contactX: 636,
    contactY: 515,
    pathD: "M 400 400 C 500 425, 580 500, 636 515",
    color: "#06B6D4", // Cyan Sky
    colorGlow: "rgba(6, 182, 212, 0.95)",
  },
  {
    id: "automation",
    name: "Automation",
    icon: Zap,
    x: 265,
    y: 665,
    contactX: 288,
    contactY: 626,
    pathD: "M 400 400 C 370 500, 315 580, 288 626",
    color: "#6366F1", // Electric Indigo
    colorGlow: "rgba(99, 102, 241, 0.95)",
  },
  {
    id: "scale",
    name: "Scale",
    icon: Maximize2,
    x: 535,
    y: 665,
    contactX: 512,
    contactY: 626,
    pathD: "M 400 400 C 430 500, 485 580, 512 626",
    color: "#D946EF", // Vivid Fuchsia
    colorGlow: "rgba(217, 70, 239, 0.95)",
  },
];

export const OutcomeNetworkDiagram: React.FC = () => {
  return (
    <div className="relative w-full max-w-[780px] mx-auto px-2 select-none">
      <style>{`
        /* Staggered Continuous Intelligence Choreography:
           - Center Core: Slow, continuous 4.0s breathing pulse & radiant halo
           - 8 Spoke Nodes: Staggered 5.6s loops (offset by 0.7s each)
           - Traveling particles stream outwards sequentially along spoke paths
           - Each outer badge illuminates with its signature color upon particle arrival
        */

        @keyframes coreBreathingGlow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.35)) drop-shadow(0 12px 30px rgba(0, 0, 0, 0.85));
          }
          50% {
            transform: scale(1.035);
            filter: drop-shadow(0 0 32px rgba(255, 255, 255, 0.75)) drop-shadow(0 16px 40px rgba(0, 0, 0, 0.9));
          }
        }

        @keyframes coreHaloBreathing {
          0%, 100% {
            r: 62px;
            opacity: 0.25;
            stroke-width: 1px;
          }
          50% {
            r: 72px;
            opacity: 0.55;
            stroke-width: 1.5px;
          }
        }

        @keyframes badgeIlluminateStaggered {
          0%, 31.5% {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 255, 255, 0.18);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
            color: #FFFFFF;
            transform: scale(1);
          }
          32.14% {
            /* Particle contact */
            transform: scale(1.07);
          }
          33%, 57% {
            /* Sustained illumination */
            background: var(--node-bg-active);
            border-color: var(--node-color);
            box-shadow: 0 0 34px var(--node-glow), 0 12px 40px rgba(0, 0, 0, 0.8), inset 0 0 18px var(--node-glow);
            color: var(--node-color);
            transform: scale(1.035);
          }
          64%, 100% {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 255, 255, 0.18);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
            color: #FFFFFF;
            transform: scale(1);
          }
        }

        @keyframes iconGlowStaggered {
          0%, 31.5% {
            color: #FFFFFF;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
          }
          33%, 57% {
            color: #FFFFFF;
            filter: drop-shadow(0 0 14px var(--node-color)) drop-shadow(0 0 24px var(--node-glow));
          }
          64%, 100% {
            color: #FFFFFF;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
          }
        }

        @keyframes splashShowerStaggered {
          0%, 31.5% {
            opacity: 0;
            transform: scale(0.2);
          }
          32.14% {
            opacity: 1;
            transform: scale(0.6);
          }
          36% {
            opacity: 0.95;
            transform: scale(1.3);
          }
          45% {
            opacity: 0.45;
            transform: scale(1.6);
          }
          54%, 100% {
            opacity: 0;
            transform: scale(1.8);
          }
        }

        @keyframes showerDropletsStaggered {
          0%, 31.5% {
            opacity: 0;
            stroke-dashoffset: 40;
          }
          32.14% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          40% {
            opacity: 0.85;
            stroke-dashoffset: -18;
          }
          50%, 100% {
            opacity: 0;
            stroke-dashoffset: -36;
          }
        }
      `}</style>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Tight white center radial halo */}
          <radialGradient id="white-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.1" />
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
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Node-specific dynamic Bullet and Glow gradients */}
          {NODES.map((node) => (
            <React.Fragment key={`defs-${node.id}`}>
              {/* Sleek Bullet Capsule: trailing glow -> vibrant color -> white hot head */}
              <linearGradient id={`bullet-grad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={node.color} stopOpacity="0" />
                <stop offset="35%" stopColor={node.color} stopOpacity="0.5" />
                <stop offset="75%" stopColor={node.color} stopOpacity="1" />
                <stop offset="92%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>

              {/* Radial shower splash burst */}
              <radialGradient id={`splash-grad-${node.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor={node.color} stopOpacity="0.85" />
                <stop offset="70%" stopColor={node.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={node.color} stopOpacity="0" />
              </radialGradient>
            </React.Fragment>
          ))}

          {/* Bullet Laser Glow filter */}
          <filter id="bullet-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Background Geometry / Concentric Rings */}
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

        {/* 2. Connecting Path Lines from center logo out to element boxes */}
        {NODES.map((node) => (
          <path
            key={`path-${node.id}`}
            d={node.pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}

        {/* 3. Staggered Light Particles / Bullets along each spoke:
            - 5.6s total loop, offset by idx * 0.7s
            - 0.0s -> 1.8s (0% -> 32.14%): travels from center outward
            - 1.8s (32.14%): touches outer badge contact point and resets smoothly
        */}
        {NODES.map((node, idx) => (
          <g key={`bullet-${node.id}`}>
            <g filter="url(#bullet-glow)">
              {/* Beam body */}
              <rect
                x="-36"
                y="-3"
                width="36"
                height="6"
                rx="3"
                fill={`url(#bullet-grad-${node.id})`}
              />
              {/* White hot head point */}
              <circle
                cx="0"
                cy="0"
                r="3.5"
                fill="#FFFFFF"
              />
              <circle
                cx="0"
                cy="0"
                r="6"
                fill={node.color}
                opacity="0.85"
              />
            </g>

            {/* Path Motion with Staggered Delays */}
            <animateMotion
              path={node.pathD}
              dur="5.6s"
              begin={`${idx * 0.7}s`}
              repeatCount="indefinite"
              rotate="auto"
              keyPoints="0; 1; 0; 0"
              keyTimes="0; 0.3214; 0.3215; 1"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1; 0 0 1 1; 0 0 1 1"
            />

            {/* Opacity Control */}
            <animate
              attributeName="opacity"
              values="0; 1; 1; 0; 0; 0"
              keyTimes="0; 0.04; 0.31; 0.3214; 0.98; 1"
              dur="5.6s"
              begin={`${idx * 0.7}s`}
              repeatCount="indefinite"
            />

            {/* Scale Transform */}
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.6; 1; 1.2; 0.3; 0.3; 0.6"
              keyTimes="0; 0.05; 0.3214; 0.325; 0.98; 1"
              dur="5.6s"
              begin={`${idx * 0.7}s`}
              repeatCount="indefinite"
              additive="sum"
            />
          </g>
        ))}

        {/* 4. Color Splash & Particle Shower Effect around element boundaries upon bullet impact */}
        {NODES.map((node, idx) => (
          <g key={`splash-group-${node.id}`}>
            {/* Contact Shockwave Burst */}
            <circle
              cx={node.contactX}
              cy={node.contactY}
              r="28"
              fill={`url(#splash-grad-${node.id})`}
              style={{
                transformOrigin: `${node.contactX}px ${node.contactY}px`,
                animation: `splashShowerStaggered 5.6s infinite cubic-bezier(0.16, 1, 0.3, 1)`,
                animationDelay: `${idx * 0.7}s`,
                pointerEvents: "none"
              }}
            />

            {/* Shower Particle Rays */}
            <g
              style={{
                transformOrigin: `${node.contactX}px ${node.contactY}px`,
                animation: `showerDropletsStaggered 5.6s infinite ease-out`,
                animationDelay: `${idx * 0.7}s`,
                pointerEvents: "none"
              }}
            >
              <line
                x1={node.contactX}
                y1={node.contactY}
                x2={node.x - 16}
                y2={node.y - 16}
                stroke={node.color}
                strokeWidth="2.5"
                strokeDasharray="8 12"
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                x1={node.contactX}
                y1={node.contactY}
                x2={node.x + 16}
                y2={node.y - 16}
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="6 10"
                strokeLinecap="round"
                opacity="0.95"
              />
              <line
                x1={node.contactX}
                y1={node.contactY}
                x2={node.x}
                y2={node.y}
                stroke={node.color}
                strokeWidth="2.5"
                strokeDasharray="10 14"
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                x1={node.contactX}
                y1={node.contactY}
                x2={node.x - 16}
                y2={node.y + 16}
                stroke={node.color}
                strokeWidth="2"
                strokeDasharray="8 10"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          </g>
        ))}

        {/* 5. Outer Glassmorphic Badges with Staggered Illumination */}
        {NODES.map((node, idx) => {
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
                  className="w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    ["--node-color" as string]: node.color,
                    ["--node-glow" as string]: node.colorGlow,
                    ["--node-bg-active" as string]: `radial-gradient(circle at center, ${node.color}35 0%, rgba(15, 12, 28, 0.9) 100%)`,
                    backdropFilter: "blur(16px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.5)",
                    borderWidth: "1.5px",
                    borderStyle: "solid",
                    animation: `badgeIlluminateStaggered 5.6s infinite cubic-bezier(0.16, 1, 0.3, 1)`,
                    animationDelay: `${idx * 0.7}s`,
                  }}
                >
                  <div 
                    style={{ 
                      animation: `iconGlowStaggered 5.6s infinite cubic-bezier(0.16, 1, 0.3, 1)`,
                      animationDelay: `${idx * 0.7}s`
                    }}
                  >
                    <IconComponent 
                      size={32} 
                      strokeWidth={2.3}
                      className="transition-all duration-300" 
                    />
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* 6. Central White/Silver Metallic Sphere with Continuous Breathing Pulse */}
        <g 
          className="cursor-pointer"
          style={{
            transformOrigin: "400px 400px",
            animation: "coreBreathingGlow 4.0s infinite ease-in-out",
          }}
        >
          {/* Outer breathing halo ring */}
          <circle
            cx="400"
            cy="400"
            r="64"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            style={{
              transformOrigin: "400px 400px",
              animation: "coreHaloBreathing 4.0s infinite ease-in-out",
            }}
          />

          {/* White/Silver Metallic Sphere */}
          <circle
            cx="400"
            cy="400"
            r="52"
            fill="url(#silver-orb-gradient)"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="1.5"
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
