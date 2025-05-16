'use client';

import React from 'react';
import styles from './Select.module.scss';

interface Select {
  value: string;
  onChange: (newValue: string) => void;
  options: string[];
}

const SelectComponent: React.FC<Select> = ({ value, onChange, options }) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="lookingFor" className={styles.label}>Looking For</label>
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
    </div>
  );
};

export default SelectComponent;
