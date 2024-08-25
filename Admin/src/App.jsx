import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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
import LoginPage from './pages/Login/LoginPage';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';

// Simulating user authentication state
const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return localStorage.getItem('token') !== null; // Use the correct token key
};

// Protected route component
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Main layout component
const Layout = () => {
    const location = useLocation();
    const hideSidebar = location.pathname === '/login' || location.pathname === '/forget-password';

    return (
        <div className="app-container">
            {!hideSidebar && <Sidebar />}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forget-password" element={<UpdatePassword />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/sales" element={
                    <ProtectedRoute>
                        <Sales />
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                } />
                <Route path="/products" element={
                    <ProtectedRoute>
                        <Products />
                    </ProtectedRoute>
                } />
                <Route path="/products/add" element={
                    <ProtectedRoute>
                        <AddProduct />
                    </ProtectedRoute>
                } />
                <Route path="/products/update/:id" element={
                    <ProtectedRoute>
                        <UpdateProduct />
                    </ProtectedRoute>
                } />
                <Route path="/categories" element={
                    <ProtectedRoute>
                        <Categories />
                    </ProtectedRoute>
                } />
                <Route path="/categories/add" element={
                    <ProtectedRoute>
                        <AddCategory />
                    </ProtectedRoute>
                } />
                <Route path="/categories/update/:id" element={
                    <ProtectedRoute>
                        <UpdateCategory />
                    </ProtectedRoute>
                } />
                <Route path="/sliderImages" element={
                    <ProtectedRoute>
                        <SliderImages />
                    </ProtectedRoute>
                } />
                <Route path="/logoImage" element={
                    <ProtectedRoute>
                        <LogoImages />
                    </ProtectedRoute>
                } />
                <Route path="/info" element={
                    <ProtectedRoute>
                        <InfoManagement />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
