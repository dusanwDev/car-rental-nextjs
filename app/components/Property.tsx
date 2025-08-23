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

  const getImageUrl = (imagePath: string) => {
    return supabase.storage.from('property-images').getPublicUrl(imagePath).data.publicUrl;
  };

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
    <article 
      className={styles.card} 
      
      onClick={handlePropertyClick} 
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePropertyClick();
        }
      }}
      aria-label={`View details for ${title} in ${city}, ${country} - $${price}`}
    >
      <figure className={styles.imageWrapper} aria-label="Property images">
        <img 
          src={getImageUrl(images[currentIndex])} 
          alt={`${title} - ${type} in ${city}, ${country}. Image ${currentIndex + 1} of ${images.length}`}
          className={styles.image}
          loading="lazy"
          width="300"
          height="200"
        />
        <button 
          className={styles.favoriteBtn} 
          onClick={(e) => e.stopPropagation()}
          aria-label={`Add ${title} to favorites`}
          type="button"
        >
          <span aria-hidden="true">♡</span>
          <span className="sr-only">Add to favorites</span>
        </button>
        {images.length > 1 && (
          <nav className={styles.dots} aria-label="Property image navigation">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={idx === currentIndex ? styles.activeDot : styles.dot}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(idx);
                }}
                aria-label={`View image ${idx + 1} of ${images.length}`}
                aria-current={idx === currentIndex ? 'true' : 'false'}
              />
            ))}
          </nav>
        )}
      </figure>
      
      <div className={styles.propertyInfoWrapper}>
        <header className={styles.titlePrice}>
          <h3 className={styles.propertyTitle}>{title}</h3>
          <data value={price} className={styles.price}>
            <span className="sr-only">Price: </span>
            ${price}
          </data>
        </header>
        
        <address className={styles.location}>
          <span className="sr-only">Location: </span>
          {city}, {country}
        </address>
        
        <dl className={styles.details} aria-label="Property features">
          <div className={styles.detailItem}>
            <dt className="sr-only">Bedrooms</dt>
            <BedIcon aria-hidden="true" />
            <dd>
              <span className="sr-only">{bedrooms} </span>
              {bedrooms}
              <span className="sr-only"> bedroom{bedrooms !== 1 ? 's' : ''}</span>
            </dd>
          </div>
          <div className={styles.detailItem}>
            <dt className="sr-only">Bathrooms</dt>
            <BathtubIcon aria-hidden="true" />
            <dd>
              <span className="sr-only">{bathrooms} </span>
              {bathrooms}
              <span className="sr-only"> bathroom{bathrooms !== 1 ? 's' : ''}</span>
            </dd>
          </div>
          <div className={styles.detailItem}>
            <dt className="sr-only">Area</dt>
            <SquareFootIcon aria-hidden="true" />
            <dd>
              <span className="sr-only">{area} </span>
              {area} m²
              <span className="sr-only"> square meters</span>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
};

export default PropertyCard;
