'use client';

import React, { useState, useEffect } from 'react';
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
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase configuration error:', error);
          setError('Authentication service is not properly configured. Please try again later.');
        } else {
          setIsSupabaseReady(true);
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        setError('Unable to connect to authentication service. Please check your internet connection.');
      }
    };

    checkSupabase();
  }, []);

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseReady) {
      setError('Authentication service is not ready. Please try again in a moment.');
      return;
    }

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
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data?.user) {
        console.log('Login successful, session:', data.session);
        console.log('User:', data.user);
        
        // Get the redirect URL from the query parameters
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirectedFrom') || '/';
        
        // Wait a moment to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check session again before redirect
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session before redirect:', session);
        
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to the server. Please check your internet connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'azure' | 'apple') => {
    if (!isSupabaseReady) {
      setError('Authentication service is not ready. Please try again in a moment.');
      return;
    }

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
      console.error('Social login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to the server. Please check your internet connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
          disabled={loading || !isSupabaseReady}
          variant="light"

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
          disabled={loading || !isSupabaseReady}
          variant="light"

        />

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={loading || !isSupabaseReady}
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
          disabled={!!socialLoading || !isSupabaseReady}
        >
          <img src="/icons/google.svg" alt="Google" className={styles.socialIcon} />
          {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
        </button>
        <button 
          className={styles.socialBtn} 
          onClick={() => handleSocialLogin('azure')}
          disabled={!!socialLoading || !isSupabaseReady}
        >
          <img src="/icons/microsoft.svg" alt="Microsoft" className={styles.socialIcon} />
          {socialLoading === 'azure' ? 'Connecting...' : 'Continue with Microsoft'}
        </button>
        <button 
          className={styles.socialBtn} 
          onClick={() => handleSocialLogin('apple')}
          disabled={!!socialLoading || !isSupabaseReady}
        >
          <img src="/icons/apple.svg" alt="Apple" className={styles.socialIcon} />
          {socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
