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
}) => {
  const handleReset = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
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
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
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
