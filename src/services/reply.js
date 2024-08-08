import api from './api';

export const createReply= async (request) => {
    try {
      const response = await api.post('/reply', request);
      return response.data;
    } catch (error) {
      throw error;
    }
};