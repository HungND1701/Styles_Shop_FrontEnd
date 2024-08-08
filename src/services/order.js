import api from './api';

export const getAllOrder = async () => {
  try {
    const response = await api.get(`/order`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteOrderFromAdmin = async (id) => {
  try {
    const response = await api.delete(`/order/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (request) => {
    try {
      const response = await api.post('/order', request);
      return response.data;
    } catch (error) {
      throw error;
    }
};
export const cancelOrder = async (id) => {
  try {
    const request = {};
    const response = await api.post(`/order/cancle/${id}`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const confirmOrder = async (request) => {
  try {
    const response = await api.post('/order/confirm', request);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const nextStatus = async (id) => {
  try {
    const response = await api.post(`/order/next-status/${id}`);
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