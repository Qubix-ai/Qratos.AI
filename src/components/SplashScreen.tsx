import { motion } from "motion/react";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Murgii3DChicken } from "./Murgii3DChicken";

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#040407] flex flex-col items-center justify-center overflow-hidden font-sans"
    >
      {/* Dynamic Deep Space & Gold Fog */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FFB52E]/15 via-purple-600/10 to-transparent rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#FF2A55]/10 rounded-full blur-[100px]" />
        
        {/* Subtle Perspective Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, #FFB52E 1px, transparent 1px),
                              linear-gradient(to bottom, #FFB52E 1px, transparent 1px)`,
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
          
          {/* Subtle Floating Orbiting Badge */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFB52E] to-[#FFA000] text-black text-[9px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,181,46,0.6)]"
          >
            3D MASCOT
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center text-center -mt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#FFB52E]/30 mb-3"
          >
            <Sparkles size={12} className="text-[#FFB52E] animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[9px] font-black text-[#FFB52E] tracking-[0.25em] uppercase">WELCOME TO THE $500M CONVERSION SUITE</span>
          </motion.div>

          <motion.h1 
            initial={{ letterSpacing: "0.6em", opacity: 0 }}
            animate={{ letterSpacing: "0.3em", opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-3xl md:text-5xl font-black tracking-[0.3em] uppercase bg-gradient-to-br from-white via-gray-100 to-[#FFB52E] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,181,46,0.3)] mb-1"
          >
            MURGII.AI
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-2 text-[#FFB52E] text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase"
          >
            <span>PERSUASION INTELLIGENCE OS</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Hologram Beam */}
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB52E] animate-pulse" />
          <span>SYNCHRONIZING PERSUASION NEURONS...</span>
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "240px" }}
          transition={{ delay: 0.4, duration: 1.4, ease: "easeInOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#FFB52E] to-transparent shadow-[0_0_15px_#FFB52E]"
        />
      </div>
    </motion.div>
  );
}

