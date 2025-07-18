import React from 'react';
import './FormInput.css';

const FormInput = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormInput; 