'use client'

import * as React from 'react';
import styles from './Navbar.module.scss'; // recommend creating this for layout styles

interface IBannerProps {
}

const Banner: React.FunctionComponent<IBannerProps> = (props) => {
  return <div>
    <p className={styles.banner}>Lock in your new home with flexible payment plans and special discounts! </p>
  </div>
};

export default Banner;
