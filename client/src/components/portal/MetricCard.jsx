import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'teal', onClick }) => {
  const colorMap = {
    teal: 'text-brand-cyan bg-brand-teal/10 border-brand-teal/30',
    blue: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 rounded-2xl transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorMap[color] || colorMap.teal}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 font-mono">
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
