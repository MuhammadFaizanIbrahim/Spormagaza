import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './Hero.css';
import axios from 'axios';

const Hero = () => {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [slides, setSlides] = useState([]); // State to hold slides from the backend
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Fetch images from the backend
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/slider-images`);
        const images = response.data.map(image => image.imageUrl); // Extract image URLs
        const groupedSlides = [];
        for (let i = 0; i < images.length; i += 3) {
          groupedSlides.push(images.slice(i, i + 3));
        }
        setSlides(groupedSlides);
      } catch (error) {
        console.error('Error fetching slider images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
          setAnimating(false);
        }, 500); // Match this with the animation duration in CSS
      }, 4000); // Duration between slide changes

      return () => clearInterval(interval);
    }
  }, [slides]);

  const nextSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
      setAnimating(false);
    }, 500);
  };

  return (
    <div className="hero-section" ref={heroRef}>
      {slides.length > 0 && (
        <>
          <div className={`heroImage-container ${animating ? 'animating' : ''}`}>
            {slides[currentSlide].map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl} // Ensure this is a valid image URL
                className={`heroImage ${heroInView ? 'animate' : ''}`}
                alt={`Slide ${currentSlide + 1} Image ${index + 1}`}
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
