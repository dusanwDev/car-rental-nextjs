'use client';

import React, { useState } from 'react';
import InputComponent from './Input';
import styles from './LoginPage.module.scss';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/superbaseclient';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const router = useRouter();

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailError = validateEmail(email);
    if (emailError || !password) {
      setTouched(true);
      setError(emailError || 'Password is required');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'azure' | 'apple') => {
    try {
      setSocialLoading(provider);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Social login error:', err);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Welcome back</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <InputComponent
          name="email"
          type="email"
          labelText="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          error={error && touched ? error : undefined}
          touched={touched}
          disabled={loading}
        />

        <InputComponent
          name="password"
          type="password"
          labelText="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched(true)}
          error={!password && touched ? 'Password is required' : undefined}
          touched={touched}
          disabled={loading}
        />

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.continueBtn} 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Continue'}
        </button>
      </form>

      <p className={styles.signupText}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>

      <div className={styles.divider}>
        <span>OR</span>
      </div>

      <div className={styles.socialButtons}>
        <button 
          className={styles.socialBtn} 
          onClick={() => handleSocialLogin('google')}
          disabled={!!socialLoading}
        >
          <img src="/icons/google.svg" alt="Google" />
          {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
        </button>
        <button 
          className={styles.socialBtn} 
          onClick={() => handleSocialLogin('azure')}
          disabled={!!socialLoading}
        >
          <img src="/icons/microsoft.svg" alt="Microsoft" />
          {socialLoading === 'azure' ? 'Connecting...' : 'Continue with Microsoft Account'}
        </button>
        <button 
          className={styles.socialBtn} 
          onClick={() => handleSocialLogin('apple')}
          disabled={!!socialLoading}
        >
          <img src="/icons/apple.svg" alt="Apple" />
          {socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
