'use client';

import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  labelText: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  type?: string;
  disabled?: boolean;
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
}) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>
        {labelText}
      </label>
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
      {error && touched && (
        <div id={`${name}-error`} className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputComponent;
