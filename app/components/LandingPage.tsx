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
import FilterBar from './FilterBar';
import { supabase } from '../lib/superbaseclient';

const countries = ['Indonesia', 'France', 'Italy', 'Spain', 'Turkey'];

const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('Property Type');
  const [price, setPrice] = useState('Price');
  const [city, setCity] = useState('All Cities');
  const [country, setCountry] = useState('All Countries');
  const [area, setArea] = useState('Area');

  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const router = useRouter();

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

  useEffect(() => {
    // Check auth status on mount
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = () => {
    router.push('/residences');
  };

  // Handler for property card click
  const handlePropertyClick = async (propertyId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirectedFrom=/home');
      return;
    }
    // Show property details dialog or navigate as needed (default: do nothing)
  };

  // Handler for pagination
  const handlePageChange = async (event: any, value: number, setPage: (v: number) => void) => {
    if (!isAuthenticated) {
      router.push('/login?redirectedFrom=/home');
      return;
    }
    setPage(value);
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

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            price={price}
            setPrice={setPrice}
            city={city}
            setCity={setCity}
            country={country}
            setCountry={setCountry}
            area={area}
            setArea={setArea}
            onSearch={handleSearch}
          />
      </section>

      <section>
        <PropertyGrid
          searchTerm={searchTerm}
          propertyType={propertyType}
          price={price}
          city={city}
          country={country}
          area={area}
          onPropertyClick={handlePropertyClick}
          onPageChange={handlePageChange}
        />
      </section>

      <ImageSliderForm />
      <FAQAccordion />
      <CircularMarquee />
      <Footer />
    </main>
  );
};

export default LandingPage;
