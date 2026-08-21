import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, Cpu, Zap, CheckCircle2 } from "lucide-react";

interface AIProcessingTelemetryProps {
  isGenerating: boolean;
  statusText?: string;
}

export function AIProcessingTelemetry({ isGenerating, statusText }: AIProcessingTelemetryProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "NEURAL FRICTION ANALYSIS", desc: "Mapping buyer skepticism & psychological barriers" },
    { label: "CIALDINI SCARCITY INJECTION", desc: "Calibrating urgency multipliers & loss aversion" },
    { label: "MULTI-HOOK SYNTHESIS", desc: "Generating high-CTR viral open loops" },
    { label: "$500M PERSUASION ALIGNMENT", desc: "Finalizing copy with high-ticket conversion weights" },
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl mx-auto my-4 p-4 rounded-2xl bg-black/80 backdrop-blur-2xl border border-[#FFB52E]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,181,46,0.15)] relative overflow-hidden"
      >
        {/* Top Specular Neon Beam */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB52E] via-white/80 to-transparent" />

        {/* Ambient Pulsing Radar Aura */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#FFB52E]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFB52E]/20 to-[#FFB52E]/05 border border-[#FFB52E]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,181,46,0.2)]">
              <Brain size={16} className="text-[#FFB52E] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-[#FFB52E] uppercase tracking-[0.2em]">
                  MURGII NEURAL PIPELINE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A55] animate-ping" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">
                {statusText || steps[currentStep].label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-[#FFB52E]">
            <Sparkles size={11} className="animate-spin" style={{ animationDuration: "3s" }} />
            <span>STAGE {currentStep + 1}/{steps.length}</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FFB52E] via-amber-300 to-white rounded-full shadow-[0_0_10px_#FFB52E]"
            initial={{ width: "10%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        {/* Audio / Neural Frequency Waveforms */}
        <div className="flex items-center justify-between gap-1 h-5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/06">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-[#FFB52E]/30 to-[#FFB52E]"
              animate={{
                height: [
                  `${Math.max(4, Math.sin(i * 0.5) * 16 + 4)}px`,
                  `${Math.max(4, Math.cos(i * 0.8) * 18 + 4)}px`,
                  `${Math.max(4, Math.sin(i * 0.5) * 16 + 4)}px`,
                ],
              }}
              transition={{
                duration: 0.8 + (i % 5) * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 mt-2.5">
          <span>{steps[currentStep].desc}</span>
          <span className="text-[#FFB52E] font-bold">LATENCY: 180ms</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
