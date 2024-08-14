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
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await postData('/api/users/update-password', { email, newPassword });
      setMessage('Password updated successfully.');
      navigate('/login'); // Redirect to admin dashboard
    } catch (error) {
      setMessage('Failed to update password.');
    }
  };

  return (
    <div className='fullUpdatePassword'>
    <div className='update-password-container'>
      <h2>Update Password</h2>
      <form className="update-password-form" onSubmit={handleSubmit}>
        {message && (
          <p className={`update-password-message ${message.includes('successfully') ? 'success' : 'error'}`}>
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <button type="submit" className="update-button">Update Password</button>
      </form>
    </div>
    </div>
  );
}

export default UpdatePassword;
