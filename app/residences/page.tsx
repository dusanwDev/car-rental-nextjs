"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/superbaseclient';
import Property from '../components/Property';
import styles from '../components/PropertyGrid.module.scss';
import FilterBar from '../components/FilterBar';
import Pagination from '@mui/material/Pagination';
import { useRouter } from 'next/navigation';
import resStyles from './Residences.module.scss';
import SelectComponent from '../components/Select';
import Dialog from '@mui/material/Dialog';
import { PropertyDetailsDialog } from '../components/PropertyDetailsDialog';

const PAGE_SIZE = 10;

export default function Residences() {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('Property Type');
  const [price, setPrice] = useState('Price');
  const [city, setCity] = useState('All Cities');
  const [country, setCountry] = useState('All Countries');
  const [area, setArea] = useState('Area');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState('Price');
  const [sortOrder, setSortOrder] = useState('Lowest first');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    // Since middleware handles auth, we can directly fetch properties
    fetchProperties();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchProperties(1, sortOrder);
  };

  const fetchProperties = async (pageNum = page, order = sortOrder) => {
    try {
      setLoading(true);
      let query = supabase.from('properties').select('*', { count: 'exact' });
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      if (propertyType && propertyType !== 'Property Type') {
        query = query.eq('type', propertyType);
      }
      if (city && city !== 'All Cities') {
        query = query.eq('city', city);
      }
      if (country && country !== 'All Countries') {
        query = query.eq('country', country);
      }
      if (area && area !== 'Area') {
        let minArea: number | undefined;
        let maxArea: number | undefined;

        if (area === '0-100 m²') {
          minArea = 0;
          maxArea = 100;
        } else if (area === '100-200 m²') {
          minArea = 100;
          maxArea = 200;
        } else if (area === '200-300 m²') {
          minArea = 200;
          maxArea = 300;
        } else if (area === '300+ m²') {
          minArea = 300;
        }

        if (minArea !== undefined) {
          query = query.gte('area', minArea);
        }
        if (maxArea !== undefined) {
          query = query.lte('area', maxArea);
        }
      }
      if (price && price !== 'Price') {
        if (price === 'Under $100k') query = query.lte('price', 100000);
        else if (price === '$100k - $300k') query = query.gte('price', 100000).lte('price', 300000);
        else if (price === 'Over $300k') query = query.gte('price', 300000);
      }
      let sortFieldDb = sortField === 'Price' ? 'price' : 'area';
      let ascending = sortOrder === 'Lowest first';
      query = query.order(sortFieldDb, { ascending });
      query = query.range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }
      
      setProperties(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('Error in fetchProperties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page || sortOrder) {
      fetchProperties();
    }
  }, [page, sortOrder]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleCardClick = (id: string) => {
    setSelectedPropertyId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPropertyId(null);
  };

  return (
    <div className={resStyles.residencesPage}>
      <header>
        <h1 tabIndex={-1}>Residence Listings</h1>
        <nav aria-label="Property filters">
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
            variant="normal"
          />
          <form
            aria-label="Sort properties"
            style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}
            role="search"
            onSubmit={e => e.preventDefault()}
          >
            <div>
              <label htmlFor="sortField" className="sr-only">Sort by</label>
              <SelectComponent
                value={sortField}
                onChange={setSortField}
                options={['Price', 'm2']}
              />
            </div>
            <div>
              <label htmlFor="sortOrder" className="sr-only">Sort order</label>
              <SelectComponent
                value={sortOrder}
                onChange={setSortOrder}
                options={['Lowest first', 'Highest first']}
              />
            </div>
          </form>
        </nav>
      </header>
      <main aria-label="Property results" id="property-results">
        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="sr-only">Property Results</h2>
          <div style={{ marginTop: '2rem' }}>
            {loading ? (
              <p>Loading properties...</p>
            ) : properties.length === 0 ? (
              <p>No properties found.</p>
            ) : (
              <div className={styles.grid} role="list" aria-label="Property list">
                {properties.map((property: any) => (
                  <Property
                    key={property.id}
                    {...property}
                    role="listitem"
                    onClick={() => handleCardClick(property.id)}
                  />
                ))}
              </div>
            )}
          </div>
          <nav
            aria-label="Pagination"
            style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              aria-label="Pagination navigation"
            />
          </nav>
        </section>
      </main>
      <PropertyDetailsDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        propertyId={selectedPropertyId}
      />
    </div>
  );
}
