import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductsPage.css';
import { FaFilter } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchDataFromApi, postData, editData } from '../../utils/api';

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    category: '',
    alphabetical: '',
    price: '',
    priceRange: [0, 0],
  });
  const [productsToDisplay, setProductsToDisplay] = useState(9); // Number of products to display initially
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    AOS.init({ duration: 1200 });
    AOS.refresh();

    fetchDataFromApi("/api/products").then((res) => {
      setAllProducts(res);
      const minPrice = getMinPrice(res);
      const maxPrice = getMaxPrice(res);
      setFilterOptions((prev) => ({ ...prev, priceRange: [minPrice, maxPrice] }));
      updateDisplayedProducts(res, 9); // Set initial display to 9 products
    });

    fetchDataFromApi("/api/category").then((res) => {
      setAllCategory(res);
    });
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    if (category) {
      setFilterOptions((prev) => ({ ...prev, category }));
    }
  }, [location.search]);

  const categories = [...new Set(allProducts.map(product => product.category?.name))].filter(Boolean);

  const getMaxPrice = (products) => Math.max(...products.map(product => product.price));
  const getMinPrice = (products) => Math.min(...products.map(product => product.price));

  const handleLoadMore = () => {
    setProductsToDisplay((prev) => {
      const newDisplayCount = prev + 3; // Add 3 more products
      return newDisplayCount;
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    });
  };

  const handlePriceRangeChange = (e) => {
    setFilterOptions({
      ...filterOptions,
      priceRange: [filterOptions.priceRange[0], Number(e.target.value)],
    });
  };

  const filterAndSortProducts = (products) => {
    let filteredProducts = products;
    if (filterOptions.category) {
      filteredProducts = filteredProducts.filter(product => product.category?.name === filterOptions.category);
    }
    if (filterOptions.priceRange) {
      filteredProducts = filteredProducts.filter(product => product.price >= filterOptions.priceRange[0] && product.price <= filterOptions.priceRange[1]);
    }
    if (filterOptions.alphabetical === 'asc') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filterOptions.alphabetical === 'desc') {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (filterOptions.price === 'low-to-high') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filterOptions.price === 'high-to-low') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
    return filteredProducts;
  };

  const updateDisplayedProducts = (products, displayCount) => {
    const filteredAndSortedProducts = filterAndSortProducts(products);
    const productsToShow = filteredAndSortedProducts.slice(0, displayCount);
    setDisplayedProducts(productsToShow);
    setShowLoadMore(filteredAndSortedProducts.length > displayCount);
  };

  useEffect(() => {
    updateDisplayedProducts(allProducts, productsToDisplay);
  }, [filterOptions, allProducts, productsToDisplay]);

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-page" data-aos='fade-up'>
      <h2>Bizim ürünlerimiz</h2>
      {/* Category Filter */}
      <div className="category-filter">
        <label>Kategori: </label>
        <select name="category" onChange={handleFilterChange} value={filterOptions.category}>
          <option value="">Tüm</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <button className="filter-button" onClick={toggleFilters}>
        <FaFilter /> &nbsp; Filtre
      </button>

      {showFilters && (
        <div className="filter-options">
          <div className="filters">
            <div className="filter-item">
              <label>Alfabetik: </label>
              <select name="alphabetical" onChange={handleFilterChange} value={filterOptions.alphabetical}>
                <option value="">Seçin</option>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Fiyat: </label>
              <select name="price" onChange={handleFilterChange} value={filterOptions.price}>
                <option value="">Seçin</option>
                <option value="low-to-high">Düşükten Yükseğe</option>
                <option value="high-to-low">Yüksekten Düşüğe</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Fiyat aralığı: </label>
              <input
                type="range"
                name="priceRange"
                min={getMinPrice(allProducts)}
                max={getMaxPrice(allProducts)}
                value={filterOptions.priceRange[1]}
                onChange={handlePriceRangeChange}
              />
              <span className='priceRangeLabel'>₺{filterOptions.priceRange[0]} ile ₺{filterOptions.priceRange[1]}</span>
            </div>
          </div>
        </div>
      )}

      <div className="products-grid">
        {displayedProducts.map((item) => (
          <div key={item._id} className="product-card" onClick={() => handleCardClick(item._id)}>
            <img src={item.images[0]} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">₺{item.price}</p>
          </div>
        ))}
      </div>

      {showLoadMore && (
        <button className="load-more" onClick={handleLoadMore}>Daha Fazla Yükle</button>
      )}
    </div>
  );
};

export default ProductsPage;
