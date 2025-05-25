'use client';

import React, { useEffect, useState } from 'react';
import InputComponent from './Input';
import SelectComponent from './Select';
import styles from './Landing.module.scss';
import { supabase } from '../lib/superbaseclient';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  propertyType: string;
  setPropertyType: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  area: string;
  setArea: (val: string) => void;
  onSearch: () => void;
  variant?: string;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm, setSearchTerm,
  propertyType, setPropertyType,
  price, setPrice,
  city, setCity,
  country, setCountry,
  area, setArea,
  onSearch,
  variant = "hero",
  className
}) => {
  const [cities, setCities] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCitiesAndCountries = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('city, country');

      if (error) {
        console.error('Error fetching cities/countries:', error);
        return;
      }

      // Extract unique cities and countries
      const uniqueCities = Array.from(new Set(data.map(item => item.city)));
      const uniqueCountries = Array.from(new Set(data.map(item => item.country)));

      setCities(uniqueCities);
      setCountries(uniqueCountries);
    };

    fetchCitiesAndCountries();
  }, []);

  const areaOptions = [
    'Area',
    '0-100 m²',
    '100-200 m²',
    '200-300 m²',
    '300+ m²'
  ];

  return (
    <form>
      <div className={styles.filterBar + ' ' + (variant === "normal" ? styles.normal : styles.hero)}>
        <div className={styles.filterInputs}>
          <InputComponent
            name="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => {}}
            variant="light"
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
            value={country}
            onChange={setCountry}
            options={['All Countries', ...countries]}
          />
          <SelectComponent
            value={city}
            onChange={setCity}
            options={['All Cities', ...cities]}
          />
          <SelectComponent
            value={area}
            onChange={setArea}
            options={areaOptions}
          />
        </div>
        <div className={styles.searchButtonWrapper}>
          <button className={styles.searchBtn} aria-label="Search" onClick={onSearch}>
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default FilterBar; 