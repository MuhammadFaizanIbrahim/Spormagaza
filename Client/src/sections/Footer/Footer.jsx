import React, { useEffect, useState } from 'react';
import './Footer.css'; // Example for styling
import logo from '../../assets/images/DGLogo3.png';
import { FaWhatsapp } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phoneNumber1: '',
    email: '',
    address: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch the logo image from the backend
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/logo-images`);
        if (response.data.length > 0) {
          setLogoUrl(response.data[0].imageUrl); // Assuming you fetch only one logo
        }
      } catch (error) {
        console.error('Failed to fetch logo image', error);
      }
    };

    // Fetch contact info from the backend
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/info`);
        if (response.data) {
          setContactInfo({
            phoneNumber1: response.data.phoneNumber1,
            email: response.data.email,
            address: response.data.address
          });
        }
      } catch (error) {
        console.error('Failed to fetch contact info', error);
      }
    };

    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/category`);
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchLogo();
    fetchContactInfo();
    fetchCategories();
  }, []);

  return (
    <div className="fullFooter">
      <div className='footerMain'>
        <div className="footer-logo">
          <Link className='footer-logo' to='/'>
            {logoUrl ? (
              <img src={logoUrl} className='footerLogo' alt="Spormagaza Logo" />
            ) : (
              'Loading...' // Fallback text or placeholder while loading the logo
            )}
          </Link>
        </div>
        <div className="footer-options">
          {/* Contact Us column */}
          <div className="footer-column">
            <h4>Bize Ulaşın</h4>
            <ul>
              <li><FaWhatsapp /> &nbsp; {contactInfo.phoneNumber1 || '+90 535 375 27 06'}</li>
              <li><IoMdMail /> &nbsp; {contactInfo.email || 'info@spormagazatr.com'}</li>
              <li><FaLocationDot /> &nbsp; {contactInfo.address || 'Street 6, Istanbul, Turkiye.'}</li>
            </ul>
          </div>
          {/* Navigation column */}
          <div className="footer-column2">
            <h4>Navigasyon</h4>
            <ul>
              <Link to='/' className='li' onClick={() => window.scrollTo(0, 0)}>Ana Sayfa</Link><br/>
              <Link to='/contact' className='li' onClick={() => window.scrollTo(0, 0)}>Bize Ulaşın</Link><br/>
            </ul>
          </div>
          {/* Categories column */}
          <div className="footer-column3">
            <h4>Ürünlerimiz</h4>
            <ul>
              {categories.length > 0 ? (
                categories.map(category => (
                  <li key={category._id}>
                    <Link to={`/products?category=${category.name}`} className='li' onClick={() => window.scrollTo(0, 0)}>
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li> // Fallback text or placeholder while loading categories
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* <img src={heroImg} className="footerImage2" alt="Halil Tea" />
      <img src={heroImg3} className="footerImage3" alt="Halil Tea" /> */}
    </div>
  );
}

export default Footer;
