'use client';

import Link from 'next/link';
import * as React from 'react';
import { NavItems } from '../lib/navigation';
import styles from './Navbar.module.scss';

interface INavbarLinkProps extends Pick<NavItems, 'path' | 'text'> {}

export default function NavbarLink({ path, text }: INavbarLinkProps) {
  // Ensure path is normalized (remove trailing slashes and ensure consistent format)
  const normalizedPath = path.replace(/\/+$/, '');
  
  return (
    <Link 
      href={normalizedPath} 
      className={styles.link}
      prefetch={false} // Disable automatic prefetching to prevent hydration issues
    >
      {text}
    </Link>
  );
}
