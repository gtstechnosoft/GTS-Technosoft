import React from 'react';

export const Badge = ({ status, children, size = 'sm' }) => {
  const norm = (status || children || '').toString().toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['ACTIVE', 'RESOLVED', 'CLOSED', 'QUALIFIED', 'GA', 'STABLE', 'LTS'].includes(norm)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['TRIALING', 'PENDING_APPROVAL', 'NEW', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'P3_MEDIUM'].includes(norm)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['P1_CRITICAL', 'REVOKED', 'SUSPENDED', 'DECOMMISSIONED', 'REJECTED', 'PAST_DUE'].includes(norm)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['P2_HIGH'].includes(norm)) {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (['INTERNAL_ADMIN', 'ORG_ADMIN', 'ENTERPRISE', 'ULTIMATE', 'CONVERTED'].includes(norm)) {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (['SUBSCRIPTION', 'PERPETUAL', 'SOFTWARE_ADMIN'].includes(norm)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-mono font-semibold rounded-md border ${colorClasses} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {children || status}
    </span>
  );
};
