'use client';

import React, { useState, useRef } from 'react';
import InputComponent from './Input';
import styles from './LoginPage.module.scss';
import { supabase } from '../lib/superbaseclient';
import { useRouter } from 'next/navigation';

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    setError('');
    setSuccess('');

    if (!validate()) {
      errorRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (signUpError) {
        setError(signUpError.message);
        errorRef.current?.focus();
      } else {
        setSuccess('Sign up successful! Please check your email to confirm your account.');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      errorRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'azure' | 'apple') => {
    setSocialLoading(provider);
    setError('');
    setSuccess('');
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (socialError) {
        setError(socialError.message);
        errorRef.current?.focus();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      errorRef.current?.focus();
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <main className={styles.container} aria-labelledby="signup-heading">
      <h1 id="signup-heading">Create your account</h1>
      {error && (
        <div
          className={styles.errorMessage}
          role="alert"
          tabIndex={-1}
          ref={errorRef}
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {success && (
        <div className={styles.successMessage} role="status" aria-live="polite">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form} noValidate aria-describedby={error ? 'form-error' : undefined}>
        <InputComponent
          name="email"
          type="email"
          labelText="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          error={errors.email}
          touched={touched.email}
          disabled={loading}
        />
        <InputComponent
          name="password"
          type="password"
          labelText="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          error={errors.password}
          touched={touched.password}
          disabled={loading}
        />
        <InputComponent
          name="confirmPassword"
          type="password"
          labelText="Confirm Password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          disabled={loading}
        />
        <button type="submit" className={styles.continueBtn} disabled={loading} aria-disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className={styles.loginText}>
        Already have an account? <a href="/login">Log In</a>
      </p>
      <div className={styles.divider}>
        <span>OR</span>
      </div>
      <div className={styles.socialButtons}>
        <button
          className={styles.socialBtn}
          onClick={() => handleSocialSignUp('google')}
          disabled={!!socialLoading}
          aria-disabled={!!socialLoading}
        >
          <img src="/icons/google.svg" alt="Google logo" />
          {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
        </button>
        <button
          className={styles.socialBtn}
          onClick={() => handleSocialSignUp('azure')}
          disabled={!!socialLoading}
          aria-disabled={!!socialLoading}
        >
          <img src="/icons/microsoft.svg" alt="Microsoft logo" />
          {socialLoading === 'azure' ? 'Connecting...' : 'Continue with Microsoft Account'}
        </button>
        <button
          className={styles.socialBtn}
          onClick={() => handleSocialSignUp('apple')}
          disabled={!!socialLoading}
          aria-disabled={!!socialLoading}
        >
          <img src="/icons/apple.svg" alt="Apple logo" />
          {socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
        </button>
      </div>
    </main>
  );
};

export default SignUpForm;
