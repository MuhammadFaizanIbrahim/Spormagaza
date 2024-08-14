import axios from 'axios';
import DOMPurify from 'dompurify';

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(import.meta.env.VITE_SERVER_URL + url);
    // Sanitize the description if it exists
    if (data.description) {
      data.description = DOMPurify.sanitize(data.description);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to be caught in the calling function
  }
};

export const postData = async (url, formData) => {
  try {
    const { data } = await axios.post(import.meta.env.VITE_SERVER_URL + url, formData);
    return data; // Return the data instead of the response object
  } catch (error) {
    console.error('API request error:', error.response ? error.response.data : error.message);
    throw error; // Throw the error to be caught in the calling function
  }
};

export const editData = async (url, updatedData) => {
  try {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const { data } = await axios.put(`${baseUrl}${url}`, updatedData);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const { data } = await axios.delete(`import.meta.env.VITE_SERVER_URL${url}`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async (url) => {
  try {
    const { data } = await axios.get(`import.meta.env.VITE_SERVER_URL${url}`);
    return data;
  } catch (error) {
    console.error('Logout error:', error.response ? error.response.data : error.message);
    throw error; // Throw the error to be caught in the calling function
  }
};

