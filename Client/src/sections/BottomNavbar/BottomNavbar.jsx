// src/components/BottomNavBar/BottomNavBar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { FiHome, FiShoppingCart, FiMenu, FiX, FiUser, FiSearch } from "react-icons/fi";

import './BottomNavbar.css';
import { useCart } from '../../components/CartContext';


const BottomNavBar = () => {

    const { cart, clearCart } = useCart();
    const isLoggedIn = !!localStorage.getItem('token'); 
    const totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
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


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('persist:root');
        localStorage.removeItem('user');
        clearCart();
        navigate('/login');
      };
  return (
    <div className="bottom-nav-bar">
      <NavLink to="/" className="nav-item">
        <FiHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/" className="nav-item">
        <FiSearch />
        <span>Search</span>
      </NavLink>
      <div className='cartIconContainerNavbar'>
            <button className='nav-item' style={{ color: "black", backgroundColor: 'transparent', border: 'none' }} onClick={handleCartClick}>
              <FiShoppingCart />
        <span>Cart</span>
            </button>
            {userExists && totalQuantity > 0 && (
              <button className="cartQuantityNavbar" onClick={handleCartClick}>
                {totalQuantity}
              </button>
            )}
          </div>
      {/* <NavLink to="/profile">
        <FaUser />
        <span>Profile</span>
      </NavLink> */}
      {isLoggedIn ? (
          <button  className="nav-item" onClickCapture={logout}>
          <FiUser />
          <span>Profile</span>
        </button>
        ) : (
          <Link
            to='/login'
            className='nav-item'
            onClick={() => window.scrollTo(0, 0)}
          >
            <button  className="nav-item">
          <FiUser />
          <span>Profile</span>
        </button>
          </Link>
        )}
    </div>
  );
};

export default BottomNavBar;
