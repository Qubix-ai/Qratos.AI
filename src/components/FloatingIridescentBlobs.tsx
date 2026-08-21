import { motion } from "motion/react";

interface FloatingIridescentBlobsProps {
  className?: string;
  variant?: "workspace" | "landing" | "modal";
}

export function FloatingIridescentBlobs({ className = "", variant = "workspace" }: FloatingIridescentBlobsProps) {
  if (variant === "modal") {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
        {/* Blob 1: Top Right Magenta / Purple Glow */}
        <motion.div
          animate={{
            x: [0, 20, -12, 0],
            y: [0, -15, 12, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#C026D3]/30 via-[#9333EA]/20 to-[#7C3AED]/25 blur-[90px]"
        />

        {/* Blob 2: Bottom Left Blue Aura */}
        <motion.div
          animate={{
            x: [0, -15, 12, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.94, 1.06, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-[#3B82F6]/25 via-[#2563EB]/20 to-[#1E3A8A]/25 blur-[100px]"
        />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Upper Region: Magenta-to-Purple Ambient Fluid Source */}
      <motion.div
        animate={{
          x: [0, 35, -25, 15, 0],
          y: [0, -25, 20, -10, 0],
          scale: [1, 1.1, 0.94, 1.05, 1],
          rotate: [0, 10, -8, 5, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-28 right-0 w-[550px] h-[550px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-br from-[#C026D3]/20 via-[#9333EA]/16 to-[#7C3AED]/12 blur-[120px]"
      />

      {/* Lower Region: Distinct Blue Ambient Fluid Source */}
      <motion.div
        animate={{
          x: [0, -40, 25, -15, 0],
          y: [0, 30, -20, 15, 0],
          scale: [1, 0.92, 1.08, 0.96, 1],
          rotate: [0, -12, 10, -5, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-36 left-[-5%] w-[520px] h-[520px] md:w-[680px] md:h-[680px] rounded-full bg-gradient-to-tr from-[#3B82F6]/20 via-[#2563EB]/15 to-[#1E3A8A]/12 blur-[125px]"
      />
    </div>
  );
}
