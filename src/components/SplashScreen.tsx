import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";

export function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // 2.8s smooth transition before fade-out at 3s

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050409] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
    >
      {/* 1. Ambient Nebula & Aurora Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#D946EF]/15 to-[#FFBE0B]/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#A855F7]/15 rounded-full blur-[90px]" />

        {/* Subtle Fine Hex/Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #8B5CF6 1px, transparent 1px),
                              linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* 2. Central Brand Identity Card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Qreato Logo Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          {/* Subtle Outer Glow Halo */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#8B5CF6]/30 via-[#D946EF]/30 to-[#FFBE0B]/20 blur-xl opacity-75 animate-pulse" />

          {/* Frosted Glass Icon Badge */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.03] border border-white/20 backdrop-blur-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_25px_rgba(139,92,246,0.3)]">
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </div>

            {/* Qreato Geometric Mark */}
            <QreatoLogo size={46} className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
          </div>
        </motion.div>

        {/* Brand Typography */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-center flex flex-col items-center"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-nohemi"
            style={{ fontFamily: "'Nohemi', sans-serif" }}
          >
            murgii <span className="text-[#FFBE0B]">AI</span>
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest uppercase text-gray-400">
            <span>from</span>
            <span className="font-semibold text-white tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D946EF]" />
              Qreato
            </span>
          </div>
        </motion.div>
      </div>

      {/* 3. Sleek Progress Bar and Status */}
      <div className="absolute bottom-16 sm:bottom-20 flex flex-col items-center gap-3 z-10 w-full max-w-[280px] px-6">
        {/* Progress Track */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#FFBE0B] rounded-full shadow-[0_0_12px_rgba(217,70,239,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between w-full text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
            Loading Workspace
          </span>
          <span className="text-gray-400 font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
