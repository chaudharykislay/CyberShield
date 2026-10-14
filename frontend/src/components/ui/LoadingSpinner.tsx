import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Processing analysis...',
  size = 'md',
  fullHeight = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullHeight ? 'min-h-[350px] w-full' : 'py-8'
      }`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full border-cyan-500/20 border-t-cyan-400 animate-spin`}
      />
      {label && (
        <p className="text-xs font-medium text-slate-400 tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
