'use client';

import React from 'react';
import styles from './FooterHeroBanner.module.scss';

const FooterHeroBanner: React.FC = () => {
  return (
    <section className={styles.hero} aria-label="Brand banner">
      <h1 className={styles.title}>ARUNA</h1>
    </section>
  );
};

export default FooterHeroBanner;
