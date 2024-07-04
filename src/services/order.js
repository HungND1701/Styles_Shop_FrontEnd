import api from './api';

export const createOrder = async (request) => {
    try {
      const response = await api.post('/order', request);
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderByUserId = async () => {
  try {
    const response = await api.get(`/order/get_all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};