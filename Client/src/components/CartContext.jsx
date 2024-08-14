import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Initial state is an empty cart
const initialState = [];

// Reducer function to handle cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { _id, quantity, selectedSize, countInStockForSmall, countInStockForMedium, countInStockForLarge, countInStockForExtraLarge } = action.payload;

      // Determine stock based on selected size
      const stockCount = {
        S: countInStockForSmall,
        M: countInStockForMedium,
        L: countInStockForLarge,
        XL: countInStockForExtraLarge
      }[selectedSize] || 0;

      // Find if there is already a product with the same id and size
      const existingProduct = state.find(item => item._id === _id && item.selectedSize === selectedSize);
      
      if (existingProduct) {
        // Check if the new quantity exceeds stock
        const newQuantity = Math.min(existingProduct.quantity + quantity, stockCount);
        return state.map(item =>
          item._id === _id && item.selectedSize === selectedSize
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      // Add new product to cart with quantity limited by stock
      const initialQuantity = Math.min(quantity, stockCount);
      return [...state, { ...action.payload, quantity: initialQuantity }];
    }

    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload._id || item.selectedSize !== action.payload.selectedSize);

    case 'CLEAR_CART': // New action to clear the cart
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Function to add a product to the cart
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  // Function to remove a product from the cart
  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  // Function to clear the cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
