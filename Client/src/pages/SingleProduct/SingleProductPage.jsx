import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SingleProductPage.css';
import { fetchDataFromApi } from '../../utils/api';
import MoreProducts from '../../sections/MoreProducts/MoreProducts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useCart } from '../../components/CartContext';

const SingleProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('S'); // Default size
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProduct(res);
      setSelectedImage(res.images[0]);
    });

    AOS.init({ duration: 1200 });
    AOS.refresh();

    window.scrollTo(0, 0);
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // const handleBigImageClick = () => {
  //   setZoomedImage(selectedImage);
  //   setShowZoomedImage(true);
  // };

  const handleCloseZoom = () => {
    setShowZoomedImage(false);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < getStockCount(selectedSize)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
  
    if (user && token) {
      addToCart({ ...product, quantity, selectedSize });
    } else {
      alert('Sepetinize ürün eklemek için lütfen giriş yapın.');
      navigate('/login');
    }
  };

  const handleBuyNow = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
  
    if (user && token) {
      addToCart({ ...product, quantity, selectedSize });
      navigate('/checkout');
    } else {
      alert('Sepetinize ürün eklemek için lütfen giriş yapın.');
      navigate('/login');
    }
  };

  const handleSizeSelect = (size) => {
    if (['S', 'M', 'L', 'XL'].includes(size)) {
      setSelectedSize(size);
    }
  };

  const getStockCount = (size) => {
    if (!product) return 0; // If product is null, return 0
    switch (size) {
      case 'S':
        return product.countInStockForSmall || 0;
      case 'M':
        return product.countInStockForMedium || 0;
      case 'L':
        return product.countInStockForLarge || 0;
      case 'XL':
        return product.countInStockForExtraLarge || 0;
      default:
        return 0;
    }
  };

  const isOutOfStock = getStockCount(selectedSize) === 0;
  const isMaxQuantity = quantity >= getStockCount(selectedSize);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page">
      <div className="product-container2" data-aos='fade-up'>
        <div className="product-container">
          <div className="image-section">
            <div className="big-image-container">
              <img src={selectedImage} alt={product.name} className="big-image" />
            </div>
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div key={index} className="thumbnail" onClick={() => handleImageClick(image)}>
                  <img src={image} alt={`Thumbnail ${index}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="product-details">
            <div className="productTitleAndPrice">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-stock">{isOutOfStock ? 'Stoklar Tükendi' : 'Stokta var'}</p>
              <p className="product-price">₺{product.price}</p>
            </div>
            <div className="productButtons">
              <div className="sizeSelector">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <div
                    key={size}
                    className={`size-box ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
              <div className={`quantity-selector ${isOutOfStock ? 'disabled-quantity-btn' : ''}`} disabled={isOutOfStock}>
                <button
                  className={`quantity-button ${isOutOfStock ? 'disabled-quantity-btn' : ''}`}
                  onClick={handleDecreaseQuantity}
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className={`quantity-button ${isOutOfStock || isMaxQuantity ? 'disabled-quantity-btn' : ''}`}
                  onClick={handleIncreaseQuantity}
                  disabled={isOutOfStock || isMaxQuantity}
                >
                  +
                </button>
              </div>
              <button
                className={`btn add-to-cart ${isOutOfStock ? 'disabled-btn' : ''}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                Sepete ekle
              </button>
              <button
                className={`btn buy-now ${isOutOfStock ? 'disabled-btn' : ''}`}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Şimdi al
              </button>
            </div>
          </div>
        </div>
        <div className="productDescriptionDiv">
          <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
      <div className="more-products-container">
        <MoreProducts />
      </div>
      {showZoomedImage && (
        <div className="zoomed-image-overlay" onClick={handleCloseZoom}>
          <img src={zoomedImage} alt="Zoomed" className="zoomed-image" />
        </div>
      )}
    </div>
  );
};

export default SingleProductPage;
