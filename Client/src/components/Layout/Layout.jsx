// src/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../sections/Header/Header';
import Footer from '../../sections/Footer/Footer';

const Layout = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className='App'>
      {!isAdminDashboard && <Header />}
      <Outlet />
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

export default Layout;
