import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

// Fetch count of sales
export const fetchSalesCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales/count`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching sales count:', error);
    throw error;
  }
};

// Fetch all sales
export const fetchAllSales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all sales:', error);
    throw error;
  }
};

// Fetch count of orders
export const fetchOrdersCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/count`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching orders count:', error);
    throw error;
  }
};

// Fetch all orders
export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// Fetch count of users
export const fetchUsersCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/count`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching users count:', error);
    throw error;
  }
};

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};
