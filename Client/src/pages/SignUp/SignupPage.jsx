import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faUser, faPhone, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignupPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { postData } from '../../utils/api';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from '../../components/Firebase'; // Adjust the path as needed
import { signInSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      // Ensure formData does not include googleId or any unintended fields
      const { ...signupData } = formData;
      const data = await postData('/api/users/register', signupData);
      if (data) {
        setMessageType('success');
        setMessage('User Signed In Successfully.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessageType('error');
        setMessage('Failed to register.');
      }
    } catch (err) {
      setMessageType('error');
      setMessage('An error occurred during registration.');
    }
  };
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

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
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.error('No token found in API response');
      }
    } catch (error) {
      console.log('Could Not Sign in with Google', error);
    }
  };

  return (
    <div className='fullSignup'>
      <div className="signup-container" data-aos='fade-up'>
        <h2>Üye olmak</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          {message && (
            <p className={`signup-message ${messageType}`}>
              {message}
            </p>
          )}
          <div className="signupForm-group">
            <div className="signupInput-container">
              <FontAwesomeIcon icon={faEnvelope} className="signupInput-icon" />
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
          <div className="signupForm-group">
            <div className="signupInput-container">
              <FontAwesomeIcon icon={faUser} className="signupInput-icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="signupForm-group">
            <div className="signupInput-container">
              <FontAwesomeIcon icon={faPhone} className="signupInput-icon" />
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Telefon numarası"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="signupForm-group">
            <div className="signupInput-container">
              <FontAwesomeIcon icon={faLock} className="signupInput-icon" />
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
                className="signup-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <button type="submit" className="Signup-button">Üye olmak</button>
          <div className="signupGoogle-login">
            <button className="signupGoogle-button" onClick={handleGoogleClick} type='button'>
              <FontAwesomeIcon icon={faGoogle} /> &nbsp; Google'a Kaydolun
            </button>
          </div>
          <div className="login-link">
            Zaten hesabınız var mı? <Link to="/login" className='goToLogin'>Giriş yapmak</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
