'use client';

import React, { useState, useEffect } from 'react';
import NavbarLink from './NavbarLink';
import { navLinks, navLinksRight } from '../lib/navigation';
import styles from './Navbar.module.scss';
import { supabase } from '../lib/superbaseclient';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user's full name from metadata or user data
        const fullName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUserName(fullName);
      }
    };

    getUserData();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUserName(fullName);
      } else {
        setUserName(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
            {userName ? (
              <li className={styles.navItem}>
                <UserMenu userName={userName} />
              </li>
            ) : (
              navLinksRight.map((link) => (
                <li className={styles.navItem} key={link.path}>
                  <NavbarLink path={link.path} text={link.text} />
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
