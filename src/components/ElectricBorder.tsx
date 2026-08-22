import React, { useEffect, useId, useRef, useState, memo } from "react";

// CREDIT: Component inspired by @BalintFerenczy on X / ReactBits.dev (https://codepen.io/BalintFerenczy/pen/KwdoyEN)

export interface ElectricBorderProps {
  children?: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ElectricBorder = memo(function ElectricBorder({
  children,
  color = "#E879F9",
  speed = 1,
  chaos = 0.12,
  thickness = 2,
  borderRadius = 24,
  className = "",
  style = {},
}: ElectricBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const secondaryTurbRef = useRef<SVGFETurbulenceElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const rawId = useId().replace(/:/g, "");
  const filterId = `electric-filter-${rawId}`;
  const secondaryFilterId = `electric-sub-filter-${rawId}`;
  const glowFilterId = `electric-glow-${rawId}`;

  // Measure size with ResizeObserver (only updates on actual resize, never during animation)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth > 0 && clientHeight > 0) {
        setDimensions((prev) => {
          if (prev.width === clientWidth && prev.height === clientHeight) {
            return prev;
          }
          return { width: clientWidth, height: clientHeight };
        });
      }
    };

    updateSize();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        updateSize();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // requestAnimationFrame loop: Direct DOM updates to feTurbulence seed bypassing React renders
  useEffect(() => {
    let animFrameId: number;
    let lastTime = performance.now();
    let seed = 1;
    // Step interval in ms: modest rate prevents main-thread rasterization stall while keeping crisp lightning
    const stepInterval = Math.max(16, 45 / (speed || 1));

    const loop = (currentTime: number) => {
      if (currentTime - lastTime >= stepInterval) {
        seed = (seed + 1) % 500;
        if (turbulenceRef.current) {
          turbulenceRef.current.setAttribute("seed", String(seed));
        }
        if (secondaryTurbRef.current) {
          secondaryTurbRef.current.setAttribute("seed", String((seed * 3) % 500));
        }
        lastTime = currentTime;
      }
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, [speed]);

  // Keep displacement scale and baseFrequency modest as requested for 60fps compositor performance
  const clampedChaos = Math.max(0.06, Math.min(0.2, chaos || 0.12));
  const baseFreq = (0.035 + clampedChaos * 0.04).toFixed(3);
  const displacementScale = Math.max(6, Math.min(18, clampedChaos * 100 * (thickness / 2)));

  const pad = 16;
  const svgWidth = dimensions.width ? dimensions.width + pad * 2 : 0;
  const svgHeight = dimensions.height ? dimensions.height + pad * 2 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        isolation: "isolate",
        contain: "layout paint",
        willChange: "transform",
        transform: "translateZ(0)",
        ...style,
      }}
    >
      {/* SVG Lightning Filter & Animated Paths */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="pointer-events-none absolute -inset-[16px] w-[calc(100%+32px)] h-[calc(100%+32px)] z-20 overflow-visible select-none"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            willChange: "filter",
            transform: "translateZ(0)",
          }}
        >
          <defs>
            {/* Primary turbulent displacement filter with numOctaves="1" for 60fps GPU performance */}
            <filter
              id={filterId}
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              filterUnits="userSpaceOnUse"
            >
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency={baseFreq}
                numOctaves="1"
                result="noise"
                seed="1"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={displacementScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Secondary higher-frequency displacement filter for fine crackling sparks */}
            <filter
              id={secondaryFilterId}
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
              filterUnits="userSpaceOnUse"
            >
              <feTurbulence
                ref={secondaryTurbRef}
                type="fractalNoise"
                baseFrequency="0.08"
                numOctaves="1"
                result="sparkNoise"
                seed="7"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="sparkNoise"
                scale={displacementScale * 0.75}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Glowing diffuse filter for electric neon aura */}
            <filter
              id={glowFilterId}
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              filterUnits="userSpaceOnUse"
            >
              <feGaussianBlur stdDeviation="3.5" result="blur1" />
              <feGaussianBlur stdDeviation="7" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Electrical Glow Aura */}
          <rect
            x={pad}
            y={pad}
            width={dimensions.width}
            height={dimensions.height}
            rx={borderRadius}
            ry={borderRadius}
            stroke={color}
            strokeWidth={thickness * 2.5}
            strokeOpacity="0.45"
            fill="none"
            filter={`url(#${glowFilterId})`}
          />

          {/* 2. Main Displaced Electric Lightning Stroke */}
          <rect
            x={pad}
            y={pad}
            width={dimensions.width}
            height={dimensions.height}
            rx={borderRadius}
            ry={borderRadius}
            stroke={color}
            strokeWidth={thickness * 1.5}
            strokeOpacity="0.85"
            fill="none"
            filter={`url(#${filterId})`}
          />

          {/* 3. Intense White High-Voltage Core Line */}
          <rect
            x={pad}
            y={pad}
            width={dimensions.width}
            height={dimensions.height}
            rx={borderRadius}
            ry={borderRadius}
            stroke="#FFFFFF"
            strokeWidth={Math.max(1, thickness * 0.75)}
            strokeOpacity="0.9"
            fill="none"
            filter={`url(#${filterId})`}
          />

          {/* 4. Fine Secondary Crackling Electric Sparks */}
          <rect
            x={pad}
            y={pad}
            width={dimensions.width}
            height={dimensions.height}
            rx={borderRadius}
            ry={borderRadius}
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray="14 24 6 32"
            strokeOpacity="0.75"
            fill="none"
            filter={`url(#${secondaryFilterId})`}
          />
        </svg>
      )}

      {/* Embedded Children Container */}
      <div
        className="relative z-10 w-full h-full"
        style={{
          borderRadius: `${borderRadius}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default ElectricBorder;
