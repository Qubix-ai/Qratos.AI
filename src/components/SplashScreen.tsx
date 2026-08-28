import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { QreatoLogo } from "./QreatoLogo";
import Hyperspeed from "./Hyperspeed";

export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 13000; // 13.0 seconds duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Hyperspeed effect options: white left trails, yellow right trails, pitch black background
  const hyperspeedOptions = useMemo(
    () => ({
      distortion: "turbulentDistortion",
      length: 450,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.35,
      totalSideLightSticks: 45,
      lightPairsPerRoadWay: 50,
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],
      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],
      carLightsLength: [20, 60],
      carLightsRadius: [0.06, 0.16],
      carWidthPercentage: [0.3, 0.5],
      carShiftX: [-0.2, 0.2],
      carFloorSeparation: [0.05, 1],
      colors: {
        roadColor: 0x000000,
        islandColor: 0x000000,
        background: 0x000000,
        shoulderLines: 0x222230,
        brokenLines: 0x222230,
        leftCars: [0xffffff, 0xfcfcff, 0xf0f2f5], // Pure glowing white on left side
        rightCars: [0xffd700, 0xffbe0b, 0xffc72c, 0xfacc15], // Radiant glowing yellow on right side
        sticks: 0xffd700
      }
    }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-between overflow-hidden font-sans select-none"
    >
      {/* 1. Full-Screen Hyperspeed Lightwarp Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>

      {/* Top Spacer & Container for Upward Content Placement */}
      <div className="w-full flex-1 flex flex-col items-center justify-start pt-12 sm:pt-16 md:pt-20 z-10">
        {/* 2. Brand & Heading Block */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        >
          {/* Glassmorphic Block Beneath Qreato Logo */}
          <div className="relative mb-5 sm:mb-6">
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.3)] transition-transform duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              {/* Subtle top-left light sheen on glass surface */}
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)",
                }}
              />
              <QreatoLogo size={52} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.95)]" />
            </div>
          </div>

          {/* Heading split onto two lines */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Nohemi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            <span className="block">
              Meet <span className="bg-gradient-to-r from-white via-[#FFD700] to-[#FFBE0B] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,190,11,0.5)]">murgii AI</span>, the last
            </span>
            <span className="block mt-1 sm:mt-2 text-white">
              Copywriting tool you need
            </span>
          </h1>
        </motion.div>
      </div>

      {/* 3. Footer Section with White Loading Bar & Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-4 w-full max-w-md px-6 pb-8 sm:pb-12"
      >
        {/* Loading Bar filled with pure white */}
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full shadow-[0_0_14px_rgba(255,255,255,0.95)] transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer Text */}
        <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium tracking-wide text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          © 2026 Qreato Labs. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default SplashScreen;
