'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './PostHouseForm.module.scss';
import InputComponent from './Input';
import { supabase } from '../lib/superbaseclient';
import SelectComponent from './Select';

interface FormValues {
  price: string;
  city: string;
  country: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  images: File[];
  type: string;
  title: string;
  description: string;
}

interface PostHouseFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    price: string;
    city: string;
    country: string;
    area: string;
    bedrooms: string;
    bathrooms: string;
    type: string;
    title: string;
    images: string[];
    description: string;
  } | null;
}

const validationSchema = Yup.object({
  price: Yup.number().required('Price is required').min(1000, 'Too low'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  area: Yup.number().required('Area is required').min(10, 'Area must be at least 10 m²'),
  bedrooms: Yup.number().required('Number of bedrooms is required').min(1),
  bathrooms: Yup.number().required('Number of bathrooms is required').min(1),
  type: Yup.string().required('Type is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  images: Yup.array()
    .of(Yup.mixed())
    .min(1, 'At least one image is required')
    .max(5, 'You can only upload up to 5 images')
    .required('Images are required'),
});

const PostHouseForm: React.FC<PostHouseFormProps> = ({ onSuccess, initialData }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      price: initialData?.price || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
      area: initialData?.area || '',
      bedrooms: initialData?.bedrooms || '',
      bathrooms: initialData?.bathrooms || '',
      images: [],
      type: initialData?.type || 'House',
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Upload images if there are new ones
        let imageUrls = initialData?.images || [];
        if (values.images.length > 0) {
          const uploadPromises = values.images.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data, error } = await supabase.storage
              .from('property-images')
              .upload(fileName, file);

            if (error) throw error;
            return data.path;
          });

          imageUrls = await Promise.all(uploadPromises);
        }

        const propertyData = {
          price: values.price,
          city: values.city,
          country: values.country,
          area: values.area,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          type: values.type,
          title: values.title,
          description: values.description,
          images: imageUrls,
          user_id: user.id,
        };

        if (initialData) {
          // Update existing property
          const { error } = await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', initialData.id);

          if (error) throw error;
        } else {
          // Create new property
          const { error } = await supabase
            .from('properties')
            .insert([propertyData]);

          if (error) throw error;
        }

        onSuccess?.();
      } catch (err) {
        console.error('Error submitting form:', err);
        setError('Failed to submit property. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const updateImages = (files: File[]) => {
    formik.setFieldValue('images', files);
    formik.setFieldTouched('images', true, false);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = formik.values.images;
    const totalFiles = [...currentFiles, ...files].slice(0, 5);

    updateImages(totalFiles);

    if (files.length + currentFiles.length > 5) {
      formik.setErrors({
        ...formik.errors,
        images: 'You can upload up to 5 images only.',
      });
    } else {
      formik.setErrors({ ...formik.errors, images: undefined });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    updateImages(newImages);
  };

  const handlePreviewClick = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isModalOpen) return;
    if (e.key === 'Escape') setIsModalOpen(false);
    if (e.key === 'ArrowLeft') setActiveIndex((i) => (i > 0 ? i - 1 : i));
    if (e.key === 'ArrowRight') setActiveIndex((i) => (i < previewUrls.length - 1 ? i + 1 : i));
  };

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <h2>{initialData ? 'Edit Property' : 'Post Your House'}</h2>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.formCol}>
          <InputComponent
            name="title"
            labelText="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.title}
            touched={formik.touched.title}
            variant="light"
          />
          <InputComponent
            name="price"
            labelText="Price ($)"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.price}
            touched={formik.touched.price}
            variant="light"
            preventNegative={true}
            min={0}
            onValidationError={(error) => formik.setFieldError('price', error)}
          />
          <InputComponent
            name="city"
            labelText="City"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.city}
            touched={formik.touched.city}
            variant="light"
          />
          <InputComponent
            name="country"
            labelText="Country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.country}
            touched={formik.touched.country}
            variant="light"
          />
          <InputComponent
            name="area"
            labelText="Area (m²)"
            type="number"
            value={formik.values.area}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.area}
            touched={formik.touched.area}
            variant="light"
            preventNegative={true}
            min={0}
            onValidationError={(error) => formik.setFieldError('area', error)}
          />
        </div>
        <div className={styles.formCol}>
          <InputComponent
            name="bedrooms"
            labelText="Bedrooms"
            type="number"
            value={formik.values.bedrooms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.bedrooms}
            touched={formik.touched.bedrooms}
            variant="light"
            preventNegative={true}
            min={0}
            onValidationError={(error) => formik.setFieldError('bedrooms', error)}
          />
          <InputComponent
            name="bathrooms"
            labelText="Bathrooms"
            type="number"
            value={formik.values.bathrooms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.bathrooms}
            touched={formik.touched.bathrooms}
            variant="light"
            preventNegative={true}
            min={0}
            onValidationError={(error) => formik.setFieldError('bathrooms', error)}
          />
          <SelectComponent
            value={formik.values.type}
            onChange={val => formik.setFieldValue('type', val)}
            options={['House', 'Flat']}
          />
          {formik.touched.type && formik.errors.type && (
            <div className={styles.error}>{formik.errors.type}</div>
          )}
          <div className={styles.fieldGroup}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea + ' ' + styles.light}
              placeholder="Describe your property..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby={formik.errors.description && formik.touched.description ? 'description-error' : undefined}
              aria-invalid={!!(formik.errors.description && formik.touched.description)}
              required
            />
            {formik.errors.description && formik.touched.description && (
              <div id="description-error" className={styles.error}>{formik.errors.description}</div>
            )}
          </div>
          {/* Image Upload */}
          <div className={styles.fieldGroup}>
            <label htmlFor="images">
              {initialData ? 'Update Images (Optional)' : 'Upload up to 5 Images'}
            </label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              aria-describedby="images-error"
            />
            {formik.touched.images && formik.errors.images && (
              <div id="images-error" className={styles.error}>
                {typeof formik.errors.images === 'string' ? formik.errors.images : ''}
              </div>
            )}
            {/* Thumbnails with remove buttons */}
            {previewUrls.length > 0 && (
              <div className={styles.carousel}>
                {previewUrls.map((url, index) => (
                  <div key={index} className={styles.previewWrapper}>
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className={styles.preview}
                      onClick={() => handlePreviewClick(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePreviewClick(index)}
                    />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Submitting...' : initialData ? 'Update Property' : 'Submit'}
      </button>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className={styles.modal}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${activeIndex + 1} of ${previewUrls.length}`}
        >
          <button
            className={styles.closeBtn}
            onClick={() => setIsModalOpen(false)}
            aria-label="Close fullscreen image viewer"
          >
            ✕
          </button>

          <img
            src={previewUrls[activeIndex]}
            alt={`Full preview ${activeIndex + 1}`}
            className={styles.fullImage}
          />

          {activeIndex > 0 && (
            <button
              className={styles.prevBtn}
              onClick={() => setActiveIndex((i) => i - 1)}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}
          {activeIndex < previewUrls.length - 1 && (
            <button
              className={styles.nextBtn}
              onClick={() => setActiveIndex((i) => i + 1)}
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default PostHouseForm;
