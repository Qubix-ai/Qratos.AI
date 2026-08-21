import React from "react";

interface QreatoLogoProps {
  size?: number | string;
  className?: string;
  dotClassName?: string;
}

/**
 * Qreato Brand Logo: "•//"
 * - Distinct dot on the left
 * - Followed by two thick parallel 45° rounded capsules
 * Matched precisely to the official Qreato brand mark geometry.
 */
export function QreatoLogo({ 
  size = 20, 
  className = "text-white", 
  dotClassName = "fill-current"
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
      {/* Accent / Lead Dot • */}
      <circle
        cx="23"
        cy="43"
        r="7.5"
        className={dotClassName}
      />

      {/* First Capsule Slash / */}
      <line
        x1="41"
        y1="59"
        x2="57"
        y2="39"
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* Second Capsule Slash / */}
      <line
        x1="61"
        y1="59"
        x2="77"
        y2="39"
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
      />
    </svg>
  );
}
