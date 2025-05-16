'use client';

import React, { useState } from 'react';
import Property from './Property';
import styles from './PropertyGrid.module.scss';

const mockProperties = [
  {
    image: '/image/property1.jpg',
    title: 'Serenity Heights Villas',
    price: '$250,000',
    location: 'Bogor Tengah',
    beds: 8,
    baths: 2.5,
    area: 410,
  },
  {
    image: '/image/property2.jpg',
    title: 'Emerald Bay Residences',
    price: '$250,000',
    location: 'Gunungkidul, Yogyakarta',
    beds: 8,
    baths: 2.5,
    area: 410,
  },
  // Add more mock items here...
];

const sortOptions = ['Default', 'Price', 'Bedrooms', 'Area'];

const PropertyGrid: React.FC = () => {
  const [sortBy, setSortBy] = useState('Default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const sorted = [...mockProperties].sort((a, b) => {
    if (sortBy === 'Price') return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
    if (sortBy === 'Bedrooms') return a.beds - b.beds;
    if (sortBy === 'Area') return a.area - b.area;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.gridPage}>
      <div className={styles.header}>
        <div>
          <h2>Residence in Yogyakarta</h2>
          <span>We found {sorted.length} property</span>
        </div>
        <div className={styles.sort}>
          <label htmlFor="sortBy">Sort By:</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {paginated.map((property, index) => (
          <Property key={index} {...property} />
        ))}
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? styles.active : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
