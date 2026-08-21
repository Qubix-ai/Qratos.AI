import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, BarChart3 } from "lucide-react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  pulsePhase: number;
}

export function PremiumBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridNodes: Node3D[] = [];
    const nodeCount = 65; // Balanced for clean density
    const fov = 450; // Dynamic 3D depth perspective

    // Canvas sizing with Retina support
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const initCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    initCanvasSize();

    // Create 3D nodes for wireframe mesh
    const createWireframeData = () => {
      gridNodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 120 + Math.random() * 300;

        gridNodes.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta) * 0.7,
          z: (Math.random() * 500) - 250,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.05,
          speedZ: (Math.random() - 0.5) * 0.08,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    createWireframeData();

    // Track resize
    const resizeObserver = new ResizeObserver(() => {
      initCanvasSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Parallax tracking
    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - cx) * 0.06;
      mouseRef.current.targetY = (e.clientY - cy) * 0.06;
    };

    window.addEventListener("mousemove", onMouseMove);

    const rotSpeedX = 0.00015;
    const rotSpeedY = 0.00025;

    // Drawing Animation loop
    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const centerX = width / 2;
      const centerY = height / 2;

      const cosX = Math.cos(rotSpeedX);
      const sinX = Math.sin(rotSpeedX);
      const cosY = Math.cos(rotSpeedY);
      const sinY = Math.sin(rotSpeedY);

      gridNodes.forEach((node) => {
        node.x += node.speedX;
        node.y += node.speedY;
        node.z += node.speedZ;

        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        node.x = x1;
        node.y = y2;
        node.z = z2;

        const dist = Math.hypot(node.x, node.y, node.z);
        if (dist > 400) {
          node.x *= 0.98;
          node.y *= 0.98;
          node.z *= 0.98;
        }

        node.pulsePhase += 0.008;
      });

      ctx.lineWidth = 0.8;
      
      for (let i = 0; i < gridNodes.length; i++) {
        const n1 = gridNodes[i];
        const scale1 = fov / (fov + n1.z);
        const scrX1 = centerX + n1.x * scale1 + mouseRef.current.x * (scale1 * 0.7);
        const scrY1 = centerY + n1.y * scale1 + mouseRef.current.y * (scale1 * 0.7);

        for (let j = i + 1; j < gridNodes.length; j++) {
          const n2 = gridNodes[j];
          const dist3D = Math.hypot(n1.x - n2.x, n1.y - n2.y, n1.z - n2.z);

          if (dist3D < 160) {
            const scale2 = fov / (fov + n2.z);
            const scrX2 = centerX + n2.x * scale2 + mouseRef.current.x * (scale2 * 0.7);
            const scrY2 = centerY + n2.y * scale2 + mouseRef.current.y * (scale2 * 0.7);

            const proximity = 1 - (dist3D / 160);
            const averageZ = (n1.z + n2.z) / 2;
            const depthFactor = (averageZ + 250) / 500;
            const clampedDepth = Math.max(0.1, Math.min(1.0, depthFactor));

            ctx.beginPath();
            ctx.moveTo(scrX1, scrY1);
            ctx.lineTo(scrX2, scrY2);

            const isPurpleLine = (i + j) % 3 === 0;
            const isMagentaLine = (i + j) % 3 === 1;
            const baseOpacity = 0.07;
            const finalAlpha = baseOpacity * proximity * clampedDepth;
            
            ctx.strokeStyle = isPurpleLine 
              ? `rgba(139, 92, 246, ${finalAlpha * 1.4})` 
              : isMagentaLine
              ? `rgba(217, 70, 239, ${finalAlpha * 1.3})`
              : `rgba(255, 255, 255, ${finalAlpha})`;
            
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-transparent">
      {/* Dynamic CSS 3D Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139,92,246,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(217,70,239,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          transform: "perspective(800px) rotateX(60deg) translateY(-20%) scale(1.4)",
          transformOrigin: "top center",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 90%)"
        }}
      />

      {/* Multi-Tone Ambient Lighting Orbs */}
      <div className="absolute top-[2%] right-[8%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#C026D3]/12 to-[#7C3AED]/08 blur-[140px] pointer-events-none" />
      <div className="absolute left-[3%] bottom-[5%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#3B82F6]/14 to-[#1E3A8A]/08 blur-[150px] pointer-events-none" />

      {/* 3D wireframe constellation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none max-w-full block" />

      {/* Floating Glassmorphic Premium UI elements */}
      <div className="fixed inset-0 w-full h-full min-h-screen pointer-events-none z-10 overflow-hidden select-none">
        
        {/* Floating Conversion Card 1: Left */}
        <motion.div
          animate={{
            y: [-12, 12, -12],
            rotate: [1, -2, 1],
            x: [-5, 5, -5]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-[4%] top-[25%] hidden xl:flex flex-col gap-3 p-4 bg-black/60 backdrop-blur-2xl border border-[#8B5CF6]/30 rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.12)] min-w-[240px]"
        >
          {/* Neon micro gradient edge accent */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/80 via-white/80 to-[#D946EF]/80" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6]/25 to-[#D946EF]/15 flex items-center justify-center border border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                <BarChart3 size={15} className="text-[#D946EF]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-[#C084FC] font-black tracking-widest font-mono">CONVERSION LIFT</span>
                <span className="text-[12px] font-bold text-white tracking-tight font-sans">Murgii Multi-Hook</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-[8px] font-bold font-mono shadow-[0_0_10px_rgba(16,185,129,0.2)]">+342.8%</span>
          </div>
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: ["65%", "96%", "88%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#D946EF] rounded-full shadow-[0_0_8px_#8B5CF6]"
            />
          </div>
          <div className="flex justify-between items-center text-[8px] text-gray-400 font-mono tracking-wider">
            <span>CTR: 14.82%</span>
            <span className="text-[#D946EF] font-bold">ROAS: 6.8X</span>
          </div>
        </motion.div>

        {/* Floating Core Engine Micro State Loop: Right Side */}
        <motion.div
          animate={{
            y: [15, -15, 15],
            rotate: [-1, 1.5, -1],
            x: [4, -4, 4]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-[5%] top-[38%] hidden lg:flex flex-col gap-2.5 p-4 bg-black/60 backdrop-blur-2xl border border-[#8B5CF6]/30 rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.12)] min-w-[220px]"
        >
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/80 to-[#D946EF]/80" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D946EF] animate-ping" />
            <span className="text-[9px] text-[#C084FC] font-black font-mono tracking-widest uppercase">MURGII_ENGINE_V2</span>
          </div>
          
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400 font-mono">LATENCY :</span>
              <span className="font-mono text-[#D946EF] font-bold">142ms</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400 font-mono">PERSUASION :</span>
              <span className="font-mono text-emerald-400 font-bold">99.8% PEAK</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400 font-mono">VALUATION :</span>
              <span className="font-mono text-white font-bold">$500M GRADE</span>
            </div>
          </div>
        </motion.div>

        {/* Brand floating asset icon (Shield Checklist) */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [8, -2, 8]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-[8%] bottom-[20%] hidden xl:flex items-center gap-3 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-[10px] text-gray-300 font-mono"
        >
          <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-white">
            <ShieldCheck size={12} className="text-[#D946EF]" />
          </div>
          <span className="font-bold tracking-wider text-white/90">MURGII PERSUASION NEURONS ACTIVE</span>
        </motion.div>

        {/* Radar sweep / glowing ring */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#8B5CF6]/10 pointer-events-none animate-[spin_100s_linear_infinite]" />
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[850px] h-[850px] rounded-full border-dashed border-[#D946EF]/10 pointer-events-none animate-[spin_240s_linear_infinite]" />
      </div>
    </div>
  );
}
