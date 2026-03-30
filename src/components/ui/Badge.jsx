import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({ children, status = 'new', className }) => {
  const statusStyles = {
    new: 'badge-new',
    confirmed: 'badge-confirmed',
    rejected: 'badge-rejected',
    completed: 'badge-completed',
    'no-show': 'badge-no-show',
    verification_required: 'badge-verification',
    received: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <span className={twMerge(
      'badge',
      statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200',
      className
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};
