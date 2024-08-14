import React, { useEffect } from 'react';
import './Categories.css'; // Make sure to create and link this CSS file
import jersey from '../../assets/images/j1.jpg';
import hoodie from '../../assets/images/h1.jpg';
import tshirt from '../../assets/images/t1.jpg';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CategoriesPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      // Remove once: true to enable animations every time
    });
    
    // Optionally, refresh AOS when component mounts to ensure animations trigger correctly
    AOS.refresh();
  }, []); // Empty dependency array ensures this runs only once
  return (
    <div className="categories-page">
      <h1 className="categories-heading" data-aos='fade-up'>Kategorilerimiz</h1>
      <div className="categories-container" data-aos='fade-up'>
        <Link className="category-item" to='/products?category=Jerseys' onClick={() => window.scrollTo(0, 0)}>
          <img src={jersey} alt="Category 1" className="category-image" />
          <div className="category-text">Jerseys</div>
        </Link>
        <Link className="category-item" to='/products?category=Hoodies' onClick={() => window.scrollTo(0, 0)}>
          <img src={hoodie} alt="Category 2" className="category-image" />
          <div className="category-text">Hoodies</div>
        </Link>
        <Link className="category-item" to='/products?category=TShirts' onClick={() => window.scrollTo(0, 0)}>
          <img src={tshirt} alt="Category 1" className="category-image" />
          <div className="category-text">T-Shirts</div>
        </Link>
      </div>
    </div>
  );
};

export default CategoriesPage;
