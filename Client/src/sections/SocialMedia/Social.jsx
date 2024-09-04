import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import './Social.css';

const Social = () => {
  return (
    <div className="fullSocial">
      <a href="https://www.instagram.com/spormagaza.tr?igsh=MXQwbXVvYzYwYWNwYw==" target="_blank" rel="noopener noreferrer" className="socialItem">
        <FaInstagram className="socialIcon" />
        <span className="socialText">@spormagazatr</span>
      </a>
    </div>
  );
};

export default Social;
