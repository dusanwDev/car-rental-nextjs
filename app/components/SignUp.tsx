'use client';

import React, { useState } from 'react';
import InputComponent from './Input'; // adjust path
import styles from './LoginPage.module.scss';

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

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

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (validate()) {
      console.log('Form submitted:', formData);
      // Handle actual signup logic here
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create your account</h1>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
        />

        <button type="submit" className={styles.continueBtn}>
          Sign Up
        </button>
      </form>

      <p className={styles.loginText}>
        Already have an account? <a href="#">Log In</a>
      </p>

      <div className={styles.divider}>
        <span>OR</span>
      </div>

      <div className={styles.socialButtons}>
        <button className={styles.socialBtn}>
          <img src="/icons/google.svg" alt="Google" />
          Continue with Google
        </button>

        <button className={styles.socialBtn}>
          <img src="/icons/microsoft.svg" alt="Microsoft" />
          Continue with Microsoft Account
        </button>

        <button className={styles.socialBtn}>
          <img src="/icons/apple.svg" alt="Apple" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
