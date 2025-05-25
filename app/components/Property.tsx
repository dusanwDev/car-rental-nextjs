'use client';

import React, { useState } from 'react';
import styles from './ProperyCard.module.scss';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/superbaseclient';

interface PropertyCardProps {
  id: string;
  images: string[];
  title: string;
  price: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in m²
  type: string;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  images,
  title,
  price,
  city,
  country,
  bedrooms,
  bathrooms,
  area,
  type,
  onClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePropertyClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/property/${id}`);
    }
  };

  return (
    <div className={styles.card} onClick={handlePropertyClick} style={{ cursor: 'pointer' }}>
      <div className={styles.imageWrapper}>
        <img src={images[currentIndex]} alt={title} className={styles.image} />
        <button className={styles.favoriteBtn} onClick={(e) => e.stopPropagation()}>♡</button>
        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, idx) => (
              <span
                key={idx}
                className={idx === currentIndex ? styles.activeDot : styles.dot}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                role="button"
                tabIndex={0}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.titlePrice}>
        <h3>{title}</h3>
        <span className={styles.price}>{price} $</span>
      </div>
      <p className={styles.location}>{city}, {country}</p>
      {/* Details Section */}
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <BedIcon />
          <span>{bedrooms}</span>
        </div>
        <div className={styles.detailItem}>
          <BathtubIcon />
          <span>{bathrooms}</span>
        </div>
        <div className={styles.detailItem}>
          <SquareFootIcon />
          <span>{area} m²</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
