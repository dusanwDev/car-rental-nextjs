'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/superbaseclient';
import styles from './UserMenu.module.scss';

interface UserMenuProps {
  userName: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto logout timer
  useEffect(() => {
    setSecondsLeft(3600);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <div 
        className={styles.userButton} 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.userName}>{userName}</span>
        <div className={styles.avatar}>
          {getInitials(userName)}
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <button 
            className={styles.menuItem}
            onClick={() => {
              router.push('/my-postings');
              setIsOpen(false);
            }}
          >
            My Postings
          </button>
          <button 
            className={styles.menuItem}
            onClick={() => {
              router.push('/profile');
              setIsOpen(false);
            }}
          >
            Edit Personal Data
          </button>
          <button 
            className={styles.menuItem}
            onClick={handleLogout}
          >
            Logout
          </button>
          <div className={styles.countdownTimer}>
            Auto logout in: {formatTime(secondsLeft)}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 