'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputComponent from './Input';
import SelectComponent from './Select';
import styles from './Landing.module.scss';
import PropertyGrid from './PropertyGrid';
import ImageSliderForm from './ImageSlider';
import FAQAccordion from './FAQAccordion';
import CircularMarquee from './CircularMarquete';
import Footer from './Footer';
import FooterHeroBanner from './FooterHeroBanner';

const countries = ['Indonesia', 'France', 'Italy', 'Spain', 'Turkey'];

const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('Property Type');
  const [price, setPrice] = useState('Price');
  const [location, setLocation] = useState('All Cities');

  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const router = useRouter();

  // Fake auth state (replace this with real logic e.g. from context or cookies)
  const isLoggedIn = false;

  useEffect(() => {
    const countryInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
        setFadeIn(true);
      }, 300);
    }, 3000);

    return () => clearInterval(countryInterval);
  }, []);

  const handleSearch = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      // Add your real search logic here if user is logged in
      console.log('Search submitted:', { searchTerm, propertyType, price, location });
    }
  };

  return (
    <main className={styles.landing}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>
            Guiding your path <br />
            to a new home in <br />
            <span className={`${styles.country} ${fadeIn ? styles.fadeIn : styles.fadeOut}`}>
              {countries[currentCountryIndex]}
            </span>
          </h1>
        </div>
        <div className={styles.heroRight}>
          <img src="image/house2.png" alt="Modern home" />
        </div>
      </section>

      <section className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <img src="image/house1.png" alt="Modern home" className={styles.heroImage} />
        </div>

        <div className={styles.filterBar}>
          <InputComponent
            name="search"
            labelText="Looking For"
            placeholder="What to look for ?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => {}}
          />
          <SelectComponent
            value={propertyType}
            onChange={setPropertyType}
            options={['Property Type', 'Villa', 'Apartment', 'Land']}
          />
          <SelectComponent
            value={price}
            onChange={setPrice}
            options={['Price', 'Under $100k', '$100k - $300k', 'Over $300k']}
          />
          <SelectComponent
            value={location}
            onChange={setLocation}
            options={['All Cities', 'Jakarta', 'Bali', 'Yogyakarta']}
          />
          <button className={styles.searchBtn} aria-label="Search" onClick={handleSearch}>
             Search
          </button>
        </div>
      </section>

      <section>
        <PropertyGrid />
      </section>

      <ImageSliderForm />
      <FAQAccordion />
      <CircularMarquee />
      <Footer />
      <FooterHeroBanner />
    </main>
  );
};

export default LandingPage;
