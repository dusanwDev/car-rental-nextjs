'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './NotFound.module.scss';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className={styles.container} role="main">
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.description}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <button
            onClick={() => router.back()}
            className={styles.button}
            aria-label="Go back to previous page"
          >
            Go Back
          </button>
          <Link 
            href="/"
            className={styles.button}
            aria-label="Return to home page"
          >
            Return Home
          </Link>
        </div>
        <div className={styles.helpText}>
          <p>Need help? Here are some suggestions:</p>
          <ul className={styles.suggestions}>
            <li>Check the URL for typos</li>
            <li>Use the navigation menu above</li>
            <li>Return to the homepage</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 