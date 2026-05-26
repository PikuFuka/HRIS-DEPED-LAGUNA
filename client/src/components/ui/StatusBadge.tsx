
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Draft':
        return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'Pending CSC':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <span 
      data-testid="status-badge"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getColors()}`}
    >
      {status || 'Unknown'}
    </span>
  );
}
