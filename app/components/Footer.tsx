'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';


const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.left}>
        <p>©2024 ARUNA RESIDENCE. ALL RIGHTS RESERVED</p>
      </div>

      <nav className={styles.nav} aria-label="Footer navigation">
        <ul className={styles.navList}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/properties">Properties</Link></li>
          <li><Link href="/projects">Our Projects</Link></li>
          <li><Link href="/faqs">FAQs</Link></li>
          <li><Link href="/about">About Us</Link></li>
        </ul>
      </nav>

      <div className={styles.social} aria-label="Social media links">
        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"></a>
        <a href="https://telegram.org" aria-label="Telegram" target="_blank" rel="noopener noreferrer"></a>
        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"></a>
        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"></a>
      </div>
    </footer>
  );
};

export default Footer;
