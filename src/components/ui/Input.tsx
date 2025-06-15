import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-hunter-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 bg-ivory-50',
          'focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-sage-300 text-hunter-900 placeholder-sage-500',
          'disabled:bg-sage-50 disabled:text-sage-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-sage-600">{helperText}</p>
      )}
    </div>
  );
};