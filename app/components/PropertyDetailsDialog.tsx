'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { supabase } from '../lib/superbaseclient';
import styles from './PropertyDetailsDialog.module.scss'; // You'll create this SCSS file for styling
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ChairIcon from '@mui/icons-material/Chair';
import GarageIcon from '@mui/icons-material/Garage';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Spinner from './Spinner';

interface PropertyDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  propertyId: string | null;
}

export const PropertyDetailsDialog: React.FC<PropertyDetailsDialogProps> = ({
  open,
  onClose,
  propertyId,
}) => {
  const [property, setProperty] = useState<any>(null);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && propertyId) {
      setLoading(true);
      setError(null);
      (async () => {
        try {
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();
          if (error) {
            setError('Failed to load property details.');
            setProperty(null);
          } else {
            setProperty(data);
          }
        } catch {
          setError('Failed to load property details.');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [open, propertyId]);

  useEffect(() => {
    const checkScreen = () => {
      setIsTabletOrMobile(window.innerWidth <= 900);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Keyboard navigation for image viewer
  useEffect(() => {
    if (!viewerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveImageIdx((prev) => (prev === 0 ? (property.images.length - 1) : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIdx((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setViewerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerOpen, property?.images?.length]);

  if (loading) return <Spinner />;
  if (error) return <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!property) return null;

  const handleThumbnailClick = (idx: number) => {
    setActiveImageIdx(idx);
    setViewerOpen(true);
  };
  const handleMainImageClick = () => {
    setActiveImageIdx(0);
    setViewerOpen(true);
  };
  const handleViewerClose = () => setViewerOpen(false);
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? (property.images.length - 1) : prev - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth aria-labelledby="property-details-title">
      <div className={styles.detailsPage}>
        <button
          onClick={onClose}
          aria-label="Close details"
          className={styles.closeBtn}
        >
          ×
        </button>
        <div className={styles.leftCol}>
          {/* Main Image */}
          <img
            src={property.images?.[0] || '/placeholder.jpg'}
            alt={property.title}
            className={styles.mainImage}
            onClick={handleMainImageClick}
            style={{ cursor: 'pointer' }}
          />
          {/* Thumbnails */}
          <div className={styles.thumbnails}>
            {(property.images || []).slice(1, 4).map((img: string, idx: number) => (
              <img key={idx} src={img} alt={`Thumbnail ${idx + 1}`} className={styles.thumbnail} onClick={() => handleThumbnailClick(idx + 1)} style={{ cursor: 'pointer' }} />
            ))}
            {property.images && property.images.length > 4 && (
              <div className={styles.showAll}>Show All</div>
            )}
          </div>
          {/* Image Viewer Dialog */}
          <Dialog open={viewerOpen} onClose={handleViewerClose} maxWidth="md" fullWidth PaperProps={{ style: { background: 'rgba(0,0,0,0.85)', boxShadow: 'none' } }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }} onClick={handleViewerClose}>
              <button onClick={handlePrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', zIndex: 2 }} aria-label="Previous image">
                <ArrowBackIosNewIcon fontSize="large" />
              </button>
              <img src={property.images?.[activeImageIdx]} alt={`Property image ${activeImageIdx + 1}`} style={{ maxHeight: '70vh', maxWidth: '90vw', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()} />
              <button onClick={handleNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', zIndex: 2 }} aria-label="Next image">
                <ArrowForwardIosIcon fontSize="large" />
              </button>
              <button onClick={handleViewerClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: 28, borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', zIndex: 3 }} aria-label="Close image viewer">×</button>
            </div>
          </Dialog>
          {/* Contact Form (desktop only) */}
          {!isTabletOrMobile && (
            <form className={styles.contactForm}>
              <h3>Aruna</h3>
              <label>
                Name
                <input type="text" placeholder="Enter your name here" />
              </label>
              <label>
                Phone
                <input type="text" placeholder="Enter your phone here" />
              </label>
              <label>
                Email
                <input type="email" placeholder="Enter your email here" />
              </label>
              <textarea placeholder={`Hello, I am interested in ${property.title}`}></textarea>
              <button type="submit">Send</button>
            </form>
          )}
        </div>
        <div className={styles.rightCol}>
          <section className={styles.overview}>
            <h3>Overview</h3>
            <div className={styles.overviewGrid}>
              <div><BedIcon /> {property.bedrooms} Bedroom</div>
              <div><BathtubIcon /> {property.bathrooms} Bathroom</div>
              <div><SquareFootIcon /> {property.area} m²</div>
              <div><ChairIcon /> All Furniture</div>
              <div><GarageIcon /> 1 Car Garage</div>
            </div>
          </section>
          <section className={styles.description}>
            <h3>Description</h3>
            <div className={styles.descriptionText}>
              {property.description}
            </div>
          </section>
          <section className={styles.address}>
            <h3>Address</h3>
            <div className={styles.addressGrid}>
              <div>City: {property.city || '-'}</div>
              <div>Country: {property.country || '-'}</div>
              <div>Type: {property.type || '-'}</div>
            </div>
          </section>
          <section className={styles.details}>
            <h3>Details</h3>
            <div className={styles.detailsGrid}>
              <div>Property ID: {property.id}</div>
              <div>Status: {property.status || 'Available'}</div>
            </div>
          </section>
          {/* Contact Form (tablet/mobile only) */}
          {isTabletOrMobile && (
            <form className={styles.contactForm}>
              <h3>Aruna</h3>
              <label>
                Name
                <input type="text" placeholder="Enter your name here" />
              </label>
              <label>
                Phone
                <input type="text" placeholder="Enter your phone here" />
              </label>
              <label>
                Email
                <input type="email" placeholder="Enter your email here" />
              </label>
              <textarea placeholder={`Hello, I am interested in ${property.title}`}></textarea>
              <button type="submit">Send</button>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  );
};