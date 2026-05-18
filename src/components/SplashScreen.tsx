import { motion } from "motion/react";
import { BrainCircuit } from "lucide-react";

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#FFB52E]/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#FFB52E] to-[#E2A72E]/50 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(255,181,46,0.6)]">
          <BrainCircuit size={48} className="text-black" />
        </div>
        
        <div className="flex flex-col items-center">
          <motion.h1 
            initial={{ letterSpacing: "1em", opacity: 0 }}
            animate={{ letterSpacing: "0.4em", opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-white text-xl md:text-3xl font-black tracking-[0.4em] mb-2"
          >
            QRATOS.AI
          </motion.h1>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[#FFB52E] text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase"
          >
            PERSUASION OS
          </motion.span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="absolute bottom-24 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] to-transparent"
      />
    </motion.div>
  );
}
