'use client';

import React, { useEffect, useState } from 'react';
import Property from './Property';
import styles from './PropertyGrid.module.scss';
import { supabase } from '../lib/superbaseclient';
import { useRouter, usePathname } from 'next/navigation';
import Pagination from '@mui/material/Pagination';
import Spinner from './Spinner';
import NoResults from './NoResults';

const ITEMS_PER_PAGE = 8;

interface PropertyGridProps {
  searchTerm?: string;
  propertyType?: string;
  price?: string;
  city?: string;
  country?: string;
  area?: string;
  onPropertyClick?: (propertyId: string) => void;
  onPageChange?: (event: any, value: number, setPage: (v: number) => void) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  searchTerm = '',
  propertyType = 'Property Type',
  price = 'Price',
  city = 'All Cities',
  country = 'All Countries',
  area = 'Area',
  onPropertyClick,
  onPageChange
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        let query = supabase.from('properties').select('*', { count: 'exact' });

        // If on home page, only fetch featured properties
        if (pathname === '/home') {
          query = query.eq('is_featured', true);
        }

        // Apply search filters
        if (searchTerm) {
          query = query.or(`city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
        }

        if (propertyType !== 'Property Type') {
          query = query.eq('type', propertyType);
        }

        if (price !== 'Price') {
          let minPrice: number | undefined;
          let maxPrice: number | undefined;

          if (price === 'Under $100k') {
            maxPrice = 100000;
          } else if (price === '$100k - $300k') {
            minPrice = 100000;
            maxPrice = 300000;
          } else if (price === 'Over $300k') {
            minPrice = 300000;
          }

          if (minPrice !== undefined) {
            query = query.gte('price', minPrice);
          }
          if (maxPrice !== undefined) {
            query = query.lte('price', maxPrice);
          }
        }

        if (city !== 'All Cities') {
          query = query.eq('city', city);
        }

        if (country !== 'All Countries') {
          query = query.eq('country', country);
        }

        if (area !== 'Area') {
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

        // Get total count
        const { count, error: countError } = await query;
        if (countError) throw countError;
        
        setTotalCount(count || 0);
        setTotalPages(count ? Math.ceil(count / ITEMS_PER_PAGE) : 1);

        // Fetch paginated data
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        const { data, error: dataError } = await query.range(from, to);
        
        if (dataError) throw dataError;
        
        setProperties(data || []);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setError(err.message || 'An error occurred while fetching properties');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, pathname, searchTerm, propertyType, price, city, country, area]);

  const handleMuiPageChange = (event: any, value: number) => {
    if (onPageChange) {
      onPageChange(event, value, setCurrentPage);
    } else {
      setCurrentPage(value);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <NoResults
        message="We're experiencing some technical difficulties. Our team has been notified and is working to resolve the issue. Please try again in a few minutes."
        isError={true}
      />
    );
  }

  if (properties.length === 0) {
    if (pathname === '/home') {
      return (
        <NoResults
          message="We're currently updating our featured properties. Please check back soon for new listings."
        />
      );
    }
    return (
      <NoResults
        message="We couldn't find any properties matching your search criteria. Try adjusting your filters or search terms to see more options."
      />
    );
  }

  return (
    <section className={styles.propertyResults} aria-label="Property search results">
      <div className={styles.resultsHeader}>
        <h2 className="sr-only">
          {pathname === '/home' ? 'Featured Properties' : 'Property Search Results'}
        </h2>
        <p className={styles.resultsCount} aria-live="polite">
          {totalCount === 0 
            ? 'No properties found' 
            : `Showing ${((currentPage - 1) * ITEMS_PER_PAGE) + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of ${totalCount} properties`
          }
        </p>
      </div>
      
      <div className={styles.grid} role="list" aria-label="Properties">
        {properties.map((property: any) => (
          <div key={property.id} role="listitem">
            <Property {...property} onClick={onPropertyClick ? () => onPropertyClick(property.id) : undefined} />
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Property pagination navigation">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleMuiPageChange}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </nav>
      )}
    </section>
  );
};

export default PropertyGrid;
