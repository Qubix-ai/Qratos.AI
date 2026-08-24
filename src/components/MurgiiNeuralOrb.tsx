import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { User } from "lucide-react";
import { QreatoLogo } from "./QreatoLogo";
import Strands from "./Strands";

interface MurgiiNeuralOrbProps {
  size?: "avatar" | "xs" | "sm" | "md" | "lg" | "hero" | "splash";
  interactive?: boolean;
  showPedestal?: boolean;
  showHologram?: boolean;
  className?: string;
  onCluck?: () => void;
}

/**
 * MurgiiNeuralOrb: Ultra-Premium AI Persuasion Core
 * Replaces the mascot with a refined harmonic quantum sphere:
 * - Obsidian core with dark violet-magenta internal plasma pulses
 * - Multi-axis gyroscopic orbital rings with glowing photon nodes
 * - Smooth 60fps hardware-accelerated animations (no jitter or clipping)
 * - IntersectionObserver auto-pause for mobile battery and scroll optimization
 */
export function MurgiiNeuralOrb({
  size = "md",
  interactive = true,
  className = "",
  onCluck,
}: MurgiiNeuralOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Size definitions (pixels)
  const sizeMap = {
    avatar: 34,
    xs: 44,
    sm: 96,
    md: 180,
    lg: 260,
    hero: 340,
    splash: 220,
  };

  const dim = sizeMap[size] || 180;
  const isCompact = size === "avatar" || size === "xs";

  // IntersectionObserver to pause when off-screen (scroll performance)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (!interactive) return;
    setPulseKey((prev) => prev + 1);
    onCluck?.();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{ width: dim, height: dim }}
      className={`relative select-none flex items-center justify-center ${interactive ? "cursor-pointer group" : ""} ${className}`}
    >
      {isVisible && (
        <div className="relative w-full h-full flex items-center justify-center will-change-transform">
          {/* 1. Ambient Background Aura Glow */}
          <div
            className="absolute inset-0 rounded-full transition-transform duration-700 ease-out"
            style={{
              background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(217,70,239,0.15) 45%, transparent 70%)",
              transform: isHovered ? "scale(1.25)" : "scale(1.0)",
              filter: isCompact ? "blur(4px)" : "blur(16px)",
            }}
          />

          {/* 2. Interactive Outer Pulse Wave on Click */}
          <motion.div
            key={pulseKey}
            initial={{ scale: 0.8, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#D946EF]/60 pointer-events-none"
          />

          {!isCompact && (
            <>
              {/* 3. Outer Counter-Rotating Gyroscopic Ring 1 (45° Tilt) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-[#8B5CF6]/35 border-dashed pointer-events-none"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(62deg) rotateY(18deg)",
                }}
              >
                {/* Orbital Glassmorphic Revenue Badge ($) - Counter-rotated to stay upright */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-[10px] font-bold text-white/90 leading-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">$</span>
                </motion.div>
              </motion.div>

              {/* 4. Gyroscopic Ring 2 (-35° Tilt) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-[#D946EF]/30 pointer-events-none"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(42deg) rotateY(-38deg)",
                }}
              >
                {/* Orbital Glassmorphic Customers Served Badge (User) - Counter-rotated to stay upright */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-3 left-1/3 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <User size={11} className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                </motion.div>
              </motion.div>
            </>
          )}

          {/* 5. Central Quantum Core Orb: Glass ball with glowing Strands effect and Qreato logo */}
          <motion.div
            animate={{
              scale: isHovered ? [1.05, 1.1, 1.05] : [1, 1.04, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative rounded-full shadow-[0_0_35px_rgba(168,85,247,0.6)] flex items-center justify-center overflow-hidden aspect-square"
            style={{
              width: isCompact ? "75%" : "58%",
              height: isCompact ? "75%" : "58%",
              background: "#080612",
              border: "1.5px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            {/* Glowing Glass Strands WebGL Canvas Effect - Edge to Edge */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
              <Strands
                colors={["#F97316", "#A855F7", "#c1d6d9"]}
                count={4}
                speed={0.4}
                amplitude={1.2}
                waviness={1.4}
                thickness={1.2}
                glow={1.75}
                taper={2.2}
                spread={2.1}
                intensity={0.65}
                saturation={2.2}
                opacity={1}
                scale={1.2}
                glass={true}
                refraction={0.6}
                dispersion={4}
                glassSize={1.0}
                hueShift={0.72}
                className="w-full h-full"
              />
            </div>

            {/* Centered Qreato Geometric Logo Mark in Black over Strands */}
            <div className="relative z-30 flex items-center justify-center pointer-events-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              <QreatoLogo
                size={
                  size === "avatar" ? 14 :
                  size === "xs" ? 18 :
                  size === "sm" ? 38 :
                  size === "splash" ? 75 :
                  size === "lg" ? 92 :
                  size === "hero" ? 120 : 64
                }
                className="text-black"
                dotClassName="text-black fill-black"
              />
            </div>
          </motion.div>

          {/* 6. Base Refraction Floor Shadow */}
          {!isCompact && (
            <div
              className="absolute -bottom-2 w-2/3 h-3 rounded-full opacity-40 blur-[6px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, rgba(168,85,247,0.7) 0%, transparent 70%)",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Named alias for backward compatibility with existing imports
export { MurgiiNeuralOrb as Murgii3DChicken };
