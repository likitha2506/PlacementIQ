import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PerformanceChart({ scores }) {
  const data = [
    { name: 'Coding', Score: scores.coding_score },
    { name: 'Aptitude', Score: scores.aptitude_score },
    { name: 'Comm', Score: scores.communication_score },
    { name: 'Resume', Score: scores.resume_score }
  ];

  // Curated elegant colors for each bar
  const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div className="w-full h-80 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-xl">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 self-start pl-2">
        Performance Evaluation
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px'
              }}
            />
            <Bar dataKey="Score" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
