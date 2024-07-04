import api from './api';

export const getColors = async () => {
    try {
      const response = await api.get('/colors');
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const createColor = async (colorData) => {
    try {
      const response = await api.post('/color', colorData);
      return response.data;
    } catch (error) {
      throw error;
    }
};