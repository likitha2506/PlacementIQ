import React from 'react';
import { motion } from 'framer-motion';

export default function ReadinessMeter({ score }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Dynamic colors based on readiness score
  const getColor = (val) => {
    if (val >= 75) return '#10b981'; // Green
    if (val >= 60) return '#3b82f6'; // Blue
    if (val >= 40) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const color = getColor(score);

  return (
    <div className="w-full h-80 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 self-start pl-2">
        Placement Readiness Meter
      </h3>
      <div className="relative flex items-center justify-center h-52 w-52">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800/60"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Center label */}
        <div className="absolute text-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="block text-4xl font-black text-slate-800 dark:text-white"
          >
            {score}%
          </motion.span>
          <span className="text-xxs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1 block">
            Readiness
          </span>
        </div>
      </div>
    </div>
  );
}
