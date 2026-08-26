import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { User } from "lucide-react";
import { QreatoLogo } from "./QreatoLogo";
import Strands from "./Strands";
import MagicRings from "./MagicRings";

interface MurgiiNeuralOrbProps {
  size?: "avatar" | "xs" | "sm" | "md" | "lg" | "hero" | "splash";
  interactive?: boolean;
  showPedestal?: boolean;
  showHologram?: boolean;
  showMagicRings?: boolean;
  magicRingsColor?: string;
  magicRingsColorTwo?: string;
  className?: string;
  onCluck?: () => void;
}

/**
 * MurgiiNeuralOrb: Ultra-Premium AI Persuasion Core
 * Refined harmonic quantum sphere mascot:
 * - Magic Rings shader effect radiating outwards from the outer circle of the mascot
 * - Crystal glass sphere with animated internal Strands refraction and chromatic dispersion
 * - High-contrast illuminated white Qreato geometric logo mark inside the glass core
 * - Multi-axis gyroscopic orbital rings with glowing photon nodes
 */
export function MurgiiNeuralOrb({
  size = "md",
  interactive = true,
  showMagicRings = true,
  magicRingsColor = "#EAB308",
  magicRingsColorTwo = "#dfdfdf",
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

  // Calculate Magic Rings container dimensions and baseRadius so rings emerge directly from the outer circle
  const ringWidth = size === "hero" ? 700 : size === "lg" ? 600 : size === "splash" ? 520 : size === "md" ? 440 : 340;
  const ringHeight = size === "hero" ? 500 : size === "lg" ? 400 : size === "splash" ? 360 : size === "md" ? 300 : 240;
  // Mascot outer circle radius is dim/2; baseRadius = (dim / 2) / min(ringWidth, ringHeight)
  const minRingRes = Math.min(ringWidth, ringHeight);
  const calculatedBaseRadius = Math.max(0.28, (dim * 0.52) / minRingRes);

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
          {/* 0. Magic Rings WebGL Shader Effect Radiating Outwards from the Outer Circle of Mascot */}
          {!isCompact && showMagicRings && (
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible"
              style={{ 
                width: `${ringWidth}px`, 
                height: `${ringHeight}px`,
              }}
            >
              <MagicRings
                color={magicRingsColor || "#EAB308"}
                colorTwo={magicRingsColorTwo || "#dfdfdf"}
                ringCount={2}
                speed={1.1}
                attenuation={23.5}
                lineThickness={1}
                baseRadius={calculatedBaseRadius}
                radiusStep={0.1}
                scaleRate={0.1}
                opacity={1}
                blur={0.5}
                noiseAmount={0}
                rotation={0}
                ringGap={1}
                fadeIn={1.25}
                fadeOut={0.5}
                followMouse={false}
                mouseInfluence={0.75}
                hoverScale={1.65}
                parallax={0.075}
                clickBurst={false}
              />
            </div>
          )}

          {/* 1. Ambient Background Aura Glow */}
          <div
            className="absolute inset-0 rounded-full transition-transform duration-700 ease-out z-[1]"
            style={{
              background: "radial-gradient(circle, rgba(234,179,8,0.25) 0%, rgba(168,85,247,0.2) 45%, transparent 70%)",
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
            className="absolute inset-0 rounded-full border border-[#EAB308]/60 pointer-events-none z-[2]"
          />

          {!isCompact && (
            <>
              {/* 3. Outer Gyroscopic Ring 1 (45° Tilt) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-[#EAB308]/40 border-dashed pointer-events-none z-[3]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(62deg) rotateY(18deg)",
                }}
              >
                {/* Orbital Glassmorphic Revenue Badge ($) - Counter-rotated to stay upright */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border border-white/30 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-[10px] font-bold text-[#FFD700] leading-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">$</span>
                </motion.div>
              </motion.div>

              {/* 4. Gyroscopic Ring 2 (-35° Tilt) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-white/30 pointer-events-none z-[3]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(42deg) rotateY(-38deg)",
                }}
              >
                {/* Orbital Glassmorphic Customers Served Badge (User) - Counter-rotated to stay upright */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-3 left-1/3 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border border-white/30 shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <User size={11} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                </motion.div>
              </motion.div>
            </>
          )}

          {/* 5. Central Mascot Glass Orb with Animated Strands & Glowing Qreato Logo */}
          <motion.div
            animate={{
              scale: isHovered ? [1.05, 1.1, 1.05] : [1, 1.04, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative rounded-full shadow-[0_0_35px_rgba(234,179,8,0.45),inset_0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center overflow-hidden aspect-square z-[10]"
            style={{
              width: isCompact ? "75%" : "58%",
              height: isCompact ? "75%" : "58%",
              background: "radial-gradient(circle at 35% 35%, #181424 0%, #080612 100%)",
              border: "2px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            {/* Glass Highlight Sheen on Top-Left */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none z-20"
              style={{
                background: "radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 65%)"
              }}
            />

            {/* Glowing Glass Strands WebGL Canvas Effect */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
              <Strands
                colors={["#FFD700", "#FF6B00", "#A855F7", "#38BDF8", "#FFFFFF"]}
                count={5}
                speed={0.45}
                amplitude={1.2}
                waviness={1.4}
                thickness={1.3}
                glow={2.0}
                taper={2.2}
                spread={2.1}
                intensity={0.85}
                saturation={2.2}
                opacity={1}
                scale={1.2}
                glass={true}
                refraction={0.65}
                dispersion={4.5}
                glassSize={1.0}
                hueShift={0.72}
                className="w-full h-full"
              />
            </div>

            {/* Centered Crisp Black Qreato Geometric Logo Mark ("• //") */}
            <div className="relative z-30 flex items-center justify-center pointer-events-none">
              <QreatoLogo
                size={
                  size === "avatar" ? 14 :
                  size === "xs" ? 18 :
                  size === "sm" ? 38 :
                  size === "splash" ? 75 :
                  size === "lg" ? 90 :
                  size === "hero" ? 115 : 62
                }
                className="text-black drop-shadow-[0_1px_4px_rgba(255,255,255,0.5)]"
                dotClassName="text-black fill-black"
              />
            </div>
          </motion.div>

          {/* 6. Base Refraction Floor Shadow */}
          {!isCompact && (
            <div
              className="absolute -bottom-2 w-2/3 h-3 rounded-full opacity-50 blur-[6px] pointer-events-none z-[1]"
              style={{
                background: "radial-gradient(ellipse, rgba(234,179,8,0.6) 0%, transparent 70%)",
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
