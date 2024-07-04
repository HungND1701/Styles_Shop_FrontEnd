import api from './api';

export const getSizesByProductTypeId = async (product_type_id) => {
    try {
      const response = await api.get(`/sizes/${product_type_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const createSize = async (sizeData) => {
    try {
      const response = await api.post('/size', sizeData);
      return response.data;
    } catch (error) {
      throw error;
    }
};