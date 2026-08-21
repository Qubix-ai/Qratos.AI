import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Murgii3DChicken } from "./Murgii3DChicken";

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#040407] flex flex-col items-center justify-center overflow-hidden font-sans"
    >
      {/* Dynamic Deep Space & Iridescent Purple/Magenta Fog */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#D946EF]/15 to-transparent rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-[#A855F7]/15 rounded-full blur-[100px]" />
        
        {/* Subtle Perspective Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(to right, #8B5CF6 1px, transparent 1px),
                              linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(60deg) translateY(100px)'
          }}
        />
      </div>

      <motion.div 
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 relative z-10"
      >
        {/* Animated 3D Interactive Murgii Chicken */}
        <div className="relative">
          <Murgii3DChicken size="splash" showPedestal={true} showHologram={true} />
          
          {/* Floating Iridescent Orbiting Badge */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-[9px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(139,92,246,0.6)]"
          >
            3D MASCOT
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center text-center -mt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#8B5CF6]/35 mb-3"
          >
            <Sparkles size={12} className="text-[#D946EF] animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[9px] font-black text-[#C084FC] tracking-[0.25em] uppercase">WELCOME TO THE $500M CONVERSION SUITE</span>
          </motion.div>

          <motion.h1 
            initial={{ letterSpacing: "0.6em", opacity: 0 }}
            animate={{ letterSpacing: "0.3em", opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-3xl md:text-5xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-white via-[#E9D5FF] to-[#D946EF] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(139,92,246,0.4)] mb-1"
          >
            MURGII.AI
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-2 text-[#C084FC] text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase"
          >
            <span>PERSUASION INTELLIGENCE OS</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Hologram Beam */}
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D946EF] animate-pulse" />
          <span>SYNCHRONIZING PERSUASION NEURONS...</span>
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "240px" }}
          transition={{ delay: 0.4, duration: 1.4, ease: "easeInOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#D946EF] to-transparent shadow-[0_0_15px_#D946EF]"
        />
      </div>
    </motion.div>
  );
}
