import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, HTMLMotionProps } from "motion/react";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  variant?: "gold" | "purple" | "glass" | "ghost" | "crimson";
}

export function MagneticButton({
  children,
  strength = 0.35,
  className = "",
  variant = "purple",
  onClick,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) * strength);
    mouseY.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Pre-configured Luxury Variants matching Bolt Product Family
  const variantStyles = {
    purple: "bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white font-black border border-white/20 shadow-[0_10px_35px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_15px_45px_rgba(217,70,239,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]",
    gold: "bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white font-black border border-white/20 shadow-[0_10px_35px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_15px_45px_rgba(217,70,239,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]",
    glass: "bg-white/[0.04] text-white border border-white/12 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white/[0.08] hover:border-[#8B5CF6]/50 hover:text-[#D946EF]",
    ghost: "bg-transparent text-gray-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5",
    crimson: "bg-gradient-to-br from-[#FF2A55] to-[#C9002B] text-white font-bold border border-[#FF6B8B]/30 shadow-[0_10px_30px_rgba(255,42,85,0.35)] hover:shadow-[0_15px_40px_rgba(255,42,85,0.55)]",
  }[variant];

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center select-none overflow-hidden transition-all duration-300 rounded-2xl cursor-pointer ${variantStyles} ${className}`}
      {...props}
    >
      {/* Specular Light Flare Sweep on Hover */}
      <motion.div
        animate={{
          x: isHovered ? ["-100%", "200%"] : "-100%",
        }}
        transition={{
          duration: 1.2,
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
