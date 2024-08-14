import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './MoreProducts.css';
import { FaCartPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchDataFromApi } from '../../utils/api';
import { useCart } from '../../components/CartContext'; // Import the useCart hook

const MoreProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200 });
    AOS.refresh();

    fetchDataFromApi("/api/products/featured").then((res) => {
      setFeaturedProducts(res);
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4); // Number of cards to show

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth <= 480) {
        setCardsToShow(2);
      } else if (window.innerWidth <= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);

    return () => {
      window.removeEventListener('resize', updateCardsToShow);
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < featuredProducts.length - cardsToShow) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const displayedProducts = featuredProducts.slice(currentIndex, currentIndex + cardsToShow);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="productPage-products-section">
      <h2 data-aos='fade-up'>BİZİM ÜRÜNLERİMİZ</h2>
      <h1 data-aos='fade-up'>EN ÇOK SATAN KİTAP</h1>
      <div className="productPage-slider-container" data-aos='fade-up'>
        <button className="productPage-slider-arrow left" onClick={handlePrev} disabled={currentIndex === 0}>
          <FaArrowLeft />
        </button>
        <div className="productPage-products-row" data-aos='fade-up'>
          {displayedProducts.map((item, index) => (
            <div key={index} className="productPage-product-card" onClick={() => handleCardClick(item._id)}>
              <img src={item.images[0]} alt={item.name} />
              <p>{item.name}</p>
              <p className="productPage-Product-price">₺{item.price}</p>
            </div>
          ))}
        </div>
        <button className="productPage-slider-arrow right" onClick={handleNext} disabled={currentIndex >= featuredProducts.length - cardsToShow}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};


export default MoreProducts;
