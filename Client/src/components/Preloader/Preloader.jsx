import React, { useEffect } from 'react';
import './Preloader.css';
import logo from '../../assets/images/splogo.png';
import { lineSpinner } from 'ldrs';
import { preLoaderAnim } from './index.js';


lineSpinner.register(); // Register the spinner component


const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim(); // Your existing animation logic

    // const img = document.querySelector('.img-container img');
    // img.classList.add('rotate-once', 'zoom-in');

    // setTimeout(() => {
    //   img.classList.add('fade-out');
    // }, 2000);

    // return () => {
    //   img.classList.remove('rotate-once', 'zoom-in', 'fade-out');
    // };
  }, []);

  return (
    <div className="preLoader">
      <div className="spinner-container">
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="black"
        ></l-line-spinner>
      </div>
      {/* <div className="img-container"> */}
        {/* <img src={logo} alt="Logo" style={{ height: "250px", width: "350px" }} /> */}
      {/* </div> */}
      <div className="text-container">
      </div>
    </div>
  );
}

export default PreLoader;
