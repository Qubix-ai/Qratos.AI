import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";

export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1.85s aesthetic presentation duration before initiating smooth exit
    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        onComplete?.();
      }, 350);
      return () => clearTimeout(exitTimer);
    }, 1850);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] bg-[#050409] text-white flex flex-col items-center justify-center overflow-hidden font-sans select-none pointer-events-auto"
    >
      {/* 1. Multi-Layered Ambient Atmosphere Glow */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-50 blur-[130px]"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.18) 0%, rgba(139, 92, 246, 0.14) 40%, rgba(234, 179, 8, 0.05) 70%, transparent 85%)",
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full pointer-events-none opacity-30 blur-[90px]"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.35) 0%, transparent 60%)",
        }}
      />

      {/* 2. Central Premium Glassmorphic Emblem Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Subtle breathing outer aura ring */}
        <motion.div 
          animate={{ 
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.65, 0.35]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -inset-2.5 rounded-[34px] bg-gradient-to-b from-white/20 via-white/5 to-purple-500/20 blur-md pointer-events-none"
        />

        {/* Master Glassmorphism Shield */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] sm:rounded-[32px] flex items-center justify-center overflow-hidden border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.45),inset_0_-1.5px_2px_rgba(0,0,0,0.5)]"
          style={{
            background: "linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 60%, rgba(255, 255, 255, 0.08) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
          }}
        >
          {/* Top-Left Crisp Specular Highlight Bevel */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 65%)",
            }}
          />

          {/* Primary High-Precision Glass Shear Wave */}
          <motion.div
            className="absolute inset-y-0 w-[60%] pointer-events-none z-20"
            style={{
              background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.03) 15%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.03) 85%, transparent 100%)",
              transform: "skewX(-28deg)",
            }}
            initial={{ left: "-110%" }}
            animate={{ left: "210%" }}
            transition={{
              repeat: Infinity,
              duration: 1.25,
              ease: "easeInOut",
            }}
          />

          {/* Secondary Delicate Luster Beam */}
          <motion.div
            className="absolute inset-y-0 w-[30%] pointer-events-none z-20"
            style={{
              background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)",
              transform: "skewX(-28deg)",
            }}
            initial={{ left: "-90%" }}
            animate={{ left: "230%" }}
            transition={{
              repeat: Infinity,
              duration: 1.25,
              delay: 0.08,
              ease: "easeInOut",
            }}
          />

          {/* Qreato Brand Mark with Multi-Depth Drop Shadow */}
          <QreatoLogo 
            size={58} 
            className="text-white relative z-10 drop-shadow-[0_0_22px_rgba(255,255,255,0.95)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]" 
          />
        </motion.div>

        {/* 3. Refined Typographic Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-col items-center"
        >
          <span 
            className="text-[13px] sm:text-[14px] font-bold tracking-[0.38em] uppercase text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            QREATO
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SplashScreen;

