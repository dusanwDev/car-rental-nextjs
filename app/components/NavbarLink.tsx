'use client';

import Link from 'next/link';
import * as React from 'react';
import { NavItems } from '../lib/navigation';
import styles from './Navbar.module.scss';

interface INavbarLinkProps extends Pick<NavItems, 'path' | 'text'> {}

export default function NavbarLink({ path, text }: INavbarLinkProps) {
  return (
    <Link href={path} className={styles.link}>
      {text}
    </Link>
  );
}
