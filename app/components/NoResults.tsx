import React from 'react';
import styles from './NoResults.module.scss';

interface NoResultsProps {
  message: string;
  isError?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({ message, isError = false }) => {
  return (
    <div className={styles.noResultsContainer}>
      <div className={`${styles.icon} ${isError ? styles.error : ''}`}>
        {isError ? '✕' : '🔍'}
      </div>
      <h2 className={styles.title}>
        {isError ? 'Oops! Something went wrong' : 'No Results Found'}
      </h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default NoResults; 