"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface RadialProgressProps {
  score: number;
  size?: number;
}

export default function RadialProgress({ score, size = 140 }: RadialProgressProps) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  const strokeWidth = 12;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color band
  let strokeColor = "stroke-amber-500";
  let textColor = "text-amber-400";
  let glowColor = "shadow-amber-500/20";

  if (normalizedScore >= 75) {
    strokeColor = "stroke-emerald-500";
    textColor = "text-emerald-400";
    glowColor = "shadow-emerald-500/20";
  } else if (normalizedScore >= 40) {
    strokeColor = "stroke-indigo-500";
    textColor = "text-indigo-400";
    glowColor = "shadow-indigo-500/20";
  }

  return (
    <div 
      className={clsx("relative flex items-center justify-center flex-shrink-0", glowColor)} 
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-zinc-800/80 fill-none"
        />

        {/* Foreground Arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={clsx("fill-none transition-colors duration-300", strokeColor)}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>

      {/* Centered Score Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={clsx("text-3xl font-extrabold tracking-tight font-mono", textColor)}>
          {normalizedScore}%
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
          Readiness
        </span>
      </div>
    </div>
  );
}
