'use client';

import React from 'react';
import styles from './Select.module.scss';

interface Select {
  value: string;
  onChange: (newValue: string) => void;
  options: string[];
}

const SelectComponent: React.FC<Select> = ({ value, onChange, options }) => {
  const handleReset = () => {
    onChange(options[0]); // Reset to first option (usually the default)
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectWrapper}>
        <select
          id="lookingFor"
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {value !== options[0] && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            aria-label="Reset selection"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectComponent;
