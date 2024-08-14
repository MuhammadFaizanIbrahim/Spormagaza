import React, { useState } from 'react';
import './FilterOptions.css';

const FilterOptions = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    onFilterChange({ sort: e.target.value, priceRange });
  };

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPriceRange([0, value]);
    onFilterChange({ sort, priceRange: [0, value] });
  };

  return (
    <div className="filter-options">
      <button onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      {showFilters && (
        <div className="filters">
          <div className="filter-item">
            <label>Sort By:</label>
            <select value={sort} onChange={handleSortChange}>
              <option value="">Select</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Price Range: $0 - ${priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={handlePriceRangeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;
