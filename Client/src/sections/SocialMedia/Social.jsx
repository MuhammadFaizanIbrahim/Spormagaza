import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import './Social.css';

const Social = () => {
  return (
    <div className="fullSocial">
      <div className="socialItem">
        <FaInstagram className="socialIcon" />
        <span className="socialText">@spormagaza.tr</span>
      </div>
    </div>
  );
};

export default Social;
