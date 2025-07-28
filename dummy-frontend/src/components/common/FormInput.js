import React from 'react';
import './FormInput.css';

const FormInput = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows,
  ...props
}) => {
  const inputClassName = [
    'form-input',
    type === 'textarea' ? 'form-textarea' : '',
    error ? 'error' : ''
  ].filter(Boolean).join(' ');

  const labelClassName = [
    'form-label',
    required ? 'required' : ''
  ].filter(Boolean).join(' ');

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  const inputProps = {
    className: inputClassName,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    ...props
  };

  if (type !== 'textarea') {
    inputProps.type = type;
  } else {
    inputProps.rows = rows || 4;
  }

  return (
    <div className="form-input-container">
      {label && (
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
      )}
      <InputComponent
        id={name}
        {...inputProps}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormInput; 