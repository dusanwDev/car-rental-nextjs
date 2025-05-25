'use client';

import React, { useState } from 'react';
import styles from './ImageSliderForm.module.scss';
import Input from './Input'; // Make sure the path is correct

const images = [
  'image/house1.png',
  'image/house2.png',
  'image/house3.png',
];

const ImageSliderForm: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    notes: ''
  });

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={styles.image}
        />
        <div className={styles.controls}>
          <button onClick={prevImage} aria-label="Previous image">←</button>
          <button onClick={nextImage} aria-label="Next image">→</button>
        </div>
      </div>

      <div className={styles.formSection}>
        <h2>Still haven't found what you're looking for?</h2>
        <form className={styles.form}>
          <div className={styles.inputRow}>
            <div className={styles.field}>
              <Input
                labelText="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormInputChange}
                onBlur={() => {}}
                type="text"
              />
            </div>
            <div className={styles.field}>
            <Input
                labelText="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormInputChange}
                onBlur={() => {}}
                type="text"
            />

            </div>
          </div>

          <div className={styles.field}>
            <Input
                labelText="E-mail"
                name="email"
                value={formData.email}
                onChange={handleFormInputChange}
                onBlur={() => {}}
                type="text"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="notes" style={{ color: 'red' }}>Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Leave a note..."
              value={formData.notes}
              onChange={handleFormInputChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ImageSliderForm;
