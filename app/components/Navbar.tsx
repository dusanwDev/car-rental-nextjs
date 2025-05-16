'use client';

import React, { useState } from 'react';
import NavbarLink from './NavbarLink';
import { navLinks, navLinksRight } from '../lib/navigation';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => setMobileOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      {/* Mobile Top Row */}
      <div className={styles.mobileHeader}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Aruna logo" className={styles.logoIcon} />
          <span className={styles.logoText}>Aruna</span>
        </div>
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          ☰
        </button>
      </div>

      {/* Desktop Nav Layout */}
      <div className={`${styles.desktopWrapper} ${mobileOpen ? styles.showMobileNav : ''}`}>
        <nav className={styles.leftNav} aria-label="Primary navigation">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li className={styles.navItem} key={link.path}>
                <NavbarLink path={link.path} text={link.text} />
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.logoDesktop}>
          <img src="/logo.png" alt="Aruna logo" className={styles.logoIcon} />
          <span className={styles.logoText}>Aruna</span>
        </div>

        <nav className={styles.rightNav} aria-label="Secondary navigation">
          <ul className={styles.navList}>
            {navLinksRight.map((link) => (
              <li className={styles.navItem} key={link.path}>
                <NavbarLink path={link.path} text={link.text} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
