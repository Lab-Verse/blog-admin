import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className = '', variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 border-gray-300',
    outline: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 border-gray-300',
    destructive: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-blue-500 border-transparent shadow-none',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
