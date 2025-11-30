import React from 'react';
import { Kid } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsViewProps {
  kids: Kid[];
}

// Map tailwind color names to hex for Recharts
const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
};

export const StatsView: React.FC<StatsViewProps> = ({ kids }) => {
  if (kids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p>No data yet.</p>
      </div>
    );
  }

  const data = kids.map(k => ({
    name: k.name,
    points: k.points,
    color: COLOR_MAP[k.color] || '#3b82f6'
  }));

  // Find max points to set domain nicely
  const maxPoints = Math.max(...kids.map(k => k.points), 10);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[500px]">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Leaderboard</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            hide 
            domain={[0, maxPoints + 2]} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="points" radius={[10, 10, 10, 10]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};