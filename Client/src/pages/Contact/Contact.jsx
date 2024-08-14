import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import './Contact.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // Fetch information from the API
    const fetchInfo = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/info');
        if (response.data) {
          setInfo(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch information', err);
      }
    };

    fetchInfo();
  }, []);

  // Scroll effect handling
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isZoomed = scrollY > 100; // Change this value as needed

  useEffect(() => {
    AOS.init({
      duration: 1200,
      // Remove once: true to enable animations every time
    });
    
    // Optionally, refresh AOS when component mounts to ensure animations trigger correctly
    AOS.refresh();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className='fullContact' data-aos='fade-up'>
      <span className='contactName' data-aos='fade-up'>Bize Ulaşın</span>
      <div className="line">
        <span className='main'> Phone Number: </span> 
        <span className='val'> {info?.phoneNumber1 || '+90 535 375 27 06'} </span>
      </div>
      <div className="line">
        <span className='main'> Email: </span> 
        <span className='val'> {info?.email || 'info@spormagazatr.com'} </span>
      </div>
      <div className="line">
        <span className='main'>Address: </span> 
        <span className='val'> {info?.address || 'Street 6, Istanbul, Turkiye.'} </span>
      </div>
    </div>
  );
}

export default Contact;
