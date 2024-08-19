import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSearch } from "react-icons/fi";
import { FaShoppingBag, FaUser, FaSearch } from "react-icons/fa";
import user from '../../assets/images/user2.png'
import search from '../../assets/images/search1.png'
import bag from '../../assets/images/bag2.png'
import Cart from '../../assets/images/cart.png'
import { useCart } from '../../components/CartContext';
import axios from 'axios';
import logo2 from '../../assets/images/splogo.png'

const Header = () => {
  const location = useLocation();
  const [logo, setLogo] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewContainerOpen, setIsNewContainerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
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
    navigate('/cart');
    // if (userExists && tokenExists) {
    // } else {
    //   alert('Please log in to view your cart.');
    //   navigate('/login');
    // }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products`);
      const products = response.data;
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      if (results.length > 0) {
        navigate(`/products?search=${searchQuery}`);
      } else {
        alert('No product found');
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
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
      <div className='leftSideIcons'>
      <button className="mobileMenuIcon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        <button className="searchIcon" onClick={toggleSearchBar}>
        <img src={search} className="searchIcon" alt="Search" />
      </button>
      {isSearchBarVisible && (
        <div className="searchBar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Arama"
          />
          <button onClick={performSearch}>Ara</button>
        </div>
      )}

        </div>
      <Link className='HeaderLogo' to='/'>
                {logo ? (
                    <img src={logo} className='Logo' alt="Spormagaza Tea Logo" />
                ) : (
                  <img src={logo2} className='Logo' alt="Spormagaza Tea Logo" />
                )}
            </Link>
          
      <div className='rightSideIcons'>
      {isLoggedIn ? (
          <button className="userIcons" onClickCapture={logout}>
          <img src={user} className="userIconss"/>
        </button>
        ) : (
          <Link
            to='/login'
            className='userIcon'
            onClick={() => window.scrollTo(0, 0)}
          >
            <button className="userIcons">
            <img src={user}  className="userIconss"/>
        </button>
          </Link>
        )}
       <button className="searchIcon" onClick={toggleSearchBar}>
        <img src={search} className="searchIcon" alt="Search" />
      </button>
      <div className={`searchBar ${isSearchBarVisible ? 'open' : ''}`}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Arama"
        />
        <button onClick={performSearch}>Ara</button>
      </div>

         <div className='cartIconContainer'>
            <button className='bagIcon' style={{ backgroundColor: 'transparent', border: 'none' }} onClick={handleCartClick}>
            <img src={bag} className='bagIcons'/>
            <img src={Cart} className='cartIcons'/>
            </button>
            {/* {userExists && totalQuantity > 0 && ( */}
            {/* {totalQuantity > 0 && ( */}
              <button className="cartQuantity" onClick={handleCartClick}>
                {totalQuantity}
              </button>
            {/* )} */}
          </div>
          </div>
          </div>
          <div className={`bottomHeader ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="bottomHeaderTitle">Menü</div>
          <Link to='/' className='HeaderText' onClick={() => { window.scrollTo(0, 0); toggleMobileMenu(); }}>Ana Sayfa</Link>
          {categories.map(category => (
            <Link 
              key={category._id} 
              to={`/products?category=${category.name}`} 
              className='HeaderText' 
              onClick={() => { window.scrollTo(0, 0); toggleMobileMenu(); }}
            >
              {category.name}
            </Link>
          ))}
          <Link to='/contact' className='HeaderText' onClick={() => { window.scrollTo(0, 0); toggleMobileMenu(); }}>İletişim</Link>
        </div>

    </div>
  );
};

export default Header;
