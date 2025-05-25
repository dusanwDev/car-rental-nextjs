'use client';

import React, { useState } from 'react';
import styles from './FAQAccordion.module.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const faqData = [
  {
    question: 'How do I start the process of buying a property with Aruna?',
    answer:
      "At Aruna, we make it simple for you to find your dream home. Start by browsing our property listings, and once you've found a property that interests you, contact our team to schedule a viewing and get expert advice on the next steps.",
  },
  {
    question: 'What types of properties does Aruna offer?',
    answer:
      'We offer a wide variety of properties including villas, apartments, land, and commercial spaces throughout Indonesia.',
  },
  {
    question: 'Can Aruna assist with property financing or mortgages?',
    answer:
      'Yes, we work with financing institutions and can guide you through the mortgage application process.',
  },
  {
    question: 'Does Aruna provide property management services?',
    answer:
      'Absolutely! We offer full property management services to help you maintain your investment hassle-free.',
  },
  {
    question: 'Are there any fees involved in working with Aruna?',
    answer:
      'There may be service fees depending on the type of property and service. Our team will provide full transparency before any agreement.',
  },
];

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.left}>
        <h2>
          Frequently Asked <br /> Question
        </h2>
        <p>
          Whether you're looking for a modern apartment in the city or a
          peaceful home in the suburbs, our listings offer something for
          everyone.
        </p>
      </div>
      <div className={styles.right}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.accordionItem}>
            <button
              className={styles.question}
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-content-${index}`}
            >
              {item.question}
              <span className={`${styles.arrow} ${openIndex === index ? styles.arrowRotated : ''}`}>
                <KeyboardArrowDownIcon />
              </span>
            </button>
            <div
              id={`faq-content-${index}`}
              className={`${styles.answer} ${openIndex === index ? styles.answerOpen : ''}`}
              aria-hidden={openIndex !== index}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQAccordion;
