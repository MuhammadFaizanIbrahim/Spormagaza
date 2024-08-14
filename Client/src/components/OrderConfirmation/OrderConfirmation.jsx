import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Ensure you have axios imported
import './OrderConfirmation.css'; // Import the CSS file for styling

const OrderConfirmation = () => {
  const [info, setInfo] = useState(null);
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Fetch existing information if available
    const fetchInfo = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/info');
        if (response.data) {
          setInfo(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch information', err);
      }
    };

    fetchInfo();
  }, []);

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="confirmation-container">
      <h1>Siparişiniz Başarıyla Eklendi</h1>
      <p>Sipariş Numaranız:  <b>{order?.orderNumber}</b></p>
      <p>Alışveriş Için Teşekkürler!</p>
      <p>
        Sipariş onayı için ödemeyi <b>{info?.ibanNumber || 'IBAN number not available'}</b> IBAN numarasına EFT Havalesi ile <br/>
        ve Ödeme Dekontunu <b>{info?.phoneNumber2 || 'Phone number not available'}</b> numaralı Whatsapp'a gönderiniz. <b>{order?.orderNumber}</b> sipariş numaranız ile
      </p>
    </div>
  );
};

export default OrderConfirmation;
