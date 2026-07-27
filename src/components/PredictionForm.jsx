import React, { useState } from 'react';
import { FaGraduationCap, FaCode, FaClipboardList, FaFileAlt, FaSpinner } from 'react-icons/fa';

export default function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    cgpa: 7.5,
    branch: 'CSE',
    college_tier: 'Tier 2',
    python_skill: 6,
    dsa_skill: 6,
    ml_skill: 5,
    web_dev_skill: 6,
    coding_score: 70,
    communication_score: 70,
    aptitude_score: 70,
    internships: 0,
    projects: 2,
    backlogs: 0,
    resume_score: 70,
    skill_score: 70
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // CGPA validation
    if (formData.cgpa === '' || formData.cgpa === null) {
      newErrors.cgpa = "CGPA is required";
    } else {
      const val = parseFloat(formData.cgpa);
      if (isNaN(val)) newErrors.cgpa = "Must be a number";
      else if (val < 0 || val > 10) newErrors.cgpa = "CGPA must be between 0 and 10";
    }

    // Number fields non-negative validation
    ['internships', 'projects', 'backlogs'].forEach(field => {
      const val = parseInt(formData[field]);
      if (formData[field] === '' || formData[field] === null) {
        newErrors[field] = "This field is required";
      } else if (isNaN(val)) {
        newErrors[field] = "Must be an integer";
      } else if (val < 0) {
        newErrors[field] = "Negative values not allowed";
      }
    });

    // Score fields validation (0-100)
    ['coding_score', 'communication_score', 'aptitude_score', 'resume_score', 'skill_score'].forEach(field => {
      const val = parseFloat(formData[field]);
      if (formData[field] === '' || formData[field] === null) {
        newErrors[field] = "This field is required";
      } else if (isNaN(val)) {
        newErrors[field] = "Must be a number";
      } else if (val < 0 || val > 100) {
        newErrors[field] = "Must be between 0 and 100";
      }
    });

    // Skill fields validation (0-10)
    ['python_skill', 'dsa_skill', 'ml_skill', 'web_dev_skill'].forEach(field => {
      const val = parseFloat(formData[field]);
      if (formData[field] === '' || formData[field] === null) {
        newErrors[field] = "Required";
      } else if (isNaN(val)) {
        newErrors[field] = "Must be a number";
      } else if (val < 0 || val > 10) {
        newErrors[field] = "Must be between 0 and 10";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : (name === 'cgpa' ? parseFloat(value) : parseInt(value, 10));
    } else if (type === 'range') {
      parsedValue = parseFloat(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const renderSectionHeader = (icon, title) => (
    <div className="flex items-center gap-3 pb-3 mb-6 border-b border-slate-100 dark:border-slate-800">
      <div className="text-indigo-600 dark:text-indigo-400 text-lg">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl transition-all duration-300">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8 text-center sm:text-left">
        Student Assessment Profile
      </h2>

      <div className="space-y-10">
        {/* Section 1: Academics */}
        <div>
          {renderSectionHeader(<FaGraduationCap />, "Academic Details")}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="cgpa" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                CGPA (0 - 10)
              </label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                step="0.1"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-slate-950/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-800 dark:focus:ring-indigo-400/50 ${errors.cgpa ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="e.g. 8.5"
              />
              {errors.cgpa && <p className="text-red-500 text-xs mt-1.5">{errors.cgpa}</p>}
            </div>

            <div>
              <label htmlFor="branch" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 dark:bg-slate-950/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="EEE">Electrical (EEE)</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="AI & DS">Artificial Intelligence (AI & DS)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="college_tier" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                College Tier
              </label>
              <select
                id="college_tier"
                name="college_tier"
                value={formData.college_tier}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 dark:bg-slate-950/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50"
              >
                <option value="Tier 1">Tier 1 (IITs, NITs, Top State)</option>
                <option value="Tier 2">Tier 2 (Mid-ranking Engineering Colleges)</option>
                <option value="Tier 3">Tier 3 (Local or Private Colleges)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Technical Skills */}
        <div>
          {renderSectionHeader(<FaCode />, "Technical Skills (0 - 10)")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['python_skill', 'dsa_skill', 'ml_skill', 'web_dev_skill'].map(field => {
              const label = field.split('_').map(w => w === 'dsa' ? 'DSA' : w === 'ml' ? 'ML' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              return (
                <div key={field} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formData[field]} / 10</span>
                  </div>
                  <input
                    type="range"
                    name={field}
                    min="0"
                    max="10"
                    step="1"
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Assessment Scores */}
        <div>
          {renderSectionHeader(<FaClipboardList />, "Assessment Scores (0 - 100)")}
          <div className="space-y-5">
            {['coding_score', 'aptitude_score', 'communication_score'].map(field => {
              const label = field.replace('_score', '').charAt(0).toUpperCase() + field.replace('_score', '').slice(1) + ' Score';
              return (
                <div key={field} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formData[field]} / 100</span>
                  </div>
                  <input
                    type="range"
                    name={field}
                    min="0"
                    max="100"
                    step="1"
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Profile Strength */}
        <div>
          {renderSectionHeader(<FaFileAlt />, "Profile Strength")}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {['internships', 'projects', 'backlogs'].map(field => (
              <div key={field}>
                <label htmlFor={field} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="number"
                  id={field}
                  name={field}
                  min="0"
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-slate-950/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-800 dark:focus:ring-indigo-400/50 ${errors[field] ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="e.g. 0"
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1.5">{errors[field]}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['resume_score', 'skill_score'].map(field => {
              const label = field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              return (
                <div key={field} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label} (0-100)</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formData[field]} / 100</span>
                  </div>
                  <input
                    type="range"
                    name={field}
                    min="0"
                    max="100"
                    step="1"
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.98] disabled:scale-100 disabled:opacity-75 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-900/30 transition-all duration-200 text-lg uppercase tracking-wider"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin w-5 h-5" />
              Evaluating Profile...
            </>
          ) : (
            "Check Placement Eligibility"
          )}
        </button>
      </div>
    </form>
  );
}
