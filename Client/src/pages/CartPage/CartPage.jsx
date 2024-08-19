import React, { useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import { FaTrash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [location]);


  const totalSum = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const handleCheckout = () => {

    // const user = localStorage.getItem('user');
    // const token = localStorage.getItem('token');
  
    navigate('/checkout');
    // if (user && token) {
    // } else {
    //   // Optionally, redirect to login page or show an alert
    //   alert('Please log in to proceed to Checkout Page.');
    //   navigate('/login'); // Redirect to login page
    // }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Sepet Ürünleri</h2>
      {cart.length === 0 ? (
        <p className="no-products">Sepette Ürün Yok</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Ürün resmi</th>
              <th>ürün başlığı</th>
              <th>Boyut</th>
              <th>Miktar</th>
              <th>Toplam fiyat</th>
              <th>Hareketler</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img src={product.images[0]} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>{product.selectedSize}</td>
                <td>{product.quantity}</td>
                <td>₺{(product.price * product.quantity).toFixed(2)}</td>
                <td>
                  <FaTrash
                    className="cart-trash-icon"
                    onClick={() => removeFromCart(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>Toplam:</td>
              <td>₺{totalSum.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}
      {cart.length === 0 ? (
      <button className="checkout-button-disabled" disabled onClick={handleCheckout}>
        Çıkışa doğru devam et
      </button>
      ) : (
      <button className="checkout-button" onClick={handleCheckout}>
        Çıkışa doğru devam et
      </button>
      )}
    </div>
  );
};

export default CartPage;
