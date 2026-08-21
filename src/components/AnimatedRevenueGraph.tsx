import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

export function AnimatedRevenueGraph() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D" | "ALL">("30D");
  const [activeMetric, setActiveMetric] = useState<number>(3); // hovered index

  // Telemetry streams
  const [liveConversionRate, setLiveConversionRate] = useState(14.82);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveConversionRate((prev) => +(prev + (Math.random() * 0.1 - 0.048)).toFixed(2));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const dataSets = {
    "7D": {
      total: "$1,420,850",
      lift: "+182.4%",
      points: [
        { label: "Mon", val: 30, rev: "$120k", ctr: "9.2%" },
        { label: "Tue", val: 45, rev: "$180k", ctr: "11.4%" },
        { label: "Wed", val: 40, rev: "$165k", ctr: "10.8%" },
        { label: "Thu", val: 70, rev: "$290k", ctr: "13.6%" },
        { label: "Fri", val: 65, rev: "$270k", ctr: "12.9%" },
        { label: "Sat", val: 88, rev: "$380k", ctr: "15.1%" },
        { label: "Sun", val: 95, rev: "$415k", ctr: "16.4%" },
      ],
    },
    "30D": {
      total: "$18,650,400",
      lift: "+342.8%",
      points: [
        { label: "W1", val: 35, rev: "$3.2M", ctr: "10.2%" },
        { label: "W2", val: 58, rev: "$4.8M", ctr: "12.8%" },
        { label: "W3", val: 74, rev: "$6.1M", ctr: "14.5%" },
        { label: "W4", val: 96, rev: "$7.9M", ctr: "16.9%" },
      ],
    },
    "90D": {
      total: "$74,210,000",
      lift: "+418.5%",
      points: [
        { label: "M1", val: 40, rev: "$18.2M", ctr: "11.1%" },
        { label: "M2", val: 68, rev: "$25.4M", ctr: "14.2%" },
        { label: "M3", val: 98, rev: "$30.6M", ctr: "17.4%" },
      ],
    },
    "ALL": {
      total: "$528,400,000",
      lift: "+620.0%",
      points: [
        { label: "Seed", val: 20, rev: "$24M", ctr: "8.4%" },
        { label: "Phase 1", val: 45, rev: "$95M", ctr: "11.6%" },
        { label: "Phase 2", val: 72, rev: "$185M", ctr: "14.9%" },
        { label: "Murgii Scale", val: 100, rev: "$224M", ctr: "18.2%" },
      ],
    },
  };

  const current = dataSets[timeframe];

  // Generate smooth SVG curve path
  const width = 600;
  const height = 200;
  const points = current.points;
  const step = width / (points.length - 1 || 1);

  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - (p.val / 100) * (height - 40) - 20;
    return { x, y, ...p };
  });

  const pathD = coords.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-[32px] bg-black/70 backdrop-blur-3xl border border-[#8B5CF6]/30 p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(139,92,246,0.15)] overflow-hidden">
      {/* Specular Top Border Highlight */}
      <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/80 via-white/80 to-[#D946EF]/80" />

      {/* Header telemetry row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/08">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D946EF] animate-ping" />
            <span className="text-[10px] font-mono font-black tracking-[0.25em] text-[#C084FC] uppercase">
              LIVE MURGII CONVERSION ENGINE
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl md:text-4xl font-black text-white font-sans tracking-tight">
              {current.total}
            </h3>
            <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              {current.lift} LIFT
            </span>
          </div>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          {(["7D", "30D", "90D", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setActiveMetric(dataSets[tf].points.length - 1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                timeframe === tf
                  ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Key KPI telemetry counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/06 flex flex-col">
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-1">CONVERSION CTR</span>
          <span className="text-lg font-black text-[#D946EF] font-mono">{liveConversionRate}%</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/06 flex flex-col">
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-1">AVERAGE ROAS</span>
          <span className="text-lg font-black text-white font-mono">6.82X</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/06 flex flex-col">
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-1">PERSUASION MATCH</span>
          <span className="text-lg font-black text-emerald-400 font-mono">99.4%</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/06 flex flex-col">
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-1">TOTAL ATTRIBUTED</span>
          <span className="text-lg font-black text-white font-mono">$528.4M</span>
        </div>
      </div>

      {/* Interactive SVG Chart Stage */}
      <div className="relative w-full h-[220px] overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent p-2">
        {/* Subtle Horizontal Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
          <div className="border-b border-white/20 w-full" />
          <div className="border-b border-white/20 w-full" />
          <div className="border-b border-white/20 w-full" />
          <div className="border-b border-white/20 w-full" />
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Smooth Area Gradient */}
            <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#D946EF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing Stroke Gradient */}
            <linearGradient id="revenueStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="60%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <motion.path
            d={areaD}
            fill="url(#revenueAreaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Line Stroke with shimmer */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#revenueStrokeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Interactive Data Points */}
          {coords.map((pt, idx) => (
            <g key={idx} className="cursor-pointer" onClick={() => setActiveMetric(idx)}>
              {/* Outer pulsing ring for active */}
              {activeMetric === idx && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="none"
                  stroke="#D946EF"
                  strokeWidth="1.5"
                  className="animate-ping"
                  opacity="0.75"
                />
              )}
              {/* Core Node */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activeMetric === idx ? "6.5" : "4.5"}
                fill={activeMetric === idx ? "#FFFFFF" : "#D946EF"}
                stroke="#0A0812"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip Indicator */}
        {coords[activeMetric] && (
          <motion.div
            key={activeMetric}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 px-3 py-2 rounded-xl bg-black/80 border border-[#8B5CF6]/40 backdrop-blur-xl shadow-xl flex items-center gap-3 pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-[#D946EF]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono uppercase">{coords[activeMetric].label} REVENUE</span>
              <span className="text-sm font-black text-white font-mono">{coords[activeMetric].rev}</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono uppercase">CTR LIFT</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{coords[activeMetric].ctr}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Live Feed Telemetry Strip */}
      <div className="mt-4 pt-4 border-t border-white/06 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-[#C084FC]" />
          <span>REAL-TIME MULTI-TOUCH ATTRIBUTION ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 14ms</span>
          <span className="text-[#D946EF] font-bold">500M+ TELEMETRY VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
