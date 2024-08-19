import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../components/CartContext';
import { editData, postData } from '../../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ form, handleChange }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <form>
      <label>Ad Soyad: <br />
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
      </label>
      <label>E-posta: <br />
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>Telefon numarası: <br />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} required />
      </label>
      <label>Adres: <br />
        <input type="text" name="address" value={form.address} onChange={handleChange} required />
      </label>
      <label>Şehir: <br />
        <input type="text" name="city" value={form.city} onChange={handleChange} required />
      </label>
      <label>Posta Kodu: <br />
        <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required />
      </label>
      <label>Ülke: <br />
        <input type="text" name="country" value={form.country} onChange={handleChange} required />
      </label>
    </form>
  );
};

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const user = localStorage.getItem('user');
  const isCartEmpty = cart.length === 0;
  const isDisabled = isCartEmpty;

  const handleSubmit = async (e, paymentMethod = null) => {
    if (isDisabled || isSubmitting) return;
    setIsSubmitting(true);
    e.preventDefault();
    
    try {
      
      // } else {
        // Save the order data in database
        const orderItems = cart.map(item => ({
          product: item._id,
          size: item.selectedSize,
          quantity: item.quantity,
        }));
  
        const userId = "66afafa0216d098ce9ad7e80"; // Example user ID, replace with actual user ID

        const orderData = {
          orderItems,
          shippingAddress: form,
          paymentMethod: form.paymentMethod,
          itemsPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
          totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
          user: userId
        };
  
        const savedOrder = await postData('/api/orders/create', orderData);

        await Promise.all(cart.map(item =>
          editData(`/api/products/count/${item._id}`, {
            size: item.selectedSize,
            countInStock: item.quantity,
          })
        ));

      //   const stripe = await stripePromise;
      // const body = { products: cart };
      // const headers = { "Content-Type": "application/json" };
  
      //   const baseUrl = import.meta.env.VITE_SERVER_URL;
      //   const endpoint = '/api/orders/create-checkout-session';
      //   const url = `${baseUrl}${endpoint}`;

      //   const response = await fetch(url, {
      //   method: "POST",
      //   headers: headers,
      //   body: JSON.stringify(body)
      // });
      // const session = await response.json();
  
      // if (form.paymentMethod === 'creditCard') {
        // Redirect to Stripe Checkout
        // const result = await stripe.redirectToCheckout({ sessionId: session.id });
        // if (result.error) {
        //   console.error(result.error);
        // }

        if (savedOrder) {
          clearCart();
          navigate('/thanksPage', { state: { order: savedOrder } });
        }
      }
     catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const calculateTotal = () => {
    const productCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return {
      productCost,
      totalCost: productCost,
    };
  };

  const { productCost, totalCost } = calculateTotal();

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Fatura Detayları</h2>
        <CheckoutForm form={form} handleChange={handleChange} />
      </div>
      <div className="order-details">
        <h2>Sipariş Detayları</h2>
        {cart.map((item, index) => (
          <div key={index} className="order-item">
            <span>{item.name} : {item.selectedSize}</span>
            <span>{item.quantity} x ${item.price}</span>
          </div>
        ))}
        <hr className="divider" />
        <div className="order-summary">
          <div>
            <span>Ürün Maliyeti:</span>
            <span>₺{productCost.toFixed(2)}</span>
          </div>
          <hr className="divider" />
          <div>
            <span>Toplam Fatura:</span>
            <span style={{ color: 'black' }}><b>₺{totalCost.toFixed(2)}</b></span>
          </div>
          <hr className="divider" />
        </div>
        <h2 style={{ color: 'black' }}>Ödeme Seçenekleri</h2>
        <div className='paymentDetails' style={{ display: 'flex', flexDirection: 'column' }}>
          {/* <label className='radioOptions'>
            <input type="radio" name="paymentMethod" value="cod" onChange={handleChange} required />
            Kapıda ödeme
          </label> */}
          <label className='radioOptions'>
            <input type="radio" name="paymentMethod" value="creditCard" onChange={handleChange} required />
            EFT HAVALE
          </label>
        </div>
        {form.paymentMethod === 'creditCard' && (
          // <Elements stripe={stripePromise}>
            <form onSubmit={handleSubmit}>
              {/* <CardElement /> */}
              <button type="submit" disabled={isDisabled}>Siparişi Onayla</button>
            </form>
          // </Elements>
        )}
        {/* {form.paymentMethod === 'cod' && (
          <button type="submit" onClick={handleSubmit} disabled={isDisabled}>Sipariş Ver</button>
        )} */}
      </div>
    </div>
  );
};

export default CheckoutPage;
