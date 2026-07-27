import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaBriefcase, FaBuilding } from 'react-icons/fa';

export default function ResultCard({ result }) {
  const {
    placed,
    probability,
    readiness_score,
    predicted_salary,
    inferred_role,
    inferred_company_type
  } = result;

  const isPlaced = placed === "Yes";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl transition-all duration-300"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center sm:text-left">
        Prediction Summary
      </h2>

      {/* Placement Badge */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 mb-6 text-center">
        {isPlaced ? (
          <>
            <FaCheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              Placement Likely
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm">
              Based on your profile and skills, your chances of getting placed are high.
            </p>
          </>
        ) : (
          <>
            <FaTimesCircle className="w-16 h-16 text-rose-500 mb-4 animate-pulse" />
            <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              Placement Unlikely
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm">
              Your profile requires improvement before placement opportunities.
            </p>
          </>
        )}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Probability Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Placement Probability
          </span>
          <span className={`text-3xl font-extrabold mt-2 ${isPlaced ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {probability}%
          </span>
        </div>

        {/* Salary Package Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <FaMoneyBillWave className="text-slate-400" /> Expected CTC Package
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {isPlaced ? `${predicted_salary} LPA` : "0.0 LPA"}
          </span>
        </div>

        {/* Inferred Job Role */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FaBriefcase />
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Inferred Job Role
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {inferred_role || "Software Engineer"}
            </span>
          </div>
        </div>

        {/* Target Company Type */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FaBuilding />
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Target Company
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {inferred_company_type || "MNC"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
