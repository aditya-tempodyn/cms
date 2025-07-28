import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'normal',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  ...props
}) => {
  const className = [
    'btn',
    `btn-${variant}`,
    size !== 'normal' ? `btn-${size}` : '',
    fullWidth ? 'btn-full-width' : '',
    loading ? 'btn-loading' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 