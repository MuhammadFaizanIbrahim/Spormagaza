// src/components/BottomNavBar/BottomNavBar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import user from '../../assets/images/user2.png'
import Cart from '../../assets/images/cart.png'
import { FiHome, FiShoppingCart, FiMenu, FiX, FiUser, FiSearch, FiHeart } from "react-icons/fi";

import './BottomNavbar.css';
import { useCart } from '../../components/CartContext';


const BottomNavBar = () => {

    const { cart, clearCart } = useCart();
    const isLoggedIn = !!localStorage.getItem('token'); 
    const totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
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
        <span>Ana Sayfa</span>
      </NavLink>
          <NavLink to="/" className="nav-item">
          <FiHeart />
          <span>Favoriler</span>
      </NavLink>
      <div className='cartIconContainerNavbar' onClick={handleCartClick}>
            <button className='nav-item' style={{ color: "black", backgroundColor: 'transparent', border: 'none' }} onClick={handleCartClick}>
            <img src={Cart} className='nav-item-cart'/>
        <span>Sepet</span>
            </button>
            {totalQuantity > 0 && (
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
          <button className="nav-item" onClickCapture={logout}>
          <img src={user} className="nav-item-user"/>
          <span>Profil</span>
        </button>
        ) : (
          <Link
            to='/login'
            className='nav-item'
            onClick={() => window.scrollTo(0, 0)}
          >
            <button className="nav-item">
            <img src={user}  className="nav-item-user"/>
            <span>Profil</span>
        </button>
          </Link>
        )}
    </div>
  );
};

export default BottomNavBar;
