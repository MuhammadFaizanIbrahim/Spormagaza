// src/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../sections/Header/Header';
import Footer from '../../sections/Footer/Footer';
import BottomNavBar from '../../sections/BottomNavbar/BottomNavbar';
import './Layout.css'; // Import the updated CSS file for layout

const Layout = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className='layout'>
      {!isAdminDashboard && <Header />}
      <div className="main-content">
        <Outlet />
      </div>
      {!isAdminDashboard && <Footer />}
      {!isAdminDashboard && <BottomNavBar />} {/* Add BottomNavBar */}
    </div>
  );
};

export default Layout;
