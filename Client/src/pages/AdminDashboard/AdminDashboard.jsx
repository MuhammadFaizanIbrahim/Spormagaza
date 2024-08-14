// src/pages/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../Admin/src/components/Sidebar';
import Dashboard from '../../Admin/src/pages/Dashboard';
import Sales from '../../Admin/src/pages/Sales';
import Orders from '../../Admin/src/pages/Orders';
import AdminProducts from '../../Admin/src/pages/Products';
import AddProduct from '../../Admin/src/pages/Product/AddProduct';
import UpdateProduct from '../../Admin/src/pages/Product/UpdateProduct';
import Categories from '../../Admin/src/pages/Categories';
import AddCategory from '../../Admin/src/pages/Category/AddCategory';
import UpdateCategory from '../../Admin/src/pages/Category/AddCategory';
import Users from '../../Admin/src/pages/Users';
import OrderDetails from '../../Admin/src/pages/OrderDetails';
import SliderImages from '../../Admin/src/pages/AddSliderImage';
import LogoImages from '../../Admin/src/pages/AddLogo';

const AdminDashboard = () => {
  return (
    <div>
      <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/update/:id" element={<UpdateCategory />} />
          <Route path="/sliderImages" element={<SliderImages />} />
          <Route path="/logoImage" element={<LogoImages />} />
          <Route path="/users" element={<Users />} />
        </Routes>
    </div>
  );
}

export default AdminDashboard;
