import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: PropsWithChildren<ButtonProps>) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variantStyles =
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300';

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
