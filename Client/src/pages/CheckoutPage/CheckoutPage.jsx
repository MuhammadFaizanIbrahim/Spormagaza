import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../components/CartContext';
import { editData, fetchDataFromApi, postData } from '../../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import cities from './cities'; // An array of Turkish cities
import provinces from './provinces'; // An array of Turkish provinces
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios'; // Ensure axios is imported
import './CheckoutPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ form, handleChange, setForm, cityOptions, setCityOptions  }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleSelectChange = (selectedOption, name) => {
    if (name === 'province') {
      setForm({ ...form, province: selectedOption, city: '' });
  
      // Update city options based on selected province
      const filteredCities = cities[selectedOption.value] || []; // Assuming cities is an object with province keys
      setCityOptions(filteredCities.map(city => ({ value: city, label: city })));
    } else {
      setForm({ ...form, [name]: selectedOption });
    }
  };
  

  const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed

  return (
    <form>
      <label>Ad Soyad: <br />
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
      </label>
      <br />
      <label>E-posta: <br />
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>
      <br />
      <label>Telefon numarası: <br />
      <PhoneInput
      country={'tr'}
      value={form.phone}
      onChange={(phone) => handleSelectChange(phone, 'phone')}
      required
      inputStyle={{
        width: isMobile ? '85%' : '90%',          // Full width on mobile
        marginLeft: isMobile ? '35px' : '40px',        // Adjust margin on mobile
        padding: '10px',                            // Padding inside the input
        fontSize: isMobile ? '14px' : '16px',       // Adjust font size on mobile
        borderRadius: '0px',                        // Rounded corners
        border: '1px solid #ccc'                    // Border styling
      }}
      containerStyle={{
        marginLeft: isMobile ? '10px' : '10px',        // Adjust margin on mobile
        width: '100%'                               // Full width of the container
      }}
    />
      </label>
      <br />
      <label>Adres: <br />
        <input type="text" name="address" value={form.address} onChange={handleChange} required />
      </label>
      <br />
      <label>Ülke: <br />
      <Select
      value={form.country}
      options={[{ value: 'Turkey', label: 'Turkey', flag: '🇹🇷' }]}
      onChange={(selectedOption) => handleSelectChange(selectedOption, 'country')}
      isDisabled={true}
      styles={{
        control: (provided) => ({
          ...provided,
          width: '95%',
          marginLeft: '10px',
          borderRadius: '0',
        })
      }}
    />
      </label>
      
      <br />
      <div className='cityProvince'>
      <label>Şehir: <br />
  <Select
    name="province"
    value={form.province}
    placeholder='Şehir seçiniz'
    options={provinces.map(province => ({ value: province, label: province }))}
    onChange={(selectedOption) => handleSelectChange(selectedOption, 'province')}
    styles={{
      control: (provided) => ({
        ...provided,
        width: '310px',               // Set a fixed width for the control
        marginLeft: '10px',
        borderRadius: '0',
        '@media (max-width: 768px)': {
          width: '160px',            // Fixed width on mobile
          marginLeft: '10px',         // Adjust margin on mobile
        },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#007bff' : '#fff',  // Background color of the options
        color: state.isSelected ? '#fff' : '#333',               // Text color of the options
        padding: '10px',                                        // Padding inside the options
        cursor: 'pointer',                                      // Pointer cursor on hover
      }),
      singleValue: (provided) => ({
        ...provided,
        color: '#333',            // Text color of the selected value
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: '0px',
        zIndex: 100,
        width: '380px',           // Fixed width for the dropdown menu
        marginLeft: '10px',
        '@media (max-width: 768px)': {
          width: '160px',         // Fixed width on mobile
          marginLeft: '10px',     // Adjust margin on mobile
        },
      }),
    }}
  />
</label>

      <br />
      <label>İlçe: <br />
  <Select
    name="city"
    value={form.city}
    placeholder='İlçe seçiniz'
    options={cityOptions} // Use the dynamically filtered cities
    onChange={(selectedOption) => handleSelectChange(selectedOption, 'city')}
    styles={{
      control: (provided) => ({
        ...provided,
        width: '285px',               // Set a fixed width for the control
        marginLeft: '10px',
        borderRadius: '0',
        '@media (max-width: 768px)': {
          width: '130px',            // Fixed width on mobile
          marginLeft: '0',           // Remove margin on mobile
        },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#007bff' : '#fff',
        color: state.isSelected ? '#fff' : '#333',
        padding: '10px',
        cursor: 'pointer',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: '#333',
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: '0px',         // Remove rounded corners for the dropdown
        zIndex: 100,
        width: '285px',              // Fixed width for the dropdown menu
        marginLeft: '10px',
        '@media (max-width: 768px)': {
          width: '130px',            // Fixed width on mobile
          marginLeft: '0',           // Remove margin on mobile
        },
      }),
    }}
  />
</label>

      </div>
      <br />
      <label>Posta Kodu: <br />
        <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required />
      </label>
      <label>T.C. Kimlik No: <br />
        <input type="text" name="tckCode" value={form.tckCode} onChange={handleChange} required />
      </label>
    </form>
  );
};

const CheckoutPage = () => {

  useEffect(() => {
    // Fetch information from the API
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/info`);
        if (response.data) {
          setDeliveryCharges(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch information', err);
      }
    };

    fetchInfo();
  }, []);

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    district:'',
    postalCode: '',
    country: { value: 'Turkey', label: 'Turkey', flag: '🇹🇷' },
    paymentMethod: '',
    tckCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityOptions, setCityOptions] = useState([]); // New state to store cities based on selected province
  const [deliveryCharges, setDeliveryCharges] = useState({});


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
    const deliveryCost = cart.length > 0 ? (deliveryCharges.delivery || 0) : 0; // Add delivery charges only if the cart is not empty
    return {
      productCost,
      totalCost: productCost + deliveryCost,
    };
  };
  
  
  const { productCost, totalCost } = calculateTotal();

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2> Adres Bilgileri</h2>
        <CheckoutForm form={form} handleChange={handleChange} setForm={setForm}  cityOptions={cityOptions} setCityOptions={setCityOptions}/>
      </div>
      <div className="order-details">
        <h2>Sipariş Detayları</h2>
        {cart.map((item, index) => (
          <div key={index} className="order-item">
            <img src={item.images[0]} alt={item.name}  className='orderImage'/>
            <div className='orderNSQ'>
            <span>{item.name}</span>
            <span>Boyut : {item.selectedSize}</span>
            <span>{item.quantity} ADET ₺{item.price}</span>
            </div>
          </div>
        ))}
        <hr className="divider" />
        <div className="order-summary">
          <div>
            <span>Ürün Maliyeti:</span>
            <span>₺{productCost.toFixed(2)}</span>
          </div>
          <div>
          <span>Teslimat Ücretleri:</span>
          {deliveryCharges.delivery ? <span>₺{deliveryCharges.delivery}</span> : <span>Loading...</span>}
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
