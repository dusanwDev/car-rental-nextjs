'use client';

import React from 'react';
import styles from './CircularMarquee.module.scss';

const CircularMarquee: React.FC = () => {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.track}>
        <span>
          FIND COMFORT, LIVE WITH ARUNA • FIND COMFORT, LIVE WITH ARUNA • FIND COMFORT, LIVE WITH ARUNA • FIND COMFORT, LIVE WITH ARUNA •
        </span>
      </div>
    </div>
  );
};

export default CircularMarquee;
