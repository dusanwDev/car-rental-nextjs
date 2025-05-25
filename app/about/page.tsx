'use client';

import React from 'react';
import styles from './About.module.scss';

const AboutPage = () => {
  return (
    <main className={styles.about}>
      <section className={styles.hero}>
        <h1>About Us</h1>
        <p className={styles.subtitle}>Your Trusted Partner in Real Estate</p>
      </section>

      <section className={styles.content}>
        <div className={styles.mission}>
          <h2>Our Mission</h2>
          <p>
            We are dedicated to transforming the real estate experience by providing innovative solutions
            that connect people with their dream properties. Our platform combines cutting-edge technology
            with personalized service to make property search and investment seamless and enjoyable.
          </p>
        </div>

        <div className={styles.values}>
          <h2>Our Values</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <h3>Trust</h3>
              <p>Building lasting relationships through transparency and reliability</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Innovation</h3>
              <p>Continuously evolving to provide the best real estate solutions</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Excellence</h3>
              <p>Delivering outstanding service and results in everything we do</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Integrity</h3>
              <p>Maintaining the highest standards of professional ethics</p>
            </div>
          </div>
        </div>

        <div className={styles.team}>
          <h2>Our Team</h2>
          <p>
            Our team consists of experienced real estate professionals, technology experts, and customer
            service specialists who work together to provide you with the best possible experience.
            We combine local market knowledge with global expertise to serve your needs.
          </p>
        </div>

        <div className={styles.contact}>
          <h2>Get in Touch</h2>
          <p>
            Have questions or want to learn more about our services? We'd love to hear from you.
            Book a call with our team to discuss your real estate needs.
          </p>
          <button 
            className={styles.bookCallBtn}
            onClick={() => window.location.href = '/book-call'}
          >
            Book a Call
          </button>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
