import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { postData } from '../../utils/api';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';
import axios from 'axios';


function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Use location

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    AOS.init({ duration: 1200 });
    AOS.refresh();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/login`, formData);
  
      if (response && response.data) {
        const data = response.data;
  
        console.log('Login response data:', data);
  
        const users = {
          name: data.user?.name,
          email: data.user?.email,
          userId: data.user?._id,
        };
  
        if (data.token) {
          localStorage.setItem('token', data.token); 
          localStorage.setItem('user', JSON.stringify(users)); 
          setMessageType('success');
          setMessage('Login successful.');
          setIsLoggedIn(true);
          dispatch(signInSuccess(data));
  
          console.log('User isAdmin:', data.user.isAdmin);
  
          if (data.user.isAdmin) {
            console.log('Navigating to dashboard...');
            navigate('/', { replace: true });
          } else {
            setMessageType('error');
            setMessage('User is not Admin');
          }
        } else {
          setMessageType('error');
          setMessage(data.message || 'Failed to login to Admin Dashboard.');
        }
      } else {
        setMessageType('error');
        setMessage('Login failed: No data received from server.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessageType('error');
      setMessage('An error occurred during login.');
    }
};

  
  

  return (
    <div className='dashboard-fullLogin'>
      <div className="dashboard-login-container" data-aos='fade-up'>
        <h2>Giriş yapmak</h2>
        <form className="dashboard-login-form" onSubmit={handleSubmit}>
          {message && (
            <p className={`dashboard-login-message ${messageType}`}>
              {message}
            </p>
          )}
          <div className="dashboard-form-group">
            <div className="dashboard-input-container">
              <FontAwesomeIcon icon={faEnvelope} className="dashboard-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="dashboard-form-group">
            <div className="dashboard-input-container">
              <FontAwesomeIcon icon={faLock} className="dashboard-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="dashboard-login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="dashboard-form-group">
            <div className="dashboard-remember-forgot">
              <Link to="/forget-password" className="dashboard-forgot-password-link"><u>Şifre değiştir</u></Link>
            </div>
          </div>
          <button type="submit" className="dashboard-Login-button">Giriş</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
