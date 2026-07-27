import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaChartLine, FaRobot, FaUserAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Hero from '../components/Hero';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import ReadinessMeter from '../components/ReadinessMeter';
import SkillRadarChart from '../components/SkillRadarChart';
import PerformanceChart from '../components/PerformanceChart';
import RecommendationCard from '../components/RecommendationCard';
import { predictPlacement } from '../services/predictionService';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentInput, setCurrentInput] = useState(null);

  // Sync dark mode class on body element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setCurrentInput(formData);
    
    try {
      const data = await predictPlacement(formData);
      setResult(data);
      
      // Smooth scroll to results on submit
      setTimeout(() => {
        document.getElementById('prediction-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch placement prediction. Please make sure the backend server is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <FaRobot className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              Placement<span className="text-indigo-600 dark:text-indigo-400">IQ</span>
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {darkMode ? <FaSun className="w-5 h-5 text-amber-500" /> : <FaMoon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <Hero />

        {/* Display connection error if backend is offline */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-400 flex items-center gap-3">
            <FaExclamationTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Assessment Form: Left Col (Span 5 on Large Screens) */}
          <div className="lg:col-span-5">
            <PredictionForm onSubmit={handlePredict} loading={loading} />
          </div>

          {/* Results Dashboard: Right Col (Span 7 on Large Screens) */}
          <div className="lg:col-span-7 space-y-8">
            {loading ? (
              // Skeleton loading screen
              <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl animate-pulse space-y-6">
                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-40 w-full bg-slate-100 dark:bg-slate-850 rounded-2xl" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-slate-100 dark:bg-slate-850 rounded-2xl" />
                  <div className="h-24 bg-slate-100 dark:bg-slate-850 rounded-2xl" />
                </div>
              </div>
            ) : result ? (
              // Active Prediction Dashboard
              <div id="prediction-results" className="space-y-8 scroll-mt-24">
                {/* Result Status & Probability Card */}
                <ResultCard result={result} />

                {/* Analytical Charts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Circular progress meter */}
                  <div className="sm:col-span-1">
                    <ReadinessMeter score={result.readiness_score} />
                  </div>
                  {/* Skill Radar Chart */}
                  <div className="sm:col-span-1">
                    <SkillRadarChart skills={currentInput} />
                  </div>
                  {/* Performance scores bar chart */}
                  <div className="sm:col-span-1">
                    <PerformanceChart scores={currentInput} />
                  </div>
                </div>

                {/* Improvement Recommendations Card */}
                <RecommendationCard 
                  recommendations={result.recommendations} 
                  placed={result.placed} 
                />
              </div>
            ) : (
              // Default Welcome State
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/30 dark:bg-slate-900/20 py-20">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <FaChartLine className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Awaiting Assessment Submission
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Complete the profile details in the form on the left and submit to generate your AI Placement Analytics Dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200/50 dark:border-slate-800/80 py-8 bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-xs text-center">
        <p>© 2026 PlacementIQ. Built using Scikit-Learn, FastAPI, and React.</p>
      </footer>
    </div>
  );
}
