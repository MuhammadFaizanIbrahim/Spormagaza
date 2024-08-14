import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/images/DGLogo3.png';
import { FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from '../../components/CartContext';
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const [logo, setLogo] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [headerColor, setHeaderColor] = useState('white');
  const [categories, setCategories] = useState([]);
  const [isWhiteBackground, setIsWhiteBackground] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewContainerOpen, setIsNewContainerOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);


  useEffect(() => {
    // Fetch the logo image from the backend
    const fetchLogo = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/logo-images`);
          if (response.data.length > 0) {
                setLogo(response.data[0].imageUrl); // Assuming you fetch only one logo
            }
        } catch (error) {
            console.error('Failed to fetch logo image', error);
        }
    };

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
    fetchCategories();
}, []);


  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const whiteBackgroundPaths = ['/', '/login', '/signup'];

    if (whiteBackgroundPaths.includes(location.pathname) && scrollY <= 50) {
      setHeaderColor('white');
      setIsWhiteBackground(true);
    } else {
      setHeaderColor('white');
      setIsWhiteBackground(false);
    }
  }, [location.pathname, scrollY]);

  const isLoggedIn = !!localStorage.getItem('token'); 
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root');
    localStorage.removeItem('user');
    clearCart();
    navigate('/login');
  };

  const userExists = localStorage.getItem('user');
  const tokenExists = localStorage.getItem('token');

  const handleCartClick = () => {
    if (userExists && tokenExists) {
      navigate('/cart');
    } else {
      alert('Please log in to view your cart.');
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openNewContainer = () => {
    setIsNewContainerOpen(true);
  };

  const closeNewContainer = () => {
    setIsNewContainerOpen(false);
  };

  return (
    <div className="fullHeader">
      <div className="UpHeader">
      <Link className='HeaderLogo' style={{ color: headerColor }} to='/'>
                {logo ? (
                    <img src={logo} className='Logo' alt="Spormagaza Tea Logo" />
                ) : (
                    'Loading...' // Fallback text or placeholder while loading the logo
                )}
            </Link>
        <div className='HeaderRightSide'>
          <div className='profileDropdown'>
            {isLoggedIn ? (
              <div>
                <span className='HeaderText' style={{ color: headerColor, cursor: 'pointer' }} onClickCapture={logout}>Çıkış</span>
              </div>
            ) : (
              <Link to='/login' className='HeaderText' style={{ color: headerColor }} onClick={() => window.scrollTo(0, 0)}>
                <p>Giriş</p>
              </Link>
            )}
          </div>
          <div className='cartIconContainer'>
            <button className='bagIcon' style={{ color: headerColor, backgroundColor: 'transparent', border: 'none' }} onClick={handleCartClick}>
              <FaShoppingBag />
            </button>
            {userExists && totalQuantity > 0 && (
              <button className="cartQuantity" onClick={handleCartClick}>
                {totalQuantity}
              </button>
            )}
          </div>
        </div>
        <button className="mobileMenuIcon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div className={`bottomHeader ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to='/' className='HeaderText' style={{ color: headerColor }} onClick={() => { window.scrollTo(0, 0); toggleMobileMenu(); }}>Ana Sayfa</Link>
        {categories.map(category => (
          <Link 
            key={category._id} 
            to={`/products?category=${category.name}`} 
            className='HeaderText' 
            style={{ color: headerColor }} 
            onClick={() => { window.scrollTo(0, 0); toggleMobileMenu(); }}
          >
            {category.name}
          </Link>
        ))}
        <Link to='/contact' className='HeaderText' style={{ color: headerColor }} onClick={() => { window.scrollTo(0, 0); toggleMobileMenu(); }}>Bize Ulaşın</Link>
      </div>
    </div>
  );
};

export default Header;
