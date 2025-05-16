'use client';

import React from 'react';
import styles from './ProperyCard.module.scss';

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: number; // in m²
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  title,
  price,
  location,
  beds,
  baths,
  area,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
        <button className={styles.favoriteBtn}>♡</button>
      </div>
      <div className={styles.content}>
        <div className={styles.titlePrice}>
          <h3>{title}</h3>
          <span className={styles.price}>{price}</span>
        </div>
        <p className={styles.location}>{location}</p>
        <div className={styles.details}>
          <span>🛏 {beds}</span>
          <span>🛁 {baths}</span>
          <span>📐 {area} m²</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
