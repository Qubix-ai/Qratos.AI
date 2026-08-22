import React from "react";

interface QreatoLogoProps {
  size?: number | string;
  className?: string;
  dotClassName?: string;
}

/**
 * Qreato Brand Geometric Mark: "• //"
 * Exact geometry matching official brand asset:
 * 1. Left: Solid circular dot (explicitly filled with currentColor)
 * 2. Middle: First parallel angled rounded capsule (slanted ~-60°)
 * 3. Right: Second parallel angled rounded capsule
 * Perfectly balanced spacing: equal, clear gap between dot and first bar,
 * and a small, even, distinct gap between the two parallel bars.
 */
export function QreatoLogo({ 
  size = 20, 
  className = "text-white", 
  dotClassName = ""
}: QreatoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Qreato Logo"
    >
      {/* 1. Left Solid Circular Dot */}
      <circle
        cx="25.5"
        cy="50"
        r="5.75"
        fill="currentColor"
        className={dotClassName}
      />

      {/* 2. First Angled Rounded Bar */}
      <line
        x1="38.5"
        y1="64"
        x2="54.5"
        y2="36"
        stroke="currentColor"
        strokeWidth="11.5"
        strokeLinecap="round"
      />

      {/* 3. Second Angled Rounded Bar */}
      <line
        x1="59.5"
        y1="64"
        x2="75.5"
        y2="36"
        stroke="currentColor"
        strokeWidth="11.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default QreatoLogo;

