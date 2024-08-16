import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsSection.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { fetchDataFromApi } from '../../utils/api';

const Products = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200 });
    AOS.refresh();

    fetchDataFromApi("/api/products/featured").then((res) => {
      setFeaturedProducts(res);
    });
  }, []);

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

  // Auto slide effect for tablet and mobile
  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (window.innerWidth <= 768) {
        handleNext();
      }
    }, 2000);

    return () => clearInterval(autoSlide);
  }, [currentIndex, featuredProducts]);

  const handleNext = () => {
    const row = document.querySelector('.homePage-products-row');
    const cards = document.querySelectorAll('.homePage-product-card');
  
    // Apply slide-out animation to the current visible cards
    cards.forEach(card => card.classList.add('slide-out'));
  
    setTimeout(() => {
      if (currentIndex < featuredProducts.length - cardsToShow) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Reset to the first product
      }
  
      // Remove slide-out class and reset opacity and transform
      cards.forEach(card => {
        card.classList.remove('slide-out');
        card.style.opacity = '0';
        card.style.transform = 'translateX(100%)';
      });
  
      // Trigger reflow to restart the animation
      void row.offsetWidth;
  
      // Apply slide-in animation to the new visible cards
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
        card.classList.add('slide-in');
      });
    }, 500); // Match the duration of the slide-out animation
  };
  
  const handlePrev = () => {
    const row = document.querySelector('.homePage-products-row');
    const cards = document.querySelectorAll('.homePage-product-card');
  
    // Apply slide-out animation to the current visible cards
    cards.forEach(card => card.classList.add('slide-out'));
  
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        setCurrentIndex(featuredProducts.length - cardsToShow); // Go to the last product
      }
  
      // Remove slide-out class and reset opacity and transform
      cards.forEach(card => {
        card.classList.remove('slide-out');
        card.style.opacity = '0';
        card.style.transform = 'translateX(100%)';
      });
  
      // Trigger reflow to restart the animation
      void row.offsetWidth;
  
      // Apply slide-in animation to the new visible cards
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
        card.classList.add('slide-in');
      });
    }, 500); // Match the duration of the slide-out animation
  };
  
  const displayedProducts = featuredProducts.slice(currentIndex, currentIndex + cardsToShow);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Touch event handling for sliding on mobile/tablet
  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;
    e.target.setAttribute('data-touchstart', touchStartX);
  };

  const handleTouchEnd = (e) => {
    const touchStartX = parseFloat(e.target.getAttribute('data-touchstart'));
    const touchEndX = e.changedTouches[0].clientX;

    if (touchStartX - touchEndX > 50) {
      handleNext(); // Swipe left
    } else if (touchEndX - touchStartX > 50) {
      handlePrev(); // Swipe right
    }
  };

  return (
    <div className="homePage-products-section">
      <h2 data-aos='fade-up'>BİZİM ÜRÜNLERİMİZ</h2>
      <h1 data-aos='fade-up'>EN ÇOK SATAN KİTAP</h1>
      <div
        className="homePage-slider-container"
        data-aos='fade-up'
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="homePage-slider-arrow left" onClick={handlePrev} disabled={currentIndex === 0}>
          <FaArrowLeft />
        </button>
        <div className="homePage-products-row" data-aos='fade-up'>
          {displayedProducts.map((item, index) => (
            <div key={index} className="homePage-product-card" onClick={() => handleCardClick(item._id)}>
              <img src={item.images[0]} alt={item.name} />
              <p>{item.name}</p>
              <p className="homePage-Product-price">₺{item.price}</p>
            </div>
          ))}
        </div>
        <button className="homePage-slider-arrow right" onClick={handleNext} disabled={currentIndex >= featuredProducts.length - cardsToShow}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Products;
