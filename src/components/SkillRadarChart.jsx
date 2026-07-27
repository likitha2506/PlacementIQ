import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function SkillRadarChart({ skills }) {
  const data = [
    { subject: 'Python', A: skills.python_skill, fullMark: 10 },
    { subject: 'DSA', A: skills.dsa_skill, fullMark: 10 },
    { subject: 'ML', A: skills.ml_skill, fullMark: 10 },
    { subject: 'Web Dev', A: skills.web_dev_skill, fullMark: 10 }
  ];

  return (
    <div className="w-full h-80 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 self-start pl-2">
        Skill Matrix Analysis
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 10]} 
              tick={{ fill: '#94a3b8' }} 
              axisLine={false} 
            />
            <Radar
              name="Student Skills"
              dataKey="A"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
