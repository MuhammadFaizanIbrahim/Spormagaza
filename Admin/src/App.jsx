// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Orders from './pages/Orders';
import Products from './pages/Products';
import AddProduct from './pages/Product/AddProduct';
import UpdateProduct from './pages/Product/UpdateProduct';
import Categories from './pages/Categories';
import AddCategory from './pages/Category/AddCategory';
import UpdateCategory from './pages/Category/UpdateCategory';
import Users from './pages/Users';
import OrderDetails from './pages/OrderDetails';
import SliderImages from './pages/AddSliderImage';
import LogoImages from './pages/AddLogo';
import InfoManagement from './pages/InfoManagement';

function App() {
    return (
        <Router>
            <Sidebar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/update/:id" element={<UpdateProduct />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/add" element={<AddCategory />} />
                <Route path="/categories/update/:id" element={<UpdateCategory />} />
                <Route path="/sliderImages" element={<SliderImages />} />
                <Route path="/logoImage" element={<LogoImages />} />
                <Route path="/info" element={<InfoManagement />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </Router>
    );
}

export default App;
