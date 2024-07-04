import api from './api';

export const getTags = async () => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const createTag = async (tagData) => {
    try {
      const response = await api.post('/tag', tagData);
      return response.data;
    } catch (error) {
      throw error;
    }
};