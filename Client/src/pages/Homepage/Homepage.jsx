import React, { useEffect } from 'react'
import Hero from '../../sections/HeroSection/Hero'
import Products from '../../sections/ProductsSection/ProductsSection'
import { useLocation } from 'react-router-dom';
import CategoriesPage from '../../sections/Categories/Categories'


const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div className='Homepage'>
        <Hero />
        {/* <Desc /> */}
        <CategoriesPage />
        <Products />
        {/* <HomeDesignSec /> */}
    </div>
  )
}

export default Homepage