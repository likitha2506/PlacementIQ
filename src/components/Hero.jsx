import React from 'react';
import { FaBrain, FaChartBar, FaFileAlt, FaUserCheck } from 'react-icons/fa';

export default function Hero() {
  const features = [
    {
      icon: <FaBrain className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
      title: "ML Powered Prediction",
      desc: "Instant placement evaluation using our trained Logistic Regression classifier."
    },
    {
      icon: <FaChartBar className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Skill Assessment",
      desc: "Analyze your proficiency across programming, DSA, web dev, and machine learning."
    },
    {
      icon: <FaFileAlt className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      title: "Resume Evaluation",
      desc: "Get score-based recommendations to make your resume recruiter-ready."
    },
    {
      icon: <FaUserCheck className="w-6 h-6 text-violet-500 dark:text-violet-400" />,
      title: "Placement Readiness",
      desc: "Determine your placement readiness score based on academic and technical parameters."
    }
  ];

  return (
    <div className="relative overflow-hidden mb-12 py-10 px-6 sm:px-12 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-800/40 border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-xl transition-all duration-300">
      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-100/60 dark:text-indigo-400 dark:bg-indigo-950/40 border border-indigo-200/30 dark:border-indigo-800/30 uppercase mb-6 animate-pulse">
          ⚡ Placement Analytics Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Predict Your Placement Chances <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">Using AI</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Analyze your skills, academics, projects, internships, and profile strength to estimate your placement eligibility.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mt-8">
          {features.map((feat, index) => (
            <div key={index} className="p-5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 hover:shadow-lg dark:hover:shadow-slate-950/30 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700/60 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5 text-base">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
