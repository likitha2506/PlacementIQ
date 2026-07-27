import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaCheckDouble } from 'react-icons/fa';

export default function RecommendationCard({ recommendations, placed }) {
  const isPlaced = placed === "Yes";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 dark:text-amber-400">
          <FaLightbulb className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          AI Improvement Roadmap
        </h2>
      </div>

      {recommendations.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 shadow-sm flex gap-3 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-amber-500 dark:text-amber-400 font-extrabold text-sm select-none">
                {idx + 1}.
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {rec}
              </p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-800/30 text-center flex flex-col items-center">
          <FaCheckDouble className="w-10 h-10 text-emerald-500 mb-3" />
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
            Exceptional Profile!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md">
            Your metrics are highly competitive. Maintain your current coding consistency and review core computer science subjects before interviews.
          </p>
        </div>
      )}
    </div>
  );
}
