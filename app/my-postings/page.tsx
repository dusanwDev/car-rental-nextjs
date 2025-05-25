'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/superbaseclient';
import PostHouseForm from '../components/PostHouseForm';
import styles from './MyPostings.module.scss';

interface Property {
  id: string;
  title: string;
  price: string;
  city: string;
  country: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  type: string;
  images: string[];
  description: string;
  created_at: string;
  user_id: string;
}

const MyPostingsPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      setError('You dont have any properties yet');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProperties(properties.filter(prop => prop.id !== id));
    } catch (err) {
      setError('Failed to delete property');
      console.error('Error deleting property:', err);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowPostForm(true);
  };

  const handlePostSuccess = () => {
    setShowPostForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading} role="status" aria-live="polite">
          Loading your properties...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1>My Properties</h1>
      
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <div className={styles.actions}>
        <button
          onClick={() => setShowPostForm(true)}
          className={styles.addButton}
          aria-label="Add new property"
        >
          Post New Property
        </button>
      </div>

      {showPostForm ? (
        <div className={styles.formContainer}>
          <PostHouseForm
            onSuccess={handlePostSuccess}
            initialData={editingProperty}
          />
        </div>
      ) : (
        <div className={styles.propertiesGrid}>
          {properties.length === 0 ? (
            <p className={styles.emptyState}>
              You haven't posted any properties yet.
            </p>
          ) : (
            properties.map((property) => (
              <article key={property.id} className={styles.propertyCard}>
                <div className={styles.imageContainer}>
                  {property.images && property.images[0] && (
                    <img
                      src={property.images[0]}
                      alt={`${property.type} in ${property.city}, ${property.country}`}
                      className={styles.propertyImage}
                    />
                  )}
                </div>
                <div className={styles.propertyInfo}>
                  <h2>{property.title || `${property.type} in ${property.city}, ${property.country}`}</h2>
                  <p className={styles.price}>${property.price}</p>
                  <p className={styles.location}>{property.city}, {property.country}</p>
                  <div className={styles.details}>
                    <span>{property.area}m²</span>
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleEdit(property)}
                      className={styles.editButton}
                      aria-label={`Edit ${property.title || property.type}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className={styles.deleteButton}
                      aria-label={`Delete ${property.title || property.type}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default MyPostingsPage; 