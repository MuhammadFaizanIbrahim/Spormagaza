import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { postData } from '../../utils/api';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from '../../components/Firebase'; // Adjust the path as needed
import { useDispatch } from 'react-redux';
import {signInSuccess} from '../../redux/user/userSlice'

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    AOS.init({ duration: 1200 });
    AOS.refresh();
    // Check local storage for token on component mount
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set flag based on token presence
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await postData('/api/users/login', formData);
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
        setIsLoggedIn(true); // Update login status
        dispatch(signInSuccess(data));

        if (data.user.isAdmin) {
          navigate('/dashboard'); 
        } else {
          navigate('/'); 
        }
      } else {
        setMessageType('error');
        setMessage(data.message || 'Failed to login.');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('An error occurred during login.');
    }
  };

 const handleGoogleClick = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const result = await signInWithPopup(auth, provider);

    // Prepare the data to be sent
    const formData = {
      name: result.user.displayName,
      email: result.user.email,
      avatar: result.user.photoURL
    };


    const data = await postData('/api/users/google', formData);

    if (data.token) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true); 
      
      dispatch(signInSuccess(data));
      const users = {
        name: data.user?.name,
        email: data.user?.email,
        userId: data.user._id,
      };
      localStorage.setItem('user', JSON.stringify(users)); // Save the user data
      if (data.user && data.user.isAdmin) {
        navigate('/dashboard'); // Redirect to admin dashboard
      } else {
        navigate('/'); // Redirect to homepage
      }
    } else {
      console.error('No token found in API response');
    }
  } catch (error) {
    console.log('Could Not Sign in with Google', error);
  }
};

  return (
    <div className='fullLogin'>
      <div className="login-container" data-aos='fade-up'>
        <h2>Giriş yapmak</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {message && (
            <p className={`login-message ${messageType}`}>
              {message}
            </p>
          )}
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
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
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
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
                className="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="remember-forgot">
              <Link to="/forget-password" className="forgot-password-link"><u>Parolanızı mı unuttunuz?</u></Link>
            </div>
          </div>
          <button type="submit" className="Login-button">Giriş</button>
          <div className="google-login">
            <button className="google-button" onClick={handleGoogleClick} type='button'>
              <FontAwesomeIcon icon={faGoogle} /> &nbsp; Google ile giriş yap
            </button>
          </div>
          <div className="signup-link">
            Hesabınız yok mu? <Link to="/signup" className='goToSignUp'>Üye olmak</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
