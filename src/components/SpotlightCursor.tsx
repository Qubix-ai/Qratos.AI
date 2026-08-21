import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function SpotlightCursor() {
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.2 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only run on desktop/pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Large Ambient Violet-Magenta Radial Glow tracking cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9990] w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen opacity-70 hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(217, 70, 239, 0.04) 40%, transparent 70%)",
        }}
      />

      {/* 2. Focused Sharp Spotlight */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9991] w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen opacity-50 hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          background: "radial-gradient(circle, rgba(233, 213, 255, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 80%)",
        }}
      />
    </>
  );
}
