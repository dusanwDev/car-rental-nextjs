'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './PostHouseForm.module.scss';
import InputComponent from './Input';

interface FormValues {
  price: string;
  location: string;
  area: string;
  bedrooms: string;
  images: File[];
}

const validationSchema = Yup.object({
  price: Yup.number().required('Price is required').min(1000, 'Too low'),
  location: Yup.string().required('Location is required'),
  area: Yup.number().required('Area is required').min(10),
  bedrooms: Yup.number().required('Number of bedrooms is required').min(1),
  images: Yup.array()
    .of(Yup.mixed())
    .min(1, 'At least one image is required')
    .max(5, 'You can only upload up to 5 images')
    .required('Images are required'),
});

const PostHouseForm: React.FC = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const formik = useFormik<FormValues>({
    initialValues: {
      price: '',
      location: '',
      area: '',
      bedrooms: '',
      images: [],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Submitted:', values);
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
      <h2>Post Your House</h2>

      {/* Image Upload */}
      <div className={styles.fieldGroup}>
        <label htmlFor="images">Upload up to 5 Images</label>
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

      {/* Inputs */}
      <InputComponent
        name="price"
        labelText="Price ($)"
        type="number"
        value={formik.values.price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.price}
        touched={formik.touched.price}
      />

      <InputComponent
        name="location"
        labelText="Location"
        value={formik.values.location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.location}
        touched={formik.touched.location}
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
      />

      <InputComponent
        name="bedrooms"
        labelText="Bedrooms"
        type="number"
        value={formik.values.bedrooms}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.bedrooms}
        touched={formik.touched.bedrooms}
      />

      <button type="submit">Submit</button>

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
