import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Homepage from './pages/Homepage/Homepage';
import About from './pages/About/About';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/SignUp/SignupPage';
import SingleProductPage from './pages/SingleProduct/SingleProductPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CartPage from './pages/CartPage/CartPage';
import { CartProvider } from './components/CartContext';
import PreLoader from './components/Preloader/Preloader';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import Contact from './pages/Contact/Contact';
import './App.css'
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



const App = () => {
  const [loading, setLoading] = useState(true);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


  useEffect(() => {
    // Simulate loading process (e.g., fetching data, initializing app)
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the time as needed
  }, []);

  return (
    <CartProvider>
      {loading ? (
        <PreLoader />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Homepage />} />
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forget-password" element={<UpdatePassword />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/cart" element={<CartPage />} /> {/* Add the Cart page route */}
              <Route 
                path="/checkout" 
                element={
                  <Elements stripe={stripePromise}>
                    <CheckoutPage />
                  </Elements>
                } 
              />
              <Route path="/thanksPage" element={<OrderConfirmation />} /> {/* Add the Cart page route */}
              <Route
                path="/dashboard/*"
                element={<ProtectedRoute element={<AdminDashboard />} />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </CartProvider>
  );
};

export default App;
