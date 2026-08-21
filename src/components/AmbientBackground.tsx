import { memo } from "react";

interface AmbientBackgroundProps {
  className?: string;
  showGrid?: boolean;
}

export const AmbientBackground = memo(function AmbientBackground({ 
  className = "", 
  showGrid = true 
}: AmbientBackgroundProps) {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#07060B] ${className}`}
      aria-hidden="true"
    >
      {/* 1. UPPER REGION: Large Soft Magenta-to-Purple Glow (#C026D3 -> #7C3AED) */}
      <div 
        className="absolute -top-[12%] right-[-5%] sm:right-[8%] w-[68vw] h-[58vw] min-w-[500px] min-h-[440px] max-w-[880px] max-h-[780px] rounded-full pointer-events-none opacity-90"
        style={{
          background: "radial-gradient(ellipse at center, rgba(192, 38, 211, 0.25) 0%, rgba(147, 51, 234, 0.17) 38%, rgba(124, 58, 237, 0.08) 62%, transparent 78%)",
          filter: "blur(110px)",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* 2. LOWER REGION: Distinct Blue Ambient Glow (#3B82F6 -> #1E3A8A) */}
      <div 
        className="absolute -bottom-[16%] left-[-8%] sm:left-[3%] w-[72vw] h-[62vw] min-w-[520px] min-h-[460px] max-w-[920px] max-h-[820px] rounded-full pointer-events-none opacity-95"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.24) 0%, rgba(37, 99, 235, 0.16) 36%, rgba(30, 58, 138, 0.09) 64%, transparent 78%)",
          filter: "blur(125px)",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* 3. CENTER SEPARATION: Genuine near-black charcoal contrast zone */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          background: "radial-gradient(ellipse at 48% 50%, transparent 22%, rgba(7, 6, 11, 0.85) 88%)",
        }}
      />

      {/* 4. SUBTLE 3D AMBIENT GRID */}
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-[0.032] pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(147, 51, 234, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />
      )}

      {/* 5. GRAIN / NOISE TEXTURE OVERLAY - Tactile fine film grain across the viewport */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ambientNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ambientNoiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 6. VIGNETTE SHADING: Natural edge falloff */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.3] [background:radial-gradient(circle_at_50%_50%,transparent_55%,rgba(7,6,11,0.95)_100%)] z-20"
      />
    </div>
  );
});
