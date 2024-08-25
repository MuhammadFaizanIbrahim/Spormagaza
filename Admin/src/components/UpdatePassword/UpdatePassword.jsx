// UpdatePassword.js
import React, { useState } from 'react';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './UpdatePassword.css';

function UpdatePassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Şifreler eşleşmiyor.');
      return;
    }

    try {
      await postData('/api/users/update-password', { email, newPassword });
      setMessage('Şifre başarıyla güncellendi.');
      navigate('/login'); // Redirect to admin dashboard
    } catch (error) {
      setMessage('Şifre güncellenemedi.');
    }
  };

  return (
    <div className='dashboardUpdatePass-fullUpdatePassword'>
    <div className='dashboardUpdatePassupdate-password-container'>
      <h2>Şifreyi Güncelle</h2>
      <form className="dashboardUpdatePassupdate-password-form" onSubmit={handleSubmit}>
        {message && (
          <p className={`dashboardUpdatePassupdate-password-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <div className="dashboardUpdatePassform-group">
          <div className="dashboardUpdatePassinput-container">
            <FontAwesomeIcon icon={faEnvelope} className="dashboardUpdatePassinput-icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-Posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="dashboardUpdatePassform-group">
          <div className="dashboardUpdatePassinput-container">
            <FontAwesomeIcon icon={faLock} className="dashboardUpdatePassinput-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="dashboardUpdatePasspassword-toggle"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <div className="dashboardUpdatePassform-group">
          <div className="dashboardUpdatePassinput-container">
            <FontAwesomeIcon icon={faLock} className="dashboardUpdatePassinput-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Yeni Şifreyi Onayla"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="dashboardUpdatePasspassword-toggle"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <button type="submit" className="dashboardUpdatePassupdate-button">Şifreyi Güncelle</button>
      </form>
    </div>
    </div>
  );
}

export default UpdatePassword;
