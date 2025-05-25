"use client";

import React, { useEffect, useState } from 'react';
import InputComponent from '../components/Input';
import styles from '../components/LoginPage.module.scss';
import { supabase } from '../lib/superbaseclient';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Failed to load user data.');
        setLoading(false);
        return;
      }
      setEmail(user.email || '');
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      });
      if (error) throw error;
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Profile</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <InputComponent
          name="firstName"
          labelText="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          onBlur={() => {}}
          error={!firstName ? 'First name is required' : undefined}
          touched={true}
          variant='light'
        />
        <InputComponent
          name="lastName"
          labelText="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          onBlur={() => {}}
          error={!lastName ? 'Last name is required' : undefined}
          touched={true}
          variant='light'

        />
        <InputComponent
          name="email"
          labelText="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => {}}
          error={!email ? 'Email is required' : undefined}
          touched={true}
          variant='light'

        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
} 