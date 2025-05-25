'use client';

import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import styles from './BookCall.module.scss';
import Head from 'next/head';

const BookCallPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [emailError, setEmailError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');
  const [dates, setDates] = useState<Array<{ value: string; label: string }>>([]);

  // Generate dates on client-side only
  useEffect(() => {
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      };
    });
    setDates(next7Days);
  }, []);

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor((i + 18) / 2);
    const minute = (i + 18) % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      setAnnouncement('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setAnnouncement('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    setAnnouncement('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return;
    }
    // Simulate booking submission
    setIsSubmitted(true);
    setAnnouncement('Booking confirmed successfully');
  };

  // Announce changes to screen readers
  useEffect(() => {
    if (announcement) {
      const timeout = setTimeout(() => {
        setAnnouncement('');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [announcement]);

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Booking Confirmed | Real Estate Consultation</title>
          <meta name="description" content="Your real estate consultation has been successfully booked. We look forward to speaking with you." />
        </Head>
        <main className={styles.bookCall}>
          <section className={styles.success} role="status" aria-live="polite">
            <h1>Booking Confirmed!</h1>
            <div className={styles.confirmationDetails}>
              <p>Thank you for booking a call with us.</p>
              <p>Date: {selectedDate}</p>
              <p>Time: {selectedTime}</p>
              <p>We will contact you shortly to confirm the details.</p>
            </div>
            <button 
              className={styles.newBookingBtn}
              onClick={() => {
                setIsSubmitted(false);
                setSelectedDate('');
                setSelectedTime('');
                setName('');
                setEmail('');
                setPhone(undefined);
                setEmailError('');
              }}
              aria-label="Book another consultation"
            >
              Book Another Call
            </button>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Book a Real Estate Consultation | Expert Advice</title>
        <meta name="description" content="Schedule a personalized consultation with our real estate experts. Get expert advice on property investment and discuss your real estate goals." />
        <meta name="keywords" content="real estate consultation, property investment, real estate advice, book a call" />
      </Head>
      <main className={styles.bookCall}>
        <section className={styles.hero}>
          <h1>Book a Call</h1>
          <p className={styles.subtitle}>
            Schedule a consultation with our real estate experts
          </p>
        </section>

        <section className={styles.bookingForm}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="date">Select Date</label>
              <select
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                aria-required="true"
                aria-invalid={!selectedDate}
              >
                <option value="">Choose a date</option>
                {dates.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time">Select Time</label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                aria-required="true"
                aria-invalid={!selectedTime}
              >
                <option value="">Choose a time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
                aria-invalid={!name}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateEmail(email)}
                required
                aria-required="true"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
                placeholder="Enter your email"
                className={emailError ? styles.error : ''}
              />
              {emailError && (
                <span 
                  id="email-error" 
                  className={styles.errorMessage}
                  role="alert"
                >
                  {emailError}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
                placeholder="Enter phone number"
                className={styles.phoneInput}
                aria-label="Phone number with country code"
              />
            </div>
            <button 
              type="submit" 
              className={styles.submitBtn}
              aria-label="Submit booking form"
            >
              Book Consultation
            </button>
          </form>
        </section>

        <section className={styles.info}>
          <div className={styles.infoCard}>
            <h2>What to Expect</h2>
            <ul>
              <li>30-minute personalized consultation</li>
              <li>Discussion of your real estate goals</li>
              <li>Expert advice on property investment</li>
              <li>Answers to all your questions</li>
            </ul>
          </div>
        </section>

        {/* Screen reader announcements */}
        {announcement && (
          <div 
            role="status" 
            aria-live="polite" 
            className="sr-only"
          >
            {announcement}
          </div>
        )}
      </main>
    </>
  );
};

export default BookCallPage; 