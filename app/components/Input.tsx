'use client';

import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  labelText?: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  type?: string;
  disabled?: boolean;
  variant?: 'default' | 'light';
  min?: number;
  preventNegative?: boolean;
  onValidationError?: (error: string) => void;
}

const InputComponent: React.FC<InputProps> = ({
  labelText,
  placeholder = '',
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = 'text',
  disabled = false,
  variant = 'default',
  min,
  preventNegative = false,
  onValidationError,
}) => {
  const handleReset = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // If preventNegative is true and type is number, prevent negative values
    if (preventNegative && (type === 'number' || type === 'tel')) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue) && numValue < 0) {
        onValidationError?.("Negative values are not allowed");
        return; // Don't update if negative
      }
      // Also prevent if the value starts with a minus sign
      if (newValue.startsWith('-')) {
        onValidationError?.("Negative values are not allowed");
        return;
      }
    }
    
    onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent minus key input for number fields when preventNegative is true
    if (preventNegative && (type === 'number' || type === 'tel')) {
      if (e.key === '-' || e.key === 'Minus') {
        e.preventDefault();
        onValidationError?.("Negative values are not allowed");
      }
    }
  };

  return (
    <div className={`${styles.wrapper} ${variant === 'light' ? styles.light : ''}`}>
      {labelText && (
        <label htmlFor={name} className={styles.label}>
          {labelText}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={type}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min={min}
          aria-describedby={error && touched ? `${name}-error` : undefined}
          aria-invalid={!!(error && touched)}
        />
        {value && !disabled && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            aria-label={`Clear ${labelText || name}`}
          >
            ×
          </button>
        )}
      </div>
      {error && touched && (
        <div id={`${name}-error`} className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputComponent;
