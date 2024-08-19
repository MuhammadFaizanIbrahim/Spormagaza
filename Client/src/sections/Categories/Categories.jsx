import React, { useEffect, useState } from 'react';
import './Categories.css'; // Make sure to create and link this CSS file
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchDataFromApi } from '../../utils/api'; // Adjust the import path as needed

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });

    fetchDataFromApi('/api/category').then((res) => {
      setCategories(res);
    });

    AOS.refresh();
  }, []);

  return (
    <div className="categories-page">
      <div className="categories-container">
        {categories.length !== 0 && categories.map((category, index) => (
          <Link
            key={index}
            className="category-item"
            to={`/products?category=${category.name}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src={category.images?.[0]} alt={category.name} className="category-image" />
            <div className="category-text">{category.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
