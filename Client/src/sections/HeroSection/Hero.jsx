import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './Hero.css';
import axios from 'axios';

const Hero = () => {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/slider-images`);
        const images = response.data.slice(0, 3).map(image => image.imageUrl);
        setSlides(images);
      } catch (error) {
        console.error('Error fetching slider images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        if (!animating) {
          setAnimating(true);
          setTimeout(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
            setAnimating(false);
          }, 500); // Match this with the animation duration in CSS
        }
      }, 4000); // Duration between slide changes

      return () => clearInterval(interval);
    }
  }, [slides, animating]);

  const nextSlide = () => {
    if (!animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setAnimating(false);
      }, 500);
    }
  };

  const prevSlide = () => {
    if (!animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
        setAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="hero-section" ref={heroRef}>
      {slides.length > 0 && (
        <>
          <div className="heroImage-container">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                className={`heroImage ${
                  index === currentSlide ? 'visible animating' : 'hidden'
                }`}
                alt={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <button className="prev" onClick={prevSlide}>&#10094;</button>
          <button className="next" onClick={nextSlide}>&#10095;</button>
        </>
      )}
    </div>
  );
};

export default Hero;
