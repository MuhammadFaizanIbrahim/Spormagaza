import React, { useEffect } from 'react';
import './Preloader.css';
import logo from '../../assets/images/DGLogo3.png';
import { preLoaderAnim } from './index.js';

const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim(); // Assuming this handles other animations

    // Adding rotation, zoom-in, and fade-out animations for the logo
    const img = document.querySelector('.img-container img');
    img.classList.add('rotate-once', 'zoom-in');

    // Delay the addition of the fade-out class to ensure it happens after the zoom-in animation
    setTimeout(() => {
      img.classList.add('fade-out');
    }, 2000); // Adjust the delay to match the duration of the zoom-in animation

    return () => {
      // Clean up if needed
      img.classList.remove('rotate-once', 'zoom-in', 'fade-out');
    };
  }, []);

  return (
    <div className="preLoader">
      <div className="img-container">
        <img src={logo} alt="Logo" style={{ height: "250px", width: "350px" }} />
      </div>
      <div className="text-container">
        {/* <span className='text_md'>Eden Rose The School System</span> */}
      </div>
    </div>
  );
}

export default PreLoader;
