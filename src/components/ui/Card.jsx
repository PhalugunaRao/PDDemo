import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, title, subtitle, icon: Icon, onClick }) => {
  return (
    <div 
      className={twMerge(
        'glass-card rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-gray-300/60 group cursor-default',
        onClick && 'cursor-pointer active:scale-[0.99] border-brand-100 hover:border-brand-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          {title && <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase transition-colors group-hover:text-brand-600">{title}</h3>}
          {subtitle && <p className="text-2xl font-bold mt-1 text-gray-900">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
