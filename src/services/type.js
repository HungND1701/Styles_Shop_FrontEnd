import api from './api';

export const getTypes = async () => {
    try {
      const response = await api.get('/products-types');
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const createType = async (typeData) => {
    try {
      const response = await api.post('/products-type', typeData);
      return response.data;
    } catch (error) {
      throw error;
    }
};